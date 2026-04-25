"use client";

import React from "react";
import { Building2 } from "lucide-react";
import { PROVINCES } from "@/lib/superadmin/constants";

export default function OrganizationProfileSection() {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <Building2 size={20} className="text-blue-600" /> Organization Profile
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Organization Name</label>
          <input type="text" className="input-field" defaultValue="Sowers Action Nepal" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Organization Type</label>
          <select className="input-field" defaultValue="ngo">
            <option value="ngo">NGO</option>
            <option value="nonprofit">Non-Profit</option>
            <option value="foundation">Foundation</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" className="input-field" defaultValue="info@sowersaction.org.np" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="tel" className="input-field" defaultValue="01-5908179" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Street Address</label>
          <input type="text" className="input-field" placeholder="House No, Street Name, Tole" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Province</label>
          <select className="input-field" defaultValue="3">
            <option value="">Select Province</option>
            {PROVINCES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">District</label>
          <select className="input-field">
            <option value="">Select District</option>
            <option value="kathmandu">Kathmandu</option>
            <option value="lalitpur">Lalitpur</option>
            <option value="bhaktapur">Bhaktapur</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button type="button" className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
        <button type="button" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  );
}
