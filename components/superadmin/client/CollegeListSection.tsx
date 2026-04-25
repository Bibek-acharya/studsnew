"use client";

import React from "react";
import {
  Building2,
  GraduationCap,
  Search,
  Filter,
  Plus,
  Download,
  Mail,
  Check,
  Trash2,
  MapPin,
  ChevronRight,
  Eye,
  MessageSquare,
} from "lucide-react";

const colleges = [
  { sn: 1, date: "Apr 15, 2026", name: "Sowers College", reg: "12345/078", type: "Private", level: "+2", address: "Kathmandu, Ward-8", students: 245, status: "Verified", label: "SC" },
  { sn: 2, date: "Apr 12, 2026", name: "Kathmandu College", reg: "67890/079", type: "Community", level: "Bachelor", address: "Lalitpur, Ward-5", students: 180, status: "Pending", label: "KC" },
];

export default function CollegeListSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Building2 size={24} className="text-blue-600" /> College List
          </h2>
          <p className="mt-1 text-sm text-gray-500">Manage and track all registered colleges in the system</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
            <Download size={18} /> Export
          </button>
          <button type="button" onClick={() => setActiveSection("add-college")} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200">
            <Plus size={18} /> Add College
          </button>
        </div>
      </div>

      <div className="mb-8 flex items-center gap-2 overflow-x-auto border-b border-gray-100 pb-2">
        <TabItem label="+2 College" count={12} active icon={<GraduationCap size={16} />} />
        <TabItem label="Bachelor" count={8} />
        <TabItem label="A Level" count={3} />
        <TabItem label="CTEVT" count={5} />
        <TabItem label="Master" count={4} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-5">
        <div className="relative md:col-span-2">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by college name, reg. number..." className="h-11 w-full rounded-md border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-blue-600" />
        </div>
        <select className="h-11 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-blue-600">
          <option>All Types</option>
        </select>
        <select className="h-11 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-blue-600">
          <option>All Payment Status</option>
        </select>
        <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-md bg-gray-100 px-4 text-sm font-bold text-gray-700 hover:bg-gray-200">
          <Filter size={16} /> More Filters
        </button>
      </div>

      <div className="mb-6 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <div className="flex items-center gap-4">
          <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm font-semibold text-gray-700">4 colleges selected</span>
        </div>
        <div className="flex items-center gap-2">
          <BulkBtn icon={<Mail size={14} />} label="Send Email" />
          <BulkBtn icon={<Check size={14} />} label="Verify Selected" />
          <BulkBtn icon={<Trash2 size={14} />} label="Delete" className="text-red-600" />
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-4 text-left"><input type="checkbox" className="h-4 w-4" /></th>
                <th className="w-16 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">S.N</th>
                <th className="w-44 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Register Date</th>
                <th className="w-80 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">College Name</th>
                <th className="w-32 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Type</th>
                <th className="w-32 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Level</th>
                <th className="w-64 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Address</th>
                <th className="w-44 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Students</th>
                <th className="w-32 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Status</th>
                <th className="w-48 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {colleges.map((college) => (
                <CollegeRow key={college.sn} {...college} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500">
          Showing <span className="font-bold text-gray-900">1-2</span> of <span className="font-bold text-gray-900">24</span> colleges
        </p>
        <div className="flex items-center gap-2">
          <PageBtn icon={<ChevronRight size={16} className="rotate-180" />} disabled />
          <PageBtn label="1" active />
          <PageBtn label="2" />
          <PageBtn label="3" />
          <PageBtn icon={<ChevronRight size={16} />} />
        </div>
      </div>
    </div>
  );
}

function TabItem({
  label,
  count,
  active,
  icon,
}: {
  label: string;
  count: number;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`flex cursor-not-allowed items-center gap-2 whitespace-nowrap rounded-xl border px-5 py-2.5 transition-all ${
      active ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100" : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50"
    }`}>
      {icon}
      <span className="text-sm font-bold">{label}</span>
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? "bg-white/20" : "bg-gray-100"}`}>{count}</span>
    </div>
  );
}

function BulkBtn({ icon, label, className = "" }: { icon: React.ReactNode; label: string; className?: string }) {
  return (
    <button type="button" className={`flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-1.5 text-xs font-bold transition-all hover:bg-gray-50 ${className}`}>
      {icon} {label}
    </button>
  );
}

function CollegeRow({
  sn,
  date,
  name,
  reg,
  type,
  level,
  address,
  students,
  status,
  label,
}: {
  sn: number;
  date: string;
  name: string;
  reg: string;
  type: string;
  level: string;
  address: string;
  students: number;
  status: string;
  label: string;
}) {
  return (
    <tr className="group transition-colors hover:bg-gray-50">
      <td className="px-4 py-4"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600" /></td>
      <td className="px-4 py-4 font-bold text-gray-400">{sn}</td>
      <td className="px-4 py-4">
        <p className="font-bold text-gray-900">{date}</p>
        <p className="text-[10px] font-bold uppercase text-gray-400">10:30 AM</p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600 transition-transform group-hover:scale-105">{label}</div>
          <div>
            <p className="font-extrabold leading-tight text-gray-900">{name}</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase text-gray-400">Reg: {reg}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="rounded-lg bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">{type}</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="rounded-lg bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600">{level}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-start gap-2">
          <MapPin size={14} className="mt-0.5 text-red-400" />
          <span className="font-medium leading-relaxed text-gray-600">{address}</span>
        </div>
      </td>
      <td className="px-4 py-4 text-center font-extrabold text-gray-900">{students}</td>
      <td className="px-4 py-4 text-center">
        <label className="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" className="sr-only peer" defaultChecked={status === "Verified"} />
          <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white" />
        </label>
      </td>
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-2 scale-90 transition-transform group-hover:scale-100">
          <ActionBtn icon={<EditIcon />} color="blue" />
          <ActionBtn icon={<MessageSquare size={16} />} color="green" />
          <ActionBtn icon={<Eye size={16} />} color="purple" />
          <ActionBtn icon={<Trash2 size={16} />} color="red" />
        </div>
      </td>
    </tr>
  );
}

function ActionBtn({ icon, color }: { icon: React.ReactNode; color: "blue" | "green" | "purple" | "red" }) {
  const colors = {
    blue: "text-blue-600 hover:bg-blue-50",
    green: "text-green-600 hover:bg-green-50",
    purple: "text-purple-600 hover:bg-purple-50",
    red: "text-red-600 hover:bg-red-50",
  };
  return (
    <button type="button" className={`rounded-lg p-2 transition-all ${colors[color]}`}>
      {icon}
    </button>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function PageBtn({ label, icon, active, disabled }: { label?: string; icon?: React.ReactNode; active?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition-all ${
        active ? "border-blue-600 bg-blue-600 text-white shadow-md" : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50"
      } ${disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer"}`}
    >
      {icon || label}
    </button>
  );
}
