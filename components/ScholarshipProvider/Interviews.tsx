"use client";

import React, { useState, memo } from "react";
import { Home, Mic, Users, Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, AlertCircle } from "lucide-react";

interface InterviewEntry {
  id: number;
  name: string;
  appId: string;
  symbolNo: string;
  writtenMarks: number;
  interviewScore: number;
  status: string;
}

const SCHOLARSHIP_DATA: Record<string, InterviewEntry[]> = {
  sch1: [
    { id: 1, name: "Ram Bahadur Thapa", appId: "APP-2026-001", symbolNo: "2082001", writtenMarks: 85, interviewScore: 72, status: "Pass" },
    { id: 2, name: "Sita Kumari Sharma", appId: "APP-2026-002", symbolNo: "2082056", writtenMarks: 92, interviewScore: 88, status: "Pass" },
    { id: 3, name: "Bikram Gurung", appId: "APP-2026-005", symbolNo: "2082103", writtenMarks: 88, interviewScore: 65, status: "Pass" },
  ],
  sch2: [
    { id: 4, name: "Maya Devi Chaudhary", appId: "APP-2026-004", symbolNo: "2082078", writtenMarks: 45, interviewScore: 52, status: "Pass" },
    { id: 5, name: "Krishna Bahadur Khatri", appId: "APP-2026-010", symbolNo: "2082141", writtenMarks: 96, interviewScore: 91, status: "Pass" },
    { id: 6, name: "Ganesh Bahadur Rai", appId: "APP-2026-003", symbolNo: "2082015", writtenMarks: 73, interviewScore: 60, status: "Pass" },
  ],
};

const LOOKUP_DB: Record<string, { name: string; appId: string; symbolNo: string; writtenMarks: number }> = {
  "2082001": { name: "Ram Bahadur Thapa", appId: "APP-2026-001", symbolNo: "2082001", writtenMarks: 85 },
  "2082056": { name: "Sita Kumari Sharma", appId: "APP-2026-002", symbolNo: "2082056", writtenMarks: 92 },
  "2082103": { name: "Bikram Gurung", appId: "APP-2026-005", symbolNo: "2082103", writtenMarks: 88 },
  "2082078": { name: "Maya Devi Chaudhary", appId: "APP-2026-004", symbolNo: "2082078", writtenMarks: 45 },
  "2082141": { name: "Krishna Bahadur Khatri", appId: "APP-2026-010", symbolNo: "2082141", writtenMarks: 96 },
  "2082015": { name: "Ganesh Bahadur Rai", appId: "APP-2026-003", symbolNo: "2082015", writtenMarks: 73 },
};

const CENTERS = ["Kathmandu", "Pokhara", "Biratnagar"];

const Interviews: React.FC = memo(() => {
  const [scholarship, setScholarship] = useState("");
  const [center, setCenter] = useState("");
  const [entries, setEntries] = useState<InterviewEntry[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [symbolLookup, setSymbolLookup] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [foundStudent, setFoundStudent] = useState<{ name: string; appId: string; symbolNo: string; writtenMarks: number } | null>(null);
  const [interviewScore, setInterviewScore] = useState("");
  const limit = 10;

  React.useEffect(() => {
    if (scholarship) {
      setEntries(SCHOLARSHIP_DATA[scholarship] || []);
    } else {
      setEntries(Object.values(SCHOLARSHIP_DATA).flat());
    }
    setCenter("");
    setPage(1);
  }, [scholarship]);

  const openModal = () => {
    setStep(1);
    setSymbolLookup("");
    setNotFound(false);
    setFoundStudent(null);
    setInterviewScore("");
    setModalOpen(true);
  };

  const handleLookup = () => {
    const student = LOOKUP_DB[symbolLookup];
    if (student) {
      setFoundStudent(student);
      setNotFound(false);
      setStep(2);
    } else {
      setNotFound(true);
      setFoundStudent(null);
    }
  };

  const handleAddScore = () => {
    if (!foundStudent || !interviewScore) return;
    const score = parseInt(interviewScore, 10);
    const newEntry: InterviewEntry = {
      id: Date.now(),
      name: foundStudent.name,
      appId: foundStudent.appId,
      symbolNo: foundStudent.symbolNo,
      writtenMarks: foundStudent.writtenMarks,
      interviewScore: score,
      status: score >= 40 ? "Pass" : "Fail",
    };
    setEntries((prev) => [...prev, newEntry]);
    setModalOpen(false);
  };

  const updateScore = (id: number, score: number) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, interviewScore: score, status: score >= 40 ? "Pass" : "Fail" } : e));
  };

  const filtered = entries.filter((e) => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.symbolNo.includes(search));
  const totalPages = Math.ceil(filtered.length / limit);
  const paged = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Interview</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Evaluation & Results / Interview</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-600" /> Interview Evaluation
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Scholarship</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={scholarship} onChange={(e) => setScholarship(e.target.value)}>
              <option value="">Select scholarship</option>
              <option value="sch1">Project Shiksha Scholarship 2082</option>
              <option value="sch2">Nepal STEM Excellence Grant</option>
            </select>
          </div>
          {scholarship && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Interview Center</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={center} onChange={(e) => setCenter(e.target.value)}>
                <option value="">Select center</option>
                {CENTERS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Interview Results
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input type="text" className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Search by name or symbol..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <button onClick={openModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Interview Score
            </button>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No interview results found</div>
        ) : (
          <>
            <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
              <table className="w-full text-sm" style={{ minWidth: "900px" }}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Application ID</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Symbol No.</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Written Marks</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Interview Score</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center text-gray-500">No results found</td></tr>
                  ) : paged.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{e.name}</td>
                      <td className="text-center py-3 px-4 font-mono text-gray-600">{e.appId}</td>
                      <td className="text-center py-3 px-4 font-mono text-gray-600">{e.symbolNo}</td>
                      <td className="text-center py-3 px-4 font-bold text-gray-900">{e.writtenMarks}</td>
                      <td className="text-center py-3 px-4">
                        <input
                          type="number"
                          className="w-20 text-center text-sm py-1 px-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                          value={e.interviewScore}
                          onChange={(ev) => updateScore(e.id, parseInt(ev.target.value) || 0)}
                          placeholder="Score"
                        />
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${e.status === "Pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{e.status}</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => setEntries((prev) => prev.filter((x) => x.id !== e.id))} className="p-1.5 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> students</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
                ))}
                {totalPages > 5 && <span className="text-gray-400">...</span>}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-xl">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Mic className="w-5 h-5 text-purple-600" /> Add Interview Score</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            {step === 1 && (
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">Enter the Symbol Number to look up student details.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Symbol Number <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg text-center font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 2082001" value={symbolLookup} onChange={(e) => { setSymbolLookup(e.target.value); setNotFound(false); }} />
                </div>
                {notFound && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Student Not Found. Try Again.</p>
                  </div>
                )}
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handleLookup} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Look Up</button>
                </div>
              </div>
            )}

            {step === 2 && foundStudent && (
              <div className="p-6 space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Student Name</label><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={foundStudent.name} readOnly /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Application ID</label><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={foundStudent.appId} readOnly /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Symbol Number</label><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={foundStudent.symbolNo} readOnly /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Written Marks</label><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={foundStudent.writtenMarks} readOnly /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Interview Score <span className="text-red-500">*</span></label><input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 72" value={interviewScore} onChange={(e) => setInterviewScore(e.target.value)} /></div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={handleAddScore} disabled={!interviewScore} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">Add Score</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

Interviews.displayName = "Interviews";

export default Interviews;
