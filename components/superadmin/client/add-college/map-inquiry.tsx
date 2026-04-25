"use client";

import React from "react";
import { MapPin, Mail } from "lucide-react";
import { FormCard } from "./FormCard";
import { FormInput } from "./FormInput";
import { DEFAULT_INQUIRY_FIELDS } from "@/lib/superadmin/constants";

export function MapLocationCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<MapPin size={24} className="text-green-600" />}
      title="Map Location"
      sub="College location on map"
      locked={locked}
      onToggleLock={onToggleLock}
    >
      <div className="space-y-4">
        <FormInput
          label="Google Maps Embed URL"
          type="url"
          placeholder="https://www.google.com/maps/embed?pb=..."
        />
        <p className="text-xs text-gray-500">
          Get the embed URL from Google Maps Share &rarr; Embed a map
        </p>
        <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
          <div className="mx-auto mb-4 flex h-64 w-full items-center justify-center rounded-md bg-gray-50">
            <MapPin size={64} className="text-gray-400" />
          </div>
          <p className="text-base font-medium text-gray-700">Map Preview</p>
          <p className="mt-1 text-sm text-gray-500">
            Map will appear here after adding the embed URL
          </p>
        </div>
      </div>
    </FormCard>
  );
}

export function InquiryFormCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<Mail size={24} className="text-blue-600" />}
      title="Quick Inquiry Form Settings"
      sub="Configure inquiry form for students"
      locked={locked}
      onToggleLock={onToggleLock}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput label="Form Title" placeholder="e.g., Request Information" />
          <FormInput label="Form Description" placeholder="Fill the form and our admission counselor will contact you." />
          <FormInput label="Submit Button Text" placeholder="e.g., Submit Request" />
          <FormInput label="Email Recipient" type="email" placeholder="admission@college.edu.np" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Form Fields</label>
          <div className="space-y-3">
            {DEFAULT_INQUIRY_FIELDS.map((field) => (
              <div
                key={field.name}
                className="flex items-center gap-4 rounded-md bg-gray-50 p-4"
              >
                <input
                  type="checkbox"
                  defaultChecked={field.enabled}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex-1 text-sm font-medium text-gray-700">
                  {field.name}
                </span>
                {field.required && (
                  <span className="text-xs font-semibold text-gray-500">Required</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormCard>
  );
}
