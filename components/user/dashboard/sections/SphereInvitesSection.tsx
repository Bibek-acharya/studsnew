"use client";

import { useState, useEffect } from "react";
import { apiService, InviteItem } from "@/services/api";
import {
  Building2,
  FileText,
  ClipboardCheck,
  CalendarDays,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { ErrorState } from "@/components/ui/ErrorState";

type InvTab = "college" | "admission" | "entrance" | "events";

const tabMeta: { key: InvTab; label: string }[] = [
  { key: "college", label: "College" },
  { key: "admission", label: "Admission" },
  { key: "entrance", label: "Entrance" },
  { key: "events", label: "Events" },
];

function getInitials(name: string) {
  return name ? name.charAt(0).toUpperCase() : "?";
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
    "bg-orange-100 text-orange-600",
    "bg-pink-100 text-pink-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function SphereInvitesSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<InvTab>("college");
  const [invites, setInvites] = useState<InviteItem[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getInvites();
      setInvites(res.data?.invites || []);
    } catch (err: any) {
      setError(err.message || "Failed to load invites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const filtered = invites.filter(
    (i) => activeTab === "college" || i.type === activeTab,
  );

  const counts: Record<string, number> = {};
  for (const t of tabMeta)
    counts[t.key] = invites.filter(
      (i) => t.key === "college" || i.type === t.key,
    ).length;

  const handleAccept = async (id: number) => {
    try {
      await apiService.acceptInvite(id);
      fetchInvites();
      setToast({ message: "Invite accepted", type: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch {
      /* ignore */
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await apiService.declineInvite(id);
      fetchInvites();
      setToast({ message: "Invite declined", type: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Invities</h1>
          <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
            <span>Dashboard</span>
            <span>-</span>
            <span className="text-gray-800 font-medium">Invities</span>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 animate-pulse"
            >
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
              <div className="flex gap-2 shrink-0">
                <Skeleton className="h-9 w-16 rounded-lg" />
                <Skeleton className="h-9 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Invities</h1>
          <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
            <span>Dashboard</span>
            <span>-</span>
            <span className="text-gray-800 font-medium">Invities</span>
          </div>
        </div>
        <ErrorState error={error} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invities</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Invities</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {tabMeta.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {counts[tab.key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Invite list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="flex justify-center mb-3">
            {activeTab === "college" ? (
              <Building2 className="w-10 h-10 text-gray-300" />
            ) : activeTab === "admission" ? (
              <FileText className="w-10 h-10 text-gray-300" />
            ) : activeTab === "entrance" ? (
              <ClipboardCheck className="w-10 h-10 text-gray-300" />
            ) : (
              <CalendarDays className="w-10 h-10 text-gray-300" />
            )}
          </div>
          <p className="text-sm font-medium">No {activeTab} invitations yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((invite) => {
            const displayName = invite.title || invite.type || "Invitation";
            return (
              <div
                key={invite.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl ${getAvatarColor(displayName)} flex items-center justify-center text-lg font-bold shrink-0`}
                  >
                    {getInitials(displayName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {displayName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {invite.message || `${displayName} invitation`}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {timeAgo(invite.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  {invite.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAccept(invite.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDecline(invite.id)}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {invite.status === "accepted" && (
                    <span className="px-4 py-2 text-xs font-medium text-green-700 bg-green-50 rounded-lg">
                      Accepted
                    </span>
                  )}
                  {invite.status === "declined" && (
                    <span className="px-4 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-lg">
                      Declined
                    </span>
                  )}
                  {invite.status === "saved" && (
                    <span className="px-4 py-2 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg">
                      Saved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && <Toast message={toast.message} />}
    </div>
  );
}
