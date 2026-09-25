"use client";

import React from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import RichTextEditor from "@/components/shared/RichTextEditor";
import {
  addOption,
  addQuestion,
  correctOptionCount,
  MAX_OPTIONS_PER_QUESTION,
  MIN_OPTIONS_PER_QUESTION,
  moveQuestion,
  questionErrorFor,
  removeOption,
  removeQuestion,
  setCorrectOption,
  setOptionText,
  setQuestionExplanation,
  setQuestionText,
  type DraftQuestionError,
  type DraftTest,
} from "./questionEditorState";

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

interface MockTestQuestionEditorProps {
  draft: DraftTest;
  onChange: (next: DraftTest) => void;
  errors: DraftQuestionError[];
}

export default function MockTestQuestionEditor({
  draft,
  onChange,
  errors,
}: MockTestQuestionEditorProps) {
  return (
    <div className="space-y-4">
      {draft.questions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-10 text-center">
          <p className="text-sm font-medium text-gray-700">
            No questions yet
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Add the first question, then give it at least{" "}
            {MIN_OPTIONS_PER_QUESTION} options and mark one correct.
          </p>
        </div>
      ) : (
        draft.questions.map((question, index) => {
          const error = questionErrorFor(
            { valid: true, questions: errors },
            question.clientId,
          );
          const correctCount = correctOptionCount(question);

          return (
            <div
              key={question.clientId}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-gray-800">
                  Question {index + 1}
                  {correctCount !== 1 && (
                    <span className="ml-2 text-xs font-medium text-amber-600">
                      needs exactly one correct option
                    </span>
                  )}
                </h4>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      onChange(moveQuestion(draft, question.clientId, -1))
                    }
                    disabled={index === 0}
                    title="Move up"
                    aria-label={`Move question ${index + 1} up`}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(moveQuestion(draft, question.clientId, 1))
                    }
                    disabled={index === draft.questions.length - 1}
                    title="Move down"
                    aria-label={`Move question ${index + 1} down`}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(removeQuestion(draft, question.clientId))
                    }
                    title="Remove question"
                    aria-label={`Remove question ${index + 1}`}
                    className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <label className="sr-only" htmlFor={`question-${question.clientId}`}>
                Question {index + 1} text
              </label>
              <input
                id={`question-${question.clientId}`}
                type="text"
                value={question.text}
                onChange={(e) =>
                  onChange(
                    setQuestionText(draft, question.clientId, e.target.value),
                  )
                }
                placeholder="e.g. Which of the following is a prime number?"
                className={inputClass}
                aria-invalid={Boolean(error?.text)}
              />
              {error?.text && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {error.text}
                </p>
              )}

              <fieldset className="mt-3">
                <legend className="mb-1.5 text-xs font-medium text-gray-600">
                  Options — select the single correct answer
                </legend>
                <ul className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <li key={option.clientId} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${question.clientId}`}
                        checked={option.isCorrect}
                        onChange={() =>
                          onChange(
                            setCorrectOption(
                              draft,
                              question.clientId,
                              option.clientId,
                            ),
                          )
                        }
                        aria-label={`Mark option ${optionIndex + 1} as correct`}
                        className="h-4 w-4 shrink-0 accent-blue-600"
                      />
                      <label
                        className="sr-only"
                        htmlFor={`option-${option.clientId}`}
                      >
                        Option {optionIndex + 1} text
                      </label>
                      <input
                        id={`option-${option.clientId}`}
                        type="text"
                        value={option.text}
                        onChange={(e) =>
                          onChange(
                            setOptionText(
                              draft,
                              question.clientId,
                              option.clientId,
                              e.target.value,
                            ),
                          )
                        }
                        placeholder={`Option ${String.fromCharCode(
                          65 + optionIndex,
                        )}`}
                        className={`${inputClass} flex-1 ${
                          option.isCorrect ? "border-emerald-400 bg-emerald-50/40" : ""
                        }`}
                      />
                      {option.isCorrect && (
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-700">
                          <Check size={13} /> Correct
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          onChange(
                            removeOption(
                              draft,
                              question.clientId,
                              option.clientId,
                            ),
                          )
                        }
                        disabled={question.options.length <= MIN_OPTIONS_PER_QUESTION}
                        title="Remove option"
                        aria-label={`Remove option ${optionIndex + 1}`}
                        className="shrink-0 rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
                {error?.options && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {error.options}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => onChange(addOption(draft, question.clientId))}
                  disabled={question.options.length >= MAX_OPTIONS_PER_QUESTION}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={13} /> Add option
                </button>
              </fieldset>

              <div className="mt-3">
                <label
                  className="mb-1 block text-xs font-medium text-gray-600"
                  htmlFor={`explanation-${question.clientId}`}
                >
                  Explanation (shown after scoring)
                </label>
                <RichTextEditor
                  value={question.explanation}
                  onChange={(value) =>
                    onChange(
                      setQuestionExplanation(
                        draft,
                        question.clientId,
                        value,
                      ),
                    )
                  }
                  placeholder="Why is the correct answer correct?"
                  minHeight={90}
                />
              </div>
            </div>
          );
        })
      )}

      <button
        type="button"
        onClick={() => onChange(addQuestion(draft))}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-50"
      >
        <Plus size={15} /> Add question
      </button>
    </div>
  );
}
