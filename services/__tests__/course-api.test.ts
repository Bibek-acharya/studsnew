import { searchGlobalCourses } from "../course-api";

describe("searchGlobalCourses", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the courses array from the search response", async () => {
    const courses = [{ id: 1, title: "Computer Science" }];
    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { courses },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(searchGlobalCourses("computer")).resolves.toEqual(courses);
  });
});
