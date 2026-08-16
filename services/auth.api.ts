import { apiRequest, type AuthResponse, type RegisterResponse, type OTPResponse } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const authApi = {
  getUser() {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  },
  setUser(user: any | null): void {
    if (typeof window === "undefined") return;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  },
  setScholarshipProviderUser(_user: any | null): void {},
  getScholarshipProviderUser(): any | null {
    return null;
  },
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },
  getScholarshipProviderToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("scholarshipProviderToken");
    }
    return null;
  },
  setToken(token: string | null): void {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  },
  setScholarshipProviderToken(token: string | null): void {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("scholarshipProviderToken", token);
      } else {
        localStorage.removeItem("scholarshipProviderToken");
      }
    }
  },
  isAuthenticated(): boolean {
    return false;
  },
  async logout(): Promise<void> {
    await apiRequest("/api/v1/auth/logout", {
      method: "POST",
      suppressAuthExpired: true,
    });
  },
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: string;
    education_level?: string;
    access_code?: string;
  }): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },
  async sendOTP(
    email: string,
    type: "verification" | "password_reset" = "verification",
  ): Promise<OTPResponse> {
    return apiRequest<OTPResponse>("/api/v1/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, type }),
    });
  },
  async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    return apiRequest<{ exists: boolean }>("/api/v1/auth/check-email", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
  async resetPassword(
    email: string,
    otp: string,
    password: string,
  ): Promise<any> {
    return apiRequest<any>("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, password }),
    });
  },
  async institutionLogin(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/institutions/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async scholarshipProviderLogin(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    return apiRequest<AuthResponse>(
      "/api/v1/scholarship-providers/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
  },
  async scholarshipProviderRegister(data: {
    provider_name: string;
    registration_number: string;
    email: string;
    contact_number?: string;
    pan_number?: string;
    website_url?: string;
  }): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>(
      "/api/v1/scholarship-providers/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },
  async institutionRegister(data: {
    institution_name: string;
    registration_number: string;
    email: string;
    contact_number?: string;
    province?: string;
    district?: string;
    local_body?: string;
    organization_type?: string;
    pan_number?: string;
    website_url?: string;
    contact_person?: string;
    contact_person_designation?: string;
    contact_person_phone?: string;
  }): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/api/v1/institutions/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async saveInstitutionPreferences(
    preferences: Record<string, any>,
  ): Promise<any> {
    return apiRequest("/api/v1/institutions/preferences", {
      method: "POST",
      body: JSON.stringify({ preferences }),
    });
  },
  async getInstitutionPreferences(): Promise<any> {
    return apiRequest("/api/v1/institutions/preferences", {
      method: "GET",
    });
  },
  async institutionSendOTP(
    email: string,
    type: "verification" | "password_reset",
  ): Promise<void> {
    await apiRequest("/api/v1/institutions/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, type }),
    });
  },
  async institutionResetPassword(
    email: string,
    otp: string,
    password: string,
  ): Promise<void> {
    await apiRequest("/api/v1/institutions/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, password }),
    });
  },
  async claimRegister(data: {
    college_id: number;
    institution_name: string;
    registration_number: string;
    email: string;
    contact_number?: string;
    province?: string;
    district?: string;
    local_body?: string;
    organization_type?: string;
    pan_number?: string;
    website_url?: string;
    contact_person?: string;
    contact_person_designation?: string;
    contact_person_phone?: string;
  }): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/api/v1/institutions/auth/claim", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async generateTOTPSecret(): Promise<{
    success: boolean;
    data: { secret: string; qr_uri: string; account: string };
    message: string;
  }> {
    return apiRequest("/api/v1/auth/totp/generate", { method: "POST" });
  },
  async enableTOTP(
    code: string,
  ): Promise<{ success: boolean; message: string }> {
    return apiRequest("/api/v1/auth/totp/enable", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },
  async disableTOTP(
    password: string,
    code: string,
  ): Promise<{ success: boolean; message: string }> {
    return apiRequest("/api/v1/auth/totp/disable", {
      method: "POST",
      body: JSON.stringify({ password, code }),
    });
  },
  async verifyLoginTOTP(
    tempToken: string,
    code: string,
  ): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/auth/totp/verify", {
      method: "POST",
      body: JSON.stringify({ temp_token: tempToken, code }),
    });
  },
  async deactivateAccount(): Promise<{ success: boolean; message: string }> {
    return apiRequest("/api/v1/auth/deactivate", { method: "POST" });
  },
  async queueDeletion(): Promise<{
    success: boolean;
    message: string;
    data?: { scheduled_deletion_at: string };
  }> {
    return apiRequest("/api/v1/auth/delete-queue", { method: "POST" });
  },
  async cancelDeletion(): Promise<{ success: boolean; message: string }> {
    return apiRequest("/api/v1/auth/cancel-deletion", { method: "POST" });
  },
  async getDeletionStatus(): Promise<{
    success: boolean;
    data: { scheduled_deletion_at?: string; days_remaining?: number };
  }> {
    return apiRequest("/api/v1/auth/deletion-status");
  },
  async getLoginSessions(): Promise<{
    success: boolean;
    data: Array<{
      id: number;
      device_name: string;
      device_type: string;
      browser: string;
      location: string;
      ip_address: string;
      is_current: boolean;
      last_active_at: string;
      created_at: string;
    }>;
  }> {
    return apiRequest("/api/v1/auth/sessions");
  },
  async revokeSession(sessionId: number): Promise<void> {
    return apiRequest(`/api/v1/auth/sessions/${sessionId}`, {
      method: "DELETE",
    });
  },
  async revokeAllSessions(): Promise<void> {
    return apiRequest("/api/v1/auth/sessions", { method: "DELETE" });
  },
  async changePassword(data: { current_password: string; new_password: string }): Promise<void> {
    return apiRequest<void>("/api/v1/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  scholarshipProviderLogout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("scholarshipProviderToken");
    localStorage.removeItem("scholarshipProviderUser");
  },
};