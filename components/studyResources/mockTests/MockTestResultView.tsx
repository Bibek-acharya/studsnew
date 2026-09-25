"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, CircleHelp, RotateCcw, XCircle } from "lucide-react";
import type {
  MockTestAttemptResult,
  PublicMockTestDetail,
} from "@/services/mockTestsApi";

function verdictClasses(isCorrect: boolean): string {
  return isCorrect
    ? "border-emerald-200 bg-emerald-50/60"
    : "border-rose-200 bg-rose-50/60";
}

interface MockTestResultViewProps {
  test: PublicMockTestDetail;
  result: MockTestAttemptResult;
  onRetake: () => void;
}

/**
 * Scored view. The submit response reports a verdict per question, so this
 * screen shows the score and which questions were right — it never names a
 * correct option, because the browser is not told which one that is.
 */
export default function MockTestResultView({
  test,
  result,
  onRetake,
}: MockTestResultViewProps) {
  const resultsByQuestion = new Map(
    (result.results ?? []).map((item) => [item.question_id, item]),
  );
  const totalQuestions = result.total_questions ?? test.questions.length;
  const percentage = Number.isFinite(result.score_percent)
    ? Math.round(result.score_percent)
    : 0;

  return (
    <div className="space-y-5">
      <section className="relative isolate overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-[0_28px_70px_-40px_rgba(15,23,42,0.8)] sm:p-8">
        <div
          className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              Your result
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
              {result.score} of {totalQuestions} correct
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
              Review each question below to see how you did, then retake the
              test to improve the ones you missed.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold tabular-nums text-white">
                {percentage}%
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Score
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/study-resources/mock-test"
                className="inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                All tests
              </Link>
              <button
                type="button"
                onClick={onRetake}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Retake
              </button>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Question review" className="space-y-3">
        <h3 className="text-base font-bold text-gray-900">
          Question-by-question review
        </h3>
        {test.questions.map((question, index) => {
          const item = resultsByQuestion.get(question.id);
          const isCorrect = item?.is_correct === true;
          // A question the server left out of the results is not marked wrong.
          const wasGraded = item !== undefined;

          return (
            <article
              key={question.id}
              className={`rounded-2xl border p-5 ${
                wasGraded ? verdictClasses(isCorrect) : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                    !wasGraded
                      ? "bg-gray-200 text-gray-500"
                      : isCorrect
                        ? "bg-emerald-500 text-white"
                        : "bg-rose-500 text-white"
                  }`}
                >
                  {!wasGraded ? (
                    <CircleHelp className="h-4 w-4" aria-hidden="true" />
                  ) : isCorrect ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                    Question {index + 1} ·{" "}
                    {!wasGraded
                      ? "Not graded"
                      : isCorrect
                        ? "Correct"
                        : "Incorrect"}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold leading-6 text-gray-900">
                    {question.question_text}
                  </p>
                  {wasGraded && !isCorrect && (
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      This one was marked wrong. Retake the test to try it again.
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
