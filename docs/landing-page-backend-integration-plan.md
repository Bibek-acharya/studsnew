# StudSphere Landing Page - Backend Integration Plan

## Overview

This document outlines the backend integration plan for the StudSphere landing page (`EducationPage` component). Currently, all 12 sections use **hardcoded mock data** stored directly in component files. This plan transitions to dynamic server-fetched data.

---

## Current Architecture

### Landing Page Sections & Data Sources

| Section | Component | Current Data Source | Backend API Needed |
|---------|-----------|-----------------|-----------------|
| Hero | `HeroSection` | `heroSlides[]` - 5 colleges | `/api/colleges/featured` |
| Event Carousel | `EventShowcaseSection` | `eventSlides[]` - 3 events | `/api/events` |
| Course Categories | `CourseCategoriesSection` | `courseCategories[]` | `/api/courses/categories` |
| Featured Colleges | `FeaturedInstitutionsSection` | `featuredColleges[]` - 4 colleges | `/api/colleges/featured` |
| Financial Aid | `FinancialAidSection` | `scholarships[]` - 4 scholarships | `/api/scholarships` |
| Exam Announcements | `ExamAnnouncementsSection` | TBD (static) | `/api/exams` |
| News & Stories | `NewsStoriesSection` | `newsData[]` - 5 news items | `/api/news` |
| Ad Widgets | `AdWidgetsSection` | Static placeholders | `/api/ads` |
| Campus Events | `CampusEventsSection` | TBD (static) | `/api/campus-events` |
| Testimonials | `TestimonialsSection` | TBD (static) | `/api/testimonials` |
| Recommended For You | `RecommendedForYouSection` | Commented out | `/api/recommendations` |
| Popups | `LandingPopups` | TBD (static) | `/api/popups` |

---

## API Requirements

### Priority 1: Essential APIs

#### 1.1 Colleges API

```typescript
// GET /api/colleges
// Query Params: type=featured, limit=4, search, category
// Response: College[]

interface College {
  id: string | number;
  name: string;
  image_url: string;
  rating?: string | number;
  location?: string;
  affiliation?: string;
  description?: string;
  type?: "Public" | "Private";
  website?: string;
}
```

#### 1.2 Scholarships API

```typescript
// GET /api/scholarships
// Query Params: status=open, limit=4
// Response: Scholarship[]

interface Scholarship {
  id: number;
  title: string;
  provider: string;
  type: "MERIT-BASED" | "NEED-BASED";
  status: "Open" | "Closing";
  amount: string;
  location: string;
  eligibility: string;
  deadline: string;
  image: string;
}
```

#### 1.3 Events API

```typescript
// GET /api/events
// Query Params: status=featured
// Response: Event[]

interface Event {
  id: number;
  image: string;
  alt: string;
  badgeIcon: string;
  badgeClass: string;
  badgeText: string;
  title: string;
  date: string;
  location: string;
  interested: string;
  avatars: number[];
}
```

#### 1.4 News API

```typescript
// GET /api/news
// Query Params: limit=5
// Response: NewsItem[]

interface NewsItem {
  badgeText: string;
  badgeColorClass: string;
  imgSrc: string;
  title: string;
  description: string;
  timeAgo: string;
}
```

#### 1.5 Course Categories API

```typescript
// GET /api/courses/categories
// Response: CourseCategory[]

interface CourseCategory {
  title: string;
  count: string;
  isActive: boolean;
  partnerLogos: string[];
}
```

### Priority 2: Secondary APIs

```typescript
// GET /api/exams
interface ExamAnnouncement {
  id: string;
  title: string;
  date: string;
  category: string;
}

// GET /api/campus-events
interface CampusEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
}

// GET /api/testimonials
interface Testimonial {
  id: string;
  name: string;
  text: string;
  avatar: string;
  college: string;
}

// GET /api/popups
interface Popup {
  id: string;
  type: "newsletter" | "counseling" | "survey";
  title: string;
  message: string;
  cta: string;
}
```

---

## Implementation Roadmap

### Phase 1: API Layer

Create API routes in `/app/api/`:

```
/app/api
├── colleges/
│   └── route.ts          # GET /api/colleges
├── scholarships/
│   └── route.ts        # GET /api/scholarships
├── events/
│   └── route.ts       # GET /api/events
├── news/
│   └── route.ts       # GET /api/news
└── courses/
    └── route.ts      # GET /api/courses/categories
```

