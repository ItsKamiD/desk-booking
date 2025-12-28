namespace DeskBooking.API.Dtos;

public class CancelReservationRequest
{
    public int ReservationId { get; set; }
    public int UserId { get; set; }

    // true = cancel whole reservation, false = cancel a specific day
    public bool WholeRange { get; set; }

    public DateTime? Day { get; set; }
    public int? ReservationAccessCode { get; set; }
}
