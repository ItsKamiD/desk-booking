namespace DeskBooking.API.Dtos;

public class CancelReservationRequest
{
    public int ReservationId { get; set; }
    public int UserId { get; set; }

    // optional
    public int? ReservationAccessCode { get; set; }
}
