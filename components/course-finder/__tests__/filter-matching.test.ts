import {
  ACADEMIC_LEVEL_OPTIONS,
  FIELD_OPTIONS,
  UNIVERSITY_OPTIONS,
  buildCourseFilterCounts,
  courseMatchesFilters,
  filterCourses,
  matchesFilterOption,
  normalizeFacetValue,
  type FilterOption,
} from "@/components/course-finder/filter-matching";
import { defaultCourseFinderFilters, CourseFinderFilters } from "@/components/course-finder/types";
import type { GlobalCourse } from "@/types/course";

function makeCourse(overrides: Partial<GlobalCourse>): GlobalCourse {
  return {
    id: 1,
    title: "Course",
    shortTitle: "",
    description: "",
    duration: "",
    level: "",
    field: "",
    fieldOfStudy: "",
    affiliationId: null,
    affiliationName: "",
    nonUniversityAffiliation: "",
    estFee: "",
    govtFee: "",
    privateFee: "",
    mode: "",
    degreeLabel: "",
    careerPath: "",
    location: "",
    badges: [],
    highlights: [],
    about: [],
    curriculum: [],
    admissions: [],
    careers: [],
    bannerUrl: "",
    whoShouldChoose: [],
    features: [],
    eligibilityRows: [],
    eligibilityText: "",
    admissionSteps: [],
    subjectGroups: [],
    feeItems: [],
    feeStructure: "",
    scholarshipDesc: "",
    scholarshipNotes: "",
    scholarships: [],
    fullTimeCourses: [],
    faqs: [],
    downloads: [],
    isGlobal: true,
    status: "published",
    createdBy: 0,
    sourceProgramId: null,
    created_at: "",
    updated_at: "",
    ...overrides,
  };
}

function withFilters(overrides: Partial<CourseFinderFilters>): CourseFinderFilters {
  return { ...defaultCourseFinderFilters, ...overrides };
}

function optionFor(options: FilterOption[], id: string): FilterOption {
  const option = options.find((item) => item.id === id);
  if (!option) throw new Error(`missing filter option: ${id}`);
  return option;
}

// The superadmin course form writes levels from its own vocabulary. The public
// finder groups them, so every option has to reach each stored spelling.
const STORED_LEVELS = [
  "+2",
  "A-Level",
  "TSLC (CTEVT)",
  "Diploma (CTEVT)",
  "PCL",
  "Bachelor's",
  "Bachelor's (Honours)",
  "Postgraduate Diploma (PGD)",
  "Master's",
  "MPhil",
  "PhD",
];

describe("course finder academic level filter", () => {
  const expectations: Record<string, string[]> = {
    "Higher Secondary (+2)": ["+2"],
    "A Levels": ["A-Level"],
    "Pre-Diploma / TSLC": ["TSLC (CTEVT)"],
    // Regression: the grouped label used to match only "PCL".
    "Diploma / PCL": ["Diploma (CTEVT)", "PCL"],
    "Bachelor's Degree": ["Bachelor's", "Bachelor's (Honours)"],
    "Postgraduate Diploma": ["Postgraduate Diploma (PGD)"],
    "Master's Degree": ["Master's"],
    // Regression: "M.Phil." used to match nothing at all.
    "M.Phil.": ["MPhil"],
    "PhD / Doctorate": ["PhD"],
  };

  it.each(Object.entries(expectations))(
    "%s matches %j",
    (optionId, expectedLevels) => {
      const option = optionFor(ACADEMIC_LEVEL_OPTIONS, optionId);
      const matched = STORED_LEVELS.filter((level) => matchesFilterOption(level, option));
      expect(matched.sort()).toEqual([...expectedLevels].sort());
    },
  );

  it("does not leak a level into an unrelated option", () => {
    const postgraduate = optionFor(ACADEMIC_LEVEL_OPTIONS, "Postgraduate Diploma");
    expect(matchesFilterOption("Diploma (CTEVT)", postgraduate)).toBe(false);
    expect(matchesFilterOption("Diploma (CTEVT)", optionFor(ACADEMIC_LEVEL_OPTIONS, "Diploma / PCL"))).toBe(true);
  });

  it("never matches a blank stored level", () => {
    for (const option of ACADEMIC_LEVEL_OPTIONS) {
      expect(matchesFilterOption("", option)).toBe(false);
      expect(matchesFilterOption(undefined, option)).toBe(false);
    }
  });

  it("matches long-form stored values at a word boundary", () => {
    const option = optionFor(ACADEMIC_LEVEL_OPTIONS, "Diploma / PCL");
    expect(matchesFilterOption("Diploma in Civil Engineering", option)).toBe(true);
    expect(matchesFilterOption("Postgraduate Diploma in Civil Engineering", option)).toBe(false);
  });
});

