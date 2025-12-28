using DeskBooking.API.Data;
using DeskBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DeskBooking.API.Services;

public class ReservationService
{
    private readonly AppDb _db;

    public ReservationService(AppDb db)
    {
        _db = db;
    }

    public async Task<(bool ok, string message, Reservation? reservation)> ReserveDayAsync(
        int deskId,
        int userId,
        DateTime day)
    {
        var reservationDate = day.Date;

        var desk = await _db.Desks.FirstOrDefaultAsync(d => d.Id == deskId);
        if (desk == null) return (false, "Desk not found.", null);

        if (desk.Status == DeskStatus.Maintenance)
            return (false, "Desk is under maintenance.", null);

        var userExists = await _db.Users.AnyAsync(u => u.Id == userId);
        if (!userExists) return (false, "User not found.", null);

        var isAlreadyReserved = await _db.Reservations.AnyAsync(r =>
            r.DeskId == deskId && r.ReservationDate == reservationDate);

        if (isAlreadyReserved)
            return (false, "Desk is already reserved on that day.", null);

        var accessCode = Random.Shared.Next(100000, 1_000_000);

        var reservation = new Reservation
        {
            DeskId = deskId,
            UserId = userId,
            ReservationDate = reservationDate,
            ReservationAccessCode = accessCode
        };

        _db.Reservations.Add(reservation);

        // Simple UI status (optional)
        if (desk.Status != DeskStatus.Maintenance)
            desk.Status = DeskStatus.Reserved;

        await _db.SaveChangesAsync();

        return (true, "Reserved successfully.", reservation);
    }

    public async Task<(bool ok, string message)> CancelAsync(
        int reservationId,
        int userId,
        int? accessCode)
    {
        var reservation = await _db.Reservations.FirstOrDefaultAsync(r => r.Id == reservationId);
        if (reservation == null) return (false, "Reservation not found.");

        if (reservation.UserId != userId)
            return (false, "You can cancel only your own reservation.");

        if (accessCode.HasValue && accessCode.Value != reservation.ReservationAccessCode)
            return (false, "Invalid reservation access code.");

        _db.Reservations.Remove(reservation);
        await _db.SaveChangesAsync();

        // Update desk status (simple)
        var desk = await _db.Desks.FirstOrDefaultAsync(d => d.Id == reservation.DeskId);
        if (desk != null && desk.Status != DeskStatus.Maintenance)
        {
            var anyReservationsForDesk = await _db.Reservations.AnyAsync(r => r.DeskId == reservation.DeskId);
            desk.Status = anyReservationsForDesk ? DeskStatus.Reserved : DeskStatus.Open;
            await _db.SaveChangesAsync();
        }

        return (true, "Cancelled successfully.");
    }

    public async Task<List<object>> GetDesksForRangeAsync(DateTime startDate, DateTime endDate)
    {
        var rangeStart = startDate.Date;
        var rangeEnd = endDate.Date;

        if (rangeEnd < rangeStart)
            return new List<object>();

        var desks = await _db.Desks.AsNoTracking().ToListAsync();

        var reservationsInRange = await _db.Reservations
            .Include(r => r.ReservedBy)
            .AsNoTracking()
            .Where(r => r.ReservationDate >= rangeStart && r.ReservationDate <= rangeEnd)
            .ToListAsync();

        var result = new List<object>();

        foreach (var desk in desks)
        {
            if (desk.Status == DeskStatus.Maintenance)
            {
                result.Add(new
                {
                    desk.Id,
                    desk.DeskNumber,
                    Status = DeskStatus.Maintenance.ToString(),
                    desk.MaintenanceMessage,
                    ReservedBy = (object?)null,
                    Reservation = (object?)null
                });
                continue;
            }

            // if there is ANY reservation for that desk in range, mark Reserved (simple range view)
            var reservation = reservationsInRange.FirstOrDefault(r => r.DeskId == desk.Id);

            if (reservation == null)
            {
                result.Add(new
                {
                    desk.Id,
                    desk.DeskNumber,
                    Status = DeskStatus.Open.ToString(),
                    MaintenanceMessage = (string?)null,
                    ReservedBy = (object?)null,
                    Reservation = (object?)null
                });
            }
            else
            {
                result.Add(new
                {
                    desk.Id,
                    desk.DeskNumber,
                    Status = DeskStatus.Reserved.ToString(),
                    MaintenanceMessage = (string?)null,
                    ReservedBy = reservation.ReservedBy == null
                        ? (object?)null
                        : new
                        {
                            reservation.UserId,
                            reservation.ReservedBy.FirstName,
                            reservation.ReservedBy.LastName
                        },
                    Reservation = new
                    {
                        reservation.Id,
                        reservation.ReservationDate
                    }
                });
            }
        }

        return result;
    }

    public async Task<object?> GetProfileAsync(int userId)
    {
        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return null;

        var today = DateTime.UtcNow.Date;

        var current = await _db.Reservations
            .AsNoTracking()
            .Where(r => r.UserId == userId && r.ReservationDate >= today)
            .OrderBy(r => r.ReservationDate)
            .ToListAsync();

        var past = await _db.Reservations
            .AsNoTracking()
            .Where(r => r.UserId == userId && r.ReservationDate < today)
            .OrderByDescending(r => r.ReservationDate)
            .ToListAsync();

        return new
        {
            user.Id,
            user.FirstName,
            user.LastName,
            CurrentReservations = current.Select(r => new
            {
                r.Id,
                r.DeskId,
                r.ReservationDate
            }),
            PastReservations = past.Select(r => new
            {
                r.Id,
                r.DeskId,
                r.ReservationDate
            })
        };
    }
}
