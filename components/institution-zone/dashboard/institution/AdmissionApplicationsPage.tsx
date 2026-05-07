"use client";
import React, { useMemo, useState } from "react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import {
  Files,
  HourglassHigh,
  CheckCircle,
  XCircle,
  MagnifyingGlass,
  BookmarkSimple,
  Eye,
  ChatCircleDots,
  WhatsappLogo,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";

interface Applicant {
  id: number;
  name: string;
  initials: string;
  address: string;
  contactNo: string;
  email: string;
  parentContact: string;
  seeSchool: string;
  schoolAddress: string;
  schoolType: string;
  stream: string;
  shift: string;
  status: "Pending" | "Shortlisted" | "Approved" | "Rejected";
}

const MOCK_DATA: Applicant[] = [
  {
    id: 1, name: "Aarav Sharma", initials: "AS", address: "Kathmandu, Ward-5",
    contactNo: "9812345678", email: "aarav@example.com", parentContact: "9841112233",
    seeSchool: "Trinity Int. College", schoolAddress: "Dillibazar, Kathmandu",
    schoolType: "Private", stream: "Science", shift: "Morning", status: "Pending",
  },
  {
    id: 2, name: "Nisha Thapa", initials: "NT", address: "Bhaktapur, Ward-12",
    contactNo: "9823456789", email: "nisha@example.com", parentContact: "9842223344",
    seeSchool: "St. Xavier's School", schoolAddress: "Jawalakhel, Lalitpur",
    schoolType: "Private", stream: "Management", shift: "Day", status: "Approved",
  },
  {
    id: 3, name: "Rohan Karki", initials: "RK", address: "Pokhara, Bazar",
    contactNo: "9834567890", email: "rohan@example.com", parentContact: "9843334455",
    seeSchool: "Global Academy", schoolAddress: "Lakeside, Pokhara",
    schoolType: "Private", stream: "Science", shift: "Morning", status: "Shortlisted",
  },
  {
    id: 4, name: "Puja Rai", initials: "PR", address: "Butwal, Ward-8",
    contactNo: "9845678901", email: "puja@example.com", parentContact: "9844445566",
    seeSchool: "NIST Secondary", schoolAddress: "Butwal-10, Rupandehi",
    schoolType: "Government", stream: "Humanities", shift: "Day", status: "Rejected",
  },
  {
    id: 5, name: "Bikash Magar", initials: "BM", address: "Jhapa, Chowk",
    contactNo: "9856789012", email: "bikash@example.com", parentContact: "9845556677",
    seeSchool: "KMC Secondary", schoolAddress: "Birtamode, Jhapa",
    schoolType: "Community", stream: "Science", shift: "Morning", status: "Pending",
  },
  {
    id: 6, name: "Sita Gurung", initials: "SG", address: "Lalitpur, Ward-4",
    contactNo: "9867890123", email: "sita@example.com", parentContact: "9846667788",
    seeSchool: "Little Angels", schoolAddress: "Hattiban, Lalitpur",
    schoolType: "Private", stream: "Science", shift: "Day", status: "Approved",
  },
  {
    id: 7, name: "Pradeep Adhikari", initials: "PA", address: "Dhanusha, Ward-2",
    contactNo: "9878901234", email: "pradeep@example.com", parentContact: "9847778899",
    seeSchool: "Sagarmatha College", schoolAddress: "Janakpur, Dhanusha",
    schoolType: "Community", stream: "Management", shift: "Morning", status: "Pending",
  },
  {
    id: 8, name: "Anjali Tamang", initials: "AT", address: "Surkhet, Bazar",
    contactNo: "9889012345", email: "anjali@example.com", parentContact: "9848889900",
    seeSchool: "GoldenGate Int.", schoolAddress: "Birendranagar, Surkhet",
    schoolType: "Private", stream: "Law", shift: "Day", status: "Rejected",
  },
];

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

const ITEMS_PER_PAGE = 5;

const AdmissionApplicationsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [streamFilter, setStreamFilter] = useState("All");
  const [schoolTypeFilter, setSchoolTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((row) => {
      if (statusFilter !== "All" && row.status !== statusFilter) return false;
      if (streamFilter !== "All" && row.stream !== streamFilter) return false;
      if (schoolTypeFilter !== "All" && row.schoolType !== schoolTypeFilter) return false;
      const s = search.toLowerCase();
      if (s && !row.name.toLowerCase().includes(s) && !row.email.toLowerCase().includes(s) && !row.contactNo.includes(s)) return false;
      return true;
    });
  }, [statusFilter, streamFilter, schoolTypeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const stats = {
    total: MOCK_DATA.length,
    pending: MOCK_DATA.filter((r) => r.status === "Pending").length,
    approved: MOCK_DATA.filter((r) => r.status === "Approved").length,
    rejected: MOCK_DATA.filter((r) => r.status === "Rejected").length,
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader
        title="Admission Applications"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
          { label: "Admission Applications" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
              <Files weight="fill" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total</p>
              <h3 className="text-xl font-bold text-gray-800">{stats.total}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-2xl">
              <HourglassHigh weight="fill" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Pending</p>
              <h3 className="text-xl font-bold text-gray-800">{stats.pending}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-2xl">
              <CheckCircle weight="fill" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Approved</p>
              <h3 className="text-xl font-bold text-gray-800">{stats.approved}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-2xl">
              <XCircle weight="fill" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Rejected</p>
              <h3 className="text-xl font-bold text-gray-800">{stats.rejected}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Stream</label>
            <select
              value={streamFilter}
              onChange={(e) => { setStreamFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none bg-white"
            >
              <option value="All">All Streams</option>
              <option value="Science">Science</option>
              <option value="Management">Management</option>
              <option value="Humanities">Humanities</option>
              <option value="Law">Law</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">School Type</label>
            <select
              value={schoolTypeFilter}
              onChange={(e) => { setSchoolTypeFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none bg-white"
            >
              <option value="All">All Types</option>
              <option value="Private">Private</option>
              <option value="Government">Government</option>
              <option value="Community">Community</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlass weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                placeholder="Name, Email, Phone..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[1400px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Current Address</th>
                <th className="px-4 py-3">Contact No.</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Parent Contact</th>
                <th className="px-4 py-3">SEE School</th>
                <th className="px-4 py-3">School Address</th>
                <th className="px-4 py-3">School Type</th>
                <th className="px-4 py-3">Stream</th>
                <th className="px-4 py-3">Shift</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {row.initials}
                      </div>
                      <span className="font-medium text-gray-800">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.address}</td>
                  <td className="px-4 py-3 text-gray-600">{row.contactNo}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{row.email}</td>
                  <td className="px-4 py-3 text-gray-600">{row.parentContact}</td>
                  <td className="px-4 py-3 text-gray-600">{row.seeSchool}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-[140px] truncate">{row.schoolAddress}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {row.schoolType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.stream}</td>
                  <td className="px-4 py-3 text-gray-600">{row.shift}</td>
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
                      <button title="View" className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                        <Eye weight="bold" className="w-4 h-4" />
                      </button>
                      <button title="Message" className="p-1.5 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50">
                        <ChatCircleDots weight="bold" className="w-4 h-4" />
                      </button>
                      <button title="WhatsApp" className="p-1.5 rounded text-gray-400 hover:text-green-600 hover:bg-green-50">
                        <WhatsappLogo weight="bold" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                    No applications found matching the criteria.
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

export default AdmissionApplicationsPage;
