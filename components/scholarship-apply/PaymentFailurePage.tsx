"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function PaymentFailurePage({ scholarshipSlug }: { scholarshipSlug: string }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-8">
          Your payment was not completed. Please try again or choose a different payment method.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/scholarship-pay/${scholarshipSlug}`)}
            className="w-full bg-[#006400] hover:bg-[#004d00] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-300 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}