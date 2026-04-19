# Scholarship Finder Frontend Integration Plan

## 1. Current Architecture Analysis

### 1.1 Frontend Components
| Component | File | Purpose |
|-----------|------|---------|
| ScholarshipFinderPage | `components/scholarship-finder/ScholarshipFinderPage.tsx` | Main scholarship search page |
| ScholarshipFilterSidebar | `components/scholarship-finder/ScholarshipFilterSidebar.tsx` | Filter sidebar |
| ScholarshipAds | `components/scholarship-finder/ScholarshipAds.tsx` | Featured scholarship ads |
| ScholarshipEntranceForm | `components/scholarship-finder/ScholarshipEntranceForm.tsx` | Application form |

### 1.2 Current Status
**MIXED**: Uses `scholarshipApi` service with local mock data + client-side filtering:

```typescript
// services/scholarship.api.ts lines 464-485
export const scholarshipApi = {
  async getScholarships(filters: ScholarshipFilters = {}, page: number = 1): Promise<ScholarshipListResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = filterScholarships(seedScholarships, filters);  // Client-side filter
        // ... pagination logic
      }, 100);
    });
  },
  async getScholarshipDetails(id: string | number): Promise<Scholarship | undefined> { ... },
};
```

**CRITICAL**: The API uses mock data in `seedScholarships` (18 scholarships) and filters client-side with `filterScholarships()` function.

### 1.3 Backend EXISTS!
The backend already has scholarship routes in `studback`:

```go
// routes: /api/v1/education/scholarships
GET /api/v1/education/scholarships
GET /api/v1/education/scholarships/:id
GET /api/v1/education/scholarships/:id/similar
POST /api/v1/education/scholarships/:id/apply   // Auth required
GET /api/v1/scholarships/my-applications     // Auth required
```

**Problem**: Frontend is NOT calling the backend - uses local mock data instead.

---

## 2. Integration Analysis

### 2.1 Current Data Flow
```
ScholarshipFinderPage.useEffect 
  → scholarshipApi.getScholarships(filters)
  → filterScholarships(seedScholarships, filters)  // Client-side filter!
  → Returns mock data after setTimeout(100)
```

### 2.2 Change Required
Replace local mock data call with backend endpoint: `/api/v1/education/scholarships`

**Backend already supports filtering:**
- `search` - Search term
- `category` - Category filter  
- `type` - Type filter
- `location` - Location filter
- `level` - Study level filter
- `status` - Status filter (OPEN, CLOSED, etc.)
- `sort` - Sort field (default: deadline)
- `order` - ASC/DESC

---

## 3. Integration Tasks

### 3.1 Phase 1: Update scholarshipApi Service
File: `services/scholarship.api.ts`

- [ ] Replace mock data with backend API call
- [ ] Map frontend filters to backend query params
- [ ] Handle pagination from backend response
- [ ] Add error handling

```typescript
async getScholarships(filters: ScholarshipFilters = {}, page: number = 1): Promise<ScholarshipListResponse> {
  const params = new URLSearchParams();
  if (filters.searchQuery) params.set("search", filters.searchQuery);
  if (filters.studyLevel?.length) params.set("level", filters.studyLevel.join(","));
  if (filters.location?.length) params.set("location", filters.location.join(","));
  if (filters.courseStream?.length) params.set("category", filters.courseStream.join(","));
  if (filters.scholarshipType?.length) params.set("type", filters.scholarshipType.join(","));
  params.set("page", String(page));
  
  const response = await fetch(`${API_BASE_URL}/api/v1/education/scholarships?${params}`);
  const data = await response.json();
  
  return {
    scholarships: data.data.scholarships,
    pagination: data.data.pagination,
  };
}
```

### 3.2 Phase 2: Update Frontend Components
- [ ] Update ScholarshipFinderPage to use real backend data
- [ ] Handle loading/error states
- [ ] Ensure filters pass correctly to API
- [ ] Remove client-side `filterScholarships()` usage

### 3.3 Phase 3: Add Missing Features (if needed)
- [ ] Add bookmark/save to backend
- [ ] Add apply functionality uses backend
- [ ] Add my-applications view

---

## 4. Filter Mapping

### 4.1 Frontend to Backend
| Frontend Filter | Backend Param | Notes |
|-----------------|--------------|-------|
| filters.studyLevel | level | e.g., "+2", "A Level" |
| filters.courseStream | category | e.g., "Science", "Management" |
| filters.location | location | e.g., "Kathmandu" |
| filters.scholarshipType | type | e.g., "MERIT BASED" |
| filters.providerType | providerType | Not in current backend - may need add |
| filters.coverage | coverage | Not in current backend - may need add |
| filters.gpaRequirement | gpaRequirement | Not in current backend - may need add |
| searchQuery | search | Full-text search |

### 4.2 Status Values
| Frontend | Backend | Meaning |
|---------|---------|---------|
| "OPEN" | open | Accepting applications |
| "CLOSING SOON" | closing | Deadline approaching |
| "CLOSED" | closed | No longer accepting |

---

## 5. Backend Endpoints Summary

### 5.1 Existing (Used)
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/api/v1/education/scholarships` | No | List all |
| GET | `/api/v1/education/scholarships/:id` | No | Get details |
| GET | `/api/v1/education/scholarships/:id/similar` | No | Similar scholarships |
| POST | `/api/v1/education/scholarships/:id/apply` | Yes | Apply for scholarship |

### 5.2 User Applications
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/api/v1/scholarships/my-applications` | Yes | User's applications |
| GET | `/api/v1/scholarships/applications/:id` | Yes | Single application |
| PUT | `/api/v1/scholarships/applications/:id` | Yes | Update application |
| DELETE | `/api/v1/scholarships/applications/:id` | Yes | Delete application |

### 5.3 Admin
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET/POST/PUT/DELETE | `/api/v1/admin/scholarships/*` | Yes | CRUD operations |

---

## 6. Testing Checklist

### 6.1 Before Integration
- [ ] Load scholarship finder page
- [ ] Search returns results
- [ ] Filters work
- [ ] Pagination works

### 6.2 After Integration  
- [ ] Backend returns same results as mock
- [ ] All filters correctly mapped
- [ ] Error handling works
- [ ] Loading states work

### 6.3 Additional Tests
- [ ] Apply for scholarship works
- [ ] My applications shows user's apps
- [ ] Save/bookmark works

---

## 7. Comparison Summary

| Aspect | find-college | admissions | campus-forum | contact | course-finder | scholarship-finder |
|--------|-------------|-----------|--------------|---------|--------------|-------------------|
| Data Source | API | Mock | API | None | Mock | **Mock** |
| API Exists | Yes | No | Yes | No | No | **Yes** |
| Used API | Yes | - | Yes | - | - | **No** |
| CRUD | Read | No | Full | Create | No | **Partial** |

**Key insight**: Scholarship finder is like course-finder - has mock data but unlike course-finder, a **backend already exists** at `/api/v1/education/scholarships`. The frontend just hasn't been connected to it.

---

## 8. Next Steps

1. **Test backend** `/api/v1/education/scholarships` with Postman
2. **Update scholarshipApi** to call real backend
3. **Verify filters** map correctly
4. **Test apply flow** with authenticated user
5. **Deploy**