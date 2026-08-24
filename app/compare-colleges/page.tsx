"use client";

import { useRouter } from "next/navigation";
import type { College } from "@/services/api";
import CompareCollegesPage from "@/components/compare-colleges/CompareCollegesPage";

type CollegeInput = Partial<College> | string;

function extractId(input: CollegeInput): number | null {
  if (typeof input === "object" && input !== null && "id" in input && input.id) {
    return input.id as number;
  }
  return null;
}

export default function CompareCollegesRoute() {
  const router = useRouter();

  const handleNavigate = (
    _view: string,
    data?: { college1: CollegeInput; college2: CollegeInput },
  ) => {
    if (!data) return;
    const college1Id = extractId(data.college1);
    const college2Id = extractId(data.college2);
    if (college1Id === null || college2Id === null) return;
    router.push(`/compare-colleges/result?college1=${college1Id}&college2=${college2Id}`);
  };

  return <CompareCollegesPage onNavigate={handleNavigate} />;
}
