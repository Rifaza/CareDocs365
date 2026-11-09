
using CareDocs.Api.Data;
using CareDocs.Api.DTOs.Documents;
using CareDocs.Api.Models.Entities;
using CareDocs.Api.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareDocs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DocumentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    //// GET: api/documents
    //[HttpGet]
    //public async Task<IActionResult> GetAll()
    //{
    //    var documents = await _context.Documents
    //        .AsNoTracking()
    //        .Include(d => d.Department)
    //        .Include(d => d.CreatedBy)
    //        .OrderByDescending(d => d.CreatedAt)
    //        .Select(d => new DocumentResponseDto
    //        {
    //            Id = d.Id,
    //            Title = d.Title,
    //            Category = d.Category,
    //            Description = d.Description,
    //            DepartmentName = d.Department.Name,
    //            CreatedByName = d.CreatedBy.FullName,
    //            Status = d.Status,
    //            CreatedAt = d.CreatedAt
    //        })
    //        .ToListAsync();

    //    return Ok(documents);
    //}

    // GET /api/documents?search=Patient&departmentId=1&status=2&page=1&pageSize=10 -> included search
    [HttpGet]
    public async Task<IActionResult> GetAll(
        string? search,
        string? category,
        int? departmentId,
        DocumentStatus? status,
        int page = 1,
        int pageSize = 10)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Documents
            .AsNoTracking()
            .Include(d => d.Department)
            .Include(d => d.CreatedBy)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(d =>
                d.Title.Contains(search) ||
                d.Category.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(d => d.Category == category);
        }

        if (departmentId.HasValue)
        {
            query = query.Where(d =>
                d.DepartmentId == departmentId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(d => d.Status == status.Value);
        }

        var totalRecords = await query.CountAsync();

        var documents = await query
            .OrderByDescending(d => d.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(d => new DocumentResponseDto
            {
                Id = d.Id,
                Title = d.Title,
                Category = d.Category,
                Description = d.Description,
                DepartmentName = d.Department.Name,
                CreatedByName = d.CreatedBy.FullName,
                Status = d.Status,
                CreatedAt = d.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            TotalRecords = totalRecords,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(
                totalRecords / (double)pageSize
            ),
            Data = documents
        });
    }

    // GET: api/documents/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var document = await _context.Documents
            .AsNoTracking()
            .Include(d => d.Department)
            .Include(d => d.CreatedBy)
            .Where(d => d.Id == id)
            .Select(d => new DocumentResponseDto
            {
                Id = d.Id,
                Title = d.Title,
                Category = d.Category,
                Description = d.Description,
                DepartmentName = d.Department.Name,
                CreatedByName = d.CreatedBy.FullName,
                Status = d.Status,
                CreatedAt = d.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (document == null)
            return NotFound(new { message = "Document not found." });

        return Ok(document);
    }

    // POST: api/documents
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateDocumentDto dto)
    {
        var departmentExists = await _context.Departments
            .AnyAsync(d => d.Id == dto.DepartmentId);

        if (!departmentExists)
            return BadRequest(new { message = "Invalid department." });

        var employeeExists = await _context.Employees
            .AnyAsync(e => e.Id == dto.CreatedById);

        if (!employeeExists)
            return BadRequest(new { message = "Invalid employee." });

        var document = new Document
        {
            Title = dto.Title,
            Category = dto.Category,
            Description = dto.Description,
            DepartmentId = dto.DepartmentId,
            CreatedById = dto.CreatedById,
            Status = DocumentStatus.Draft,
            CreatedAt = DateTime.UtcNow
        };

        _context.Documents.Add(document);

        await _context.SaveChangesAsync();

        var audit = new AuditLog
        {
            UserId = dto.CreatedById,
            Action = "Document Created",
            EntityName = "Document",
            EntityId = document.Id,
            Details = $"Created document: {document.Title}"
        };

        _context.AuditLogs.Add(audit);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = document.Id },
            new
            {
                document.Id,
                document.Title,
                document.Status
            });
    }

    // PUT: api/documents/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateDocumentDto dto)
    {
        var document = await _context.Documents
            .FirstOrDefaultAsync(d => d.Id == id);

        if (document == null)
            return NotFound();

        if (document.Status != DocumentStatus.Draft &&
            document.Status != DocumentStatus.Rejected)
        {
            return BadRequest(new
            {
                message = "Only draft or rejected documents can be edited."
            });
        }

        var departmentExists = await _context.Departments
            .AnyAsync(d => d.Id == dto.DepartmentId);

        if (!departmentExists)
            return BadRequest(new { message = "Invalid department." });

        document.Title = dto.Title;
        document.Category = dto.Category;
        document.Description = dto.Description;
        document.DepartmentId = dto.DepartmentId;
        document.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/documents/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var document = await _context.Documents
            .FirstOrDefaultAsync(d => d.Id == id);

        if (document == null)
            return NotFound();

        if (document.Status != DocumentStatus.Draft)
        {
            return BadRequest(new
            {
                message = "Only draft documents can be deleted."
            });
        }

        _context.Documents.Remove(document);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
