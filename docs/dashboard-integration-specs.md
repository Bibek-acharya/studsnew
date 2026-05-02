# User Dashboard — Integration Specification

## Overview

Connect all 13 sub-pages of `/user/dashboard` to the backend API at `http://localhost:8080/api/v1`.

## Architecture

```
Browser ──► Next.js App Router
              ├── Server Component (page.tsx)
              │     └── fetches data via Server Actions
              ├── Client Component (Section.tsx)
              │     ├── receives props (initial data)
              │     └── handles interactivity + mutations
              ├── Server Action (actions/*.ts)
              │     └── calls apiService
              └── API Service (services/api.ts)
                    └── fetch() → backend (credentials: "include")
```

## Auth Model

- JWT token stored in HTTP-only cookie (set by backend on login)
- Auth state in `AuthContext` (persisted to localStorage as `studsphere_user`)
- Token also stored in localStorage as `token` (for fallback)
- `apiRequest()` uses `credentials: "include"` — no Authorization header
- 401 responses dispatch `auth-expired` custom event → redirects to `/login`

---

## Section Specifications

### 1. Dashboard (main) — `/user/dashboard`

**Data needed:**
| Block | Fields | Backend Source |
|---|---|---|
| Greeting | `user.first_name` | `useAuth()` context |
| Profile completion | `completion_percentage`, missing fields list | `GET /api/v1/profile` (compute on frontend) |
| Stats cards (3) | applications_submitted, saved_colleges, scholarships_applied | `GET /api/v1/dashboard/stats` **(new)** |
| Recent applications | `[{institution, program, status, updated_at}]` (last 5) | `GET /api/v1/dashboard/recent-applications` **(new)** |
| Mini calendar | Upcoming events for current month | `GET /api/v1/calendar/events` |

**Backend response shape** (new endpoints):
```
GET /api/v1/dashboard/stats
{
  "success": true,
  "data": {
    "applications_submitted": 5,
    "saved_colleges": 12,
    "scholarships_applied": 3,
    "profile_completion": 85
  }
}

GET /api/v1/dashboard/recent-applications
{
  "success": true,
  "data": [
    {
      "id": 1,
      "institution": "Stanford University",
      "program": "Undergraduate",
      "type": "admission",
      "status": "submitted",
      "updated_at": "2026-04-01T10:00:00Z"
    }
  ]
}
```

---

### 2. My Applications — `/user/dashboard/applications`

**Data needed:** Unified list of all application types.

**Backend source:** New aggregate endpoint combining 3 sources:
- `GET /api/v1/admissions/my`
- `GET /api/v1/scholarships/my-applications`
- (entrance applications if available)

**Backend response shape** (new endpoint):
```
GET /api/v1/my-applications?page=1&limit=20
{
  "success": true,
  "data": [
    {
      "id": 1,
      "institution": "Tribhuvan University",
      "program": "Engineering",
      "type": "admission" | "entrance" | "scholarship",
      "status": "applied" | "shortlisted" | "interview" | "accepted" | "rejected",
      "applied_date": "2026-03-15T00:00:00Z",
      "deadline": "2026-04-30T00:00:00Z",
      "location": "Kathmandu"
    }
  ],
  "meta": { "total": 4, "page": 1, "limit": 20 }
}
```

**Backend field → Frontend field mapping:**
| Backend | Frontend |
|---|---|
| `institution` (string) | `institution` |
| `type` ("admission"\|"entrance"\|"scholarship") | `type` (lowered) |
| `status` → `status` mapping | `submitted`→`applied`, `approved`→`accepted`, `pending_review`→`shortlisted` |

---

### 3. Bookmarks — `/user/dashboard/bookmarks`

**Data needed:** Tabbed bookmarks grouped by type.

**Existing backend endpoints:**
- `GET /api/v1/bookmarks/:type` — lists bookmark metadata only (item_id, item_type)
- `POST /api/v1/bookmarks` — body: `{ item_id, type }`
- `DELETE /api/v1/bookmarks/:id`

**Problem:** Bookmarks only store id + type. The frontend needs full item data (college name, rating, location, etc.). Two approaches:

**Approach A (recommended):** Enrich bookmarks on the backend by JOINing the related tables.
- `GET /api/v1/bookmarks?type=college` returns bookmarks with the full college/course/scholarship/event/entrance data embedded.

**Approach B:** Frontend fetches bookmark list, then fetches each item by ID via existing public endpoints (e.g., `GET /api/v1/colleges/:id`).

**Backend response shape** (enhanced `GET /api/v1/bookmarks/:type`):
```
{
  "success": true,
  "data": {
    "bookmarks": [
      {
        "id": 1,
        "item_id": 42,
        "type": "college",
        "created_at": "...",
        "item": {
          "name": "Pulchowk Campus",
          "location": "Lalitpur",
          "rating": 4.5,
          "affiliation": "IOE",
          "college_type": "Public",
          "verified": true,
          "featured": false,
          "image_url": "..."
        }
      }
    ]
  }
}
```

---

### 4. Calendar — `/user/dashboard/calendar`

