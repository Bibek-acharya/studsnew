const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getSuperadminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("superadmin_token");
}

async function superadminFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getSuperadminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  if (res.status === 401 || res.status === 403)
    throw new Error("auth_required");
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Unexpected response: ${text.substring(0, 100)}`);
  }
  if (!res.ok)
    throw new Error(
      data?.message || data?.error || `Request failed (${res.status})`,
    );
  return data?.data ?? data;
}

export const superadminProgramApi = {
  async list(): Promise<{ programs: any[]; meta: { total: number } }> {
    return superadminFetch("/api/v1/superadmin/programs");
  },

  async getById(id: number): Promise<any> {
    return superadminFetch(`/api/v1/superadmin/programs/${id}`);
  },

  async create(data: any): Promise<any> {
    return superadminFetch("/api/v1/superadmin/programs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: any): Promise<any> {
    return superadminFetch(`/api/v1/superadmin/programs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    await superadminFetch(`/api/v1/superadmin/programs/${id}`, {
      method: "DELETE",
    });
  },
};

export const superadminEntranceApi = {
  async list(
    page?: number,
    limit?: number,
    status?: string,
  ): Promise<{ entrances: any[]; meta: { total: number } }> {
    const params = new URLSearchParams();
    if (page !== undefined) params.set("page", String(page));
    if (limit !== undefined) params.set("limit", String(limit));
    if (status !== undefined) params.set("status", status);
    const qs = params.toString();
    return superadminFetch(`/api/v1/superadmin/entrances${qs ? `?${qs}` : ""}`);
  },

  async getById(id: number): Promise<any> {
    return superadminFetch(`/api/v1/superadmin/entrances/${id}`);
  },

  async create(data: any): Promise<any> {
    return superadminFetch("/api/v1/superadmin/entrances", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: any): Promise<any> {
    return superadminFetch(`/api/v1/superadmin/entrances/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    await superadminFetch(`/api/v1/superadmin/entrances/${id}`, {
      method: "DELETE",
    });
  },

  async getApplicants(entranceId: number): Promise<any[]> {
    return superadminFetch(
      `/api/v1/superadmin/entrances/${entranceId}/applicants`,
    );
  },
};

export const superadminGlobalCourseApi = {
  async list(
    page = 1,
    limit = 50,
  ): Promise<{
    courses: any[];
    meta: { total: number; page: number; limit: number; pages: number };
  }> {
    return superadminFetch(`/api/v1/admin/courses?page=${page}&limit=${limit}`);
  },

  async listPending(
    page = 1,
    limit = 50,
  ): Promise<{
    courses: any[];
    meta: { total: number; page: number; limit: number; pages: number };
  }> {
    return superadminFetch(
      `/api/v1/admin/courses/pending?page=${page}&limit=${limit}`,
    );
  },

  async getById(id: number): Promise<any> {
    return superadminFetch(`/api/v1/admin/courses/${id}`);
  },

  async create(data: any): Promise<any> {
    return superadminFetch("/api/v1/admin/courses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: any): Promise<any> {
    return superadminFetch(`/api/v1/admin/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    await superadminFetch(`/api/v1/admin/courses/${id}`, {
      method: "DELETE",
    });
  },

  async publish(id: number): Promise<any> {
    return superadminFetch(`/api/v1/admin/courses/${id}/publish`, {
      method: "PUT",
    });
  },
};

export const superadminAdmissionApi = {
  async list(
    status?: string,
    page?: number,
    limit?: number,
  ): Promise<{ admissions: any[]; meta: { total: number } }> {
    const params = new URLSearchParams();
    if (page !== undefined) params.set("page", String(page));
    if (limit !== undefined) params.set("limit", String(limit));
    if (status !== undefined) params.set("status", status);
    const qs = params.toString();
    return superadminFetch(
      `/api/v1/superadmin/admission-pages${qs ? `?${qs}` : ""}`,
    );
  },

  async getById(id: number): Promise<any> {
    return superadminFetch(`/api/v1/superadmin/admission-pages/${id}`);
  },

  async create(data: any, publish: boolean): Promise<any> {
    return superadminFetch("/api/v1/superadmin/admission-pages", {
      method: "POST",
      body: JSON.stringify({ ...data, publish }),
    });
  },

  async update(id: number, data: any, publish?: boolean): Promise<any> {
    const body = publish !== undefined ? { ...data, publish } : data;
    return superadminFetch(`/api/v1/superadmin/admission-pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  async delete(id: number): Promise<void> {
    await superadminFetch(`/api/v1/superadmin/admission-pages/${id}`, {
      method: "DELETE",
    });
  },
};
