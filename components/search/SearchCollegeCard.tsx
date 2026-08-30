"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgramCard } from "@/components/find-college/CollegeGrid";
import ClaimCollegeModal from "@/components/find-college/ClaimCollegeModal";
import { isCollegeVerified } from "@/app/find-college/types";
import type { SearchResult } from "./types";

export default function SearchCollegeCard({ item }: { item: SearchResult }) {
  const router = useRouter();
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const cardID = item.type === "institution" ? `inst_${item.id}` : Number(item.id);

  const college = {
    id: cardID,
    name: item.title,
    image_url: item.image || "",
    description: item.description || "",
    rating: item.rating || 0,
    type: item.institutionType || "College",
    location: item.location || "",
    affiliation: item.university || "",
    non_university_affiliation: item.nonUniversityAffiliation || "",
    verified: item.verified || false,
    claimed: item.claimed || false,
    featured: item.featured || false,
    website: item.website || "",
    reviews: item.reviews || 0,
    programs: item.programs || 0,
  };

  const verified = isCollegeVerified(college.verified);

  return (
    <>
      <ProgramCard
        college={college as React.ComponentProps<typeof ProgramCard>["college"]}
        isVerified={verified}
        isClaimed={item.claimed || false}
        isSaved={false}
        isBookmarkPending={false}
        isSelected={false}
        isQuickInquiryMode={false}
        onNavigate={(view, data) => {
          if (view === "collegeDetails" && data?.id) {
            const tab = data.tab ? `?tab=${encodeURIComponent(data.tab)}` : "";
            router.push(`/find-college/${data.id}${tab}`);
          }
        }}
        onToggleSaved={() => {}}
        onToggleSelection={() => {}}
        onClaim={() => setIsClaimOpen(true)}
        onSingleInquiry={() => router.push(`/find-college/${cardID}?inquiry=true`)}
      />
      {isClaimOpen && typeof cardID === "number" && (
        <ClaimCollegeModal
          college={{ id: cardID, name: item.title }}
          onClose={() => setIsClaimOpen(false)}
        />
      )}
    </>
  );
}
