import {
  buildVideoLoginHref,
  playbackStreamErrorMessage,
  toPlaybackViewState,
  VIDEO_LECTURES_PATH,
} from "@/components/studyResources/playbackState";
import type { PlaybackAuthorization } from "@/services/studyResourcesApi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const NOW = Date.parse("2026-09-25T12:00:00Z");
const FUTURE = "2026-09-25T12:05:00Z";
const PAST = "2026-09-25T11:55:00Z";

const authorized: PlaybackAuthorization = {
  status: "authorized",
  token: { token: "pt_live_1", expires_at: FUTURE },
};
const loginRequired: PlaybackAuthorization = {
  status: "login-required",
  message: "Log in to watch this lecture.",
};
const failed: PlaybackAuthorization = {
  status: "error",
  message: "Could not prepare this lecture for playback.",
};

describe("buildVideoLoginHref", () => {
  test("returns the viewer to the video collection after signing in", () => {
    expect(buildVideoLoginHref()).toBe(
      `/login?redirect=${encodeURIComponent(VIDEO_LECTURES_PATH)}`,
    );
  });

  test("a custom return path is encoded, never interpolated raw", () => {
    expect(buildVideoLoginHref("/study-resources/mock-test/3?a=1")).toBe(
      "/login?redirect=%2Fstudy-resources%2Fmock-test%2F3%3Fa%3D1",
    );
  });
});

describe("toPlaybackViewState", () => {
  test("an authorized, unexpired token is the only path to a stream URL", () => {
    const state = toPlaybackViewState(42, authorized, { nowMs: NOW });

    expect(state).toEqual({
      kind: "ready",
      streamUrl: `${API_BASE}/api/v1/study-resources/42/stream?pt=pt_live_1`,
      loginHref: buildVideoLoginHref(),
    });
  });

  test("a 401 becomes a login state carrying a working login link", () => {
    const state = toPlaybackViewState(42, loginRequired, { nowMs: NOW });

    expect(state).toEqual({
      kind: "login-required",
      message: "Log in to watch this lecture.",
      loginHref: buildVideoLoginHref(),
    });
  });

  test("login and error states never carry a stream URL", () => {
    expect(toPlaybackViewState(42, loginRequired, { nowMs: NOW })).not.toHaveProperty(
      "streamUrl",
    );
    expect(toPlaybackViewState(42, failed, { nowMs: NOW })).not.toHaveProperty(
      "streamUrl",
    );
  });

  test("a server error keeps its message and offers retry", () => {
    const state = toPlaybackViewState(42, failed, { nowMs: NOW });

    expect(state).toEqual({
      kind: "error",
      message: "Could not prepare this lecture for playback.",
      loginHref: buildVideoLoginHref(),
    });
  });

  test("a token that expired in transit becomes a retryable error, not a stream", () => {
    const state = toPlaybackViewState(
      42,
      {
        status: "authorized",
        token: { token: "pt_stale", expires_at: PAST },
      },
      { nowMs: NOW },
    );

    expect(state.kind).toBe("error");
    expect(state).not.toHaveProperty("streamUrl");
  });

  test("honours a custom return path for the login link", () => {
    const state = toPlaybackViewState(42, loginRequired, {
      nowMs: NOW,
      returnPath: "/study-resources/video-lectures?course=BSc",
    });

    expect(state.kind).toBe("login-required");
    if (state.kind !== "login-required") throw new Error("unreachable");
    expect(state.loginHref).toBe(
      `/login?redirect=${encodeURIComponent(
        "/study-resources/video-lectures?course=BSc",
      )}`,
    );
  });
});

describe("playbackStreamErrorMessage", () => {
  test("an authorized stream points the viewer at a refresh", () => {
    expect(playbackStreamErrorMessage(true)).toMatch(/refresh/i);
  });

  test("a stream that never started offers a plain retry", () => {
    expect(playbackStreamErrorMessage(false)).toMatch(/try again/i);
  });
});
