"use client";

import React, { useState, useEffect, memo } from "react";
import { Home, Trophy, GraduationCap, Search, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface FinalEntry {
  id: number;
  name: string;
  symbolNo: string;
  written: number;
  interview: number;
  total: number;
  rank: string;
  result: string;
}

const SCHOLARSHIP_DATA: Record<string, FinalEntry[]> = {
  sch1: [
    { id: 1, name: "Krishna Bahadur Khatri", symbolNo: "2082141", written: 96, interview: 91, total: 187, rank: "1st", result: "Selected" },
    { id: 2, name: "Sita Kumari Sharma", symbolNo: "2082056", written: 92, interview: 88, total: 180, rank: "2nd", result: "Selected" },
    { id: 3, name: "Ram Bahadur Thapa", symbolNo: "2082001", written: 85, interview: 72, total: 157, rank: "3rd", result: "Selected" },
  ],
  sch2: [
    { id: 4, name: "Bikram Gurung", symbolNo: "2082103", written: 88, interview: 65, total: 153, rank: "4th", result: "Waitlisted" },
    { id: 5, name: "Maya Devi Chaudhary", symbolNo: "2082078", written: 45, interview: 52, total: 97, rank: "5th", result: "Rejected" },
    { id: 6, name: "Ganesh Bahadur Rai", symbolNo: "2082015", written: 73, interview: 60, total: 133, rank: "6th", result: "Waitlisted" },
  ],
};

const rankColor = (rank: string) => {
  if (rank === "1st") return "bg-yellow-100 text-yellow-700";
  if (rank === "2nd") return "bg-gray-200 text-gray-700";
  if (rank === "3rd") return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-600";
};

const resultColor = (result: string) => {
  if (result === "Selected") return "bg-green-100 text-green-700";
  if (result === "Waitlisted") return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
};

const FinalResult: React.FC = memo(() => {
  const [scholarship, setScholarship] = useState("");
  const [entries, setEntries] = useState<FinalEntry[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (scholarship) {
      setEntries(SCHOLARSHIP_DATA[scholarship] || []);
    } else {
      setEntries(Object.values(SCHOLARSHIP_DATA).flat());
    }
    setPage(1);
  }, [scholarship]);

  const filtered = entries.filter((e) => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.symbolNo.includes(search));
  const totalPages = Math.ceil(filtered.length / limit);
  const paged = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Final Result</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Evaluation & Results / Final Result</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" /> Final Selection Result
          </h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Publish Final Result</button>
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
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-green-600" /> Final Results
          </h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input type="text" className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Search by name or symbol..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No final results found</div>
        ) : (
          <>
            <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
              <table className="w-full text-sm" style={{ minWidth: "1000px" }}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Symbol No.</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Written</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Interview</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Result</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.length === 0 ? (
                    <tr><td colSpan={8} className="py-8 text-center text-gray-500">No results found</td></tr>
                  ) : paged.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{e.name}</td>
                      <td className="text-center py-3 px-4 font-mono text-gray-600">{e.symbolNo}</td>
                      <td className="text-center py-3 px-4 font-bold text-blue-600">{e.written}</td>
                      <td className="text-center py-3 px-4 font-bold text-purple-600">{e.interview}</td>
                      <td className="text-center py-3 px-4 font-bold text-gray-900">{e.total}</td>
                      <td className="text-center py-3 px-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${rankColor(e.rank)}`}>{e.rank}</span></td>
                      <td className="text-center py-3 px-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${resultColor(e.result)}`}>{e.result}</span></td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Eye className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:bg-gray-50 rounded text-gray-600"><Download className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> final results</p>
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
    </div>
  );
});

FinalResult.displayName = "FinalResult";

export default FinalResult;
