"use client";

import React, { useState, memo, useEffect } from "react";
import { Home, Mail, Key, Bell, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { providerRbacApi } from "@/services/providerRbac";
import { scholarshipProviderApi, ProviderProfile } from "@/services/scholarshipProviderApi";

interface SettingsProps {
  profile?: ProviderProfile;
  onLogout?: () => void;
}

const Settings: React.FC<SettingsProps> = memo(({ profile: initialProfile, onLogout }) => {
  const [profile, setProfile] = useState<ProviderProfile | null>(initialProfile || null);
  const [currentEmail, setCurrentEmail] = useState(initialProfile?.email || "loading...");
  const [newEmail, setNewEmail] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [curPassword, setCurPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [conNewPassword, setConNewPassword] = useState("");
  
  // Error states for Change Email
  const [emailError, setEmailError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [changeEmailGeneralError, setChangeEmailGeneralError] = useState("");

  // Error states for Change Password
  const [curPassError, setCurPassError] = useState("");
  const [newPassError, setNewPassError] = useState("");
  const [conNewPassError, setConNewPassError] = useState("");
  
  // Show password states
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showCurPass, setShowCurPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConNewPass, setShowConNewPass] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, newApp: true, payment: true, deadline: true });
  const [twoFA, setTwoFA] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  useEffect(() => {
    if (!initialProfile) {
      const loadProfile = async () => {
        try {
          const data = await scholarshipProviderApi.getProfile();
          setProfile(data);
          setCurrentEmail(data.email || "");
        } catch (err) {
          console.error("Failed to load profile in settings:", err);
        }
      };
      loadProfile();
    } else {
      setProfile(initialProfile);
      setCurrentEmail(initialProfile.email || "");
    }
  }, [initialProfile]);

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
    </label>
  );

  const handleChangeEmail = async () => {
    setEmailError("");
    setConfirmPassError("");
    setChangeEmailGeneralError("");

    let hasError = false;
    if (!newEmail) {
      setEmailError("New email is required");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setEmailError("Invalid email format");
      hasError = true;
    }
    
    if (!confirmPass) {
      setConfirmPassError("Password is required to confirm");
      hasError = true;
    }

    if (hasError) return;

    try {
      await scholarshipProviderApi.changeEmail({
        new_email: newEmail,
        password: confirmPass
      });
      
      toast.success("Your email address has been updated successfully. Logging out...");
      
      setNewEmail("");
      setConfirmPass("");
      
      // Logout after 1.5 seconds so they can read the message
      setTimeout(() => {
        if (onLogout) {
          onLogout();
        } else {
          window.location.href = "/scholarship-provider/login";
        }
      }, 1500);
    } catch (err: any) {
      const msg = err.message || "Failed to change email";
      if (msg.toLowerCase().includes("password")) {
        setConfirmPassError(msg);
      } else {
        setChangeEmailGeneralError(msg);
      }
    }
  };

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
          <button onClick={handleChangeEmail} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Update Email</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Email</label>
            <input type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={currentEmail} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Email Address</label>
            <input 
              type="email" 
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${emailError ? 'border-red-500' : 'border-gray-200'}`} 
              placeholder="Enter new email address" 
              value={newEmail} 
              onChange={(e) => {
                setNewEmail(e.target.value);
                setEmailError("");
              }} 
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPass ? "text" : "password"} 
                className={`w-full pl-3 pr-10 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${confirmPassError ? 'border-red-500' : 'border-gray-200'}`} 
                placeholder="Enter current password to confirm" 
                value={confirmPass} 
                onChange={(e) => {
                  setConfirmPass(e.target.value);
                  setConfirmPassError("");
                }} 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showConfirmPass ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            {confirmPassError && <p className="text-red-500 text-xs mt-1">{confirmPassError}</p>}
          </div>
        </div>
        {changeEmailGeneralError && <p className="text-red-500 text-sm mt-4">{changeEmailGeneralError}</p>}
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" /> Change Password
          </h2>
          <button 
            onClick={async () => {
              setCurPassError("");
              setNewPassError("");
              setConNewPassError("");
              setPassError("");
              setPassSuccess("");

              let hasError = false;
              if (!curPassword) {
                setCurPassError("Current password is required");
                hasError = true;
              }
              if (!newPassword) {
                setNewPassError("New password is required");
                hasError = true;
              } else {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!passwordRegex.test(newPassword)) {
                  setNewPassError("Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.");
                  hasError = true;
                } else if (newPassword === curPassword) {
                  setNewPassError("New password cannot be the same as the current password");
                  hasError = true;
                }
              }
              if (!conNewPassword) {
                setConNewPassError("Please confirm your new password");
                hasError = true;
              } else if (newPassword !== conNewPassword) {
                setConNewPassError("New passwords do not match");
                hasError = true;
              }

              if (hasError) return;

              setPassLoading(true);
              try {
                await providerRbacApi.changePassword({
                  current_password: curPassword,
                  new_password: newPassword,
                });
                
                toast.success("Your password has been changed successfully. Logging out...");
                
                setCurPassword("");
                setNewPassword("");
                setConNewPassword("");
                
                if (onLogout) {
                  setTimeout(() => {
                    onLogout();
                  }, 1500);
                }
              } catch (err: any) {
                const msg = err.message || "Failed to change password";
                if (msg.toLowerCase().includes("current password")) {
                  setCurPassError(msg);
                } else {
                  setPassError(msg);
                }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <div className="relative">
              <input 
                type={showCurPass ? "text" : "password"} 
                className={`w-full pl-3 pr-10 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${curPassError ? 'border-red-500' : 'border-gray-200'}`} 
                placeholder="Enter current password" 
                value={curPassword} 
                onChange={(e) => {
                  setCurPassword(e.target.value);
                  setCurPassError("");
                }} 
              />
              <button
                type="button"
                onClick={() => setShowCurPass(!showCurPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showCurPass ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            {curPassError && <p className="text-red-500 text-xs mt-1">{curPassError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <input 
                type={showNewPass ? "text" : "password"} 
                className={`w-full pl-3 pr-10 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${newPassError ? 'border-red-500' : 'border-gray-200'}`} 
                placeholder="Enter new password" 
                value={newPassword} 
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setNewPassError("");
                }} 
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showNewPass ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            {newPassError && <p className="text-red-500 text-xs mt-1">{newPassError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showConNewPass ? "text" : "password"} 
                className={`w-full pl-3 pr-10 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${conNewPassError ? 'border-red-500' : 'border-gray-200'}`} 
                placeholder="Re-enter new password" 
                value={conNewPassword} 
                onChange={(e) => {
                  setConNewPassword(e.target.value);
                  setConNewPassError("");
                }} 
              />
              <button
                type="button"
                onClick={() => setShowConNewPass(!showConNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showConNewPass ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            {conNewPassError && <p className="text-red-500 text-xs mt-1">{conNewPassError}</p>}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-600" /> Notification Settings
          </h2>
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
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Export All Data</p>
              <p className="text-xs text-gray-500">Download applications, scholarships, and analytics</p>
            </div>
            <button 
              onClick={async () => {
                try {
                  toast.success("Export started! Your file will download shortly.");
                  await scholarshipProviderApi.exportApplications();
                } catch (err: any) {
                  toast.error(err.message || "Failed to export data");
                }
              }} 
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

Settings.displayName = "Settings";

export default Settings;
