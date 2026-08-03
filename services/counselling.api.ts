import { apiRequest, type CounsellingBookingPayload, type MyCounsellingBookingsResponse, type InstitutionCounsellingSessionsResponse, type InstitutionCounsellingBookingsResponse, type InstitutionCounsellingBookingItem } from "./api";

export const counsellingApi = {
  async createCounsellingBooking(
    token: string,
    data: CounsellingBookingPayload,
  ): Promise<{ data: any; message: string }> {
    return apiRequest<{ data: any; message: string }>(
      "/api/v1/counselling/bookings",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },
  async getMyCounsellingBookings(): Promise<MyCounsellingBookingsResponse> {
    return apiRequest<MyCounsellingBookingsResponse>(
      "/api/v1/counselling/bookings/my",
    );
  },
  async getInstitutionCounsellingSessions(
    page = 1,
    limit = 50,
  ): Promise<InstitutionCounsellingSessionsResponse> {
    return apiRequest<InstitutionCounsellingSessionsResponse>(
      `/api/v1/institution/counselling/sessions?page=${page}&limit=${limit}`,
    );
  },
  async getInstitutionCounsellingBookings(
    page = 1,
    limit = 20,
  ): Promise<InstitutionCounsellingBookingsResponse> {
    return apiRequest<InstitutionCounsellingBookingsResponse>(
      `/api/v1/institution/counselling/bookings?page=${page}&limit=${limit}`,
    );
  },
  async updateInstitutionBookingStatus(
    id: number,
    status: string,
    meetingLink?: string,
    meetingPlatform?: string,
  ): Promise<{ data: InstitutionCounsellingBookingItem; message: string }> {
    return apiRequest<{
      data: InstitutionCounsellingBookingItem;
      message: string;
    }>(`/api/v1/institution/counselling/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({
        status,
        meeting_link: meetingLink,
        meeting_platform: meetingPlatform,
      }),
    });
  },
  async updateCounsellingSession(
    id: number,
    data: {
      title?: string;
      description?: string;
      scheduled_at?: string;
      duration?: number;
      max_seats?: number;
      status?: string;
    },
  ): Promise<any> {
    return apiRequest<any>(`/api/v1/institution/counselling/sessions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async getPublicCounsellingSessions(institutionId: number): Promise<any> {
    return apiRequest<any>(
      `/api/v1/institutions/public/${institutionId}/counselling-sessions`,
    );
  },
  async createPublicCounsellingBooking(data: {
    session_id: number;
    program_level: string;
    interested_course: string;
    session_mode: string;
    student_name: string;
    student_phone: string;
    student_email: string;
    student_notes?: string;
  }): Promise<any> {
    return apiRequest<any>("/api/v1/counselling/sessions/book", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
