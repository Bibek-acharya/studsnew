export interface CollegeFilters {
  search: string;
  academic: string[];
  program: string[];
  course: string[];
  province: string[];
  district: string[];
  type: string[];
  university: string[];
  feeMax: number;
  courseDuration: string[];
  sortBy: string;
  location: string[];
  quick: string[];
  stream: string[];
  facilities: string[];
  feeRange: string[];
  duration: string[];
  popularity: string[];
}

export const DEFAULT_COLLEGE_FILTERS: CollegeFilters = {
  search: "",
  academic: [],
  program: [],
  course: [],
  province: [],
  district: [],
  type: [],
  university: [],
  feeMax: 2000000,
  courseDuration: [],
  sortBy: "popularity",
  location: [],
  quick: [],
  stream: [],
  facilities: [],
  feeRange: [],
  duration: [],
  popularity: [],
};
