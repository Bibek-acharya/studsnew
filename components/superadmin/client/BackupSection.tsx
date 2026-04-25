"use client";

import React from "react";
import { Database, Download, Upload } from "lucide-react";

const backups = [
  { name: "backup_2026-04-20.sql", size: "245 MB", date: "Apr 20, 2026" },
  { name: "backup_2026-04-13.sql", size: "240 MB", date: "Apr 13, 2026" },
];

export default function BackupSection() {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <Database size={20} className="text-blue-600" /> Backup & Restore
      </h2>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-md border border-gray-200 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100">
              <Download size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Create Backup</h3>
              <p className="text-xs text-gray-500">Download database backup</p>
            </div>
          </div>
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            <Download size={16} /> Download Backup
          </button>
        </div>
        <div className="rounded-md border border-gray-200 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100">
              <Upload size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Restore Backup</h3>
              <p className="text-xs text-gray-500">Upload backup file</p>
            </div>
          </div>
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700">
            <Upload size={16} /> Upload Backup
          </button>
        </div>
      </div>
      <div className="rounded-md border border-gray-200 p-5">
        <h3 className="mb-4 font-semibold text-gray-900">Recent Backups</h3>
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Backup Name</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Size</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Created</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {backups.map((b) => (
              <tr key={b.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                <td className="px-4 py-3 text-center text-gray-600">{b.size}</td>
                <td className="px-4 py-3 text-center text-gray-500">{b.date}</td>
                <td className="px-4 py-3 text-center">
                  <button type="button" className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50"><Download size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
