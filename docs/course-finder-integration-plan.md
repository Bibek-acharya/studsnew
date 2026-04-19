# Course Finder Frontend Integration Plan

## 1. Current Architecture Analysis

### 1.1 Frontend Components
| Component | File | Purpose |
|-----------|------|---------|
| FindCoursePage | `app/course-finder/page.tsx` | Page orchestrator with view state |
| CourseFinderPage | `components/course-finder/CourseFinderPage.tsx` | Main search/filter page |
| CourseFilters | `components/course-finder/CourseFilters.tsx` | Filter sidebar |
| CourseGrid | `components/course-finder/CourseGrid.tsx` | Course cards display |
| CourseDetailsPage | `components/course-finder/CourseDetailsPage.tsx` | Course detail view |
| CollegesAndCoursesPage | `components/course-finder/CollegesAndCoursesPage.tsx` | Colleges offering course |

### 1.2 Current Status
**MIXED**: The Course Finder uses TanStack Query but returns mock data:

```typescript
// CourseFinderPage.tsx lines 24-27
const { data, isLoading } = useQuery({
  queryKey: ["education-courses"],
  queryFn: () => apiService.getEducationCourses(),
});

// api.ts lines 332-432 - returns MOCK data with setTimeout
async getEducationCourses(): Promise<{ data: { courses: EducationCourse[] } }> {
  await new Promise(resolve => setTimeout(resolve, 600));  // Simulate network
  // Returns hardcoded mockCourses duplicated to 42 items
}
```

All filtering happens client-side with `useMemo` - **NOT backed by API**.

### 1.3 Views/Routes
- `/course-finder` → CourseFinderPage (main search)
- `/course-finder?view=colleges` → CollegesAndCoursesPage
- `/course-finder?view=details` → CourseDetailsPage

Managed via local state in page.tsx.

### 1.4 Filter Types
```typescript
interface CourseFinderFilters {
  academicLevels: string[];  // plus2, alevel, diploma, bachelor, masters
  fields: string[];          // p2_sci, p2_mgmt, d_eng, etc.
  maxFee: number;            // 1000000 default
  feeRanges: string[];
  admissionStatus: string[];
  location: string[];
  popularity: string[];
  province: string;         // "All Provinces" default
  nationalWide: boolean;
  quickVerified: boolean;  // Quick filters
  quickNew: boolean;
  quickClosing: boolean;
}
```

---

## 2. Backend API Requirements

### 2.1 Current Issue
The `getEducationCourses()` method returns mock data:
- Has 6 base courses duplicated to 42
- No real backend endpoint exists for courses

### 2.2 New Endpoints Needed

#### 2.2.1 GET `/api/v1/courses`
List all education courses/programs.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| pageSize | number | Items per page |
| search | string | Search term |
| level | string | Academic level |
| field | string | Field of study |
| affiliation | string | Board/university |
| feeMin/feeMax | number | Fee range |

**Expected Response:**
```json
{
  "data": {
    "courses": [
      {
        "id": 1,
        "title": "Science (+2)",
        "level": "+2 (Plus Two)",
        "field": "Science",
        "affiliation": "NEB",
        "duration": "2 Years",
        "estFee": "Rs. 1,50,000 - 3,50,000",
        "colleges": 145,
        "badges": ["Popular", "Science"],
        "highlights": ["Practical based learning"],
        "careerPath": "Medicine, Engineering, IT",
        "description": "The Plus Two Science program..."
      }
    ],
    "pagination": { "total": 42, "totalPages": 3, "page": 1 }
  }
}
```

#### 2.2.2 GET `/api/v1/courses/filter-counts`
Get filter counts/options.

**Expected Response:**
```json
{
  "data": {
    "total": 42,
    "level_counts": { "plus2": 3200, "alevel": 500, "diploma": 800, "bachelor": 1500, "masters": 300 },
    "field_counts": { "Science": 1200, "Management": 2100, "Engineering": 800 },
    "affiliation_counts": { "NEB": 2500, "TU": 1500, "CTEVT": 800, "Cambridge": 200 }
  }
}
```

