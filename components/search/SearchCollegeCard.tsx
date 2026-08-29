"use client";

import { useRouter } from "next/navigation";
import { ProgramCard } from "@/components/find-college/CollegeGrid";
import type { SearchResult } from "./types";

export default function SearchCollegeCard({ item }: { item: SearchResult }) {
  const router = useRouter();

  const college = {
    id: Number(item.id),
    name: item.title,
    image_url: item.image || "",
    description: item.description || "",
    rating: item.rating || 0,
    type: item.institutionType || "College",
    location: item.location || "",
    affiliation: item.university || "",
    non_university_affiliation: "",
    verified: item.verified || false,
    claimed: false,
    featured: item.featured || false,
    website: item.website || "",
  };

  return (
    <ProgramCard
      college={college as React.ComponentProps<typeof ProgramCard>["college"]}
      isVerified={item.verified || false}
      isClaimed={false}
      isSaved={false}
      isBookmarkPending={false}
      isSelected={false}
      isQuickInquiryMode={false}
      onNavigate={(view, data) => {
        if (view === "collegeDetails" && data?.id) {
          router.push(`/find-college/${data.id}`);
        }
      }}
      onToggleSaved={() => {}}
      onToggleSelection={() => {}}
      onClaim={() => {}}
      onSingleInquiry={() => {}}
    />
  );
}
