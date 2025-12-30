namespace DeskBooking.API.Dtos;

public class CancelReservationRequest
{
    public int ReservationId { get; set; }
    public int UserId { get; set; }

    // not sure if ill need this
    public int? ReservationAccessCode { get; set; }
}
