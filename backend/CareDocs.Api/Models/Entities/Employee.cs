
namespace CareDocs.Api.Models.Entities;

public class Employee
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = "Employee";

    public int DepartmentId { get; set; }

    public Department Department { get; set; } = null!;
}
