
# Impulse Log App — Product & Technical Plan (StarterTemplates-Based)

Owner: [Your Name]  
Audience: Senior fullstack / app developer  
Version: v2.0 (MVP with backend + sync)  
Last Updated: 2025-11-16

This spec assumes we are building on the existing **StarterTemplates** monorepo with:

- Electron desktop app
- React Native mobile app
- .NET 9 backend + SQLite
- Shared TypeScript types + API client

## 1. Purpose & Context

### 1.1. Problem

For users with ADHD / impulsive tendencies, many decisions (spending, browsing, starting projects, etc.) are driven by fast, emotion-driven impulses:

> Trigger → Impulse → Action → Regret → Avoidance → Repeat

The user wants a **low-friction, cross-device way** to capture impulses *in the moment*, so they can later analyze patterns and build awareness — with:

- Desktop app (Electron)
- Mobile app (React Native)
- Shared backend & auth
- Sync across devices

### 1.2. Goal of the App

Create a **super fast, minimal friction client** (desktop + mobile) wired into the existing backend, enabling:

1. Capture an impulse in **1–3 seconds**.
2. Optionally add context (trigger, emotion, didAct, notes) now or later.
3. Sync impulses to the backend under the authenticated user.
4. Review past impulses and identify patterns (basic filters to start).

**Future:** add a web app that reuses the shared TS client and backend API.

## 2. Product Principles

1. **Frictionless capture**
2. **Optional depth**
3. **Sync & portability**
4. **No shame, no judgment**
5. **Leverage existing StarterTemplates architecture**

## 3. MVP Scope (v1 on StarterTemplates)

### 3.1. In Scope

- Backend with ImpulseEntry entity and CRUD API.
- Desktop & mobile app for adding, listing, and editing impulses.
- Sync via shared API client and backend.

### 3.2. Out of Scope

- Advanced analytics & charts.
- Notifications.
- Offline-first sync queues.
- Web app.

## 4. User Stories

### Capture & Sync Flow

- Add entry with a few taps.
- Store impulse on backend and propagate to multiple devices.

### Optional Metadata

- Additional fields: trigger, emotion, didAct, notes.

### Review & Simple Insight

- Filter by time and whether action was taken.

## 5. UX Outline

### Impulse Capture Screen

- Text input auto-focused.
- Optional detail fields.
- "Save" to send to backend.

### History Screen

- Filters: time range and action status.
- Tapping shows detail screen.

### Detail Screen

- Edit metadata or delete.

## 6. Data Model & API

### Entity: ImpulseEntry

```csharp
public class ImpulseEntry
{
    public Guid Id { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string ImpulseText { get; set; } = null!;
    public string? Trigger { get; set; }
    public string? Emotion { get; set; }
    public string DidAct { get; set; } = "unknown";
    public string? Notes { get; set; }
    public User User { get; set; } = null!;
}
```

## 7. Shared TypeScript Package Updates

Include interfaces and API methods for CRUD on impulses.

## 8. Electron & Mobile App Changes

Add routes/screens and state handling.

## 9. Sync & Data Semantics

- Online-first.
- Fetch on focus.
- Create/update via API.

## 10. Non-Functional Requirements

- Performance: snappy interactions.
- Privacy: strict user data isolation.

## 11. Future Enhancements

- Web app.
- Charts.
- Tagging.
- Notifications.
- AI features.

## 12. Acceptance Criteria

- CRUD API implemented and tested.
- Desktop/mobile apps can add, list, and edit impulses.
- Sync working across devices.
