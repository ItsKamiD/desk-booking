namespace DeskBooking.API.Models;

public class Desk
{
    public int Id { get; set; }
    public int DeskNumber { get; set; }
    public DeskStatus Status { get; set; } 
    public string? MaintenanceMessage { get; set; }
}