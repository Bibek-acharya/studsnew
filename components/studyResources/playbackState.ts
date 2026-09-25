import {
  getStudyResourceStreamUrl,
  isPlaybackTokenFresh,
  type PlaybackAuthorization,
} from "@/services/studyResourcesApi";

/**
 * The player has exactly four faces. `ready` is the only one that ever produces
 * a playable URL, which is what keeps the stream source out of the DOM until
 * the backend has authorized the viewer.
 */
export type PlaybackViewState =
  | { kind: "loading" }
  | { kind: "login-required"; message: string; loginHref: string }
  | { kind: "error"; message: string; loginHref: string }
  // `loginHref` rides along on the ready state too: a stream that dies can
  // offer re-authentication, since the token may have been revoked.
  | { kind: "ready"; streamUrl: string; loginHref: string };

export const VIDEO_LECTURES_PATH = "/study-resources/video-lectures";

/** Log in and come straight back to the collection the lecture was opened from. */
export function buildVideoLoginHref(
  returnPath: string = VIDEO_LECTURES_PATH,
): string {
  return `/login?redirect=${encodeURIComponent(returnPath)}`;
}

/**
 * Turn a service authorization result into what the player should render.
 * `nowMs` is injectable so the expiry path is testable.
 */
export function toPlaybackViewState(
  resourceId: number | string,
  authorization: PlaybackAuthorization,
  options: { returnPath?: string; nowMs?: number } = {},
): PlaybackViewState {
  const loginHref = buildVideoLoginHref(options.returnPath);

  if (authorization.status === "login-required") {
    return {
      kind: "login-required",
      message: authorization.message,
      loginHref,
    };
  }

  if (authorization.status === "error") {
    return { kind: "error", message: authorization.message, loginHref };
  }

  if (!isPlaybackTokenFresh(authorization.token.expires_at, options.nowMs)) {
    return {
      kind: "error",
      message: "Your playback link expired. Refresh it to keep watching.",
      loginHref,
    };
  }

  // The tokenized URL is the only URL the player is ever allowed to build.
  return {
    kind: "ready",
    streamUrl: getStudyResourceStreamUrl(resourceId, authorization.token.token),
    loginHref,
  };
}

/** Copy for a stream that failed after authorization (expired or network). */
export function playbackStreamErrorMessage(hadToken: boolean): string {
  return hadToken
    ? "Playback stopped — the link may have expired. Refresh it to continue."
    : "We could not start this lecture. Please try again.";
}
