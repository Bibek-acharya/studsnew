const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data as T;
}

export interface AuthResponse {
  data: {
    user: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      role: string;
      preferences?: any;
    };
    token: string;
  };
  message: string;
}

export interface RegisterResponse {
  data: {
    email: string;
    requires_otp: boolean;
  };
  message: string;
}

export interface OTPResponse {
  data: any;
  message: string;
}

export interface EducationCourse {
  id: number;
  title: string;
  colleges: number;
  affiliation: string;
  badges?: string[];
  level?: string;
  field?: string;
  duration?: string;
  estFee?: string;
  privateFee?: string;
  govtFee?: string;
  highlights?: string[];
  careerPath?: string;
  description?: string;
}

export interface College {
  id: number;
  name: string;
  image_url?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  type?: string;
  location?: string;
  affiliation?: string;
  verified?: boolean;
  featured?: boolean;
}

export interface CollegeFilterCountsResponse {
  data: {
    total: number;
    type_counts: Record<string, number>;
    type_counts_by_id: Record<string, number>;
    facet_counts_by_id: Record<string, number>;
    featured: number;
    verified: number;
    popular: number;
  };
}

export interface CollegeRecommendation {
  tuition: string;
  id: number;
  name: string;
  location: string;
  type?: string;
  match_score: number;
  reasons?: string[];
}

export interface CollegeRecommenderPayload {
  student_type: string;
  program_interest: string;
  preferred_location: string;
  budget_preference: string;
  campus_life_priority: string;
  career_goal: string;
  need_scholarship: boolean;
  preferred_mode: string;
  college_type: string;
  final_priority: string;
}

