# StudSphere Reviews - Backend Integration Plan

## Overview

The reviews feature allows students to write and read reviews for colleges in Nepal. Currently, it uses local state and API service. This document outlines the architecture, gaps, and integration roadmap.

---

## Current Architecture

### Page Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/write-review` | `WriteReviewPage.tsx` | Submit new review |
| `/user/dashboard/reviews` | `ReviewsSection.tsx` | User's reviews |
| `/find-college/[id]` | (tab) Review | College reviews |
| `/api/reviews` | (planned) | API endpoint |

### Data Flow

```
WriteReviewPage → Submits to API → apiService → Backend
College Detail → Fetches via API → apiService → Reviews list
User Dashboard → Fetches via API → User's reviews
```

---

## Features Implemented

### Write Review Page (`/write-review`)

- [x] Student type selection (Current/Alumni)
- [x] College autocomplete search (18 colleges)
- [x] Level selection (+2, Bachelor's, Master's, Diploma)
- [x] Course autocomplete (based on level)
- [x] Batch year picker (1989-current)
- [x] 10-category rating system (1-5 stars)
- [x] Pros text area
- [x] Cons text area
- [x] Summary title
- [x] Optional: yearly fee, scholarship, internship outcome
- [x] Email verification field
- [x] Certification checkbox
- [x] Live rating preview
- [x] Group averages (Academics, Infrastructure, Social)
- [x] Form validation
- [x] Success/error modal

### College Detail Reviews (Tab)

- [x] Overall rating display
- [x] Review count
- [x] Review cards list
- [x] "Based on X reviews" text

### User Dashboard

- [x] User's submitted reviews list
- [x] Edit/delete options (planned)

---

## Rating Categories

```typescript
const ratingCategories = [
  "Teaching Quality & Faculty Support",
  "Infrastructure & Lab Facilities",
  "Social & Campus Life",
  "Placement & Internships",
  "Value for Money",
  "Hostels & Accommodation",
  "Student Clubs & Activities",
  "Administration & Management",
  "Library & Resources",
  "Overall Experience",
];
```

### Rating Labels

| Value | Label |
|-------|-------|
| 1 | Terrible |
| 2 | Bad |
| 3 | Okay |
| 4 | Good |
| 5 | Excellent |

### Group Averages

| Group | Categories |
|-------|-----------|
| Academics | Teaching Quality, Library, Administration |
| Infrastructure | Infrastructure, Hostels |
| Social | Social, Student Clubs |

---

## Missing / Gaps

### Critical Gaps

1. **No Backend API** - No endpoint for review submission
2. **No Review Listing API** - Can't fetch college reviews
3. **No User Reviews API** - Can't fetch user's reviews
4. **No Verification System** - Email verification not implemented

### Functional Gaps

5. **No Edit Reviews** - Can't edit after submission
6. **No Delete Reviews** - Can't delete
7. **No Helpfulness Votes** - Can't vote helpful
8. **No Report Review** - Can't report inappropriate
9. **No college Admin Response** - Can't reply to reviews

### Data Gaps

10. **No college Suggestions DB** - Hardcoded list
11. **No Course Suggestions DB** - Hardcoded list
12. **No Verified Badge** - Can't show verified reviews

### UX Gaps

13. **No Photo Upload** - Can't add photos
14. **No Anonymous Reviews** - Always shows name
15. **No Edit After Submit** - One-time only

---

## Backend API Requirements

### Required Endpoints

```yaml
# Public API
GET    /api/v1/education/reviews
       - query: collegeId, page, limit, sort
       - response: { reviews: Review[], meta: Meta }

GET    /api/v1/education/reviews/:id
       - response: { review: Review, helpfulCount }

POST   /api/v1/education/reviews/:id/helpful
       - body: { userId }
       - response: { count }

# User API (requires auth)
GET    /api/v1/user/reviews
       - query: page, limit
       - response: { reviews: Review[], meta: Meta }

POST   /api/v1/user/reviews
       - body: ReviewInput
       - response: { review: Review }

PUT    /api/v1/user/reviews/:id
       - body: Partial<ReviewInput>
       - response: { review: Review }

DELETE /api/v1/user/reviews/:id
       - response: { message }

POST   /api/v1/user/reviews/:id/report
       - body: { reason }
       - response: { message }
```

