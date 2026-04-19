"use server";

import { apiService } from "@/services/api";
import { validateReviewInput, ReviewInput, Review } from "@/lib/review-types";

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function submitReviewAction(
  input: ReviewInput
): Promise<ActionResponse<Review>> {
  const errors = validateReviewInput(input);

  if (errors.length > 0) {
    return {
      success: false,
      error: errors.join(", "),
    };
  }

  try {
    const response = await apiService.submitReview(input);

    if (response?.data?.review) {
      return {
        success: true,
        data: response.data.review,
        message: "Review submitted successfully",
      };
    }

    return {
      success: true,
      data: response as Review,
      message: "Review submitted successfully",
    };
  } catch (error: any) {
    console.error("Submit review error:", error);
    return {
      success: false,
      error: error?.message || "Failed to submit review. Please try again.",
    };
  }
}

export async function getCollegeReviewsAction(
  collegeId: number,
  page = 1,
  limit = 10
) {
  try {
    const response = await apiService.getCollegeReviews(collegeId, {
      page,
      limit,
    });
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    console.error("Get college reviews error:", error);
    return {
      success: false,
      error: error?.message || "Failed to fetch reviews",
    };
  }
}

export async function getUserReviewsAction(page = 1, limit = 10) {
  try {
    const response = await apiService.getUserReviews({ page, limit });
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    console.error("Get user reviews error:", error);
    return {
      success: false,
      error: error?.message || "Failed to fetch your reviews",
    };
  }
}

export async function updateReviewAction(
  reviewId: number,
  data: Partial<{
    pros: string;
    cons: string;
    summaryTitle: string;
    ratings: Record<string, number>;
  }>
): Promise<ActionResponse> {
  try {
    const response = await apiService.updateReview(reviewId, data);
    return {
      success: true,
      data: response,
      message: "Review updated successfully",
    };
  } catch (error: any) {
    console.error("Update review error:", error);
    return {
      success: false,
      error: error?.message || "Failed to update review",
    };
  }
}

export async function deleteReviewAction(
  reviewId: number
): Promise<ActionResponse> {
  try {
    await apiService.deleteReview(reviewId);
    return {
      success: true,
      message: "Review deleted successfully",
    };
  } catch (error: any) {
    console.error("Delete review error:", error);
    return {
      success: false,
      error: error?.message || "Failed to delete review",
    };
  }
}

export async function markReviewHelpfulAction(
  reviewId: number
): Promise<ActionResponse> {
  try {
    const response = await apiService.markReviewHelpful(reviewId);
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    console.error("Mark helpful error:", error);
    return {
      success: false,
      error: error?.message || "Failed to mark review as helpful",
    };
  }
}

export async function reportReviewAction(
  reviewId: number,
  reason: string
): Promise<ActionResponse> {
  if (!reason || reason.trim().length < 10) {
    return {
      success: false,
      error: "Please provide a valid reason for reporting",
    };
  }

  try {
    const response = await apiService.reportReview(reviewId, reason);
    return {
      success: true,
      message: "Report submitted successfully",
    };
  } catch (error: any) {
    console.error("Report review error:", error);
    return {
      success: false,
      error: error?.message || "Failed to submit report",
    };
  }
}