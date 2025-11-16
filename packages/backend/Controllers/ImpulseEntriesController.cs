using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ImpulseEntriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ImpulseEntriesController(AppDbContext context)
    {
        _context = context;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        return int.Parse(userIdClaim);
    }

    // GET: api/impulseentries
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ImpulseEntryResponseDto>>> GetImpulses(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] string? didAct)
    {
        var userId = GetCurrentUserId();
        var query = _context.ImpulseEntries
            .Where(e => e.UserId == userId);

        if (startDate.HasValue)
        {
            query = query.Where(e => e.CreatedAt >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(e => e.CreatedAt <= endDate.Value);
        }

        if (!string.IsNullOrEmpty(didAct) && didAct != "all")
        {
            query = query.Where(e => e.DidAct == didAct);
        }

        var impulses = await query
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();

        return Ok(impulses.Select(e => new ImpulseEntryResponseDto
        {
            Id = e.Id,
            UserId = e.UserId,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt,
            ImpulseText = e.ImpulseText,
            Trigger = e.Trigger,
            Emotion = e.Emotion,
            DidAct = e.DidAct,
            Notes = e.Notes
        }));
    }

    // GET: api/impulseentries/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ImpulseEntryResponseDto>> GetImpulse(Guid id)
    {
        var userId = GetCurrentUserId();
        var impulse = await _context.ImpulseEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (impulse == null)
        {
            return NotFound(new { message = "Impulse entry not found" });
        }

        return Ok(new ImpulseEntryResponseDto
        {
            Id = impulse.Id,
            UserId = impulse.UserId,
            CreatedAt = impulse.CreatedAt,
            UpdatedAt = impulse.UpdatedAt,
            ImpulseText = impulse.ImpulseText,
            Trigger = impulse.Trigger,
            Emotion = impulse.Emotion,
            DidAct = impulse.DidAct,
            Notes = impulse.Notes
        });
    }

    // POST: api/impulseentries
    [HttpPost]
    public async Task<ActionResult<ImpulseEntryResponseDto>> CreateImpulse(CreateImpulseEntryDto dto)
    {
        var userId = GetCurrentUserId();
        var impulse = new ImpulseEntry
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            ImpulseText = dto.ImpulseText,
            Trigger = dto.Trigger,
            Emotion = dto.Emotion,
            DidAct = dto.DidAct ?? "unknown",
            Notes = dto.Notes
        };

        _context.ImpulseEntries.Add(impulse);
        await _context.SaveChangesAsync();

        var response = new ImpulseEntryResponseDto
        {
            Id = impulse.Id,
            UserId = impulse.UserId,
            CreatedAt = impulse.CreatedAt,
            UpdatedAt = impulse.UpdatedAt,
            ImpulseText = impulse.ImpulseText,
            Trigger = impulse.Trigger,
            Emotion = impulse.Emotion,
            DidAct = impulse.DidAct,
            Notes = impulse.Notes
        };

        return CreatedAtAction(nameof(GetImpulse), new { id = impulse.Id }, response);
    }

    // PUT: api/impulseentries/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<ImpulseEntryResponseDto>> UpdateImpulse(Guid id, UpdateImpulseEntryDto dto)
    {
        var userId = GetCurrentUserId();
        var impulse = await _context.ImpulseEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (impulse == null)
        {
            return NotFound(new { message = "Impulse entry not found" });
        }

        if (dto.ImpulseText != null) impulse.ImpulseText = dto.ImpulseText;
        if (dto.Trigger != null) impulse.Trigger = dto.Trigger;
        if (dto.Emotion != null) impulse.Emotion = dto.Emotion;
        if (dto.DidAct != null) impulse.DidAct = dto.DidAct;
        if (dto.Notes != null) impulse.Notes = dto.Notes;

        impulse.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new ImpulseEntryResponseDto
        {
            Id = impulse.Id,
            UserId = impulse.UserId,
            CreatedAt = impulse.CreatedAt,
            UpdatedAt = impulse.UpdatedAt,
            ImpulseText = impulse.ImpulseText,
            Trigger = impulse.Trigger,
            Emotion = impulse.Emotion,
            DidAct = impulse.DidAct,
            Notes = impulse.Notes
        });
    }

    // DELETE: api/impulseentries/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteImpulse(Guid id)
    {
        var userId = GetCurrentUserId();
        var impulse = await _context.ImpulseEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (impulse == null)
        {
            return NotFound(new { message = "Impulse entry not found" });
        }

        _context.ImpulseEntries.Remove(impulse);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
