/**
 * @jest-environment jsdom
 */
import { apiRequest } from "../api";
import {
  buildStudyResourceUploadFormData,
  getStudyResourceDownloadUrl,
  getStudyResourceStreamUrl,
  getStudyResourceUploadRule,
  isPlaybackTokenFresh,
  isVideoStudyResourceType,
  normalizeStudyResourceList,
  requestStudyResourcePlaybackToken,
  studyResourcesApi,
  STUDY_RESOURCE_DOCUMENT_TYPES,
  STUDY_RESOURCE_VIDEO_TYPE,
} from "../studyResourcesApi";

jest.mock("../api", () => ({
  apiRequest: jest.fn(),
}));

jest.mock("../course-api", () => ({
  fetchCourses: jest.fn(),
}));

const mockedApiRequest = apiRequest as jest.Mock;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

afterEach(() => {
  mockedApiRequest.mockReset();
});

describe("studyResourcesApi.listVideoLectures", () => {
  test("always pins the video-lectures type and builds the query string", async () => {
    mockedApiRequest.mockResolvedValue({ data: { study_resources: [] } });

    await studyResourcesApi.listVideoLectures({
      q: "calculus",
      course: "BSc",
      year: "2081",
      page: 2,
      limit: 12,
    });

    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/study-resources?q=calculus&type=video-lectures&course=BSc&year=2081&page=2&limit=12",
    );
  });

  test("server callers pass the ISR window through to fetch", async () => {
    mockedApiRequest.mockResolvedValue({ data: { study_resources: [] } });

    await studyResourcesApi.listVideoLectures(
      { page: 1, limit: 12 },
      { revalidate: 300 },
    );

    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/study-resources?type=video-lectures&page=1&limit=12",
      { next: { revalidate: 300 } },
    );
  });

  test("a caller-supplied type can never override the video lock", async () => {
    mockedApiRequest.mockResolvedValue({ data: { study_resources: [] } });

    await studyResourcesApi.listVideoLectures({ type: "syllabus" });

    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/study-resources?type=video-lectures",
    );
  });
});

describe("normalizeStudyResourceList", () => {
  test("flattens the envelope with its year and course facets", () => {
    const item = { id: 7, title: "Lecture" } as never;
    expect(
      normalizeStudyResourceList({
        success: true,
        data: {
          page: 1,
          limit: 12,
          total: 1,
          study_resources: [item],
          years: ["2081"],
          courses: ["BSc CS"],
        },
      }),
    ).toEqual({
      items: [item],
      total: 1,
      page: 1,
      limit: 12,
      years: ["2081"],
      courses: ["BSc CS"],
    });
  });

  test("an already-normalized page passes through untouched", () => {
    const page = {
      items: [{ id: 1 } as never],
      total: 1,
      page: 3,
      limit: 12,
      years: [],
      courses: [],
    };
    expect(normalizeStudyResourceList(page)).toBe(page);
  });

  test("missing responses become an empty first page instead of throwing", () => {
    expect(normalizeStudyResourceList(null)).toEqual({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      years: [],
      courses: [],
    });
  });
});