**Data needed:** Events for calendar grid, CRUD operations.

**Existing backend endpoints:**
- `GET /api/v1/calendar/events` — list all events for user
- `POST /api/v1/calendar/events` — body: `{ title, description, start_date, end_date, location, link, color, reminder }`
- `PUT /api/v1/calendar/events/:id` — update event
- `DELETE /api/v1/calendar/events/:id` — delete event

**Backend response shape** (existing):
```
GET /api/v1/calendar/events
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "MIT Application Deadline",
      "description": "",
      "start_date": "2026-04-10T08:00:00Z",
      "end_date": "2026-04-10T09:00:00Z",
      "location": "",
      "link": "",
      "color": "",
      "reminder": true,
      "user_id": 1,
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

**Backend → Frontend field mapping:**
| Backend | Frontend |
|---|---|
| `start_date` (ISO 8601) | `event.start` (Date) |
| `end_date` (ISO 8601) | `event.end` (Date) |
| *(missing)* | `event.type` — add `type` field to backend CalendarEvent model, or default to "events" |

**Missing:** CalendarEvent model has no `type` field. Backend needs:
- Add `Type string` field to CalendarEvent model/migration
- Accept `type` in create/update requests

---

### 5. Messages/Chat — `/user/dashboard/chat`

**Data needed:** Conversation list, messages, contact info, send/reply.

**Existing backend endpoints:**
- `GET /api/v1/messages` — paginated message list
- `GET /api/v1/messages/:id` — single message
- `POST /api/v1/messages` — body: `{ receiver_id, subject, content }`
- `POST /api/v1/messages/:id/reply` — body: `{ content }`
- `GET /api/v1/messages/contacts` — contact list

**Backend response shape** (existing):
```
GET /api/v1/messages
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": 1,
        "sender_id": 1,
        "receiver_id": 2,
        "subject": "Application Status",
        "content": "Your application is under review.",
        "read": false,
        "direction": "incoming"|"outgoing",
        "created_at": "...",
        "updated_at": "..."
      }
    ],
    "meta": { "total": 10, "page": 1, "limit": 20 }
  }
}

