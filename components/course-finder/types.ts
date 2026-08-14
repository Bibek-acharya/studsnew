export interface CourseFinderFilters {
  academicLevels: string[];
  fields: string[];
  universities: string[];
  entranceRequired: boolean;
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
  universities: [],
  entranceRequired: false,
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
  byUniversity: Record<string, number>;
  byProvider: Record<string, number>;
  byDuration: Record<string, number>;
}

export const defaultCourseFilterCounts: CourseFilterCounts = {
  byAcademic: {},
  byField: {},
  byUniversity: {},
  byProvider: {},
  byDuration: {},
};
