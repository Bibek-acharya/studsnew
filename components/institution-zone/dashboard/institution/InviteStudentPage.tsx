"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Trash, X } from "@phosphor-icons/react";
import { CheckCircle, Loader2 } from "lucide-react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("institutionToken");
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((p) => p.length > 0)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function getAvatarColors(name: string): { bg: string; text: string } {
  const colors = [
    { bg: "bg-blue-100", text: "text-blue-600" },
    { bg: "bg-pink-100", text: "text-pink-600" },
    { bg: "bg-amber-100", text: "text-amber-600" },
    { bg: "bg-green-100", text: "text-green-600" },
    { bg: "bg-purple-100", text: "text-purple-600" },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface StudentEntry {
  user_id: number;
  name: string;
  email?: string;
  phone?: string;
  course?: string;
  address?: string;
  invited: boolean;
  invite_id?: number;
}

const InviteStudentPage: React.FC = () => {
  const [students, setStudents] = useState<StudentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [inviteModal, setInviteModal] = useState<{
    isOpen: boolean;
    student: StudentEntry | null;
    message: string;
  }>({ isOpen: false, student: null, message: "" });

  const fetchData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    let contacts: any[] = [];
    let sentInvites: any[] = [];
    try {
      const msgRes = await fetch(
        `${API_BASE_URL}/api/v1/institution/messages/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ).then((r) => r.json());
      contacts = msgRes?.data || [];
    } catch {
      /* skip */
    }
    try {
      const inviteRes = await fetch(
        `${API_BASE_URL}/api/v1/institution/invites`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ).then((r) => r.json());
      sentInvites = inviteRes?.data?.invites || inviteRes?.data || [];
    } catch {
      /* skip */
    }

    const invitedUserIds = new Set(sentInvites.map((i: any) => i.user_id));
    const inviteMap: Record<number, number> = {};
    sentInvites.forEach((i: any) => {
      if (i.user_id) inviteMap[i.user_id] = i.id;
    });

    const entries: StudentEntry[] = contacts.map((c: any) => ({
      user_id: c.user_id,
      name: c.name || `User #${c.user_id}`,
      email: c.email || "",
      phone: c.phone || "",
      course: c.course || c.last_message?.slice(0, 40) || "",
      address: c.address || "",
      invited: invitedUserIds.has(c.user_id),
      invite_id: inviteMap[c.user_id],
    }));
    setStudents(entries);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openInviteModal = useCallback((student: StudentEntry) => {
    setInviteModal({ isOpen: true, student, message: "" });
  }, []);

  const closeInviteModal = useCallback(() => {
    setInviteModal({ isOpen: false, student: null, message: "" });
  }, []);

  const sendInvitation = useCallback(async () => {
    if (!inviteModal.message.trim() || !inviteModal.student) return;
    const token = getToken();
    if (!token) return;

    setSendingId(inviteModal.student.user_id);
    try {
      await fetch(`${API_BASE_URL}/api/v1/institution/invites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: inviteModal.student.user_id,
          title: `Invitation from your institution`,
          message: inviteModal.message,
          type: "admission",
        }),
      });
      setStudents((prev) =>
        prev.map((s) =>
          s.user_id === inviteModal.student!.user_id
            ? { ...s, invited: true }
            : s,
        ),
      );
      closeInviteModal();
    } catch {
      /* skip */
    }
    setSendingId(null);
  }, [inviteModal, closeInviteModal]);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Send Invites"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Send Invites" },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            Student Invitation List
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Students who have sent inquiries to your institution
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Student Name
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Number
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Interested Course
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Address
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500 text-sm"
                  >
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500 text-sm"
                  >
                    No student inquiries yet.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const avatarColors = getAvatarColors(student.name);
                  return (
                    <tr key={student.user_id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ${avatarColors.bg} flex items-center justify-center ${avatarColors.text} font-bold text-xs`}
                          >
                            {getInitials(student.name)}
                          </div>
                          <span className="font-medium text-gray-800">
                            {student.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.phone || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.email || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.course || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.address || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            student.invited
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {student.invited ? "Invited" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {student.invited ? (
                            <span className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium cursor-default flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 fill-current" />{" "}
                              Invited
                            </span>
                          ) : (
                            <button
                              onClick={() => openInviteModal(student)}
                              disabled={sendingId === student.user_id}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                              {sendingId === student.user_id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : null}
                              Send Invite
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModal.isOpen && inviteModal.student && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeInviteModal();
          }}
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Send Invitation
              </h2>
              <button
                onClick={closeInviteModal}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 p-3 px-4 rounded-lg border border-gray-200 mb-4 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${getAvatarColors(inviteModal.student.name).bg} flex items-center justify-center ${getAvatarColors(inviteModal.student.name).text} font-bold text-xs shrink-0`}
              >
                {getInitials(inviteModal.student.name)}
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900">
                  {inviteModal.student.name}
                </div>
                <div className="text-xs text-gray-500">
                  {inviteModal.student.course || "Inquiry"}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invitation Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={inviteModal.message}
                onChange={(e) =>
                  setInviteModal((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                rows={4}
                placeholder="Write your invitation message..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-vertical"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeInviteModal}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={sendInvitation}
                disabled={!inviteModal.message.trim() || sendingId !== null}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {sendingId !== null && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteStudentPage;
