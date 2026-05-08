"use client";

import React, { useState } from "react";
import { Clock, CheckCircle, XCircle, Search } from "lucide-react";

interface AdvertiseRequest {
  id: number;
  name: string;
  designation: string;
  contact: string;
  email: string;
  advertiseFor: string;
  status: "Pending" | "Approved" | "Declined";
}

const mockRequests: AdvertiseRequest[] = [
  { id: 1, name: "Dr. Robert Anderson", designation: "Principal", contact: "+1 617 555 0100", email: "robert.anderson@mit.edu", advertiseFor: "Homepage Banner", status: "Pending" },
  { id: 2, name: "Dr. Sarah Johnson", designation: "Dean of Admissions", contact: "+1 650 555 0200", email: "sarah.johnson@stanford.edu", advertiseFor: "Sidebar Featured", status: "Approved" },
  { id: 3, name: "Mr. Ramesh Adhikari", designation: "Principal", contact: "+977 985 100 1234", email: "ramesh.adhikari@kist.edu.np", advertiseFor: "Sponsored Listing", status: "Pending" },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-green-100 text-green-700",
  Declined: "bg-red-100 text-red-700",
};

export default function AdvertiseRequestSection() {
  const [requests, setRequests] = useState<AdvertiseRequest[]>(mockRequests);

  const handleAction = (id: number, action: "Approved" | "Declined") => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Advertise Request</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Advertisement Requests from Institutions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase">S.N</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Designation</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact Number</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Advertise For</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req, idx) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-4 text-center text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-3 py-4"><span className="text-sm font-medium text-gray-900">{req.name}</span></td>
                  <td className="px-3 py-4 text-sm text-gray-600">{req.designation}</td>
                  <td className="px-3 py-4 text-sm text-gray-600">{req.contact}</td>
                  <td className="px-3 py-4 text-sm text-gray-600">{req.email}</td>
                  <td className="px-3 py-4 text-sm text-gray-600">{req.advertiseFor}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[req.status]}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    {req.status === "Pending" ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleAction(req.id, "Approved")} className="text-green-600 hover:underline text-sm font-medium">Approve</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => handleAction(req.id, "Declined")} className="text-red-600 hover:underline text-sm font-medium">Decline</button>
                      </div>
                    ) : (
                      <button className="text-blue-600 hover:underline text-sm font-medium">View</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
