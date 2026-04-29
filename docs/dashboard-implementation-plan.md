# User Dashboard — Implementation Plan

## Execution Strategy

**Principle:** Ship working connections incrementally. Each phase ends with a testable improvement. No phase should break existing functionality.

**Parallel tracks where possible:** Backend changes (Go) and frontend changes (TypeScript) can overlap for independent items.

---

## Phase 0 — Prerequisites (30 min)

### 0.1 Verify backend is running
```bash
curl http://localhost:8080/api/v1/health
curl http://localhost:8080/api/v1/profile  # with auth cookie
```

### 0.2 Verify frontend dev server
```bash
cd studsnew && npm run dev
```

### 0.3 Confirm auth flow works end-to-end
- Register → verify OTP → login → cookie set → dashboard accessible

### Files: None (verification only)

---

## Phase 1 — Backend: Add Missing Endpoints (3-4 hours)

### 1.1 Dashboard stats + recent applications

**File:** `studsback/internal/studentdashboard/`

Add to `handler.go`:
```go
func (h *Handler) GetDashboardStats(c *gin.Context)
func (h *Handler) GetRecentApplications(c *gin.Context)
```

Add to `service.go`:
```go
func (s *Service) GetDashboardStats(userID uint) (*DashboardStats, error)
func (s *Service) GetRecentApplications(userID uint) ([]RecentApplication, error)
```

Add to `dto.go`:
```go
type DashboardStats struct {
    ApplicationsSubmitted  int `json:"applications_submitted"`
    SavedColleges         int `json:"saved_colleges"`
    ScholarshipsApplied   int `json:"scholarships_applied"`
    ProfileCompletion     int `json:"profile_completion"`
}

type RecentApplication struct {
    ID          uint   `json:"id"`
    Institution string `json:"institution"`
    Program     string `json:"program"`
    Type        string `json:"type"`
    Status      string `json:"status"`
    UpdatedAt   string `json:"updated_at"`
}
```

Add to `routes.go`:
```go
protected.GET("/dashboard/stats", h.GetDashboardStats)
protected.GET("/dashboard/recent-applications", h.GetRecentApplications)
```

### 1.2 Aggregate my-applications endpoint

**File:** Create `studsback/internal/myapplications/` (new package) OR add to existing `studentdashboard/handler.go`

Simpler: add to `studentdashboard`:
```go
func (h *Handler) GetMyApplications(c *gin.Context)
```
Queries both admissions + scholarship applications tables, unions them, returns paginated.

### 1.3 Password change for students

**File:** `studsback/internal/auth/handler.go`, `service.go`, `dto.go`

Add DTO:
```go
type ChangePasswordRequest struct {
    CurrentPassword string `json:"current_password" binding:"required"`
    NewPassword     string `json:"new_password" binding:"required,min=6"`
}
```

Add handler + service:
```go
func (h *Handler) ChangePassword(c *gin.Context)
func (s *Service) ChangePassword(userID uint, currentPwd, newPwd string) error
```

Add route in `routes.go`:
```go
protected.PUT("/auth/change-password", h.ChangePassword)
```

### 1.4 CalendarEvent: add `type` field

**File:** `studsback/internal/studentdashboard/model.go`
```go
type CalendarEvent struct {
    // ... existing fields ...
    Type string `gorm:"default:'event'" json:"type"`
}
```

Update DTO request/response structs. Auto-migrate handles it.

### 1.5 Enhanced bookmarks endpoint

**File:** `studsback/internal/studentdashboard/service.go`

Modify `GetBookmarksByType` to JOIN the relevant table (college, course, scholarship, event) based on `item_type` and include item data in the response.

**New response DTO:**
```go
type EnrichedBookmark struct {
    ID        uint      `json:"id"`
    CreatedAt time.Time `json:"created_at"`
    ItemID    uint      `json:"item_id"`
    ItemType  string    `json:"type"`
    Item      interface{} `json:"item"`  // dynamically populated
}
```

### 1.6 User profile model expansion

**File:** `studsback/internal/auth/model.go`

