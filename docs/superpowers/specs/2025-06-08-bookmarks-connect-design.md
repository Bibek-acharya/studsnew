# Bookmarks: Wire frontend to backend

## Goal

Make the bookmark button on "Find College" functional — when a user clicks it, the college appears on their dashboard bookmarks page. First iteration covers college bookmarks only.

## Current State

- `CollegeGrid.tsx` has `toggleSavedCollege()` that only updates local state (`savedColleges`). No API call.
- `BookmarksSection.tsx` fetches from `GET /api/v1/bookmarks/colleges` but the API returns only metadata (`id`, `item_id`, `type`). The component expects full college data (`name`, `location`, `rating`, etc.), so bookmarks render nothing.
- Backend has all needed endpoints already: create, list, delete bookmarks + get college by ID.

## Changes

### 1. `CollegeGrid.tsx` — Wire bookmark save/delete to API

- Add `useAuth()` to get current user. Show login toast if not authenticated.
- Track `savedBookmarkMap: Map<number, number>` (collegeId → bookmarkId).
- On bookmark toggle:
  - **Save**: call `apiService.createBookmark(collegeId, 'college')`, store returned bookmark ID.
  - **Unsave**: call `apiService.deleteBookmark(bookmarkId)`, remove from map.
- Add toast feedback for each action.

### 2. `BookmarksSection.tsx` — Fetch college details for display

- After getting bookmark list (with `item_id`s), fetch college details via `getCollegeById(item_id)` for each bookmark.
- Cache results client-side to avoid re-fetching on tab switch.
- Transform `College` response into `CollegeBookmark` format — existing card UI works as-is.
- Handle loading/error for the detail fetch.

### 3. `api.ts` — Add helper method `getCollegeById(id)` (already exists — no change needed)

## Non-goals

- No backend changes. All required endpoints already exist.
- Other bookmark types (courses, scholarships, events, entrance, admissions) not touched.
- Bookmark state is not persisted on the server between page reloads in `CollegeGrid` (that's a follow-up).
