export interface CourseFinderFilters {
  academicLevels: string[];
  fields: string[];
  providerTypes: string[];
  location: string[];
  feeRanges: string[];
  scholarships: string[];
  durations: string[];
  admissions: string[];
  popularity: string[];
  province: string;
  nationalWide: boolean;
  quickVerified: boolean;
  quickNew: boolean;
  quickClosing: boolean;
}

export const defaultCourseFinderFilters: CourseFinderFilters = {
  academicLevels: [],
  fields: [],
  providerTypes: [],
  location: [],
  feeRanges: [],
  scholarships: [],
  durations: [],
  admissions: [],
  popularity: [],
  province: "All Provinces",
  nationalWide: false,
  quickVerified: false,
  quickNew: false,
  quickClosing: false,
};

export interface CourseFilterCounts {
  byAcademic: Record<string, number>;
  byField: Record<string, number>;
  byProvider: Record<string, number>;
  byDuration: Record<string, number>;
}

export const defaultCourseFilterCounts: CourseFilterCounts = {
  byAcademic: {},
  byField: {},
  byProvider: {},
  byDuration: {},
};
