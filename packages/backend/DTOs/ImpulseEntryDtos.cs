namespace Backend.DTOs;

public class CreateImpulseEntryDto
{
    public string ImpulseText { get; set; } = null!;
    public string? Trigger { get; set; }
    public string? Emotion { get; set; }
    public string? DidAct { get; set; } = "unknown";
    public string? Notes { get; set; }
}

public class UpdateImpulseEntryDto
{
    public string? ImpulseText { get; set; }
    public string? Trigger { get; set; }
    public string? Emotion { get; set; }
    public string? DidAct { get; set; }
    public string? Notes { get; set; }
}

public class ImpulseEntryResponseDto
{
    public Guid Id { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string ImpulseText { get; set; } = null!;
    public string? Trigger { get; set; }
    public string? Emotion { get; set; }
    public string DidAct { get; set; } = null!;
    public string? Notes { get; set; }
}