Add fields:
```go
type User struct {
    // ... existing ...
    Phone       string  `json:"phone"`
    DateOfBirth string  `json:"date_of_birth"`
    Gender      string  `json:"gender"`
    Nationality string  `json:"nationality"`
    Address     string  `json:"address"`
    Bio         string  `json:"bio"`
}
```

Update `UpdateProfileRequest` and `ProfileResponse` DTOs.

### Verification:
```bash
curl http://localhost:8080/api/v1/dashboard/stats
curl http://localhost:8080/api/v1/my-applications
curl -X PUT http://localhost:8080/api/v1/auth/change-password
```

---

## Phase 2 — Frontend API Service Layer (1-2 hours)

### 2.1 Add new API methods to `services/api.ts`

Add methods following existing patterns:

```typescript
// Dashboard
async getDashboardStats(): Promise<DashboardStatsResponse>
async getRecentApplications(): Promise<RecentApplicationsResponse>
async getMyApplications(params?: { page?: number }): Promise<MyApplicationsResponse>

// Messages
async getMessages(params?: { page?: number; limit?: number }): Promise<MessagesResponse>
async getMessageById(id: number): Promise<MessageResponse>
async createMessage(data: CreateMessagePayload): Promise<MessageResponse>
async replyToMessage(id: number, content: string): Promise<MessageResponse>
async getMessageContacts(): Promise<MessageContactsResponse>

// Calendar
async getCalendarEvents(): Promise<CalendarEventsResponse>
async createCalendarEvent(data: CreateEventPayload): Promise<CalendarEventResponse>
async updateCalendarEvent(id: number, data: UpdateEventPayload): Promise<CalendarEventResponse>
async deleteCalendarEvent(id: number): Promise<void>

// Invites
async getInvites(params?: { page?: number }): Promise<InvitesResponse>
async acceptInvite(id: number): Promise<void>
async declineInvite(id: number): Promise<void>
async saveInvite(id: number): Promise<void>

// Profile
async updateProfile(data: UpdateProfilePayload): Promise<ProfileResponse>
async changePassword(data: ChangePasswordPayload): Promise<void>
async getBookmarks(type?: string): Promise<BookmarksEnrichedResponse>
```

### 2.2 Add TypeScript interfaces

**File:** `services/api.ts` (add to existing interfaces section)

```typescript
interface DashboardStats {
  applications_submitted: number;
  saved_colleges: number;
  scholarships_applied: number;
  profile_completion: number;
}

interface RecentApplication {
  id: number;
  institution: string;
  program: string;
  type: string;
  status: string;
  updated_at: string;
}

// ... etc for each domain
```

### Verification:
```bash
# TypeScript compilation check
npm run lint
```

---

## Phase 3 — Connect Dashboard Sections (5-6 hours)

### 3.1 DashboardLayout — connect header (30 min)

**File:** `components/user/dashboard/DashboardLayout.tsx`

Changes:
- Import `useAuth()` from `@/services/AuthContext`
- Replace "Katie Smith" → `user.first_name + " " + user.last_name`
- Replace "KS" → initials derived from user name
- Replace "Student" → `user.role`
- Replace hardcoded notification dropdown → call `getStudentNotifications()` on mount
- Wire bell badge to `unread_count` from response
- Wire "Mark all read" → `markAllNotificationsRead()`
- Wire individual read → `markNotificationRead(id)`

### 3.2 Sidebar — connect badges (15 min)

**File:** `components/user/dashboard/Sidebar.tsx`

Changes:
- Fetch unread message count from `getMessages()` (count unread)
- Fetch unread notification count from `getStudentNotifications()`
- Display real counts instead of hardcoded "3" and "16"

### 3.3 DashboardSection (main) — connect stats (45 min)

**File:** `components/user/dashboard/sections/DashboardSection.tsx`

