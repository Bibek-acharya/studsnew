"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import ShikshaApplicationForm from "@/components/project-shiksha/ShikshaApplicationForm";

export default function ScholarshipApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  const { data: detailRes, isLoading } = useQuery({
    queryKey: ["scholarship", slug],
    queryFn: () => apiService.getEducationScholarshipById(slug),
    retry: false,
  });

  const scholarship = detailRes?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!scholarship) {
    return (
      <ShikshaApplicationForm
        scholarshipTitle="Project Shiksha Scholarship"
        scholarshipId={undefined}
      />
    );
  }

  const examCenters = (scholarship.exam_centers_new || scholarship.exam_centers || []).map((ec: any) => typeof ec === "string" ? ec : ec.centerName || ec.name).filter(Boolean);

  const partnerLogos = (() => {
    const groups = scholarship.partner_groups || [];
    const logos: { name: string; logo: string }[] = [];
    for (const g of groups) {
      if (g.partners) {
        for (const p of g.partners) {
          if (p.logo) logos.push({ name: p.name || "", logo: p.logo });
        }
      }
    }
    return logos;
  })();

  return <ShikshaApplicationForm scholarshipTitle={scholarship.title} scholarshipId={scholarship.id || undefined} scholarshipSlug={slug} examCenters={examCenters} paymentConfig={scholarship.payment_config} partnerLogos={partnerLogos.length > 0 ? partnerLogos : undefined} />;
}
