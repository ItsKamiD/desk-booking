namespace DeskBooking.API.Dtos;

public class ReserveDayRequest
{
    public int DeskId { get; set; }
    public int UserId { get; set; }
    public DateTime Day { get; set; }
}
