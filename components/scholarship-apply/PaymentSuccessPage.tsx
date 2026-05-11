"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, Home, Loader2, AlertCircle } from "lucide-react";
import { scholarshipApi } from "@/services/api";

export default function PaymentSuccessPage({ scholarshipSlug }: { scholarshipSlug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const stored = sessionStorage.getItem("scholarship_application_data");
      if (!stored) {
        setStatus("failed");
        setErrorMessage("Application data not found. Please submit the application again.");
        return;
      }

      const appData = JSON.parse(stored);
      const appId = appData.applicationId;
      const storedStatus = sessionStorage.getItem("scholarship_payment_status");

      if (storedStatus === "pending_verification") {
        setStatus("success");
        return;
      }

      const dataParam = searchParams.get("data");
      if (dataParam) {
        try {
          const decoded = JSON.parse(atob(dataParam));
          await scholarshipApi.esewaVerifyPayment(appId, decoded);
          sessionStorage.setItem("scholarship_payment_status", "completed");
          setAmount(decoded.total_amount || decoded.totalAmount || "");
          setStatus("success");
        } catch (err: any) {
          setErrorMessage(err.message || "Payment verification failed");
          setStatus("failed");
        }
      } else {
        if (storedStatus === "completed") {
          setStatus("success");
        } else {
          setStatus("failed");
          setErrorMessage("No payment data found.");
        }
      }
    };

    verifyPayment();
  }, [router, searchParams, scholarshipSlug]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#0000ff] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">{errorMessage || "Something went wrong with your payment."}</p>
          <button
            onClick={() => router.push(`/scholarship-pay/${scholarshipSlug}`)}
            className="w-full bg-[#0000ff] hover:bg-[#0000cc] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BadgeCheck className="w-12 h-12 text-green-500" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h2>
        {amount && (
          <p className="text-lg text-gray-600 mb-2">
            Amount Paid: <span className="font-bold text-[#0000ff]">Rs. {amount}</span>
          </p>
        )}
        <p className="text-gray-600 mb-8">
          Your payment has been received and your application is complete.
          We will contact you soon with further details.
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-[#0000ff] hover:bg-[#0000cc] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  );
}