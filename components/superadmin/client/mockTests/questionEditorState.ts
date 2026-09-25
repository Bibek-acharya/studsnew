import type {
  AdminMockTest,
  AdminMockTestOption,
  AdminMockTestQuestion,
  MockTestPayload,
} from "@/services/mockTestsApi";

/**
 * Draft shapes for the mock-test editor. Client ids are string keys so React
 * lists stay stable while the user reorders, adds and removes options.
 */

export interface DraftOption {
  clientId: string;
  id?: number;
  text: string;
  isCorrect: boolean;
}

export interface DraftQuestion {
  clientId: string;
  id?: number;
  text: string;
  explanation: string;
  options: DraftOption[];
}

export interface DraftTest {
  id?: number;
  title: string;
  description: string;
  course: string;
  year: string;
  duration_minutes: number | null;
  is_published: boolean;
  questions: DraftQuestion[];
}

let idCounter = 0;
/** Monotonic ids; only unique within one editor session, which is all we need. */
function nextClientId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export const MIN_OPTIONS_PER_QUESTION = 2;
export const MAX_OPTIONS_PER_QUESTION = 6;

export function createDraftOption(
  overrides: Partial<DraftOption> = {},
): DraftOption {
  return {
    clientId: nextClientId("option"),
    text: "",
    isCorrect: false,
    ...overrides,
  };
}

export function createDraftQuestion(
  overrides: Partial<DraftQuestion> = {},
): DraftQuestion {
  return {
    clientId: nextClientId("question"),
    text: "",
    explanation: "",
    // Start with two blank options and mark the first correct so a question is
    // never born invalid.
    options: [createDraftOption({ isCorrect: true }), createDraftOption()],
    ...overrides,
  };
}

export function createDraftTest(
  overrides: Partial<DraftTest> = {},
): DraftTest {
  return {
    title: "",
    description: "",
    course: "",
    year: "",
    duration_minutes: null,
    is_published: false,
    questions: [],
    ...overrides,
  };
}

/** Load an existing test into the editor, preserving server ids. */
export function draftFromAdminTest(test: AdminMockTest): DraftTest {
  return {
    id: test.id,
    title: test.title ?? "",
    description: test.description ?? "",
    course: test.course ?? "",
    year: test.year ?? "",
    duration_minutes:
      test.duration_minutes === null || test.duration_minutes === undefined
        ? null
        : Number(test.duration_minutes),
    is_published: test.is_published !== false,
    questions: (test.questions ?? []).map((question) => ({
      clientId: nextClientId("question"),
      id: question.id,
      text: question.question_text ?? "",
      explanation: question.explanation ?? "",
      options: (question.options ?? []).map((option) =>
        createDraftOption({
          id: option.id,
          text: option.option_text ?? "",
          isCorrect: option.is_correct === true,
        }),
      ),
    })),
  };
}

export interface DraftQuestionError {
  clientId: string;
  /** Field-level messages shown under the offending input. */
  text?: string;
  options?: string;
}

export interface DraftValidation {
  valid: boolean;
  title?: string;
  duration?: string;
  questions: DraftQuestionError[];
}

export function correctOptionCount(question: DraftQuestion): number {
  return question.options.filter((option) => option.isCorrect).length;
}

/** The invariant the whole editor exists to protect. */
export function isQuestionComplete(question: DraftQuestion): boolean {
  const filledOptions = question.options.filter(
    (option) => option.text.trim().length > 0,
  );
  return (
    question.text.trim().length > 0 &&
    filledOptions.length >= MIN_OPTIONS_PER_QUESTION &&
    correctOptionCount(question) === 1
  );
}

export function validateDraftTest(draft: DraftTest): DraftValidation {
  const questions: DraftQuestionError[] = [];
  let title: string | undefined;
  let duration: string | undefined;

  if (!draft.title.trim()) title = "Title is required.";

  if (draft.duration_minutes !== null) {
    const minutes = Number(draft.duration_minutes);
    if (!Number.isFinite(minutes) || minutes < 0 || minutes > 600) {
      duration = "Use a value between 0 and 600 minutes.";
    }
  }

  draft.questions.forEach((question) => {
    const error: DraftQuestionError = { clientId: question.clientId };
    if (!question.text.trim()) error.text = "Question text is required.";

    const filled = question.options.filter(
      (option) => option.text.trim().length > 0,
    );
    const correct = correctOptionCount(question);

    if (filled.length < MIN_OPTIONS_PER_QUESTION) {
      error.options = `Provide at least ${MIN_OPTIONS_PER_QUESTION} options.`;
    } else if (correct !== 1) {
      error.options =
        correct === 0
          ? "Mark exactly one option as the correct answer."
          : "Only one option can be correct — clear the others.";
    }

    if (error.text || error.options) questions.push(error);
  });

  return {
    valid: !title && !duration && questions.length === 0,
    title,
    duration,
    questions,
  };
}

