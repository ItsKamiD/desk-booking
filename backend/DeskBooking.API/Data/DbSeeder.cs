using DeskBooking.API.Models;

namespace DeskBooking.API.Data;

public static class DbSeeder
{
    public static void Seed(AppDb db)
    {
        if (db.Desks.Any() || db.Users.Any()) return;

        // Users
        db.Users.AddRange(
            new User { Id = 1, FirstName = "Kamil", LastName = "Demo" },
            new User { Id = 2, FirstName = "Alex", LastName = "Smith" }
        );

        // Desks 1..12
        for (int n = 1; n <= 12; n++)
        {
            db.Desks.Add(new Desk
            {
                Id = n,
                DeskNumber = n,
                Status = DeskStatus.Open
            });
        }

        db.SaveChanges();

        var desk3 = db.Desks.FirstOrDefault(d => d.DeskNumber == 3);
        if (desk3 != null)
        {
            desk3.Status = DeskStatus.Maintenance;
            desk3.MaintenanceMessage = "Broken monitor";
            db.SaveChanges();
        }
    }
}
