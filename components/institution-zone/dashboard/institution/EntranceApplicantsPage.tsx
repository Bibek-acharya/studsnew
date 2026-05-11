"use client";
import React, { useState } from "react";
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
  studentName: string;
  gender: string;
  examName: string;
  program: string;
  registrationNo: string;
  score: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: string;
}

type TabStatus = "all" | "shortlisted" | "approved" | "pending" | "rejected";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  under_review: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  waitlisted: "bg-purple-100 text-purple-700",
  shortlisted: "bg-blue-100 text-blue-700",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  waitlisted: "Waitlisted",
  shortlisted: "Shortlisted",
};

const statusPill = (status: string) => {
  const color = statusColors[status] || "bg-gray-100 text-gray-700";
  const label = statusLabels[status] || status;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
  );
};

const ITEMS_PER_PAGE = 5;

const MOCK_DATA: Applicant[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  studentName: ["Aarav Sharma", "Priya Patel", "Rohan Thapa", "Sneha Adhikari", "Kiran Gurung", "Anita Rai"][i % 6],
  gender: i % 2 === 0 ? "Male" : "Female",
  examName: ["BSc CS Entrance 2026", "MBA Entrance 2026", "BE Civil Entrance 2026", "BBA Entrance 2026"][i % 4],
  program: ["BSc CS", "MBA", "BE Civil", "BBA"][i % 4],
  registrationNo: `ENT-2026-${String(100 + i).slice(1)}`,
  score: `${65 + (i * 5) % 30}`,
  email: `student${i + 1}@email.com`,
  phone: `+977 98${String(40000000 + i * 123456).slice(0, 8)}`,
  address: `Address ${i + 1}`,
  city: ["Kathmandu", "Lalitpur", "Pokhara", "Chitwan"][i % 4],
  status: ["pending", "approved", "shortlisted", "rejected", "pending", "under_review"][i % 6],
}));

const EntranceApplicantsPage = () => {
  const [applicants] = useState(MOCK_DATA);
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = React.useMemo(() => {
    return applicants.filter((row) => {
      if (activeTab !== "all" && row.status !== activeTab) return false;
      const s = search.toLowerCase();
      if (
        s &&
        !row.studentName.toLowerCase().includes(s) &&
        !row.email.toLowerCase().includes(s) &&
        !row.phone.includes(s) &&
        !row.registrationNo.toLowerCase().includes(s)
      )
        return false;
      return true;
    });
  }, [activeTab, search, applicants]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelected((prev) =>
      prev.length === paginated.length ? [] : paginated.map((row) => row.id)
    );
  };

  const tabs: { key: TabStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "approved", label: "Approved" },
    { key: "pending", label: "Pending" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader
        title="Entrance Applicants"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
          { label: "Entrance Applicants" },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto bg-white rounded-lg border border-gray-200 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSelected([]);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative min-w-[220px]">
            <MagnifyingGlass
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
            />
            <input
              placeholder="Search by name, email, or reg no..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
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
          <table className="w-full text-left border-collapse text-sm min-w-[1000px]">
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
                <th className="px-4 py-3">Exam / Program</th>
                <th className="px-4 py-3">Reg No.</th>
                <th className="px-4 py-3">Contact Info</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No applicants found in this category.
                  </td>
                </tr>
              ) : (
                paginated.map((row) => {
                  const isSelected = selected.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-gray-50 border-b border-gray-200 ${isSelected ? "bg-blue-50/30" : ""}`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(row.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{row.studentName}</div>
                        <div className="text-xs text-gray-500"><span>{row.gender}</span></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800">{row.examName}</div>
                        <div className="text-xs text-gray-500">{row.program}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs font-mono">{row.registrationNo}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        <div>{row.email}</div>
                        <div>{row.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {row.city}{row.address ? `, ${row.address}` : ""}
                      </td>
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
                })
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

export default EntranceApplicantsPage;
