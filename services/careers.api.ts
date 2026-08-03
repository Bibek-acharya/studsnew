import { apiRequest } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface Job {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  location: string;
  job_type: string;
  salary_range: string;
  application_deadline?: string;
  status: string;
  application_count: number;
}

export interface JobApplication {
  id: number;
  created_at: string;
  job_id: number;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  has_resume: boolean;
  has_cover_letter: boolean;
  status: string;
  notes?: string;
}

export interface PaginatedJobs {
  jobs: Job[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PaginatedApplications {
  applications: JobApplication[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export const careersApi = {
  listPublishedJobs: (params: { department?: string; search?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.department) query.set("department", params.department);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    return apiRequest<{ success: boolean; data: PaginatedJobs }>(`/api/v1/careers?${query.toString()}`);
  },
  getDepartments: () =>
    apiRequest<{ success: boolean; data: string[] }>("/api/v1/careers/departments"),
  getPublishedJob: (id: number) =>
    apiRequest<{ success: boolean; data: Job }>(`/api/v1/careers/${id}`),
  submitApplication: (jobId: number, formData: FormData) =>
    apiRequest<{ success: boolean; data: JobApplication }>(`/api/v1/careers/${jobId}/apply`, {
      method: "POST",
      body: formData,
    }),
  listAllJobs: (params: { status?: string; search?: string; page?: number; limit?: number } = {}) => {
    const token = localStorage.getItem("superadmin_token");
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    return apiRequest<{ success: boolean; data: PaginatedJobs }>(`/api/v1/superadmin/jobs?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  createJob: (data: Partial<Job>) => {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest<{ success: boolean; data: Job }>("/api/v1/superadmin/jobs", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  updateJob: (id: number, data: Partial<Job>) => {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest<{ success: boolean; data: Job }>(`/api/v1/superadmin/jobs/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  deleteJob: (id: number) => {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest<{ success: boolean }>(`/api/v1/superadmin/jobs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  listApplicants: (jobId: number, params: { status?: string; search?: string; page?: number; limit?: number } = {}) => {
    const token = localStorage.getItem("superadmin_token");
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    return apiRequest<{ success: boolean; data: PaginatedApplications }>(
      `/api/v1/superadmin/jobs/${jobId}/applicants?${query.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
  updateApplicantStatus: (id: number, status: string, notes: string) => {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest<{ success: boolean; data: JobApplication }>(
      `/api/v1/superadmin/jobs/applicants/${id}/status`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      }
    );
  },
  updateApplicantNotes: (id: number, notes: string) => {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest<{ success: boolean; data: JobApplication }>(
      `/api/v1/superadmin/jobs/applicants/${id}/notes`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      }
    );
  },
  sendApplicantEmail: (id: number, subject: string, body: string, updateStatus?: string) => {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest<{ success: boolean }>(
      `/api/v1/superadmin/jobs/applicants/${id}/email`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body, update_status: updateStatus }),
      }
    );
  },
  getResumeUrl: (id: number, download = false) => {
    return `${API_BASE_URL}/api/v1/superadmin/jobs/applicants/${id}/resume${download ? "?download=true" : ""}`;
  },
  getCoverLetterUrl: (id: number, download = false) => {
    return `${API_BASE_URL}/api/v1/superadmin/jobs/applicants/${id}/cover-letter${download ? "?download=true" : ""}`;
  },
};
