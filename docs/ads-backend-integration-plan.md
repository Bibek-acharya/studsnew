# StudSphere Ads - Backend Integration Plan

## Overview

The ads feature spans multiple pages across the platform, displaying promotional content for colleges, courses, and the platform itself. This document outlines the architecture, current implementation, gaps, and integration roadmap.

---

## Current Ad Components & Locations

### 1. Landing Page (`/`)
**Component**: `AdWidgetsSection.tsx`
- Location: After News section
- Type: 2 carousel ads with 3 slides each
- Format: Image with title, description, navigation dots

### 2. Course Finder (`/course-finder`)
**Components**:
- `SudsphereBannerAd.tsx` - Full-width banner with CTA buttons
- `CourseCarouselAd.tsx` - Course carousel with college logos
- `KistProgramsAd.tsx` - Program-specific ad

### 3. Find College (`/find-college/[id]`)
- No current ads component (potential placement)

### 4. Admissions (`/admissions/[level]`)
- No current ads component (potential placement)

### 5. Entrance Exams (`/entrance`)
- No current ads component (potential placement)

---

## Ad Types Identified

| Ad Type | Component | Location | Status |
|---------|-----------|----------|--------|
| Banner Carousel | `AdWidgetsSection` | Landing page | Static |
| Promo Banner | `SudsphereBannerAd` | Course finder | Static |
| Course Carousel | `CourseCarouselAd` | Course finder | Static |
| Program Ad | `KistProgramsAd` | Course finder | Static |
| Sidebar Ad | - | - | Not implemented |
| Inline Feed Ad | - | - | Not implemented |

---

## Features Implemented

### AdWidgetsSection (Landing Page)

- [x] Two carousel ads with 3 slides each
- [x] Auto-rotation (5s interval with offset)
- [x] Manual navigation (prev/next buttons)
- [x] Dot indicators
- [x] "Ad" label disclosure
- [x] Image fallback placeholder
- [x] Gradient overlay for text readability
- [x] Title and description display

### SudsphereBannerAd (Course Finder)

- [x] Full-width branded banner
- [x] Gradient background
- [x] Two CTA buttons (Google/Email signup)
- [x] Decorative elements (circles)
- [x] Terms link

### CourseCarouselAd (Course Finder)

- [x] Horizontal scroll carousel
- [x] Course cards with details (title, rating, university)
- [x] College logo display with tooltips
- [x] Navigation arrows
- [x] Dot indicators
- [x] Blue branded styling

---

## Current Data Structure

### AdSlide Interface
```typescript
interface AdSlide {
  image: string;
  title: string;
  description?: string;
}
```

### Course Ad Interface
```typescript
interface CourseAd {
  title: string;
  subtitle: string;
  rating: string;
  university: string;
  degree: string;
  location: string;
  duration: string;
  logos: { name: string; url: string }[];
}
```

---

## Missing / Gaps

### Critical Gaps

1. **No Ad Management API** - Can't manage ads from backend
2. **No Ad Inventory System** - No structured ad database
3. **No Ad Targeting** - All users see same ads
4. **No Impressions Tracking** - Can't measure views

### Functional Gaps

5. **No Click Tracking** - Can't track ad clicks
6. **No Ad Scheduling** - Can't schedule ads
7. **No Ad Rotation Logic** - Static carousel only
8. **No A/B Testing** - Can't test ad variations

### Monetization Gaps

9. **No CPC/CPM Model** - Not implemented
10. **No Ad Budget Limits** - Not implemented
11. **No Payment Integration** - Not implemented
12. **No Invoice/Billing** - Not implemented

### Technical Gaps

13. **No Ad Refresh** - Static until page reload
14. **No Lazy Loading** - All images load immediately
15. **No Frequency Capping** - Same ad shown repeatedly
16. **No Responsive Ad Sizes** - Fixed dimensions

---

## Backend API Requirements

### Ad Management API

```yaml
# Public API - Get ads for display
GET    /api/v1/ads
       - query: page, position, format, limit
       - response: { ads: Ad[], meta: Meta }

GET    /api/v1/ads/:id
       - response: { ad: Ad }

POST   /api/v1/ads/:id/impression
       - body: { sessionId, userId, timestamp }
       - response: { success }

POST   /api/v1/ads/:id/click
       - body: { sessionId, userId, timestamp, destination }
       - response: { success }

# Admin API (requires auth)
GET    /api/v1/superadmin/ads
       - query: page, status, campaign
       - response: { ads: Ad[], meta: Meta }

POST   /api/v1/superadmin/ads
       - body: CreateAdInput
       - response: { ad: Ad }

PUT    /api/v1/superadmin/ads/:id
       - body: Partial<CreateAdInput>
       - response: { ad: Ad }

DELETE /api/v1/superadmin/ads/:id
       - response: { message }
```

### Database Schema

