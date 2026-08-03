"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { institutionEntranceApi } from "@/services/institutionEntranceApi";
import ImageCropperModal from "@/components/ScholarshipProvider/common/ImageCropperModal";

interface Question {
  id: number;
  text: string;
  type: "mcq" | "descriptive";
  options: string[];
  marks: string;
}

let nextQuestionId = 1;

const EntranceCreatePage = () => {
  const router = useRouter();
  const editId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("id")
      : null;

  const [examName, setExamName] = useState("");
  const [program, setProgram] = useState("");
  const [description, setDescription] = useState("");
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [instructions, setInstructions] = useState("");
  const [heroBanner, setHeroBanner] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!editId);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [applicationLink, setApplicationLink] = useState("");
  const [noticeFile, setNoticeFile] = useState("");
  const [uploadingNotice, setUploadingNotice] = useState(false);

  const getToken = () => localStorage.getItem("institutionToken");
  const apiBase = () =>
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const base = apiBase();
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(
      `${base}/api/v1/institution/upload?folder=${folder}`,
      {
        method: "POST",
        headers: {
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: formData,
      },
    );
    if (!res.ok) throw new Error(`Upload error: ${res.status}`);
    const data = await res.json();
    const url = data?.data?.url || "";
    return url.startsWith("/") ? `${base}${url}` : url;
  };

  const handleBannerCrop = async (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], "banner.jpg", {
      type: "image/jpeg",
    });
    try {
      const url = await uploadFile(croppedFile, "institution/entrance");
      setHeroBanner(url);
    } catch (e) {
      console.error("Banner upload failed:", e);
    }
    setCropperOpen(false);
    setCropImageSrc(null);
  };

  const handleNoticeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      alert("Only PDF, DOC, or image files are allowed.");
      return;
    }
    setUploadingNotice(true);
    try {
      const ext = file.name.split(".").pop() || "pdf";
      const noticeFileObj = new File([file], `notice.${ext}`, {
        type: file.type,
      });
      const url = await uploadFile(noticeFileObj, "institution/entrance");
      setNoticeFile(url);
    } catch (e) {
      console.error("Notice upload failed:", e);
    }
    setUploadingNotice(false);
  };

  useEffect(() => {
    if (!editId) {
      setLoading(false);
      return;
    }
    institutionEntranceApi
      .getById(Number(editId))
      .then((res) => {
        setExamName(res.title || "");
        setProgram(res.program || "");
        setDescription(res.description || "");
        setExamDate(res.date?.split("T")[0] || "");
        setStartTime(res.start_time || "");
        setEndTime(res.end_time || "");
        setDuration(String(res.duration || ""));
        setTotalMarks(String(res.total_marks || ""));
        setPassingMarks(String(res.passing_marks || ""));
        setTotalSeats(String(res.total_seats || ""));
        setInstructions(res.instructions || "");
        setHeroBanner(res.hero_banner || "");
        if (Array.isArray(res.questions)) {
          setQuestions(
            res.questions.map((q: any, i: number) => ({ ...q, id: i + 1 })),
          );
          nextQuestionId = res.questions.length + 1;
        }
        setApplicationLink(res.application_link || "");
        setNoticeFile(res.notice_file || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [editId]);

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
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const updateOption = (qId: number, optIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((o, i) => (i === optIndex ? value : o)),
            }
          : q,
      ),
    );
  };

  const addOption = (qId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, ""] } : q,
      ),
    );
  };

  const removeOption = (qId: number, optIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.filter((_, i) => i !== optIndex) }
          : q,
      ),
    );
  };

  const collectData = (publish: boolean) => ({
    title: examName,
    description,
    program,
    date: examDate,
    start_time: startTime,
    end_time: endTime,
    duration: duration ? parseInt(duration) : 0,
    total_marks: totalMarks ? parseInt(totalMarks) : 0,
    passing_marks: passingMarks ? parseInt(passingMarks) : 0,
    total_seats: totalSeats ? parseInt(totalSeats) : 0,
    instructions,
    hero_banner: heroBanner,
    questions: questions.map(({ id, ...rest }) => rest),
    status: publish ? "published" : "draft",
    application_link: applicationLink,
    notice_file: noticeFile,
  });

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    try {
      const data = collectData(publish);
      if (editId) {
        await institutionEntranceApi.update(Number(editId), data);
        window.dispatchEvent(new Event("institution-data-changed"));
        if (publish)
          router.push("/institution-zone/dashboard/entrance/directory");
      } else {
        const res = await institutionEntranceApi.create(data);
        window.dispatchEvent(new Event("institution-data-changed"));
        if (res?.id) {
          router.replace(
            `/institution-zone/dashboard/entrance/create?id=${res.id}`,
          );
        }
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <SectionHeader
          title="Edit Entrance Exam"
          breadcrumbItems={[
            { label: "Dashboard", href: "/institution-zone/dashboard" },
            { label: "Entrance", href: "/institution-zone/dashboard/entrance" },
            { label: "Edit Exam" },
          ]}
        />
        <div className="flex items-center justify-center h-64 text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <SectionHeader
          title={editId ? "Edit Entrance Exam" : "Create Entrance Exam"}
          breadcrumbItems={[
            { label: "Dashboard", href: "/institution-zone/dashboard" },
            { label: "Entrance", href: "/institution-zone/dashboard/entrance" },
            { label: editId ? "Edit Exam" : "Create Exam" },
          ]}
        />
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Exam Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Exam Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="e.g. BSc CS Entrance 2026"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Program
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the entrance exam..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Exam Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 120"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Total Marks
            </label>
            <input
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              placeholder="e.g. 100"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Passing Marks
            </label>
            <input
              type="number"
              value={passingMarks}
              onChange={(e) => setPassingMarks(e.target.value)}
              placeholder="e.g. 40"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Total Seats
            </label>
            <input
              type="number"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Hero Banner
            </label>
            <div
              onClick={() => document.getElementById("bannerInput")?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer relative overflow-hidden min-h-[200px]"
            >
              {heroBanner ? (
                <div className="relative w-full h-full">
                  <img
                    src={heroBanner}
                    className="w-full h-48 object-cover"
                    alt="Banner"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs text-white/80">
                    Click anywhere to replace
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHeroBanner("");
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/95 rounded-full text-red-500 hover:bg-white shadow-md"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <span className="mt-3 text-sm font-medium text-gray-900">
                    Click to upload banner
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    Recommended: 1920x600px
                  </span>
                </>
              )}
              <input
                id="bannerInput"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    if (ev.target?.result) {
                      setCropImageSrc(ev.target.result as string);
                      setCropperOpen(true);
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Exam instructions for students..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Application Link
            </label>
            <input
              type="url"
              value={applicationLink}
              onChange={(e) => setApplicationLink(e.target.value)}
              placeholder="https://example.com/apply"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Entrance Notice (PDF, DOC, or Image)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 border-dashed rounded-lg text-sm text-gray-500 cursor-pointer hover:border-blue-400 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {uploadingNotice
                  ? "Uploading..."
                  : noticeFile
                    ? "Replace File"
                    : "Upload File"}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleNoticeUpload}
                />
              </label>
              {noticeFile && (
                <button
                  onClick={() => setNoticeFile("")}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            {noticeFile && (
              <p className="mt-1 text-xs text-green-600">
                File uploaded successfully
              </p>
            )}
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
            <Plus weight="bold" /> Add Question
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
                    onChange={(e) =>
                      updateQuestion(q.id, "text", e.target.value)
                    }
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
                      onChange={(e) =>
                        updateQuestion(q.id, "type", e.target.value)
                      }
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
                      onChange={(e) =>
                        updateQuestion(q.id, "marks", e.target.value)
                      }
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
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Draft"}
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : editId ? "Publish Changes" : "Publish Exam"}
        </button>
      </div>

      {cropperOpen && cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onCropComplete={handleBannerCrop}
          onCancel={() => {
            setCropperOpen(false);
            setCropImageSrc(null);
          }}
          aspectRatio={3.68 / 1}
        />
      )}
    </div>
  );
};

export default EntranceCreatePage;
