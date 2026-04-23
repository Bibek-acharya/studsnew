export interface ReviewRating {
  category: string;
  rating: number;
}

export interface Review {
  id: number;
  collegeId: number;
  collegeName?: string;
  userId?: number;
  userName?: string;
  userInitials?: string;
  studentType: "current" | "alumni";
  course: string;
  level: string;
  batchYear: number;
  ratings: Record<string, number>;
  pros: string;
  cons: string;
  summaryTitle: string;
  yearlyFee?: number;
  scholarship?: boolean;
  internshipOutcome?: string;
  email?: string;
  isVerified: boolean;
  isPublished: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewInput {
  collegeId: number;
  collegeName?: string;
  studentType: "current" | "alumni";
  course: string;
  level: string;
  batchYear: number;
  ratings: Record<string, number>;
  pros: string;
  cons: string;
  summaryTitle: string;
  yearlyFee?: number;
  scholarship?: boolean;
  internshipOutcome?: string;
  email: string;
}

export interface ReviewMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  meta: ReviewMeta;
}

export interface CollegeReviewsResponse {
  reviews: Review[];
  overallRating: number;
  reviewCount: number;
  categoryAverages: Record<string, number>;
  meta: ReviewMeta;
}

export const ratingCategories = [
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

export const ratingStatusLabels: Record<number, string> = {
  1: "Terrible",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Excellent",
};

export function calculateAverageRating(ratings: Record<string, number>): number {
  const values = Object.values(ratings);
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function calculateGroupAverage(
  ratings: Record<string, number>,
  categories: string[]
): number {
  let sum = 0;
  let count = 0;
  categories.forEach((cat) => {
    if (ratings[cat]) {
      sum += ratings[cat];
      count += 1;
    }
  });
  return count > 0 ? sum / count : 0;
}

export const groupCategories = {
  academics: [
    "Teaching Quality & Faculty Support",
    "Library & Resources",
    "Administration & Management",
  ],
  infrastructure: [
    "Infrastructure & Lab Facilities",
    "Hostels & Accommodation",
  ],
  social: [
    "Social & Campus Life",
    "Student Clubs & Activities",
  ],
};

export function formatRatingLabel(rating: number): string {
  return ratingStatusLabels[rating] || "Not Rated";
}

export function validateReviewInput(input: ReviewInput): string[] {
  const errors: string[] = [];

  if (!input.collegeId && !input.collegeName) {
    errors.push("College is required");
  }
  if (!input.studentType) {
    errors.push("Student type is required");
  }
  if (!input.course) {
    errors.push("Course is required");
  }
  if (!input.level) {
    errors.push("Level is required");
  }
  if (!input.batchYear) {
    errors.push("Batch year is required");
  }
  if (!input.pros || input.pros.trim().length < 10) {
    errors.push("Pros must be at least 10 characters");
  }
  if (!input.cons || input.cons.trim().length < 10) {
    errors.push("Cons must be at least 10 characters");
  }
  if (!input.summaryTitle || input.summaryTitle.trim().length < 5) {
    errors.push("Summary title must be at least 5 characters");
  }
  if (!input.email || !input.email.includes("@")) {
    errors.push("Valid email is required");
  }

  const missingRatings = ratingCategories.filter(
    (cat) => !input.ratings[cat] || input.ratings[cat] < 1 || input.ratings[cat] > 5
  );
  if (missingRatings.length > 0) {
    errors.push(`Please rate all categories (missing: ${missingRatings.length})`);
  }

  return errors;
}

export function getUserInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}