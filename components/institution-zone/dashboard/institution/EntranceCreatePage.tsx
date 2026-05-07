"use client";
import React, { useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";

const breadcrumb = [
  { label: "Dashboard", href: "/institution-zone/dashboard" },
  { label: "Entrance", href: "/institution-zone/dashboard/entrance" },
  { label: "Create Exam" },
];

interface Question {
  id: number;
  text: string;
  type: "mcq" | "descriptive";
  options: string[];
  marks: string;
}

let nextQuestionId = 1;

const EntranceCreatePage = () => {
  const [examName, setExamName] = useState("");
  const [program, setProgram] = useState("");
  const [description, setDescription] = useState("");
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [instructions, setInstructions] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: nextQuestionId++, text: "", type: "mcq", options: [""], marks: "" },
    ]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: number, field: keyof Question, value: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (qId: number, optIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.map((o, i) => (i === optIndex ? value : o)) }
          : q
      )
    );
  };

  const addOption = (qId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const removeOption = (qId: number, optIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.filter((_, i) => i !== optIndex) }
          : q
      )
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <SectionHeader title="Create Exam" breadcrumbItems={breadcrumb} />
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Exam Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam Name</label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="e.g. BSc CS Entrance 2026"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Program</label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            >
              <option value="">Select Program</option>
              <option value="BSc CS">BSc Computer Science</option>
              <option value="BE Civil">BE Civil Engineering</option>
              <option value="MBA">MBA</option>
              <option value="BBA">BBA</option>
              <option value="BA">BA</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the entrance exam..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 120"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Marks</label>
            <input
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              placeholder="e.g. 100"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Passing Marks</label>
            <input
              type="number"
              value={passingMarks}
              onChange={(e) => setPassingMarks(e.target.value)}
              placeholder="e.g. 40"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Exam instructions for students..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Questions</h2>
          <button
            onClick={addQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus weight="bold" />
            Add Question
          </button>
        </div>

        {questions.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            No questions added yet. Click &quot;Add Question&quot; to start.
          </p>
        )}

        <div className="space-y-6">
          {questions.map((q, qIdx) => (
            <div
              key={q.id}
              className="border border-gray-200 rounded-xl p-5 relative"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-semibold text-gray-500">
                  Question {qIdx + 1}
                </span>
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove question"
                >
                  <Trash />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                    placeholder="Enter question..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Type
                    </label>
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                    >
                      <option value="mcq">MCQ</option>
                      <option value="descriptive">Descriptive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Marks
                    </label>
                    <input
                      type="number"
                      value={q.marks}
                      onChange={(e) => updateQuestion(q.id, "marks", e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                {q.type === "mcq" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Options
                    </label>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) =>
                              updateOption(q.id, optIdx, e.target.value)
                            }
                            placeholder={`Option ${optIdx + 1}`}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                          />
                          {q.options.length > 1 && (
                            <button
                              onClick={() => removeOption(q.id, optIdx)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(q.id)}
                        className="text-sm text-blue-600 font-medium hover:text-blue-700"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end">
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
          Save Draft
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          Publish Exam
        </button>
      </div>
    </div>
  );
};

export default EntranceCreatePage;
