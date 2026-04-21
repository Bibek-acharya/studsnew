"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  User, 
  Phone, 
  Banknote, 
  Lock, 
  UploadCloud, 
  Loader2, 
  CheckCircle, 
  Info,
  Landmark
} from "lucide-react";

type PaymentMethod = "esewa" | "khalti" | "bank";

interface ApplicationData {
  fullName: string;
  phone: string;
  photoPreview: string;
}

export default function ShikshaPaymentPage() {
  const router = useRouter();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("esewa");
  const [applicantName, setApplicantName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [showTimer, setShowTimer] = useState(false);

  const FEE_AMOUNT = 250;

  useEffect(() => {
    // Load application data from sessionStorage
    const stored = sessionStorage.getItem("shiksha_application_data");
    if (stored) {
      const data = JSON.parse(stored);
      setApplicationData(data);
      setApplicantName(data.fullName || "");
      setContactNumber(data.phone || "");
    } else {
      // Redirect back to form if no data
      router.push("/scholarship-apply/project-shiksha");
    }
  }, [router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showTimer && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showTimer, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handlePayment = async () => {
    if (!applicantName.trim()) {
      alert("Please enter applicant name");
      return;
    }
    if (!contactNumber.trim() || contactNumber.length !== 10) {
      alert("Please enter a valid 10-digit contact number");
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === "bank") {
      if (!paymentScreenshot) {
        alert("Please upload payment screenshot");
        setIsProcessing(false);
        return;
      }
      setShowTimer(true);
      
      // Simulate verification delay
      setTimeout(() => {
        setIsProcessing(false);
        setShowTimer(false);
        // Navigate to success page
        router.push("/scholarship-apply/project-shiksha/success");
      }, 5000);
      return;
    }

    // For eSewa and Khalti - simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to success page
      router.push("/scholarship-apply/project-shiksha/success");
    }, 2000);
  };

  const showBankPanel = paymentMethod === "bank";

  if (!applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0000ff]" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-gray-800 bg-[#F8FAFC]">
      <div className="max-w-125 w-full bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Payment Details</h2>
          <p className="text-[14px] text-gray-500 mt-1">Project Shiksha Scholarship Application</p>
        </div>

        {/* Payment Options */}
        <div className="mb-6">
          <label className="block text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wide">Select Method</label>
          <div className="flex flex-wrap gap-3">
            {/* eSewa */}
            <label className="relative cursor-pointer">
              <input
                type="radio"
                name="payment_method"
                value="esewa"
                checked={paymentMethod === "esewa"}
                onChange={() => setPaymentMethod("esewa")}
                className="peer sr-only"
              />
              <div className="w-24 h-14 border-2 border-gray-200 rounded-md flex items-center justify-center hover:border-gray-300 transition-colors peer-checked:border-[#0000ff] overflow-hidden p-1">
                <Image
                  src="/esewa_logo.jpg"
                  alt="eSewa"
                  width={80}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-[#0000ff] text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity shadow-sm">
                <CheckCircle className="w-3 h-3" />
              </div>
            </label>

            {/* Khalti */}
            <label className="relative cursor-pointer">
              <input
                type="radio"
                name="payment_method"
                value="khalti"
                checked={paymentMethod === "khalti"}
                onChange={() => setPaymentMethod("khalti")}
                className="peer sr-only"
              />
              <div className="w-24 h-14 border-2 border-gray-200 rounded-md flex items-center justify-center hover:border-gray-300 transition-colors peer-checked:border-[#0000ff] peer-checked:bg-blue-50/50 p-1">
                <Image
                  src="/khalti_logo.png"
                  alt="Khalti"
                  width={80}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-[#0000ff] text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity shadow-sm">
                <CheckCircle className="w-3 h-3" />
              </div>
            </label>

            {/* Bank Transfer */}
            <label className="relative cursor-pointer">
              <input
                type="radio"
                name="payment_method"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={() => setPaymentMethod("bank")}
                className="peer sr-only"
              />
              <div className="w-24 h-14 border-2 border-gray-200 rounded-md flex flex-col items-center justify-center hover:border-gray-300 transition-colors peer-checked:border-[#0000ff] peer-checked:bg-blue-50/50">
                <Landmark className="w-5 h-5 text-gray-500 peer-checked:text-[#0000ff] mb-0.5 transition-colors" />
                <span className="text-[10px] font-bold text-gray-500 peer-checked:text-[#0000ff] transition-colors">Bank QR</span>
              </div>
              <div className="absolute -top-2 -right-2 bg-[#0000ff] text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity shadow-sm">
                <CheckCircle className="w-3 h-3" />
              </div>
            </label>
          </div>
        </div>

        {/* Bank Details Panel */}
        <div className={`transition-all duration-300 overflow-hidden ${showBankPanel ? "max-h-100 opacity-100 mt-4 mb-6" : "max-h-0 opacity-0"}`}>
          <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg p-1.5 shrink-0 shadow-sm">
                {/* QR Code */}
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ProjectShikshaPayment-${FEE_AMOUNT}`}
                  alt="Bank QR Code"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-[13px] space-y-1.5 pt-1">
                <p className="flex justify-between border-b border-gray-200/50 pb-1">
                  <span className="text-gray-500 font-medium">Bank:</span>
                  <span className="font-bold text-gray-800">Nepal Bank Limited</span>
                </p>
                <p className="flex justify-between border-b border-gray-200/50 pb-1">
                  <span className="text-gray-500 font-medium">A/C Name:</span>
                  <span className="font-bold text-gray-800">Project Shiksha</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500 font-medium">A/C No:</span>
                  <span className="font-bold text-[#0000ff]">01234567890123</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                Upload Payment Screenshot <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#0000ff] file:text-white hover:file:bg-[#0000cc] cursor-pointer border border-gray-200 rounded-md bg-white transition-colors"
              />
              {paymentScreenshot && (
                <p className="text-green-600 text-[12px] mt-1">✓ {paymentScreenshot.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Fee Summary */}
        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 font-medium">Entrance Exam Fee</span>
            <span className="font-bold text-gray-800">Rs. {FEE_AMOUNT}.00</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 font-medium">Processing Fee</span>
            <span className="font-bold text-gray-800">Rs. 0.00</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="text-gray-800 font-bold">Total Amount</span>
            <span className="font-bold text-xl text-[#0000ff]">Rs. {FEE_AMOUNT}.00</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-1.5">
              Applicant Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-md pl-10 pr-4 py-3 text-sm focus:border-[#0000ff] outline-none transition-colors"
                placeholder="Full Name"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                  className="w-full border-2 border-gray-200 rounded-md pl-10 pr-4 py-3 text-sm tracking-wide focus:border-[#0000ff] outline-none transition-colors"
                  placeholder="9840000000"
                  maxLength={10}
                  required
                />
              </div>
            </div>
            <div className="w-32">
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Fee (NPR)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Banknote className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-md pl-10 pr-4 py-3 text-sm bg-gray-50 text-gray-500 outline-none cursor-not-allowed font-semibold text-left"
                  value={FEE_AMOUNT}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info & Checkbox */}
        {!showBankPanel && (
          <div className="space-y-4 mb-8">
            <div className="flex items-start text-[13px] text-gray-500 bg-blue-50/40 p-3.5 rounded-xl border border-blue-100">
              <Info className="w-4 h-4 text-[#0000ff] mt-0.5 mr-2.5 shrink-0" />
              <span className="leading-relaxed">Digital wallet payments may take up to 5 mins to be verified. Please do not close the window during payment.</span>
            </div>

            <label className="flex items-center space-x-3 cursor-pointer pt-1">
              <input type="checkbox" className="w-4 h-4 text-[#0000ff] rounded border-gray-300 focus:ring-[#0000ff]" defaultChecked />
              <span className="text-[13px] font-bold text-gray-700">Save my details for future applications</span>
            </label>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-[#0000ff] hover:bg-[#0000cc] disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{showBankPanel ? "Verifying..." : "Processing..."}</span>
            </>
          ) : showBankPanel ? (
            <>
              <UploadCloud className="w-4 h-4" />
              <span>Submit for Verification</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Complete Payment</span>
            </>
          )}
        </button>

        {/* Timer Display */}
        {showTimer && (
          <div className="mt-3 text-center text-[13px] text-gray-500">
            Estimated time remaining: <span className="font-bold text-[#0000ff] ml-1">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
