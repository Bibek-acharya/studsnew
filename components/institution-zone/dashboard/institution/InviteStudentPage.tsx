"use client";

import React, { useState, useCallback } from "react";
import { Trash, X } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";

interface Student {
  id: number;
  name: string;
  number: string;
  email: string;
  course: string;
  address: string;
  status: "Pending" | "Delivered";
}

const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "Rahul Sharma", number: "9841234567", email: "rahul@example.com", course: "B.Sc. Computer Science", address: "Baneshwor, Kathmandu", status: "Pending" },
  { id: 2, name: "Pooja Joshi", number: "9845678901", email: "pooja@example.com", course: "BBA Finance", address: "Pokhara, Kaski", status: "Pending" },
  { id: 3, name: "Kiran Raut", number: "9807654321", email: "kiran@example.com", course: "B.Sc. CSIT", address: "Birgunj, Parsa", status: "Pending" },
];

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
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const InviteStudentPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [inviteModal, setInviteModal] = useState<{
    isOpen: boolean;
    student: Student | null;
    message: string;
  }>({ isOpen: false, student: null, message: "" });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    studentId: number | null;
    studentName: string;
  }>({ isOpen: false, studentId: null, studentName: "" });

  const openInviteModal = useCallback((student: Student) => {
    setInviteModal({ isOpen: true, student, message: "" });
  }, []);

  const closeInviteModal = useCallback(() => {
    setInviteModal({ isOpen: false, student: null, message: "" });
  }, []);

  const sendInvitation = useCallback(() => {
    if (!inviteModal.message.trim()) return;
    if (!inviteModal.student) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === inviteModal.student!.id ? { ...s, status: "Delivered" } : s
      )
    );
    closeInviteModal();
  }, [inviteModal, closeInviteModal]);

  const openDeleteModal = useCallback((student: Student) => {
    setDeleteModal({ isOpen: true, studentId: student.id, studentName: student.name });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, studentId: null, studentName: "" });
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteModal.studentId !== null) {
      setStudents((prev) => prev.filter((s) => s.id !== deleteModal.studentId));
    }
    closeDeleteModal();
  }, [deleteModal.studentId, closeDeleteModal]);

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
          <h3 className="text-lg font-bold text-gray-800">Student Invitation List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Number</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Interested Course</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Address</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-sm">
                    No students to invite.
                  </td>
                </tr>
              ) : students.map((student) => {
                const avatarColors = getAvatarColors(student.name);
                return (
                  <tr key={student.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${avatarColors.bg} flex items-center justify-center ${avatarColors.text} font-bold text-xs`}
                        >
                          {getInitials(student.name)}
                        </div>
                        <span className="font-medium text-gray-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.number}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.course}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.address}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          student.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openDeleteModal(student)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                        {student.status === "Pending" ? (
                          <button
                            onClick={() => openInviteModal(student)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                          >
                            Send Invites
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium cursor-default">
                            Delivered
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeDeleteModal(); }}
        >
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Trash className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Student</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete &ldquo;{deleteModal.studentName}&rdquo;? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {inviteModal.isOpen && inviteModal.student && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeInviteModal(); }}
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Send Invitation</h2>
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
                <div className="font-semibold text-sm text-gray-900">{inviteModal.student.name}</div>
                <div className="text-xs text-gray-500">{inviteModal.student.course}</div>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invitation Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={inviteModal.message}
                onChange={(e) => setInviteModal((prev) => ({ ...prev, message: e.target.value }))}
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
                disabled={!inviteModal.message.trim()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
