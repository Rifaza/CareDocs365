
using CareDocs.Api.Models.Enums;

namespace CareDocs.Api.DTOs.Documents;

public class DocumentResponseDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string DepartmentName { get; set; } = string.Empty;

    public string CreatedByName { get; set; } = string.Empty;

    public DocumentStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
}