Changes:
- Add `useEffect` on mount to call `getDashboardStats()` + `getRecentApplications()`
- Replace hardcoded stats with response data
- Replace hardcoded recent applications list with response data
- Replace mini-calendar with real upcoming events from `getCalendarEvents()`
- Replace "Hello Katie!" with `useAuth().user.first_name`
- Profile completion bar reads from `profile_completion` field

### 3.4 ApplicationsSection — connect data (30 min)

**File:** `components/user/dashboard/sections/ApplicationsSection.tsx`

Changes:
- Add `useEffect` → `getMyApplications()`
- Replace hardcoded `data: Application[]` with response
- Status mapping: backend `submitted`→frontend `applied`, `approved`→`accepted`, etc.
- Type mapping: backend values → frontend tab filter values

### 3.5 BookmarksSection — connect data (45 min)

**File:** `components/user/dashboard/sections/BookmarksSection.tsx`

Changes:
- Add `useEffect` that calls `getBookmarks()` on mount, refetches on tab change
- Tab change → `getBookmarks('college')` / `getBookmarks('scholarship')` etc.
- "Remove" button → `deleteBookmark(id)`
- Map backend item data to frontend card display fields

### 3.6 CalendarSection — connect CRUD (1 hour)

**File:** `components/user/dashboard/sections/CalendarSection.tsx`

Changes:
- `useEffect` → `getCalendarEvents()` on mount
- Replace `generateInitialEvents()` with API data
- Map `start_date`/`end_date` → `Date` objects
- Create event modal → `createCalendarEvent()`
- Edit event → `updateCalendarEvent()`
- Delete event → `deleteCalendarEvent()`
- Type filter → filter by backend `type` field

### 3.7 ChatSection — connect messages (1 hour)

**File:** `components/user/dashboard/sections/ChatSection.tsx`

Changes:
- `useEffect` → `getMessageContacts()` + `getMessages()` on mount
- Contact list → `getMessageContacts()` provides conversation summary
- Active conversation messages → filter `getMessages()` by sender/receiver
- Send message → `createMessage()`
- Reply → `replyToMessage()`
- Map backend contacts to frontend `Conversation` interface
- Map backend messages to frontend `Message` interface

### 3.8 NotificationsSection — connect notifications (30 min)

**File:** `components/user/dashboard/sections/NotificationsSection.tsx`

Changes:
- `useEffect` → `getStudentNotifications()` on mount
- Replace `mockNotifications` with API data
- Mark read → `markNotificationRead(id)`
- Mark all read → `markAllNotificationsRead()`
- Archive handled locally (add `isArchived` to a local `Set<number>` or localStorage)

### 3.9 ProfileSection — connect profile (1 hour)

**File:** `components/user/dashboard/sections/ProfileSection.tsx`

Changes:
- `useEffect` → `getProfile()` on mount
- Replace hardcoded `personalData` default state with profile response
- Save button → `updateProfile()` for first/last name
- Education add/edit/delete → `POST/PUT/DELETE /api/v1/profile/education`
- Preferences save → `savePreferences()`
- Enable `PreferenceModal` in DashboardLayout

### 3.10 SettingsSection — connect actions (30 min)

**File:** `components/user/dashboard/sections/SettingsSection.tsx`

Changes:
- Change password form → `changePassword()`
- Contact support form → `submitContactInquiry()`
- Report bug form → `submitContactInquiry()` with type "bug"
- Notification toggles → stored in localStorage (no backend support yet)

### 3.11 SphereInvitesSection — connect invites (45 min)

**File:** `components/user/dashboard/sections/SphereInvitesSection.tsx`

Changes:
- `useEffect` → `getInvites()` on mount
- Replace hardcoded `invites` array with API response
- Accept/Save/Decline buttons → `acceptInvite(id)` / `saveInvite(id)` / `declineInvite(id)`
- Stats cards → compute totals from response data
- Map backend fields to frontend display

### 3.12 PreferenceModal — connect to backend (15 min)

**File:** `components/user/dashboard/PreferenceModal.tsx`

Changes:
- Uncomment import in DashboardLayout
- Wire Save button → `savePreferences()` with form data
- Pre-fill with existing preferences from profile

