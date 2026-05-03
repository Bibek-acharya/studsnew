"use client";

import React, { useState, memo } from "react";
import { Home, Mail, Key, Bell } from "lucide-react";
import { providerRbacApi } from "@/services/providerRbac";

const Settings: React.FC = memo(() => {
  const [currentEmail, setCurrentEmail] = useState("admin@sowersaction.org.np");
  const [newEmail, setNewEmail] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [curPassword, setCurPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [conNewPassword, setConNewPassword] = useState("");
  const [notifs, setNotifs] = useState({ email: true, newApp: true, payment: true, deadline: true });
  const [twoFA, setTwoFA] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Settings</span>
        </div>
      </div>

      {/* Change Email */}
      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" /> Change Email
          </h2>
          <button onClick={() => alert("Email updated successfully!")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Update Email</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Email</label>
            <input type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={currentEmail} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Email Address</label>
            <input type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Enter new email address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Enter current password to confirm" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" /> Change Password
          </h2>
          <button 
            onClick={async () => {
              setPassError("");
              setPassSuccess("");
              if (!curPassword) {
                setPassError("Current password is required");
                return;
              }
              if (!newPassword) {
                setPassError("New password is required");
                return;
              }
              if (newPassword.length < 6) {
                setPassError("New password must be at least 6 characters");
                return;
              }
              if (newPassword !== conNewPassword) {
                setPassError("New passwords do not match");
                return;
              }
              setPassLoading(true);
              try {
                await providerRbacApi.changePassword({
                  current_password: curPassword,
                  new_password: newPassword,
                });
                setPassSuccess("Password changed successfully!");
                setCurPassword("");
                setNewPassword("");
                setConNewPassword("");
              } catch (err: any) {
                setPassError(err.message || "Failed to change password");
              } finally {
                setPassLoading(false);
              }
            }} 
            disabled={passLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {passLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
        {passError && <p className="text-red-600 text-sm mb-4">{passError}</p>}
        {passSuccess && <p className="text-green-600 text-sm mb-4">{passSuccess}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Enter current password" value={curPassword} onChange={(e) => setCurPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Re-enter new password" value={conNewPassword} onChange={(e) => setConNewPassword(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-600" /> Notification Settings
          </h2>
          <button onClick={() => alert("Notification settings saved!")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Save Changes</button>
        </div>
        <div className="space-y-3">
          {[
            { key: "email", label: "Email Notifications", desc: "Send updates to providers and applicants via email" },
            { key: "newApp", label: "New Application Alert", desc: "Get notified when a new application is submitted" },
            { key: "payment", label: "Payment Confirmation Alert", desc: "Notify when application fee is received" },
            { key: "deadline", label: "Deadline Reminder", desc: "Auto-remind applicants 3 days before deadline" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{n.label}</p>
                <p className="text-xs text-gray-500">{n.desc}</p>
              </div>
              <Toggle checked={(notifs as any)[n.key]} onChange={(v) => setNotifs((prev) => ({ ...prev, [n.key]: v }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance & Data */}
      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Maintenance & Data
          </h2>
          <button onClick={() => alert("Maintenance settings saved!")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Save Changes</button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Export All Data</p>
              <p className="text-xs text-gray-500">Download applications, scholarships, and analytics</p>
            </div>
            <button onClick={() => alert("Exporting data...")} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">Export CSV</button>
          </div>
          <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
            <div>
              <p className="text-sm font-medium text-red-700">Delete All Data</p>
              <p className="text-xs text-red-500">Permanently remove all scholarship and application data</p>
            </div>
            <button
              onClick={() => { if (confirm("Are you absolutely sure? This action cannot be undone.")) alert("Data deleted successfully!"); }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Delete All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

Settings.displayName = "Settings";

export default Settings;
