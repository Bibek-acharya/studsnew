import type { AdminMockTest } from "@/services/mockTestsApi";
import {
  addOption,
  addQuestion,
  correctOptionCount,
  createDraftQuestion,
  createDraftTest,
  draftFromAdminTest,
  isQuestionComplete,
  MAX_OPTIONS_PER_QUESTION,
  MIN_OPTIONS_PER_QUESTION,
  moveQuestion,
  questionErrorFor,
  removeOption,
  removeQuestion,
  setCorrectOption,
  setOptionText,
  setPublished,
  setQuestionExplanation,
  setQuestionText,
  toPayload,
  validateDraftTest,
  type DraftTest,
} from "@/components/superadmin/client/mockTests/questionEditorState";

/** A ready-to-save draft: one question, four options, one correct. */
function validDraft(overrides: Partial<DraftTest> = {}): DraftTest {
  let draft = addQuestion(createDraftTest({ title: "Midterm", ...overrides }));
  const question = draft.questions[0];
  draft = setQuestionText(draft, question.clientId, "2 + 2 = ?");
  draft = addOption(draft, question.clientId);
  draft = addOption(draft, question.clientId);
  const [first, , third, fourth] = draft.questions[0].options;
  draft = setOptionText(draft, question.clientId, first.clientId, "3");
  draft = setOptionText(draft, question.clientId, third.clientId, "4");
  draft = setOptionText(draft, question.clientId, fourth.clientId, "5");
  draft = setCorrectOption(draft, question.clientId, third.clientId);
  return draft;
}

describe("draft construction", () => {
  test("a new question starts with two options and exactly one correct", () => {
    const question = createDraftQuestion();
    expect(question.options).toHaveLength(MIN_OPTIONS_PER_QUESTION);
    expect(correctOptionCount(question)).toBe(1);
    expect(isQuestionComplete(question)).toBe(false);
  });

  test("a new test is unpublished and empty", () => {
    const draft = createDraftTest();
    expect(draft.is_published).toBe(false);
    expect(draft.questions).toHaveLength(0);
  });

  test("an existing test loads with its ids and answer key preserved", () => {
    const admin: AdminMockTest = {
      id: 4,
      title: "Final",
      description: "All units",
      course: "BSc CS",
      year: "2082",
      duration_minutes: 45,
      is_published: true,
      attempts: 12,
      question_count: 1,
      created_at: "2026-01-01T00:00:00Z",
      questions: [
        {
          id: 11,
          question_text: "2 + 2?",
          explanation: "Because",
          options: [
            { id: 101, option_text: "3", is_correct: false },
            { id: 102, option_text: "4", is_correct: true },
          ],
        },
      ],
    };

    const draft = draftFromAdminTest(admin);

    expect(draft.id).toBe(4);
    expect(draft.is_published).toBe(true);
    expect(draft.duration_minutes).toBe(45);
    expect(draft.questions[0].id).toBe(11);
    expect(draft.questions[0].options.map((o) => o.id)).toEqual([101, 102]);
    expect(draft.questions[0].options[1].isCorrect).toBe(true);
  });
});

describe("exactly-one-correct-option invariant", () => {
  test("choosing another option moves the answer instead of adding one", () => {
    const draft = validDraft();
    const question = draft.questions[0];
    const last = question.options[question.options.length - 1];

    const next = setCorrectOption(draft, question.clientId, last.clientId);

    expect(correctOptionCount(next.questions[0])).toBe(1);
    expect(
      next.questions[0].options.find((option) => option.isCorrect)?.clientId,
    ).toBe(last.clientId);
  });

  test("re-picking the current correct option clears it, leaving zero", () => {
    const draft = validDraft();
    const question = draft.questions[0];
    const correct = question.options.find((option) => option.isCorrect)!;

    const next = setCorrectOption(draft, question.clientId, correct.clientId);

    expect(correctOptionCount(next.questions[0])).toBe(0);
    expect(validateDraftTest(next).questions[0].options).toBe(
      "Mark exactly one option as the correct answer.",
    );
  });

  test("removing the correct option promotes another one", () => {
    const draft = validDraft();
    const question = draft.questions[0];
    const correct = question.options.find((option) => option.isCorrect)!;

    const next = removeOption(draft, question.clientId, correct.clientId);

    expect(correctOptionCount(next.questions[0])).toBe(1);
  });

  test("the last two options can never be removed", () => {
    const draft = validDraft();
    const question = draft.questions[0];

    let current = draft;
    question.options.forEach((option) => {
      current = removeOption(current, question.clientId, option.clientId);
    });

    expect(current.questions[0].options).toHaveLength(
      MIN_OPTIONS_PER_QUESTION,
    );
  });

  test("options cannot grow past the cap", () => {
    let draft = createDraftTest();
    draft = addQuestion(draft);
    const question = draft.questions[0];
    for (let i = 0; i < 10; i += 1) {
      draft = addOption(draft, question.clientId);
    }
    expect(draft.questions[0].options).toHaveLength(MAX_OPTIONS_PER_QUESTION);
  });
});

