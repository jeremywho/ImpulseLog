# ImpulseLog - Development Journal & Plan

**Project**: ImpulseLog
**Purpose**: ADHD impulse tracking app with desktop (Electron) and mobile (React Native) clients
**Started**: 2025-11-16
**Status**: Planning Complete - Ready to Execute

---

## Project Overview

Building an impulse tracking application based on the StarterTemplates monorepo that helps users with ADHD capture and analyze impulsive decisions across desktop and mobile devices.

### Key Features
- **Super-fast capture**: Log an impulse in 1-3 seconds
- **Global keyboard shortcut**: Ctrl+Shift+I for instant popup (desktop)
- **Cross-device sync**: All impulses synced via backend API
- **Optional metadata**: Trigger, emotion, action taken, notes
- **History & filtering**: Review past impulses by date and action status

### Technology Stack
- **Desktop**: Electron 39 + React 19 + TypeScript + Vite
- **Mobile**: React Native 0.82 + TypeScript
- **Backend**: .NET 9 + Entity Framework Core + SQLite
- **Shared**: TypeScript types and API client

---

## Complete Implementation Plan

### Phase 1: Template Setup & Configuration
**Status**: Pending

#### 1.1 Clone and Initialize Repository
- [ ] Clone StarterTemplates repository to C:\Repos\ADHD\ImpulseLog
- [ ] Remove template git history
- [ ] Initialize fresh git repository
- [ ] Install all dependencies
- [ ] Build shared package to verify setup

#### 1.2 Project Branding & Configuration
- [ ] Update root package.json name to "impulse-log"
- [ ] Update backend appsettings.json:
  - Change JWT secret (generate secure 32+ char key)
  - Update Issuer to "ImpulseLogAPI"
  - Update Audience to "ImpulseLogClients"
  - Change database filename to "impulse-log.db"
- [ ] Update Electron package.json:
  - name: "impulse-log"
  - productName: "ImpulseLog"
  - description: "ADHD impulse tracking made simple"
  - appId: "com.impulse.log"
- [ ] Update Mobile package.json and app.json:
  - name: "ImpulseLog"
  - displayName: "ImpulseLog"
- [ ] Update Mobile Android bundle ID:
  - applicationId: "com.impulse.log"
- [ ] Update Mobile iOS bundle ID:
  - Bundle Identifier: "com.impulse.log"
- [ ] Update all UI references from "Starter Template" to "ImpulseLog"

#### 1.3 Verification
- [ ] Run backend - verify it starts on localhost:5000
- [ ] Run Electron app - verify it connects and existing auth works
- [ ] Test user registration/login to confirm template is working

---

### Phase 2: Backend Implementation
**Status**: Pending

#### 2.1 Data Model - ImpulseEntry Entity
Create `packages/backend/Models/ImpulseEntry.cs`:
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
    public string DidAct { get; set; } = "unknown"; // "yes", "no", "unknown"
    public string? Notes { get; set; }
    public User User { get; set; } = null!;
}
```

#### 2.2 Database Context Update
- [ ] Add DbSet<ImpulseEntry> to AppDbContext.cs
- [ ] Configure entity relationships (User -> ImpulseEntries)
- [ ] Create and apply EF migration
- [ ] Verify database schema

#### 2.3 DTOs (Data Transfer Objects)
Create `packages/backend/DTOs/ImpulseEntryDTOs.cs`:
- CreateImpulseEntryDto
- UpdateImpulseEntryDto
- ImpulseEntryResponseDto

#### 2.4 API Controller
Create `packages/backend/Controllers/ImpulseEntriesController.cs`:
- [ ] GET /api/impulses - List all impulses for current user
  - Query params: startDate, endDate, didAct filter
- [ ] GET /api/impulses/{id} - Get single impulse
- [ ] POST /api/impulses - Create new impulse
- [ ] PUT /api/impulses/{id} - Update impulse
- [ ] DELETE /api/impulses/{id} - Delete impulse
- [ ] All endpoints require [Authorize] attribute
- [ ] Ensure users can only access their own impulses

#### 2.5 Backend Testing
- [ ] Test all CRUD endpoints with Postman/curl
- [ ] Verify JWT authentication works
- [ ] Test query filters
- [ ] Verify data isolation between users

---

### Phase 3: Shared TypeScript Package
**Status**: Pending

#### 3.1 Type Definitions
Update `packages/shared/src/types.ts`:
```typescript
export interface ImpulseEntry {
  id: string;
  userId: number;
  createdAt: string;
  updatedAt?: string;
  impulseText: string;
  trigger?: string;
  emotion?: string;
  didAct: 'yes' | 'no' | 'unknown';
  notes?: string;
}

