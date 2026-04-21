"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, Download, Printer, Home, Calendar, Clock, MapPin } from "lucide-react";

interface ApplicationData {
  fullName: string;
  photoPreview: string;
}

export default function ShikshaSuccessPage() {
  const router = useRouter();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [rollNumber, setRollNumber] = useState("");
  const [showAdmitCard, setShowAdmitCard] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("shiksha_application_data");
    if (stored) {
      const data = JSON.parse(stored);
      setApplicationData(data);
      // Generate roll number
      const randomRoll = `PS-${Math.floor(1000 + Math.random() * 9000)}`;
      setRollNumber(randomRoll);
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

  // Success message view
  if (!showAdmitCard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your payment of Rs. 250 has been received and your application for Project Shiksha is complete.
          </p>
          
          <p className="text-sm text-gray-500 mb-8">
            We will contact you soon with further details about the entrance examination.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowAdmitCard(true)}
              className="flex-1 bg-[#0000ff] hover:bg-[#0000cc] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-5 h-5" />
              Download Admit Card
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-300 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admit Card view
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h2 className="text-xl font-bold text-gray-800">Your Admit Card</h2>
          <button
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-gray-800"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Printable Card */}
        <div id="printable-admit-card" className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 w-full overflow-hidden relative">
          {/* Decorative Top Banner */}
          <div className="h-3 bg-[#0000ff] w-full" />
          
          <div className="p-8">
            {/* Card Header */}
            <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-100">
              <div className="flex items-center gap-3">
                <Image
                  src="/studsphere.png"
                  alt="StudSphere"
                  width={140}
                  height={32}
                  className="h-8 w-auto"
                />
                <div>
                  <h3 className="font-extrabold text-[#0000ff] text-[20px] tracking-tight uppercase">Project Shiksha</h3>
                  <p className="text-[13px] text-gray-600 font-semibold tracking-widest uppercase mt-0.5">Entrance Exam 2082</p>
                </div>
              </div>
              <div className="text-right bg-blue-50 py-2 px-4 rounded-lg border border-blue-100">
                <p className="text-[11px] font-bold text-[#0000ff] uppercase tracking-wider mb-1">Roll Number</p>
                <p className="font-mono font-bold text-gray-900 text-[18px]">{rollNumber}</p>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Photo container */}
              <div className="w-32 h-40 bg-gray-50 border-2 border-gray-300 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                {applicationData.photoPreview ? (
                  <Image
                    src={applicationData.photoPreview}
                    alt="Candidate Photo"
                    width={120}
                    height={152}
                    className="w-full h-full object-cover rounded-sm"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Photo</span>
                )}
              </div>
              
              {/* Details */}
              <div className="flex-grow space-y-4 w-full">
                <div>
                  <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1">Candidate Name</p>
                  <p className="font-bold text-gray-900 text-[18px] border-b border-gray-200 pb-1">{applicationData.fullName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Exam Date
                    </p>
                    <p className="font-semibold text-gray-800 text-[14px]">15th Baisakh, 2082</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Time
                    </p>
                    <p className="font-semibold text-gray-800 text-[14px]">8:00 AM - 11:00 AM</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Exam Center
                  </p>
                  <p className="font-bold text-gray-800 text-[15px] bg-gray-50 p-2 rounded border border-gray-200">
                    Kathmandu District Main Center
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Instructions */}
            <div className="mt-8 pt-4 border-t border-dashed border-gray-300">
              <h4 className="text-[12px] font-bold text-gray-800 mb-2 uppercase">Important Instructions:</h4>
              <ul className="text-[11px] text-gray-600 space-y-1 list-disc pl-4">
                <li>Please bring a printed copy of this admit card to the examination hall.</li>
                <li>Arrive at the exam center at least 30 minutes before the scheduled time.</li>
                <li>Calculators and mobile phones are strictly prohibited.</li>
                <li>Bring a valid ID proof along with this admit card.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="mt-6 no-print flex gap-4">
          <button
            onClick={handlePrint}
            className="flex-1 bg-[#0000ff] hover:bg-[#0000cc] text-white font-bold text-[16px] py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Printer className="w-6 h-6" />
            Print / Save as PDF
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
