"use client";
import React, { useState, useEffect } from "react";
import SectionHeader from "../shared/SectionHeader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const SettingsPage: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifSettings, setNotifSettings] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("institutionToken") : null;
  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE_URL}/api/v1/institution/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        const s = d?.data || {};
        setNotifSettings({
          application: s.email_notifications ?? true,
          scholarship: s.email_notifications ?? true,
          messages: true,
          campus: true,
          engagement: true,
          admin: true,
          performance: true,
          reminders: true,
          settings_alerts: true,
          preferences: true,
        });
      })
      .catch(() => {});
  }, [token]);

  const showMsg = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleUpdateEmail = async () => {
    if (!newEmail || !emailPassword) { showMsg("error", "Please fill in all fields"); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/institution/settings/password`, {
        method: "PUT", headers: authHeaders,
        body: JSON.stringify({ current_password: emailPassword, new_password: newPassword || emailPassword }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Failed"); }
      showMsg("success", "Email updated successfully");
      setNewEmail(""); setEmailPassword("");
    } catch (e: any) { showMsg("error", e.message); }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) { showMsg("error", "Please fill in all fields"); return; }
    if (newPassword !== confirmPassword) { showMsg("error", "Passwords do not match"); return; }
    if (newPassword.length < 6) { showMsg("error", "Password must be at least 6 characters"); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/institution/settings/password`, {
        method: "PUT", headers: authHeaders,
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Failed"); }
      showMsg("success", "Password updated successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (e: any) { showMsg("error", e.message); }
  };

  const handleSaveNotif = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/institution/settings`, {
        method: "PUT", headers: authHeaders,
        body: JSON.stringify({ email_notifications: notifSettings.application }),
      });
      if (!res.ok) throw new Error("Failed");
      showMsg("success", "Notification settings saved");
    } catch { showMsg("error", "Failed to save settings"); }
  };

  const notifItems = [
    { key: "application", title: "Application & Admission Notifications", desc: "Updates on application status and admission processes" },
    { key: "scholarship", title: "Scholarship Notifications", desc: "Scholarship offers and updates" },
    { key: "messages", title: "Messages & Communication Notifications", desc: "New messages and communications" },
    { key: "campus", title: "Campus Feed Activity Notifications", desc: "Updates from campus activities and posts" },
    { key: "engagement", title: "Engagement & Interest Notifications", desc: "Updates on engagement and interests" },
    { key: "admin", title: "Admin & System Alerts", desc: "System alerts and administrative updates" },
    { key: "performance", title: "Performance & Insights Notifications", desc: "Performance metrics and insights" },
    { key: "reminders", title: "Reminder Notifications", desc: "Reminders for important deadlines and tasks" },
    { key: "settings_alerts", title: "Settings Notifications", desc: "Settings alerts and login notifications" },
    { key: "preferences", title: "Notification Preferences & Controls", desc: "Manage notification preferences and controls" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Settings"
        breadcrumbItems={[{ label: "Dashboard", href: "/institution-zone/dashboard/overview" }, { label: "Settings" }]}
      />

      {msg && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {msg.text}
        </div>
      )}

      {/* Change Email */}
      <div className="bg-white rounded-lg border border-gray-100 p-8 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i className="ph ph-envelope text-blue-600" /> Change Email
          </h2>
          <button onClick={handleUpdateEmail} className="px-6 h-10 bg-[#0000ff] text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
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
            <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-600" placeholder="Enter new email address" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input type="password" value={emailPassword} onChange={e => setEmailPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm pr-10 focus:outline-none focus:border-blue-600" placeholder="Enter current password to confirm" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
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
          <button onClick={handleUpdatePassword} className="px-6 h-10 bg-[#0000ff] text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
            Update Password
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm pr-10 focus:outline-none focus:border-blue-600" placeholder="Enter current password" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i className="ph ph-eye" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm pr-10 focus:outline-none focus:border-blue-600" placeholder="Enter new password" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i className="ph ph-eye" />
              </button>
            </div>
            <p className="text-gray-400 text-[10px] mt-1">Must contain 1 uppercase, 8+ characters, 1 special character</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-md text-sm pr-10 focus:outline-none focus:border-blue-600" placeholder="Re-enter new password" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i className="ph ph-eye" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-gray-100 p-8 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i className="ph ph-bell text-yellow-600" /> Notification Settings
          </h2>
          <button onClick={handleSaveNotif} className="px-6 h-10 bg-[#0000ff] text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
            Save Settings
          </button>
        </div>
        <div className="space-y-3">
          {notifItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" className="sr-only peer" checked={notifSettings[item.key] ?? true}
                  onChange={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))} />
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
            <button onClick={() => setShowDeactivateModal(true)}
              className="px-4 h-10 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">Deactivate</button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete Account</p>
              <p className="text-xs text-gray-500">Permanently delete your account and all associated data. This action cannot be undone.</p>
            </div>
            <button onClick={() => setShowDeleteModal(true)}
              className="px-4 h-10 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">Delete Account</button>
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
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Delete Account?</h3>
              <p className="mt-2 text-[15px] leading-6 text-slate-500 sm:text-base">Are you sure you want to permanently delete your account? All your data will be lost. This action cannot be undone.</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7">
              <button type="button" onClick={() => setShowDeleteModal(false)}
                className="h-11 rounded-xl bg-slate-100 text-base font-medium text-slate-600 transition-colors hover:bg-slate-200">Cancel</button>
              <button type="button" onClick={() => setShowDeleteModal(false)}
                className="h-11 rounded-xl bg-red-600 text-base font-semibold text-white shadow-sm transition-colors hover:bg-red-700">Yes, Delete</button>
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
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Deactivate Account?</h3>
              <p className="mt-2 text-[15px] leading-6 text-slate-500 sm:text-base">Your account will be temporarily deactivated. You can reactivate it anytime by logging back in.</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7">
              <button type="button" onClick={() => setShowDeactivateModal(false)}
                className="h-11 rounded-xl bg-slate-100 text-base font-medium text-slate-600 transition-colors hover:bg-slate-200">Cancel</button>
              <button type="button" onClick={() => setShowDeactivateModal(false)}
                className="h-11 rounded-xl bg-yellow-500 text-base font-semibold text-white shadow-sm transition-colors hover:bg-yellow-600">Yes, Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
