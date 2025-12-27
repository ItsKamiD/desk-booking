using DeskBooking.API.Models;
namespace DeskBooking.API.Data;

public static class DbSeeder
{
    public static void Seed(AppDb db)
    {
        if (db.Desks.Any() || db.Users.Any()) return;

        db.Users.AddRange(
            new User { Id = 1, FirstName = "Kami", LastName = "Demo" },
            new User { Id = 2, FirstName = "Alex", LastName = "Smith" }
        );

        db.Desks.AddRange(
            Enumerable.Range(1, 12).Select(n => new Desk
            {
                Id = n,
                DeskNumber = n,
                Status = DeskStatus.Open
            })
        );

        db.Desks.First(d => d.DeskNumber == 3).Status = DeskStatus.Maintenance;
        db.Desks.First(d => d.DeskNumber == 3).MaintenanceMessage = "Broken monitor";

        db.SaveChanges();
    }
}
