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

    // Reservation Details
    public int ReservationAccessCode { get; set; }    //Dont know if ill use this yet 
    public DateTime ReservationStartTime { get; set; }
    public DateTime ReservationEndTime { get; set; }

}