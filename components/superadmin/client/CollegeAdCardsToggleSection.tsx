"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  useCollegeAdCardSettings,
  updateCollegeAdCardSettings,
  type CollegeAdCardSettings,
} from "@/services/collegeAdApi";

type SettingKey = keyof CollegeAdCardSettings;

const ROWS: { key: SettingKey; label: string; description: string }[] = [
  {
    key: "trending",
    label: "Trending Colleges",
    description: "Show the Trending Colleges ad card on the find-college grid.",
  },
  {
    key: "by_type",
    label: "Colleges by Type",
    description: "Show the Colleges by Type ad card on the find-college grid.",
  },
  {
    key: "rating",
    label: "Rate Experience Prompt",
    description: "Show the rating prompt ad card on the find-college grid.",
  },
];

export default function CollegeAdCardsToggleSection() {
  const { data, isLoading, isError } = useCollegeAdCardSettings();
  const [settings, setSettings] = useState<CollegeAdCardSettings>({
    trending: true,
    by_type: true,
    rating: true,
  });
  const [savingKey, setSavingKey] = useState<SettingKey | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (data && !loaded) {
      setSettings(data);
      setLoaded(true);
    }
  }, [data, loaded]);

  const handleToggle = useCallback(
    async (key: SettingKey) => {
      if (savingKey) return;
      const previous = settings;
      const nextValue = !settings[key];
      // Optimistic update with only the toggled key in the PUT body.
      setSettings((prev) => ({ ...prev, [key]: nextValue }));
      setSavingKey(key);
      try {
        const res = await updateCollegeAdCardSettings({ [key]: nextValue });
        setSettings(res);
      } catch (err: unknown) {
        setSettings(previous);
        const message =
          (err as { message?: string })?.message ||
          "Failed to update ad card setting";
        alert(message);
      } finally {
        setSavingKey(null);
      }
    },
    [settings, savingKey],
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">College Ad Cards</h2>
        <span className="text-xs text-gray-500">
          Toggle which ad cards appear on the find-college grid
        </span>
      </div>

      {isLoading && !loaded ? (
        <div className="px-6 py-8 text-center text-gray-500">
          Loading settings...
        </div>
      ) : isError && !loaded ? (
        <div className="px-6 py-8 text-center text-red-500">
          Failed to load ad card settings
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {ROWS.map((row) => {
            const isSaving = savingKey === row.key;
            return (
              <div
                key={row.key}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {row.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {row.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {isSaving && (
                    <span className="text-xs text-gray-400">Saving...</span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                      settings[row.key]
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {settings[row.key] ? "On" : "Off"}
                  </span>
                  <label className="group flex cursor-pointer items-center">
                    <div className="relative inline-flex cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[row.key]}
                        disabled={!!savingKey}
                        onChange={() => handleToggle(row.key)}
                        className="peer sr-only"
                      />
                      <div className="peer h-5 w-8.5 rounded-full bg-slate-300 transition-all after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-blue peer-checked:after:translate-x-3.5 peer-checked:after:border-white peer-focus:outline-none peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
