"use client";

/**
 * The study-resource approval queue — 04 §6's first bullet.
 *
 * ## The coin consequence is stated before the click, not after it
 *
 * Approving here publishes the resource AND credits the uploader, so every row's
 * button is a financial operation. 06 §8 is explicit that the approve dialog must name
 * what happens to the student's balance, and the same section is candid that the
 * upload form should tell the student they are spending the admin's coins.
 *
 * So the confirmation names the award, and the success toast reports the figure the
 * LEDGER returned rather than the configured one. Those are different numbers
 * whenever the award was refused, and an operator who sees the configured figure has
 * been told a student was paid who was not.
 *
 * ## Bulk runs do not stop at the first failure
 *
 * A bulk approve is N independent financial operations. Stopping at the first error
 * would leave the operator unable to tell which rows moved, and the ones they did not
 * see approved would sit in the queue looking untouched — so every id is attempted and
 * the failures are named back to them.
 *
 * ## Rejection cannot be submitted without a reason
 *
 * The reason is mandatory server-side (`ErrRejectReasonRequired`) and is the only
 * record the uploader's next support email will have. It is sent verbatim: trimming
 * whitespace is safe, rewriting an operator's explanation is not.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  adminApprovalApi,
  summariseBulkApprove,
  type PendingResource,
} from "@/services/adminApprovalApi";

/** Shown to the operator before they approve, so the coin move is never a surprise. */
const AWARD_LABEL = "80 StudsTokens";

