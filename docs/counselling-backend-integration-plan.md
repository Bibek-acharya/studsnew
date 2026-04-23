# Counselling Backend Integration Plan

## Goal
Integrate the counseling frontend UI with the backend API so student counseling booking flows work end-to-end and institution counselors can manage bookings from the dashboard.

## Current Frontend Coverage

### Main student booking experience
- `app/counseling/page.tsx` renders the booking route
- `components/counseling/BookCounsellingPage.tsx` contains the booking form and local UI state
- Current form behavior: collects college, program, course, date, time, student details, session mode, and notes
- Booking submission currently calls `apiService.createCounsellingBooking(...)` from `services/api.ts`
- `services/api.ts` contains a mock `createCounsellingBooking` implementation, not a real backend call

### User dashboard counseling view
- `app/user/dashboard/counselling/page.tsx` renders `components/user/dashboard/sections/CounsellingSection.tsx`
- That component is currently static/demo data for upcoming sessions and exploration
- Needs real `GET /counselling/bookings/my` integration

### Institution counseling management
- `app/institution-zone/dashboard/counselling/page.tsx` renders `components/institution-zone/dashboard/institution/CounsellingPage.tsx`
- That component currently uses static request and slot data
- Needs real backend integration for booking list, session slots, and booking status updates

## Existing Backend API Contract
From `studsback/API_DOCUMENTATION.md`:
- `POST /counselling/bookings` - Create counselling booking
- `GET /counselling/bookings/my` - Get my bookings
- `GET /institution/counselling/sessions` - List sessions
- `GET /institution/counselling/bookings` - List bookings
- `PUT /institution/counselling/bookings/:id/status` - Update booking status

## Frontend API integration surface

### `services/api.ts`
Add real implementations for:
- `createCounsellingBooking(token, data)`
- `getMyCounsellingBookings()`
- `getInstitutionCounsellingBookings()`
- `getInstitutionCounsellingSessions()`
- `updateInstitutionBookingStatus(id, status)`

Possible new type definitions:
- `CounsellingBookingPayload`
- `CounsellingBookingResponse`
- `CounsellingBookingItem`
- `CounsellingSessionItem`

### Auth and headers
- `apiRequest()` already attaches `Authorization: Bearer <token>` when token exists
- `BookCounsellingPage` uses `useAuth()` to read `token`
- Backend booking endpoint is protected; student must be logged in
- Ensure `NEXT_PUBLIC_API_URL` points to backend URL in environment

## Data mapping for booking payload

Current UI fields -> expected backend fields
- `collegeInput` -> `college`
- `program` -> `program_level`
- `course` -> `interested_course`
- `isOnline` -> `session_mode` (`online` / `in_person`)
- `selectedDate` -> `session_date`
- `selectedTime` -> `session_time`
- `studentName` -> `student_name`
- `studentPhone` -> `student_phone`
- `studentEmail` -> `student_email`
- `studentNotes` -> `student_notes`

Potential backend payload shape:
```json
{
  "college": "KIST College",
  "program_level": "Undergraduate",
  "interested_course": "Computer Science & IT",
  "session_mode": "online",
  "session_date": "MON, 06 Nov 2026",
  "session_time": "10:30 - 11:30 AM",
  "student_name": "Ram Sharma",
  "student_phone": "+977-98xxxxxxx",
  "student_email": "ram@example.com",
  "student_notes": "I need help choosing a college for CSIT."
}
```

## Integration tasks

### 1. Replace mock booking API with backend call
- In `services/api.ts`, use `apiRequest` and return the real response
- Keep `token` header handling in `apiRequest`
- Example:
  - `return apiRequest('/counselling/bookings', { method: 'POST', body: JSON.stringify(data) })`

### 2. Connect student dashboard to real bookings
- Add `getMyCounsellingBookings()` in `services/api.ts`
- Fetch `GET /counselling/bookings/my`
- Render actual upcoming/past bookings in `CounsellingSection.tsx`
- Replace hardcoded `BOOKED`, `UPCOMING`, `PAST` arrays with fetched data
- Use booking status to drive tab state and UI badges

### 3. Add endpoint support for counseling slots and requests
- Add institution-facing API calls:
  - `GET /institution/counselling/bookings`
  - `GET /institution/counselling/sessions`
  - `PUT /institution/counselling/bookings/:id/status`
- Replace static `REQUESTS` and `DEFAULT_SLOTS` in `CounsellingPage.tsx`
- Use server data for request list, filter controls, booking actions, and new slot creation

### 4. Add slot creation and availability support
- If backend supports session creation through `/institution/counselling/sessions`, wire the slot form to it
- Otherwise, add a future endpoint like `POST /institution/counselling/sessions`
- Use real session availability rather than demo date arrays and static times

### 5. Show booking confirmation and error states cleanly
- Preserve `isBooking`, `isConfirmed`, and `submitError`
- Show backend validation messages from response
- If backend returns booking ID or details, optionally show one-click calendar add or view booking link

### 6. Validate the session date/time format
- Confirm backend expects date/time as strings or structured fields
- If backend supports `session_date` and `session_time` separately, keep current shape
- Otherwise normalise to ISO or server-required format

## Recommended frontend implementation details

### BookCounsellingPage
- Keep `use client`
- Use local state and validation
- Use `setSubmitError` for authorization and network errors
- Use `window.alert` only as fallback; prefer in-page confirmation alert for UX consistency
- Add form reset after success and navigate user to booking summary if needed

### CounsellingSection (student dashboard)
- Add `useEffect` to load bookings on mount
- Use hooks to manage `isLoading`, `bookings`, and `fetchError`
- Map backend status values to UI chips and tab sections
- Example sections:
  - `booked` / `upcoming`
  - `past`
  - `explore` can remain static or become counselor marketplace

### Institution CounsellingPage
- Replace static list with real booking list from API
- Provide actions per booking: Accept, Reject, Send Link
- Use `PUT /institution/counselling/bookings/:id/status` for status changes
- If backend returns meeting link support, store `meeting_url` in booking item
- Slot management should read from sessions endpoint and allow new slot creation if API supports it

## Missing API or backend improvements to request

The frontend currently requires the following backend capabilities beyond the documented booking creation endpoint:
- `GET /counselling/sessions` or `GET /counselling/slots` for available student booking slots
- `POST /institution/counselling/sessions` for institution slot creation (if slot creation is desired)
- `GET /counselling/bookings/my` response shape with fields for date/time, mode, status, counselor, and booking id
- `GET /institution/counselling/bookings` response shape for institution requests
- Standardised status values: `Pending`, `Accepted`, `Rejected`, `Link Sent`

## Delivery outline

1. Implement API wrappers in `studsnew/services/api.ts`
2. Update `components/counseling/BookCounsellingPage.tsx` to call real backend
3. Add student booking fetch logic in `components/user/dashboard/sections/CounsellingSection.tsx`
4. Update institution dashboard component to use backend request/session data
5. Test booking submission, auth flow, error handling, and institution status updates
6. Verify `NEXT_PUBLIC_API_URL` and auth token propagation in development environment

## Notes
- The frontend already has auth token handling and API helper infrastructure
- The booking form is ready for backend integration; the current blocker is the mock service and static dashboard data
- Keep the backend contract stable: use the documented counseling endpoints and map UI fields to the expected payload

## Next step
Wire real backend endpoints in `services/api.ts`, then update the student and institution counseling components to consume those endpoints.
