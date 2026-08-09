"use client";

import React, { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { ProgramCard } from "@/components/find-college/CollegeGrid";
import { College } from "@/services/api";
import { universityApi } from "@/services/university.api";
import { useAuth } from "@/services/AuthContext";
import { isCollegeVerified } from "@/app/find-college/types";

const toSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function Page({ params }: { params: { id: string } }) {
  const [university, setUniversity] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [bookmarkMap, setBookmarkMap] = useState<Record<number, number>>({});
  const [pendingBookmarks, setPendingBookmarks] = useState<
    Record<number, boolean>
  >({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [quickInquiryMode, setQuickInquiryMode] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("AffiliatedColleges: useEffect running, params.id =", params.id);
    (async () => {
      setLoading(true);
      try {
        const universityId = Number(params.id);
        console.log("AffiliatedColleges: universityId =", universityId);
        if (isNaN(universityId)) {
          setLoading(false);
          return;
        }

        // Fetch university details
        console.log("AffiliatedColleges: fetching university", universityId);
        const uniPayload = await universityApi.getUniversityById(universityId);
        console.log("AffiliatedColleges: uniPayload =", uniPayload);
        const uniData = uniPayload?.data?.university;
        if (uniData) {
          setUniversity({ id: uniData.id, name: uniData.name });
        }

        // Fetch affiliated colleges
        console.log("AffiliatedColleges: fetching affiliated colleges", universityId);
        const payload = await universityApi.getAffiliatedColleges(universityId);
        console.log("AffiliatedColleges: payload =", payload);
        const affiliated = payload?.data?.affiliated_colleges ?? [];
        setColleges(
          affiliated.map((c: any) => ({
            id: c.college_id || c.id,
            name: c.name,
            image_url: c.image_url,
            location: c.location,
            website: c.website,
            verified: c.verified ?? false,
            claimed: true,
            affiliation: c.affiliation || "",
            type: c.type || "College",
            rating: c.rating || 0,
            reviews: c.reviews || 0,
            featured: c.featured ?? false,
          } as College)),
        );
      } catch (err) {
        console.error("Failed to fetch affiliated colleges:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  useEffect(() => {
    if (!isAuthenticated) return;
    import("@/services/api").then(({ apiService }) => {
      apiService
        .getBookmarksByType("colleges")
        .then((items: any[]) => {
          const ids: number[] = [];
          const map: Record<number, number> = {};
          items.forEach((item: any) => {
            ids.push(item.item_id);
            map[item.item_id] = item.id;
          });
          setSavedIds(ids);
          setBookmarkMap(map);
        });
    });
  }, [isAuthenticated]);

  const handleToggleSaved = async (collegeId: number) => {
    if (!isAuthenticated) return;
    setPendingBookmarks((prev) => ({ ...prev, [collegeId]: true }));
    try {
      const { apiService } = await import("@/services/api");
      if (savedIds.includes(collegeId)) {
        const bookmarkId = bookmarkMap[collegeId];
        if (bookmarkId) await apiService.deleteBookmark(bookmarkId);
        setSavedIds((prev) => prev.filter((id) => id !== collegeId));
      } else {
        const result = await apiService.createBookmark(
          collegeId,
          "colleges",
        );
        setBookmarkMap((prev) => ({
          ...prev,
          [collegeId]: result.data.id,
        }));
        setSavedIds((prev) => [...prev, collegeId]);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
    } finally {
      setPendingBookmarks((prev) => ({ ...prev, [collegeId]: false }));
    }
  };

  const handleNavigate = (view: string, data?: any) => {
    if (view === "detail" && data?.id) {
      window.location.href = `/find-college/${data.id}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-350 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Home className="w-4 h-4" /> <span>Universities</span>{" "}
          <span>-</span>{" "}
          <span className="text-gray-800 font-medium">
            {university?.name || "University"} - Affiliated Colleges
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {university?.name || "University"} - Affiliated Colleges
        </h1>
        <p className="text-gray-500 mb-8">
          {colleges.length} affiliated colleges
        </p>

        {colleges.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No affiliated colleges found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <ProgramCard
                key={college.id}
                college={college}
                isVerified={isCollegeVerified(college.verified)}
                isClaimed={true}
                isSaved={savedIds.includes(college.id)}
                isBookmarkPending={pendingBookmarks[college.id]}
                isSelected={selectedIds.includes(college.id)}
                isQuickInquiryMode={quickInquiryMode}
                onNavigate={handleNavigate}
                onToggleSaved={() => handleToggleSaved(college.id)}
                onToggleSelection={() => {
                  setSelectedIds((prev) =>
                    prev.includes(college.id)
                      ? prev.filter((id) => id !== college.id)
                      : [...prev, college.id],
                  );
                }}
                onClaim={() => {}}
                onSingleInquiry={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