export default function PendingResourcesSection() {
  const [items, setItems] = useState<PendingResource[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<PendingResource | null>(null);
  const [confirming, setConfirming] = useState<PendingResource | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  const limit = 20;

  const load = useCallback(async () => {
    try {
      const res = await adminApprovalApi.listPending(page, limit);
      setItems(res?.study_resources ?? []);
      setTotal(res?.total ?? 0);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the review queue.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  // `load` sets every piece of state after an `await`, so nothing is set
  // synchronously. Disabled rather than worked around because Suspense cannot help
  // here: the superadmin token lives in localStorage, so only the browser can fetch
  // the queue at all.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    void load();
  }, [load]);

  const allSelected = items.length > 0 && items.every((r) => selected.has(r.id));
  const pages = Math.max(1, Math.ceil(total / limit));

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(items.map((r) => r.id)));
  }

  /** Remove rows that are no longer queued, after any successful action. */
  function dropFromQueue(ids: number[]) {
    const gone = new Set(ids);
    setItems((prev) => prev.filter((r) => !gone.has(r.id)));
    setTotal((t) => Math.max(0, t - ids.length));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  }

  async function doApprove(resource: PendingResource) {
    setConfirming(null);
    try {
      const res = await adminApprovalApi.approve(resource.id);
      dropFromQueue([resource.id]);
      // The ledger's figure, not AWARD_LABEL.
      const credited = res?.coins_credited;
      setNotice(
        `Approved and published "${resource.title}".` +
          (typeof credited === "number"
            ? ` The uploader was credited ${credited} StudsTokens.`
            : ""),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "The approval was refused.");
    }
  }

  async function doBulkApprove() {
    const ids = items.filter((r) => selected.has(r.id)).map((r) => r.id);
    if (ids.length === 0) return;

    setBulkBusy(true);
    setError(null);
    setNotice(null);

    const result = await summariseBulkApprove(ids, (id) => adminApprovalApi.approve(id));
    setBulkBusy(false);

    if (result.approved.length > 0) dropFromQueue(result.approved);

    const parts: string[] = [];
    if (result.approved.length > 0) {
      parts.push(
        `${result.approved.length} published, ${result.coinsCredited} StudsTokens credited.`,
      );
    }
    if (result.failed.length > 0) {
      // Named, not counted. "2 failed" leaves the operator to guess which rows are
      // still queued, which is the question the summary exists to answer.
      parts.push(
        `${result.failed.length} failed and are still queued: ` +
          result.failed.map((f) => `#${f.id} (${f.error})`).join(", "),
      );
    }
    setNotice(parts.join(" ") || "Nothing was approved.");
  }

  async function doReject(resource: PendingResource, reason: string) {
    setRejecting(null);
    try {
      await adminApprovalApi.reject(resource.id, reason);
      dropFromQueue([resource.id]);
      setNotice(`Rejected "${resource.title}". The uploader is shown the reason.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The rejection was refused.");
    }
  }

  const emptyReasonWarn = useMemo(
    () => rejecting !== null && rejecting.title.length >= 0,
    [rejecting],
  );

  return (
    <section aria-labelledby="pending-resources-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="pending-resources-heading" className="text-lg font-semibold text-gray-900">
            Pending approval
          </h2>
          <p className="text-sm text-gray-600">
            {loading
              ? "Loading the queue…"
              : total === 0
                ? "No uploads waiting for review."
                : `${total} upload${total === 1 ? "" : "s"} awaiting review.`}
          </p>
          <p className="text-sm text-gray-600">
            Approving publishes the resource and credits the uploader {AWARD_LABEL}. Rejecting
            asks for a reason, because the uploader is shown it.
          </p>
        </div>

        {selected.size > 0 ? (
          <button
            type="button"
            onClick={() => void doBulkApprove()}
            disabled={bulkBusy}
            className="rounded-md bg-blue-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {bulkBusy
              ? "Approving…"
              : `Approve ${selected.size} selected (${selected.size * 80} StudsTokens)`}
          </button>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-red-900">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
          {notice}
        </p>
      ) : null}

      {!loading && items.length === 0 ? (
        <p className="rounded-md border border-gray-200 bg-gray-50 p-4 text-gray-700">
          New uploads land here first, before they appear in the catalogue.
        </p>
      ) : null}

      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              Uploads awaiting review. Approving publishes the resource and credits the
              uploader.
            </caption>
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="py-2 pr-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select every upload on this page"
                  />
                </th>
                <th scope="col" className="py-2 pr-3">Title</th>
                <th scope="col" className="py-2 pr-3">Type</th>
                <th scope="col" className="py-2 pr-3">Uploaded</th>
                <th scope="col" className="py-2 pr-3">Status</th>
                <th scope="col" className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 align-top">
                  <td className="py-3 pr-2">
                    <input
                      type="checkbox"
                      checked={selected.has(r.id)}
                      onChange={() => toggle(r.id)}
                      aria-label={`Select "${r.title}"`}
                    />
                  </td>
                  <th scope="row" className="py-3 pr-3 font-medium text-gray-900">
                    {r.title}
                    {r.uploader_name ? (
                      <span className="block text-xs font-normal text-gray-500">
                        by {r.uploader_name}
                      </span>
                    ) : null}
                  </th>
                  <td className="py-3 pr-3 text-gray-700">{r.resource_type ?? "—"}</td>
                  <td className="py-3 pr-3 text-gray-600">
                    {r.uploaded_at ? (
                      <time dateTime={r.uploaded_at}>
                        {new Date(r.uploaded_at).toLocaleDateString()}
                      </time>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 pr-3">
                    {/* The amber badge from 06 §8 — the same state the public table
                        renders for a submitted resource. */}
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Awaiting review
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirming(r)}
                        className="rounded border border-emerald-700 px-2 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-50"
                      >
                        Approve · +{AWARD_LABEL}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejecting(r)}
                        className="rounded border border-red-700 px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {pages > 1 ? (
        <nav aria-label="Queue pages" className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {page} of {pages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      ) : null}

      {confirming ? (
        <ConfirmDialog
          resource={confirming}
          onCancel={() => setConfirming(null)}
          onConfirm={() => void doApprove(confirming)}
        />
      ) : null}

      {rejecting && emptyReasonWarn ? (
        <RejectDialog
          resource={rejecting}
          onCancel={() => setRejecting(null)}
          onConfirm={(reason) => void doReject(rejecting, reason)}
        />
      ) : null}
    </section>
  );
}

/**
 * The approve confirmation, naming the coin consequence.
 *
 * 06 §8 gives the exact shape to follow: `PendingInstitutionsSection.tsx` already does
 * "An email with login credentials will be sent." The coin analogue states what the
 * uploader gains, because the operator is spending their coins.
 */
function ConfirmDialog({
  resource,
  onCancel,
  onConfirm,
}: {
  resource: PendingResource;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-approve-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <h3 id="confirm-approve-title" className="text-base font-semibold text-gray-900">
          Approve and publish &quot;{resource.title}&quot;?
        </h3>
        <p className="mt-2 text-sm text-gray-700">
          The uploader gets {AWARD_LABEL} and it appears in the public catalogue.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded bg-emerald-800 px-3 py-2 text-sm font-medium text-white"
          >
            Approve and publish
          </button>
        </div>
      </div>
    </div>
  );
}

/** The reject dialog. A reason is required before it will submit. */
function RejectDialog({
  resource,
  onCancel,
  onConfirm,
}: {
  resource: PendingResource;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const missing = reason.trim() === "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-reject-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <form
        className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (missing) return;
          onConfirm(reason);
        }}
      >
        <h3 id="confirm-reject-title" className="text-base font-semibold text-gray-900">
          Reject &quot;{resource.title}&quot;?
        </h3>
        <label className="mt-3 block text-sm">
          Reason for rejecting
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            rows={4}
            aria-invalid={touched && missing}
            aria-describedby={touched && missing ? "reject-reason-error" : undefined}
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1"
            placeholder="What does the uploader need to change?"
          />
        </label>
        {/* Shown only after a submit or blur attempt, so an untouched field is not
            scolded for being empty. */}
        {touched && missing ? (
          <p id="reject-reason-error" className="mt-1 text-sm text-red-700">
            Reason is required before rejecting.
          </p>
        ) : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-red-800 px-3 py-2 text-sm font-medium text-white"
          >
            Reject
          </button>
        </div>
      </form>
    </div>
  );
}