
using CareDocs.Api.Data;
using CareDocs.Api.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareDocs.Api.Controllers;

[ApiController]
[Route("api/documents")]
public class DocumentFilesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    private const long MaxFileSize = 10 * 1024 * 1024;

    private static readonly HashSet<string> AllowedExtensions =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ".pdf", ".docx", ".xlsx"
        };

    public DocumentFilesController(
        ApplicationDbContext context,
        IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    // POST: api/documents/1/upload
    [HttpPost("{id:int}/upload")]
    public async Task<IActionResult> Upload(
        int id,
        IFormFile file)
    {
        var document = await _context.Documents
            .FirstOrDefaultAsync(d => d.Id == id);

        if (document == null)
            return NotFound(new { message = "Document not found." });

        if (document.Status != DocumentStatus.Draft &&
            document.Status != DocumentStatus.Rejected)
        {
            return BadRequest(new
            {
                message = "Files can only be uploaded to draft or rejected documents."
            });
        }

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Please select a file." });

        if (file.Length > MaxFileSize)
            return BadRequest(new { message = "Maximum file size is 10 MB." });

        var extension = Path.GetExtension(file.FileName);

        if (!AllowedExtensions.Contains(extension))
            return BadRequest(new { message = "Unsupported file type." });

        var uploadDirectory = Path.Combine(
            _environment.ContentRootPath,
            "App_Data",
            "uploads"
        );

        Directory.CreateDirectory(uploadDirectory);

        var storedFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadDirectory, storedFileName);

        await using (var stream = new FileStream(
            filePath,
            FileMode.CreateNew))
        {
            await file.CopyToAsync(stream);
        }

        // Remove the previous file after saving the replacement.
        var previousFilePath = document.FilePath;

        document.FileName = Path.GetFileName(file.FileName);
        document.FilePath = storedFileName;
        document.ContentType = file.ContentType;
        document.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        if (!string.IsNullOrEmpty(previousFilePath))
        {
            var oldPath = Path.Combine(
                uploadDirectory,
                Path.GetFileName(previousFilePath)
            );

            if (System.IO.File.Exists(oldPath))
                System.IO.File.Delete(oldPath);
        }

        return Ok(new
        {
            message = "File uploaded successfully.",
            document.Id,
            document.FileName
        });
    }

    // GET: api/documents/1/file
    [HttpGet("{id:int}/file")]
    public async Task<IActionResult> Download(int id)
    {
        var document = await _context.Documents
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id);

        if (document == null)
            return NotFound();

        if (string.IsNullOrEmpty(document.FilePath))
            return NotFound(new { message = "No file attached." });

        var uploadDirectory = Path.Combine(
            _environment.ContentRootPath,
            "App_Data",
            "uploads"
        );

        var filePath = Path.Combine(
            uploadDirectory,
            Path.GetFileName(document.FilePath)
        );

        if (!System.IO.File.Exists(filePath))
            return NotFound();

        var contentType = string.IsNullOrWhiteSpace(document.ContentType)
            ? "application/octet-stream"
            : document.ContentType;

        var stream = System.IO.File.OpenRead(filePath);

        return File(
            stream,
            contentType,
            document.FileName ?? "document"
        );
    }
}
