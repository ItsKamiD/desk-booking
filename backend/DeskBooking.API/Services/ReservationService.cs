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

    // Reserve ONLY ONE DAY
    public async Task<(bool ok, string message, Reservation? reservation)> ReserveDayAsync(
        int deskId,
        int userId,
        DateTime day)
    {
        var reservationDay = day.Date;

        var desk = await _db.Desks.FirstOrDefaultAsync(d => d.Id == deskId);
        if (desk == null) return (false, "Desk not found.", null);
        if (desk.Status == DeskStatus.Maintenance)
            return (false, "Desk is under maintenance.", null);

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return (false, "User not found.", null);

        // overlap for a single day = any reservation that includes that day
        var isAlreadyReserved = await _db.Reservations.AnyAsync(r =>
            r.DeskId == deskId &&
            reservationDay >= r.ReservationStartTime.Date &&
            reservationDay <= r.ReservationEndTime.Date);

        if (isAlreadyReserved)
            return (false, "Desk is already reserved on that day.", null);

        var accessCode = Random.Shared.Next(100000, 999999);

        var reservation = new Reservation
        {
            DeskId = deskId,
            UserId = userId,
            ReservationStartTime = reservationDay,
            ReservationEndTime = reservationDay,
            ReservationAccessCode = accessCode
        };

        _db.Reservations.Add(reservation);

        // optional: mark desk reserved (simple UI)
        if (desk.Status != DeskStatus.Maintenance)
            desk.Status = DeskStatus.Reserved;

        await _db.SaveChangesAsync();
        return (true, "Reserved successfully.", reservation);
    }

    public async Task<(bool ok, string message)> CancelAsync(
        int reservationId,
        int userId,
        bool wholeRange,
        DateTime? day,
        int? accessCode)
    {
        var reservation = await _db.Reservations.FirstOrDefaultAsync(r => r.Id == reservationId);
        if (reservation == null) return (false, "Reservation not found.");

        if (reservation.UserId != userId)
            return (false, "You can cancel only your own reservation.");

        if (accessCode.HasValue && accessCode.Value != reservation.ReservationAccessCode)
            return (false, "Invalid reservation access code.");

        if (wholeRange)
        {
            _db.Reservations.Remove(reservation);
        }
        else
        {
            if (day == null) return (false, "Day is required when WholeRange=false.");

            var cancelDay = day.Value.Date;
            var start = reservation.ReservationStartTime.Date;
            var end = reservation.ReservationEndTime.Date;

            if (cancelDay < start || cancelDay > end)
                return (false, "Day is outside reservation range.");

            // For your current "day-only" version, reservations are single-day anyway,
            // so cancelling one day means deleting.
            // (If later you allow multi-day, you can re-add your split logic.)
            _db.Reservations.Remove(reservation);
        }

        await _db.SaveChangesAsync();

        // Update desk status (simple)
        var anyReservationsForDesk = await _db.Reservations.AnyAsync(r => r.DeskId == reservation.DeskId);
        var desk = await _db.Desks.FirstAsync(d => d.Id == reservation.DeskId);

        if (desk.Status != DeskStatus.Maintenance)
            desk.Status = anyReservationsForDesk ? DeskStatus.Reserved : DeskStatus.Open;

        await _db.SaveChangesAsync();
        return (true, "Cancelled successfully.");
    }

    public async Task<List<object>> GetDesksForRangeAsync(DateTime startDate, DateTime endDate)
    {
        var rangeStart = startDate.Date;
        var rangeEnd = endDate.Date;

        if (rangeEnd < rangeStart)
            return new List<object>();

        var desks = await _db.Desks.AsNoTracking().ToListAsync();

        // get reservations that overlap this range
        var reservationsInRange = await _db.Reservations
            .Include(r => r.ReservedBy)
            .AsNoTracking()
            .Where(r => rangeStart <= r.ReservationEndTime.Date && rangeEnd >= r.ReservationStartTime.Date)
            .ToListAsync();

        // IMPORTANT: do NOT return mixed anonymous types without consistent shape
        // We'll return consistent shape for all rows.
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
                    ReservedBy = new
                    {
                        reservation.UserId,
                        reservation.ReservedBy.FirstName,
                        reservation.ReservedBy.LastName
                    },
                    Reservation = new
                    {
                        reservation.Id,
                        reservation.ReservationStartTime,
                        reservation.ReservationEndTime
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
            .Where(r => r.UserId == userId && r.ReservationEndTime.Date >= today)
            .OrderBy(r => r.ReservationStartTime)
            .ToListAsync();

        var past = await _db.Reservations
            .AsNoTracking()
            .Where(r => r.UserId == userId && r.ReservationEndTime.Date < today)
            .OrderByDescending(r => r.ReservationStartTime)
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
                r.ReservationStartTime,
                r.ReservationEndTime
            }),
            PastReservations = past.Select(r => new
            {
                r.Id,
                r.DeskId,
                r.ReservationStartTime,
                r.ReservationEndTime
            })
        };
    }
}
