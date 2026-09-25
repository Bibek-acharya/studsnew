"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Loader2,
  LockKeyhole,
  LogIn,
  Users,
} from "lucide-react";
import RichText from "@/components/RichText";
import { useAuth } from "@/services/AuthContext";
import {
  mockTestsApi,
  type MockTestAnswer,
  type MockTestAttemptResult,
  type PublicMockTestDetail,
} from "@/services/mockTestsApi";
import MockTestQuestionCard from "./MockTestQuestionCard";
import MockTestResultView from "./MockTestResultView";

interface MockTestRunnerProps {
  testId: number;
  /** Pre-fetched on the server so the paper is readable before hydration. */
  initialTest?: PublicMockTestDetail | null;
}

function MetaChip({
  icon: Icon,
  children,
}: {
  icon: typeof Clock3;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 ring-1 ring-gray-200">
      <Icon className="h-3.5 w-3.5 text-cyan-600" aria-hidden="true" />
      {children}
    </span>
  );
}

export default function MockTestRunner({
  testId,
  initialTest,
}: MockTestRunnerProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const [test, setTest] = useState<PublicMockTestDetail | null>(
    initialTest ?? null,
  );
  const [loading, setLoading] = useState(!initialTest);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [result, setResult] = useState<MockTestAttemptResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadTest = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const detail = await mockTestsApi.getMockTest(testId);
      setTest(detail);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load this mock test",
      );
      setTest(null);
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    if (initialTest) return;
    // Read the paper straight into state; the server already rendered the first
    // paint, so this only fills in when the pre-fetch was unavailable.
    let active = true;
    mockTestsApi
      .getMockTest(testId)
      .then((detail) => {
        if (active) setTest(detail);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setLoadError(
          err instanceof Error ? err.message : "Failed to load this mock test",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [testId, initialTest]);

  const questions = useMemo(() => test?.questions ?? [], [test]);
  const answeredCount = useMemo(
    () => questions.filter((question) => selected[question.id]).length,
    [questions, selected],
  );
  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  const handleSelect = (questionId: number, optionId: number) => {
    setSelected((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!test || !user || !allAnswered) return;
    const answers: MockTestAnswer[] = questions
      .map((question) => ({
        question_id: question.id,
        option_id: selected[question.id],
      }))
      .filter((answer) => Boolean(answer.option_id));

    setSubmitting(true);
    setSubmitError(null);
    try {
      const attempt = await mockTestsApi.submitMockTest(test.id, answers);
      setResult(attempt);
      setCurrentIndex(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not submit your answers",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelected({});
    setResult(null);
    setSubmitError(null);
    setCurrentIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loginHref = `/login?redirect=${encodeURIComponent(
    pathname || `/study-resources/mock-test/${testId}`,
  )}`;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <Loader2 size={28} className="animate-spin text-brand-blue" />
        <span className="sr-only">Loading mock test</span>
      </div>
    );
  }

  if (loadError || !test) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center">
          <h1 className="text-lg font-bold text-gray-900">
            This mock test is not available
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            {loadError ?? "The test may have been unpublished or removed."}
          </p>
          <div className="mt-6 flex justify-center gap-2.5">
            <Link
              href="/study-resources/mock-test"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              All mock tests
            </Link>
            <button
              type="button"
              onClick={loadTest}
              className="rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const remaining = questions.length - answeredCount;

  return (
    <div className="min-h-[70vh] bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-4xl px-4 pb-16">
        <Link
          href="/study-resources/mock-test"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-blue transition-colors hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All mock tests
        </Link>

        {result ? (
          <MockTestResultView
            test={test}
            result={result}
            onRetake={handleRetake}
          />
        ) : (
          <>
            <header className="mb-6">
              <h1 className="text-2xl font-bold tracking-[-0.03em] text-gray-900 sm:text-3xl">
                {test.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <MetaChip icon={ClipboardList}>
                  {questions.length} questions
                </MetaChip>
                {test.duration_minutes ? (
                  <MetaChip icon={Clock3}>
                    {test.duration_minutes} min suggested
                  </MetaChip>
                ) : null}
                {test.course && (
                  <MetaChip icon={Users}>{test.course}</MetaChip>
                )}
                {test.year && (
                  <MetaChip icon={Calendar}>{test.year}</MetaChip>
                )}
              </div>
              {test.description?.trim() && (
                <div className="mt-4 text-sm leading-6 text-gray-600">
                  <RichText html={test.description} variant="sm" />
                </div>
              )}
            </header>

            <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3 text-sm font-semibold text-gray-700">
                <span>
                  Question {Math.min(currentIndex + 1, questions.length)} of{" "}
                  {questions.length}
                </span>
                <span className="text-gray-500">
                  {answeredCount}/{questions.length} answered
                </span>
              </div>
              <div
                className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={questions.length}
                aria-valuenow={answeredCount}
                aria-label="Questions answered"
              >
                <div
                  className="h-full rounded-full bg-cyan-500 transition-[width] duration-300 motion-reduce:transition-none"
                  style={{
                    width: `${
                      questions.length
                        ? (answeredCount / questions.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <ol className="mt-4 flex flex-wrap gap-1.5">
                {questions.map((question, index) => {
                  const isAnswered = Boolean(selected[question.id]);
                  const isCurrent = index === currentIndex;
                  return (
                    <li key={question.id}>
                      <button
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        aria-current={isCurrent ? "true" : undefined}
                        aria-label={`Question ${index + 1}${
                          isAnswered ? ", answered" : ", not answered"
                        }`}
                        className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors ${
                          isCurrent
                            ? "bg-brand-blue text-white"
                            : isAnswered
                              ? "bg-cyan-100 text-cyan-800 hover:bg-cyan-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {questions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
                This test has no questions yet. Please check back later.
              </div>
            ) : (
              <>
                <MockTestQuestionCard
                  question={currentQuestion}
                  index={currentIndex}
                  selectedOptionId={selected[currentQuestion.id] ?? null}
                  onSelect={(optionId) =>
                    handleSelect(currentQuestion.id, optionId)
                  }
                />

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIndex((index) => Math.max(0, index - 1))
                    }
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIndex((index) =>
                        Math.min(questions.length - 1, index + 1),
                      )
                    }
                    disabled={currentIndex >= questions.length - 1}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}

            <section
              className="mt-6 rounded-2xl border border-gray-200 bg-white p-5"
              aria-label="Submit your answers"
            >
              {user ? (
                <>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        Ready to submit?
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {remaining > 0
                          ? `${remaining} question${
                              remaining === 1 ? "" : "s"
                            } still unanswered.`
                          : "All questions answered. Your score appears right after you submit."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!allAnswered || submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting && (
                        <Loader2 size={14} className="animate-spin" />
                      )}
                      {submitting ? "Submitting..." : "Submit test"}
                    </button>
                  </div>
                  {submitError && (
                    <p
                      role="alert"
                      className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700"
                    >
                      {submitError}
                    </p>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                      <LockKeyhole
                        className="h-4 w-4 text-cyan-600"
                        aria-hidden="true"
                      />
                      Log in to submit
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Answer as many questions as you like — nothing is sent
                      until you sign in and submit, so you can explore the paper
                      first.
                    </p>
                  </div>
                  <Link
                    href={loginHref}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    Log in to submit
                  </Link>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
