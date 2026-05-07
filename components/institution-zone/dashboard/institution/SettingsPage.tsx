"use client";
import React, { useState } from "react";
import SectionHeader from "../shared/SectionHeader";

const SettingsPage: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Settings"
        breadcrumbItems={[{ label: "Dashboard", href: "/institution-zone/dashboard/overview" }, { label: "Settings" }]}
      />

      {/* Change Email */}
      <div className="bg-white rounded-lg border border-gray-100 p-8 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i className="ph ph-envelope text-blue-600" /> Change Email
          </h2>
          <button className="px-6 h-10 bg-[#0000ff] text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
            Update Email
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Email</label>
            <input type="email" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50" value="principal@riversidecollege.edu" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Email Address</label>
            <input type="email" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-600" placeholder="Enter new email address" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input type="password" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm pr-10 focus:outline-none focus:border-blue-600" placeholder="Enter current password to confirm" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i className="ph ph-eye" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg border border-gray-100 p-8 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i className="ph ph-lock-key text-indigo-600" /> Change Password
          </h2>
          <button className="px-6 h-10 bg-[#0000ff] text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
            Update Password
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input type="password" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm pr-10 focus:outline-none focus:border-blue-600" placeholder="Enter current password" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i className="ph ph-eye" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input type="password" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm pr-10 focus:outline-none focus:border-blue-600" placeholder="Enter new password" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i className="ph ph-eye" />
              </button>
            </div>
            <p className="text-gray-400 text-[10px] mt-1">Must contain 1 uppercase, 8+ characters, 1 special character</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <input type="password" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm pr-10 focus:outline-none focus:border-blue-600" placeholder="Re-enter new password" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i className="ph ph-eye" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-gray-100 p-8 mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <i className="ph ph-bell text-yellow-600" /> Notification Settings
        </h2>
        <div className="space-y-3">
          {[
            { title: "Application & Admission Notifications", desc: "Updates on application status and admission processes" },
            { title: "Scholarship Notifications", desc: "Scholarship offers and updates" },
            { title: "Messages & Communication Notifications", desc: "New messages and communications" },
            { title: "Campus Feed Activity Notifications", desc: "Updates from campus activities and posts" },
            { title: "Engagement & Interest Notifications", desc: "Updates on engagement and interests" },
            { title: "Admin & System Alerts", desc: "System alerts and administrative updates" },
            { title: "Performance & Insights Notifications", desc: "Performance metrics and insights" },
            { title: "Reminder Notifications", desc: "Reminders for important deadlines and tasks" },
            { title: "Settings Notifications", desc: "Settings alerts and login notifications" },
            { title: "Notification Preferences & Controls", desc: "Manage notification preferences and controls" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-gray-100 p-8 mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
          Danger Zone
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
            <div>
              <p className="text-sm font-medium text-gray-900">Deactivate Account</p>
              <p className="text-xs text-gray-500">Temporary deactivate your account. You can reactivate anytime.</p>
            </div>
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="px-4 h-10 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              Deactivate
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete Account</p>
              <p className="text-xs text-gray-500">Permanently delete your account and all associated data. This action cannot be undone.</p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 h-10 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/45" onClick={() => setShowDeleteModal(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white px-5 pb-5 pt-6 shadow-lg sm:px-6 sm:pb-6 sm:pt-7">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 sm:h-14 sm:w-14">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-500 text-red-500">
                <span className="text-xl leading-none font-semibold">!</span>
              </div>
            </div>
            <div className="mx-auto max-w-xs text-center">
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Delete Account?
              </h3>
              <p className="mt-2 text-[15px] leading-6 text-slate-500 sm:text-base">
                Are you sure you want to permanently delete your account? All your data will be lost. This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="h-11 rounded-xl bg-slate-100 text-base font-medium text-slate-600 transition-colors hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="h-11 rounded-xl bg-red-600 text-base font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Account Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/45" onClick={() => setShowDeactivateModal(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white px-5 pb-5 pt-6 shadow-lg sm:px-6 sm:pb-6 sm:pt-7">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50 sm:h-14 sm:w-14">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-yellow-500 text-yellow-500">
                <span className="text-xl leading-none font-semibold">!</span>
              </div>
            </div>
            <div className="mx-auto max-w-xs text-center">
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Deactivate Account?
              </h3>
              <p className="mt-2 text-[15px] leading-6 text-slate-500 sm:text-base">
                Your account will be temporarily deactivated. You can reactivate it anytime by logging back in.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="h-11 rounded-xl bg-slate-100 text-base font-medium text-slate-600 transition-colors hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="h-11 rounded-xl bg-yellow-500 text-base font-semibold text-white shadow-sm transition-colors hover:bg-yellow-600"
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
