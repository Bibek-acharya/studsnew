"use client";

import React from "react";
import { Users, Plus, Search } from "lucide-react";

export default function UserListSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const accessRows = [
    { initials: "AU", name: "Admin User", email: "admin@sowersaction.org", role: "Administrator", status: "Active", lastActive: "Jan 15, 2025" },
  ];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Users size={24} className="text-blue-600" /> Manage Users
        </h2>
        <button type="button" onClick={() => setActiveSection("add-user")} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">
          <Plus size={18} /> Add User
        </button>
      </div>
      <div className="mb-8 flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search users..." className="h-11 w-full rounded-md border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-blue-600" />
        </div>
        <select className="h-11 w-auto rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-blue-600"><option>All Roles</option></select>
        <select className="h-11 w-auto rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-blue-600"><option>All Status</option></select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-gray-600">User</th>
              <th className="px-6 py-4 text-left font-bold text-gray-600">Email</th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">Role</th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">Status</th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">Joined</th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {accessRows.map((row) => (
              <AccessRow key={row.email} {...row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AccessRow({
  initials,
  name,
  email,
  role,
  status,
  lastActive,
}: {
  initials: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}) {
  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white shadow-sm">
            {initials}
          </div>
          <span className="font-bold text-gray-900">{name}</span>
        </div>
      </td>
      <td className="px-4 py-4 font-medium text-gray-500">{email}</td>
      <td className="px-4 py-4 text-center">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">{role}</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600">{status}</span>
      </td>
      <td className="px-4 py-4 text-center text-xs font-semibold uppercase text-gray-400">{lastActive}</td>
    </tr>
  );
}
