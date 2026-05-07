"use client";
import React, { useMemo, useState } from "react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import {
  MagnifyingGlass,
  BookmarkSimple,
  CheckCircle,
  XCircle,
  Eye,
  ChatCircleDots,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";

interface Applicant {
  id: number;
  name: string;
  gender: string;
  dob: string;
  level: string;
  program: string;
  gpa: number;
  prevInstitution: string;
  email: string;
  phone: string;
  location: string;
  status: "Shortlisted";
}

const SHORTLISTED: Applicant[] = [
  { id: 1, name: "Aarav Sharma", gender: "Male", dob: "2003-06-14", level: "+2", program: "Science", gpa: 3.8, prevInstitution: "Trinity Int. College", email: "aarav@example.com", phone: "9812345678", location: "Kathmandu, Bagmati", status: "Shortlisted" },
  { id: 2, name: "Pradeep Adhikari", gender: "Male", dob: "2004-07-17", level: "+2", program: "Management", gpa: 3.2, prevInstitution: "Sagarmatha College", email: "pradeep@example.com", phone: "9878901234", location: "Dhanusha, Madhesh", status: "Shortlisted" },
  { id: 3, name: "Kiran Lama", gender: "Male", dob: "2005-02-06", level: "Diploma", program: "Civil Eng.", gpa: 3.0, prevInstitution: "Kathmandu Model College", email: "kiran@example.com", phone: "9801112233", location: "Kailali, Sudurpashchim", status: "Shortlisted" },
  { id: 4, name: "Sandeep Tamang", gender: "Male", dob: "2003-07-07", level: "Bachelor", program: "BCA", gpa: 3.6, prevInstitution: "Himalayan WhiteHouse", email: "sandeep@example.com", phone: "9814445567", location: "Jumla, Karnali", status: "Shortlisted" },
  { id: 5, name: "Gita Dahal", gender: "Female", dob: "2002-04-28", level: "Master", program: "MBS", gpa: 3.5, prevInstitution: "Trinity Int. College", email: "gita@example.com", phone: "9804445566", location: "Nawalpur, Gandaki", status: "Shortlisted" },
  { id: 6, name: "Bina Bhattarai", gender: "Female", dob: "2002-08-15", level: "Master", program: "MA", gpa: 3.8, prevInstitution: "Kathmandu Model College", email: "bina@example.com", phone: "9808889900", location: "Makwanpur, Bagmati", status: "Shortlisted" },
];

const statusPill = () => (
  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
    Shortlisted
  </span>
);

const programPill = (level: string, program: string) => (
  <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
    {level} - {program}
  </span>
);

const ITEMS_PER_PAGE = 5;

const AdmissionShortlistPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return SHORTLISTED.filter((row) => {
      const s = search.toLowerCase();
      if (s && !row.name.toLowerCase().includes(s) && !row.email.toLowerCase().includes(s) && !row.phone.includes(s)) return false;
      return true;
    });
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader
        title="Shortlist"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
          { label: "Shortlist" },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <BookmarkSimple weight="fill" className="text-blue-600 w-5 h-5" />
            Shortlisted Applicants ({SHORTLISTED.length})
          </h2>
          <div className="relative min-w-[240px]">
            <MagnifyingGlass weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">GPA</th>
                <th className="px-4 py-3">Previous Institution</th>
                <th className="px-4 py-3">Contact Info</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{row.name}</div>
                    <div className="text-xs text-gray-500 flex gap-2">
                      <span>{row.gender}</span> &bull; <span>DOB: {row.dob}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{programPill(row.level, row.program)}</td>
                  <td className="px-4 py-3 font-semibold text-gray-700">{row.gpa.toFixed(1)}</td>
                  <td className="px-4 py-3 text-gray-600">{row.prevInstitution}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    <div>{row.email}</div>
                    <div>{row.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{row.location}</td>
                  <td className="px-4 py-3">{statusPill()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Approve"
                        className="px-3 py-1.5 text-sm font-medium text-green-600 bg-white border border-gray-200 rounded-lg hover:bg-green-50 flex items-center gap-1"
                      >
                        <CheckCircle weight="bold" className="w-4 h-4" /> Approve
                      </button>
                      <button
                        title="Reject"
                        className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-gray-200 rounded-lg hover:bg-red-50 flex items-center gap-1"
                      >
                        <XCircle weight="bold" className="w-4 h-4" /> Reject
                      </button>
                      <button
                        title="Message"
                        className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 flex items-center gap-1"
                      >
                        <ChatCircleDots weight="bold" className="w-4 h-4" /> Message
                      </button>
                      <button
                        title="View Details"
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1"
                      >
                        <Eye weight="bold" className="w-4 h-4" /> View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No shortlisted applicants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
          <p className="text-sm text-gray-500">
            Showing {(safePage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} records
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CaretLeft weight="bold" className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, safePage - 3), safePage + 2)
              .map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded border text-sm font-medium flex items-center justify-center ${
                    n === safePage
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {n}
                </button>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CaretRight weight="bold" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionShortlistPage;
