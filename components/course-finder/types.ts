export interface CourseFinderFilters {
  academicLevels: string[];
  fields: string[];
  maxFee: number;
  feeRanges: string[];
  admissionStatus: string[];
  location: string[];
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
  maxFee: 1000000, // Default 10 Lakhs
  feeRanges: [],
  admissionStatus: [],
  location: [],
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
