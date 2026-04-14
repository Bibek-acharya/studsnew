export interface AdmissionFilters {
  search: string;
  academic: string[];
  program: string[];
  province: string[];
  district: string[];
  type: string[];
  scholarship: string[];
  facilities: string[];
  feeMax: number;
  sortBy: string;
  directAdmission: boolean;
}

export const DEFAULT_ADMISSION_FILTERS: AdmissionFilters = {
  search: "",
  academic: [],
  program: [],
  province: [],
  district: [],
  type: [],
  scholarship: [],
  facilities: [],
  feeMax: 2000000,
  sortBy: "popularity",
  directAdmission: false,
};
