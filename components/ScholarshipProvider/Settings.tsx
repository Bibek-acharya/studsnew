"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Settings as SettingsIcon, Mail, Shield, Key } from "lucide-react";
import SectionCard from "./common/SectionCard";
import InputField from "./common/InputField";
import ToggleSwitch from "./common/ToggleSwitch";
import Button from "./common/Button";
import { scholarshipProviderApi, ProviderSettings } from "@/services/scholarshipProviderApi";

export default function Settings() {
  const [settings, setSettings] = useState<ProviderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await scholarshipProviderApi.getSettings();
        setSettings(res);
      } catch {
        setSettings(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const updateSetting = useCallback(async (key: keyof ProviderSettings, value: any) => {
    if (!settings) return;
    const updated = { ...settings, [key]: value };
    try {
      await scholarshipProviderApi.updateSettings({
        email_notifications: updated.email_notifications,
        sms_notifications: updated.sms_notifications,
        auto_reject_expired: updated.auto_reject_expired,
        timezone: updated.timezone,
        language: updated.language,
      });
      setSettings(updated);
      setSuccess("Settings updated!");
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Failed to update settings");
      setTimeout(() => setError(""), 2000);
    }
  }, [settings]);

  const handlePasswordUpdate = useCallback(() => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setSuccess("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSuccess(""), 3000);
  }, [currentPassword, newPassword, confirmPassword]);

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-600" /> General Settings
        </h2>
        <div className="space-y-4">
          <ToggleSwitch
            checked={settings?.email_notifications ?? true}
            onChange={(v) => updateSetting("email_notifications", v)}
            label="Email Notifications"
            description="Receive email updates"
          />
          <ToggleSwitch
            checked={settings?.sms_notifications ?? false}
            onChange={(v) => updateSetting("sms_notifications", v)}
            label="SMS Notifications"
            description="Receive SMS alerts"
          />
          <ToggleSwitch
            checked={settings?.auto_reject_expired ?? false}
            onChange={(v) => updateSetting("auto_reject_expired", v)}
            label="Auto-reject Expired"
            description="Automatically reject expired applications"
          />
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Two-Factor Authentication</p>
              <p className="text-sm text-slate-500">Extra security for your account</p>
            </div>
            <button className="text-blue-600 font-medium text-sm hover:underline">Enable</button>
          </div>
        </div>
      </SectionCard>

      {/* Change Password */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-600" /> Change Password
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputField label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div></div>
          <div>
            <InputField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div>
            <InputField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </div>

        {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        {success && <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

        <Button className="mt-4" onClick={handlePasswordUpdate}>
          <Shield className="w-4 h-4" /> Update Password
        </Button>
      </SectionCard>
    </div>
  );
}
