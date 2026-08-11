import { apiRequest, type ApiRequestOptions } from "./api";

export const reviewApi = {
  async getCollegeReviews(
    collegeId: number,
    params?: { page?: number; limit?: number; sort?: string; inst_id?: number },
    options?: ApiRequestOptions,
  ): Promise<any> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.sort) query.set("sort", params.sort);
    if (params?.inst_id) query.set("inst_id", String(params.inst_id));
    const queryStr = query.toString();
    return apiRequest<any>(
      `/api/v1/education/reviews/college/${collegeId}${queryStr ? `?${queryStr}` : ""}`,
      options,
    );
  },
  async submitReview(
    data: {
      collegeId: number;
      collegeName?: string;
      institutionId?: number;
      studentType: "current" | "alumni";
      course?: string;
      level?: string;
      batchYear: number;
      ratings: Record<string, number>;
      pros: string;
      cons: string;
      summaryTitle?: string;
      yearlyFee?: number;
      scholarship?: boolean;
      internshipOutcome?: string;
      email: string;
    },
    options?: ApiRequestOptions,
  ): Promise<any> {
    return apiRequest<any>("/api/v1/user/reviews", {
      method: "POST",
      body: JSON.stringify({
        college_id: data.collegeId,
        college_name: data.collegeName,
        institution_id: data.institutionId,
        student_type: data.studentType,
        course: data.course,
        level: data.level,
        batch_year: data.batchYear,
        ratings: data.ratings,
        pros: data.pros,
        cons: data.cons,
        summary_title: data.summaryTitle,
        yearly_fee: data.yearlyFee,
        scholarship: data.scholarship,
        internship_outcome: data.internshipOutcome,
        email: data.email,
      }),
      ...options,
    });
  },
  async getUserReviews(
    params?: { page?: number; limit?: number },
    options?: ApiRequestOptions,
  ): Promise<any> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const queryStr = query.toString();
    return apiRequest<any>(
      `/api/v1/user/reviews${queryStr ? `?${queryStr}` : ""}`,
      options,
    );
  },
  async updateReview(
    reviewId: number,
    data: Partial<{ pros: string; cons: string; summaryTitle: string; ratings: Record<string, number> }>,
    options?: ApiRequestOptions,
  ): Promise<any> {
    return apiRequest<any>(`/api/v1/user/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  },
  async deleteReview(reviewId: number, options?: ApiRequestOptions): Promise<any> {
    return apiRequest<any>(`/api/v1/user/reviews/${reviewId}`, {
      method: "DELETE",
      ...options,
    });
  },
  async markReviewHelpful(reviewId: number, options?: ApiRequestOptions): Promise<any> {
    return apiRequest<any>(`/api/v1/education/reviews/${reviewId}/helpful`, {
      method: "POST",
      ...options,
    });
  },
  async reportReview(reviewId: number, reason: string, options?: ApiRequestOptions): Promise<any> {
    return apiRequest<any>(`/api/v1/user/reviews/${reviewId}/report`, {
      method: "POST",
      body: JSON.stringify({ reason }),
      ...options,
    });
  },
  async submitTestimonial(data: { name: string; designation: string; rating: number; review: string }): Promise<{ success: boolean; message: string; data?: any }> {
    return apiRequest("/api/v1/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async getUserTestimonials(): Promise<{
    success: boolean;
    data: Array<{ id: number; user_id: number; user_name: string; role: string; image_url: string; rating: number; experience: string; created_at: string }>;
  }> {
    return apiRequest("/api/v1/testimonials");
  },
};