describe("question ordering and removal", () => {
  test("moveQuestion reorders within bounds and ignores out-of-range moves", () => {
    const first = addQuestion(createDraftTest());
    const draft = addQuestion(addQuestion(first));
    const ids = draft.questions.map((question) => question.clientId);

    const moved = moveQuestion(draft, ids[2], -1);
    expect(moved.questions.map((question) => question.clientId)).toEqual([
      ids[0],
      ids[2],
      ids[1],
    ]);

    expect(
      moveQuestion(draft, ids[0], -1).questions.map((q) => q.clientId),
    ).toEqual(ids);
    expect(
      moveQuestion(draft, ids[2], 1).questions.map((q) => q.clientId),
    ).toEqual(ids);
  });

  test("removing a question leaves the rest in order", () => {
    const draft = addQuestion(addQuestion(createDraftTest()));
    const ids = draft.questions.map((question) => question.clientId);

    const next = removeQuestion(draft, ids[0]);

    expect(next.questions.map((question) => question.clientId)).toEqual([
      ids[1],
    ]);
  });
});

describe("validation", () => {
  test("a complete draft passes", () => {
    const validation = validateDraftTest(validDraft());
    expect(validation.valid).toBe(true);
    expect(validation.questions).toHaveLength(0);
  });

  test("title, question text, and option count are all required", () => {
    const draft = addQuestion(createDraftTest());
    const validation = validateDraftTest(draft);

    expect(validation.title).toBe("Title is required.");
    expect(validation.questions[0].text).toBe("Question text is required.");
    expect(validation.questions[0].options).toBe(
      `Provide at least ${MIN_OPTIONS_PER_QUESTION} options.`,
    );
    expect(questionErrorFor(validation, draft.questions[0].clientId)).toEqual(
      validation.questions[0],
    );
  });

  test("a question with two correct options is rejected with a clear message", () => {
    const draft = validDraft();
    const question = draft.questions[0];
    // Force the illegal state directly, bypassing the helper.
    const broken = {
      ...draft,
      questions: [
        {
          ...question,
          options: question.options.map((option, index) => ({
            ...option,
            isCorrect: index < 2,
          })),
        },
      ],
    };

    expect(validateDraftTest(broken).questions[0].options).toBe(
      "Only one option can be correct — clear the others.",
    );
  });

  test("blank option text does not count toward the minimum", () => {
    const draft = validDraft();
    const question = draft.questions[0];
    // Leave only the first option filled: four rows, one real answer.
    const next = question.options
      .slice(1)
      .reduce(
        (acc, option) =>
          setOptionText(acc, question.clientId, option.clientId, "   "),
        draft,
      );

    expect(
      validateDraftTest(next).questions.find(
        (error) => error.clientId === question.clientId,
      )?.options,
    ).toBe(`Provide at least ${MIN_OPTIONS_PER_QUESTION} options.`);
  });

  test("an out-of-range duration is rejected", () => {
    expect(
      validateDraftTest(createDraftTest({ title: "x", duration_minutes: 900 }))
        .duration,
    ).toBe("Use a value between 0 and 600 minutes.");
  });
});

describe("payload mapping", () => {
  test("the draft becomes a trimmed nested document with ids intact", () => {
    const draft = validDraft({ course: " BSc CS ", year: " 2082 " });
    const questionId = draft.questions[0].clientId;
    const withExplanation = setQuestionExplanation(
      draft,
      questionId,
      "Because 2 plus 2 is 4",
    );
    const published = setPublished(withExplanation, true);

    const payload = toPayload(published);

    expect(payload.title).toBe("Midterm");
    expect(payload.course).toBe("BSc CS");
    expect(payload.year).toBe("2082");
    expect(payload.is_published).toBe(true);
    expect(payload.questions).toHaveLength(1);
    expect(payload.questions[0].question_text).toBe("2 + 2 = ?");
    expect(payload.questions[0].explanation).toBe("Because 2 plus 2 is 4");
    expect(
      payload.questions[0].options.filter((option) => option.is_correct),
    ).toHaveLength(1);
    expect(payload.questions[0].options[2]).toEqual({
      option_text: "4",
      is_correct: true,
    });
  });

  test("an id-less question is sent without an id so the backend creates it", () => {
    const draft = addQuestion(createDraftTest());
    expect(toPayload(draft).questions[0].id).toBeUndefined();
    expect(toPayload(draft).questions[0].options[0].id).toBeUndefined();
  });
});