export interface CreateImpulseEntry {
  impulseText: string;
  trigger?: string;
  emotion?: string;
  didAct?: 'yes' | 'no' | 'unknown';
  notes?: string;
}

export interface UpdateImpulseEntry extends Partial<CreateImpulseEntry> {}
```

#### 3.2 API Client Methods
Update `packages/shared/src/apiClient.ts`:
```typescript
// Add to ApiClient class
async getImpulses(startDate?: string, endDate?: string, didAct?: string): Promise<ImpulseEntry[]>
async getImpulse(id: string): Promise<ImpulseEntry>
async createImpulse(data: CreateImpulseEntry): Promise<ImpulseEntry>
async updateImpulse(id: string, data: UpdateImpulseEntry): Promise<ImpulseEntry>
async deleteImpulse(id: string): Promise<void>
```

#### 3.3 Build & Publish
- [ ] Build shared package: `npm run build`
- [ ] Verify types are exported correctly
- [ ] Test import in Electron and Mobile projects

---

### Phase 4: Electron Desktop App
**Status**: Pending

#### 4.1 Global Keyboard Shortcut
Update `packages/electron/electron/main.ts`:
- [ ] Register global shortcut Ctrl+Shift+I
- [ ] Create quick-entry window (small, centered, 400x300)
- [ ] Show/hide quick-entry window on shortcut
- [ ] Auto-focus text input when window appears
- [ ] Handle ESC key to close quick-entry window

Quick-entry window specs:
- Size: 400x300
- Frame: false (frameless)
- Centered: true
- Always on top: true
- Skip taskbar: true

#### 4.2 UI Components & Pages

**QuickEntry.tsx** (New Page):
- [ ] Auto-focused text input for impulse text
- [ ] "Save" button (or Enter key)
- [ ] Optional: expandable section for metadata
- [ ] Success feedback
- [ ] Clear form after save
- [ ] Close window after save (configurable)

**ImpulseList.tsx** (New Page):
- [ ] Fetch and display all impulses
- [ ] Date range filter
- [ ] DidAct filter (all, yes, no, unknown)
- [ ] Sort by date (newest first)
- [ ] Click to view detail
- [ ] Pull-to-refresh or manual refresh button

**ImpulseDetail.tsx** (New Page):
- [ ] Display all impulse fields
- [ ] Edit mode
- [ ] Save changes
- [ ] Delete impulse (with confirmation)
- [ ] Navigate back to list

#### 4.3 Navigation & Routing
- [ ] Add routes for /impulses, /impulses/:id, /quick-entry
- [ ] Add "Impulses" to main navigation
- [ ] Update Home page with quick link to impulses

#### 4.4 State Management
- [ ] Create impulse context or hooks for data fetching
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Optimistic updates for better UX

---

### Phase 5: React Native Mobile App
**Status**: Pending

#### 5.1 UI Screens

**QuickEntryScreen.tsx** (New Screen):
- [ ] Auto-focused TextInput
- [ ] Save button (prominent, easy to tap)
- [ ] Optional metadata fields (collapsible)
- [ ] Success feedback
- [ ] Navigate to list after save

**ImpulseListScreen.tsx** (New Screen):
- [ ] FlatList of impulses
- [ ] Pull-to-refresh
- [ ] Date range filter
- [ ] DidAct filter
- [ ] Tap to view detail
- [ ] Empty state message

**ImpulseDetailScreen.tsx** (New Screen):
- [ ] Display all fields
- [ ] Edit functionality
- [ ] Save changes
- [ ] Delete with confirmation
- [ ] Navigate back

#### 5.2 Navigation
- [ ] Add screens to navigation stack
- [ ] Add "Impulses" to main tab/drawer navigation
- [ ] Configure navigation params

#### 5.3 State & API Integration
- [ ] Use shared API client
- [ ] Add API base URL configuration for mobile
- [ ] Handle loading and error states
- [ ] Implement data caching with AsyncStorage (optional)

---

### Phase 6: Testing & Verification
**Status**: Pending

#### 6.1 Backend Testing
- [ ] All API endpoints return correct data
- [ ] Authentication works correctly
- [ ] Users can only see their own impulses
- [ ] Filtering works correctly
- [ ] Validation errors are handled

#### 6.2 Desktop Testing
- [ ] Global shortcut (Ctrl+Shift+I) works
- [ ] Quick-entry window appears correctly
- [ ] Can create impulse from quick-entry
- [ ] Can create impulse from main app
- [ ] Can view list of impulses
- [ ] Can edit impulse
- [ ] Can delete impulse
- [ ] Filters work correctly
- [ ] Sync works (create on desktop, see in list)

#### 6.3 Mobile Testing
- [ ] Can register/login
- [ ] Can create impulse
- [ ] Can view list
- [ ] Can edit impulse
- [ ] Can delete impulse
- [ ] Pull-to-refresh works
- [ ] Filters work

#### 6.4 Cross-Device Sync Testing
- [ ] Create impulse on desktop, verify on mobile
- [ ] Create impulse on mobile, verify on desktop
- [ ] Edit on one device, verify on other
- [ ] Delete on one device, verify on other

---

### Phase 7: Polish & Documentation
**Status**: Pending

#### 7.1 UI/UX Polish
- [ ] Consistent styling across all screens
- [ ] Loading indicators
- [ ] Error messages
- [ ] Success feedback
- [ ] Empty states
- [ ] Keyboard shortcuts documented

#### 7.2 Documentation
- [ ] Update README with ImpulseLog features
- [ ] Document global shortcut
- [ ] Document API endpoints
- [ ] Create user guide (optional)

#### 7.3 Code Quality
- [ ] Remove unused code
- [ ] Add comments where needed
- [ ] Consistent formatting
- [ ] No console.log statements in production

---

## Acceptance Criteria (from impulse_log_plan.md)

- [x] CRUD API implemented and tested
- [x] Desktop app can add, list, and edit impulses
- [x] Mobile app can add, list, and edit impulses
- [x] Sync working across devices
- [x] Global keyboard shortcut for quick entry (desktop)

---

## Technical Decisions

### Quick Entry Window Implementation
- **Approach**: Separate BrowserWindow for quick entry
- **Trigger**: Global keyboard shortcut (Ctrl+Shift+I)
- **Behavior**: Small centered window, always on top, frameless
- **Auto-close**: After successful save

### Sync Strategy
- **Online-first**: All operations go to backend immediately
- **Refresh**: Fetch on screen focus/mount
- **No offline queue**: Keep MVP simple (can add later)

### Filter Options
- **Date range**: Last 7 days, 30 days, 90 days, all time
- **DidAct**: All, Yes, No, Unknown

---

## Future Enhancements (Out of Scope for MVP)

- Offline support with sync queue
- Charts and analytics
- Tagging system
- Export data (CSV, JSON)
- Notifications/reminders
- Web app
- AI-powered insights
- Pattern recognition

---

## Notes & Issues

_This section will be updated as development progresses_

---

## Development Log

### 2025-11-16 - Initial Planning
- Reviewed StarterTemplates repository structure
- Reviewed impulse_log_plan.md requirements
- Created comprehensive implementation plan
- User preferences captured:
  - Project name: ImpulseLog
  - Global shortcut: Ctrl+Shift+I
  - Quick entry UI: Small centered window

**Next Steps**: Begin Phase 1 - Template Setup & Configuration
