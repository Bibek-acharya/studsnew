/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import VideoLecturePlayer from "@/components/studyResources/VideoLecturePlayer";
import {
  requestStudyResourcePlaybackToken,
  type PlaybackAuthorization,
  type StudyResource,
} from "@/services/studyResourcesApi";

jest.mock("@/services/studyResourcesApi", () => {
  const actual = jest.requireActual("@/services/studyResourcesApi");
  return {
    ...actual,
    requestStudyResourcePlaybackToken: jest.fn(),
  };
});

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// The shared sanitizer touches the DOM on mount; keep it inert here.
jest.mock("@/components/RichText", () => ({
  __esModule: true,
  default: () => null,
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const mockedRequest =
  requestStudyResourcePlaybackToken as unknown as jest.Mock;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const FUTURE = new Date(Date.now() + 60_000).toISOString();

const lecture: StudyResource = {
  id: 42,
  title: "Derivatives from scratch",
  description: "A short lesson.",
  resource_type: "video-lectures",
  course: "BSc",
  year: "2081",
  file_name: "lecture.mp4",
  file_url: "/uploads/study-resources/lecture.mp4",
  file_size: 12_345_678,
  mime_type: "video/mp4",
  downloads: 0,
  created_at: "2026-09-01T00:00:00Z",
  duration_seconds: 545,
  views: 12,
};

const authorized: PlaybackAuthorization = {
  status: "authorized",
  token: { token: "pt_live_1", expires_at: FUTURE },
};

const containers: HTMLElement[] = [];
const roots: Root[] = [];

function renderPlayer() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => {
    root.render(<VideoLecturePlayer lecture={lecture} />);
  });
  return container;
}

/** Let the mocked token promise settle inside act(). */
async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}

function videoOf(container: HTMLElement): HTMLVideoElement | null {
  return container.querySelector("video");
}

beforeEach(() => {
  mockedRequest.mockReset();
  localStorage.setItem("token", "session-jwt-do-not-leak");
});

afterEach(() => {
  act(() => {
    roots.forEach((root) => root.unmount());
  });
  roots.length = 0;
  containers.forEach((container) => container.remove());
  containers.length = 0;
  localStorage.removeItem("token");
});

describe("VideoLecturePlayer authorization", () => {
  test("no playable source exists while the token is still being checked", async () => {
    let resolveToken: (value: PlaybackAuthorization) => void = () => {};
    mockedRequest.mockReturnValue(
      new Promise<PlaybackAuthorization>((resolve) => {
        resolveToken = resolve;
      }),
    );

    const container = renderPlayer();

    // Pending authorization: a loading hint, and no <video> in the DOM.
    expect(videoOf(container)).toBeNull();
    expect(container.textContent).toContain("Preparing playback");
    expect(container.innerHTML).not.toContain("/stream");
    expect(container.innerHTML).not.toContain("session-jwt-do-not-leak");

    // The endpoint is asked first, before anything can play.
    expect(mockedRequest).toHaveBeenCalledWith(42);

    await act(async () => {
      resolveToken(authorized);
      await Promise.resolve();
    });
  });

  test("the stream source appears only after a fresh token is granted", async () => {
    mockedRequest.mockResolvedValue(authorized);

    const container = renderPlayer();
    await flush();

    const video = videoOf(container);
    expect(video).not.toBeNull();
    expect(video?.getAttribute("src")).toBe(
      `${API_BASE}/api/v1/study-resources/42/stream?pt=pt_live_1`,
    );
    // Player attributes the cross-platform playback path relies on.
    expect(video?.getAttribute("preload")).toBe("metadata");
    expect(video?.hasAttribute("playsinline")).toBe(true);
    expect(video?.hasAttribute("controls")).toBe(true);
    // A crossorigin attribute would break the tokenized request.
    expect(video?.hasAttribute("crossorigin")).toBe(false);
    // No blob/object URL, and no session credential in the markup.
    expect(video?.getAttribute("src")).not.toContain("blob:");
    expect(container.innerHTML).not.toContain("session-jwt-do-not-leak");
  });

  test("a 401 renders a login prompt and still no video", async () => {
    mockedRequest.mockResolvedValue({
      status: "login-required",
      message: "Log in to watch this lecture.",
    });

    const container = renderPlayer();
    await flush();

    expect(videoOf(container)).toBeNull();
    expect(container.innerHTML).not.toContain("/stream");
    expect(container.textContent).toContain("Log in to watch this lecture");

    const link = container.querySelector<HTMLAnchorElement>('a[href^="/login"]');
    expect(link?.getAttribute("href")).toBe(
      `/login?redirect=${encodeURIComponent("/study-resources/video-lectures")}`,
    );
  });

  test("a failed stream offers a refresh that re-requests a token", async () => {
    mockedRequest.mockResolvedValue(authorized);

    const container = renderPlayer();
    await flush();
    expect(videoOf(container)).not.toBeNull();

    // The element reports a media error (expired token, dropped connection).
    act(() => {
      videoOf(container)?.dispatchEvent(new Event("error"));
    });
    await flush();

    expect(videoOf(container)).toBeNull();
    expect(container.textContent).toMatch(/refresh playback/i);

    const retry = Array.from(container.querySelectorAll("button")).find((b) =>
      /refresh playback/i.test(b.textContent ?? ""),
    );
    expect(retry).toBeDefined();

    act(() => {
      retry?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await flush();

    expect(mockedRequest).toHaveBeenCalledTimes(2);
    expect(videoOf(container)).not.toBeNull();
  });
});
