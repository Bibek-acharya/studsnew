"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onLeavePage?: () => void;
}

export default function ConfirmDialog({ isOpen, onClose, onConfirm, onLeavePage }: ConfirmDialogProps) {
  const router = useRouter();

  const handleLeavePage = () => {
    onClose();
    if (onLeavePage) {
      onLeavePage();
    } else {
      router.push("/scholarship-recommender");
    }
  };

  const handleBackToPage = () => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100" onClick={handleOverlayClick}>
      <div className="bg-white rounded-md p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h2>
        <p className="text-gray-600 mb-6">Changing preferences will result in your current recommendations being lost.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleLeavePage}
            className="px-4 py-2 text-gray-900 hover:text-gray-700 font-medium transition-colors"
          >
            Leave page
          </button>
          <button
            onClick={handleBackToPage}
            className="px-4 py-2 text-gray-900 hover:text-gray-700 font-medium transition-colors"
          >
            Back to page
          </button>
        </div>
      </div>
    </div>
  );
}