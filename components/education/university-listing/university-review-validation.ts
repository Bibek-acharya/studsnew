export function isUniversityReviewValid(
  rating: number,
  pros: string,
  cons: string,
): boolean {
  return rating > 0 && pros.trim().length >= 10 && cons.trim().length >= 10;
}
