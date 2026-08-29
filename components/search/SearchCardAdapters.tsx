"use client";

import { EventCard } from "@/components/cards/EventCard";
import { ScholarshipCard } from "@/components/cards/ScholarshipCard";
import UniversityCard from "@/components/education/university-listing/UniversityCard";
import type { SearchResult } from "./types";

function stripHtml(html?: string): string {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

export function SearchEventAdapter({ item }: { item: SearchResult }) {
  return (
    <EventCard
      event={{
        id: item.id,
        slug: item.slug || String(item.id),
        title: item.title,
        image: item.image || undefined,
        category: item.institutionType || undefined,
        location: item.location || undefined,
        excerpt: item.description ? stripHtml(item.description) : undefined,
      }}
    />
  );
}

export function SearchScholarshipAdapter({ item }: { item: SearchResult }) {
  return (
    <ScholarshipCard
      scholarship={{
        id: item.id,
        slug: item.slug || String(item.id),
        title: item.title,
        org: item.university || "",
        badgeType: item.institutionType || undefined,
        location: item.location || undefined,
        imageUrl: item.image || undefined,
      }}
    />
  );
}

export function SearchUniversityAdapter({ item }: { item: SearchResult }) {
  return (
    <UniversityCard
      university={{
        id: item.id,
        name: item.title,
        location: item.location || "",
        rating: String(item.rating || 0),
        type: (item.institutionType as "Public" | "Private" | "") || "",
        rank: "",
        programs: 0,
        colleges: 0,
        tags: [],
        cover: item.image || undefined,
        website: item.website || undefined,
        verified: item.verified || false,
      }}
    />
  );
}
