"use client";

import React from "react";
import { Settings } from "lucide-react";

export default function OrganizationSettingsSection() {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <Settings size={20} className="text-blue-600" /> Organization Settings
      </h2>
      <div className="space-y-4">
        <ToggleRow title="Public Profile" desc="Make organization profile visible to public" defaultChecked />
        <ToggleRow title="Allow Registrations" desc="Allow new users to register" defaultChecked />
        <ToggleRow title="Maintenance Mode" desc="Disable public access during maintenance" />
        <ToggleRow title="Auto-approve Colleges" desc="Automatically approve new college registrations" defaultChecked />
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
