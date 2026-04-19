import { apiRequest } from "./api";

export interface AdmissionFiltersPayload {
  search?: string;
  level?: string;
  academic?: string[];
  program?: string[];
  province?: string[];
  district?: string[];
  local?: string[];
  type?: string[];
  scholarship?: string[];
  facilities?: string[];
  feeMax?: number;
  sortBy?: string;
  directAdmission?: boolean;
  page?: number;
  pageSize?: number;
}

export interface AdmissionCollegeItem {
  id: number;
  name: string;
  full_name?: string;
  location: string;
  affiliation: string;
  type: string;
  rating: number;
  reviews: number;
  programs: number;
  image_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  featured?: boolean;
  verified?: boolean;
  description?: string;
  admissions?: any;
  admission_cards?: any;
  programs_list?: any;
  featured_programs?: any;
}

export interface AdmissionPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdmissionCollegeListResponse {
  data: {
    colleges: AdmissionCollegeItem[];
    pagination: AdmissionPagination;
  };
  message?: string;
}

export interface AdmissionFilterCountsResponse {
  data: {
    total: number;
    type_counts: Record<string, number>;
    type_counts_by_id: Record<string, number>;
    facet_counts_by_id: Record<string, number>;
    featured: number;
    verified: number;
    popular: number;
  };
  message?: string;
}

function buildQueryParams(filters: AdmissionFiltersPayload): string {
  const params = new URLSearchParams();

  if (filters.level) params.append("level", filters.level);
  if (filters.search) params.append("search", filters.search);
  if (filters.feeMax !== undefined) params.append("feeMax", String(filters.feeMax));
  if (filters.sortBy) params.append("sort", filters.sortBy);
  params.append("order", "DESC");
  if (filters.page !== undefined) params.append("page", String(filters.page));
  if (filters.pageSize !== undefined) params.append("pageSize", String(filters.pageSize));
  if (filters.directAdmission) params.append("directAdmission", "true");

  const appendArray = (key: string, values?: string[]) => {
    values?.forEach((value) => {
      if (value) params.append(key, value);
    });
  };

  appendArray("academic", filters.academic);
  appendArray("program", filters.program);
  appendArray("province", filters.province);
  appendArray("district", filters.district);
  appendArray("local", filters.local);
  appendArray("type", filters.type);
  appendArray("scholarship", filters.scholarship);
  appendArray("facilities", filters.facilities);

  return params.toString();
}

export const admissionService = {
  async getAdmissionColleges(
    level: string,
    filters: AdmissionFiltersPayload,
    page: number = 1,
    pageSize: number = 18,
  ): Promise<AdmissionCollegeListResponse> {
    const query = buildQueryParams({ ...filters, level, page, pageSize });
    return await apiRequest<AdmissionCollegeListResponse>(`/api/v1/admissions/colleges?${query}`);
  },

  async getAdmissionCollegeById(id: number): Promise<{ data: { college: AdmissionCollegeItem } }> {
    return await apiRequest<{ data: { college: AdmissionCollegeItem } }>(`/api/v1/admissions/colleges/${id}`);
  },

  async getAdmissionFilterCounts(level: string): Promise<AdmissionFilterCountsResponse> {
    const query = buildQueryParams({ level });
    return await apiRequest<AdmissionFilterCountsResponse>(`/api/v1/admissions/colleges/filter-counts?${query}`);
  },

  async getDirectAdmissionColleges(
    level: string,
    filters: AdmissionFiltersPayload,
    page: number = 1,
    pageSize: number = 18,
  ): Promise<AdmissionCollegeListResponse> {
    const query = buildQueryParams({ ...filters, level, directAdmission: true, page, pageSize });
    return await apiRequest<AdmissionCollegeListResponse>(`/api/v1/admissions/direct?${query}`);
  },
};
