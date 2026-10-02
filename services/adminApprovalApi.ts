/**
 * The study-resource approval queue's client — 04 §6's first bullet.
 *
 * ## Why this queue is different from every other admin list
 *
 * Approving here does not toggle a row. It **publishes the resource AND credits the
 * uploader**, so every approval is a financial operation. Two consequences shape this
 * module:
 *
 *   - Coins are paid on PUBLICATION and never on upload (04 §5.3). A queued resource
 *     pays nothing until an operator uses this screen, so an empty queue is not a
 *     queue of unpaid students — it is a queue of students who have not been paid yet
 *     because nobody has looked.
 *   - A rejection REQUIRES a reason (`ErrRejectReasonRequired` server-side). The
 *     reason is the only record the uploader's next support email will have, so it is
 *     sent verbatim: trimming whitespace is safe, rewriting an operator's explanation
 *     is not.
 *
 * ## Why bulk is composed on the client
 *
 * There is no server-side bulk endpoint, deliberately. A bulk approve is N independent
 * financial operations, and a single endpoint would have to answer "what if four of
 * twenty succeed?" — partial failure semantics, a rollback story, and a way for one
 * bad row to lose nineteen good ones. Composing N individually-idempotent,
 * individually-audited calls keeps each approval its own transaction and its own
 * journal, and `summariseBulkApprove` keeps going past a failure and reports exactly
 * which ones failed.
 */

import { apiRequest } from "./api";

/** One queued resource. */
export interface PendingResource {
  id: number;
  title: string;
  description?: string;
  resource_type?: string;
  subject?: string;
  /** The uploader, so the operator can see whose balance is about to move. */
  uploaded_by?: number;
  uploader_name?: string;
  uploaded_at?: string;
  approval_status?: string;
}

/** The paged queue. */
export interface PendingQueuePage {
  page: number;
  limit: number;
  total: number;
  study_resources: PendingResource[];
}

/** What approving did. */
export interface ApproveResult {
  id?: number;
  /** Read from the ledger, not assumed — an operator who has just moved a student's
   *  balance wants the figure rather than a promise. */
  coins_credited?: number;
}

function superadminToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem("superadmin_token") ?? undefined;
}

async function unwrap<T>(request: Promise<unknown>): Promise<T> {
  const res = (await request) as { data?: T } | T;
  if (res && typeof res === "object" && "data" in (res as object)) {
    return (res as { data: T }).data;
  }
  return res as T;
}

export const adminApprovalApi = {
  /** The queue, newest-first as the service returns it. */
  async listPending(page = 1, limit = 20): Promise<PendingQueuePage> {
    const qs = `?page=${Math.max(1, Math.trunc(page))}&limit=${Math.max(1, Math.trunc(limit))}`;
    return unwrap(
      apiRequest(`/api/v1/admin/study-resources/pending${qs}`, {
        authToken: superadminToken(),
      }),
    );
  },

  /**
   * Approve one resource: publishes it and pays the uploader.
   *
   * No reason is needed or accepted — approval is not a judgement to be recorded, it
   * is a publication. The reason vocabulary belongs to rejection only.
   */
  async approve(id: number): Promise<ApproveResult> {
    return unwrap(
      apiRequest(`/api/v1/admin/study-resources/${encodeURIComponent(String(id))}/approve`, {
        method: "POST",
        authToken: superadminToken(),
      }),
    );
  },

  /**
   * Reject one resource, with the reason the uploader will be shown.
   *
   * The reason is mandatory and is not defaulted here. An operator who reaches this
   * without a reason has not decided anything yet, and a rejection carrying "no" as
   * its explanation is worse than no rejection: it spends the uploader's submission
   * and gives them nothing to act on.
   */
  async reject(id: number, reason: string): Promise<unknown> {
    const trimmed = reason.trim();
    if (trimmed === "") {
      throw new Error(
        "A rejection needs a reason. The uploader is shown it, and it is the only record of why.",
      );
    }
    return unwrap(
      apiRequest(`/api/v1/admin/study-resources/${encodeURIComponent(String(id))}/reject`, {
        method: "POST",
        authToken: superadminToken(),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reject_reason: trimmed }),
      }),
    );
  },
};

/** What a bulk run did. */
export interface BulkApproveSummary {
  approved: number[];
  failed: { id: number; error: string }[];
  /** The coins those approvals actually moved. Failures contribute nothing. */
  coinsCredited: number;
}

/**
 * Runs an approve over several resources and reports what happened.
 *
 * **Continues past a failure.** The alternative — stop at the first error — leaves
 * the operator unable to tell which resources were approved, and the ones they did not
 * see approved would sit in the queue looking untouched. So every id is attempted, and
 * the failures are named.
 *
 * Sequential rather than parallel on purpose. Each approval posts a ledger journal
 * and credits a student, and twenty at once against the same account rows is a way to
 * manufacture lock contention for no speed benefit at this queue size.
 */
export async function summariseBulkApprove(
  ids: number[],
  approveOne: (id: number) => Promise<ApproveResult>,
): Promise<BulkApproveSummary> {
  const approved: number[] = [];
  const failed: { id: number; error: string }[] = [];
  let coinsCredited = 0;

  for (const id of ids) {
    try {
      const result = await approveOne(id);
      approved.push(id);
      // From the ledger's own answer, not from a configured award: if the award was
      // refused the operator needs to see zero here rather than the configured figure.
      coinsCredited += Number(result?.coins_credited ?? 0);
    } catch (e) {
      failed.push({
        id,
        error: e instanceof Error ? e.message : "The approval was refused.",
      });
    }
  }

  return { approved, failed, coinsCredited };
}