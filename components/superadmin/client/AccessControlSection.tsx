"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

const permissions = [
  { title: "Scholarship Management", desc: "Create, edit, and manage scholarships", checked: true },
  { title: "User Management", desc: "Manage users and assign roles" },
  { title: "College Management", desc: "Add and manage educational institutions", checked: true },
  { title: "Course Management", desc: "Create and modify course listings" },
  { title: "News & Blog Management", desc: "Publish and manage content", checked: true },
  { title: "Payment Management", desc: "View and manage transactions" },
];

export default function AccessControlSection() {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <ShieldCheck size={20} className="text-blue-600" /> Access Control
      </h2>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Select User</label>
          <select className="input-field">
            <option value="">Choose a user</option>
            <option value="1">Admin User</option>
            <option value="2">Editor User</option>
            <option value="3">Viewer User</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select className="input-field">
            <option value="">Select role</option>
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Permissions</label>
        <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
          {permissions.map((p) => (
            <div key={p.title} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">{p.title}</p>
                <p className="text-sm text-gray-500">{p.desc}</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="sr-only peer" defaultChecked={p.checked} />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
