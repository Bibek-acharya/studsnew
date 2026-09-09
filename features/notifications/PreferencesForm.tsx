"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { notificationClient } from "@/services/notificationClient";
import type {
  NotificationPreferences,
  PreferenceGroup,
} from "./types";

// Notification preferences per role. Group labels come from
// GET /preferences (doc 06 §12 role groups) — never hardcoded per role.
// Every toggle PUTs a sparse body: group rows send
// `{overrides: [{pref_key, <toggled field>}]}`; the global row sends
// `{overrides: [], global: {<toggled field>}}` (doc 05 §2.4).
export default function PreferencesForm() {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    notificationClient
      .fetchPreferences()
      .then((res) => setPrefs(res.data))
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load preferences"),
      )
      .finally(() => setLoading(false));
  }, []);

  const toggleGroup = async (
    group: PreferenceGroup,
    field: "in_app" | "email",
  ) => {
    const next = !group[field];
    setPrefs((prev) =>
      prev
        ? {
            ...prev,
            groups: prev.groups.map((g) =>
              g.key === group.key ? { ...g, [field]: next } : g,
            ),
          }
        : prev,
    );
    try {
      await notificationClient.updatePreferences({
        overrides: [{ pref_key: group.key, [field]: next }],
      });
    } catch (e) {
      // Revert the optimistic flip so the UI never lies about saved state.
      setPrefs((prev) =>
        prev
          ? {
              ...prev,
              groups: prev.groups.map((g) =>
                g.key === group.key ? { ...g, [field]: group[field] } : g,
              ),
            }
          : prev,
      );
      setError(e instanceof Error ? e.message : "Failed to save preference");
    }
  };

  const toggleGlobal = async (field: "in_app" | "email") => {
    const next = !(prefs?.global[field] ?? true);
    const prevGlobal = prefs?.global;
    setPrefs((prev) =>
      prev ? { ...prev, global: { ...prev.global, [field]: next } } : prev,
    );
    try {
      await notificationClient.updatePreferences({
        overrides: [],
        global: { [field]: next },
      });
    } catch (e) {
      setPrefs((prev) => (prev ? { ...prev, global: prevGlobal ?? {} } : prev));
      setError(e instanceof Error ? e.message : "Failed to save preference");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error && !prefs) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  const global = prefs?.global ?? {};

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
        <Bell className="h-5 w-5 text-blue-600" /> Notification Preferences
      </h3>
      {error && (
        <p role="alert" className="mb-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="space-y-0 divide-y divide-slate-100">
        <PreferenceRow
          label="All notifications"
          hint="Master switch for every channel below"
          inApp={global.in_app ?? true}
          email={global.email ?? true}
          onToggleInApp={() => void toggleGlobal("in_app")}
          onToggleEmail={() => void toggleGlobal("email")}
        />
        {(prefs?.groups ?? []).map((group) => (
          <PreferenceRow
            key={group.key}
            label={group.label}
            hint={group.overridden ? "Customized" : undefined}
            inApp={group.in_app}
            email={group.email}
            onToggleInApp={() => void toggleGroup(group, "in_app")}
            onToggleEmail={() => void toggleGroup(group, "email")}
          />
        ))}
      </div>
      {(prefs?.groups ?? []).length === 0 && (
        <p className="py-4 text-center text-sm text-slate-500">
          No notification categories for your role yet.
        </p>
      )}
    </div>
  );
}

function PreferenceRow({
  label,
  hint,
  inApp,
  email,
  onToggleInApp,
  onToggleEmail,
}: {
  label: string;
  hint?: string;
  inApp: boolean;
  email: boolean;
  onToggleInApp: () => void;
  onToggleEmail: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="font-medium text-slate-800">{label}</p>
        {hint && <p className="text-sm text-slate-500">{hint}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <input
            type="checkbox"
            aria-label={`${label} in-app`}
            checked={inApp}
            onChange={onToggleInApp}
            className="h-4 w-4 accent-blue-600"
          />
          In-app
        </label>
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <input
            type="checkbox"
            aria-label={`${label} email`}
            checked={email}
            onChange={onToggleEmail}
            className="h-4 w-4 accent-blue-600"
          />
          Email
        </label>
      </div>
    </div>
  );
}
