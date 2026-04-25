"use client";

import React from "react";
import { Clock, UserPlus, CheckCircle, CreditCard } from "lucide-react";

const activities = [
  { icon: <UserPlus size={18} className="text-blue-600" />, bg: "bg-blue-100", title: "New user registered", meta: "Anjali Sharma created an account", time: "2 hours ago" },
  { icon: <CheckCircle size={18} className="text-green-600" />, bg: "bg-green-100", title: "Scholarship approved", meta: "Admin approved scholarship #SCH-2026-045", time: "5 hours ago" },
  { icon: <CreditCard size={18} className="text-yellow-600" />, bg: "bg-yellow-100", title: "Payment received", meta: "Rs 50,000 received for scholarship fee", time: "2 days ago" },
  { icon: <UserPlus size={18} className="text-purple-600" />, bg: "bg-purple-100", title: "New college registered", meta: "Sowers College registered +2 program", time: "3 days ago" },
];

export default function HistorySection() {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Clock size={20} className="text-blue-600" /> Activity History
        </h2>
        <div className="flex items-center gap-2">
          <select className="input-field" style={{ width: "auto" }}>
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
          <input type="date" className="input-field" style={{ width: "auto" }} />
        </div>
      </div>
      <div className="space-y-3">
        {activities.map((a) => (
          <div key={a.title + a.time} className="flex items-start gap-3 rounded-md bg-gray-50 p-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${a.bg}`}>
              {a.icon}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-semibold text-gray-900">{a.title}</p>
                <span className="text-xs text-gray-500">{a.time}</span>
              </div>
              <p className="text-sm text-gray-600">{a.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