describe("video-aware upload contract", () => {
  const makeFile = (name: string) => new File(["data"], name);

  test("documents keep the 20 MB limit, video gets 200 MB", () => {
    for (const type of STUDY_RESOURCE_DOCUMENT_TYPES) {
      const rule = getStudyResourceUploadRule(type);
      expect(rule.maxBytes).toBe(20 * 1024 * 1024);
      expect(rule.accept).toContain(".pdf");
      expect(rule.accept).not.toContain("video/");
      // The document upload behaviour is unchanged by the video work.
      expect(rule.note).toBeUndefined();
    }

    const videoRule = getStudyResourceUploadRule(STUDY_RESOURCE_VIDEO_TYPE);
    expect(videoRule.maxBytes).toBe(200 * 1024 * 1024);
    expect(videoRule.accept).toContain("video/mp4");
    expect(isVideoStudyResourceType("video-lectures")).toBe(true);
    expect(isVideoStudyResourceType("syllabus")).toBe(false);
  });

  test("video uploads accept every source format the backend can normalize", () => {
    const { accept, hint, note } = getStudyResourceUploadRule(
      STUDY_RESOURCE_VIDEO_TYPE,
    );

    for (const source of [".mp4", ".webm", ".mov", ".m4v", ".mkv", ".avi"]) {
      expect(accept).toContain(source);
    }
    expect(hint).toContain("mp4");
    expect(note).toMatch(/normalized to a cross-platform MP4/i);
  });

  test("document uploads send exactly the original fields", () => {
    const form = buildStudyResourceUploadFormData({
      file: makeFile("notes.pdf"),
      title: "  BCA Notes  ",
      type: "study-notes",
      course: " BCA ",
      year: " 2081 ",
      description: " Unit 1 ",
    });

    expect(form.get("file")).toBeInstanceOf(File);
    expect(form.get("title")).toBe("BCA Notes");
    expect(form.get("type")).toBe("study-notes");
    expect(form.get("course")).toBe("BCA");
    expect(form.get("year")).toBe("2081");
    expect(form.get("description")).toBe("Unit 1");
    expect(form.has("duration_seconds")).toBe(false);
    expect(form.has("is_published")).toBe(false);
  });

  test("video uploads add duration and publish state, and skip empty values", () => {
    const form = buildStudyResourceUploadFormData({
      file: makeFile("lecture.mp4"),
      title: "Derivatives",
      type: STUDY_RESOURCE_VIDEO_TYPE,
      durationSeconds: 545.6,
      isPublished: false,
    });

    expect(form.get("type")).toBe("video-lectures");
    expect(form.get("duration_seconds")).toBe("546");
    expect(form.get("is_published")).toBe("false");
    // Nothing typed for these, so they are left out entirely.
    expect(form.has("course")).toBe(false);
    expect(form.has("year")).toBe(false);
    expect(form.has("description")).toBe(false);
  });

  test("a zero or unparseable duration is not sent", () => {
    const form = buildStudyResourceUploadFormData({
      file: makeFile("lecture.mp4"),
      title: "Derivatives",
      type: STUDY_RESOURCE_VIDEO_TYPE,
      durationSeconds: Number.NaN,
      isPublished: true,
    });

    expect(form.has("duration_seconds")).toBe(false);
    expect(form.get("is_published")).toBe("true");
  });
});

describe("media URLs", () => {
  test("playback uses the backend stream endpoint", () => {
    expect(getStudyResourceStreamUrl(42)).toBe(
      `${API_BASE}/api/v1/study-resources/42/stream`,
    );
  });

  test("a playback token rides along as the pt query parameter", () => {
    expect(getStudyResourceStreamUrl(42, "pt_abc123")).toBe(
      `${API_BASE}/api/v1/study-resources/42/stream?pt=pt_abc123`,
    );
  });

  test("token values are encoded, and blank tokens are dropped", () => {
    expect(getStudyResourceStreamUrl(42, "a b&c")).toBe(
      `${API_BASE}/api/v1/study-resources/42/stream?pt=a%20b%26c`,
    );
    expect(getStudyResourceStreamUrl(42, "   ")).toBe(
      `${API_BASE}/api/v1/study-resources/42/stream`,
    );
    expect(getStudyResourceStreamUrl(42, null)).toBe(
      `${API_BASE}/api/v1/study-resources/42/stream`,
    );
  });

  test("the normal session token is never placed in a stream URL", () => {
    localStorage.setItem("token", "session-jwt-do-not-leak");
    try {
      const bare = getStudyResourceStreamUrl(42);
      const authorized = getStudyResourceStreamUrl(42, "short-lived-pt");

      expect(bare).not.toContain("session-jwt-do-not-leak");
      expect(authorized).not.toContain("session-jwt-do-not-leak");
      // The only credential in a URL is the short-lived playback token.
      expect(authorized).toContain("pt=short-lived-pt");
      expect(authorized).not.toContain("Authorization");
      expect(authorized.toLowerCase()).not.toContain("bearer");
    } finally {
      localStorage.removeItem("token");
    }
  });

  test("downloads keep the attachment endpoint", () => {
    expect(getStudyResourceDownloadUrl(42)).toBe(
      `${API_BASE}/api/v1/study-resources/42/download`,
    );
  });
});

