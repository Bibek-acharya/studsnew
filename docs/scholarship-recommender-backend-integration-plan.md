# Scholarship Recommender Backend Integration Plan

## Objective
Document the current scholarship recommender frontend flow and define how it should connect to backend recommendation services.

## Current Frontend Architecture

### Entry point
- `app/scholarship-recommender/page.tsx` renders the recommender route
- The page is a client component that renders `ScholarshipRecommenderPage`

### Main UI component
- `components/scholarship-recommender/ScholarshipRecommenderPage.tsx`
- Uses a stepped questionnaire flow with 7 steps:
  1. Education journey
  2. Study preferences
  3. Location preferences
  4. Personal profile
  5. Achievements & involvement
  6. Recommendation results
  7. Shortlist review

### Supporting components
- `components/scholarship-recommender/ResultsGrid.tsx`
  - shows scholarship cards
  - supports select all, shortlist, save, and apply actions
- `components/scholarship-recommender/ShortlistView.tsx`
  - toggles between recommended and shortlisted lists
- `components/scholarship-recommender/ConfirmDialog.tsx`
  - prompts before resetting answers
- `components/scholarship-recommender/CustomSelect.tsx` and `MultiSelect.tsx`
  - provide custom select and multi-select inputs

### Data model
- `components/scholarship-recommender/types.ts`
  - `RecommenderState` defines all form fields
  - `ScholarshipCardItem` defines the recommendation card shape
- `components/scholarship-recommender/data.ts`
  - `initialRecommenderState` defines form defaults
  - `recommendations` is a static mock recommendation list

## Current behavior

- The page stores user answers in local state only
- There is no network request to fetch recommendations
- Recommendation results are always taken from the static `recommendations` array
- No backend API wrapper or service is used for scholarship recommender output

## Existing backend API contract
- `studsback/API_DOCUMENTATION.md` defines:
  - `POST /tools/scholarship-finder/recommendations` - Get scholarship recommendations
  - `POST /tools/college-recommender/recommendations` - Get college recommendations
- There is currently no frontend implementation using `/tools/scholarship-finder/recommendations`

## Integration gaps

1. No backend service wrapper for scholarship recommender
2. No request payload mapping from `RecommenderState` to recommendation API input
3. No API result type defined for scholarship recommendations
4. Result pages use mock cards instead of dynamic response data
5. No persistence for shortlist or saved scholarships
6. No error/loading states for network requests

## Proposed API contract

### Recommended endpoint
- `POST /tools/scholarship-finder/recommendations`

### Suggested request payload
```json
{
  "education_level": "undergraduate",
  "study_mode": "full-time",
  "academic_score_type": "gpa",
  "academic_score": "3.5",
  "field_of_study": "computer science",
  "willing_essay": "yes",
  "willing_interview": "no",
  "willing_gpa": "yes",
  "province": "Bagmati",
  "district": "Kathmandu",
  "study_location": "inside",
  "category": "merit",
  "gender": "female",
  "income": "below_2",
  "talents": ["debate", "sports"],
  "achievements": ["national olympiad finalist"],
  "involvement": ["student council", "volunteering"]
}
```

### Suggested response shape
```json
{
  "data": {
    "recommendations": [
      {
        "id": 1,
        "title": "Academic Excellence Grant",
        "provider_type": "Govt",
        "coverage": "Full Coverage",
        "deadline": "2026-02-28",
        "description": "Supports outstanding undergraduate applicants from Nepal.",
        "tag_color": "bg-blue-600",
        "apply_url": "https://..."
      }
    ]
  },
  "message": "Success"
}
```

## Recommended frontend implementation

### 1. Add service wrapper
- Add `scholarshipRecommenderService` inside `services/api.ts` or a new `services/scholarship.api.ts`
- Example method:
  - `async getScholarshipRecommendations(payload: ScholarshipRecommenderPayload)`
- Use `apiRequest` with `POST /tools/scholarship-finder/recommendations`

### 2. Define request/response types
- Add `ScholarshipRecommenderPayload` to match `RecommenderState`
- Add `ScholarshipRecommendationItem` response type
- Keep the existing `ScholarshipCardItem` shape as the UI model

### 3. Replace mock data with backend results
- In `ScholarshipRecommenderPage.tsx`, submit answers to backend when step 5 completes
- Store the API response in `recommendations` state instead of imported static data
- Show loading / error states while fetching

### 4. Keep step validation and multi-step flow
- Continue using `isStepValid()` for step gating
- After step 5, fetch recommendations and advance to step 6 only on success
- If fetch fails, show an inline error message and keep the user on step 5

### 5. Preserve shortlist and selection state
- Keep `selectedIds` and `shortlistedIds` in local state
- Optionally persist shortlist in localStorage or user profile if backend supports it

### 6. Add backend-powered sort and filters in results
- If the recommendation endpoint supports sort options, wire the dropdowns in `ResultsGrid.tsx`
- Otherwise keep client-side controls and clearly label them as local sorting

### 7. Add apply action integration
- Update scholarship cards to use `apply_url` or a backend-generated application link
- Keep the “Apply” button in UI if the card includes a real URL

## UX and feature recommendations

- Use a one-time onboarding / eligibility step to explain why the recommender asks for each field
- Show a summary of answers before finalizing the recommendation run
- Add contextual help for income, category, and location fields
- Provide an option to “Refine answers” that returns to the most relevant step
- Offer a “Save shortlist” or “Export shortlist” action once recommendations are generated

## Technical notes

- The current implementation is fully client-side and does not require authentication for the recommender route
- The API docs already include the scholarship finder recommender endpoint, so the main work is wiring the frontend to the existing backend service
- Use existing UI state and selection components to minimize refactor scope

## Next step
1. Add a backend API wrapper for `/tools/scholarship-finder/recommendations`
2. Map `RecommenderState` to `ScholarshipRecommenderPayload`
3. Replace `recommendations` mock data with real response data
4. Add loading/error handling and optionally persist shortlist data
5. Verify response shape and update card fields for real scholarship info
