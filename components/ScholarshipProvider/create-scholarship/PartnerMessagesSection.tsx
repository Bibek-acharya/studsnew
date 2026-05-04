"use client";

import React, { useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import FileUpload from "../common/FileUpload";

export interface PartnerMessageItem {
  name: string;
  label: string;
  message: string;
  logo: string;
}

interface PartnerMessagesSectionProps {
  messages: PartnerMessageItem[];
  setMessages: React.Dispatch<React.SetStateAction<PartnerMessageItem[]>>;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

export const PartnerMessagesSection: React.FC<PartnerMessagesSectionProps> = ({ messages, setMessages }) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addMessage = () => {
    setMessages([...messages, { name: "", label: "", message: "", logo: "" }]);
  };

  const removeMessage = (index: number) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  const updateMessage = (index: number, field: keyof PartnerMessageItem, value: string) => {
    setMessages(messages.map((m, i) => i === index ? { ...m, [field]: value } : m));
  };

  const handleLogoUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const url = await scholarshipProviderApi.uploadImage(file, "partner-messages");
      setMessages(messages.map((m, i) => i === index ? { ...m, logo: url } : m));
    } catch (error) {
      console.error("Failed to upload logo:", error);
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Partner Messages</h2>
            <p className="text-sm text-gray-500 mt-0.5">Messages from partner organizations</p>
          </div>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
          onClick={addMessage}
        >
          <Plus size={16} /> Add Message
        </button>
      </div>
      <div className="p-6 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={formInputClass}
                  placeholder="Organization Name"
                  value={message.name ?? ""}
                  onChange={(e) => updateMessage(index, "name", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={formInputClass}
                    placeholder="e.g. From Our Partners"
                    value={message.label ?? ""}
                    onChange={(e) => updateMessage(index, "label", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`${formInputClass} resize-none`}
                    rows={2}
                    placeholder="Partner message content"
                    value={message.message ?? ""}
                    onChange={(e) => updateMessage(index, "message", e.target.value)}
                  />
                </div>
              </div>
              <div className="w-1/8 space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Logo <span className="text-red-500">*</span>
                </label>
                {uploadingIndex === index ? (
                  <p className="text-sm text-blue-600 py-2">Uploading...</p>
                ) : (
                  <FileUpload
                    label=""
                    uploadedText="Logo uploaded"
                    accept="image/*"
                    maxSize="2MB"
                    previewUrl={message.logo}
                    onFileSelect={(file) => handleLogoUpload(index, file)}
                    onClearPreview={() => updateMessage(index, "logo", "")}
                  />
                )}
              </div>
            </div>
            <button
              type="button"
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-6"
              onClick={() => removeMessage(index)}
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No partner messages added yet.</p>
        )}
      </div>
    </div>
  );
};

export default PartnerMessagesSection;
