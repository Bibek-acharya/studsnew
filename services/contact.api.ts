import { apiRequest, type ContactInquiryResponse } from "./api";

export const contactApi = {
  async submitContactInquiry(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
    type?: string;
    subject?: string;
  }): Promise<ContactInquiryResponse> {
    return apiRequest<ContactInquiryResponse>("/api/v1/system/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async getContactInquiries(): Promise<{
    success: boolean;
    data: {
      inquiries: ContactInquiryResponse["data"][];
      meta: { total: number; page: number; limit: number };
    };
    message: string;
  }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    return apiRequest("/api/v1/admin/inquiries", {
      authToken: token || undefined,
    });
  },
  async updateContactInquiryStatus(
    id: number,
    status: string,
  ): Promise<{ success: boolean; message: string }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    return apiRequest(`/api/v1/admin/inquiries/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
      authToken: token || undefined,
    });
  },
};
