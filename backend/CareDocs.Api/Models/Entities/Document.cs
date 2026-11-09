
using CareDocs.Api.Models.Enums;

namespace CareDocs.Api.Models.Entities;

public class Document
{
	public int Id { get; set; }

	public string Title { get; set; } = string.Empty;

	public string Category { get; set; } = string.Empty;

	public string? Description { get; set; }

	public string? FileName { get; set; }

	public string? FilePath { get; set; }

	public string? ContentType { get; set; }

	public DocumentStatus Status { get; set; }
		= DocumentStatus.Draft;

	public int DepartmentId { get; set; }

	public Department Department { get; set; } = null!;

	public int CreatedById { get; set; }

	public Employee CreatedBy { get; set; } = null!;

	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

	public DateTime? UpdatedAt { get; set; }

	public ICollection<Approval> Approvals { get; set; }
		= new List<Approval>();
}
