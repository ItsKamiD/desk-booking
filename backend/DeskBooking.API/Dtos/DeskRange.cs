namespace DeskBooking.API.Dtos;

public class DeskRangeDto
{
    public int Id { get; set; }
    public int DeskNumber { get; set; }
    public string Status { get; set; } = string.Empty;

    public string? MaintenanceMessage { get; set; }

    public ReservedByDto? ReservedBy { get; set; }
    public ReservationDto? Reservation { get; set; }

    public class ReservedByDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }

    public class ReservationDto
    {
        public int Id { get; set; }
        public DateTime ReservationDate { get; set; }
    }
}
