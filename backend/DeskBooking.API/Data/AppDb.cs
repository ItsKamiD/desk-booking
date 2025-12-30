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
        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.ReservedDesk)
            .WithMany()
            .HasForeignKey(r => r.DeskId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.ReservedBy)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Prevents double booking in DB (desk + day must be unique)
        modelBuilder.Entity<Reservation>()
            .HasIndex(r => new { r.DeskId, r.ReservationDate })
            .IsUnique();

        base.OnModelCreating(modelBuilder);
    }

}
