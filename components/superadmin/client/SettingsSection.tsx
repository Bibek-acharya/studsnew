"use client";

import React, { useState } from "react";
import {
  Settings,
  Brain,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { apiService } from "@/services/api";

export default function SettingsSection() {
  const [retrainStatus, setRetrainStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleRetrain = async (force: boolean) => {
    setRetrainStatus("loading");
    setStatusMessage(
      force
        ? "Full AI retrain started — this may take several minutes..."
        : "Indexing new data...",
    );
    try {
      const res = await apiService.reindexEmbeddings(force);
      setRetrainStatus("success");
      setStatusMessage(res.message || "AI retrain completed");
    } catch (err: any) {
      setRetrainStatus("error");
      setStatusMessage(err.message || "Retrain failed");
    }
    setTimeout(() => {
      setRetrainStatus("idle");
      setStatusMessage("");
    }, 6000);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-md border border-gray-200 bg-white p-8">
        <h2 className="mb-6 text-lg font-bold text-gray-900">
          General Settings
        </h2>
        <div className="space-y-4">
          <ToggleRow
            title="Email Notifications"
            desc="Receive email updates"
            defaultChecked
          />
          <ToggleRow
            title="Browser Notifications"
            desc="Receive browser push notifications"
          />
          <ToggleRow
            title="Dark Mode"
            desc="Use dark theme for the dashboard"
          />
          <ToggleRow
            title="Compact View"
            desc="Show condensed tables and cards"
            defaultChecked
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-8">
        <h2 className="mb-6 text-lg font-bold text-gray-900">Sphere AI</h2>
        <p className="mb-4 text-sm text-gray-500">
          Retrain the AI search index to include the latest data. Use quick
          reindex for new records, or full retrain to refresh all embeddings.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleRetrain(false)}
            disabled={retrainStatus === "loading"}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            <RotateCcw
              className={`h-4 w-4 ${retrainStatus === "loading" ? "animate-spin" : ""}`}
            />
            Quick Reindex
          </button>
          <button
            type="button"
            onClick={() => handleRetrain(true)}
            disabled={retrainStatus === "loading"}
            className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-5 py-2.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50"
          >
            <Brain className="h-4 w-4" />
            Full Retrain (All Embeddings)
          </button>
        </div>
        {statusMessage && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-md p-3 text-sm ${
              retrainStatus === "success"
                ? "bg-emerald-50 text-emerald-700"
                : retrainStatus === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-blue-50 text-blue-700"
            }`}
          >
            {retrainStatus === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : retrainStatus === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
            {statusMessage}
          </div>
        )}
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-8">
        <h2 className="mb-6 text-lg font-bold text-gray-900">
          Change Password
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input type="password" className="input-field" />
          </div>
          <div />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input type="password" className="input-field" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input type="password" className="input-field" />
          </div>
        </div>
        <button
          type="button"
          className="mt-6 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  desc,
  defaultChecked,
}: {
  title: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md bg-gray-50 p-4">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="sr-only peer"
          defaultChecked={defaultChecked}
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
      </label>
    </div>
  );
}