export interface CollegePagination {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface CollegesResponse {
  data: {
    colleges: College[];
    pagination: CollegePagination;
  };
}

export interface ForumUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface ForumCommunity {
  id: number;
  name: string;
  emoji: string;
  description?: string;
  bg_color?: string;
  member_count?: number;
  post_count?: number;
  is_member?: boolean;
}

export interface ForumComment {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  parent_id?: number;
  created_at: string;
  createdAt?: string;
  user: ForumUser;
  replies?: ForumComment[];
}

export interface ForumPost {
  id: number;
  user_id: number;
  community_id: number;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  is_poll: boolean;
  poll_options?: string; // JSON string
  poll_results?: Record<number, number>;
  total_votes?: number;
  voted_option?: number;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  is_liked?: boolean;
  is_disliked?: boolean;
  is_saved?: boolean;
  created_at: string;
  CreatedAt?: string;
  user?: ForumUser;
  community?: ForumCommunity;
}

export const apiService = {
  getUser(): ForumUser | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("user");
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return { id: 1, first_name: "John", last_name: "Doe", email: "john@example.com", role: "Student" };
  },
  setUser(user: ForumUser | null): void {
    if (typeof window === "undefined") return;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  },
  setScholarshipProviderUser(user: any | null): void {
    if (typeof window === "undefined") return;
    if (user) {
      localStorage.setItem("scholarshipProviderUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("scholarshipProviderUser");
    }
  },
  getScholarshipProviderUser(): any | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("scholarshipProviderUser");
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  },
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token") || "mock-token";
  },
  getScholarshipProviderToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("scholarshipProviderToken");
  },
  setToken(token: string | null): void {
    if (typeof window === "undefined") return;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  },
  setScholarshipProviderToken(token: string | null): void {
    if (typeof window === "undefined") return;
    if (token) {
      localStorage.setItem("scholarshipProviderToken", token);
    } else {
      localStorage.removeItem("scholarshipProviderToken");
    }
  },
  isAuthenticated(): boolean {
    return !!this.getToken();
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

  async sendOTP(email: string): Promise<OTPResponse> {
    return apiRequest<OTPResponse>("/api/v1/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async getProfile(): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/profile");
  },

  async resetPassword(email: string, _password: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: "Password reset successfully" };
  },

  async getColleges(params: Record<string, any>): Promise<CollegesResponse> {
    const typeIdToBackendValue: Record<string, string> = {
      ct_private: "Private",
      ct_public: "Public / Govt",
      ct_community: "Community",
      ct_constituent: "Constituent",
      ct_foreign: "Foreign Affiliated",
    };

    const normalizedParams: Record<string, string> = {};
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      if (key === "type" && typeof value === "string") {
        const normalizedTypes = value
          .split(",")
          .map((type) => type.trim())
          .filter(Boolean)
          .map((type) => typeIdToBackendValue[type] || type);
        if (normalizedTypes.length > 0) {
          normalizedParams[key] = normalizedTypes.join(",");
        }
        return;
      }

      normalizedParams[key] = String(value);
    });

    const query = new URLSearchParams(normalizedParams).toString();
    return apiRequest<CollegesResponse>(`/api/v1/colleges${query ? `?${query}` : ""}`);
  },

  async getCollegeFilterCounts(): Promise<CollegeFilterCountsResponse> {
    return apiRequest<CollegeFilterCountsResponse>("/api/v1/colleges/filter-counts");
  },

  async getEducationCourses(): Promise<{ data: { courses: EducationCourse[] } }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const mockCourses: EducationCourse[] = [
      {
        id: 1,
        title: "Science (+2)",
        colleges: 145,
        affiliation: "NEB",
        badges: ["Popular", "Science"],
        level: "+2 (Plus Two)",
        field: "Science",
        duration: "2 Years",
        estFee: "Rs. 1,50,000 - 3,50,000",
        highlights: ["Practical based learning", "Scholarship for top students"],
        careerPath: "Medicine, Engineering, IT, Research",
        description: "The Plus Two Science program is a two-year foundation course.",
      },
      {
        id: 2,
        title: "Management (+2)",
        colleges: 210,
        affiliation: "NEB",
        badges: ["Best Seller"],
        level: "+2 (Plus Two)",
        field: "Management",
        duration: "2 Years",
        estFee: "Rs. 80,000 - 2,00,000",
        highlights: ["Entrepreneurship focus", "Practical accounting"],
        careerPath: "BBA, BBS, CA, Hotel Management",
        description: "Focuses on business, administration and financial management.",
      },
      {
        id: 3,
        title: "A Level Science",
        colleges: 25,
        affiliation: "Cambridge University",
        badges: ["International"],
        level: "A Level",
        field: "Science",
        duration: "2 Years",
        estFee: "Rs. 4,00,000 - 8,00,000",
        highlights: ["Global recognition", "Flexible subject choice"],
        careerPath: "International Admissions, Research, Medical",
        description: "Cambridge International A Level is recognized worldwide.",
      },
      {
        id: 4,
        title: "Diploma in Civil Engineering",
        colleges: 45,
        affiliation: "CTEVT",
        badges: ["Technical"],
        level: "Diploma",
        field: "Engineering",
        duration: "3 Years",
        estFee: "Rs. 2,50,-000 - 4,50,000",
        highlights: ["Job oriented", "Technical skill focused"],
        careerPath: "Sub-Engineer, Project Supervisor, Contractor",
        description: "Technical diploma program under CTEVT for engineering aspirants.",
      },
      {
        id: 5,
        title: "Masters in Business Administration (MBA)",
        colleges: 12,
        affiliation: "Tribhuvan University",
        badges: ["Professional"],
        level: "Masters",
        field: "Management",
        duration: "2 Years",
        estFee: "Rs. 5,00,000 - 9,00,000",
        highlights: ["Leadership training", "Network building"],
        careerPath: "CEO, Manager, Entrepreneur, Consultant",
        description: "Advanced degree for business leadership and management.",
      },
      {
        id: 6,
        title: "Humanities (+2)",
        colleges: 85,
        affiliation: "NEB",
        badges: ["Traditional"],
        level: "+2 (Plus Two)",
        field: "Humanities",
        duration: "2 Years",
        estFee: "Rs. 50,000 - 1,20,000",
        highlights: ["Social science focus", "Creative thinking"],
        careerPath: "Social Work, Law, Journalism, Arts",
        description: "Foundation for social sciences and arts.",
      }
    ];

    const duplicated = Array.from({ length: 42 }, (_, i) => ({
      ...mockCourses[i % mockCourses.length],
      id: i + 1,
      title: i < mockCourses.length ? mockCourses[i].title : `${mockCourses[i % mockCourses.length].title} ${i + 1}`
    }));

    return {
      data: {
        courses: duplicated,
      },
    };
  },

  async createCounsellingBooking(token: string, data: any): Promise<any> {
    console.log("Mock booking with token:", token, data);
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },

  async getEducationScholarships(params: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        scholarships: [
          {
            id: 1,
            title: "National IT Excellence Scholarship (BSc. CSIT)",
            provider: "Tribhuvan University, Nepal",
            type: "Merit-Based",
            status: "OPEN",
            amount: "100% Tuition",
            location: "Bagmati",
            eligibility: "Bachelor (+2 Sci: 2.8+ GPA)",
            deadline: "Aug 15, 2026",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            verified: true,
          }
        ],
        categories: [
          { id: 1, name: "College Based", count: 150 },
          { id: 2, name: "Merit Based", count: 340 }
        ]
      }
    };
  },

  async getEducationScholarshipById(id: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        id: Number(id),
        title: "Global Future Leaders Scholarship 2026",
        provider: "Cambridge University, UK",
        location: "Cambridge, UK",
        value: "$30,000 / Year",
        deadline: "May 15, 2026",
        degree_level: "Masters",
        funding_type: "Fully Funded",
        scholarship_type: "Merit Based",
        description: "Designed for high-achieving international students with leadership potential.",
        image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        status: "OPEN",
        field_of_study: ["IT", "Business"],
        benefits: [{ title: "Full Tuition", description: "Covers all semester fees" }]
      }
    };
  },

  async getEducationSimilarScholarships(id: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        scholarships: [
          {
            id: 101,
            title: "Oxford Tech Award",
            provider: "Oxford University",
            amount: "$25,000",
            image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
          }
        ]
      }
    };
  },

  async getForumCommunities(token?: string): Promise<ForumCommunity[]> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/v1/forum/communities`, { headers });
    if (!response.ok) throw new Error("Failed to fetch communities");
    const data = await response.json();
    return data.data || data;
  },

  async getForumPosts(limit?: number, token?: string, communityId?: number, page?: number): Promise<{ posts: ForumPost[]; has_more: boolean }> {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (communityId) params.set("community_id", String(communityId));
    if (page) params.set("page", String(page));

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts?${params.toString()}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch posts");
    const data = await response.json();
    return data.data || data;
  },

  async joinForumCommunity(token: string, id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/communities/${id}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to join community");
    const data = await response.json();
    return data.data || data;
  },

  async getForumPostComments(postId: number, limit?: number, offset?: number): Promise<any> {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (offset) params.set("offset", String(offset));

    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${postId}/comments?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch comments");
    const data = await response.json();
    return data.data || data;
  },

  async createForumComment(token: string, postId: number, data: any): Promise<ForumComment> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create comment");
    const result = await response.json();
    return result.data || result;
  },

  async voteForumPoll(token: string, postId: number, optionIdx: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${postId}/poll/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ option_index: optionIdx }),
    });
    if (!response.ok) throw new Error("Failed to vote");
    const data = await response.json();
    return data.data || data;
  },

  async likeForumPost(token: string, postId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to like post");
    const data = await response.json();
    return data.data || data;
  },

  async dislikeForumPost(token: string, postId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${postId}/dislike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to dislike post");
    const data = await response.json();
    return data.data || data;
  },

  async saveForumPost(token: string, postId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${postId}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to save post");
    const data = await response.json();
    return data.data || data;
  },

  async createForumPost(token: string, data: any): Promise<ForumPost> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create post");
    const result = await response.json();
    return result.data || result;
  },

  async updateForumPost(token: string, id: number, data: any): Promise<ForumPost> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update post");
    const result = await response.json();
    return result.data || result;
  },

  async deleteForumPost(token: string, id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete post");
    return response.json();
  },

  async getCollegeById(id: number): Promise<{ data: College }> {
    return apiRequest<{ data: College }>(`/api/v1/colleges/${id}`);
  },

  async uploadForumMedia(token: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(`${API_BASE_URL}/api/v1/forum/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload media");
    const data = await response.json();
    return data.data?.urls || data.urls || [];
  },

  async getCollegeRecommenderRecommendations(payload: CollegeRecommenderPayload): Promise<{ data: { recommendations: CollegeRecommendation[] } }> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      data: {
        recommendations: [
          {
            id: 1,
            name: "Pulchowk Campus, IOE",
            location: "Lalitpur",
            type: "Engineering",
            match_score: 9,
            reasons: ["Strong academics", "High placement rate", "Low tuition fees"],
          },
          {
            id: 2,
            name: "Thapathali Campus, IOE",
            location: "Kathmandu",
            type: "Engineering",
            match_score: 8,
            reasons: ["Good infrastructure", "Affordable fees", "Central location"],
          },
          {
            id: 3,
            name: "Kathmandu University",
            location: "Dhulikhel",
            type: "Engineering",
            match_score: 7,
            reasons: ["Excellent campus life", "Modern labs", "International exposure"],
          },
        ],
      },
    };
  },

  async scholarshipProviderLogin(email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/scholarship-provider/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async scholarshipProviderRegister(data: {
    provider_name: string;
    registration_number: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/scholarship-provider/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  scholarshipProviderLogout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("scholarshipProviderToken");
    localStorage.removeItem("scholarshipProviderUser");
  },
  async superadminLogin(email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/superadmin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async superadminRegister(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    access_code: string;
  }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/superadmin/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
