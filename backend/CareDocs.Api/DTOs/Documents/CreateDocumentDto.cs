
using System.ComponentModel.DataAnnotations;

namespace CareDocs.Api.DTOs.Documents;

public class CreateDocumentDto
{
    [Required]
    [StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; set; }

    [Required]
    public int DepartmentId { get; set; }

    [Required]
    public int CreatedById { get; set; }
}