### Phase 2: Data Fetching Layer

Create service functions in `/services/`:

```
/services
├── collegeService.ts
├── scholarshipService.ts
├── eventService.ts
├── newsService.ts
└── courseService.ts
```

### Phase 3: Page Conversion

Convert `/app/page.tsx` to Server Component:

```typescript
// app/page.tsx (Server Component)
import EducationPage from "@/components/education/EducationPage";
import { getFeaturedColleges } from "@/services/collegeService";
import { getOpenScholarships } from "@/services/scholarshipService";
import { getFeaturedEvents } from "@/services/eventService";
import { getLatestNews } from "@/services/newsService";
import { getCourseCategories } from "@/services/courseService";

export default async function HomePage() {
  // Parallel data fetching
  const [colleges, scholarships, events, news, categories] = await Promise.all([
    getFeaturedColleges({ limit: 4 }),
    getOpenScholarships({ limit: 4 }),
    getFeaturedEvents(),
    getLatestNews({ limit: 5 }),
    getCourseCategories(),
  ]);

  const handleNavigate = (view: string, data?: any) => {
    // Navigation logic
  };

  return (
    <EducationPage
      onNavigate={handleNavigate}
      featuredColleges={colleges}
      scholarships={scholarships}
      eventSlides={events}
      newsData={news}
      courseCategories={categories}
    />
  );
}
```

### Phase 4: Component Updates

Update each section to accept data as props:

1. **HeroSection** - Accept `slides?: College[]`
2. **FeaturedInstitutionsSection** - Accept `colleges: College[]`
3. **FinancialAidSection** - Accept `scholarships: Scholarship[]`
4. **EventShowcaseSection** - Accept `events: Event[]`
5. **NewsStoriesSection** - Accept `news: NewsItem[]`
6. **CourseCategoriesSection** - Accept `categories: CourseCategory[]`

---

## File Structure Changes

```
/app
├── page.tsx                      # Server Component (fetch data)
├── api/
│   ├── colleges/route.ts
│   ├── scholarships/route.ts
│   ├── events/route.ts
│   ├── news/route.ts
│   └── courses/route.ts
/components
├── education/
│   ├── EducationPage.tsx       # Receives data as props
│   └── landing/
│       ├── HeroSection.tsx           # Props: featuredColleges
│       ├── FeaturedInstitutionsSection.tsx  # Props: colleges
│       ├── FinancialAidSection.tsx  # Props: scholarships
│       ├── EventShowcaseSection.tsx # Props: events
│       ├── NewsStoriesSection.tsx   # Props: news
│       └── CourseCategoriesSection.tsx  # Props: categories
/services
├── collegeService.ts
├── scholarshipService.ts
├── eventService.ts
├── newsService.ts
└── courseService.ts
```

---

## Caching Strategy

| Data Type | Cache Strategy | Revalidation |
|----------|---------------|--------------|
| Featured Colleges | `revalidate: 3600` | 1 hour |
| Scholarships | `no-store` | Always fresh |
| Events | `revalidate: 300` | 5 minutes |
| News | `revalidate: 600` | 10 minutes |
| Course Categories | `revalidate: 86400` | 24 hours |

---

## Loading & Error States

Each section should handle:

1. **Loading State** - Skeleton/placeholder
2. **Empty State** - "No data available" message
3. **Error State** - Retry button with error message

```typescript
// Example loading state
if (loading) {
  return <div className="animate-pulse">Loading...</div>;
}

// Example error state
if (error) {
  return (
    <div className="text-red-500">
      Failed to load. <button onClick={refetch}>Retry</button>
    </div>
  );
}
```

---

## Testing Checklist

- [ ] API returns correct data shape
- [ ] Page renders with server-fetched data
- [ ] Navigation works correctly
- [ ] Loading states display properly
- [ ] Error states handle gracefully
- [ ] Caching works as expected
- [ ] No console errors on load

---

## Notes

- All data fetching should happen server-side (next: App Router)
- Use `Promise.all()` for parallel fetching
- Implement proper error boundaries
- Consider pagination for news/events sections
- Add analytics tracking for user interactions