```sql
-- Ad Campaigns
CREATE TABLE ad_campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  advertiser_id INT REFERENCES advertisers(id),
  budget DECIMAL(12,2),
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'draft',
  targeting JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ads
CREATE TABLE ads (
  id SERIAL PRIMARY KEY,
  campaign_id INT REFERENCES ad_campaigns(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  cta_text VARCHAR(100),
  cta_url VARCHAR(500),
  position VARCHAR(50) NOT NULL,
  format VARCHAR(50) NOT NULL,
  priority INT DEFAULT 0,
  impressions_limit INT,
  clicks_limit INT,
  impressions_count INT DEFAULT 0,
  clicks_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ad Impressions
CREATE TABLE ad_impressions (
  id SERIAL PRIMARY KEY,
  ad_id INT REFERENCES ads(id),
  session_id VARCHAR(100),
  user_id INT REFERENCES users(id),
  page_url VARCHAR(500),
  position VARCHAR(50),
  device_type VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ad Clicks
CREATE TABLE ad_clicks (
  id SERIAL PRIMARY KEY,
  ad_id INT REFERENCES ads(id),
  session_id VARCHAR(100),
  user_id INT REFERENCES users(id),
  destination_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Advertisers (for monetization)
CREATE TABLE advertisers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  company VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Ad Models

```typescript
interface Ad {
  id: number;
  campaignId: number;
  title: string;
  description?: string;
  imageUrl: string;
  ctaText?: string;
  ctaUrl: string;
  position: AdPosition;
  format: AdFormat;
  priority: number;
  isActive: boolean;
}

type AdPosition = 
  | "landing_carousel"
  | "course_finder_banner"
  | "course_finder_carousel"
  | "find_college_sidebar"
  | "admissions_inline"
  | "entrance_banner"
  | "global_popup";

type AdFormat = 
  | "carousel"
  | "banner"
  | "card"
  | "sidebar"
  | "popup";

interface AdCampaign {
  id: number;
  name: string;
  advertiserId: number;
  budget: number;
  startDate: string;
  endDate: string;
  status: "draft" | "active" | "paused" | "completed";
  targeting?: AdTargeting;
}

interface AdTargeting {
  pages?: string[];
  userTypes?: string[];
  regions?: string[];
  devices?: string[];
}
```

---

## Implementation Plan

### Phase 1: Core Ad API

Create endpoints:
```
/api/v1/ads              - GET ads by position
/api/v1/ads/:id/impression - POST track impression
/api/v1/ads/:id/click    - POST track click
```

### Phase 2: Admin Interface

Create admin endpoints:
```
/api/v1/superadmin/ads   - CRUD operations
/api/v1/superadmin/campaigns - Campaign management
```

### Phase 3: Component Updates

Update existing components:
1. `AdWidgetsSection` - Fetch from API
2. `SudsphereBannerAd` - Fetch from API
3. `CourseCarouselAd` - Fetch from API

### Phase 4: Analytics

- [ ] Dashboard for ad performance
- [ ] Impression/click reports
- [ ] Revenue tracking
- [ ] A/B testing capability

---

## File Structure

```
/app
├── api/v1/
│   ├── ads/
│   │   └── route.ts
│   └── superadmin/
│       ├── ads/
│       │   └── route.ts
│       └── campaigns/
│           └── route.ts
/services
├── adService.ts           # New
├── analyticsService.ts    # New
/lib
├── ad-data.ts            # Can remove after migration
/components
├── education/
│   └── landing/
│       └── AdWidgetsSection.tsx  # Update to use API
├── course-finder/
│   ├── ads/
│   │   ├── SudsphereBannerAd.tsx
│   │   ├── CourseCarouselAd.tsx
│   │   └── KistProgramsAd.tsx
│   └── CourseFinderPage.tsx
/docs
├── ads-backend-integration-plan.md
```

---

## Ad Placement Strategy

### Landing Page (`/`)
- Position: After News section
- Format: Carousel (2 slots)
- Size: Full width, 250px height

### Course Finder (`/course-finder`)
- Top banner: Full width, 220px
- Course carousel: Horizontal scroll

### Find College (`/find-college/[id]`)
- Sidebar: 300px wide
- After reviews section

### Admissions (`/admissions/[level]`)
- Inline: Between grid items
- Format: Card style

### Entrance (`/entrance`)
- Top banner or sidebar

---

## Caching Strategy

| Endpoint | Cache Strategy | Revalidation |
|----------|---------------|--------------|
| `/api/v1/ads` | `revalidate: 300` | 5 min |
| `/api/v1/superadmin/ads` | `no-store` | Dynamic |

---

## Testing Checklist

- [ ] Ads load from API
- [ ] Impressions tracked
- [ ] Clicks tracked
- [ ] Carousel navigation works
- [ ] Admin can create/edit ads
- [ ] Ads display correct position
- [ ] Fallback for no ads available
- [ ] "Ad" disclosure visible

---

## Notes

- Must disclose "Ad" or "Advertisement" per FTC guidelines
- Consider user privacy for impression tracking (consent)
- Implement frequency capping to avoid user annoyance
- Add "Report this ad" option for users
- Consider ad blocker detection (optional)
- Plan for GDPR/compliance if tracking user data