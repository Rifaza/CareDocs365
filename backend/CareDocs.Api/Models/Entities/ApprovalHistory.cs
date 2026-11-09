
namespace CareDocs.Api.Models.Entities;

public class ApprovalHistory
{
    public int Id { get; set; }

    public int ApprovalId { get; set; }

    public Approval Approval { get; set; } = null!;

    public int ActionById { get; set; }

    public Employee ActionBy { get; set; } = null!;

    public string Action { get; set; } = string.Empty;

    public string? Comments { get; set; }

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;
}
