import {
  ALL_STUDY_RESOURCE_TYPES,
  API_STUDY_RESOURCE_TYPES,
  buildStudyResourceFilters,
  getStudyResourceCategoryByApiType,
  isApiStudyResourceType,
  resolveCategoryRender,
  resolveLockedApiType,
  resolveStudyResourceType,
  requireStudyResourceCategory,
  STUDY_RESOURCE_CATEGORIES,
  STUDY_RESOURCE_TYPE_OPTIONS,
  STUDY_RESOURCE_TYPE_LABELS,
  type StudyResourceCategorySlug,
} from "@/components/studyResources/studyResourceCategories";

const CATEGORY_SLUGS = [
  "study-notes",
  "past-questions",
  "model-questions",
  "syllabus",
  "video-lectures",
  "mock-test",
] as const satisfies readonly StudyResourceCategorySlug[];

describe("study resource category configuration", () => {
  test("exposes exactly the six approved cards, labels, and routes", () => {
    expect(
      STUDY_RESOURCE_CATEGORIES.map(({ label, href }) => ({ label, href })),
    ).toEqual([
      { label: "Study Notes", href: "/study-resources/study-notes" },
      { label: "Past Questions", href: "/study-resources/past-questions" },
      { label: "Model Questions", href: "/study-resources/model-questions" },
      { label: "Syllabus", href: "/study-resources/syllabus" },
      { label: "Video Lectures", href: "/study-resources/video-lectures" },
      { label: "Mock Test", href: "/study-resources/mock-test" },
    ]);
  });

  test("every slug is unique and all six render surfaces are claimed", () => {
    expect(STUDY_RESOURCE_CATEGORIES.map((c) => c.slug)).toEqual(
      CATEGORY_SLUGS,
    );
    expect(
      STUDY_RESOURCE_CATEGORIES.map((c) => c.render).sort(),
    ).toEqual(["mock-tests", "resources", "resources", "resources", "resources", "video-lectures"]);
  });
});

describe("category render dispatch", () => {
  test("the four document collections share the resources surface", () => {
    const documentSlugs = [
      "study-notes",
      "past-questions",
      "model-questions",
      "syllabus",
    ] as const;

    documentSlugs.forEach((slug) => {
      const category = requireStudyResourceCategory(slug);
      expect(resolveCategoryRender(category)).toBe("resources");
      // Documents stay pinned to their own API type.
      expect(resolveLockedApiType(category)).toBe(category.apiType);
    });
  });

  test("video lectures get the video surface and their own API type", () => {
    const category = requireStudyResourceCategory("video-lectures");
    expect(resolveCategoryRender(category)).toBe("video-lectures");
    expect(category.apiType).toBe("video-lectures");
    // The video page filters itself, so the document catalog never locks to it.
    expect(resolveLockedApiType(category)).toBeUndefined();
  });

  test("mock tests have no study-resources API type at all", () => {
    const category = requireStudyResourceCategory("mock-test");
    expect(resolveCategoryRender(category)).toBe("mock-tests");
    expect(category.apiType).toBeNull();
    expect(resolveLockedApiType(category)).toBeUndefined();
  });

  test("no category is left as a coming-soon or planned placeholder", () => {
    expect(
      STUDY_RESOURCE_CATEGORIES.map(({ slug, status }) => ({ slug, status })),
    ).toEqual(CATEGORY_SLUGS.map((slug) => ({ slug, status: "available" })));
  });
});

describe("resource type unions and filter options", () => {
  test("video lectures extend the API type union without touching the documents", () => {
    expect([...API_STUDY_RESOURCE_TYPES]).toEqual([
      "past-questions",
      "study-notes",
      "model-questions",
      "syllabus",
    ]);
    expect([...ALL_STUDY_RESOURCE_TYPES]).toEqual([
      "past-questions",
      "study-notes",
      "model-questions",
      "syllabus",
      "video-lectures",
    ]);
    expect(isApiStudyResourceType("video-lectures")).toBe(true);
    expect(isApiStudyResourceType("mock-test")).toBe(false);
  });

  test("the combined catalog filter offers every API-backed type", () => {
    expect(STUDY_RESOURCE_TYPE_OPTIONS.map((option) => option.value)).toEqual([
      "",
      "past-questions",
      "study-notes",
      "model-questions",
      "syllabus",
      "video-lectures",
    ]);
  });

  test("type labels are shared by the public and superadmin pickers", () => {
    expect(STUDY_RESOURCE_TYPE_LABELS).toEqual({
      "past-questions": "Past Questions",
      "study-notes": "Study Notes",
      "model-questions": "Model Questions",
      syllabus: "Syllabus",
      "video-lectures": "Video Lectures",
    });
    expect(
      getStudyResourceCategoryByApiType("video-lectures").slug,
    ).toBe("video-lectures");
  });
});

describe("study resource type locking and query building", () => {
  test("a route lock always wins over selector state", () => {
    expect(
      resolveStudyResourceType("syllabus", "past-questions"),
    ).toBe("syllabus");
  });

  test("mock tests never reach the resource API", () => {
    expect(resolveStudyResourceType(undefined, "mock-test")).toBeUndefined();
  });

  test("the combined catalog may be filtered to video lectures", () => {
    expect(resolveStudyResourceType(undefined, "video-lectures")).toBe(
      "video-lectures",
    );
  });

  test("locked type and the remaining filters are combined into one query", () => {
    expect(
      buildStudyResourceFilters({
        lockedType: "model-questions",
        selectedType: "study-notes",
        query: "  calculus  ",
        course: " BSc ",
        year: " 2079 ",
        page: 2,
      }),
    ).toEqual({
      q: "calculus",
      type: "model-questions",
      course: "BSc",
      year: "2079",
      page: 2,
      limit: 20,
    });
  });
});
