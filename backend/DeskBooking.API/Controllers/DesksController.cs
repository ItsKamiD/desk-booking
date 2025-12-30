using DeskBooking.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace DeskBooking.API.Controllers;

[ApiController]
[Route("api/desks")]
public class DesksController : ControllerBase
{
    private readonly ReservationService _service;

    public DesksController(ReservationService service)
    {
        _service = service;
    }

    [HttpGet("range")]
    public async Task<IActionResult> GetForRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var desks = await _service.GetDesksForRangeAsync(startDate, endDate);
        return Ok(desks);
    }
}
