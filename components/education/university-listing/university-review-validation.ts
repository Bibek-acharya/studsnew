export function isUniversityReviewValid(
  rating: number,
  pros: string,
  cons: string,
): boolean {
  return rating >= 1 && rating <= 5 && pros.trim().length >= 10 && cons.trim().length >= 10;
}
