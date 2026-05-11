import React from "react";
import ScholarshipPaymentPage from "@/components/scholarship-apply/ScholarshipPaymentPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function Page({ params }: PageProps) {
  const { slug } = React.use(params);
  return <ScholarshipPaymentPage scholarshipSlug={slug} />;
}