"use client";

import React from "react";
import { Settings } from "lucide-react";

export default function SettingsSection() {
  return (
    <div className="space-y-8">
      <div className="rounded-md border border-gray-200 bg-white p-8">
        <h2 className="mb-6 text-lg font-bold text-gray-900">General Settings</h2>
        <div className="space-y-4">
          <ToggleRow title="Email Notifications" desc="Receive email updates" defaultChecked />
          <ToggleRow title="Browser Notifications" desc="Receive browser push notifications" />
          <ToggleRow title="Dark Mode" desc="Use dark theme for the dashboard" />
          <ToggleRow title="Compact View" desc="Show condensed tables and cards" defaultChecked />
        </div>
      </div>
      <div className="rounded-md border border-gray-200 bg-white p-8">
        <h2 className="mb-6 text-lg font-bold text-gray-900">Change Password</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input type="password" className="input-field" />
          </div>
          <div />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" className="input-field" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="password" className="input-field" />
          </div>
        </div>
        <button type="button" className="mt-6 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">Update Password</button>
      </div>
    </div>
  );
}

function ToggleRow({ title, desc, defaultChecked }: { title: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-gray-50 p-4">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
      </label>
    </div>
  );
}
