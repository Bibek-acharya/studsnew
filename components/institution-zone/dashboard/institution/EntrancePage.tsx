"use client";
import React, { useState } from "react";
import { Plus, Trash2, CheckCircle, BookOpen, CalendarDays, FileText, Table2, Download, Phone } from "lucide-react";

interface SubjectRow { id: number; name: string; fullMarks: string; passMarks: string; syllabus: string; }
interface PaperRow { id: number; year: string; label: string; }

const mkSubject = (id: number): SubjectRow => ({ id, name: "", fullMarks: "", passMarks: "", syllabus: "" });
const mkPaper = (id: number): PaperRow => ({ id, year: "", label: "" });
const nextId = (arr: { id: number }[]) => Math.max(0, ...arr.map(a => a.id)) + 1;

const SectionCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
      <span className="text-blue-600">{icon}</span>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const EntrancePage: React.FC = () => {
  /* Section 1: Basic Info */
  const [examName, setExamName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [takenBy, setTakenBy] = useState("");
  const [program, setProgram] = useState("");

  /* Section 2: Dates & Links */
  const [examDateAD, setExamDateAD] = useState("");
  const [examDateBS, setExamDateBS] = useState("");
  const [openDate, setOpenDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [formLink, setFormLink] = useState("");

  /* Section 3: Descriptions */
  const [aboutExam, setAboutExam] = useState("");
  const [examProcess, setExamProcess] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [requiredDocs, setRequiredDocs] = useState("");

  /* Section 4: Exam Structure */
  const [subjects, setSubjects] = useState<SubjectRow[]>([mkSubject(1)]);

  /* Section 5: Past Papers */
  const [papers, setPapers] = useState<PaperRow[]>([mkPaper(1)]);

  /* Section 6: Contact */
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");

  const [saved, setSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const updateSubject = (id: number, key: keyof SubjectRow, val: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s));
  };

  const updatePaper = (id: number, key: keyof PaperRow, val: string) => {
    setPapers(prev => prev.map(p => p.id === id ? { ...p, [key]: val } : p));
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[900px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add Entrance Exam</h1>
        <p className="text-slate-500 text-sm mt-1">Create and publish entrance exam details for student applications.</p>
      </div>

      {showSuccess && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium">
          <CheckCircle className="w-5 h-5 text-green-600" /> Entrance exam published successfully!
        </div>
      )}

      {/* Section 1: Basic Info */}
      <SectionCard icon={<BookOpen className="w-5 h-5" />} title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Exam Name <span className="text-red-500">*</span></label>
            <input value={examName} onChange={e => setExamName(e.target.value)} placeholder="e.g. CSIT Entrance Examination 2024" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Affiliated University / Board</label>
            <input value={affiliation} onChange={e => setAffiliation(e.target.value)} placeholder="e.g. Tribhuvan University" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Taken By</label>
            <input value={takenBy} onChange={e => setTakenBy(e.target.value)} placeholder="e.g. +2 Pass Students" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">For Program</label>
            <input value={program} onChange={e => setProgram(e.target.value)} placeholder="e.g. B.Sc CSIT, BCA, BIT..." className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </SectionCard>

      {/* Section 2: Dates & Links */}
      <SectionCard icon={<CalendarDays className="w-5 h-5" />} title="Dates & Links">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Exam Date (AD)</label>
            <input type="date" value={examDateAD} onChange={e => setExamDateAD(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Exam Date (BS)</label>
            <input value={examDateBS} onChange={e => setExamDateBS(e.target.value)} placeholder="e.g. 2081 Chaitra 15" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Form Open Date</label>
            <input type="date" value={openDate} onChange={e => setOpenDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Online Form Link</label>
            <input value={formLink} onChange={e => setFormLink(e.target.value)} placeholder="https://forms.tribhuvan.edu.np/..." className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </SectionCard>

      {/* Section 3: Descriptions */}
      <SectionCard icon={<FileText className="w-5 h-5" />} title="Detailed Information">
        <div className="space-y-4">
          {[
            { label: "About the Exam", value: aboutExam, setter: setAboutExam, placeholder: "Overview of the entrance examination..." },
            { label: "Exam Process", value: examProcess, setter: setExamProcess, placeholder: "Step by step examination procedure..." },
            { label: "Eligibility Requirements", value: eligibility, setter: setEligibility, placeholder: "Who can apply and minimum qualifications..." },
            { label: "Required Documents", value: requiredDocs, setter: setRequiredDocs, placeholder: "List of documents needed for admission..." },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
              <textarea rows={3} value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section 4: Exam Structure */}
      <SectionCard icon={<Table2 className="w-5 h-5" />} title="Exam Structure">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border border-slate-200 rounded-lg overflow-hidden mb-3">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                {["Subject / Section", "Full Marks", "Pass Marks", "Syllabus Link", ""].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <input value={s.name} onChange={e => updateSubject(s.id, "name", e.target.value)} placeholder="e.g. Mathematics" className="w-full border-0 border-b border-slate-200 focus:border-blue-400 p-1 text-sm outline-none bg-transparent" />
                  </td>
                  <td className="px-4 py-2 w-28">
                    <input value={s.fullMarks} onChange={e => updateSubject(s.id, "fullMarks", e.target.value)} placeholder="100" className="w-full border-0 border-b border-slate-200 focus:border-blue-400 p-1 text-sm outline-none bg-transparent text-center" />
                  </td>
                  <td className="px-4 py-2 w-28">
                    <input value={s.passMarks} onChange={e => updateSubject(s.id, "passMarks", e.target.value)} placeholder="40" className="w-full border-0 border-b border-slate-200 focus:border-blue-400 p-1 text-sm outline-none bg-transparent text-center" />
                  </td>
                  <td className="px-4 py-2">
                    <input value={s.syllabus} onChange={e => updateSubject(s.id, "syllabus", e.target.value)} placeholder="https://..." className="w-full border-0 border-b border-slate-200 focus:border-blue-400 p-1 text-sm outline-none bg-transparent" />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => setSubjects(prev => prev.filter(x => x.id !== s.id))} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setSubjects(prev => [...prev, mkSubject(nextId(prev))])}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </SectionCard>

      {/* Section 5: Past Papers */}
      <SectionCard icon={<Download className="w-5 h-5" />} title="Past Papers & Materials">
        <div className="space-y-3 mb-3">
          {papers.map(p => (
            <div key={p.id} className="flex gap-2 items-center">
              <input value={p.year} onChange={e => updatePaper(p.id, "year", e.target.value)} placeholder="Year (e.g. 2023)" className="w-32 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <input value={p.label} onChange={e => updatePaper(p.id, "label", e.target.value)} placeholder="Label (e.g. BSc CSIT Past Paper)" className="flex-1 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <label className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                <input type="file" accept=".pdf" className="hidden" /> Upload PDF
              </label>
              <button onClick={() => setPapers(prev => prev.filter(x => x.id !== p.id))} className="text-red-400 hover:text-red-600 p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setPapers(prev => [...prev, mkPaper(nextId(prev))])}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Paper Year
        </button>
      </SectionCard>

      {/* Section 6: Contact */}
      <SectionCard icon={<Phone className="w-5 h-5" />} title="Contact & Support">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Contact Email", value: contactEmail, setter: setContactEmail, placeholder: "exam@college.edu.np", type: "email" },
            { label: "Contact Phone", value: contactPhone, setter: setContactPhone, placeholder: "+977-01-XXXXXXX", type: "tel" },
            { label: "Exam Website", value: contactWebsite, setter: setContactWebsite, placeholder: "https://exam.college.edu.np", type: "url" },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pb-6">
        <button className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">Cancel</button>
        <button className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">Save as Draft</button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Publish Exam
        </button>
      </div>
    </div>
  );
};

export default EntrancePage;