### Verification:
- Navigate to each section
- Confirm data loads from backend (not hardcoded)
- Confirm mutations work (create, update, delete)

---

## Phase 4 — Auth Middleware (30 min)

### 4.1 Create middleware.ts

**File:** `studsnew/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
    || request.cookies.get('Authorization')?.value;
  
  if (!token && request.nextUrl.pathname.startsWith('/user/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/user/dashboard/:path*']
};
```

### Verification:
- Clear cookies → navigating to `/user/dashboard` redirects to `/login`
- With valid auth → dashboard loads

---

## Phase 5 — Loading & Error States (30 min)

### 5.1 Add loading.tsx

**File:** `studsnew/app/user/dashboard/loading.tsx`

```tsx
export default function DashboardLoading() {
  return (
    <div className="animate-pulse p-6">
      <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
      <div className="grid grid-cols-3 gap-6 mb-6">
        {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded" />)}
      </div>
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  );
}
```

### 5.2 Add error.tsx

**File:** `studsnew/app/user/dashboard/error.tsx`

Standard error boundary with retry button.

### 5.3 Each section handles loading/error

- Add `loading` and `error` states to each section's data fetching
- Show skeleton/spinner during load
- Show error message with retry on failure

---

## Phase 6 — Polish & Edge Cases (1 hour)

### 6.1 Empty states
- Each section: show appropriate message when there's no data
- "No applications yet" for ApplicationsSection
- "No events" for CalendarSection
- "No bookmarks" for BookmarksSection

### 6.2 Refetch on navigation
- Use `useEffect` + pathname to refetch when user navigates between sections
- Or use React Query's `refetchOnMount`

### 6.3 Toast/feedback
- Show success toast on mutations (create bookmark, send message, etc.)

### 6.4 Console cleanup
- Remove all console.log statements
- Ensure no unhandled Promise rejections

---

## Phase 7 — Verification & Testing (30 min)

### 7.1 TypeScript check
```bash
npm run lint
```

### 7.2 E2E walkthrough
- Login → land on dashboard → verify all stats load
- Click each sidebar item → verify data loads
- Create a bookmark → verify it appears
- Send a message → verify it appears in chat
- Create calendar event → verify it appears in calendar
- Update profile → verify changes persist after refresh

### 7.3 Error handling
- Stop backend → verify error states display properly
- Start backend → verify retry works

---

## Summary Timeline

| Phase | Description | Duration | Dependencies |
|---|---|---|---|
| P0 | Prerequisites | 30 min | None |
| P1 | Backend new endpoints | 3-4 hrs | None |
| P2 | API service layer | 1-2 hrs | P1 |
| P3 | Connect 12 sections | 5-6 hrs | P2 |
| P4 | Auth middleware | 30 min | None |
| P5 | Loading/error states | 30 min | P3 |
| P6 | Polish & edge cases | 1 hr | P3 |
| P7 | Verification | 30 min | All |

**Total estimated effort: ~12-15 hours**

## Parallelization Opportunities

| Worker A (Backend) | Worker B (Frontend) |
|---|---|
| P1.1 Dashboard stats | P2 API service types |
| P1.2 My applications | P3.3 DashboardSection connect |
| P1.3 Password change | P4 Auth middleware |
| P1.4 Calendar type field | P3.6 CalendarSection connect |
| P1.5 Enhanced bookmarks | P3.5 BookmarksSection connect |
| P1.6 Profile model expand | P3.9 ProfileSection connect |

## Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Backend model changes (P1.4-1.6) may conflict with auto-migration | Adds columns, should be safe | Test migration on dev DB first |
| Bookmark enrichment (P1.5) with dynamic JOIN may be complex | Could delay | Fallback: fetch items individually on frontend |
| Profile model expansion (P1.6) touches existing User table | Migration could break existing users | Add nullable columns with defaults |
| All 12 sections connected simultaneously is high risk for regressions | Could break unrelated parts | Connect one section at a time, verify each |
| No notification archive on backend | UX gap | Handle archive in localStorage |
