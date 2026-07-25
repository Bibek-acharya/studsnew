"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import ConfirmDialog from "@/components/user/dashboard/ConfirmDialog";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Laptop,
  Lock,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { Toast } from "@/components/ui/Toast";

type TabId = "security" | "notifications" | "danger";

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

export default function SettingsSection() {
  const [activeTab, setActiveTab] = useState<TabId>("security");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newsletter: true,
    profileVisibility: "friends",
    compactSidebar: false,
    applicationUpdates: true,
    messagesFromColleges: true,
    scholarshipAlerts: true,
    systemNotifications: true,
    emailDigest: false,
    timezone: "Pacific Time (PT)",
    dateFormat: "MM/DD/YYYY",
  });
  const [activeModal, setActiveModal] = useState<null | "totp">(null);
  const [dangerAction, setDangerAction] = useState<
    "deactivate" | "delete" | null
  >(null);
  const [toastMessage, setToastMessage] = useState("");
  const [totpData, setTotpData] = useState<{
    secret: string;
    qr_uri: string;
    account: string;
  } | null>(null);
  const [totpVerifyCode, setTotpVerifyCode] = useState("");
  const [totpGenerating, setTotpGenerating] = useState(false);
  const [totpEnabling, setTotpEnabling] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpDisableCode, setTotpDisableCode] = useState("");
  const [totpDisablePassword, setTotpDisablePassword] = useState("");
  const [showDisableTOTP, setShowDisableTOTP] = useState(false);
  const [sessions, setSessions] = useState<
    Array<{
      id: number;
      device_name: string;
      device_type: string;
      browser: string;
      location: string;
      ip_address: string;
      is_current: boolean;
      last_active_at: string;
      created_at: string;
    }>
  >([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 3000);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      showToast("Passwords do not match");
      return;
    }
    try {
      await apiService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      showToast("Password updated successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to update password");
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await apiService.getLoginSessions();
        setSessions(res.data || []);
      } catch {
        // ignore - show empty state
      } finally {
        setSessionsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleGenerateTOTP = async () => {
    setTotpGenerating(true);
    try {
      const res = await apiService.generateTOTPSecret();
      setTotpData(res.data);
      setActiveModal("totp");
      setTotpVerifyCode("");
    } catch (err: any) {
      showToast(err.message || "Failed to setup 2FA");
    } finally {
      setTotpGenerating(false);
    }
  };

  const handleEnableTOTP = async () => {
    if (!totpVerifyCode || totpVerifyCode.length < 6) {
      showToast("Please enter a valid 6-digit code");
      return;
    }
    setTotpEnabling(true);
    try {
      await apiService.enableTOTP(totpVerifyCode);
      setTotpEnabled(true);
      setActiveModal(null);
      showToast("Two-factor authentication enabled successfully");
    } catch (err: any) {
      showToast(err.message || "Failed to verify code");
    } finally {
      setTotpEnabling(false);
    }
  };

  const handleDisableTOTP = async () => {
    if (!totpDisableCode || totpDisableCode.length < 6) {
      showToast("Please enter a valid 6-digit code");
      return;
    }
    if (!totpDisablePassword) {
      showToast("Please enter your password");
      return;
    }
    setTotpEnabling(true);
    try {
      await apiService.disableTOTP(totpDisablePassword, totpDisableCode);
      setTotpEnabled(false);
      setShowDisableTOTP(false);
      setTotpDisableCode("");
      setTotpDisablePassword("");
      showToast("Two-factor authentication disabled");
    } catch (err: any) {
      showToast(err.message || "Failed to disable 2FA");
    } finally {
      setTotpEnabling(false);
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    try {
      await apiService.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      showToast("Session revoked");
    } catch {
      showToast("Failed to revoke session");
    }
  };

  const handleRevokeAll = async () => {
    try {
      await apiService.revokeAllSessions();
      setSessions([]);
      showToast("All other sessions logged out");
    } catch {
      showToast("Failed to logout other sessions");
    }
  };

  const formatLastActive = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Settings</span>
        </div>
      </div>
      <div className="flex gap-1 bg-slate-100 p-1 rounded-md mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === tab.id
                ? "bg-white text-primary"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-md  border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" /> Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create new password"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleChangePassword}
                className="mt-4 bg-indigo-600 text-white px-4 py-2.5 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Update Password
              </button>
            </div>

            <div className="bg-white rounded-md border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Two-Factor
                Authentication
              </h3>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-slate-800">
                    Authenticator App
                  </p>
                  <p className="text-sm text-slate-500">
                    {totpEnabled
                      ? "Two-factor authentication is active. Your account is protected."
                      : "Add an extra layer of security using Google Authenticator, Authy, or similar."}
                  </p>
                </div>
                {totpEnabled ? (
                  <button
                    onClick={() => setShowDisableTOTP(true)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm font-semibold hover:bg-red-100 transition-colors"
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateTOTP}
                    disabled={totpGenerating}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {totpGenerating ? "Setting up..." : "Enable"}
                  </button>
                )}
              </div>
            </div>

            {showDisableTOTP && (
              <div className="bg-white rounded-md border border-slate-200 p-6">
                <h3 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Disable Two-Factor
                  Authentication
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Enter your password and a current code from your authenticator
                  app to disable 2FA.
                </p>
                <div className="space-y-3">
                  <input
                    value={totpDisablePassword}
                    onChange={(e) => setTotpDisablePassword(e.target.value)}
                    type="password"
                    placeholder="Current password"
                    className="w-full rounded-md border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  />
                  <input
                    value={totpDisableCode}
                    onChange={(e) =>
                      setTotpDisableCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    type="text"
                    inputMode="numeric"
                    placeholder="Authenticator code (000000)"
                    className="w-full rounded-md border border-slate-200 px-4 py-2.5 text-sm text-center tracking-widest outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDisableTOTP(false);
                        setTotpDisableCode("");
                        setTotpDisablePassword("");
                      }}
                      className="flex-1 rounded-md bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDisableTOTP}
                      disabled={
                        totpEnabling ||
                        totpDisableCode.length < 6 ||
                        !totpDisablePassword
                      }
                      className="flex-1 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {totpEnabling ? "Disabling..." : "Disable 2FA"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-md border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Laptop className="w-5 h-5 text-indigo-600" /> Login Activity
              </h3>

              {sessionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">
                  No active sessions found.
                </p>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between py-2 border-t border-slate-100 first:border-t-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center">
                          {session.device_type === "mobile" ? (
                            <Smartphone className="w-5 h-5 text-slate-500" />
                          ) : (
                            <Laptop className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {session.device_name}
                            {session.is_current && (
                              <span className="ml-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                Active now
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-slate-500">
                            {session.location} • {session.browser}
                            {!session.is_current && session.last_active_at && (
                              <> • {formatLastActive(session.last_active_at)}</>
                            )}
                          </p>
                        </div>
                      </div>
                      {!session.is_current && (
                        <button
                          onClick={() => handleRevokeSession(session.id)}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleRevokeAll}
                className="mt-4 w-full border border-red-500 text-red-600 px-4 py-2.5 rounded-md text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                Logout from all devices
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-md  border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" /> Notification
                Preferences
              </h3>
              <div className="space-y-0 divide-y divide-slate-100">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-800">
                      Application Updates
                    </p>
                    <p className="text-sm text-slate-500">
                      Get notified when your application status changes.
                    </p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      checked={settings.applicationUpdates}
                      onChange={() => toggleSetting("applicationUpdates")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-800">
                      Messages from Colleges
                    </p>
                    <p className="text-sm text-slate-500">
                      Receive alerts when an institution contacts you.
                    </p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      checked={settings.messagesFromColleges}
                      onChange={() => toggleSetting("messagesFromColleges")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-800">
                      Scholarship Alerts
                    </p>
                    <p className="text-sm text-slate-500">
                      New matching scholarships and deadlines.
                    </p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      checked={settings.scholarshipAlerts}
                      onChange={() => toggleSetting("scholarshipAlerts")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-800">
                      System Notifications
                    </p>
                    <p className="text-sm text-slate-500">
                      Platform updates, maintenance, and security alerts.
                    </p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      checked={settings.systemNotifications}
                      onChange={() => toggleSetting("systemNotifications")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-800">
                      Email Notifications
                    </p>
                    <p className="text-sm text-slate-500">
                      Send a daily digest of unread notifications to email.
                    </p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      checked={settings.emailDigest}
                      onChange={() => toggleSetting("emailDigest")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 rounded-md  mt-4 flex justify-end">
              <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === "danger" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-red-50 border border-red-100 rounded-md p-6">
              <h3 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Danger Zone
              </h3>
              <p className="text-slate-500 mb-6">
                Proceed with caution. Actions taken here cannot be undone
                easily.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-slate-800">
                      Deactivate Account
                    </p>
                    <p className="text-sm text-slate-500">
                      Temporarily hide your profile and data.
                    </p>
                  </div>
                  <button
                    onClick={() => setDangerAction("deactivate")}
                    className="border border-red-500 text-red-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-50 transition-colors"
                  >
                    Deactivate
                  </button>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-red-200">
                  <div>
                    <p className="font-medium text-red-600">Delete Account</p>
                    <p className="text-sm text-slate-500">
                      Permanently remove your account and all data.
                    </p>
                  </div>
                  <button
                    onClick={() => setDangerAction("delete")}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === "totp" && totpData && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Setup Two-Factor Authentication
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Scan this QR code with your authenticator app (Google
                Authenticator, Authy, etc.).
              </p>
              <div className="flex justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpData.qr_uri)}`}
                  alt="TOTP QR Code"
                  className="w-48 h-48 border border-slate-200 rounded-md"
                />
              </div>
              <p className="text-xs text-slate-400 mb-1">
                Or enter this key manually:{" "}
                <span className="font-mono font-bold text-slate-600">
                  {totpData.secret}
                </span>
              </p>
              <p className="text-xs text-slate-400 mb-4">
                Account: {totpData.account}
              </p>
              <div className="space-y-3">
                <input
                  value={totpVerifyCode}
                  onChange={(e) =>
                    setTotpVerifyCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-center text-2xl tracking-widest text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      setTotpData(null);
                    }}
                    className="flex-1 rounded-md bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleEnableTOTP}
                    disabled={totpEnabling || totpVerifyCode.length < 6}
                    className="flex-1 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {totpEnabling ? "Verifying..." : "Verify & Enable"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {toastMessage && <Toast message={toastMessage} />}

        <ConfirmDialog
          isOpen={dangerAction === "deactivate"}
          onClose={() => setDangerAction(null)}
          onConfirm={async () => {
            // Phase 1: show toast only (backend endpoint TBD)
            showToast("Account deactivated successfully");
            setDangerAction(null);
          }}
          title="Deactivate Account?"
          message="Your profile will be hidden and you won't receive any notifications. You can reactivate by logging back in."
          confirmText="Yes, Deactivate"
          variant="warning"
          confirmLoadingText="Deactivating..."
        />

        <ConfirmDialog
          isOpen={dangerAction === "delete"}
          onClose={() => setDangerAction(null)}
          onConfirm={async () => {
            // Phase 1: show toast only (backend endpoint TBD)
            showToast("Account deletion request submitted");
            setDangerAction(null);
          }}
          title="Delete Account?"
          message={
            <span>
              This will permanently delete your account and all associated data.
              <strong className="block mt-2 text-red-600">
                This action cannot be undone.
              </strong>
            </span>
          }
          confirmText="Yes, Delete Permanently"
          variant="danger"
          confirmLoadingText="Deleting..."
        />
      </form>
    </div>
  );
}
