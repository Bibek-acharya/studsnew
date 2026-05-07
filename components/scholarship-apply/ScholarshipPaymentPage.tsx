"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { scholarshipApi } from "@/services/api";

interface PaymentConfig {
  feeAmount: number;
  methods: string[];
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
  };
}

interface Scholarship {
  title: string;
  paymentConfig: PaymentConfig;
}

export default function ScholarshipPaymentPage({ scholarshipId }: { scholarshipId: number }) {
  const router = useRouter();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"esewa" | "bank">("esewa");
  const [applicantName, setApplicantName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await scholarshipApi.getScholarshipById(scholarshipId);
      setScholarship(data);
    };
    loadData();
  }, [scholarshipId]);

  const handlePayment = async () => {
    if (!contactNumber.trim()) return;

    setIsProcessing(true);
    try {
      const amount = scholarship?.paymentConfig?.feeAmount || 0;

      if (paymentMethod === "bank") {
        if (!paymentScreenshot) {
          alert("Please upload payment screenshot");
          setIsProcessing(false);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
          await scholarshipApi.uploadBankReceipt(scholarshipId, reader.result as string);
          router.push("/scholarship-success/" + scholarshipId + "?status=pending");
        };
        reader.readAsDataURL(paymentScreenshot);
      } else {
        await scholarshipApi.initiatePayment(scholarshipId, { method: paymentMethod, amount });
        router.push("/scholarship-success/" + scholarshipId + "?status=success");
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!scholarship?.paymentConfig) {
    return (
      <div className="min- h- screen bg- gray-50 flex items- center justify- center">
        <p className="text- gray-500">Loading...</p>
      </div>
    );
  }

  const paymentConfig = scholarship.paymentConfig;
  const feeAmount = paymentConfig.feeAmount || 0;
  const methods = paymentConfig.methods || ["esewa"];

  return (
    <div className="min- h- screen bg- gray-50 py-8">
      <div className="max- w- lg mx- auto bg- white rounded- lg shadow p-8">
        <h1 className="text- 2xl font- bold mb-2 text- gray-900">Payment</h1>
        <p className="text- gray-600 mb-6">{scholarship.title}</p>

        <div className="mb-6">
          <label className="block text- sm font- medium mb-2 text- gray-700">Payment Method</label>
          <div className="flex flex- wrap gap-3">
            {methods.includes("esewa") && (
              <label className="cursor- pointer flex items- center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "esewa"}
                  onChange={() => setPaymentMethod("esewa")}
                />
                <span className="border-2 rounded- lg p-3">eSewa</span>
              </label>
            )}
            {methods.includes("bank") && (
              <label className="cursor- pointer flex items- center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                />
                <span className="border-2 rounded- lg p-3">Bank</span>
              </label>
            )}
          </div>
        </div>

        {paymentMethod === "bank" && paymentConfig.bankDetails && (
          <div className="mb-6 p-4 bg- gray-50 rounded- lg">
            <p><strong>Bank:</strong> {paymentConfig.bankDetails.bankName}</p>
            <p><strong>Account:</strong> {paymentConfig.bankDetails.accountNumber}</p>
            <p><strong>Name:</strong> {paymentConfig.bankDetails.accountName}</p>
            <div className="mt-3">
              <label className="block text- sm font- medium mb-1">Upload Receipt</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                className="w- full"
              />
            </div>
          </div>
        )}

        <div className="mb-6 p-4 bg- gray-50 rounded- lg">
          <div className="flex justify- between font- bold text- lg">
            <span>Total Amount</span>
            <span className="text- blue-600">Rs. {feeAmount}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text- sm font- medium mb-1 text- gray-700">Applicant Name</label>
          <input
            type="text"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            className="w- full border border- gray-300 rounded- md py-2 px-3"
          />
        </div>

        <div className="mb-4">
          <label className="block text- sm font- medium mb-1 text- gray-700">Contact Number</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w- full border border- gray-300 rounded- md py-2 px-3"
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w- full bg- blue-600 text- white py-3 rounded- lg font- semibold hover: bg- blue-700 disabled: bg- gray-400"
        >
          {isProcessing ? "Processing..." : "Pay Rs. " + feeAmount}
        </button>
      </div>
    </div>
  );
}
