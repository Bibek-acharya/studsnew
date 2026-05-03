"use client";

import { apiRequest } from "./api";

export interface ProviderUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  roleLabel: string;
  status: string;
  lastActive: string;
  avatar: string;
  providerId: number;
  permissions: string[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
  roleLabel?: string;
  permissions?: string[];
}

export const PERMISSIONS_LIST = [
  { id: "scholarships", label: "Manage Scholarships", desc: "Create, edit, and delete scholarships" },
  { id: "applications", label: "Manage Applications", desc: "View, approve, and reject applications" },
  { id: "shortlists", label: "Manage Shortlists", desc: "Add and remove shortlisted applicants" },
  { id: "messages", label: "Message", desc: "Send and receive messages" },
  { id: "news", label: "Manage News", desc: "Create, edit, and publish news" },
  { id: "events", label: "Manage Events", desc: "Create, edit, and manage events" },
  { id: "blogs", label: "Manage Blogs", desc: "Create, edit, and publish blog posts" },
  { id: "profile", label: "Manage Profile", desc: "Edit organization profile details" },
  { id: "analytics", label: "Analytics", desc: "View analytics and reports" },
  { id: "evaluation", label: "Evaluation & Results", desc: "Manage written exam, interview, and final results" },
  { id: "access", label: "Assign Access", desc: "Manage user permissions and roles" },
  { id: "settings", label: "Settings", desc: "Configure system settings" },
];

export const providerRbacApi = {
  async getUsers(): Promise<{ users: ProviderUser[]; meta: any }> {
    const res = await apiRequest<{ success: boolean; data: { users: any[]; meta: any } }>("/api/v1/scholarship-providers/auth/access-users");
    const users = ((res.data?.users || []) as any[]).map((u: any) => ({
      id: Number(u.id),
      name: u.name,
      email: u.email,
      role: u.role,
      roleLabel: u.role_label,
      status: u.status,
      lastActive: u.last_active,
      avatar: u.avatar,
      providerId: Number(u.provider_id),
      permissions: u.permissions,
    }));
    return { users, meta: res.data?.meta || {} };
  },

  async getUser(id: number): Promise<ProviderUser> {
    const res = await apiRequest<{ success: boolean; data: any }>(`/api/v1/scholarship-providers/auth/access-users/${id}`);
    const u = res.data || res;
    return {
      id: Number(u.id),
      name: u.name,
      email: u.email,
      role: u.role,
      roleLabel: u.role_label,
      status: u.status,
      lastActive: u.last_active,
      avatar: u.avatar,
      providerId: Number(u.provider_id),
      permissions: u.permissions,
    };
  },

  async createUser(data: CreateUserRequest): Promise<ProviderUser> {
    return apiRequest("/api/v1/scholarship-providers/auth/access-users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateUser(id: number, data: Partial<CreateUserRequest>): Promise<ProviderUser> {
    return apiRequest(`/api/v1/scholarship-providers/auth/access-users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteUser(id: number): Promise<void> {
    return apiRequest(`/api/v1/scholarship-providers/auth/access-users/${id}`, {
      method: "DELETE",
    });
  },

  async updatePermissions(id: number, permissions: string[]): Promise<void> {
    return apiRequest(`/api/v1/scholarship-providers/auth/access-users/${id}/permissions`, {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    });
  },

  async login(email: string, password: string): Promise<{ user: ProviderUser; token: string; permissions: string[] }> {
    const res = await apiRequest<{ success: boolean; data: { user: any; token: string; permissions: string[] } }>("/api/v1/scholarship-providers/auth/access-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const u = res.data?.user || res.user;
    return {
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        roleLabel: u.role_label,
        status: u.status,
        lastActive: u.last_active,
        avatar: u.avatar,
        providerId: u.provider_id,
        permissions: u.permissions,
      },
      token: res.data?.token || res.token,
      permissions: res.data?.permissions || res.permissions || [],
    };
  },

  async changePassword(data: { current_password: string; new_password: string }): Promise<void> {
    return apiRequest("/api/v1/scholarship-providers/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

const PROVIDER_USERS_KEY = "scholarshipProviderUsers";
const PROVIDER_PERMISSIONS_KEY = "scholarshipProviderPermissions";

export function getStoredUsers(): ProviderUser[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(PROVIDER_USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveUsers(users: ProviderUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROVIDER_USERS_KEY, JSON.stringify(users));
}

export interface StoredPermission {
  userId: number;
  permissions: string[];
}

export function getStoredPermissions(): StoredPermission[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(PROVIDER_PERMISSIONS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function savePermissions(userId: number, permissions: string[]): void {
  if (typeof window === "undefined") return;
  const all = getStoredPermissions();
  const idx = all.findIndex(p => p.userId === userId);
  if (idx >= 0) {
    all[idx].permissions = permissions;
  } else {
    all.push({ userId, permissions });
  }
  localStorage.setItem(PROVIDER_PERMISSIONS_KEY, JSON.stringify(all));
}