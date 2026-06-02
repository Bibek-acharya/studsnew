# College Details Page Modularization

**Date:** 2026-06-02  
**Goal:** Reduce `app/find-college/[id]/page.tsx` from ~1724 lines to ≤500 lines by extracting sub-components, hooks, and constants.

## File Structure (Target)

```
app/find-college/[id]/
├── page.tsx                          (~450 lines) — Layout, tabs, modals, forms
├── components/
│   ├── index.ts                      (barrel re-export)
│   ├── EmptyTabState.tsx             — Extracted inline component
│   ├── CollegeHeader.tsx             — Logo, name, rating, follow, share, claim buttons
│   ├── TabNavigation.tsx             — Horizontal tab bar with scroll arrows
│   ├── TabAbout.tsx                  — About, vision, mission, leadership, overview
│   ├── TabCourses.tsx                — Course list with filter pills
│   ├── TabAdmissions.tsx             — Admission list with filter pills
│   ├── TabOffered.tsx                — Offered programs
│   ├── TabFacilities.tsx             — Facility cards
│   ├── TabEvents.tsx                 — Events list with pagination
│   ├── TabScholarship.tsx            — Scholarships list with filter
│   ├── TabAlumni.tsx                 — Alumni cards
│   ├── TabGallery.tsx                — Gallery grid + lightbox
│   ├── TabReview.tsx                 — Reviews with RatingBar, ReviewCard
│   ├── TabNews.tsx                   — News cards with pagination
│   ├── TabDownloads.tsx              — Downloads list
│   └── InquiryForm.tsx               — Inquiry and ask-question forms
├── hooks/
│   └── useCollegeData.ts            — All API calls + memoized data transforms
├── types.ts                          (existing, may receive minor additions)
└── constants.ts                      — Empty fallback arrays, tab config

```

## Extraction Details

### 1. `constants.ts` — Static data (lines 48-66)
Move empty fallback arrays (`courses`, `admissions`, `offeredPrograms`, `scholarships`, `facilities`, `events`, `alumni`, `galleryImages`, `newsCards`, `downloads`) and tab definition list into a constants file.

### 2. `components/EmptyTabState.tsx` (lines 68-82)
Extract the inline `EmptyTabState` component. Props: `{ tabName: string }`. Renders `FolderOpen` icon + message + "Explore More" link.

### 3. `hooks/useCollegeData.ts` — Custom hook (~180 lines)
Combines:
- Primary data fetch (useEffect, lines 197-225): calls `getPublicInstitutionById` or `getCollegeById`
- Reviews fetch (useEffect, lines 227-239): calls `getCollegeReviews` when review tab active
- Field extraction (lines 281-300): 20 computed values from college object
- Memoized data transformers (lines 302-488): `mappedCourses`, `mappedPrograms`, `mappedFacilities`, `mappedDownloads`, `mappedAdmissions`, `mappedEvents`, `mappedNews`, `mappedScholarships`, `galleryImagesSource`, `institutionProgramsFromTable`, `institutionCoursesFromStorage`, `filteredCourses`, `filteredPrograms`, `filteredScholarships`

Returns: `{ college, loading, reviewsData, reviewsLoading, mappedCourses, mappedEvents, ...all memoized data, inquiryFormState, askFormState, ...formHandlers }`

### 4. `components/CollegeHeader.tsx` (~80 lines)
The header section: college logo, name, location, rating stars, verified badge, follow/unfollow, share, claim, counselling buttons. Currently ~110 lines.

### 5. `components/TabNavigation.tsx` (~70 lines)
Horizontal scrollable tab bar with arrow buttons. Contains:
- `updateTabScrollState` callback (lines 147-170)
- `scrollTabs` function (lines 172-181)
- Tab button rendering with active state
- ResizeObserver/scroll listener setup (lines 241-268)

Props: `{ activeTab, onTabChange, tabs }`

### 6-17. Tab Components (one per tab)
Each tab component receives only the data it needs via props. Pattern:

