import { apiRequest } from "./api";

export const faqApi = {
  async getFAQCategories(): Promise<{
    success: boolean;
    data: Array<{
      id: number;
      name: string;
      description: string;
      order: number;
      items: Array<{ id: number; category_id: number; question: string; answer: string; order: number }>;
    }>;
  }> {
    return apiRequest("/api/v1/faq");
  },
  async createFAQCategory(data: { name: string; description?: string }): Promise<any> {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest("/api/v1/admin/faq/categories", {
      method: "POST",
      body: JSON.stringify(data),
      authToken: token || undefined,
    });
  },
  async updateFAQCategory(id: number, data: any): Promise<any> {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest(`/api/v1/admin/faq/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      authToken: token || undefined,
    });
  },
  async deleteFAQCategory(id: number): Promise<any> {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest(`/api/v1/admin/faq/categories/${id}`, {
      method: "DELETE",
      authToken: token || undefined,
    });
  },
  async createFAQItem(data: { category_id: number; question: string; answer: string }): Promise<any> {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest("/api/v1/admin/faq/items", {
      method: "POST",
      body: JSON.stringify(data),
      authToken: token || undefined,
    });
  },
  async updateFAQItem(id: number, data: any): Promise<any> {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest(`/api/v1/admin/faq/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      authToken: token || undefined,
    });
  },
  async deleteFAQItem(id: number): Promise<any> {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest(`/api/v1/admin/faq/items/${id}`, {
      method: "DELETE",
      authToken: token || undefined,
    });
  },
};
