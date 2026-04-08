"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  Info,
  AlignLeft,
  Banknote,
  BookOpen,
  GraduationCap,
  FileText,
  Building2,
  Presentation,
  CircleHelp,
  IdCard,
  Upload,
  X,
  Camera,
  Image as ImageIcon,
  Trash2,
  Save,
  ArrowLeft,
  CheckCircle2,
  Plus,
} from "lucide-react";

type StudyLevel = "+2" | "Bachelor" | "Master";

interface CurriculumItem {
  id: number;
  sem: string;
  sub: string;
}
interface ScholarshipItem {
  id: number;
  type: string;
  elig: string;
  ben: string;
}
interface PdfItem {
  id: number;
  name: string;
  link: string;
}
interface FacilityItem {
  id: number;
  head: string;
  sub: string;
}
interface FacultyItem {
  id: number;
  name: string;
  edu: string;
  exp: string;
  photo: string;
}
interface FaqItem {
  id: number;
  q: string;
  a: string;
}

const programMap: Record<StudyLevel, string[]> = {
  "+2": ["Science", "Management", "Humanities", "Law"],
  Bachelor: [
    "BIM",
    "BBA",
    "BCA",
    "BSc.CSIT",
    "BBM",
    "BBS",
    "BA",
    "BEd",
    "BE Civil",
    "BE Computer",
  ],
  Master: ["MBA", "MBS", "MSc.IT", "MA"],
};

const cardClass = "bg-white p-6 rounded-xl shadow-sm border border-gray-100";
const inputClass =
  "w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white";
const textareaClass =
  "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";
const addButtonClass =
  "text-sm bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition shadow-sm font-black uppercase italic";
const removeButtonClass =
  "text-red-400 hover:text-red-600 transition p-2 bg-white rounded shadow-sm border border-gray-200";

const sectionTitle = (icon: React.ReactNode, title: string) => (
  <h2 className="text-xl font-black mb-5 text-gray-800 border-b border-gray-200 pb-3 flex items-center uppercase italic">
    <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
      {icon}
    </span>
    {title}
  </h2>
);

interface AdmissionManagePageProps {
  onBack?: () => void;
  programId?: string | null;
}

