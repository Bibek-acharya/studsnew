import { resolveRoute } from "../features/notifications/routes";

// Provider legacy slugs (doc 13 §6): provider navigation is state-based on the
// single dashboard page, so every slug resolves to that page's real route.
const PROVIDER_LEGACY_SLUGS = [
  "org-profile",
  "applications",
  "manage-scholarships",
  "sec-dashboard",
  "assign-access",
  "settings",
  "news-directory",
  "events-directory",
  "blog-directory",
  "calendar",
  "interviews",
];

describe("resolveRoute", () => {
  describe("provider legacy slugs", () => {
    test.each(PROVIDER_LEGACY_SLUGS)(
      "maps legacy slug %s to the provider dashboard route",
      (slug) => {
        expect(resolveRoute("provider", slug)).toBe(
          "/scholarship-provider/dashboard",
        );
      },
    );
  });

  describe("interpolated template links", () => {
    test("passes through /scholarship-pay/<slug> (route exists)", () => {
      expect(resolveRoute("user", "/scholarship-pay/some-slug")).toBe(
        "/scholarship-pay/some-slug",
      );
    });

    test("falls back when /campus-forum/post/<id> has no real route", () => {
      expect(resolveRoute("user", "/campus-forum/post/42")).toBe(
        "/notifications",
      );
    });

    test("passes through /campus-forum (real route)", () => {
      expect(resolveRoute("user", "/campus-forum")).toBe("/campus-forum");
      expect(resolveRoute("user", "/campus-forum/12")).toBe("/campus-forum/12");
    });

    test("falls back when /messages/<id> has no real route", () => {
      expect(resolveRoute("provider", "/messages/7")).toBe(
        "/scholarship-provider/dashboard",
      );
    });
  });

  describe("user role", () => {
    test("passes /user/dashboard/* links through", () => {
      expect(resolveRoute("user", "/user/dashboard/applications")).toBe(
        "/user/dashboard/applications",
      );
      expect(resolveRoute("user", "/user/dashboard")).toBe("/user/dashboard");
    });

    test("falls back on unknown link", () => {
      expect(resolveRoute("user", "/definitely/not/a/route")).toBe(
        "/notifications",
      );
    });

    test("falls back on empty link", () => {
      expect(resolveRoute("user", "")).toBe("/notifications");
    });
  });

  describe("institution role", () => {
    test("empty link → institution notifications page", () => {
      expect(resolveRoute("institution", "")).toBe(
        "/institution-zone/dashboard/notifications",
      );
    });

    test("directory slugs map to institution counterparts", () => {
      expect(resolveRoute("institution", "news-directory")).toBe(
        "/institution-zone/dashboard/news/directory",
      );
      expect(resolveRoute("institution", "events-directory")).toBe(
        "/institution-zone/dashboard/events/directory",
      );
      expect(resolveRoute("institution", "blog-directory")).toBe(
        "/institution-zone/dashboard/blogs/directory",
      );
    });

    test("falls back on unknown link", () => {
      expect(resolveRoute("institution", "/junk")).toBe(
        "/institution-zone/dashboard/notifications",
      );
    });
  });

  describe("superadmin role", () => {
    test("falls back to the superadmin dashboard (notifications live there)", () => {
      expect(resolveRoute("superadmin", "")).toBe("/superadmin/dashboard");
      expect(resolveRoute("superadmin", "/junk/link")).toBe(
        "/superadmin/dashboard",
      );
    });
  });
});
