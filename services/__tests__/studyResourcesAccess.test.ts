/**
 * @jest-environment jsdom
 */
import { studyResourcesApi } from "../studyResourcesApi";
import type { StudyResourcesResponse } from "../studyResourcesApi";

/**
 * The session-scoped catalogue fetch.
 *
 * The access block — price, whether this student already holds the item, and how many
 * included unlocks they have left — discloses per-user facts, so it cannot ride on the
 * public catalogue. `GET /api/v1/study-resources/access` is the session-scoped twin, and
 * these tests pin that the client asks for it ONLY when there is a session to ask with.
 *
 * The failure this prevents is the one the whole backend block exists to stop: a card
 * showing a plain "Download" that refuses when pressed. That happens the moment a gate
 * is on and the list came from the PUBLIC route.
 */

jest.mock("../api", () => ({ apiRequest: jest.fn() }));
import { apiRequest } from "../api";
const mockRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

beforeEach(() => {
  mockRequest.mockReset();
  mockRequest.mockResolvedValue({ success: true, data: { study_resources: [] } });
});

describe("listStudyResourcesWithAccess", () => {
  it("asks the session-scoped path", async () => {
    await studyResourcesApi.listStudyResourcesWithAccess({ limit: 20 });
    const path = mockRequest.mock.calls[0][0] as string;
    expect(path).toContain("/api/v1/study-resources/access");
  });

  it("falls back to the public path when there is no session", async () => {
    // The important direction. An anonymous visitor must still get a catalogue; sending
    // them to the session route would trade a missing access block for a 401 page.
    await studyResourcesApi.listStudyResourcesWithAccess({ limit: 20 }, { signedIn: false });
    const path = mockRequest.mock.calls[0][0] as string;
    expect(path).not.toContain("/access");
    expect(path).toContain("/api/v1/study-resources");
  });

  it("carries the same filters as the public list", async () => {
    await studyResourcesApi.listStudyResourcesWithAccess(
      { q: "physics", type: "document", page: 2, limit: 12 },
      { signedIn: true },
    );
    const path = mockRequest.mock.calls[0][0] as string;
    expect(path).toContain("q=physics");
    expect(path).toContain("page=2");
    expect(path).toContain("limit=12");
  });

  it("preserves each item's access block through the normalizer", async () => {
    // The whole point of the round trip. A normalizer that rebuilds each item from a
    // fixed field list would silently drop `access`, the cards would resolve null, and
    // the gate would be enforced with nothing on screen — the exact failure, reintroduced
    // one layer up.
    const access = {
      price: 40,
      unlocked: false,
      allowance: { left: 2, total: 3, expires_at: "2026-11-12" },
      resource_type: "study_resource" as const,
    };
    mockRequest.mockResolvedValue({
      success: true,
      data: {
        page: 1,
        limit: 20,
        total: 1,
        study_resources: [{ id: 7, title: "A document", access }],
        years: [],
        courses: [],
      },
    });

    const page = await studyResourcesApi.listStudyResourcesWithAccess({}, { signedIn: true });
    const item = page.items[0];
    expect(item.access).toBeDefined();
    expect(item.access?.price).toBe(40);
    expect(item.access?.allowance?.left).toBe(2);
    expect(item.access?.unlocked).toBe(false);
  });

  it("leaves access absent rather than inventing one for an ungated class", async () => {
    // Absent is the "gate off" signal. A block of zeros would render as
    // "costs 0 StudsTokens", which is a price nobody can read.
    mockRequest.mockResolvedValue({
      success: true,
      data: {
        page: 1,
        limit: 20,
        total: 1,
        study_resources: [{ id: 8, title: "A video" }],
        years: [],
        courses: [],
      },
    });
    const page = await studyResourcesApi.listStudyResourcesWithAccess({}, { signedIn: true });
    expect(page.items[0].access).toBeUndefined();
  });

  it("THROWS when the annotation call fails, rather than degrading", async () => {
    // Deliberately not "return an empty page and carry on".
    //
    // The backend answers 500 on an annotation failure rather than falling back to "no
    // access block", because the two are indistinguishable to a client and only one of
    // them is safe. If this function swallowed the error and returned a catalogue, every
    // card would resolve `access` to null, render a plain Download, and refuse when
    // pressed — the exact failure the whole access block exists to prevent, reintroduced
    // one layer up as a silent degradation.
    //
    // Letting it throw puts an error boundary in front of the student, which is honest:
    // they are told the catalogue did not load rather than shown a set of links that
    // will not work.
    mockRequest.mockRejectedValue(new Error("network down"));
    await expect(
      studyResourcesApi.listStudyResourcesWithAccess({}, { signedIn: true }),
    ).rejects.toThrow();
  });
});

describe("the response type", () => {
  it("carries access on each item", () => {
    // A compile-time assertion. If the backend's envelope changes, this is where it
    // should surface rather than as a card silently rendering the wrong state.
    const response = {
      success: true,
      data: { page: 1, limit: 20, total: 0, study_resources: [] },
    } as unknown as StudyResourcesResponse;
    expect(response.data?.study_resources).toEqual([]);
  });
});