const AdmissionManagePage: React.FC<AdmissionManagePageProps> = ({
  onBack,
  programId,
}) => {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const contactInputRef = useRef<HTMLInputElement>(null);

  const [coverPhoto, setCoverPhoto] = useState("");
  const [studyLevel, setStudyLevel] = useState<StudyLevel | "">("");
  const [programName, setProgramName] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [affiliation, setAffiliation] = useState("");
  const [duration, setDuration] = useState("");
  const [applyLink, setApplyLink] = useState("");

  const [overview, setOverview] = useState("");
  const [objectives, setObjectives] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [admissionProcess, setAdmissionProcess] = useState("");
  const [whyUs, setWhyUs] = useState("");

  const [feeTuition, setFeeTuition] = useState("");
  const [feeLab, setFeeLab] = useState("");
  const [feeExam, setFeeExam] = useState("");

  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [faculty, setFaculty] = useState<FacultyItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  const [contactPhoto, setContactPhoto] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPosition, setContactPosition] = useState("");
  const [contactDetails, setContactDetails] = useState("");

  const [saved, setSaved] = useState(false);

  const totalFee = useMemo(() => {
    const tuition = Number.parseFloat(feeTuition) || 0;
    const lab = Number.parseFloat(feeLab) || 0;
    const exam = Number.parseFloat(feeExam) || 0;
    return tuition + lab + exam;
  }, [feeExam, feeLab, feeTuition]);

  const availablePrograms = studyLevel ? programMap[studyLevel] : [];

  const handleSingleImage = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setter(URL.createObjectURL(file));
  };

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-gray-50 p-6 lg:p-8 font-bold italic">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 group">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-500 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase italic">
                {programId ? "Edit Program Details" : "Create New Program"}
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Configuring academic node #{programId || "NEW"}
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
          >
            <Save size={18} /> Save Program
          </button>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium shadow-sm flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" /> Program details saved
            successfully.
          </div>
        )}

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Section 1: Basic Info */}
          <div className={cardClass}>
            {sectionTitle(<Info className="w-5 h-5" />, "Basic Information")}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Cover Photo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-blue-500 transition-colors bg-slate-50 relative group overflow-hidden">
                  {!coverPhoto ? (
                    <div className="space-y-1 text-center relative z-10">
                      <Upload className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      <div className="flex text-sm text-slate-600 justify-center flex-wrap">
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="font-bold text-blue-600 hover:text-blue-500"
                        >
                          Upload a file
                        </button>
                        <p className="pl-1 text-slate-400">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  ) : (
                    <div className="relative w-full h-64">
                      <img
                        src={coverPhoto}
                        alt="Cover"
                        className="absolute inset-0 w-full h-full object-cover z-0 rounded-lg"
                      />
                      <button
                        onClick={() => setCoverPhoto("")}
                        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-white transition-all shadow-sm z-10"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={coverInputRef}
                    className="hidden"
                    onChange={(e) => handleSingleImage(e, setCoverPhoto)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Level
                </label>
                <select
                  value={studyLevel}
                  onChange={(e) => {
                    setStudyLevel(e.target.value as StudyLevel);
                    setProgramName("");
                  }}
                  className={inputClass}
                >
                  <option value="">Select Level</option>
                  <option value="+2">+2 (Secondary)</option>
                  <option value="Bachelor">Bachelor Degree</option>
                  <option value="Master">Master Degree</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Program Name
                </label>
                <select
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  disabled={!studyLevel}
                  className={inputClass}
                >
                  <option value="">Select Program</option>
                  {availablePrograms.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide text-indigo-600">
                  Admission Status
                </label>
                <div className="flex gap-4">
                  {["Ongoing", "Completed", "Upcoming"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`px-4 py-2 text-[10px] rounded-xl font-black uppercase transition-all flex-1 ${status === s ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "bg-white border border-slate-200 text-slate-400"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  University Affiliation
                </label>
                <input
                  type="text"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  placeholder="e.g. Tribhuvan University"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 4 Years"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Direct Apply Link
                </label>
                <input
                  type="url"
                  value={applyLink}
                  onChange={(e) => setApplyLink(e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Narrative */}
          <div className={cardClass}>
            {sectionTitle(
              <AlignLeft className="w-5 h-5" />,
              "Program Narrative",
            )}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Overview
                </label>
                <textarea
                  rows={4}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  className={textareaClass}
                  placeholder="Describe the program vision..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                    Program Objectives
                  </label>
                  <textarea
                    rows={3}
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                    Eligibility Criteria
                  </label>
                  <textarea
                    rows={3}
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    className={textareaClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Fee Structure */}
          <div className={cardClass}>
            {sectionTitle(<Banknote className="w-5 h-5" />, "Fee Transparency")}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                  Tuition Fee
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold italic">
                    Rs.
                  </span>
                  <input
                    type="number"
                    value={feeTuition}
                    onChange={(e) => setFeeTuition(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                  Lab & Library
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold italic">
                    Rs.
                  </span>
                  <input
                    type="number"
                    value={feeLab}
                    onChange={(e) => setFeeLab(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                  Examination
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold italic">
                    Rs.
                  </span>
                  <input
                    type="number"
                    value={feeExam}
                    onChange={(e) => setFeeExam(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase text-indigo-400">
                  Total Program Cost
                </span>
                <span className="text-xl font-black text-indigo-700 italic">
                  Rs. {totalFee.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Downloads & Resources */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-5 border-b border-gray-200 pb-3">
              <h2 className="text-xl font-black text-gray-800 uppercase italic flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                  <FileText className="w-5 h-5" />
                </span>
                Downloads & PDFs
              </h2>
              <button
                type="button"
                onClick={() =>
                  setPdfs([...pdfs, { id: Date.now(), name: "", link: "" }])
                }
                className={addButtonClass}
              >
                <Plus size={16} className="mr-1" /> Add Doc
              </button>
            </div>
            <div className="space-y-4">
              {pdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl group border border-transparent hover:border-slate-200 transition-all"
                >
                  <div className="flex-1">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      Document Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Syllabus 2024"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      External/Storage Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPdfs(pdfs.filter((p) => p.id !== pdf.id))}
                    className={removeButtonClass}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Faculty */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-5 border-b border-gray-200 pb-3">
              <h2 className="text-xl font-black text-gray-800 uppercase italic flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                  <Presentation className="w-5 h-5" />
                </span>
                Program Faculty
              </h2>
              <button
                type="button"
                onClick={() =>
                  setFaculty([
                    ...faculty,
                    { id: Date.now(), name: "", edu: "", exp: "", photo: "" },
                  ])
                }
                className={addButtonClass}
              >
                <Plus size={16} className="mr-1" /> Add Mentor
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faculty.map((f) => (
                <div
                  key={f.id}
                  className="relative bg-white border border-slate-200 p-5 rounded-2xl shadow-sm group hover:shadow-md transition-all"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setFaculty(faculty.filter((item) => item.id !== f.id))
                    }
                    className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={14} />
                  </button>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-xl flex-shrink-0 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                      <ImageIcon size={24} />
                    </div>
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full text-sm font-black uppercase italic border-b border-slate-100 focus:border-blue-500 outline-none pb-1"
                      />
                      <input
                        type="text"
                        placeholder="Education (e.g. PhD, MIT)"
                        className="w-full text-xs font-bold text-slate-400 border-b border-slate-100 focus:border-blue-500 outline-none pb-1"
                      />
                      <input
                        type="text"
                        placeholder="Experience (e.g. 10+ Years)"
                        className="w-full text-xs font-bold text-slate-400 border-b border-slate-100 focus:border-blue-500 outline-none pb-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Local Contact */}
          <div className={cardClass}>
            {sectionTitle(
              <IdCard className="w-5 h-5" />,
              "Dedicated Contact Person",
            )}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-32 h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 group relative overflow-hidden cursor-pointer hover:border-blue-500 transition-all">
                {!contactPhoto ? (
                  <>
                    <Camera size={24} className="mb-1" />
                    <span className="text-[10px] font-black uppercase">
                      Photo
                    </span>
                  </>
                ) : (
                  <img
                    src={contactPhoto}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="CM"
                  />
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleSingleImage(e, setContactPhoto)}
                />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Er. Sudesh Giri"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                    Position / Office
                  </label>
                  <input
                    type="text"
                    value={contactPosition}
                    onChange={(e) => setContactPosition(e.target.value)}
                    placeholder="e.g. Program Coordinator"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                    Email / Ext.
                  </label>
                  <input
                    type="text"
                    value={contactDetails}
                    onChange={(e) => setContactDetails(e.target.value)}
                    placeholder="example@ncit.edu.np"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-12 items-center">
            <button
              type="button"
              onClick={onBack}
              title="Discard Draft"
              className="px-6 py-2.5 text-rose-500 font-black uppercase text-[10px] hover:bg-rose-50 rounded-xl transition-all mr-4 italic"
            >
              Discard Draft
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-10 py-3 bg-indigo-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 italic"
            >
              Save & Publish Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionManagePage;
