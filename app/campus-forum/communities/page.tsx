"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiService, ForumCommunity } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import DynamicIcon from "@/components/shared/DynamicIcon";

function isArray<T>(data: unknown): data is T[] {
  return Array.isArray(data);
}

export default function CommunitiesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [communities, setCommunities] = useState<ForumCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState<Record<number, boolean>>({});

  const token = apiService.getToken();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const data = await apiService.getForumCommunities(token || undefined);
        setCommunities(isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  const handleJoinToggle = async (communityId: number) => {
    if (!isAuthenticated || !token) {
      return;
    }
    setJoinLoading((p) => ({ ...p, [communityId]: true }));
    try {
      const updated = await apiService.joinForumCommunity(token, communityId);
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? { ...c, is_member: updated.is_member, member_count: updated.member_count }
            : c
        )
      );
    } catch (e: any) {
      console.error(e?.message || "Failed to update membership");
    } finally {
      setJoinLoading((p) => ({ ...p, [communityId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Community List */}
      <div className="px-4 sm:px-8 lg:px-16 py-4 sm:py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0000ff] border-t-transparent" />
          </div>
        ) : communities.filter((c) => !c.is_general).length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-slate-800 font-bold text-lg mb-1">
              No communities yet.
            </h3>
            <p className="text-slate-500 text-sm">
              Be the first to create one and start the conversation!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {communities.filter((c) => !c.is_general).map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/campus-forum/${item.id}`)}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-base font-semibold flex-shrink-0 mb-3 ${
                    item.bg_color || "bg-blue-100/70"
                  }`}
                >
                  {item.icon ? (
                    <DynamicIcon name={item.icon} size={28} />
                  ) : (
                    <span className="text-2xl">🎓</span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  {item.member_count ?? 0} members
                </p>

                <button
                  onClick={() => handleJoinToggle(item.id)}
                  disabled={joinLoading[item.id]}
                  className={`w-full max-w-[160px] px-5 py-2.5 text-sm font-bold rounded-full transition-all ${
                    item.is_member
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-[#0000ff] hover:opacity-90 text-white active:scale-95"
                  }`}
                >
                  {joinLoading[item.id] ? "..." : item.is_member ? "Joined" : "Join"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
