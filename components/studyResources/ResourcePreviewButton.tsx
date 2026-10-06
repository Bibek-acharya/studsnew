"use client";

/**
 * The sample button: "look inside" before any coins move.
 *
 * A document card's primary action spends something — coins, a starter
 * unlock, or at minimum a download slot on the student's machine — and a
 * spend without a look is how refund requests are born. This button opens the
 * first few pages in a modal, served by the public `/preview` route, which
 * never serves the whole document (at least one page is always withheld), so
 * the sample can never become the free path.
 *
 * Self-contained on purpose: the card body already carries the coin dialog's
 * wiring, and a second prop drilled through both catalogue pages for a
 * feature that touches nothing else would be the coupling this component
 * avoids. It owns its modal, its fetch, and the blob URL's lifetime.
 *
 * Rendered only for PDFs. Office formats and archives have no server-side
 * sampler (the button is absent rather than promising and failing), and video
 * lectures already have a player — the card's document/video split decides
 * placement, this check decides existence.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Eye, RefreshCw, X } from "lucide-react";
import {
  fetchStudyResourcePreview,
  isVideoStudyResourceType,
  type StudyResource,
} from "@/services/studyResourcesApi";

type Phase =
  | { state: "closed" }
  | { state: "loading" }
  | { state: "ready"; blobUrl: string }
  | { state: "unavailable"; message: string }
  | { state: "error"; message: string };

/** The only files the backend can page through. */
export function isPreviewableResource(resource: StudyResource): boolean {
  if (isVideoStudyResourceType(resource.resource_type)) return false;
  if ((resource.mime_type ?? "").toLowerCase() === "application/pdf") return true;
  return (resource.file_name ?? "").toLowerCase().endsWith(".pdf");
}

export default function ResourcePreviewButton({
  resource,
}: {
  resource: StudyResource;
}) {
  const [phase, setPhase] = useState<Phase>({ state: "closed" });
  const abortRef = useRef<AbortController | null>(null);
  // The blob URL is an allocation, not a value: revoking it is what closes
  // the modal without leaking the whole sample into the browser's memory for
  // the session. Tracked outside phase so a revoke never depends on which
  // render produced the URL.
  const blobUrlRef = useRef<string | null>(null);

  const close = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setPhase({ state: "closed" });
  }, []);

  const open = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase({ state: "loading" });
    void fetchStudyResourcePreview(resource.id, { signal: controller.signal })
      .then((outcome) => {
        if (controller.signal.aborted) return;
        if (outcome.status === "ok") {
          blobUrlRef.current = outcome.blobUrl;
          setPhase({ state: "ready", blobUrl: outcome.blobUrl });
        } else {
          setPhase({ state: outcome.status, message: outcome.message });
        }
      })
      .catch(() => {
        // An aborted fetch lands here only when close() already ran; anything
        // else is a mid-read failure, which is the retryable state.
        if (!controller.signal.aborted) {
          setPhase({
            state: "error",
            message: "Could not load the preview. Check your connection and try again.",
          });
        }
      });
  }, [resource.id]);

  // Escape closes, and the page does not scroll under the modal — the same
  // two courtesies every other overlay in this app performs.
  useEffect(() => {
    if (phase.state === "closed") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [phase.state, close]);

  // An unmount with the modal open still aborts the fetch and revokes the
  // URL. Kept separate from close(): no setState belongs in an unmount.
  useEffect(
    () => () => {
      abortRef.current?.abort();
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    },
    [],
  );

  if (!isPreviewableResource(resource)) return null;

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label={`Preview the first pages of ${resource.title}`}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
      >
        <Eye size={15} aria-hidden="true" />
        <span>Preview</span>
      </button>

      {phase.state !== "closed" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of ${resource.title}`}
          className="fixed inset-0 z-[180] flex items-center justify-center p-3 sm:p-6"
        >
          <button
            type="button"
            aria-label="Close preview"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={close}
          />
          <div className="relative flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-gray-900">
                  {resource.title}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  First pages only — unlock to read and download the whole
                  document.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close preview"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="min-h-0 flex-1 bg-gray-50">
              {phase.state === "loading" && (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
                  <div
                    className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-blue"
                    aria-hidden="true"
                  />
                  <p className="text-sm">Loading preview…</p>
                </div>
              )}

              {phase.state === "ready" && (
                <iframe
                  src={phase.blobUrl}
                  title={`First pages of ${resource.title}`}
                  className="h-full w-full"
                />
              )}

              {phase.state === "unavailable" && (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <Eye size={28} className="text-gray-300" aria-hidden="true" />
                  <p className="max-w-sm text-sm leading-6 text-gray-500">
                    {phase.message}
                  </p>
                </div>
              )}

              {phase.state === "error" && (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="max-w-sm text-sm leading-6 text-gray-500">
                    {phase.message}
                  </p>
                  <button
                    type="button"
                    onClick={open}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                  >
                    <RefreshCw size={13} aria-hidden="true" />
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
