/**
 * @jest-environment jsdom
 */
import { apiRequest } from "../api";
import {
  mockTestsApi,
  normalizeMockTestAttemptResult,
  normalizeMockTestList,
  toPublicMockTestDetail,
  toPublicMockTestQuestion,
  type MockTestPayload,
} from "../mockTestsApi";

jest.mock("../api", () => ({
  apiRequest: jest.fn(),
}));

const mockedApiRequest = apiRequest as jest.Mock;

beforeEach(() => {
  mockedApiRequest.mockReset();
});

describe("mockTestsApi public endpoints", () => {
  test("the list hits the public path with only the provided filters", async () => {
    mockedApiRequest.mockResolvedValue({ data: { mock_tests: [] } });

    await mockTestsApi.listMockTests({
      q: "physics",
      course: "BSc",
      page: 2,
      limit: 12,
    });

    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/mock-tests?q=physics&course=BSc&page=2&limit=12",
    );
  });

  test("server-side list calls carry the ISR window", async () => {
    mockedApiRequest.mockResolvedValue({ data: { mock_tests: [] } });

    await mockTestsApi.listMockTests({ page: 1, limit: 12 }, { revalidate: 300 });

    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/mock-tests?page=1&limit=12",
      { next: { revalidate: 300 } },
    );
  });

  test("the detail call unwraps the data envelope", async () => {
    mockedApiRequest.mockResolvedValue({
      data: { id: 3, title: "Midterm", questions: [] },
    });

    const detail = await mockTestsApi.getMockTest(3);

    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/mock-tests/3");
    expect(detail.id).toBe(3);
    expect(detail.questions).toEqual([]);
  });

  test("submitting posts the answers array to the attempt endpoint", async () => {
    mockedApiRequest.mockResolvedValue({
      data: {
        test_id: 3,
        score: 2,
        total_questions: 2,
        score_percent: 100,
        results: [
          { question_id: 11, is_correct: true },
          { question_id: 12, is_correct: true },
        ],
      },
    });

    const result = await mockTestsApi.submitMockTest(3, [
      { question_id: 11, option_id: 101 },
      { question_id: 12, option_id: 104 },
    ]);

    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/mock-tests/3/submit",
      {
        method: "POST",
        body: JSON.stringify({
          answers: [
            { question_id: 11, option_id: 101 },
            { question_id: 12, option_id: 104 },
          ],
        }),
      },
    );
    expect(result.score).toBe(2);
    expect(result.score_percent).toBe(100);
  });

  test("the scored response exposes verdicts only, never an answer key", async () => {
    mockedApiRequest.mockResolvedValue({
      data: {
        score: 1,
        total_questions: 2,
        score_percent: 50,
        results: [
          {
            question_id: 11,
            is_correct: false,
            // A backend that grew an answer key would still not leak it here.
            correct_option_id: 102,
            selected_option_id: 101,
            explanation: "because",
          },
        ],
      },
    });

    const result = await mockTestsApi.submitMockTest(3, [
      { question_id: 11, option_id: 101 },
    ]);

    expect(result.results).toEqual([{ question_id: 11, is_correct: false }]);
    expect(JSON.stringify(result)).not.toContain("correct_option_id");
    expect(JSON.stringify(result)).not.toContain("explanation");
  });

  test("a missing score_percent is recomputed from the server's own numbers", async () => {
    mockedApiRequest.mockResolvedValue({
      data: { score: 1, total_questions: 4, results: [] },
    });

    const result = await mockTestsApi.submitMockTest(3, [
      { question_id: 11, option_id: 101 },
    ]);

    expect(result.score_percent).toBe(25);
  });

  test("a missing score_percent with no total falls back to zero", () => {
    expect(
      normalizeMockTestAttemptResult({ score: 3, results: [] }).score_percent,
    ).toBe(0);
  });
});

