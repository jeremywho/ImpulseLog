namespace Backend.Models;

public class ImpulseEntry
{
    public Guid Id { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string ImpulseText { get; set; } = null!;
    public string? Trigger { get; set; }
    public string? Emotion { get; set; }
    public string DidAct { get; set; } = "unknown"; // "yes", "no", "unknown"
    public string? Notes { get; set; }

    // Navigation property
    public User User { get; set; } = null!;
}
