using DeskBooking.API.Dtos;
using DeskBooking.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace DeskBooking.API.Controllers;

[ApiController]
[Route("api/reservations")]
public class ReservationsController : ControllerBase
{
    private readonly ReservationService _service;

    public ReservationsController(ReservationService service)
    {
        _service = service;
    }

    // POST api/reservations/reserve-day
    [HttpPost("reserve-day")]
    public async Task<IActionResult> ReserveDay([FromBody] ReserveDayRequest request)
    {
        var (ok, message, reservation) = await _service.ReserveDayAsync(
            request.DeskId,
            request.UserId,
            request.Day);

        if (!ok)
            return BadRequest(new { message });

        return Ok(new { message, reservation });
    }

    // POST api/reservations/cancel
    [HttpPost("cancel")]
    public async Task<IActionResult> Cancel([FromBody] CancelReservationRequest request)
    {
        var (ok, message) = await _service.CancelAsync(
            request.ReservationId,
            request.UserId,
            request.WholeRange,
            request.Day,
            request.ReservationAccessCode);

        if (!ok)
            return BadRequest(new { message });

        return Ok(new { message });
    }

    // GET api/reservations/profile/2
    [HttpGet("profile/{userId:int}")]
    public async Task<IActionResult> GetProfile([FromRoute] int userId)
    {
        var profile = await _service.GetProfileAsync(userId);
        if (profile == null) return NotFound(new { message = "User not found." });

        return Ok(profile);
    }
}
