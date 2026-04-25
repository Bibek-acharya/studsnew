"use client";

import React from "react";
import { Bell } from "lucide-react";

export default function NotificationSection() {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <Bell size={20} className="text-blue-600" /> Manage Notifications
      </h2>
      <div className="space-y-4">
        <ToggleRow title="Email Notifications" desc="Send email notifications for new applications" defaultChecked />
        <ToggleRow title="Push Notifications" desc="Send push notifications for important updates" defaultChecked />
        <ToggleRow title="SMS Alerts" desc="Send SMS alerts for urgent notices" />
        <ToggleRow title="Weekly Digest" desc="Send weekly summary of activities" defaultChecked />
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
