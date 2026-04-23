# StudSphere Blogs - Backend Integration Plan

## Overview

The blogs feature already has **partial backend integration** via `/services/blogApi.ts`. This document outlines the current architecture, identified gaps, and recommended improvements.

---

## Current Architecture

### Existing API Service

**Location**: `/services/blogApi.ts`

The service handles:
- Public blog listing & filtering
- Single blog fetching (by ID)
- Admin CRUD operations (create, update, delete)
- Local storage fallback when backend is offline

### API Endpoints Expected

| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/api/v1/education/blogs` | Implemented |
| GET | `/api/v1/education/blogs/:id` | Implemented |
| GET | `/api/v1/superadmin/blogs` | Implemented |
| POST | `/api/v1/superadmin/blogs` | Implemented |
| PUT | `/api/v1/superadmin/blogs/:id` | Implemented |
| DELETE | `/api/v1/superadmin/blogs/:id` | Implemented |

---

## Current Data Model

### BlogEntry Interface

```typescript
interface BlogEntry {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  read_time: string;
  featured: boolean;
  published: boolean;
  views: number;
  created_at: string;
}
```

### BlogMeta Interface

```typescript
interface BlogMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
```

---

## Page Components

### Public Pages

| Route | Component | Data Source |
|-------|-----------|------------|
| `/blogs` | `BlogPage.tsx` | `fetchPublicBlogs()` |
| `/blogs/[id]` | `BlogDetailsPage.tsx` | `fetchPublicBlogById()` |

### Admin Pages

| Route | Component | Data Source |
|-------|-----------|------------|
| `/superadmin/blogs` | `superadmin/blogs/page.tsx` | `fetchAdminBlogs()` |

---

## Category System

### Defined Categories

```typescript
type BlogCategoryFilter =
  | "All News"
  | "Admission"
  | "Scholarship"
  | "Exams"
  | "Notice"
  | "Events"
  | "Achievements"
  | "Others";
```

### Category Badge Mapping

| Category | Badge Color |
|----------|------------|
| Scholarship | `bg-emerald-500` |
| Admission | `bg-blue-700` |
| Exams | `bg-red-500` |
| Events | `bg-purple-500` |
| Achievements | `bg-amber-500` |
| Notice | `bg-indigo-500` |
| Others | `bg-slate-500` |

---

## Features Implemented

### Public Blog Page (`/blogs`)

- [x] Category filtering (pill buttons)
- [x] Sort by: Newest / Oldest / Most Popular
- [x] Pagination (12 items per page)
- [x] Featured blog hero section
- [x] Featured blog auto-selection (first featured or first item)
- [x] Loading state spinner
- [x] Empty state message
- [x] Author avatar (DiceBear)
- [x] Date formatting

### Blog Detail Page (`/blogs/[id]`)

- [x] Full blog content rendering
- [x] Related blogs section
- [x] Author information
- [x] Category badge
- [x] Reading time
- [x] Date display

### Admin Panel (`/superadmin/blogs`)

- [x] Blog listing with filters
- [x] Create new blog
- [x] Edit existing blog
- [x] Delete blog
- [x] Toggle publish status

---

## Missing / Gaps

### Critical Gaps

1. **No Server-Side Rendering** - All blog pages are client-side using `useEffect`
2. **No SEO Metadata** - Missing `generateMetadata` for blog posts
3. **No Image Upload** - Backend must support image upload/gestion
4. **No Rich Text Editor** - Content uses plain text, needs WYSIWYG

### Functional Gaps

5. **No Search** - Search functionality not implemented in UI
6. **No Tags Filtering** - Tags exist in data but not used for filtering
7. **No Social Sharing** - Share buttons not implemented
8. **No View Counting** - `views` field exists but not incremented

### UX Gaps

9. **No Skeleton Loading** - Uses spinner instead of skeleton cards
10. **No Infinite Scroll** - Uses pagination buttons
11. **No Bookmarks** - Bookmark functionality not implemented
12. **No Related Sliders** - Related blogs not interactive

---

## Backend API Requirements

### Required Backend Endpoints

```yaml
# Public API
GET    /api/v1/education/blogs
       - query: page, limit, category, search, sort
       - response: { blogs: BlogEntry[], meta: BlogMeta }

GET    /api/v1/education/blogs/:id
       - response: { blog: BlogEntry, related: BlogEntry[] }

POST   /api/v1/education/blogs/:id/view
       - increments view count

# Admin API (requires auth)
GET    /api/v1/superadmin/blogs
       - query: page, limit, category, search, status
       - response: { blogs: BlogEntry[], meta: BlogMeta }

POST   /api/v1/superadmin/blogs
       - body: { title, excerpt, content, image, author, category, tags, featured, published }
       - response: { data: BlogEntry }

PUT    /api/v1/superadmin/blogs/:id
       - body: Partial<BlogEntry>
       - response: { data: BlogEntry }

DELETE /api/v1/superadmin/blogs/:id
       - response: { message: string }

# Image Upload
POST   /api/v1/upload
       - multipart/form-data: image
       - response: { url: string }
```

### Database Schema (Recommended)

```sql
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image VARCHAR(500),
  author VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  tags TEXT[],
  read_time VARCHAR(20),
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blogs_category ON blogs(category);
CREATE INDEX idx_blogs_published ON blogs(published);
CREATE INDEX idx_blogs_created_at ON blogs(created_at);
```

---

## Implementation Plan

### Phase 1: Server-Side Rendering

Convert blog pages to Server Components:

```
/app/blogs
├── page.tsx                    # Server Component
│   ├── fetchPublicBlogs()
│   └── generateMetadata()
└── [id]/
    └── page.tsx               # Server Component
        ├── fetchPublicBlogById()
        └── generateMetadata()
```

### Phase 2: SEO Optimization

- Add OpenGraph tags
- Add JSON-LD structured data
- Add canonical URLs

### Phase 3: Enhanced Features

- [ ] Implement search functionality
- [ ] Add tags filtering
- [ ] Add skeleton loading states
- [ ] Add social sharing buttons

### Phase 4: Analytics

- [ ] Track blog views
- [ ] Track category popularity
- [ ] Track read completion rates

---

## File Structure

```
/app
├── blogs/
│   ├── page.tsx              # Server Component
│   └── [id]/
│       └── page.tsx           # Server Component
├── api/
│   └── v1/
│       └── education/
│           └── blogs/
│               └── route.ts
/services
├── blogApi.ts               # Already exists
/components
├── blogs/
│   ├── BlogPage.tsx        # Receive data as props
│   ├── BlogDetailsPage.tsx  # Receive data as props
│   └── BlogCard.tsx
/docs
├── blogs-backend-integration-plan.md  # This file
```

---

## Testing Checklist

- [ ] API returns correct data shape
- [ ] Category filtering works
- [ ] Sort options work (Newest/Oldest/Popular)
- [ ] Pagination works correctly
- [ ] Featured blog displays correctly
- [ ] Blog detail loads with related posts
- [ ] 404 handled for invalid blog IDs
- [ ] Loading states display properly
- [ ] Empty states handled gracefully
- [ ] Admin CRUD operations work

---

## Notes

- The existing service uses localStorage fallback — good for development
- Backend is expected at `NEXT_PUBLIC_API_URL` (default: `http://localhost:8080`)
- Consider adding RTK Query or React Query for better caching
- The `slug` field exists butroutes use numeric IDs — consider slug-based routing