/**
 * @jest-environment jsdom
 */
import { adminApprovalApi, summariseBulkApprove } from "../adminApprovalApi";

/**
 * The study-resource approval queue's client — 04 §6's "approval queue with bulk
 * actions and reject reasons".
 *
 * The property worth testing here is not the request shape. It is that **approving
 * spends a student's coins**, which makes this queue different from every other admin
 * list in the product:
 *
 *   - Each approve publishes the resource AND credits the uploader. So a bulk approve
 *     is N financial operations, not N list mutations.
 *   - Rejection REQUIRES a reason, server-side, with `ErrRejectReasonRequired` — and
 *     the reason is the only record the uploader's next support email will have.
 *   - Coins are paid on PUBLICATION and never on upload (04 §5.3), so a queued
 *     resource pays nothing until this screen is used.
 */

jest.mock("../api", () => ({ apiRequest: jest.fn() }));
import { apiRequest } from "../api";
const mockRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

beforeEach(() => {
  mockRequest.mockReset();
  mockRequest.mockResolvedValue({ success: true, data: {} });
  window.localStorage.clear();
  window.localStorage.setItem("superadmin_token", "sa-secret");
});

describe("the approval queue client", () => {
  it("reads the pending queue", async () => {
    await adminApprovalApi.listPending(1, 20);
    expect(mockRequest.mock.calls[0][0]).toBe(
      "/api/v1/admin/study-resources/pending?page=1&limit=20",
    );
  });

  it("authenticates with the superadmin token, not the student session", async () => {
    await adminApprovalApi.listPending();
    const options = mockRequest.mock.calls[0][1] as { authToken?: string };
    expect(options.authToken).toBe("sa-secret");
  });

  it("sends an approve with no reason, because approving needs none", async () => {
    await adminApprovalApi.approve(42);
    expect(mockRequest.mock.calls[0][0]).toBe("/api/v1/admin/study-resources/42/approve");
    expect(mockRequest.mock.calls[0][1]?.method).toBe("POST");
  });

  it("refuses to send a rejection with no reason", async () => {
    // The server refuses this too (ErrRejectReasonRequired), but refusing here means
    // the uploader is never told they were rejected without an explanation — and the
    // queue never leaves a row in a state where a reason is pending.
    await expect(adminApprovalApi.reject(42, "")).rejects.toThrow(/reason/i);
    await expect(adminApprovalApi.reject(42, "   ")).rejects.toThrow(/reason/i);
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it("sends the rejection reason verbatim, trimmed", async () => {
    // The reason is the record. Trimming whitespace is safe; rewriting, capitalising
    // or truncating it is not, because an operator's explanation is the only thing
    // the uploader will be shown.
    await adminApprovalApi.reject(42, "  Copyright not held by the uploader.  ");
    const body = JSON.parse(mockRequest.mock.calls[0][1]?.body as string);
    expect(body.reject_reason).toBe("Copyright not held by the uploader.");
  });
});

describe("summariseBulkApprove", () => {
  it("reports every failure rather than stopping at the first", async () => {
    // A bulk approve is N financial operations. Stopping at the first failure would
    // leave the operator believing nothing happened, and the resources they did not
    // see approved would silently sit in the queue — so the run continues and the
    // summary names what failed.
    const results = await summariseBulkApprove(
      [1, 2, 3],
      async (id) => {
        if (id === 2) throw new Error("the ledger refused the award");
        return { coins_credited: 80 };
      },
    );

    expect(results.approved).toEqual([1, 3]);
    expect(results.failed).toEqual([{ id: 2, error: "the ledger refused the award" }]);
  });

  it("sums the coins credited, so an operator can see what was paid", async () => {
    // 06 §8: the approve dialog names the coin consequence, and after the action the
    // toast says how much was added to whom. The bulk summary is the same fact
    // aggregated, and an operator who cannot total it cannot answer "what did that
    // just cost us".
    const results = await summariseBulkApprove([1, 2, 3], async () => ({
      coins_credited: 80,
    }));
    expect(results.coinsCredited).toBe(240);
  });

  it("takes the figure from each result rather than from a configured award", async () => {
    // Deliberately NOT 80. An earlier draft of this test used 80 and could not tell a
    // sum-of-results from a hardcoded award — falsifying the implementation by
    // replacing the read with `coinsCredited += 80` left the test green, because 80 was
    // also what the only successful item happened to report. A discriminator has to
    // use a number the implementation could not have guessed.
    const results = await summariseBulkApprove([1, 2], async (id) => {
      if (id === 2) throw new Error("refused");
      return { coins_credited: 55 };
    });
    expect(results.coinsCredited).toBe(55);
  });

  it("does not count a failure as a credit", async () => {
    // A resource whose award was refused paid nobody, so its attempt contributes
    // nothing to the total even though it was made.
    const results = await summariseBulkApprove(
      [1, 2, 3],
      async (id) => {
        if (id === 2) throw new Error("refused");
        return { coins_credited: 55 };
      },
    );
    // Two successes at 55 each; the failure adds zero.
    expect(results.coinsCredited).toBe(110);
    expect(results.approved).toEqual([1, 3]);
  });

  it("reports zero when the ledger credited nothing, rather than the configured award", async () => {
    // The award can be refused server-side (ErrApprovalUnconfigured on a miswired
    // port). An operator who sees the configured figure here would believe a student
    // was paid who was not.
    const results = await summariseBulkApprove([1], async () => ({ coins_credited: 0 }));
    expect(results.coinsCredited).toBe(0);
    expect(results.approved).toEqual([1]);
  });

  it("handles an empty selection without claiming success", async () => {
    const results = await summariseBulkApprove([], async () => ({ coins_credited: 1 }));
    expect(results.approved).toEqual([]);
    expect(results.failed).toEqual([]);
    expect(results.coinsCredited).toBe(0);
  });
});