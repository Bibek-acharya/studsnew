"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Download, Home, BadgeCheck, Printer, Loader2, AlertCircle } from "lucide-react";
import AdmitCard from "./AdmitCard";
import { scholarshipApi } from "../../services/api";

interface ApplicationData {
  fullName: string;
  photoPreview: string;
  dobBS: string;
  dobAD: string;
  gender: string;
  scholarshipId?: number;
  applicationId?: number;
  paymentConfig?: any;
}

export default function ShikshaSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [rollNumber, setRollNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [applicationNo, setApplicationNo] = useState("");
  const [showAdmitCard, setShowAdmitCard] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("shiksha_application_data");
    if (!stored) {
      router.push("/scholarship-apply/project-shiksha");
      return;
    }

    const data = JSON.parse(stored);
    setApplicationData(data);
    setApplicationNo(`RD${Math.floor(1000 + Math.random() * 9000)}S${Math.floor(100 + Math.random() * 900)}`);

    const verifyEsewa = async () => {
      const dataParam = searchParams.get("data");
      if (dataParam) {
        setIsVerifying(true);
        try {
          const decoded = JSON.parse(atob(dataParam));
          await scholarshipApi.esewaVerifyPayment(data.applicationId, decoded);
          sessionStorage.setItem("shiksha_payment_status", "completed");
          setPaymentStatus("completed");
        } catch (err: any) {
          setVerifyError(err.message || "Payment verification failed");
          setPaymentStatus("failed");
        } finally {
          setIsVerifying(false);
        }
      } else {
        const status = sessionStorage.getItem("shiksha_payment_status");
        setPaymentStatus(status);
      }
    };

    verifyEsewa();
  }, [router, searchParams]);

  const handlePrint = () => {
    window.print();
  };

  if (!applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#006400] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#006400] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we verify your eSewa payment...</p>
        </div>
      </div>
    );
  }

  if (verifyError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-4">{verifyError}</p>
          <button
            onClick={() => router.push("/scholarship-apply/project-shiksha/payment")}
            className="w-full bg-[#006400] hover:bg-[#004d00] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Payment
          </button>
        </div>
      </div>
    );
  }

  if (!showAdmitCard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BadgeCheck className="w-12 h-12 text-green-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {paymentStatus === "pending_verification" 
              ? "Application Received!" 
              : (applicationData.paymentConfig?.enabled && applicationData.paymentConfig?.fee_amount > 0 ? "Payment Successful!" : "Application Submitted!")}
          </h2>
          <p className="text-gray-600 mb-6">
            {paymentStatus === "pending_verification"
              ? "Your payment receipt has been uploaded. We will contact you after verifying the payment."
              : (applicationData.paymentConfig?.enabled && applicationData.paymentConfig?.fee_amount > 0 ? `Your payment of ${applicationData.paymentConfig.currency || "Rs."} ${applicationData.paymentConfig.fee_amount} has been received and your application for Project Shiksha is complete.` : "Application submitted successfully. Check your email for the admit card.")}
          </p>
          
          <p className="text-sm text-gray-500 mb-8">
            We will contact you soon with further details about the entrance examination. Please check your email for Admit card.
          </p>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-[#006400] hover:bg-[#004d00] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-[210mm] mx-auto">
        <AdmitCard
          fullName={applicationData.fullName}
          photoPreview={applicationData.photoPreview}
          rollNumber={rollNumber}
          applicationNo={applicationNo}
          dob={applicationData.dobAD || applicationData.dobBS}
          gender={applicationData.gender || "Not specified"}
          stream="Science"
          examCentre="Kathmandu Model College, Bagbazar"
          examDate="25.01.2083"
          examTime="09:00 A.M. To 11:30 A.M."
          shift="1st"
          subjectCode="101"
          subjectName="Science Entrance Test"
        />

        <div className="mt-6 no-print flex gap-4">
          <button
            onClick={handlePrint}
            className="flex-1 bg-[#006400] hover:bg-[#004d00] text-white font-bold text-[16px] py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Printer className="w-6 h-6" />
            Download / Print PDF
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-colors border border-gray-300 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}