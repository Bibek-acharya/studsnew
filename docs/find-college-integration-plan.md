# Find-College Frontend Integration Plan

## 1. Current Architecture Analysis

### 1.1 Frontend Components
| Component | File | Purpose |
|-----------|------|---------|
| FindCollegePage | `app/find-college/page.tsx` | Main page orchestrator |
| CollegeGrid | `components/find-college/CollegeGrid.tsx` | College cards display, pagination, filters |
| FilterSidebar | `components/find-college/FilterSidebar.tsx` | Left-side filters (location, type, fee, etc.) |
| CollegeDetailPage | `app/find-college/[id]/page.tsx` | Individual college details |

### 1.2 Current Data Flow
```
CollegeGrid ──useQuery──> apiService.getColleges() ──HTTP──> Backend
FilterSidebar ──useQuery──> apiService.getCollegeFilterCounts() ──HTTP──> Backend
```

### 1.3 API Service Methods Used
- `apiService.getColleges(params)` - Fetch paginated colleges
- `apiService.getCollegeFilterCounts()` - Get filter option counts
- `apiService.getCollegeById(id)` - Fetch single college details

---

## 2. Backend API Requirements

### 2.1 Endpoint: GET `/api/v1/colleges`
**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| pageSize | number | Items per page (default: 18) |
| sort | string | Sort field (e.g., "rating", "name") |
| order | string | Sort order ("ASC" or "DESC") |
| search | string | Full-text search |
| type | string | Comma-separated college types |
| location | string | Comma-separated locations (province/district) |
| affiliation | string | Comma-separated universities |
| feeMax | number | Maximum fee filter |
| verified | boolean | Filter by verification status |
| popular | boolean | Filter by popularity |
| rating | number | Minimum rating filter |

**Expected Response:**
```json
{
  "data": {
    "colleges": [
      {
        "id": 1,
        "name": "College Name",
        "image_url": "url",
        "description": "desc",
        "rating": 4.5,
        "reviews": 100,
        "type": "Private",
        "location": "Kathmandu",
        "affiliation": "Tribhuvan University",
        "verified": true,
        "featured": false
      }
    ],
    "pagination": {
      "total": 500,
      "totalPages": 28,
      "page": 1,
      "pageSize": 18
    }
  }
}
```

### 2.2 Endpoint: GET `/api/v1/colleges/filter-counts`
**Expected Response:**
```json
{
  "data": {
    "total": 500,
    "type_counts": { "Private": 250, "Public / Govt": 50 },
    "type_counts_by_id": { "ct_private": 250, "ct_public": 50 },
    "facet_counts_by_id": {
      "plus2": 3200,
      "prov_koshi": 150,
      ...
    },
    "featured": 20,
    "verified": 300,
    "popular": 100
  }
}
```

### 2.3 Endpoint: GET `/api/v1/colleges/:id`
**Expected Response:**
```json
{
  "data": {
    "id": 1,
    "name": "College Name",
    "image_url": "url",
    "banner_url": "url",
    "description": "...",
    "rating": 4.5,
    "reviews": 100,
    "type": "Private",
    "location": "Kathmandu",
    "affiliation": "Tribhuvan University",
    "verified": true,
    "featured": true,
    "contact_info": { ... },
    "courses": [ ... ],
    "facilities": [ ... ]
  }
}
```

---

## 3. Integration Tasks

### 3.1 Phase 1: Verify Backend Endpoints
- [ ] Test `/api/v1/colleges` returns correct data format
- [ ] Test `/api/v1/colleges/filter-counts` returns facet counts
- [ ] Test `/api/v1/colleges/:id` returns full college details
- [ ] Verify authentication requirements (if any)

### 3.2 Phase 2: Update API Service
- [ ] Ensure `getColleges()` maps all filter params correctly
- [ ] Ensure `getCollegeFilterCounts()` caches results (already implemented with 5min staleTime)
- [ ] Add error handling for network failures
- [ ] Add types for new fields if needed

### 3.3 Phase 3: Update CollegeGrid Component
- [ ] Verify pagination works with backend totalPages
- [ ] Test search functionality
- [ ] Test sort options (popularity, rating, fee)
- [ ] Handle loading states properly
- [ ] Handle empty results state

### 3.4 Phase 4: Update FilterSidebar Component
- [ ] Verify facet counts display correctly
- [ ] Test cascade filters (academic -> program -> course)
- [ ] Test location filters (province -> district -> localBody)
- [ ] Test fee range slider
- [ ] Test "College Near Me" geolocation

### 3.5 Phase 5: Update College Detail Page
- [ ] Verify data loads from `getCollegeById()`
- [ ] Test all tabs (about, courses, admissions, etc.)
- [ ] Test quick inquiry form submission
- [ ] Test review display

---

## 4. Filter Mapping Reference

### 4.1 Frontend Filter IDs to Backend Values
| Frontend ID | Backend Value |
|-------------|---------------|
| ct_private | "Private" |
| ct_public | "Public / Govt" |
| ct_community | "Community" |
| ct_constituent | "Constituent" |
| ct_foreign | "Foreign Affiliated" |

### 4.2 Sort Options
| Frontend ID | Backend sort field | Order |
|-------------|-------------------|-------|
| popularity | rating | DESC |
| rating | rating | DESC |
| verified | verified | DESC |
| fee_low | rating | ASC |
| fee_high | rating | DESC |

---

## 5. Known Considerations

### 5.1 Mock Data
The current `apiService.ts` contains some mock data implementations (e.g., `getEducationCourses`). The college endpoints appear to call actual backend but may return mock data if backend is unavailable.

### 5.2 Filter Cascade Logic
The FilterSidebar implements cascading logic:
- Academic Level selection resets Program and Course
- Program selection shows Course dropdown (only for "diploma")
- Province selection resets District and LocalBody
- District selection resets LocalBody

This logic should be preserved when integrating.

### 5.3 Quick Apply Feature
The CollegeGrid has a Quick Apply feature that:
- Allows selecting up to 5 colleges
- Opens a modal with inquiry form
- Currently shows an alert on submit (no backend call)

### 5.4 Recommendation System
- `apiService.getCollegeRecommenderRecommendations()` is available but not currently used in find-college flow

---

## 6. Testing Checklist

- [ ] Load find-college page without errors
- [ ] Filter by academic level updates results
- [ ] Filter by location (province/district) works
- [ ] Filter by college type works
- [ ] Fee range slider filters results
- [ ] Pagination navigates correctly
- [ ] Search returns relevant results
- [ ] Sort options change order
- [ ] Clicking college card navigates to detail page
- [ ] Detail page loads all tabs
- [ ] Quick Apply modal opens and submits

---

## 7. Next Steps

1. **Confirm Backend Status**: Verify backend is running at `NEXT_PUBLIC_API_URL` (default: `http://localhost:8080`)
2. **Run Integration Tests**: Test each endpoint with tools like Postman
3. **Fix Mismatches**: Address any discrepancies between frontend expectations and backend responses
4. **Deploy**: Update environment variables for production