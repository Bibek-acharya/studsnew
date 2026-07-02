"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Mail,
  Phone,
  User,
  CalendarDays,
  Search,
} from "lucide-react";
import { apiService } from "@/services/api";

interface InquiryItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  type?: string;
  status: string;
  created_at: string;
}

export default function MessageInquirySection() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<InquiryItem | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    apiService
      .getContactInquiries()
      .then((res) => setInquiries((res as any)?.inquiries || []))
      .catch(() => setInquiries([]))
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: number) => {
    setUpdatingId(id);
    try {
      await apiService.updateContactInquiryStatus(id, "read");
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "read" } : i)),
      );
      setSelected((prev) =>
        prev?.id === id ? { ...prev, status: "read" } : prev,
      );
    } catch {
      /* silently fail */
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = inquiries.filter((i) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.name.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      i.phone.includes(q) ||
      i.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-full gap-6">
      {/* List */}
      <div
        className={`flex flex-col ${selected ? "hidden lg:flex w-full lg:w-96" : "w-full"} shrink-0`}
      >
        <div className="rounded-md border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <MessageSquare size={20} className="text-blue-600" />
              Messages & Inquiries
              {inquiries.length > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-600">
                  {inquiries.length}
                </span>
              )}
            </h2>
          </div>

          <div className="border-b border-gray-100 px-5 py-3">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inquiries..."
                className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-gray-400">
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <MessageSquare size={32} className="mb-2 opacity-50" />
                <p className="text-sm">
                  {search ? "No matching inquiries" : "No inquiries yet"}
                </p>
              </div>
            ) : (
              filtered.map((inquiry) => (
                <button
                  key={inquiry.id}
                  onClick={() =>
                    setSelected(selected?.id === inquiry.id ? null : inquiry)
                  }
                  className={`w-full border-b border-gray-50 px-5 py-4 text-left transition-colors hover:bg-gray-50 ${
                    selected?.id === inquiry.id ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white">
                      {inquiry.name.charAt(0).toUpperCase()}
                      {inquiry.name.split(" ").pop()?.charAt(0).toUpperCase() ||
                        ""}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {inquiry.name}
                        </p>
                        <span className="shrink-0 text-[11px] text-gray-400">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[13px] text-gray-500">
                        {inquiry.message}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            inquiry.status === "new" ||
                            inquiry.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : inquiry.status === "read" ||
                                  inquiry.status === "resolved"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {inquiry.status || "new"}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {inquiry.email}
                        </span>
                      </div>
                      {(inquiry.status === "new" ||
                        inquiry.status === "pending") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(inquiry.id);
                          }}
                          disabled={updatingId === inquiry.id}
                          className="mt-1.5 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                          {updatingId === inquiry.id ? "..." : "Mark as Read"}
                        </button>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detail */}
      {selected && (
        <div className="min-w-0 flex-1">
          <div className="rounded-md border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 className="text-base font-bold text-gray-900">
                Inquiry Details
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="lg:hidden rounded-md px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100"
              >
                Back
              </button>
            </div>

            <div className="p-5">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xl font-bold text-white">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {selected.name}
                  </h4>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        selected.status === "new" ||
                        selected.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : selected.status === "read" ||
                              selected.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {selected.status || "new"}
                    </span>
                    {(selected.status === "new" ||
                      selected.status === "pending") && (
                      <button
                        onClick={() => markAsRead(selected.id)}
                        disabled={updatingId === selected.id}
                        className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                      >
                        {updatingId === selected.id ? "..." : "Mark as Read"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2.5">
                  <Mail size={15} className="shrink-0 text-gray-400" />
                  <span className="truncate text-sm text-gray-700">
                    {selected.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2.5">
                  <Phone size={15} className="shrink-0 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {selected.phone || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2.5">
                  <CalendarDays size={15} className="shrink-0 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {new Date(selected.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2.5">
                  <User size={15} className="shrink-0 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {selected.subject || "Contact Form Inquiry"}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="mb-2 text-sm font-semibold text-gray-700">
                  Message
                </h5>
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {selected.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
