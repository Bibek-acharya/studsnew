"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  User, Phone, Banknote, Lock, UploadCloud, Loader2, CheckCircle, Info, Landmark
} from "lucide-react";
import { scholarshipApi } from "@/services/api";

type PaymentMethod = "esewa" | "bank";

interface BankDetails {
  bank_name: string;
  account_name: string;
  account_number: string;
  branch: string;
}

interface PaymentConfig {
  fee_amount: number;
  currency: string;
  methods: string[];
  bank_details?: BankDetails;
  qr_code?: string;
}

interface ScholarshipData {
  id: number;
  title: string;
  paymentConfig: PaymentConfig;
}

export default function ScholarshipPaymentPage({ scholarshipSlug }: { scholarshipSlug: string }) {
  const router = useRouter();
  const [scholarship, setScholarship] = useState<ScholarshipData | null>(null);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [scholarshipId, setScholarshipId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("esewa");
  const [applicantName, setApplicantName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await scholarshipApi.getScholarshipById(scholarshipSlug) as any;
        const data = response.data || response;
        const resolvedId = data.id;
        setScholarshipId(resolvedId);

        let paymentConfig = data.payment_config || data.paymentConfig;

        const stored = sessionStorage.getItem("scholarship_application_data");
        let appData: any = null;
        if (stored) {
          appData = JSON.parse(stored);
          if (appData.scholarshipId === resolvedId) {
            setApplicationId(appData.applicationId);
            setApplicantName(appData.fullName || "");
            setContactNumber(appData.phone || appData.phoneNumber || "");
          }
          if (appData.paymentConfig && (!paymentConfig || !paymentConfig.fee_amount)) {
            paymentConfig = appData.paymentConfig;
          }
        }

        if (!paymentConfig || !paymentConfig.fee_amount) {
          const storedFallback = sessionStorage.getItem("shiksha_application_data");
          if (storedFallback) {
            const fallbackData = JSON.parse(storedFallback);
            if (fallbackData.paymentConfig && fallbackData.paymentConfig.fee_amount) {
              paymentConfig = fallbackData.paymentConfig;
            }
          }
        }

        setScholarship({
          id: resolvedId,
          title: data.title || "",
          paymentConfig: paymentConfig || {
            fee_amount: 0,
            currency: "Rs.",
            methods: ["esewa"],
          },
        });
      } catch (err) {
        console.error("Failed to load scholarship:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [scholarshipSlug]);

  const feeAmount = scholarship?.paymentConfig?.fee_amount || 0;
  const showBankPanel = paymentMethod === "bank";

  const getImageUrl = (url: any) => {
    if (!url || typeof url !== "string") return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return `${backendUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const handlePayment = async () => {
    if (!applicantName.trim()) {
      alert("Please enter applicant name");
      return;
    }
    if (!contactNumber.trim() || contactNumber.length < 7) {
      alert("Please enter a valid contact number");
      return;
    }
    if (!applicationId) {
      alert("Application ID is missing. Please submit the application first.");
      return;
    }
    if (!scholarshipId) {
      alert("Scholarship data not loaded yet. Please wait.");
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

        const initResp: any = await scholarshipApi.initiatePayment(scholarshipId, {
          method: "bank",
          amount: feeAmount,
          application_id: applicationId,
        });
        const paymentId = initResp.data?.id || initResp.id;
        const reader = new FileReader();
        reader.onloadend = async () => {
          await scholarshipApi.uploadBankReceipt(paymentId, reader.result as string);
          sessionStorage.setItem("scholarship_payment_status", "pending_verification");
          setIsProcessing(false);
          router.push(`/scholarship-pay/${scholarshipId}/success`);
        };
        reader.readAsDataURL(paymentScreenshot);
      } else {
        const initResp: any = await scholarshipApi.esewaInitiate(applicationId, feeAmount);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0000ff]" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!scholarship || feeAmount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No payment configuration found for this scholarship.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-gray-800 bg-[#F8FAFC]">
      <div className="max-w-125 w-full bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Payment Details</h2>
          <p className="text-[14px] text-gray-500 mt-1">{scholarship.title}</p>
        </div>

        <div className="mb-6">
          <label className="block text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wide">Select Method</label>
          <div className="flex flex-wrap gap-3">
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

            {scholarship?.paymentConfig?.methods?.includes("bank") && (
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
            )}
          </div>
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${showBankPanel ? "max-h-100 opacity-100 mt-4 mb-6" : "max-h-0 opacity-0"}`}>
          <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg p-1.5 shrink-0 shadow-sm">
                <img
                  src={getImageUrl(scholarship?.paymentConfig?.qr_code) || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Payment-${feeAmount}`}
                  alt="Bank QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-[13px] space-y-1.5 pt-1">
                <p className="flex justify-between border-b border-gray-200/50 pb-1">
                  <span className="text-gray-500 font-medium">Bank:</span>
                  <span className="font-bold text-gray-800">{scholarship?.paymentConfig?.bank_details?.bank_name || "Nepal Bank Limited"}</span>
                </p>
                <p className="flex justify-between border-b border-gray-200/50 pb-1">
                  <span className="text-gray-500 font-medium">A/C Name:</span>
                  <span className="font-bold text-gray-800">{scholarship?.paymentConfig?.bank_details?.account_name || "Account Name"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500 font-medium">A/C No:</span>
                  <span className="font-bold text-[#0000ff]">{scholarship?.paymentConfig?.bank_details?.account_number || "01234567890123"}</span>
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

        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 font-medium">Application Fee</span>
            <span className="font-bold text-gray-800">{scholarship?.paymentConfig?.currency || "Rs."} {feeAmount}.00</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 font-medium">Processing Fee</span>
            <span className="font-bold text-gray-800">Rs. 0.00</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="text-gray-800 font-bold">Total Amount</span>
            <span className="font-bold text-xl text-[#0000ff]">{scholarship?.paymentConfig?.currency || "Rs."} {feeAmount}.00</span>
          </div>
        </div>

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
                  value={feeAmount}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {!showBankPanel && (
          <div className="space-y-4 mb-8">
            <div className="flex items-start text-[13px] text-gray-500 bg-blue-50/40 p-3.5 rounded-xl border border-blue-100">
              <Info className="w-4 h-4 text-[#0000ff] mt-0.5 mr-2.5 shrink-0" />
              <span className="leading-relaxed">Digital wallet payments may take up to 5 mins to be verified. Please do not close the window during payment.</span>
            </div>
          </div>
        )}

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
              <span>Pay {scholarship?.paymentConfig?.currency || "Rs."} {feeAmount}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}