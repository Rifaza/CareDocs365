
using CareDocs.Api.Models.Enums;

namespace CareDocs.Api.Models.Entities;

public class Approval
{
    public int Id { get; set; }

    public int DocumentId { get; set; }

    public Document Document { get; set; } = null!;

    public int ApproverId { get; set; }

    public Employee Approver { get; set; } = null!;

    public ApprovalStatus Status { get; set; }
        = ApprovalStatus.Pending;

    public DateTime RequestedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime? ReviewedAt { get; set; }

    public ICollection<ApprovalHistory> History { get; set; }
        = new List<ApprovalHistory>();
}
