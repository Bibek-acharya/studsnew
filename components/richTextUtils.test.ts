import { findNoBreakTextTokens } from "./richTextUtils";

describe("findNoBreakTextTokens", () => {
  it("finds hyphenated and dash-joined phrases without changing text", () => {
    expect(
      findNoBreakTextTokens("Bachelor-of Science, 24-35, and word—word."),
    ).toEqual(["Bachelor-of", "24-35", "word—word"]);
  });
});
