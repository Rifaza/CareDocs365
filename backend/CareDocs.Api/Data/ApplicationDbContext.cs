
using CareDocs.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CareDocs.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Department> Departments => Set<Department>();

    public DbSet<Employee> Employees => Set<Employee>();

    public DbSet<Document> Documents => Set<Document>();

    public DbSet<Approval> Approvals => Set<Approval>();

    public DbSet<ApprovalHistory> ApprovalHistories =>
        Set<ApprovalHistory>();

    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Department>()
            .HasIndex(d => d.Name)
            .IsUnique();

        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.Email)
            .IsUnique();

        modelBuilder.Entity<Document>()
            .HasOne(d => d.Department)
            .WithMany(d => d.Documents)
            .HasForeignKey(d => d.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Document>()
            .HasOne(d => d.CreatedBy)
            .WithMany()
            .HasForeignKey(d => d.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Approval>()
            .HasOne(a => a.Approver)
            .WithMany()
            .HasForeignKey(a => a.ApproverId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Approval>()
            .HasOne(a => a.Document)
            .WithMany(d => d.Approvals)
            .HasForeignKey(a => a.DocumentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ApprovalHistory>()
            .HasOne(h => h.ActionBy)
            .WithMany()
            .HasForeignKey(h => h.ActionById)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ApprovalHistory>()
            .HasOne(h => h.Approval)
            .WithMany(a => a.History)
            .HasForeignKey(h => h.ApprovalId)
            .OnDelete(DeleteBehavior.Cascade);

        // Demo seed data
        modelBuilder.Entity<Department>().HasData(
            new Department
            {
                Id = 1,
                Name = "Cardiology",
                Description = "Cardiology Department"
            },
            new Department
            {
                Id = 2,
                Name = "Human Resources",
                Description = "HR Department"
            }
        );

        modelBuilder.Entity<Employee>().HasData(
            new Employee
            {
                Id = 1,
                FullName = "Demo Employee",
                Email = "employee@caredocs.local",
                Role = "Employee",
                DepartmentId = 1
            },
            new Employee
            {
                Id = 2,
                FullName = "Demo Manager",
                Email = "manager@caredocs.local",
                Role = "Manager",
                DepartmentId = 1
            }
        );
    }
}
