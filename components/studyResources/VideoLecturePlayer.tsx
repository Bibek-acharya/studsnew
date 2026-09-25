"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Eye,
  HardDrive,
  Loader2,
  LockKeyhole,
  LogIn,
  PlayCircle,
  RefreshCw,
  Timer,
} from "lucide-react";
import RichText from "@/components/RichText";
import {
  requestStudyResourcePlaybackToken,
  type StudyResource,
} from "@/services/studyResourcesApi";
import {
  playbackStreamErrorMessage,
  toPlaybackViewState,
  type PlaybackViewState,
} from "./playbackState";
import {
  formatCount,
  formatDuration,
  formatFileSize,
} from "./videoFormat";

interface VideoLecturePlayerProps {
  lecture: StudyResource;
}

interface PlaybackSnapshot {
  /** Lecture + attempt this snapshot belongs to; anything else is stale. */
  key: string;
  state: PlaybackViewState;
  streamError: string | null;
}

function MetaChip({
  icon: Icon,
  children,
}: {
  icon: typeof Eye;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-slate-200">
      <Icon className="h-3.5 w-3.5 text-rose-300" aria-hidden="true" />
      {children}
    </span>
  );
}

/** Placeholder that keeps the stage's size while no stream is authorized. */
function StagePanel({
  tone,
  children,
}: {
  tone: "loading" | "locked" | "error";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex aspect-video w-full flex-col items-center justify-center gap-3 p-6 text-center ${
        tone === "loading"
          ? "bg-slate-900/60"
          : tone === "locked"
            ? "bg-slate-950"
            : "bg-rose-950/60"
      }`}
    >
      {children}
    </div>
  );
}

/**
 * The one place a lecture is played, and the only client island in the video
 * feature: browsing stays server-rendered, while this component owns the
 * authorization handshake. A <video src> is only ever built from a short-lived
 * playback token, so nothing playable exists in the DOM before the backend has
 * authorized the viewer.
 */
export default function VideoLecturePlayer({
  lecture,
}: VideoLecturePlayerProps) {
  const [snapshot, setSnapshot] = useState<PlaybackSnapshot | null>(null);
  const [attempt, setAttempt] = useState(0);

  const titleId = `lecture-title-${lecture.id}`;
  const descriptionId = `lecture-description-${lecture.id}`;
  const hasDescription = Boolean(lecture.description?.trim());

  // Everything below is derived from the snapshot's key, so switching lecture
  // or retrying drops a stale player instead of flashing the previous one.
  const snapshotKey = `${lecture.id}:${attempt}`;
  const current = snapshot?.key === snapshotKey ? snapshot : null;
  const state: PlaybackViewState = current?.state ?? { kind: "loading" };
  const streamError = current?.streamError ?? null;

  useEffect(() => {
    let active = true;

    requestStudyResourcePlaybackToken(lecture.id).then((authorization) => {
      if (!active) return;
      setSnapshot({
        key: snapshotKey,
        state: toPlaybackViewState(lecture.id, authorization),
        streamError: null,
      });
    });

    return () => {
      active = false;
    };
  }, [lecture.id, snapshotKey]);

  const retry = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-[0_28px_70px_-38px_rgba(15,23,42,0.7)] sm:p-7">
      <div
        className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-28 left-10 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_18px_45px_-28px_rgba(0,0,0,0.9)]">
          {state.kind === "loading" && (
            <StagePanel tone="loading">
              <Loader2
                className="h-7 w-7 animate-spin text-rose-300"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-slate-200">
                Preparing playback…
              </p>
              <p className="text-xs text-slate-400">
                Checking your access to this lecture.
              </p>
            </StagePanel>
          )}

          {state.kind === "login-required" && (
            <StagePanel tone="locked">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-rose-300">
                <LockKeyhole className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-white">
                Log in to watch this lecture
              </p>
              <p className="max-w-sm text-xs leading-5 text-slate-400">
                {state.message} The video collection stays open — you just need
                an account to start playback.
              </p>
              <Link
                href={state.loginHref}
                className="mt-1 inline-flex items-center gap-2 rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Log in to continue
              </Link>
            </StagePanel>
          )}

          {state.kind === "error" && (
            <StagePanel tone="error">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300">
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-white">
                Playback unavailable
              </p>
              <p className="max-w-sm text-xs leading-5 text-slate-300">
                {state.message}
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Try again
                </button>
                <Link
                  href={state.loginHref}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                >
                  <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                  Log in
                </Link>
              </div>
            </StagePanel>
          )}

          {state.kind === "ready" && streamError && (
            <StagePanel tone="error">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300">
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="max-w-sm text-sm font-semibold text-white">
                {streamError}
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Refresh playback
                </button>
                <Link
                  href={state.loginHref}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                >
                  <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                  Log in
                </Link>
              </div>
            </StagePanel>
          )}

          {state.kind === "ready" && !streamError && (
            <video
              // Keyed by id and token so a refresh always starts a clean stream.
              key={`${lecture.id}-${state.streamUrl}`}
              className="aspect-video w-full bg-black"
              src={state.streamUrl}
              controls
              preload="metadata"
              playsInline
              onError={() =>
                setSnapshot((prev) =>
                  prev?.key === snapshotKey
                    ? {
                        ...prev,
                        streamError: playbackStreamErrorMessage(true),
                      }
                    : prev,
                )
              }
              aria-labelledby={titleId}
              aria-describedby={hasDescription ? descriptionId : undefined}
            >
              Your browser cannot play this lecture inline.{" "}
              <a href={state.streamUrl} target="_blank" rel="noreferrer">
                Open the video in a new tab
              </a>
              .
            </video>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-rose-300">
              <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {state.kind === "ready" && !streamError
                ? "Now playing"
                : "Selected lecture"}
            </p>
            <h2
              id={titleId}
              className="mt-2 text-xl font-bold tracking-[-0.03em] text-white sm:text-2xl"
            >
              {lecture.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:max-w-md sm:justify-end">
            {lecture.course && (
              <MetaChip icon={BookOpen}>{lecture.course}</MetaChip>
            )}
            {lecture.year && (
              <MetaChip icon={Calendar}>{lecture.year}</MetaChip>
            )}
            <MetaChip icon={Timer}>
              {formatDuration(lecture.duration_seconds)}
            </MetaChip>
            <MetaChip icon={Eye}>{formatCount(lecture.views)} views</MetaChip>
            <MetaChip icon={HardDrive}>
              {formatFileSize(lecture.file_size)}
            </MetaChip>
          </div>
        </div>

        {hasDescription && (
          <div
            id={descriptionId}
            className="mt-4 max-w-3xl border-t border-white/10 pt-4 text-sm leading-7 text-slate-300"
          >
            <RichText html={lecture.description} variant="sm" />
          </div>
        )}
      </div>
    </div>
  );
}