### Database Schema

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  college_id INT REFERENCES colleges(id),
  user_id INT REFERENCES users(id),
  student_type VARCHAR(20) CHECK (student_type IN ('current', 'alumni')),
  course VARCHAR(100),
  level VARCHAR(50),
  batch_year INT,
  pros TEXT,
  cons TEXT,
  summary_title VARCHAR(255),
  yearly_fee DECIMAL(12,2),
  scholarship BOOLEAN,
  internship_outcome VARCHAR(50),
  verified_email VARCHAR(255),
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE review_ratings (
  id SERIAL PRIMARY KEY,
  review_id INT REFERENCES reviews(id),
  category VARCHAR(50) NOT NULL,
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  UNIQUE(review_id, category)
);

CREATE TABLE review_helpful (
  id SERIAL PRIMARY KEY,
  review_id INT REFERENCES reviews(id),
  user_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(review_id, user_id)
);

CREATE TABLE review_reports (
  id SERIAL PRIMARY KEY,
  review_id INT REFERENCES reviews(id),
  user_id INT REFERENCES users(id),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Review Submission Payload

```typescript
interface ReviewInput {
  collegeId: number;
  studentType: "current" | "alumni";
  course: string;
  level: string;
  batchYear: number;
  pros: string;
  cons: string;
  summaryTitle: string;
  ratings: {
    [category: string]: number; // 1-5
  };
  yearlyFee?: number;
  scholarship?: boolean;
  internshipOutcome?: string;
  email: string;
}
```

---

## Implementation Plan

### Phase 1: API Layer

Create `/app/api/v1/education/reviews/route.ts`:

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reviews = await getReviews({
    collegeId: searchParams.get("collegeId"),
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
  });
  return Response.json({ reviews, meta: {...} });
}
```

### Phase 2: Services

Create `/services/reviewService.ts`:

```typescript
export async function submitReview(data: ReviewInput): Promise<Review>
export async function getCollegeReviews(collegeId: number, filters): Promise<Review[]>
export async function getUserReviews(userId: number): Promise<Review[]>
export async function markHelpful(reviewId: string, userId: string): Promise<void>
export async function reportReview(reviewId: string, userId: string, reason: string): Promise<void>
```

### Phase 3: Updates

- [ ] Add edit/delete to user dashboard
- [ ] Add helpful vote button
- [ ] Add report button
- [ ] Add verified badge
- [ ] Add college admin response

### Phase 4: Database

- [ ] Create migrations
- [ ] Seed college/course data
- [ ] Add verification email flow

---

## File Structure

```
/app
├── write-review/
│   └── page.tsx              # Already exists
├── user/dashboard/reviews/
│   └── page.tsx
├── api/v1/
│   ├── education/reviews/
│   │   └── route.ts
│   └── user/reviews/
│       └── route.ts
/services
├── reviewService.ts        # New
/lib
├── college-suggestions.ts   # New (replace hardcoded)
├── course-suggestions.ts     # New (replace hardcoded)
/components
├── reviews/
│   ├── WriteReviewPage.tsx # Update to use service
│   └── ReviewCard.tsx      # Already exists
/docs
├── reviews-backend-integration-plan.md
```

---

## Caching Strategy

| Endpoint | Cache Strategy | Revalidation |
|----------|---------------|--------------|
| `/api/v1/education/reviews` | `revalidate: 300` | 5 min |
| `/api/v1/user/reviews` | `no-store` | Dynamic |

---

## Testing Checklist

- [ ] Submit review works and saves
- [ ] College reviews display correctly
- [ ] User reviews list works
- [ ] Rating averages calculate correctly
- [ ] Group averages calculate correctly
- [ ] Form validation works
- [ ] Search suggestions work
- [ ] Pagination works

---

## Notes

- Consider email verification before publishing reviews
- Add "verified student" badge for verified reviews
- Consider limiting one review per user per college
- Add review moderation queue for admin
- The college details page already has review tab with ReviewCard component