```tsx
// TabCourses.tsx
interface TabCoursesProps {
  courses: Course[];
  filter: LevelFilter;
  onFilterChange: (f: LevelFilter) => void;
}
export default function TabCourses({ courses, filter, onFilterChange }: TabCoursesProps) { ... }
```

| Component | Lines saved | Key data props |
|-----------|-------------|----------------|
| `TabAbout.tsx` | ~60 | `description`, `videos`, `vision`, `mission`, `overview`, `leadership` |
| `TabCourses.tsx` | ~45 | `courses`, `filter`, `onFilterChange` |
| `TabAdmissions.tsx` | ~50 | `admissions`, `filter`, `onFilterChange`, `collegeId` |
| `TabOffered.tsx` | ~35 | `programs`, `filter`, `onFilterChange` |
| `TabFacilities.tsx` | ~30 | `facilities` |
| `TabEvents.tsx` | ~45 | `events`, `page`, `onPageChange` |
| `TabScholarship.tsx` | ~40 | `scholarships`, `filter`, `onFilterChange` |
| `TabAlumni.tsx` | ~40 | `alumni` |
| `TabGallery.tsx` | ~80 | `images` (handles lightbox internally) |
| `TabReview.tsx` | ~90 | `reviewsData`, `reviewsLoading`, `collegeId` |
| `TabNews.tsx` | ~70 | `news`, `page`, `onPageChange` |
| `TabDownloads.tsx` | ~50 | `downloads` |

### 18. `components/InquiryForm.tsx` (~80 lines)
Combined inquiry + ask-question form logic (lines 1398-1600). Props include form state, handlers, validation, and submission logic. Exposed as two sub-components: `<InquiryForm>` and `<AskQuestionForm>` or a single `<InquiryForm mode="inquiry"|"ask">`.

### 19. `components/index.ts` (barrel)
Re-exports all components for cleaner imports in `page.tsx`.

## What Remains in `page.tsx` (~450 lines)

- Imports (~25 lines)
- Modal open/close state (`isClaimModalOpen`, `isShareModalOpen`, `isCounsellingModalOpen`)
- `useCollegeData(idStr)` hook call
- `shareUrl` state
- Tab renderer map: `const tabRenderers: Record<TabKey, React.FC> = { about: TabAbout, courses: TabCourses, ... }`
- `ActiveTabComponent = tabRenderers[activeTab]`
- Outer JSX: grid layout, sidebar, `<CollegeHeader>`, `<TabNavigation>`, `<ActiveTabComponent {...tabData[activeTab]} />`
- Modals: ClaimCollegeModal, ShareCollegeModal, OpenCounsellingModal
- Inline styles

## Unused Code to Remove

- `CollegeCard` import (line 13) — imported but never used
- `FileX` import (line 14) — imported but never used
- `admissionPage` state (line 135) — declared but never used

## Migration Strategy

1. Create `constants.ts` — move fallback arrays — zero risk, pure data
2. Create `EmptyTabState.tsx` — extract, import back — verify empty tabs still render
3. Create `hooks/useCollegeData.ts` — extract all data logic — verify loading/data states
4. Create tab components one by one, testing each
5. Create `CollegeHeader.tsx`, `TabNavigation.tsx`
6. Create `InquiryForm.tsx`
7. Wire everything in `page.tsx` — verify all tabs render correctly
8. Remove unused imports and dead code

## Mobile Responsiveness

Every extracted component must be mobile responsive:
- Tab grid layouts use responsive column breakpoints (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- Course, admission, program tables wrap/collapse on small screens (use stacked card layout on mobile, table on desktop)
- Tab navigation handles overflow with scroll arrows on all viewports
- Gallery lightbox is fullscreen on mobile
- Forms and modals use full-width on small screens
- College header stacks vertically on mobile (logo, name, actions)
- Existing responsive Tailwind classes in current page must be preserved in extracted components

## Acceptance Criteria

- `page.tsx` ≤ 500 lines
- All 12 tabs render correctly with data and empty states
- College header, tab navigation, modals, forms all functional
- No regression in data fetching, review loading, gallery lightbox
- No TypeScript or ESLint errors
- All components are mobile responsive (tested at 320px width and up)