describe("public DTOs never carry the answer key", () => {
  test("a question is reduced to its id, text and option text", () => {
    const mapped = toPublicMockTestQuestion({
      id: 11,
      question_text: "2 + 2?",
      explanation: "Basic arithmetic",
      options: [
        { id: 101, option_text: "3", is_correct: false },
        { id: 102, option_text: "4", is_correct: true },
      ],
    });

    expect(mapped).toEqual({
      id: 11,
      question_text: "2 + 2?",
      options: [
        { id: 101, option_text: "3" },
        { id: 102, option_text: "4" },
      ],
    });
    expect(JSON.stringify(mapped)).not.toContain("is_correct");
    expect(JSON.stringify(mapped)).not.toContain("explanation");
  });

  test("a detail response drops per-question answer fields end to end", () => {
    const detail = toPublicMockTestDetail({
      id: 3,
      title: "Midterm",
      description: "Ten questions",
      question_count: 1,
      questions: [
        {
          id: 11,
          question_text: "2 + 2?",
          is_correct_option_id: 102,
          options: [{ id: 102, option_text: "4", is_correct: true }],
        },
      ],
    });

    expect(detail.questions).toHaveLength(1);
    expect(detail.questions[0].options[0]).toEqual({ id: 102, option_text: "4" });
    expect(JSON.stringify(detail)).not.toContain("is_correct");
  });

  test("the list DTO's question_count is mapped onto the public summary", () => {
    const [test] = normalizeMockTestList({
      data: { mock_tests: [{ id: 1, title: "A", question_count: 12 }] },
    }).items;

    expect(test.question_count).toBe(12);
    expect(test).not.toHaveProperty("total_questions");
  });
});

describe("normalizeMockTestList", () => {
  test("accepts the nested data envelope", () => {
    const page = normalizeMockTestList({
      data: { mock_tests: [{ id: 1, title: "A" }], total: 1, page: 1, limit: 12 },
    });
    expect(page.items).toEqual([
      expect.objectContaining({ id: 1, title: "A", question_count: 0 }),
    ]);
    expect(page.total).toBe(1);
  });

  test("accepts a flat array response", () => {
    const page = normalizeMockTestList([{ id: 5, title: "B", question_count: 8 }]);
    expect(page.items[0].question_count).toBe(8);
    expect(page.total).toBe(1);
  });

  test("an unusable response becomes an empty page", () => {
    expect(normalizeMockTestList(null)).toEqual({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
    });
  });
});

describe("mockTestsApi superadmin endpoints", () => {
  const payload: MockTestPayload = {
    title: "Midterm",
    description: "",
    course: "BSc CS",
    year: "2082",
    duration_minutes: 30,
    is_published: true,
    questions: [
      {
        id: 11,
        question_text: "2 + 2?",
        explanation: "",
        options: [
          { id: 101, option_text: "4", is_correct: true },
          { id: 102, option_text: "5", is_correct: false },
        ],
      },
    ],
  };

  test("create posts the nested document to the admin path", async () => {
    localStorage.setItem("superadmin_token", "tok-1");
    try {
      mockedApiRequest.mockResolvedValue({ data: { id: 9, questions: [] } });

      await mockTestsApi.createMockTest(payload);

      expect(mockedApiRequest).toHaveBeenCalledWith(
        "/api/v1/admin/mock-tests",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(payload),
          authToken: "tok-1",
        }),
      );
    } finally {
      localStorage.removeItem("superadmin_token");
    }
  });

  test("update, read, list and delete all stay under the admin path", async () => {
    localStorage.setItem("superadmin_token", "tok-2");
    try {
      mockedApiRequest.mockResolvedValue({ data: { mock_tests: [] } });
      await mockTestsApi.adminListMockTests();
      expect(mockedApiRequest).toHaveBeenLastCalledWith(
        "/api/v1/admin/mock-tests",
        { authToken: "tok-2" },
      );

      mockedApiRequest.mockResolvedValue({ data: { id: 9, questions: [] } });
      await mockTestsApi.adminGetMockTest(9);
      expect(mockedApiRequest).toHaveBeenLastCalledWith(
        "/api/v1/admin/mock-tests/9",
        { authToken: "tok-2" },
      );

      await mockTestsApi.updateMockTest(9, payload);
      expect(mockedApiRequest).toHaveBeenLastCalledWith(
        "/api/v1/admin/mock-tests/9",
        expect.objectContaining({ method: "PUT", authToken: "tok-2" }),
      );

      mockedApiRequest.mockResolvedValue({ data: null });
      await mockTestsApi.deleteMockTest(9);
      expect(mockedApiRequest).toHaveBeenLastCalledWith(
        "/api/v1/admin/mock-tests/9",
        { method: "DELETE", authToken: "tok-2" },
      );
    } finally {
      localStorage.removeItem("superadmin_token");
    }
  });

  test("no admin call is made without a superadmin session", async () => {
    localStorage.removeItem("superadmin_token");
    mockedApiRequest.mockResolvedValue({ data: null });

    await mockTestsApi.deleteMockTest(9);

    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/admin/mock-tests/9",
      { method: "DELETE", authToken: undefined },
    );
  });
});