describe("normalizeFacetValue", () => {
  it("collapses separators so punctuation variants compare equal", () => {
    expect(normalizeFacetValue("Diploma (CTEVT)")).toBe(normalizeFacetValue("diploma ctevt"));
    expect(normalizeFacetValue("Postgraduate Diploma (PGD)")).toBe("postgraduate diploma pgd");
  });

  // "M.Phil" and "MPhil" normalize differently; the alias list carried on the
  // option is what makes the "M.Phil." checkbox reach the stored "MPhil".
  it("does not invent a shared spelling for abbreviations the data actually uses", () => {
    expect(normalizeFacetValue("M.Phil.")).not.toBe(normalizeFacetValue("MPhil"));
  });

  it("keeps the plus sign on +2", () => {
    expect(normalizeFacetValue("+2")).toBe("+2");
  });
});

describe("courseMatchesFilters", () => {
  it("keeps every course when no facet is selected", () => {
    const course = makeCourse({ level: "PCL", fieldOfStudy: "Nursing" });
    expect(courseMatchesFilters(course, withFilters({}))).toBe(true);
  });

  it("ORs the values inside a single option", () => {
    const courses = [
      makeCourse({ id: 1, level: "Diploma (CTEVT)" }),
      makeCourse({ id: 2, level: "PCL" }),
      makeCourse({ id: 3, level: "Master's" }),
    ];
    const filters = withFilters({ academicLevels: ["Diploma / PCL"] });
    expect(filterCourses(courses, filters).map((course) => course.id)).toEqual([1, 2]);
  });

  it("ANDs across facets", () => {
    const courses = [
      makeCourse({ id: 1, level: "PCL", fieldOfStudy: "Nursing" }),
      makeCourse({ id: 2, level: "PCL", fieldOfStudy: "Architecture, Design & Planning" }),
    ];
    const filters = withFilters({ academicLevels: ["Diploma / PCL"], fields: ["Nursing"] });
    expect(filterCourses(courses, filters).map((course) => course.id)).toEqual([1]);
  });

  it("matches a field stored in the field column as well as fieldOfStudy", () => {
    const course = makeCourse({ level: "PCL", fieldOfStudy: "", field: "Nursing" });
    expect(courseMatchesFilters(course, withFilters({ fields: ["Nursing"] }))).toBe(true);
  });

  it("excludes courses with no affiliation when a university is selected", () => {
    const filters = withFilters({ universities: ["Tribhuvan University (TU)"] });
    expect(courseMatchesFilters(makeCourse({ level: "PCL" }), filters)).toBe(false);
  });

  it("matches a university stored without its abbreviation", () => {
    const filters = withFilters({ universities: ["Kathmandu University (KU)"] });
    expect(
      courseMatchesFilters(
        makeCourse({ level: "PCL", affiliationName: "Kathmandu University" }),
        filters,
      ),
    ).toBe(true);
  });

  it("does not confuse similarly named universities", () => {
    const filters = withFilters({ universities: ["Nepal Sanskrit University (NSU)"] });
    expect(
      courseMatchesFilters(
        makeCourse({ level: "PCL", affiliationName: "Nepal Open University" }),
        filters,
      ),
    ).toBe(false);
  });
});

describe("buildCourseFilterCounts", () => {
  it("aggregates stored spellings onto the grouped public options", () => {
    const courses = [
      makeCourse({ id: 1, level: "Diploma (CTEVT)" }),
      makeCourse({ id: 2, level: "PCL" }),
      makeCourse({ id: 3, level: "PCL" }),
      makeCourse({ id: 4, level: "MPhil" }),
    ];
    const counts = buildCourseFilterCounts(courses);
    expect(counts.byAcademic["Diploma / PCL"]).toBe(3);
    expect(counts.byAcademic["M.Phil."]).toBe(1);
  });

  it("returns a zero entry for every option so the sidebar stays stable", () => {
    const counts = buildCourseFilterCounts([]);
    for (const option of ACADEMIC_LEVEL_OPTIONS) {
      expect(counts.byAcademic[option.id]).toBe(0);
    }
    for (const option of FIELD_OPTIONS) {
      expect(counts.byField[option.id]).toBe(0);
    }
    for (const option of UNIVERSITY_OPTIONS) {
      expect(counts.byUniversity[option.id]).toBe(0);
    }
  });
});
