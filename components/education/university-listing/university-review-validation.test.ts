import { isUniversityReviewValid } from "./university-review-validation";

describe("isUniversityReviewValid", () => {
  it("rejects blank or short pros and cons", () => {
    expect(isUniversityReviewValid(4, "a".repeat(10), "b".repeat(9))).toBe(false);
    expect(isUniversityReviewValid(4, " ".repeat(10), "b".repeat(10))).toBe(false);
  });

  it("accepts a rating and both fields with at least ten characters", () => {
    expect(isUniversityReviewValid(4, "a".repeat(10), "b".repeat(10))).toBe(true);
  });
});
