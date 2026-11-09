
using CareDocs.Api.Data;
using CareDocs.Api.DTOs.Approvals;
using CareDocs.Api.Models.Entities;
using CareDocs.Api.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareDocs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApprovalsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ApprovalsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/approvals/submit/1
    [HttpPost("submit/{documentId:int}")]
    public async Task<IActionResult> SubmitForApproval(
        int documentId,
        [FromBody] ApprovalActionDto dto)
    {
        var document = await _context.Documents
            .FirstOrDefaultAsync(d => d.Id == documentId);

        if (document == null)
        {
            return NotFound(new
            {
                message = "Document not found."
            });
        }

        if (document.Status != DocumentStatus.Draft &&
            document.Status != DocumentStatus.Rejected)
        {
            return BadRequest(new
            {
                message = "Document cannot be submitted in its current status."
            });
        }

        var approver = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == dto.ApproverId);

        if (approver == null || approver.Role != "Manager")
        {
            return BadRequest(new
            {
                message = "A valid manager must be assigned."
            });
        }

        var approval = new Approval
        {
            DocumentId = documentId,
            ApproverId = dto.ApproverId,
            Status = ApprovalStatus.Pending,
            RequestedAt = DateTime.UtcNow
        };

        document.Status = DocumentStatus.PendingApproval;
        document.UpdatedAt = DateTime.UtcNow;

        _context.Approvals.Add(approval);

        // Record approval history
        _context.ApprovalHistories.Add(new ApprovalHistory
        {
            Approval = approval,
            ActionById = document.CreatedById,
            Action = "Submitted",
            Comments = dto.Comments,
            CreatedAt = DateTime.UtcNow
        });

        // Record audit log
        _context.AuditLogs.Add(new AuditLog
        {
            UserId = document.CreatedById,
            Action = "Document Submitted",
            EntityName = "Document",
            EntityId = documentId,
            Details = $"Document '{document.Title}' submitted for approval."
        });

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Document submitted for approval.",
            approval.Id,
            ApprovalStatus = approval.Status,
            DocumentStatus = document.Status
        });
    }

    // POST: api/approvals/1/approve
    [HttpPost("{approvalId:int}/approve")]
    public Task<IActionResult> Approve(
        int approvalId,
        [FromBody] ApprovalActionDto dto)
    {
        return ProcessApproval(
            approvalId,
            dto,
            ApprovalStatus.Approved,
            DocumentStatus.Approved);
    }

    // POST: api/approvals/1/reject
    [HttpPost("{approvalId:int}/reject")]
    public Task<IActionResult> Reject(
        int approvalId,
        [FromBody] ApprovalActionDto dto)
    {
        return ProcessApproval(
            approvalId,
            dto,
            ApprovalStatus.Rejected,
            DocumentStatus.Rejected);
    }

    // Process approval or rejection
    private async Task<IActionResult> ProcessApproval(
        int approvalId,
        ApprovalActionDto dto,
        ApprovalStatus approvalStatus,
        DocumentStatus documentStatus)
    {
        var approval = await _context.Approvals
            .Include(a => a.Document)
            .FirstOrDefaultAsync(a => a.Id == approvalId);

        if (approval == null)
        {
            return NotFound(new
            {
                message = "Approval not found."
            });
        }

        if (approval.Status != ApprovalStatus.Pending)
        {
            return BadRequest(new
            {
                message = "This approval has already been processed."
            });
        }

        if (approval.Document.Status != DocumentStatus.PendingApproval)
        {
            return BadRequest(new
            {
                message = "The document is not awaiting approval."
            });
        }

        if (approval.ApproverId != dto.ApproverId)
        {
            return Forbid();
        }

        var now = DateTime.UtcNow;

        approval.Status = approvalStatus;
        approval.ReviewedAt = now;

        approval.Document.Status = documentStatus;
        approval.Document.UpdatedAt = now;

        // Record approval history
        _context.ApprovalHistories.Add(new ApprovalHistory
        {
            ApprovalId = approval.Id,
            ActionById = dto.ApproverId,
            Action = approvalStatus.ToString(),
            Comments = dto.Comments,
            CreatedAt = now
        });

        // Record audit log
        _context.AuditLogs.Add(new AuditLog
        {
            UserId = dto.ApproverId,
            Action = $"Document {approvalStatus}",
            EntityName = "Document",
            EntityId = approval.DocumentId,
            Details = $"Document '{approval.Document.Title}' {approvalStatus.ToString().ToLowerInvariant()}."
        });

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Document {approvalStatus} successfully.",
            approval.Id,
            approval.Status,
            DocumentStatus = approval.Document.Status,
            approval.ReviewedAt
        });
    }

    // GET: api/approvals/pending
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingApprovals()
    {
        var approvals = await _context.Approvals
            .AsNoTracking()
            .Where(a => a.Status == ApprovalStatus.Pending)
            .Select(a => new
            {
                a.Id,
                DocumentId = a.DocumentId,
                DocumentTitle = a.Document.Title,
                DepartmentName = a.Document.Department.Name,
                ApproverId = a.ApproverId,
                ApproverName = a.Approver.FullName,
                a.RequestedAt,
                a.Status
            })
            .OrderByDescending(a => a.RequestedAt)
            .ToListAsync();

        return Ok(approvals);
    }
}
