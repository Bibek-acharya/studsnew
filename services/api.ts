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
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token") || "mock-token";
  },
  setToken(token: string | null): void {
    if (typeof window === "undefined") return;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  },
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
  async sendOTP(email: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: "OTP sent to " + email };
  },
  async resetPassword(email: string, _password: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: "Password reset successfully" };
  },

  async getColleges(params: any): Promise<CollegesResponse> {
    console.log("Fetching colleges with params:", params);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockColleges: College[] = Array.from({ length: 16 }, (_, i) => ({
      id: i + 1,
      name: `College ${i + 1}`,
      image_url: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
      description: "Explore academics, facilities, and counselling support for this college.",
      rating: 4.0 + Math.random(),
      reviews: Math.floor(Math.random() * 500) + 50,
      type: i % 3 === 0 ? "Private" : i % 3 === 1 ? "Government" : "Affiliated",
      location: "Kathmandu",
      affiliation: params.affiliation || (i % 2 === 0 ? "Tribhuvan University" : "Pokhara University"),
      verified: i % 4 === 0,
    }));

    return {
      data: {
        colleges: mockColleges,
        pagination: {
          total: 150,
          totalPages: 10,
          page: params.page || 1,
          pageSize: 16,
        },
      },
    };
  },

  async getEducationCourses(): Promise<{ data: { courses: EducationCourse[] } }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const mockCourses: EducationCourse[] = [
      {
        id: 1,
        title: "B.Sc Computer Science & IT (CSIT)",
        colleges: 54,
        affiliation: "Tribhuvan University",
        badges: ["Popular", "IT"],
        level: "Bachelor",
        field: "IT / Computer Science",
        duration: "4 Years",
        estFee: "Rs. 5,00,000",
        highlights: ["Entrance exam required", "Scholarship available"],
        careerPath: "Software Engineer, Web Developer, System Analyst",
        description: "B.Sc CSIT is a four year course of Tribhuvan University.",
      },
      {
        id: 2,
        title: "Chartered Accountancy (CA)",
        colleges: 8,
        affiliation: "ICAN",
        badges: ["Professional"],
        level: "Professional Certification",
        field: "Management",
        duration: "5 Years",
        estFee: "Rs. 3,50,000",
        highlights: ["Intensive training", "High job security"],
        careerPath: "Auditor, Finance Manager, Corporate Advisor",
      },
      {
        id: 3,
        title: "Bachelor in Information Management (BIM)",
        colleges: 25,
        affiliation: "Tribhuvan University",
        badges: ["Hybrid", "IT & Management"],
        level: "Bachelor",
        field: "IT / Computer Science",
        duration: "4 Years",
        estFee: "Rs. 6,00,000",
        highlights: ["Industry exposure", "Combination of IT and Management"],
        careerPath: "Project Manager, IT Administrator, Business Analyst",
      }
    ];

    const duplicated = Array.from({ length: 40 }, (_, i) => ({
      ...mockCourses[i % mockCourses.length],
      id: i + 1,
      title: `${mockCourses[i % mockCourses.length].title} ${i + 1}`
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
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      { id: 1, name: "TU Techies", emoji: "💻", bg_color: "bg-blue-100", member_count: 1200, post_count: 450, is_member: true },
      { id: 2, name: "KU Medical", emoji: "🩺", bg_color: "bg-red-100", member_count: 850, post_count: 230, is_member: false },
      { id: 3, name: "Exam Prep", emoji: "📚", bg_color: "bg-green-100", member_count: 2400, post_count: 890, is_member: true },
    ];
  },

  async getForumPosts(limit?: number, token?: string, communityId?: number): Promise<ForumPost[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = this.getUser()!;
    return [
      {
        id: 101,
        user_id: user.id,
        community_id: communityId || 1,
        title: "How to prepare for CEE?",
        content: "I'm looking for the best resources to prepare for the Common Entrance Examination. Any suggestions?",
        upvotes: 45,
        downvotes: 2,
        comment_count: 12,
        is_liked: true,
        is_poll: false,
        created_at: new Date().toISOString(),
        user: user,
        community: { id: communityId || 1, name: "Medical Prep", emoji: "🩺", bg_color: "bg-red-100" }
      },
      {
        id: 102,
        user_id: 2,
        community_id: communityId || 3,
        title: "BSc CSIT vs BIT",
        content: "Which one should I choose? I'm confused about the curriculum differences.",
        image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200",
        upvotes: 89,
        downvotes: 5,
        comment_count: 24,
        is_poll: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        user: { id: 2, first_name: "Jane", last_name: "Smith", email: "jane@example.com", role: "Student" },
        community: { id: communityId || 3, name: "Tech Talk", emoji: "💻", bg_color: "bg-blue-100" }
      }
    ];
  },

  async joinForumCommunity(token: string, id: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { is_member: true, member_count: 1201 };
  },

  async getForumPostComments(postId: number, limit?: number, offset?: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      comments: [
        {
          id: 1,
          user_id: 2,
          post_id: postId,
          content: "Focus on NCERT for Biology and practice daily MCQs.",
          created_at: new Date().toISOString(),
          user: { id: 2, first_name: "Jane", last_name: "Smith", email: "jane@example.com", role: "Student" },
          replies: []
        }
      ],
      total_count: 1
    };
  },

  async createForumComment(token: string, postId: number, data: any): Promise<ForumComment> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const user = this.getUser()!;
    return {
      id: Math.floor(Math.random() * 1000),
      user_id: user.id,
      post_id: postId,
      content: data.content,
      created_at: new Date().toISOString(),
      user: user,
      replies: []
    };
  },

  async voteForumPoll(token: string, postId: number, optionIdx: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { total_votes: 100, voted_option: optionIdx, poll_results: { [optionIdx]: 50 } };
  },

  async likeForumPost(token: string, postId: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { upvotes: 50, downvotes: 5, is_liked: true, is_disliked: false };
  },

  async dislikeForumPost(token: string, postId: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { upvotes: 45, downvotes: 10, is_liked: false, is_disliked: true };
  },

  async saveForumPost(token: string, postId: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { is_saved: true };
  },

  async createForumPost(token: string, data: any): Promise<ForumPost> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const user = this.getUser()!;
    return {
      id: Math.floor(Math.random() * 1000),
      user_id: user.id,
      community_id: data.community_id,
      title: data.title,
      content: data.content,
      is_poll: data.is_poll || false,
      upvotes: 0,
      downvotes: 0,
      comment_count: 0,
      created_at: new Date().toISOString(),
      user: user
    };
  },

  async updateForumPost(token: string, id: number, data: any): Promise<ForumPost> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = this.getUser()!;
    return {
      id,
      user_id: user.id,
      community_id: 1,
      title: data.title,
      content: data.content,
      is_poll: false,
      upvotes: 10,
      downvotes: 0,
      comment_count: 5,
      created_at: new Date().toISOString(),
      user: user
    };
  },

  async deleteForumPost(token: string, id: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { success: true };
  },

  async getCollegeById(id: number): Promise<{ data: College }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      data: {
        id,
        name: "GoldenGate International College",
        image_url: "https://goldengateintl.com/wp-content/uploads/2023/05/Untitled-design-1.png",
        description: "The B.Sc. in Data Science & Artificial Intelligence is designed to bridge the gap between theoretical mathematics and practical engineering. Students will dive deep into machine learning algorithms, big data analytics, and neural networks.",
        rating: 4.5,
        reviews: 1024,
        type: "Private",
        location: "Kamalpokhari, Kathmandu",
        affiliation: "Tribhuvan University",
        verified: true,
      },
    };
  },

  async uploadForumMedia(token: string, files: File[]): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return files.map(() => "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200");
  },
};
