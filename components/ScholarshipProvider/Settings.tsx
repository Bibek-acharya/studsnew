import React, { useEffect, useState } from 'react';
import { scholarshipProviderApi, ProviderSettings } from '@/services/scholarshipProviderApi';

export default function Settings() {
  const [settings, setSettings] = useState<ProviderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setError('');
    try {
      const data = await scholarshipProviderApi.getSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function toggleSetting(key: keyof ProviderSettings) {
    if (!settings) return;
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    setSaving(true);
    try {
      await scholarshipProviderApi.updateSettings({
        email_notifications: updated.email_notifications,
        sms_notifications: updated.sms_notifications,
        auto_reject_expired: updated.auto_reject_expired,
        timezone: updated.timezone,
        language: updated.language,
      });
      setSuccess('Settings updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="fade-in max-w-4xl mx-auto flex items-center justify-center py-20">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-primary-600"></i>
      </section>
    );
  }

  return (
    <section className="fade-in max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-800">System Preferences</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Configure your dashboard experience and security settings.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm font-bold">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm font-bold">
          {success}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-md  border border-slate-200 p-8">
          <h3 className="text-lg font-black border-b border-slate-100 pb-4 mb-8 text-slate-800 uppercase tracking-tighter">Notification Settings</h3>
          <div className="space-y-6 max-w-2xl">
            {[
              { title: 'New Application Alerts', desc: 'Receive an email when a new student applies.', key: 'email_notifications' as const },
              { title: 'SMS Notifications', desc: 'Receive SMS alerts for critical updates.', key: 'sms_notifications' as const },
              { title: 'Auto-Reject Expired', desc: 'Automatically reject applications past deadline.', key: 'auto_reject_expired' as const },
            ].map(setting => (
              <div key={setting.title} className="flex items-center justify-between group">
                <div>
                  <p className="font-bold text-slate-700 group-hover:text-primary-600 transition-colors">{setting.title}</p>
                  <p className="text-xs text-slate-400 font-medium">{setting.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer scale-110">
                  <input
                    type="checkbox"
                    checked={settings?.[setting.key] || false}
                    onChange={() => toggleSetting(setting.key)}
                    disabled={saving}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 shadow-inner disabled:opacity-50"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-md  border border-slate-200 p-8">
          <h3 className="text-lg font-black border-b border-slate-100 pb-4 mb-8 text-slate-800 uppercase tracking-tighter">Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Timezone</label>
              <select
                value={settings?.timezone || 'UTC'}
                onChange={e => {
                  if (!settings) return;
                  const updated = { ...settings, timezone: e.target.value };
                  setSettings(updated);
                  scholarshipProviderApi.updateSettings({
                    email_notifications: updated.email_notifications,
                    sms_notifications: updated.sms_notifications,
                    auto_reject_expired: updated.auto_reject_expired,
                    timezone: updated.timezone,
                    language: updated.language,
                  });
                }}
                className="w-full border border-slate-300 rounded-md px-4 py-3 bg-white outline-none font-medium cursor-pointer focus:border-primary-500"
              >
                <option value="UTC">UTC</option>
                <option value="Asia/Kathmandu">Asia/Kathmandu (NPT)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Language</label>
              <select
                value={settings?.language || 'en'}
                onChange={e => {
                  if (!settings) return;
                  const updated = { ...settings, language: e.target.value };
                  setSettings(updated);
                  scholarshipProviderApi.updateSettings({
                    email_notifications: updated.email_notifications,
                    sms_notifications: updated.sms_notifications,
                    auto_reject_expired: updated.auto_reject_expired,
                    timezone: updated.timezone,
                    language: updated.language,
                  });
                }}
                className="w-full border border-slate-300 rounded-md px-4 py-3 bg-white outline-none font-medium cursor-pointer focus:border-primary-500"
              >
                <option value="en">English</option>
                <option value="ne">Nepali</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md  border border-slate-200 p-8">
          <h3 className="text-lg font-black border-b border-slate-100 pb-4 mb-8 text-slate-800 uppercase tracking-tighter">Security & Access</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 border-2 border-slate-200 rounded-md font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition  flex items-center gap-2">
              <i className="fa-solid fa-key text-slate-400"></i> Change Password
            </button>
            <button className="px-6 py-3 border-2 border-slate-200 rounded-md font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition  flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-slate-400"></i> Enable 2FA
            </button>
          </div>
        </div>

        <div className="bg-red-50 rounded-md  border border-red-100 p-8">
          <h3 className="text-lg font-black border-b border-red-200 pb-4 mb-6 text-red-800 uppercase tracking-tighter">Danger Zone</h3>
          <p className="text-sm text-red-600 mb-6 font-medium">Once you delete your organization data, it cannot be undone. Please be certain.</p>
          <button className="px-6 py-3 bg-red-600 text-white rounded-md font-black text-xs uppercase tracking-widest hover:bg-red-700 transition shadow-lg shadow-red-500/20">
            Deactivate Account
          </button>
        </div>
      </div>
    </section>
  );
}
