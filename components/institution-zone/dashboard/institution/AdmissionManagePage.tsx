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
  "text-sm bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition shadow-sm font-medium";
const removeButtonClass =
  "text-red-400 hover:text-red-600 transition p-2 bg-white rounded shadow-sm border border-gray-200";

const sectionTitle = (icon: React.ReactNode, title: string) => (
  <h2 className="text-xl font-semibold mb-5 text-gray-800 border-b border-gray-200 pb-3 flex items-center">
    <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
      {icon}
    </span>
    {title}
  </h2>
);

const AdmissionManagePage: React.FC = () => {
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

  const nextId = <T extends { id: number }>(items: T[]) =>
    Math.max(0, ...items.map((item) => item.id)) + 1;

  const handleSingleImage = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setter(URL.createObjectURL(file));
  };

  const clearFileInput = (
    input: HTMLInputElement | null,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (input) input.value = "";
    setter("");
  };

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-gray-50 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium shadow-sm">
            Program details saved successfully.
          </div>
        )}

        <form
          className="space-y-8"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className={cardClass}>
            {sectionTitle(<Info className="w-5 h-5" />, "Basic Information")}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Photo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors bg-gray-50 relative group overflow-hidden">
                  {!coverPhoto && (
                    <div className="space-y-1 text-center relative z-10">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <div className="flex text-sm text-gray-600 justify-center flex-wrap">
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          Upload a file
                        </button>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                  {coverPhoto && (
                    <img
                      src={coverPhoto}
                      alt="Cover preview"
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      handleSingleImage(event, setCoverPhoto)
                    }
                  />
                  {coverPhoto && (
                    <button
                      type="button"
                      className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-md z-20 transition"
                      onClick={() =>
                        clearFileInput(coverInputRef.current, setCoverPhoto)
                      }
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Study Level
                </label>
                <select
                  value={studyLevel}
                  onChange={(event) => {
                    const nextLevel = event.target.value as StudyLevel | "";
                    setStudyLevel(nextLevel);
                    setProgramName("");
                  }}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select Level
                  </option>
                  <option value="+2">+2 Level</option>
                  <option value="Bachelor">Bachelor Level</option>
                  <option value="Master">Master Level</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name
                </label>
                <select
                  value={programName}
                  onChange={(event) => setProgramName(event.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    {studyLevel ? "Select Program" : "Select Study Level First"}
                  </option>
                  {availablePrograms.map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className={inputClass}
                >
                  <option value="Ongoing">Ongoing (Admissions Open)</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliation
                </label>
                <input
                  type="text"
                  value={affiliation}
                  onChange={(event) => setAffiliation(event.target.value)}
                  placeholder="e.g., Tribhuvan University, NEB"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  placeholder="e.g., 4 Years (8 Semesters)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apply Now Link
                </label>
                <input
                  type="url"
                  value={applyLink}
                  onChange={(event) => setApplyLink(event.target.value)}
                  placeholder="e.g., https://apply.college.edu.np"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            {sectionTitle(<AlignLeft className="w-5 h-5" />, "Program Content")}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overview / Summary
                </label>
                <textarea
                  rows={3}
                  value={overview}
                  onChange={(event) => setOverview(event.target.value)}
                  placeholder="Enter a brief introduction and summary of the course..."
                  className={textareaClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objectives
                </label>
                <textarea
                  rows={3}
                  value={objectives}
                  onChange={(event) => setObjectives(event.target.value)}
                  placeholder="List the primary objectives of this program..."
                  className={textareaClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eligibility Criteria
                </label>
                <textarea
                  rows={2}
                  value={eligibility}
                  onChange={(event) => setEligibility(event.target.value)}
                  placeholder="e.g., Minimum D+ grade in grade 11 and 12..."
                  className={textareaClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admission Process & Required Documents
                </label>
                <textarea
                  rows={3}
                  value={admissionProcess}
                  onChange={(event) => setAdmissionProcess(event.target.value)}
                  placeholder="Explain the step-by-step admission process and list required documents..."
                  className={textareaClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why Choose Us for this program?
                </label>
                <textarea
                  rows={3}
                  value={whyUs}
                  onChange={(event) => setWhyUs(event.target.value)}
                  placeholder="Highlight key features, labs, placement opportunities, etc..."
                  className={textareaClass}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            {sectionTitle(<Banknote className="w-5 h-5" />, "Fees Structure")}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tuition Fee
                </label>
                <input
                  type="number"
                  value={feeTuition}
                  onChange={(event) => setFeeTuition(event.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lab & Resources Fee
                </label>
                <input
                  type="number"
                  value={feeLab}
                  onChange={(event) => setFeeLab(event.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Examination Fee
                </label>
                <input
                  type="number"
                  value={feeExam}
                  onChange={(event) => setFeeExam(event.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Total Fee (Auto-calculated)
                </label>
                <input
                  type="number"
                  value={totalFee}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 font-bold text-blue-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={cardClass}>
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <BookOpen className="text-blue-500 w-6 mr-2" />
                  Curriculum
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setCurriculum((prev) => [
                      ...prev,
                      { id: nextId(prev), sem: "", sub: "" },
                    ])
                  }
                  className={addButtonClass}
                >
                  + Add Subject
                </button>
              </div>
              <div className="space-y-3">
                {curriculum.length === 0 ? (
                  <p className="text-gray-400 text-sm italic text-center py-4 border border-dashed border-gray-200 rounded-lg">
                    No curriculum subjects added yet.
                  </p>
                ) : (
                  curriculum.map((item) => (
                    <div
                      key={item.id}
                      className="flex space-x-3 items-center bg-gray-50 p-2 rounded-lg border border-gray-200"
                    >
                      <input
                        type="text"
                        value={item.sem}
                        onChange={(event) =>
                          setCurriculum((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, sem: event.target.value }
                                : row,
                            ),
                          )
                        }
                        placeholder="Sem/Year (e.g. 1st Sem)"
                        className="w-1/3 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                      />
                      <input
                        type="text"
                        value={item.sub}
                        onChange={(event) =>
                          setCurriculum((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, sub: event.target.value }
                                : row,
                            ),
                          )
                        }
                        placeholder="Subjects (comma separated)"
                        className="w-2/3 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setCurriculum((prev) =>
                            prev.filter((row) => row.id !== item.id),
                          )
                        }
                        className={removeButtonClass}
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <GraduationCap className="text-blue-500 w-6 mr-2" />
                  Scholarships
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setScholarships((prev) => [
                      ...prev,
                      { id: nextId(prev), type: "", elig: "", ben: "" },
                    ])
                  }
                  className={addButtonClass}
                >
                  + Add Scholarship
                </button>
              </div>
              <div className="space-y-3">
                {scholarships.length === 0 ? (
                  <p className="text-gray-400 text-sm italic text-center py-4 border border-dashed border-gray-200 rounded-lg">
                    No scholarships added yet.
                  </p>
                ) : (
                  scholarships.map((item) => (
                    <div
                      key={item.id}
                      className="flex space-x-3 items-center bg-gray-50 p-2 rounded-lg border border-gray-200"
                    >
                      <input
                        type="text"
                        value={item.type}
                        onChange={(event) =>
                          setScholarships((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, type: event.target.value }
                                : row,
                            ),
                          )
                        }
                        placeholder="Scholarship Type"
                        className="w-1/4 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                      />
                      <input
                        type="text"
                        value={item.elig}
                        onChange={(event) =>
                          setScholarships((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, elig: event.target.value }
                                : row,
                            ),
                          )
                        }
                        placeholder="Eligibility Criteria"
                        className="w-2/4 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                      />
                      <input
                        type="text"
                        value={item.ben}
                        onChange={(event) =>
                          setScholarships((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, ben: event.target.value }
                                : row,
                            ),
                          )
                        }
                        placeholder="Benefits"
                        className="w-1/4 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setScholarships((prev) =>
                            prev.filter((row) => row.id !== item.id),
                          )
                        }
                        className={removeButtonClass}
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FileText className="text-blue-500 w-6 mr-2" />
                  Model/Entrance PDFs
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setPdfs((prev) => [
                      ...prev,
                      { id: nextId(prev), name: "", link: "" },
                    ])
                  }
                  className={addButtonClass}
                >
                  + Add PDF
                </button>
              </div>
              <div className="space-y-3">
                {pdfs.length === 0 ? (
                  <p className="text-gray-400 text-sm italic text-center py-4 border border-dashed border-gray-200 rounded-lg">
                    No PDFs added yet.
                  </p>
                ) : (
                  pdfs.map((item) => (
                    <div
                      key={item.id}
                      className="flex space-x-3 items-center bg-gray-50 p-2 rounded-lg border border-gray-200"
                    >
                      <input
                        type="text"
                        value={item.name}
                        onChange={(event) =>
                          setPdfs((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, name: event.target.value }
                                : row,
                            ),
                          )
                        }
                        placeholder="PDF File Name / Heading"
                        className="w-1/2 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                      />
                      <input
                        type="url"
                        value={item.link}
                        onChange={(event) =>
                          setPdfs((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, link: event.target.value }
                                : row,
                            ),
                          )
                        }
                        placeholder="URL link to PDF"
                        className="w-1/2 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPdfs((prev) =>
                            prev.filter((row) => row.id !== item.id),
                          )
                        }
                        className={removeButtonClass}
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Building2 className="text-blue-500 w-6 mr-2" />
                  Facilities
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setFacilities((prev) => [
                      ...prev,
                      { id: nextId(prev), head: "", sub: "" },
                    ])
                  }
                  className={addButtonClass}
                >
                  + Add Facility
                </button>
              </div>
              <div className="space-y-3">
                {facilities.length === 0 ? (
                  <p className="text-gray-400 text-sm italic text-center py-4 border border-dashed border-gray-200 rounded-lg">
                    No facilities added yet.
                  </p>
                ) : (
                  facilities.map((item) => (
                    <div
                      key={item.id}
                      className="flex space-x-3 items-center bg-gray-50 p-2 rounded-lg border border-gray-200"
                    >
                      <input
                        type="text"
                        value={item.head}
                        onChange={(event) =>
                          setFacilities((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, head: event.target.value }
                                : row,
                            ),
                          )
                        }
                        placeholder="Facility Heading"
                        className="w-1/3 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                      />
                      <input
                        type="text"
                        value={item.sub}
                        onChange={(event) =>
                          setFacilities((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, sub: event.target.value }
                                : row,
                            ),
                          )
                        }
                        placeholder="Short description / Sub-heading"
                        className="w-2/3 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFacilities((prev) =>
                            prev.filter((row) => row.id !== item.id),
                          )
                        }
                        className={removeButtonClass}
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={`${cardClass} lg:col-span-2`}>
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Presentation className="text-blue-500 w-6 mr-2" />
                  Faculty Members
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setFaculty((prev) => [
                      ...prev,
                      {
                        id: nextId(prev),
                        name: "",
                        edu: "",
                        exp: "",
                        photo: "",
                      },
                    ])
                  }
                  className={addButtonClass}
                >
                  + Add Faculty
                </button>
              </div>
              <div className="space-y-3">
                {faculty.length === 0 ? (
                  <p className="text-gray-400 text-sm italic text-center py-4 border border-dashed border-gray-200 rounded-lg">
                    No faculty members added yet.
                  </p>
                ) : (
                  faculty.map((item) => (
                    <div
                      key={item.id}
                      className="flex space-x-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-200 flex-wrap gap-y-2 md:flex-nowrap shadow-sm hover:shadow transition-shadow"
                    >
                      <label className="w-12 h-12 flex-shrink-0 relative group rounded overflow-hidden border border-gray-300 bg-white flex items-center justify-center cursor-pointer">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt="Faculty"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                        <span className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="text-white w-3 h-3" />
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            const photoUrl = URL.createObjectURL(file);
                            setFaculty((prev) =>
                              prev.map((row) =>
                                row.id === item.id
                                  ? { ...row, photo: photoUrl }
                                  : row,
                              ),
                            );
                          }}
                        />
                      </label>
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(event) =>
                            setFaculty((prev) =>
                              prev.map((row) =>
                                row.id === item.id
                                  ? { ...row, name: event.target.value }
                                  : row,
                              ),
                            )
                          }
                          placeholder="Full Name"
                          className="w-1/3 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white transition"
                        />
                        <input
                          type="text"
                          value={item.edu}
                          onChange={(event) =>
                            setFaculty((prev) =>
                              prev.map((row) =>
                                row.id === item.id
                                  ? { ...row, edu: event.target.value }
                                  : row,
                              ),
                            )
                          }
                          placeholder="Education Level"
                          className="w-1/3 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white transition"
                        />
                        <input
                          type="text"
                          value={item.exp}
                          onChange={(event) =>
                            setFaculty((prev) =>
                              prev.map((row) =>
                                row.id === item.id
                                  ? { ...row, exp: event.target.value }
                                  : row,
                              ),
                            )
                          }
                          placeholder="Experience"
                          className="w-1/3 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white transition"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFaculty((prev) =>
                            prev.filter((row) => row.id !== item.id),
                          )
                        }
                        className={`${removeButtonClass} ml-2`}
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={`${cardClass} lg:col-span-2`}>
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <CircleHelp className="text-blue-500 w-6 mr-2" />
                  FAQs
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setFaqs((prev) => [
                      ...prev,
                      { id: nextId(prev), q: "", a: "" },
                    ])
                  }
                  className={addButtonClass}
                >
                  + Add FAQ
                </button>
              </div>
              <div className="space-y-3">
                {faqs.length === 0 ? (
                  <p className="text-gray-400 text-sm italic text-center py-4 border border-dashed border-gray-200 rounded-lg">
                    No FAQs added yet.
                  </p>
                ) : (
                  faqs.map((item) => (
                    <div
                      key={item.id}
                      className="flex space-x-3 items-start bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={item.q}
                          onChange={(event) =>
                            setFaqs((prev) =>
                              prev.map((row) =>
                                row.id === item.id
                                  ? { ...row, q: event.target.value }
                                  : row,
                              ),
                            )
                          }
                          placeholder="Question"
                          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white font-medium"
                        />
                        <textarea
                          rows={2}
                          value={item.a}
                          onChange={(event) =>
                            setFaqs((prev) =>
                              prev.map((row) =>
                                row.id === item.id
                                  ? { ...row, a: event.target.value }
                                  : row,
                              ),
                            )
                          }
                          placeholder="Answer"
                          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFaqs((prev) =>
                            prev.filter((row) => row.id !== item.id),
                          )
                        }
                        className={`${removeButtonClass} mt-1`}
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className={cardClass}>
            {sectionTitle(<IdCard className="w-5 h-5" />, "Department Contact")}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 border border-gray-300 flex-shrink-0 relative group">
                    {contactPhoto ? (
                      <img
                        src={contactPhoto}
                        alt="Contact preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <Camera className="w-6 h-6" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => contactInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="text-white w-4 h-4" />
                    </button>
                    <input
                      ref={contactInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(event) =>
                        handleSingleImage(event, setContactPhoto)
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => contactInputRef.current?.click()}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 text-left"
                    >
                      Change Photo
                    </button>
                    {contactPhoto && (
                      <button
                        type="button"
                        onClick={() =>
                          clearFileInput(
                            contactInputRef.current,
                            setContactPhoto,
                          )
                        }
                        className="text-xs text-red-500 hover:text-red-700 text-left mt-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  placeholder="e.g., Dr. John Doe"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  value={contactPosition}
                  onChange={(event) => setContactPosition(event.target.value)}
                  placeholder="e.g., Head of Department"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone/Email
                </label>
                <input
                  type="text"
                  value={contactDetails}
                  onChange={(event) => setContactDetails(event.target.value)}
                  placeholder="e.g., 01-123456, info@college.edu"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition font-medium flex items-center"
            >
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionManagePage;
