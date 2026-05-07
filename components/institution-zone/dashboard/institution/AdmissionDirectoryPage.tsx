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
  WhatsappLogo,
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
  status: "Pending" | "Shortlisted" | "Approved" | "Rejected";
}

const APPLICANTS: Applicant[] = [
  { id: 1, name: "Aarav Sharma", gender: "Male", dob: "2003-06-14", level: "+2", program: "Science", gpa: 3.8, prevInstitution: "Trinity Int. College", email: "aarav@example.com", phone: "9812345678", location: "Kathmandu, Bagmati", status: "Shortlisted" },
  { id: 2, name: "Nisha Thapa", gender: "Female", dob: "2004-03-11", level: "Bachelor", program: "BSc. CSIT", gpa: 3.5, prevInstitution: "St. Xavier's", email: "nisha@example.com", phone: "9823456789", location: "Bhaktapur, Bagmati", status: "Pending" },
  { id: 3, name: "Rohan Karki", gender: "Male", dob: "2002-10-19", level: "Master", program: "MBA", gpa: 3.7, prevInstitution: "Global College", email: "rohan@example.com", phone: "9834567890", location: "Pokhara, Gandaki", status: "Approved" },
  { id: 4, name: "Puja Rai", gender: "Female", dob: "2005-01-22", level: "Diploma", program: "Computer Eng.", gpa: 3.1, prevInstitution: "NIST", email: "puja@example.com", phone: "9845678901", location: "Butwal, Lumbini", status: "Pending" },
  { id: 5, name: "Bikash Magar", gender: "Male", dob: "2003-08-09", level: "Bachelor", program: "BCA", gpa: 2.9, prevInstitution: "KMC", email: "bikash@example.com", phone: "9856789012", location: "Jhapa, Koshi", status: "Rejected" },
  { id: 6, name: "Sita Gurung", gender: "Female", dob: "2002-12-01", level: "Master", program: "MSc. IT", gpa: 3.9, prevInstitution: "Little Angels", email: "sita@example.com", phone: "9867890123", location: "Lalitpur, Bagmati", status: "Approved" },
  { id: 7, name: "Pradeep Adhikari", gender: "Male", dob: "2004-07-17", level: "+2", program: "Management", gpa: 3.2, prevInstitution: "Sagarmatha College", email: "pradeep@example.com", phone: "9878901234", location: "Dhanusha, Madhesh", status: "Shortlisted" },
  { id: 8, name: "Anjali Tamang", gender: "Female", dob: "2003-11-27", level: "Bachelor", program: "BBM", gpa: 3.4, prevInstitution: "GoldenGate Int.", email: "anjali@example.com", phone: "9889012345", location: "Surkhet, Karnali", status: "Pending" },
];

type TabLevel = "+2" | "Bachelor" | "Master" | "Diploma" | "Shortlisted";

const statusPill = (status: string) => {
  const colors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Shortlisted: "bg-blue-100 text-blue-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

const programPill = (level: string, program: string) => (
  <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
    {level} - {program}
  </span>
);

const ITEMS_PER_PAGE = 5;

const AdmissionDirectoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabLevel>("+2");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = useMemo(() => {
    return APPLICANTS.filter((row) => {
      if (activeTab === "Shortlisted") return row.status === "Shortlisted";
      if (row.level !== activeTab) return false;
      const s = search.toLowerCase();
      if (s && !row.name.toLowerCase().includes(s) && !row.email.toLowerCase().includes(s) && !row.phone.includes(s)) return false;
      return true;
    });
  }, [activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    setSelected((prev) =>
      prev.length === paginated.length ? [] : paginated.map((row) => row.id)
    );
  };

  const tabs: { key: TabLevel; label: string }[] = [
    { key: "+2", label: "+2 Programs" },
    { key: "Bachelor", label: "Bachelor's" },
    { key: "Master", label: "Master's" },
    { key: "Diploma", label: "Diploma" },
    { key: "Shortlisted", label: "Shortlisted" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader
        title="Admission Directory"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
          { label: "Admission Directory" },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto bg-white rounded-lg border border-gray-200 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelected([]); setPage(1); }}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? tab.key === "Shortlisted"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative min-w-[220px]">
            <MagnifyingGlass weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search applicants..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        {selected.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
            <span className="text-sm text-blue-800 font-medium flex items-center gap-2">
              <CheckCircle weight="fill" className="w-4 h-4" /> {selected.length} applicant(s) selected
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1">
                <BookmarkSimple weight="bold" className="w-3.5 h-3.5" /> Shortlist
              </button>
              <button className="px-3 py-1.5 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1">
                <CheckCircle weight="bold" className="w-3.5 h-3.5" /> Approve
              </button>
              <button className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1">
                <XCircle weight="bold" className="w-3.5 h-3.5" /> Reject
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <th className="px-4 py-3 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selected.length === paginated.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">GPA</th>
                <th className="px-4 py-3">Previous Institution</th>
                <th className="px-4 py-3">Contact Info</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => {
                const isSelected = selected.includes(row.id);
                return (
                  <tr key={row.id} className={`hover:bg-gray-50 border-b border-gray-200 ${isSelected ? "bg-blue-50/30" : ""}`}>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(row.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
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
                    <td className="px-4 py-3">{statusPill(row.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button title="Shortlist" className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                          <BookmarkSimple weight="bold" className="w-4 h-4" />
                        </button>
                        <button title="Approve" className="p-1.5 rounded text-gray-400 hover:text-green-600 hover:bg-green-50">
                          <CheckCircle weight="bold" className="w-4 h-4" />
                        </button>
                        <button title="Reject" className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50">
                          <XCircle weight="bold" className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-gray-200 mx-1" />
                        <button title="Message" className="p-1.5 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50">
                          <ChatCircleDots weight="bold" className="w-4 h-4" />
                        </button>
                        <button title="WhatsApp" className="p-1.5 rounded text-gray-400 hover:text-green-600 hover:bg-green-50">
                          <WhatsappLogo weight="bold" className="w-4 h-4" />
                        </button>
                        <button title="View" className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                          <Eye weight="bold" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No applicants found in this category.
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

export default AdmissionDirectoryPage;
