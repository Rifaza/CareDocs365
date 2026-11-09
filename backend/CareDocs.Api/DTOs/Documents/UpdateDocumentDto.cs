
using System.ComponentModel.DataAnnotations;

namespace CareDocs.Api.DTOs.Documents;

public class UpdateDocumentDto
{
    [Required]
    [StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public int DepartmentId { get; set; }
}
