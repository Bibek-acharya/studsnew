"use client";

import { useRouter } from "next/navigation";
import CourseCard from "@/components/course-finder/CourseCard";
import type { SearchResult } from "./types";

interface SearchCourseCardProps {
  item: SearchResult;
  isSaved: boolean;
  isBookmarkPending: boolean;
  onToggleSaved: (courseId: number) => void;
}

export default function SearchCourseCard({ item, isSaved, isBookmarkPending, onToggleSaved }: SearchCourseCardProps) {
  const router = useRouter();
  const detailsHref = `/course-finder/${item.id}`;

  return (
    <CourseCard
      course={{
        id: item.id,
        title: item.title,
        level: item.institutionType,
        duration: item.duration,
        affiliation: item.university || item.nonUniversityAffiliation,
        field: item.field,
        estFee: item.estFee,
      }}
      onDetails={() => router.push(detailsHref)}
      onViewColleges={() => router.push(detailsHref)}
      onToggleSaved={() => onToggleSaved(item.id)}
      isSaved={isSaved}
      isBookmarkPending={isBookmarkPending}
    />
  );
}
