# StudSphere News - Backend Integration Plan

## Overview

The news feature currently uses **static mock data** from `/lib/news-data.ts`. This document outlines the architecture, gaps, and integration roadmap.

---

## Current Architecture

### Data Source

**Location**: `/lib/news-data.ts`

```typescript
interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  source: string;
  tags: string[];
}
```

### Page Routing

| Route | Component | Data Source |
|-------|-----------|------------|
| `/news` | `NewsPage.tsx` | `getAllNews()` |
| `/news/[id]` | `NewsDetailsPage.tsx` | `getNewsById()`, `getRelatedNews()` |

---

## Features Implemented

### News Page (`/news`)

- [x] Category filtering (pill buttons)
- [x] Sort by: Newest / Oldest
- [x] Pagination (8 items per page)
- [x] Featured news hero section
- [x] News card display with image
- [x] Category badge
- [x] Excerpt display (line-clamp-2)
- [x] Author info
- [x] Source attribution

### Category Mapping

| UI Category | Data Category | Badge Style |
|------------|-------------|------------|
| All News | - | - |
| Admission | Academic | `bg-blue-100 text-blue-700` |
| Exams | Tech | `bg-orange-100 text-orange-700` |
| Scholarship | - | `bg-emerald-100 text-emerald-700` |
| Notice | Policy | `bg-violet-100 text-violet-700` |
| Events | - | `bg-pink-100 text-pink-700` |
| Achievements | - | `bg-amber-100 text-amber-700` |
| Others | Jobs, etc. | `bg-slate-100 text-slate-700` |

---

## Missing / Gaps

### Critical Gaps

1. **No Backend API** - Using static data file only
2. **No Server-Side Rendering** - Client-side with useMemo
3. **No SEO Metadata** - Missing for news articles
4. **No Rich Content** - Content is plain text only

### Functional Gaps

5. **No Search** - Search not implemented
6. **No Tags Filtering** - Tags exist but unused in UI
7. **No Social Sharing** - Share buttons not implemented
8. **No Comments** - No comment system

### UX Gaps

9. **Static Date Display** - Shows "90 days ago" hardcoded
10. **No Share Count** - No social share metrics
11. **No Read Time** - Shows hardcoded value
12. **No Image Lazy Loading** - Should use next/image

---

## Backend API Requirements

### Required Endpoints

```yaml
# Public API
GET    /api/v1/education/news
       - query: page, limit, category, search, sort, featured
       - response: { news: NewsArticle[], meta: PaginationMeta }

GET    /api/v1/education/news/:id
       - response: { article: NewsArticle, related: NewsArticle[] }

# Admin API (requires auth)
POST   /api/v1/superadmin/news
       - body: { title, excerpt, content, image, author, category, tags, source }
       - response: { article: NewsArticle }

PUT    /api/v1/superadmin/news/:id
       - body: Partial<NewsArticle>
       - response: { article: NewsArticle }

DELETE /api/v1/superadmin/news/:id
       - response: { message: string }
```

### Database Schema

```sql
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image VARCHAR(500),
  author VARCHAR(100),
  category VARCHAR(50),
  read_time VARCHAR(20),
  source VARCHAR(100),
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_published ON news(is_published);
CREATE INDEX idx_news_created_at ON news(created_at DESC);
```

---

## Rich Content Options

The current `content` field stores plain text. Consider:

### Option 1: HTML Storage
```sql
content TEXT  -- Store HTML directly
```

### Option 2: Markdown (Recommended)
```sql
content TEXT  -- Store Markdown
-- Parse with react-markdown on render
```

### Option 3: Block Content
```sql
content JSONB  -- Rich content blocks
-- { type: "paragraph", children: [...] }
```

---

## Implementation Plan

### Phase 1: API Layer

Create `/app/api/v1/education/news/route.ts`:

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const news = await getNews({
    category: searchParams.get("category"),
    search: searchParams.get("search"),
    sort: searchParams.get("sort") || "newest",
    limit: parseInt(searchParams.get("limit") || "8"),
    page: parseInt(searchParams.get("page") || "1"),
  });
  return Response.json({ news, meta: {...} });
}
```

### Phase 2: Service Layer

Create `/services/newsService.ts`:

```typescript
export async function getNews(filters: NewsFilters): Promise<{ news: NewsArticle[]; meta: Meta }>
export async function getNewsById(id: string): Promise<NewsArticle | null>
export async function createNews(data: CreateNewsInput): Promise<NewsArticle>
export async function updateNews(id: string, data: Partial<NewsArticle>): Promise<NewsArticle>
export async function deleteNews(id: string): Promise<void>
```

### Phase 3: Convert to Server Components

```
/app
├── news/
│   ├── page.tsx              # Server Component
│   │   ├── getNews()
│   │   └── generateMetadata()
│   └── [id]/
│       └── page.tsx           # Server Component
│           ├── getNewsById()
│           └── generateMetadata()
```

### Phase 4: SEO & Social

Add OpenGraph tags:

```typescript
// app/news/[id]/page.tsx
export async function generateMetadata({ params }) {
  const article = await getNewsById(params.id);
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      images: [article.image],
    },
  };
}
```

---

## File Structure

```
/app
├── news/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
├── api/
│   └── v1/
│       └── education/
│           └── news/
│               └── route.ts
/services
├── newsService.ts           # New file
/lib
├── news-data.ts          # Can remove after migration
/components
├── news/
│   ├── NewsPage.tsx
│   ├── NewsDetailsPage.tsx
│   └── NewsCard.tsx
/docs
├── news-backend-integration-plan.md
```

---

## Caching Strategy

| Endpoint | Cache Strategy | Revalidation |
|----------|---------------|--------------|
| `/api/v1/education/news` | `revalidate: 600` | 10 min |
| `/api/v1/education/news/:id` | `revalidate: 300` | 5 min |

---

## Testing Checklist

- [ ] News list loads with correct data
- [ ] Category filtering works
- [ ] Sort options work correctly
- [ ] Pagination works
- [ ] Featured news displays in hero
- [ ] News detail loads with related news
- [ ] 404 handled for invalid IDs
- [ ] Admin CRUD operations work
- [ ] SEO metadata renders correctly

---

## Notes

- Consider adding `view_count` and increment on each view
- The `source` field represents the news origin (e.g., "Tribhuvan University")
- Add read time calculation from content length
- Consider newsletter subscription integration