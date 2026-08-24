import { collectProgramNames } from "../CollegeComparisonResultPage";

describe("collectProgramNames", () => {
  it("extracts names from string arrays and object arrays", () => {
    expect(collectProgramNames(["BSc CSIT", "BBA"])).toEqual(["BSc CSIT", "BBA"]);
    expect(
      collectProgramNames([{ courseName: "BSc CSIT" }, { title: "BBA" }, { name: "BIT" }]),
    ).toEqual(["BSc CSIT", "BBA", "BIT"]);
  });

  it("parses JSON strings and dedupes across sources", () => {
    const featured = JSON.stringify([{ title: "BSc CSIT" }]);
    const courses = JSON.stringify([{ courseName: "BSc CSIT" }, { name: "BBM" }]);
    expect(collectProgramNames(featured, courses)).toEqual(["BSc CSIT", "BBM"]);
  });

  it("returns empty for null/invalid/empty sources instead of description", () => {
    expect(collectProgramNames(null, undefined, "", "{bad json")).toEqual([]);
    expect(collectProgramNames([], [])).toEqual([]);
  });
});
