import {
  DEFAULT_STYLE,
  resolveIcon,
} from "../components/notifications/icons";

const REGISTRY_CATEGORIES = [
  "application",
  "scholarship",
  "counselling",
  "messaging",
  "content",
  "community",
  "social",
  "account",
  "system",
  "moderation",
  "message",
];

describe("resolveIcon", () => {
  test.each(REGISTRY_CATEGORIES)(
    "maps registry category %s to an icon/color/bg pair",
    (category) => {
      const style = resolveIcon(category);
      expect(style.icon).toBeTruthy();
      expect(style.color).toMatch(/^text-\S+$/);
      expect(style.bg).toMatch(/^bg-\S+$/);
      expect(style).not.toEqual(DEFAULT_STYLE);
    },
  );

  test("unknown category falls back to the bell default", () => {
    expect(resolveIcon("does-not-exist")).toEqual(DEFAULT_STYLE);
    expect(resolveIcon(undefined)).toEqual(DEFAULT_STYLE);
  });

  test("legacy.* event keys with unknown category fall back to content styling", () => {
    const style = resolveIcon("", "legacy.announcement");
    expect(style).toEqual(resolveIcon("content"));
    expect(style).not.toEqual(DEFAULT_STYLE);
  });

  test("a known category wins over the legacy prefix", () => {
    expect(resolveIcon("scholarship", "legacy.scholarship_deadline")).toEqual(
      resolveIcon("scholarship"),
    );
  });

  test("public banner type aliases map to category styling (doc 13 §5)", () => {
    expect(resolveIcon("news")).toEqual(resolveIcon("content"));
    expect(resolveIcon("blog")).toEqual(resolveIcon("content"));
    expect(resolveIcon("event")).toEqual(resolveIcon("counselling"));
    expect(resolveIcon("entrance")).toEqual(resolveIcon("counselling"));
    expect(resolveIcon("admission")).toEqual(resolveIcon("application"));
    expect(resolveIcon("info")).toEqual(resolveIcon("system"));
  });
});