#### 2.2.3 GET `/api/v1/courses/:id`
Get course details.

#### 2.2.4 GET `/api/v1/courses/:id/colleges`
Get colleges offering a course.

---

## 3. Integration Tasks

### 3.1 Phase 1: Create Backend Endpoints
- [ ] GET `/api/v1/courses` - List courses
- [ ] GET `/api/v1/courses/filter-counts` - Get counts
- [ ] GET `/api/v1/courses/:id` - Course details
- [ ] GET `/api/v1/courses/:id/colleges` - Colleges for course

### 3.2 Phase 2: Update API Service
File: `services/api.ts`

- [ ] Replace mock data with real fetch
- [ ] Add proper error handling
- [ ] Add filter parameter support

```typescript
async getEducationCourses(params?: {
  page?: number;
  search?: string;
  level?: string;
  field?: string;
}): Promise<{ data: { courses: EducationCourse[]; pagination: any } }> {
  const query = new URLSearchParams(params as any).toString();
  return apiRequest(`/api/v1/courses${query ? `?${query}` : ""}`);
}
```

### 3.3 Phase 3: Update CourseFinderPage
- [ ] Pass pagination params to API
- [ ] Handle pagination response
- [ ] Remove client-side filtering useMemo (replace with API params)
- [ ] Handle loading/error states properly

### 3.4 Phase 4: Update CourseFilters
- [ ] Fetch filter counts from `getCourseFilterCounts()`
- [ ] Update sidebar with dynamic counts
- [ ] Preserve current filter UI

### 3.5 Phase 5: Testing
- [ ] Load course finder without errors
- [ ] Test search functionality
- [ ] Test filters work
- [ ] Test pagination
- [ ] Test navigation to colleges
- [ ] Test navigation to details

---

## 4. Data Mapping

### 4.1 Filter IDs to Backend Values
| Frontend ID | Backend Value |
|-------------|--------------|
| plus2 | "+2 (Plus Two)" |
| alevel | "A Level" |
| diploma | "Diploma" |
| bachelor | "Bachelor" |
| masters | "Masters" |

### 4.2 Field IDs to Backend Values
| Frontend ID | Field Name |
|-------------|-----------|
| p2_sci | Science |
| p2_mgmt | Management |
| p2_hum | Humanities |
| d_eng | Engineering |
| d_med | Medical/Nursing |
| m_mgmt | MBA/MBS |
| m_it | IT/Computer |

---

## 5. Features Summary

### 5.1 Current Features
- Course search/finder
- Filter by academic level, field, fee
- Quick filters (verified, new, closing)
- Province filter
- Course detail view
- Colleges list for course
- Bookmark courses (local state)
- Ads display (Course carousel, KIST, Studsphere banner)

### 5.2 Not Yet Implemented
- Save bookmarks to backend
- Course comparison
- Reviews/ratings

---

## 6. Testing Checklist

- [ ] Load /course-finder
- [ ] Search returns results
- [ ] Academic level filter works
- [ ] Field filter works
- [ ] Fee filter works
- [ ] Quick filters work
- [ ] Click course shows detail
- [ ] Back to finder works
- [ ] Pagination works

---

## 7. Comparison Summary

| Aspect | find-college | admissions | campus-forum | contact | course-finder |
|--------|-------------|-----------|--------------|---------|--------------|
| Data Source | API | Mock | API | None | **Mock** |
| Filter API | Yes | No | N/A | N/A | **No - needs new** |
| List API | Yes | Needs new | Yes | N/A | **No** |
| CRUD | Read | No | Full | Create | **No** |

The course finder is similar to admissions - needs new backend endpoints for data, currently uses mock data duplicated in the API service layer.