describe("isPlaybackTokenFresh", () => {
  const now = Date.parse("2026-09-25T12:00:00Z");

  test("a token with time left is fresh, allowing for clock skew", () => {
    expect(
      isPlaybackTokenFresh("2026-09-25T12:10:00Z", now),
    ).toBe(true);
  });

  test("an expired, empty, or unparseable expiry is not fresh", () => {
    expect(isPlaybackTokenFresh("2026-09-25T11:59:00Z", now)).toBe(false);
    expect(isPlaybackTokenFresh("2026-09-25T12:00:01Z", now)).toBe(false);
    expect(isPlaybackTokenFresh("", now)).toBe(false);
    expect(isPlaybackTokenFresh(null, now)).toBe(false);
    expect(isPlaybackTokenFresh("not-a-date", now)).toBe(false);
  });
});

describe("requestStudyResourcePlaybackToken", () => {
  const future = () =>
    new Date(Date.now() + 60_000).toISOString();

  test("asks the playback-token endpoint and unwraps the token", async () => {
    mockedApiRequest.mockResolvedValue({
      data: {
        token: "pt_live_1",
        expires_at: future(),
        stream_url: "/api/v1/study-resources/42/stream",
      },
    });

    const result = await requestStudyResourcePlaybackToken(42);

    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/study-resources/42/playback-token",
      expect.objectContaining({
        method: "GET",
        // A 401 here is expected for signed-out visitors, so it must not trip
        // the global auth-expired handler.
        suppressAuthExpired: true,
      }),
    );
    expect(result).toEqual({
      status: "authorized",
      token: {
        token: "pt_live_1",
        expires_at: expect.any(String),
        stream_url: "/api/v1/study-resources/42/stream",
      },
    });
  });

  test("sends the user session as a Bearer header, never in the URL", async () => {
    localStorage.setItem("token", "session-jwt");
    try {
      mockedApiRequest.mockResolvedValue({
        data: { token: "pt_live_2", expires_at: future() },
      });

      await requestStudyResourcePlaybackToken(7);

      const [path, options] = mockedApiRequest.mock.calls[0];
      expect(path).toBe("/api/v1/study-resources/7/playback-token");
      expect(path).not.toContain("session-jwt");
      expect(options.authToken).toBe("session-jwt");
    } finally {
      localStorage.removeItem("token");
    }
  });

  test("can authenticate with the superadmin session instead", async () => {
    localStorage.setItem("superadmin_token", "sa-token");
    try {
      mockedApiRequest.mockResolvedValue({
        data: { token: "pt_sa", expires_at: future() },
      });

      await requestStudyResourcePlaybackToken(9, { session: "superadmin" });

      expect(mockedApiRequest.mock.calls[0][1].authToken).toBe("sa-token");
    } finally {
      localStorage.removeItem("superadmin_token");
    }
  });

  test("a 401 becomes a login-required result, not a throw", async () => {
    const unauthorized = Object.assign(new Error("unauthorized"), {
      status: 401,
    });
    mockedApiRequest.mockRejectedValue(unauthorized);

    await expect(requestStudyResourcePlaybackToken(42)).resolves.toEqual({
      status: "login-required",
      message: "Log in to watch this lecture.",
    });
  });

  test("a 403 is also reported as login-required", async () => {
    mockedApiRequest.mockRejectedValue(
      Object.assign(new Error("forbidden"), { status: 403 }),
    );

    const result = await requestStudyResourcePlaybackToken(42);

    expect(result.status).toBe("login-required");
  });

  test("other failures surface as an error result with the server message", async () => {
    mockedApiRequest.mockRejectedValue(new Error("boom"));

    await expect(requestStudyResourcePlaybackToken(42)).resolves.toEqual({
      status: "error",
      message: "boom",
    });
  });

  test("an empty or already-expired token is not treated as authorized", async () => {
    mockedApiRequest.mockResolvedValue({ data: { token: "  " } });
    const empty = await requestStudyResourcePlaybackToken(42);
    expect(empty.status).toBe("error");

    mockedApiRequest.mockResolvedValue({
      data: { token: "pt_old", expires_at: "2020-01-01T00:00:00Z" },
    });
    const stale = await requestStudyResourcePlaybackToken(42);
    expect(stale.status).toBe("error");
  });

  test("the service object exposes the same helper", () => {
    expect(studyResourcesApi.requestPlaybackToken).toBe(
      requestStudyResourcePlaybackToken,
    );
  });
});
