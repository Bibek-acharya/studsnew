# StudSphere Events - Backend Integration Plan

## Overview

The events feature currently uses **static mock data** from `/lib/events-data.ts`. This document outlines the architecture, gaps, and integration roadmap.

---

## Current Architecture

### Data Source

**Location**: `/lib/events-data.ts`

```typescript
interface Event {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  image: string;
  organizer: string;
  location: string;
  date: string;
  time: string;
  registrationFee: string;
  interestedCount: number;
}
```

### Page Routing

| Route | Component | Data Source |
|-------|-----------|------------|
| `/events` | `EventsPage.tsx` | `getAllEvents()` |
| `/events/[id]` | `EventDetailsPage.tsx` | `getEventById()`, `getRelatedEvents()` |

---

## Features Implemented

### Events Page (`/events`)

- [x] Category filtering (pill buttons)
- [x] Sort by: Newest / Oldest / Popular
- [x] Pagination (12 items per page)
- [x] Featured event hero section
- [x] Bookmark functionality (localStorage)
- [x] Event card display
- [x] Date/time display
- [x] Location display
- [x] Organizer info
- [x] Registration fee display
- [x] Interested count

### Category System

| Filter | Data Category | Badge Color |
|--------|------------|-----------|
| All News | - | - |
| Feast & Concert | - | `bg-blue-500` |
| Seminar & Workshop | Workshop, Seminar | `bg-[#00c2a8]` |
| Career Fairs | Job Fair | `bg-orange-500` |
| Hackthons | Hackathon | `bg-blue-500` |
| Cultural Programs | - | `bg-blue-500` |
| Achievements | - | `bg-blue-500` |
| Others | - | `bg-blue-500` |

---

## Missing / Gaps

### Critical Gaps

1. **No Backend API** - Using static data file only
2. **No Server-Side Rendering** - Client-side with useEffect/useMemo
3. **No Registration System** - "Register Now" button is UI only
4. **No User Registrations Tracking** - No database for event signups

### Functional Gaps

5. **No Search** - Search not implemented
6. **No Registration Status** - Can't check if already registered
7. **No Event Capacity** - No max attendees tracking
8. **No Waitlist** - When event is full

### UX Gaps

9. **Static Date Display** - Shows "Oct 25, 2024" hardcoded
10. **No Calendar Integration** - Can't add to calendar
11. **No Reminders** - No reminder notifications
12. **No Share Buttons** - Social sharing not implemented

---

## Backend API Requirements

### Required Endpoints

```yaml
# Public API
GET    /api/v1/education/events
       - query: page, limit, category, search, sort, featured
       - response: { events: Event[], meta: PaginationMeta }

GET    /api/v1/education/events/:id
       - response: { event: Event, related: Event[] }

# Registration API (requires auth)
POST   /api/v1/education/events/:id/register
       - body: { userId, notes }
       - response: { registration: EventRegistration }

GET    /api/v1/education/events/:id/registrations
       - response: { registrations: EventRegistration[], count: number }

DELETE /api/v1/education/events/:id/register
       - response: { message: string }

# Bookmarks API
POST   /api/v1/user/bookmarks
       - body: { type: "event", itemId }
       - response: { bookmark }

DELETE /api/v1/user/bookmarks/:type/:itemId
       - response: { message }
```

### Database Schema

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  description TEXT,
  category VARCHAR(50),
  image VARCHAR(500),
  organizer VARCHAR(100),
  location VARCHAR(255),
  date TIMESTAMP NOT NULL,
  time VARCHAR(50),
  registration_fee VARCHAR(50),
  capacity INT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(id),
  user_id INT REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'registered',
  notes TEXT,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);

CREATE TABLE event_bookmarks (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(id),
  user_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);
```

---

## Implementation Plan

### Phase 1: API Layer

Create `/app/api/v1/education/events/route.ts`:

```typescript
// GET /api/v1/education/events
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const events = await getEvents({
    category: searchParams.get("category"),
    search: searchParams.get("search"),
    sort: searchParams.get("sort") || "newest",
    limit: parseInt(searchParams.get("limit") || "12"),
    page: parseInt(searchParams.get("page") || "1"),
  });
  return Response.json({ events, meta: {...} });
}
```

### Phase 2: Service Layer

Create `/services/eventService.ts`:

```typescript
export async function getEvents(filters: EventFilters): Promise<{ events: Event[]; meta: Meta }>
export async function getEventById(id: string): Promise<Event | null>
export async function registerForEvent(eventId: string, userId: string): Promise<Registration>
export async function cancelRegistration(eventId: string, userId: string): Promise<void>
```

### Phase 3: Convert to Server Components

```
/app
├── events/
│   ├── page.tsx              # Server Component
│   │   ├── getEvents()
│   │   └── generateMetadata()
│   └── [id]/
│       └── page.tsx           # Server Component
│           ├── getEventById()
│           └── generateMetadata()
```

### Phase 4: Registration Features

- [ ] Add registration form
- [ ] Show registration status
- [ ] Display attendee count
- [ ] Add capacity limit handling

---

## File Structure

```
/app
├── events/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
├── api/
│   └── v1/
│       └── education/
│           └── events/
│               └── route.ts
/services
├── eventService.ts
├── registrationService.ts
/lib
├── events-data.ts          # Can remove after migration
/components
├── events/
│   ├── EventsPage.tsx
│   ├── EventDetailsPage.tsx
│   └── EventCard.tsx
/docs
├── events-backend-integration-plan.md
```

---

## Caching Strategy

| Endpoint | Cache Strategy | Revalidation |
|----------|---------------|--------------|
| `/api/v1/education/events` | `revalidate: 300` | 5 min |
| `/api/v1/education/events/:id` | `revalidate: 60` | 1 min |

---

## Testing Checklist

- [ ] Events list loads with correct data
- [ ] Category filtering works
- [ ] Sort options work correctly
- [ ] Pagination works
- [ ] Featured event displays in hero
- [ ] Event detail loads with related events
- [ ] Bookmark saves to localStorage/user account
- [ ] Registration flow works
- [ ] 404 handled for invalid event IDs

---

## Notes

- The `interestedCount` should become `registeredCount` from actual registrations
- Consider adding event status: `upcoming`, `ongoing`, `completed`, `cancelled`
- Add waitlist when capacity is reached
- Consider location coordinates for map display