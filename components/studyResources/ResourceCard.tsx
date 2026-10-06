"use client";

/**
 * The one study-resource card.
 *
 * This file exists because the card was written out twice in full —
 * `StudyResourcesPage.tsx:400-484` and `VideoLecturesPage.tsx:262-320` — with
 * the two copies free to drift. That drift is not hypothetical: the video copy
 * had already gained a `text-slate-400` "Sign in to play" label at 2.56:1
 * contrast (06 §11.2) that the document copy did not have, and a gate written
 * twice is a gate that will charge someone on one page and not another. The
 * coin state is now written once, here.
 *
 * **This is a refactor plus an addition, not a redesign.** Every class below is
 * one the two copies already had, kept deliberately unchanged: the
 * `rounded-md` / `border-gray-200` tile of the document card, and the
 * `rose`-ringed selectable button of the video card. The dialect question was
 * settled in 06 §0.3 and is not reopened here — the gray / brand-blue language
 * wins structurally, and the `rose` and `slate-950` of the video surfaces are a
 * documented exception that stays exactly as it is.
 *
 * The two shapes are genuinely different — one is an `<article>` with an action
 * button in its footer, the other a `<button>` that selects a lecture — so they
 * are two wrappers around ONE body. The wrapper is the only part that differs.
 * Title, description, metadata, count, coin badge and primary action are written
 * once and cannot disagree between the two catalogues.
 */
import React from "react";
import {
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  PlayCircle,
} from "lucide-react";
import CoinBadge from "@/components/coins/CoinBadge";
import ResourceAccessDialog from "@/components/coins/ResourceAccessDialog";
import ResourcePreviewButton from "./ResourcePreviewButton";
import type { ResolvedResourceAccess } from "@/components/coins/useCoinState";
import { stripHtml } from "@/services/api";
import {
  isVideoStudyResourceType,
  type StudyResource,
} from "@/services/studyResourcesApi";
import { formatCount, formatDuration } from "./videoFormat";

export type ResourceCardVariant = "document" | "video";

export interface ResourceCardProps {
  resource: StudyResource;
  variant: ResourceCardVariant;
  /**
   * Resolved coin state, or null when the gate is off for this item. Null draws
   * no badge and mounts no dialog, so the card is byte-for-byte the card that
   * shipped before coins existed.
   */
  access: ResolvedResourceAccess | null;
  /** Video variant only: this lecture is loaded in the player. */
  selected?: boolean;
  /** Video variant only: pick this lecture. */
  onSelect?: () => void;
  /** The real action once access is settled: today's download or watch. */
  onPrimaryAction: () => void;
  onSignIn: () => void;
  /** This card's own unlock request is in flight. */
  busy?: boolean;
}

function typeLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** 0 → "—", 12_345_678 → "11.8 MB". The document card's own helper, unchanged. */
function formatFileSize(bytes: number | string): string {
  const size = Number(bytes) || 0;
  if (size <= 0) return "—";
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(size / 1024)} KB`;
}

/**
 * The part both shapes share, so the coin state exists once.
 *
 * The badge goes in the header row beside the type pill, never in the footer:
 * the footer is `flex items-center justify-between`, and a price there either
 * wraps on a 360px screen or doubles the row's height (06 §9). The button label
 * carries the verb alone for the same reason.
 */
function CardBody({
  resource,
  variant,
  access,
  onPrimaryAction,
  onSignIn,
  busy,
}: {
  resource: StudyResource;
  variant: ResourceCardVariant;
  access: ResolvedResourceAccess | null;
  onPrimaryAction: () => void;
  onSignIn: () => void;
  busy?: boolean;
}) {
  const isVideo = isVideoStudyResourceType(resource.resource_type);

  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
            isVideo ? "bg-rose-50 text-rose-500" : "bg-blue-50 text-brand-blue"
          }`}
        >
          {isVideo ? (
            <PlayCircle className="h-5 w-5" aria-hidden="true" />
          ) : (
            <FileText className="h-5 w-5" aria-hidden="true" />
          )}
        </span>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {access && <CoinBadge access={access} />}
          <span className="rounded bg-gray-100 px-2 py-1 text-[11px] font-bold text-gray-600">
            {isVideo
              ? formatDuration(resource.duration_seconds)
              : typeLabel(resource.resource_type || "")}
          </span>
        </div>
      </div>

      <h3 className="mb-2 text-base font-semibold text-gray-900">{resource.title}</h3>
      <p className="mb-4 line-clamp-2 min-h-[40px] text-[13px] leading-relaxed text-gray-500">
        {stripHtml(resource.description) || "—"}
      </p>

      <div
        className={`flex flex-wrap items-center gap-3 text-xs text-gray-500 ${
          variant === "video"
            ? "mt-auto border-t border-gray-100 pt-3"
            : "border-b border-gray-200 pb-4"
        }`}
      >
        {resource.course && <span className="truncate">{resource.course}</span>}
        {resource.year && (
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={12} aria-hidden="true" />
            {resource.year}
          </span>
        )}
        {isVideo ? (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={12} aria-hidden="true" />
            {formatDuration(resource.duration_seconds)}
          </span>
        ) : (
          <span>{formatFileSize(resource.file_size)}</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-4">
        <span
          className={`inline-flex items-center gap-1.5 text-xs text-gray-500 ${
            variant === "video" ? "ml-auto" : ""
          }`}
        >
          {isVideo ? (
            <>
              <Eye size={12} aria-hidden="true" />
              <span className="sr-only">Views:</span>
              {formatCount(resource.views ?? 0)}
            </>
          ) : (
            <>
              <Download size={13} aria-hidden="true" /> {resource.downloads} downloads
            </>
          )}
        </span>

        {/*
          The video tile's control is SELECTION, not a second unlock: it loads
          the lecture into the player, and the player is where playback is
          authorized. A coin button nested inside it would be invalid HTML and
          two competing actions. Its state is carried by the badge instead, so a
          locked lecture is still honestly labelled before the tap — which is
          what the old "Sign in to play" line was doing badly, at 2.56:1
          contrast, in one place only.
        */}
        {variant === "document" && (
          <div className="flex items-center gap-2">
            {/*
              The sample, beside the spend: PDFs only, self-contained, and not
              a coin state — it renders the same whether the gate is on or
              off, because the preview route serves its first-pages sample to
              anyone and never the whole document.
            */}
            <ResourcePreviewButton resource={resource} />
            <ResourceAccessDialog
              access={access ?? UNGATED_ACCESS}
              resource={resource}
              resourceType={isVideo ? "video" : "study_resource"}
              signInHref="/login"
              enabled={access !== null}
              busy={busy}
              onSignIn={onSignIn}
              onUnlocked={onPrimaryAction}
              onPlainAction={onPrimaryAction}
            />
          </div>
        )}
      </div>
    </>
  );
}

/** The document catalogue tile: an `<article>` with an action in its footer. */
function DocumentResourceCard(props: ResourceCardProps) {
  return (
    <article className="min-w-0 rounded-md border border-gray-200 bg-white p-4">
      <CardBody
        resource={props.resource}
        variant="document"
        access={props.access}
        onPrimaryAction={props.onPrimaryAction}
        onSignIn={props.onSignIn}
        busy={props.busy}
      />
    </article>
  );
}

/**
 * The video list tile: still the selectable `<button>` with the `rose` ring it
 * always was, still inside the `<li>` the list expects. Nested buttons are
 * invalid HTML, and the selection affordance is the whole point of this tile,
 * so the variant changes the wrapper and nothing else.
 */
function VideoResourceCard({
  resource,
  selected = false,
  onSelect,
  onPrimaryAction,
  onSignIn,
  access,
  busy,
}: ResourceCardProps) {
  return (
    <li className="min-w-0">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`group flex h-full w-full flex-col rounded-md border bg-white p-4 text-left transition-all ${
          selected
            ? "border-rose-300 shadow-[0_10px_30px_-20px_rgba(225,29,72,0.55)] ring-1 ring-rose-200"
            : "border-gray-200 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-[0_14px_32px_-24px_rgba(15,23,42,0.5)]"
        }`}
      >
        <CardBody
          resource={resource}
          variant="video"
          access={access}
          onPrimaryAction={onPrimaryAction}
          onSignIn={onSignIn}
          busy={busy}
        />
      </button>
    </li>
  );
}

/**
 * A draft is not a student-facing state. The public queries already exclude
 * unpublished rows, so this covers the admin's optimistic insert and any page
 * rendered from a stale cache (06 §3.1).
 */
export default function ResourceCard(props: ResourceCardProps) {
  if (props.resource.is_published === false) return null;
  return props.variant === "video" ? (
    <VideoResourceCard {...props} />
  ) : (
    <DocumentResourceCard {...props} />
  );
}

/**
 * The state an ungated item resolves to, used only to satisfy the type while the
 * dialog renders its own plain button. Never a coin state: no badge is drawn for
 * it and no request is made, which is what makes the feature inert while the
 * gate is off.
 */
const UNGATED_ACCESS: ResolvedResourceAccess = {
  state: "price-unknown",
  price: null,
  balance: null,
  gap: 0,
  starterLeft: null,
  starterTotal: null,
  busy: false,
};
