"use client";

import { apiService, scholarshipApi } from "../../services/api";
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

type PaymentMethod = "esewa" | "bank";

interface ApplicationData {
  fullName: string;
  scholarshipId: number;
  applicationId: number;
  phone: string;
  photoPreview: string;
  paymentConfig?: {
    enabled: boolean;
    fee_amount: number;
    currency: string;
    methods: string[];
    bank_name: string;
    account_name: string;
    account_number: string;
    bank_details?: {
      branch: string;
      bank_name: string;
      account_name: string;
      account_number: string;
    };
    qr_code: string;
  };
}

export default function ShikshaPaymentPage() {
  const router = useRouter();

  const getImageUrl = (url: any) => {
    if (!url || typeof url !== "string") return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return `${backendUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("esewa");
  const [applicantName, setApplicantName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [showTimer, setShowTimer] = useState(false);

  const feeAmount = applicationData?.paymentConfig?.fee_amount || 250;

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

    try {
      if (paymentMethod === "bank") {
        if (!paymentScreenshot) {
          alert("Please upload payment screenshot");
          setIsProcessing(false);
          return;
        }

        const initResp: any = await scholarshipApi.initiatePayment(applicationData?.scholarshipId!, {
          method: "bank",
          amount: feeAmount,
          application_id: applicationData?.applicationId
        });
        const paymentId = initResp.data?.id || initResp.id;

        const receiptUrl = await apiService.uploadScholarshipFile(paymentScreenshot, "receipts");
        await scholarshipApi.uploadBankReceipt(paymentId, receiptUrl);

        sessionStorage.setItem("shiksha_payment_status", "pending_verification");
        setIsProcessing(false);
        router.push("/scholarship-apply/project-shiksha/success");
      } else {
        // eSewa - redirect to eSewa gateway
        const initResp: any = await scholarshipApi.esewaInitiate(
          applicationData?.applicationId!,
          feeAmount
        );
        const esewaData = initResp.data;

        const form = document.createElement("form");
        form.method = "POST";
        form.action = esewaData.gateway_url;
        form.style.display = "none";

        const fields: Record<string, string> = {
          amount: esewaData.amount,
          tax_amount: esewaData.tax_amount,
          total_amount: esewaData.total_amount,
          transaction_uuid: esewaData.transaction_uuid,
          product_code: esewaData.product_code,
          product_service_charge: "0",
          product_delivery_charge: "0",
          success_url: esewaData.success_url,
          failure_url: esewaData.failure_url,
          signed_field_names: "total_amount,transaction_uuid,product_code",
          signature: esewaData.signature,
        };

        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const showBankPanel = paymentMethod === "bank";

  if (!applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#006400]" />
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
              <div className="w-24 h-14 border-2 border-gray-200 rounded-md flex items-center justify-center hover:border-gray-300 transition-colors peer-checked:border-[#006400] overflow-hidden p-1">
                <Image
                  src="/esewa_logo.jpg"
                  alt="eSewa"
                  width={80}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-[#006400] text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity shadow-sm">
                <CheckCircle className="w-3 h-3" />
              </div>
            </label>

            {/* Bank Transfer - Only show if enabled in config */}
            {(applicationData?.paymentConfig?.methods && applicationData?.paymentConfig?.methods.includes("bank")) && (
              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="payment_method"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="peer sr-only"
                />
                <div className="w-24 h-14 border-2 border-gray-200 rounded-md flex flex-col items-center justify-center hover:border-gray-300 transition-colors peer-checked:border-[#006400] peer-checked:bg-blue-50/50">
                  <Landmark className="w-5 h-5 text-gray-500 peer-checked:text-[#006400] mb-0.5 transition-colors" />
                  <span className="text-[10px] font-bold text-gray-500 peer-checked:text-[#006400] transition-colors">Bank QR</span>
                </div>
                <div className="absolute -top-2 -right-2 bg-[#006400] text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity shadow-sm">
                  <CheckCircle className="w-3 h-3" />
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Bank Details Panel */}
        <div className={`transition-all duration-300 overflow-hidden ${showBankPanel ? "max-h-100 opacity-100 mt-4 mb-6" : "max-h-0 opacity-0"}`}>
          <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg p-1.5 shrink-0 shadow-sm">
                {/* QR Code */}
                <img
                  src={getImageUrl(applicationData?.paymentConfig?.qr_code) || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ProjectShikshaPayment-${feeAmount}`}
                  alt="Bank QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-[13px] space-y-1.5 pt-1">
                <p className="flex justify-between border-b border-gray-200/50 pb-1">
                  <span className="text-gray-500 font-medium">Bank:</span>
                  <span className="font-bold text-gray-800">{applicationData?.paymentConfig?.bank_details?.bank_name || "Nepal Bank Limited"}</span>
                </p>
                <p className="flex justify-between border-b border-gray-200/50 pb-1">
                  <span className="text-gray-500 font-medium">A/C Name:</span>
                  <span className="font-bold text-gray-800">{applicationData?.paymentConfig?.bank_details?.account_name || "Project Shiksha"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500 font-medium">A/C No:</span>
                  <span className="font-bold text-[#006400]">{applicationData?.paymentConfig?.bank_details?.account_number || "01234567890123"}</span>
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
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#006400] file:text-white hover:file:bg-[#004d00] cursor-pointer border border-gray-200 rounded-md bg-white transition-colors"
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
            <span className="font-bold text-gray-800">Rs. {feeAmount}.00</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 font-medium">Processing Fee</span>
            <span className="font-bold text-gray-800">Rs. 0.00</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="text-gray-800 font-bold">Total Amount</span>
            <span className="font-bold text-xl text-[#006400]">Rs. {feeAmount}.00</span>
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
                className="w-full border-2 border-gray-200 rounded-md pl-10 pr-4 py-3 text-sm focus:border-[#006400] outline-none transition-colors"
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
                  className="w-full border-2 border-gray-200 rounded-md pl-10 pr-4 py-3 text-sm tracking-wide focus:border-[#006400] outline-none transition-colors"
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
                  value={feeAmount}
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
              <Info className="w-4 h-4 text-[#006400] mt-0.5 mr-2.5 shrink-0" />
              <span className="leading-relaxed">Digital wallet payments may take up to 5 mins to be verified. Please do not close the window during payment.</span>
            </div>

            <label className="flex items-center space-x-3 cursor-pointer pt-1">
              <input type="checkbox" className="w-4 h-4 text-[#006400] rounded border-gray-300 focus:ring-[#006400]" defaultChecked />
              <span className="text-[13px] font-bold text-gray-700">Save my details for future applications</span>
            </label>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-[#006400] hover:bg-[#004d00] disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
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
            Estimated time remaining: <span className="font-bold text-[#006400] ml-1">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
