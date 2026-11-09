
using CareDocs.Api.Data;
using CareDocs.Api.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareDocs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var totalDocuments = await _context.Documents.CountAsync();

        var draftDocuments = await _context.Documents
            .CountAsync(d => d.Status == DocumentStatus.Draft);

        var pendingDocuments = await _context.Documents
            .CountAsync(d => d.Status == DocumentStatus.PendingApproval);

        var approvedDocuments = await _context.Documents
            .CountAsync(d => d.Status == DocumentStatus.Approved);

        var rejectedDocuments = await _context.Documents
            .CountAsync(d => d.Status == DocumentStatus.Rejected);

        return Ok(new
        {
            TotalDocuments = totalDocuments,
            DraftDocuments = draftDocuments,
            PendingDocuments = pendingDocuments,
            ApprovedDocuments = approvedDocuments,
            RejectedDocuments = rejectedDocuments
        });
    }
}
