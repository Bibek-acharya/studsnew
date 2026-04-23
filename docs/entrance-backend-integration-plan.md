# Entrance Backend Integration Plan

## Objective
Integrate the entrance browsing and institution entrance management UI with backend services, ensuring the public entrance catalog and institution exam publishing flows work with real data instead of mock fallback data.

## Current Frontend Coverage

### Public entrance browsing
- `app/entrance/page.tsx` renders the entrance listing route
- `components/entrance/EntranceFilters.tsx` builds advanced search filters
- `components/entrance/EntranceGrid.tsx` fetches and displays entrance exams using `entranceService` and React Query
- Public filtering is implemented in `services/entrance.api.ts`
- The app currently uses `apiRequest('/api/v1/entrances', { method: 'POST', body: JSON.stringify(...) })` for listings
- `entranceService.getEntranceById()` also supports detail lookups at `/api/v1/entrances/:id`

### Institution entrance creation
- `components/institution-zone/dashboard/institution/EntrancePage.tsx` renders an institution-facing entrance creation form
- Current institution form is entirely client-side state with no backend request
- It collects exam metadata, dates & links, descriptions, subject structure, past papers, and contact data

### Shared types and state
- `app/entrance/types.ts` defines `EntranceFilterState` and `DEFAULT_ENTRANCE_FILTERS`
- It also defines data shape for `Exam` and `ExamDetails`

## Backend API Contract
### Documented institution endpoints in `studsback/API_DOCUMENTATION.md`
- `GET /institution/entrances` - List entrances
- `GET /institution/entrances/:id` - Get entrance by ID
- `POST /institution/entrances` - Create entrance
- `PUT /institution/entrances/:id` - Update entrance
- `DELETE /institution/entrances/:id` - Delete entrance
- `GET /institution/entrances/:id/applicants` - Get entrance applicants

### Current frontend public API path
- `POST /api/v1/entrances` - Public entrance listing and search
- `GET /api/v1/entrances/filter-counts` - Public filter counts
- `GET /api/v1/entrances/:id` - Public entrance detail

> Note: `/api/v1/entrances` is not documented in the backend documentation snippet found; treat it as either a separate existing public listing API or an implementation gap.

## Integration surface and gaps

### Entrance listing page
- `EntranceGrid` already composes `EntranceFilters` and query state
- It expects backend support for:
  - filtering by search, academic level, stream, status, sortBy, location, institutionType, province, district, localLevel, applicationFee, scholarship, gpa
  - pagination via `page` and `pageSize`
- Current backend fallback is `SEEDED_EXAMS` mock data inside `services/entrance.api.ts`
- Need to replace or support public endpoint with real listings and count metadata

### Entrance detail page
- `entranceService.getEntranceById(id)` exists, but there is no visible `/app/entrance/[id]` page in the current workspace
- If detail view is required, implement `/app/entrance/[id]/page.tsx` and wire it to this service

### Institution exam authoring page
- Current UI form is not wired to any backend endpoint
- Must connect the institution form to `POST /institution/entrances`
- Consider adding `PUT /institution/entrances/:id` support for edit flow
- The institution form currently supports rich fields; backend model should capture:
  - exam metadata: name, affiliation, takenBy, program
  - schedule: examDateAD, examDateBS, openDate, deadline
  - registration link: formLink
  - content: aboutExam, examProcess, eligibility, requiredDocs
  - exam structure: subjects list with fullMarks, passMarks, syllabus
  - materials: papers list with year, label, file or URL
  - contact: email, phone, website

### Authentication and roles
- Institution endpoints are likely protected and role-based
- `services/entrance.api.ts` uses localStorage token and `Authorization` header
- Ensure institution dashboard components send auth headers and only render for logged-in institution users

## Recommended integration tasks

### 1. Validate backend public listing API
- Confirm or implement public endpoint(s):
  - `POST /api/v1/entrances` with filter body
  - `GET /api/v1/entrances/filter-counts`
  - `GET /api/v1/entrances/:id`
- If these are missing, map them to documented institution-facing endpoints or add a public API layer in the backend

### 2. Replace mock listing fallback
- In `services/entrance.api.ts`, keep mock fallback only as offline support
- Prefer actual `apiRequest` success path
- Clean up filter mapping so frontend matches backend filter contract exactly

### 3. Confirm filter contract and response schema
- Backend should return `data.entrances`, `data.total`, `page`, `pageSize`
- Ensure `total` reflects the full count for pagination
- Confirm `filters.status` valid values: likely `ongoing`, `upcoming`, `closing soon`, `closed`
- Confirm sort values accepted by backend: `popularity`, `date`, `name`

### 4. Implement `/app/entrance/[id]` if needed
- Use `entranceService.getEntranceById(id)` for the detail page
- Add route and layout to render exam details with registration CTA
- If the app uses a different detail route pattern, align accordingly

### 5. Wire institution exam publish flow
- Add a backend API wrapper in `services/entrance.api.ts`:
  - `createInstitutionEntrance(data)` -> `POST /institution/entrances`
  - `updateInstitutionEntrance(id, data)` -> `PUT /institution/entrances/:id`
- In `components/institution-zone/dashboard/institution/EntrancePage.tsx`:
  - add `isSubmitting`, `submitError`, `bookingSuccess` state
  - collect form payload into a backend-friendly JSON body
  - call institution API wrapper on publish
  - show success state or validation errors
- Consider server-side upload support for past paper PDFs if required

### 6. Add edit mode and listing for institution side
- If institution can edit previously published exam, add list/edit flow under `/institution/entrance` or `GET /institution/entrances`
- Use `GET /institution/entrances` to populate a dashboard list
- Wire update actions to `PUT /institution/entrances/:id`

## Suggested payload mapping for institution creation

Example body format for `POST /institution/entrances`:
```json
{
  "title": "CSIT Entrance Examination 2026",
  "affiliation": "Tribhuvan University",
  "taken_by": "+2 Science",
  "program": "B.Sc CSIT",
  "exam_date_ad": "2026-06-15",
  "exam_date_bs": "2083 Jestha 1",
  "registration_open_date": "2026-05-01",
  "registration_deadline": "2026-05-31",
  "application_link": "https://forms.tribhuvan.edu.np/csit-2026",
  "about": "Overview of the exam...",
  "process": "Step-by-step application process...",
  "eligibility": "Minimum 2.5 GPA in +2 Science...",
  "required_documents": "Transcript, citizenship, photo...",
  "structure": [
    { "subject": "Mathematics", "full_marks": 100, "pass_marks": 40, "syllabus_link": "https://..." }
  ],
  "past_papers": [
    { "year": "2023", "label": "CSIT Prelim Paper", "file_url": "https://..." }
  ],
  "contact": {
    "email": "exam@college.edu.np",
    "phone": "+977-1-XXXXXXX",
    "website": "https://exam.college.edu.np"
  }
}
```

## Important notes
- The current public listing UI already uses React Query and should support a live backend with minimal changes.
- The institution form is currently isolated from backend APIs; this is the main integration gap for the entrance workflow.
- If the backend must support files for past papers, add a file upload endpoint, otherwise send metadata only.
- Keep the public and institution API wrappers inside `services/entrance.api.ts` for consistency.

## Next step
1. Confirm backend public endpoint contract for `/api/v1/entrances`
2. Add institution `POST /institution/entrances` API wrapper
3. Replace mock fallback with real API responses
4. Optionally add entrance detail route and institution edit flow
