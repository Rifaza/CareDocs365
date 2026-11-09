using System.ComponentModel.DataAnnotations;

namespace CareDocs.Api.DTOs.Approvals;

public class ApprovalActionDto
{
    [Range(1, int.MaxValue)]
    public int ApproverId { get; set; }

    [StringLength(500)]
    public string? Comments { get; set; }
}