GET /api/v1/messages/contacts
{
  "success": true,
  "data": [
    {
      "user_id": 2,
      "name": "Stanford University",
      "last_message": "Your application is under review.",
      "unread": 1
    }
  ]
}
```

**Frontend adaptation needed:**
- Backend has flat messages, frontend groups by conversation. Group by `sender_id`/`receiver_id` on the frontend.
- Subject line → conversation summary.
- Contacts endpoint provides the conversation list with last message preview.

---

### 6. Counselling — `/user/dashboard/counselling`

**Status:** Already connected. No changes needed.

**Existing endpoint:** `GET /api/v1/counselling/bookings/my`

---

### 7. Notifications — `/user/dashboard/notifications`

**Data needed:** Notification list with read/archive.

**Existing backend endpoints:**
- `GET /api/v1/notifications?page=1&limit=20` — list
- `PUT /api/v1/notifications/:id/read` — mark read
- `PUT /api/v1/notifications/read-all` — mark all read

**Backend response shape** (existing):
```
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "title": "Application Status Update",
        "message": "Stanford University has updated...",
        "type": "system"|"application"|"scholarship"|"event",
        "read": false,
        "link": "/applications/1",
        "created_at": "..."
      }
    ],
    "unread_count": 3,
    "meta": { "total": 10, "page": 1, "limit": 20 }
  }
}
```

**Backend → Frontend field mapping:**
| Backend | Frontend |
|---|---|
| `type` (string) | `category` — map: `system`→`system`, others→`following` |
| `created_at` (ISO 8601) | `time` — format as relative ("2m ago") using `date-fns` |
| `read` (bool) | `unread` — inverted |
| *(backend has no archive)* | `archived` — handled locally OR add archive to backend |

**Note:** Backend has no archive functionality. Two options:
1. Add archived flag to backend Notification model
2. Handle archive locally in localStorage (simpler, but lost on logout)

---

### 8. Profile — `/user/dashboard/profile`

**Data needed:** Personal details, education history, study preferences, documents.

**Existing backend endpoints:**
- `GET /api/v1/profile` — get profile
- `PUT /api/v1/profile` — update profile (body: `{ first_name, last_name }`)
- `POST /api/v1/preferences` — save onboarding preferences

**Backend response shape** (existing):
```
GET /api/v1/profile
{
  "success": true,
  "data": {
    "id": 1,
    "email": "alex@example.com",
    "first_name": "Alex",
    "last_name": "Student",
    "role": "student",
    "preferences": {
      "id": 1,
      "role": "student",
      "preference_flow": "college",
      "preferences": {
        "target_level": "Bachelor",
        "preferred_field": "Computer Science",
        ...
      },
      "onboarding_completed": true,
      "completed_at": "..."
    }
  }
}
```

**Frontend state → Backend mapping:**
| Frontend field | Backend field | Endpoint |
|---|---|---|
| `firstName`, `lastName` | `first_name`, `last_name` | `PUT /api/v1/profile` |
| `dateOfBirth`, `gender`, `nationality`, `phone`, `address` | Not in current User model — add fields OR store in `preferences.preferences` JSONB | Need backend changes |
| `education` entries | No Education model — create OR store in preferences | Need backend changes |
| `preferredStudy` fields | `preferences.preferences` map | `POST /api/v1/preferences` |
| `documents` (files) | Use authenticated direct upload to backend `/uploads` endpoint | Need backend changes |

**Required backend model changes:**
- Add `phone`, `date_of_birth`, `gender`, `nationality`, `address` fields to User model
- Create Education model (user_id, level, institution, board, stream, start_year, end_year, grade)
- Create Education CRUD endpoints: `GET/POST/PUT/DELETE /api/v1/profile/education`
- Create document upload endpoint (direct backend storage)

---

### 9. Reviews — `/user/dashboard/reviews`

**Status:** Already connected via server actions. No changes needed.

**Existing endpoints:** `GET/PUT/DELETE /api/v1/user/reviews`, `POST /:id/report`

---

### 10. Settings — `/user/dashboard/settings`

**Data needed:** Password change, notification prefs, contact/report forms.

**Existing/needed endpoints:**
- `PUT /api/v1/auth/change-password` — **(new)** body: `{ current_password, new_password }`
- `POST /api/v1/system/contact` — existing, body: `{ name, email, phone, subject, message, type }`

**Note:** No notification preference model exists for student users (only for institution/provider). Settings are toggleable on frontend only — can be stored in localStorage until backend support is added.

---

### 11. Sphere Invites — `/user/dashboard/sphereinvites`

**Data needed:** Invite list with accept/decline/save actions.

**Existing backend endpoints:**
- `GET /api/v1/invites?page=1&limit=10`
- `PUT /api/v1/invites/:id/accept`
- `PUT /api/v1/invites/:id/decline`
- `PUT /api/v1/invites/:id/save`

**Backend response shape** (existing):
```
GET /api/v1/invites
{
  "success": true,
  "data": {
    "invites": [
      {
        "id": 1,
        "title": "Harvard Merit Scholarship 2026",
        "message": "Full merit-based scholarship...",
        "status": "pending"|"accepted"|"declined"|"saved",
        "type": "scholarship"|"admission"|"event",
        "created_at": "..."
      }
    ],
    "meta": { "total": 6, "page": 1, "limit": 10 }
  }
}
```

**Backend → Frontend field mapping:**
| Backend | Frontend |
|---|---|
| `title` | `title` |
| `message` | `description` |
| `type` | `type` — already matches |
| `status` | Used for filter. `pending` → show accept/decline/save buttons |
| *(missing)* | `organization` — add `institution_name` from join with InstitutionUser |
| *(missing)* | `deadline`, `amount`, `priority` — add optional fields to SphereInvite model |

---

### 12. FAQ — `/user/dashboard/faq`

**Status:** Static content. No backend changes needed.

---

### 13. Study Resources — `/user/dashboard/resources`

**Status:** Static/hardcoded. No backend exists.

**Option A:** Create backend model + CRUD for educational resources (PDFs, guides).
**Option B:** Keep as static content (no backend required). Recommended for now.

---

## Dashboard Layout (Header + Sidebar)

**Header user info:**
| Current (hardcoded) | Replacement |
|---|---|
| "Katie Smith" | `useAuth().user.first_name + " " + useAuth().user.last_name` |
| "KS" initials | Initials from first/last name |
| Notification badge count | `getStudentNotifications().data.unread_count` |

**Sidebar badges:**
| Current | Replacement |
|---|---|
| Chat badge "3" | Count of unread messages from `getMessages()` |
| Notifications badge "16" | `getStudentNotifications().data.unread_count` |

**Header notification dropdown:**
- Replace inline state with `getStudentNotifications()`
- Wire "Mark all read" to `markAllNotificationsRead()`
- Wire individual mark read to `markNotificationRead(id)`

## Backend Changes Summary

| # | Endpoint | Method | Module | Status |
|---|---|---|---|---|
| 1 | `/api/v1/dashboard/stats` | GET | studentdashboard | **NEW** |
| 2 | `/api/v1/dashboard/recent-applications` | GET | studentdashboard | **NEW** |
| 3 | `/api/v1/my-applications` | GET | admission + scholarship | **NEW** |
| 4 | `/api/v1/auth/change-password` | PUT | auth | **NEW** |
| 5 | `/api/v1/profile/education` | GET/POST | auth | **NEW** |
| 6 | `/api/v1/profile/education/:id` | PUT/DELETE | auth | **NEW** |
| 7 | CalendarEvent: add `type` field | migration | studentdashboard | **MODIFY** |
| 8 | SphereInvite: add `deadline`, `amount`, `priority`, `organization` fields | migration | studentdashboard | **MODIFY** |
| 9 | Bookmark response enrichment (JOIN item data) | service | studentdashboard | **MODIFY** |
| 10 | User model: add `phone`, `date_of_birth`, `gender`, `nationality`, `address` | migration | auth | **MODIFY** |
