"use client";

import React, { useEffect, useState } from "react";
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
  const [progress, setProgress] = useState<{
    running: boolean;
    force: boolean;
    table: string;
    processed: number;
    total: number;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (retrainStatus !== "loading") return;
    let active = true;
    const poll = async () => {
      try {
        const next = await apiService.getReindexProgress();
        if (active) {
          setProgress(next);
          if (!next.running && next.total > 0) {
            setRetrainStatus(next.error ? "error" : "success");
            setStatusMessage(next.error || "Embedding reindex completed");
          }
        }
      } catch {
        // The initial request may complete before the worker status is visible.
      }
    };
    poll();
    const timer = window.setInterval(poll, 1500);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [retrainStatus]);

  const handleRetrain = async (force: boolean) => {
    setRetrainStatus("loading");
    setProgress(null);
    setStatusMessage(
      force
        ? "Full AI retrain started — this may take several minutes..."
        : "Indexing new data...",
    );
    try {
      const res = await apiService.reindexEmbeddings(force);
      setStatusMessage(res.message || "AI retrain started");
    } catch (err: unknown) {
      setRetrainStatus("error");
      setStatusMessage(err instanceof Error ? err.message : "Retrain failed");
    }
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
        {retrainStatus === "loading" && progress && (
          <div className="mt-5 rounded-md border border-blue-100 bg-blue-50 p-4">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-blue-900">
              <span>{progress.table ? `Processing ${progress.table}` : "Preparing embeddings..."}</span>
              <span>{progress.total > 0 ? `${Math.round((progress.processed / progress.total) * 100)}%` : "..."}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-blue-100">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress.total > 0 ? Math.min(100, (progress.processed / progress.total) * 100) : 5}%` }} />
            </div>
            <div className="mt-2 text-xs text-blue-700">
              {progress.total > 0 ? `${progress.processed.toLocaleString()} of ${progress.total.toLocaleString()} records` : "Starting background job"}
            </div>
          </div>
        )}
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
