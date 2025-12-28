namespace DeskBooking.API.Models;

public class Reservation
{
    public int Id { get; set; }

    // Desk
    public int DeskId { get; set; }
    public Desk ReservedDesk { get; set; } = null!;

    // User
    public int UserId { get; set; }
    public User ReservedBy { get; set; } = null!;

    // Single day reservation
    public DateTime ReservationDate { get; set; }

    // Optional access code (same for all days in a request)
    public int ReservationAccessCode { get; set; }
}
