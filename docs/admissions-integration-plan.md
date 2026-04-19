# Admissions Frontend Integration Plan

## 1. Current Architecture Analysis

### 1.1 Frontend Components
| Component | File | Purpose |
|-----------|------|---------|
| AdmissionsLevelPage | `app/admissions/[level]/page.tsx` | Main page orchestrator |
| AdmissionGrid | `components/admissions/AdmissionGrid.tsx` | College cards display, pagination |
| AdmissionFilterSidebar | `components/admissions/AdmissionFilterSidebar.tsx` | Filters (stream, program, location, etc.) |
| AdmissionDetailPage | `app/admissions/[level]/[collegeId]/page.tsx` | Individual college details |
| CollegeCard/DirectAdmissionCard | `components/admissions/*.tsx` | Card components |

### 1.2 Current Data Flow
**CRITICAL ISSUE**: The `AdmissionGrid` uses **local mock data**, NOT API calls:
```typescript
// AdmissionGrid.tsx lines 51-56
const filteredColleges = useMemo(() => {
  let results = [
    ...sampleColleges.map(c => ({ ...c, isDirect: false })),
    ...sampleDirectAdmissions.map(d => ({ ...d, isDirect: true }))
  ];
  // ... client-side filtering
}, [filters, searchTerms]);
```

All filtering happens client-side with `useMemo` - **NO backend integration exists**.

### 1.3 Filter Types
```typescript
// From app/admissions/[level]/types.ts
interface AdmissionFilters {
  search: string;
  academic: string[];      // Stream/Program (Science, Management, etc.)
  program: string[];        // Specific programs
  province: string[];
  district: string[];
  local: string[];
  type: string[];         // College type (Private, Community, Government)
  scholarship: string[];
  facilities: string[];
  feeMax: number;
  sortBy: string;
  directAdmission: boolean; // Special filter for direct admission
}
```

### 1.4 URL Routes
- `/admissions/high-school` - +2 Colleges
- `/admissions/a-level` - A-Level Colleges  
- `/admissions/diploma` - Diploma/CTEVT Colleges

---

## 2. Backend API Requirements

### 2.1 Current Backend Routes (Studback)
The backend has admission management routes (`/api/v1/admissions/*`) but these are for:
- Student application submission tracking
- CRUD operations for user's own admissions
- Admin management

**These routes are NOT for listing colleges/programs**.

### 2.2 New Endpoints Needed

#### 2.2.1 GET `/api/v1/admissions/colleges`
List colleges with admission data for a specific level.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| level | string | "high-school", "a-level", "diploma" |
| page | number | Page number |
| pageSize | number | Items per page |
| sort | string | Sort field |
| order | string | ASC/DESC |
| search | string | Search term |
| academic | string | Stream filter |
| program | string | Program filter |
| province | string | Province filter |
| district | string | District filter |
| type | string | College type |
| feeMax | number | Max fee |
| directAdmission | boolean | Filter direct admissions |

**Expected Response:**
```json
{
  "data": {
    "colleges": [
      {
        "id": 1,
        "collegeName": "KIST College",
        "rating": 4.2,
        "type": "Private",
        "location": "Kamalpokhari, KTM",
        "images": ["url1", "url2"],
        "programs": [
          { "name": "BSc Computing", "status": "Seats Available" }
        ],
        "moreProgramsCount": 30,
        "hasDirectAdmission": true
      }
    ],
    "pagination": { "total": 500, "totalPages": 28, "page": 1 }
  }
}
```

#### 2.2.2 GET `/api/v1/admissions/colleges/filter-counts`
Get filter counts for a level.

**Expected Response:**
```json
{
  "data": {
    "total": 500,
    "academic_counts": { "Science": 1200, "Management": 1500 },
    "program_counts": { "p2_sci": 200, "d_eng": 150 },
    "type_counts": { "Private": 250, "Community": 20, "Government": 30 },
    "province_counts": { "Bagmati": 150, "Koshi": 80 },
    "facility_counts": { "hostel": 100, "wifi": 200 }
  }
}
```

#### 2.2.3 GET `/api/v1/admissions/colleges/:id`
Get college detail with admission info.

#### 2.2.4 GET `/api/v1/admissions/direct`
Get colleges with direct admission available (for the Direct Admission toggle feature).

