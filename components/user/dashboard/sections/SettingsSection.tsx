'use client'

import { useState } from 'react'

export default function SettingsSection() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newsletter: true,
    twoFactor: true,
    profileVisibility: 'friends',
  })

  const handleLogout = () => {
    window.location.href = '/'
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Settings & Privacy</h2>
          <p className="text-slate-500 mt-1">Manage your account preferences and security settings.</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-user text-blue-500"></i> Account Settings
          </h3>
          <div className="space-y-4">
            <button className="w-full p-3 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-left">
              <span>
                <i className="fas fa-envelope mr-2 text-blue-600"></i>
                <span className="font-medium text-slate-800">alex@university.edu</span>
                <p className="text-xs text-slate-500 mt-1">Email Address</p>
              </span>
              <i className="fas fa-chevron-right text-slate-400"></i>
            </button>
            <button className="w-full p-3 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-left">
              <span>
                <i className="fas fa-phone mr-2 text-blue-600"></i>
                <span className="font-medium text-slate-800">+1 (555) 123-4567</span>
                <p className="text-xs text-slate-500 mt-1">Phone Number</p>
              </span>
              <i className="fas fa-chevron-right text-slate-400"></i>
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-bell text-blue-500"></i> Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Email Notifications</p>
                <p className="text-sm text-slate-500">Updates on applications & deadlines</p>
              </div>
              <input type="checkbox" checked={settings.emailNotifications} onChange={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})} className="w-5 h-5 rounded accent-blue-600" />
            </div>
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">SMS Notifications</p>
                <p className="text-sm text-slate-500">Urgent alerts and reminders</p>
              </div>
              <input type="checkbox" checked={settings.smsNotifications} onChange={() => setSettings({...settings, smsNotifications: !settings.smsNotifications})} className="w-5 h-5 rounded accent-blue-600" />
            </div>
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Newsletter</p>
                <p className="text-sm text-slate-500">Monthly updates and opportunities</p>
              </div>
              <input type="checkbox" checked={settings.newsletter} onChange={() => setSettings({...settings, newsletter: !settings.newsletter})} className="w-5 h-5 rounded accent-blue-600" />
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-lock text-green-500"></i> Privacy & Security
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Two-Factor Authentication</p>
                <p className="text-sm text-slate-500">Add extra security to your account</p>
              </div>
              <input type="checkbox" checked={settings.twoFactor} onChange={() => setSettings({...settings, twoFactor: !settings.twoFactor})} className="w-5 h-5 rounded accent-green-600" />
            </div>
            <div className="border-t border-slate-100 pt-4">
              <label className="block font-medium text-slate-800 mb-2">Profile Visibility</label>
              <select value={settings.profileVisibility} onChange={(e) => setSettings({...settings, profileVisibility: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="public">Public - Visible to Everyone</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private - Only Me</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Account Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 border border-slate-200 rounded-lg text-slate-800 font-medium hover:bg-slate-50 transition-colors text-left">
              <i className="fas fa-key mr-2 text-blue-600"></i> Change Password
            </button>
            <button className="w-full p-3 border border-slate-200 rounded-lg text-slate-800 font-medium hover:bg-slate-50 transition-colors text-left">
              <i className="fas fa-download mr-2 text-blue-600"></i> Download My Data
            </button>
            <button className="w-full p-3 border border-red-200 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors text-left">
              <i className="fas fa-trash mr-2"></i> Delete Account
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-500/20">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  )
}