export function questionErrorFor(
  validation: DraftValidation,
  clientId: string,
): DraftQuestionError | undefined {
  return validation.questions.find((error) => error.clientId === clientId);
}

// ─── Immutable editor operations ────────────────────────────────────────────

function mapQuestion(
  draft: DraftTest,
  clientId: string,
  update: (question: DraftQuestion) => DraftQuestion,
): DraftTest {
  return {
    ...draft,
    questions: draft.questions.map((question) =>
      question.clientId === clientId ? update(question) : question,
    ),
  };
}

export function addQuestion(draft: DraftTest): DraftTest {
  return { ...draft, questions: [...draft.questions, createDraftQuestion()] };
}

export function removeQuestion(
  draft: DraftTest,
  clientId: string,
): DraftTest {
  return {
    ...draft,
    questions: draft.questions.filter(
      (question) => question.clientId !== clientId,
    ),
  };
}

/** Move a question by `offset` steps; out-of-range moves are no-ops. */
export function moveQuestion(
  draft: DraftTest,
  clientId: string,
  offset: number,
): DraftTest {
  const index = draft.questions.findIndex(
    (question) => question.clientId === clientId,
  );
  if (index === -1) return draft;
  const target = index + offset;
  if (target < 0 || target >= draft.questions.length) return draft;
  const questions = [...draft.questions];
  const [moved] = questions.splice(index, 1);
  questions.splice(target, 0, moved);
  return { ...draft, questions };
}

export function setQuestionText(
  draft: DraftTest,
  clientId: string,
  text: string,
): DraftTest {
  return mapQuestion(draft, clientId, (question) => ({ ...question, text }));
}

export function setQuestionExplanation(
  draft: DraftTest,
  clientId: string,
  explanation: string,
): DraftTest {
  return mapQuestion(draft, clientId, (question) => ({
    ...question,
    explanation,
  }));
}

export function addOption(draft: DraftTest, clientId: string): DraftTest {
  return mapQuestion(draft, clientId, (question) => {
    if (question.options.length >= MAX_OPTIONS_PER_QUESTION) return question;
    return {
      ...question,
      options: [...question.options, createDraftOption()],
    };
  });
}

export function removeOption(
  draft: DraftTest,
  clientId: string,
  optionClientId: string,
): DraftTest {
  return mapQuestion(draft, clientId, (question) => {
    if (question.options.length <= MIN_OPTIONS_PER_QUESTION) return question;
    const options = question.options.filter(
      (option) => option.clientId !== optionClientId,
    );
    if (options.length === question.options.length) return question;
    // Never leave a question without a correct answer.
    if (!options.some((option) => option.isCorrect)) {
      options[0] = { ...options[0], isCorrect: true };
    }
    return { ...question, options };
  });
}

export function setOptionText(
  draft: DraftTest,
  clientId: string,
  optionClientId: string,
  text: string,
): DraftTest {
  return mapQuestion(draft, clientId, (question) => ({
    ...question,
    options: question.options.map((option) =>
      option.clientId === optionClientId ? { ...option, text } : option,
    ),
  }));
}

/**
 * Selecting an option makes it the single correct one; selecting the current
 * correct option again clears it, so a question can be temporarily invalid but
 * never holds two correct answers.
 */
export function setCorrectOption(
  draft: DraftTest,
  clientId: string,
  optionClientId: string,
): DraftTest {
  return mapQuestion(draft, clientId, (question) => {
    const target = question.options.find(
      (option) => option.clientId === optionClientId,
    );
    if (!target) return question;
    const isClearing = target.isCorrect;
    return {
      ...question,
      options: question.options.map((option) => ({
        ...option,
        isCorrect: isClearing ? false : option.clientId === optionClientId,
      })),
    };
  });
}

export function setPublished(draft: DraftTest, isPublished: boolean): DraftTest {
  return { ...draft, is_published: isPublished };
}

/** Nested request body. Ids ride along so the backend can update in place. */
export function toPayload(draft: DraftTest): MockTestPayload {
  return {
    title: draft.title.trim(),
    description: draft.description,
    course: draft.course.trim(),
    year: draft.year.trim(),
    duration_minutes: draft.duration_minutes,
    is_published: draft.is_published,
    questions: draft.questions.map<AdminMockTestQuestion>((question) => ({
      id: question.id,
      question_text: question.text.trim(),
      explanation: question.explanation,
      options: question.options.map<AdminMockTestOption>((option) => ({
        id: option.id,
        option_text: option.text.trim(),
        is_correct: option.isCorrect,
      })),
    })),
  };
}
