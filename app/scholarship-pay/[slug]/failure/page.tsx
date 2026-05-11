import React, { Suspense } from "react";
import PaymentFailurePage from "@/components/scholarship-apply/PaymentFailurePage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function Page({ params }: PageProps) {
  const { slug } = React.use(params);
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#0000ff] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentFailurePage scholarshipSlug={slug} />
    </Suspense>
  );
}