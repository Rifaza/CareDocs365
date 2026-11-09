
using CareDocs.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareDocs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditLogsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuditLogsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/auditlogs
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var logs = await _context.AuditLogs
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new
            {
                a.Id,
                a.UserId,
                a.Action,
                a.EntityName,
                a.EntityId,
                a.Details,
                a.CreatedAt
            })
            .ToListAsync();

        return Ok(logs);
    }

    // GET: api/auditlogs/document/1
    [HttpGet("document/{documentId:int}")]
    public async Task<IActionResult> GetByDocument(int documentId)
    {
        var logs = await _context.AuditLogs
            .AsNoTracking()
            .Where(a =>
                a.EntityName == "Document" &&
                a.EntityId == documentId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return Ok(logs);
    }
}
