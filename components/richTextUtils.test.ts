import {
  findNoBreakTextTokens,
  normalizeRichTextText,
} from "./richTextUtils";

describe("normalizeRichTextText", () => {
  it("turns presentation-only non-breaking spaces into wrap opportunities", () => {
    expect(normalizeRichTextText("Tribhuvan\u00a0University\u00a0(TU)")).toBe(
      "Tribhuvan University (TU)",
    );
  });
});

describe("findNoBreakTextTokens", () => {
  it("finds hyphenated and dash-joined phrases without changing text", () => {
    expect(
      findNoBreakTextTokens("Bachelor-of Science, 24-35, and word—word."),
    ).toEqual(["Bachelor-of", "24-35", "word—word"]);
  });
});
