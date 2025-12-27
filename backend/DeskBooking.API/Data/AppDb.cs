using DeskBooking.API.Models;
using Microsoft.EntityFrameworkCore;
namespace DeskBooking.API.Data;

public class AppDb : DbContext
{
    public AppDb(DbContextOptions<AppDb> options) : base(options) { }

    public DbSet<Desk> Desks => Set<Desk>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Reservation> Reservations => Set<Reservation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Reservation -> Desk relationship (many reservations can exist for one desk over time)
        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.ReservedDesk)
            .WithMany()
            .HasForeignKey(r => r.DeskId)
            .OnDelete(DeleteBehavior.Restrict);

        // Reservation -> User relationship
        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.ReservedBy)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        base.OnModelCreating(modelBuilder);
    }
}
