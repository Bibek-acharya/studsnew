"use client";

import React from "react";
import { CreditCard } from "lucide-react";

const txns = [
  { id: "#TXN-2026-089", initials: "AS", user: "Anjali Sharma", type: "Scholarship Fee", amount: "Rs 50,000", status: "Paid", date: "Apr 23, 2026" },
  { id: "#TXN-2026-088", initials: "RM", user: "Ramesh Magar", type: "Application Fee", amount: "Rs 1,500", status: "Pending", date: "Apr 22, 2026" },
];

export default function PaymentSection() {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <CreditCard size={20} className="text-blue-600" /> Payment Management
        </h2>
        <select className="input-field" style={{ width: "auto" }}>
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard value="Rs 892K" label="Total Received" />
        <SummaryCard value="Rs 125K" label="Pending" />
        <SummaryCard value="Rs 45K" label="Failed" />
        <SummaryCard value="1,247" label="Total Transactions" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Transaction ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">User</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {txns.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{t.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-xs font-bold text-white">{t.initials}</div>
                    <span className="text-gray-900">{t.user}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{t.type}</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900">{t.amount}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${t.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{t.status}</span>
                </td>
                <td className="px-4 py-3 text-center text-gray-500">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}
