"use client";

import React from "react";
import FileUpload from "../common/FileUpload";

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
}

interface PaymentConfigSectionProps {
  enablePayment: boolean;
  setEnablePayment: (v: boolean) => void;
  paymentFeeAmount: number;
  setPaymentFeeAmount: (v: number) => void;
  enableBank: boolean;
  setEnableBank: (v: boolean) => void;
  bankDetails: BankDetails;
  setBankDetails: React.Dispatch<React.SetStateAction<BankDetails>>;
  qrCodeUrl: string;
  setQrCodeUrl: (v: string) => void;
  qrCodePreview: string;
  onQrCodeSelect: (file: File) => void;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

export const PaymentConfigSection: React.FC<PaymentConfigSectionProps> = ({
  enablePayment,
  setEnablePayment,
  paymentFeeAmount,
  setPaymentFeeAmount,
  enableBank,
  setEnableBank,
  bankDetails,
  setBankDetails,
  qrCodeUrl,
  setQrCodeUrl,
  qrCodePreview,
  onQrCodeSelect,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Payment Configuration</h2>
          <p className="text-sm text-gray-500 mt-0.5">Configure application fee and payment methods</p>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enable Application Fee
            </label>
            <p className="text-xs text-gray-500">If disabled, applications are free</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enablePayment}
              onChange={(e) => setEnablePayment(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {enablePayment && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Application Fee (NPR)
              </label>
              <input
                type="number"
                className={formInputClass}
                placeholder="Enter fee amount"
                value={paymentFeeAmount || ''}
                onChange={(e) => setPaymentFeeAmount(Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Set the application fee amount in NPR</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bank Transfer
                </label>
                <p className="text-xs text-gray-500">Enable bank transfer payment option</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableBank}
                  onChange={(e) => setEnableBank(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {enableBank && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Bank Name <span className="text-red-500">*</span></label>
                  <input
                    className={formInputClass}
                    placeholder="e.g. NMB Bank"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Account Name <span className="text-red-500">*</span></label>
                  <input
                    className={formInputClass}
                    placeholder="Account Holder Name"
                    value={bankDetails.accountName}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Account Number <span className="text-red-500">*</span></label>
                  <input
                    className={formInputClass}
                    placeholder="Account Number"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Branch <span className="text-red-500">*</span></label>
                  <input
                    className={formInputClass}
                    placeholder="Branch Name"
                    value={bankDetails.branch}
                    onChange={(e) => setBankDetails({ ...bankDetails, branch: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">QR Code <span className="text-red-500">*</span></label>
                  <FileUpload
                    accept="image/*"
                    maxSize="2MB"
                    onFileSelect={onQrCodeSelect}
                    previewUrl={qrCodePreview}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentConfigSection;