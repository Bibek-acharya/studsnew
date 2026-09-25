import { apiRequest } from "./api";

/**
 * Mock tests are their own nested domain: a test owns questions, each question
 * owns options, and exactly one option per question is correct.
 *
 * The public DTOs below are mapped field-by-field on purpose — the answer key
 * is never part of them, so nothing correct can leak into the browser even if a
 * response carries extra fields. The scored attempt response is the only place
 * a verdict appears, and it reports correctness per question — not the answer.
 */

export interface MockTestOption {
  id: number;
  option_text: string;
}

export interface MockTestQuestion {
  id: number;
  question_text: string;
  options: MockTestOption[];
}

export interface PublicMockTest {
  id: number;
  title: string;
  description: string;
  course: string;
  year: string;
  duration_minutes: number | null;
  /** Named as the backend names it in the list DTO. */
  question_count: number;
  attempts: number;
  created_at: string;
}

export interface PublicMockTestDetail extends PublicMockTest {
  questions: MockTestQuestion[];
}

export interface MockTestListPage {
  items: PublicMockTest[];
  total: number;
  page: number;
  limit: number;
}

export interface MockTestFilters {
  q?: string;
  course?: string;
  year?: string;
  page?: number;
  limit?: number;
}

export interface MockTestListOptions {
  revalidate?: number;
}

/** One graded answer. The server decides whether the option was correct. */
export interface MockTestAnswer {
  question_id: number;
  option_id: number;
}

/**
 * One graded question from the submit response. This mirrors the backend
 * exactly: it reports whether the answer was right, and nothing else. The
 * answer key and per-question explanation are never part of this response, so
 * they are not part of this type either — the review screen shows the verdict
 * only, and never reconstructs a correct answer in the browser.
 */
export interface MockTestQuestionResult {
  question_id: number;
  is_correct: boolean;
}

export interface MockTestAttemptResult {
  test_id?: number;
  score: number;
  total_questions?: number;
  /** The backend scores out of 100 as `score_percent`. */
  score_percent: number;
  results: MockTestQuestionResult[];
}

/**
 * Read the scored attempt response defensively. The percentage comes from the
 * backend's `score_percent`; when it is missing we recompute it from the score
 * and the question count the server also returned. Nothing is invented beyond
 * arithmetic on server-supplied numbers.
 */
export function normalizeMockTestAttemptResult(
  raw: unknown,
  fallbackTotal = 0,
): MockTestAttemptResult {
  const payload = (raw ?? {}) as Record<string, unknown>;
  const rawResults = Array.isArray(payload.results) ? payload.results : [];
  const results: MockTestQuestionResult[] = rawResults.map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    return {
      question_id: Number(item.question_id ?? 0),
      is_correct: item.is_correct === true,
    };
  });

  const score = Number(payload.score ?? 0);
  const total = Number(
    payload.total_questions ?? rawResults.length ?? fallbackTotal,
  );
  const reportedPercent = Number(payload.score_percent);
  const scorePercent = Number.isFinite(reportedPercent)
    ? reportedPercent
    : total > 0
      ? (score / total) * 100
      : 0;

  const result: MockTestAttemptResult = {
    score,
    total_questions: total,
    score_percent: scorePercent,
    results,
  };
  if (payload.test_id !== undefined && payload.test_id !== null) {
    result.test_id = Number(payload.test_id);
  }
  return result;
}

// ─── Admin DTOs (include the answer key; superadmin-only endpoints) ──────────

export interface AdminMockTestOption {
  id?: number;
  option_text: string;
  is_correct: boolean;
}

export interface AdminMockTestQuestion {
  id?: number;
  question_text: string;
  explanation: string;
  options: AdminMockTestOption[];
}

export interface AdminMockTest {
  id: number;
  title: string;
  description: string;
  course: string;
  year: string;
  duration_minutes: number | null;
  is_published: boolean;
  attempts: number;
  /** Present on the list response; the detail response also carries questions. */
  question_count: number;
  created_at: string;
  questions: AdminMockTestQuestion[];
}

/** Nested create/update body: the whole document is saved in one request. */
export interface MockTestPayload {
  title: string;
  description: string;
  course: string;
  year: string;
  duration_minutes: number | null;
  is_published: boolean;
  questions: AdminMockTestQuestion[];
}

function superadminToken(): string | undefined {
  return (
    (typeof window !== "undefined"
      ? localStorage.getItem("superadmin_token")
      : null) ?? undefined
  );
}

function buildListPath(filters: MockTestFilters = {}): string {
  const search = new URLSearchParams();
  if (filters.q) search.set("q", filters.q);
  if (filters.course) search.set("course", filters.course);
  if (filters.year) search.set("year", filters.year);
  if (filters.page) search.set("page", String(filters.page));
  if (filters.limit) search.set("limit", String(filters.limit));
  const qs = search.toString();
  return `/api/v1/mock-tests${qs ? `?${qs}` : ""}`;
}

/** Keep only the public summary fields. */
export function toPublicMockTest(raw: unknown): PublicMockTest {
  const item = (raw ?? {}) as Record<string, unknown>;
  return {
    id: Number(item.id ?? 0),
    title: String(item.title ?? ""),
    description: String(item.description ?? ""),
    course: String(item.course ?? ""),
    year: String(item.year ?? ""),
    duration_minutes:
      item.duration_minutes === null || item.duration_minutes === undefined
        ? null
        : Number(item.duration_minutes),
    // The list DTO counts questions as `question_count`.
    question_count: Number(item.question_count ?? 0),
    attempts: Number(item.attempts ?? 0),
    created_at: String(item.created_at ?? ""),
  };
}

/** Keep questions and option text only — `is_correct` is dropped on purpose. */
export function toPublicMockTestQuestion(raw: unknown): MockTestQuestion {
  const question = (raw ?? {}) as Record<string, unknown>;
  const options = Array.isArray(question.options) ? question.options : [];
  return {
    id: Number(question.id ?? 0),
    question_text: String(question.question_text ?? question.text ?? ""),
    options: options.map((option) => {
      const value = (option ?? {}) as Record<string, unknown>;
      return {
        id: Number(value.id ?? 0),
        option_text: String(value.option_text ?? value.text ?? ""),
      };
    }),
  };
}

export function toPublicMockTestDetail(raw: unknown): PublicMockTestDetail {
  const detail = (raw ?? {}) as Record<string, unknown>;
  const questions = Array.isArray(detail.questions) ? detail.questions : [];
  return {
    ...toPublicMockTest(detail),
    questions: questions.map(toPublicMockTestQuestion),
  };
}

/** Accepts both accepted list envelopes and flattens them to a page. */
export function normalizeMockTestList(
  response: unknown,
  fallbackLimit = 20,
): MockTestListPage {
  if (!response || typeof response !== "object") {
    return { items: [], total: 0, page: 1, limit: fallbackLimit };
  }
  if (Array.isArray(response)) {
    const items = response.map(toPublicMockTest);
    return { items, total: items.length, page: 1, limit: fallbackLimit };
  }
  const envelope = response as {
    data?: unknown;
    total?: number;
    page?: number;
    limit?: number;
    mock_tests?: unknown[];
    tests?: unknown[];
  };
  const data = (envelope.data ?? {}) as Record<string, unknown>;
  const rawItems = [
    ...(Array.isArray(envelope.mock_tests) ? envelope.mock_tests : []),
    ...(Array.isArray(data.mock_tests) ? data.mock_tests : []),
    ...(Array.isArray(data.tests) ? data.tests : []),
  ];
  const items = rawItems.map(toPublicMockTest);
  const total = Number(
    envelope.total ?? data.total ?? items.length,
  );
  return {
    items,
    total,
    page: Number(envelope.page ?? data.page ?? 1),
    limit: Number(envelope.limit ?? data.limit ?? fallbackLimit),
  };
}

function unwrapData(response: unknown): unknown {
  if (
    response &&
    typeof response === "object" &&
    !Array.isArray(response) &&
    "data" in (response as Record<string, unknown>)
  ) {
    return (response as { data: unknown }).data;
  }
  return response;
}

export const mockTestsApi = {
  // ─── Public (anonymous browsing) ──────────────────────────────────────────

  async listMockTests(
    filters: MockTestFilters = {},
    options: MockTestListOptions = {},
  ): Promise<MockTestListPage> {
    const path = buildListPath(filters);
    const response =
      options.revalidate !== undefined
        ? await apiRequest<unknown>(path, {
            next: { revalidate: options.revalidate },
          })
        : await apiRequest<unknown>(path);
    return normalizeMockTestList(response, filters.limit ?? 20);
  },

  async getMockTest(id: number | string): Promise<PublicMockTestDetail> {
    const response = await apiRequest<unknown>(`/api/v1/mock-tests/${id}`);
    return toPublicMockTestDetail(unwrapData(response));
  },

  /** Scores an attempt. Requires a logged-in user; the server grades it. */
  async submitMockTest(
    id: number | string,
    answers: MockTestAnswer[],
  ): Promise<MockTestAttemptResult> {
    const response = await apiRequest<unknown>(
      `/api/v1/mock-tests/${id}/submit`,
      { method: "POST", body: JSON.stringify({ answers }) },
    );
    return normalizeMockTestAttemptResult(unwrapData(response), answers.length);
  },

  // ─── Superadmin ───────────────────────────────────────────────────────────

  async adminListMockTests(): Promise<AdminMockTest[]> {
    const response = await apiRequest<unknown>("/api/v1/admin/mock-tests", {
      authToken: superadminToken(),
    });
    const data = unwrapData(response);
    if (Array.isArray(data)) return data as AdminMockTest[];
    const list = (data ?? {}) as Record<string, unknown>;
    const items = list.mock_tests ?? list.tests;
    return Array.isArray(items) ? (items as AdminMockTest[]) : [];
  },

  async adminGetMockTest(id: number | string): Promise<AdminMockTest> {
    const response = await apiRequest<unknown>(
      `/api/v1/admin/mock-tests/${id}`,
      { authToken: superadminToken() },
    );
    return unwrapData(response) as AdminMockTest;
  },

  /** Saves the test with its full question/option tree. */
  async createMockTest(payload: MockTestPayload): Promise<AdminMockTest> {
    const response = await apiRequest<unknown>("/api/v1/admin/mock-tests", {
      method: "POST",
      body: JSON.stringify(payload),
      authToken: superadminToken(),
    });
    return unwrapData(response) as AdminMockTest;
  },

  async updateMockTest(
    id: number | string,
    payload: MockTestPayload,
  ): Promise<AdminMockTest> {
    const response = await apiRequest<unknown>(
      `/api/v1/admin/mock-tests/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
        authToken: superadminToken(),
      },
    );
    return unwrapData(response) as AdminMockTest;
  },

  async deleteMockTest(id: number | string): Promise<void> {
    await apiRequest(`/api/v1/admin/mock-tests/${id}`, {
      method: "DELETE",
      authToken: superadminToken(),
    });
  },
};
