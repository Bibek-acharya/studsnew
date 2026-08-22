"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiService, ForumCommunity } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-700" />
        </button>
        <h1 className="text-base font-bold text-slate-900">All Communities</h1>
      </div>

      {/* Community List */}
      <div className="px-4 py-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0000ff] border-t-transparent" />
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">No communities found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {communities.filter((c) => !c.is_general).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                    item.bg_color || "bg-blue-100/70"
                  }`}
                >
                  {item.icon ? (
                    <DynamicIcon name={item.icon} size={22} />
                  ) : (
                    <span className="text-lg">🎓</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.member_count ?? 0} members
                  </p>
                </div>

                <button
                  onClick={() => handleJoinToggle(item.id)}
                  disabled={joinLoading[item.id]}
                  className={`px-5 py-2 text-xs font-bold rounded-full transition-all flex-shrink-0 ${
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