---

## 3. Integration Tasks

### 3.1 Phase 1: Create Backend Endpoints
- [ ] Create new route group `/api/v1/admissions/colleges`
- [ ] Implement list endpoint with filtering
- [ ] Implement filter-counts endpoint
- [ ] Implement detail endpoint
- [ ] Implement direct admission endpoint

### 3.2 Phase 2: Create API Service Methods
File: `services/api.ts`

Add methods:
```typescript
async getAdmissionColleges(level: string, params: {...}): Promise<AdmissionsResponse>
async getAdmissionFilterCounts(level: string): Promise<FilterCountsResponse>
async getAdmissionCollegeById(id: number): Promise<CollegeDetail>
async getDirectAdmissionColleges(params: {...}): Promise<AdmissionsResponse>
```

### 3.3 Phase 3: Update AdmissionGrid Component
- [ ] Replace mock data with `useQuery` + API calls
- [ ] Implement pagination with backend totalPages
- [ ] Handle loading/error states
- [ ] Remove client-side filtering useMemo
- [ ] Handle direct admission toggle (filter by API)

### 3.4 Phase 4: Update FilterSidebar
- [ ] Replace static filter counts with API data
- [ ] Update filter counts on filter changes
- [ ] Preserve cascade logic (academic -> program)

### 3.5 Phase 5: Testing
- [ ] Test all level routes work
- [ ] Test filtering works
- [ ] Test pagination
- [ ] Test direct admission toggle
- [ ] Test detail page loads

---

## 4. Data Mapping

### 4.1 Frontend Filter IDs
| Frontend ID | Label | Backend Mapping |
|-------------|-------|--------------|
| p2_sci | Science | academic_type = "science" |
| p2_mgmt | Management | academic_type = "management" |
| p2_hum | Humanities | academic_type = "humanities" |
| ct_private | Private College | type = "Private" |
| ct_community | Community College | type = "Community" |
| ct_government | Government College | type = "Government" |
| prov_* | Province | location province |
| d_* | District | location district |

### 4.2 Level to Academic Type Mapping
| URL Level | Academic Type |
|-----------|---------------|
| high-school | "plus2" |
| a-level | "a-level" |
| diploma | "diploma" |

### 4.3 Program Status Mapping
| Frontend Status | Meaning |
|-----------------|---------|
| "Seats Available" | Admission open |
| "Closing Soon" | Limited seats |
| "Opening Soon" | Not yet open |

---

## 5. Special Features

### 5.1 Direct Admission Feature
The frontend has a "Get college direct admission" toggle (`filters.directAdmission`):
- When ON: only shows colleges with direct admission available
- Shows a modal explaining the flow (lines 266-354 in AdmissionFilterSidebar.tsx)
- Cards show different data (course name, apply button vs programs list)

### 5.2 Featured/Direct Admission Ads
The grid inserts ads at specific positions:
- Index 5: Featured Admission Ad
- Index 11: Direct Admission Ad

This should be handled at display level, not data level.

---

## 6. Testing Checklist

- [ ] Load /admissions/high-school without errors
- [ ] Load /admissions/a-level without errors
- [ ] Load /admissions/diploma without errors
- [ ] Filter by stream updates results
- [ ] Filter by location works  
- [ ] Filter by college type works
- [ ] Fee range slider filters results
- [ ] Pagination navigates correctly
- [ ] Search returns relevant results
- [ ] Direct Admission toggle filters correctly
- [ ] Click college navigates to detail page
- [ ] Detail page loads all tabs

---

## 7. Key Differences from find-college

| Aspect | find-college | admissions |
|--------|-------------|-----------|
| Data source | API (`apiService.getColleges()`) | Mock data (`data.ts`) |
| Filtering | API params + client | Client-only useMemo |
| Filter counts | API (`getCollegeFilterCounts()`) | Static counts in component |
| Auth required | No | No |

---

## 8. Next Steps

1. **Create backend endpoints** for listing admission colleges
2. **Add API service methods** in `services/api.ts`
3. **Update AdmissionGrid** to use TanStack Query
4. **Update FilterSidebar** to fetch filter counts
5. **Test thoroughly**
6. **Deploy**