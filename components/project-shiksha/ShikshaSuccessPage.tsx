"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Download, Home, BadgeCheck, Printer } from "lucide-react";
import AdmitCard from "./AdmitCard";

interface ApplicationData {
  fullName: string;
  photoPreview: string;
  dobBS: string;
  dobAD: string;
  gender: string;
}

export default function ShikshaSuccessPage() {
  const router = useRouter();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [rollNumber, setRollNumber] = useState("");
  const [applicationNo, setApplicationNo] = useState("");
  const [showAdmitCard, setShowAdmitCard] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("shiksha_application_data");
    if (stored) {
      const data = JSON.parse(stored);
      setApplicationData(data);
      const randomRoll = `PS-${Math.floor(1000 + Math.random() * 9000)}`;
      setRollNumber(randomRoll);
      const randomAppNo = `RD${Math.floor(1000 + Math.random() * 9000)}S${Math.floor(100 + Math.random() * 900)}`;
      setApplicationNo(randomAppNo);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#0000ff] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your application...</p>
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
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your payment of Rs. 250 has been received and your application for Project Shiksha is complete.
          </p>
          
          <p className="text-sm text-gray-500 mb-8">
            We will contact you soon with further details about the entrance examination.
          </p>

          <button
            onClick={() => setShowAdmitCard(true)}
            className="w-full bg-[#0000ff] hover:bg-[#0000cc] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            View Admit Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-[210mm] mx-auto">
        {/* Printable Card */}
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

        {/* Print Button */}
        <div className="mt-6 no-print flex gap-4">
          <button
            onClick={handlePrint}
            className="flex-1 bg-[#0000ff] hover:bg-[#0000cc] text-white font-bold text-[16px] py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
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
