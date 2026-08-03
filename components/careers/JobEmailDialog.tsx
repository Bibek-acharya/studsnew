"use client";

import React, { useState } from "react";
import { X, Envelope, Lightning } from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";

interface JobEmailDialogProps {
  applicantName: string;
  applicantEmail: string;
  action: "shortlist" | "reject";
  onSend: (subject: string, body: string) => Promise<void>;
  onSkip: () => Promise<void>;
  onCancel: () => void;
}

const templates: Record<string, { subject: string; body: string }> = {
  shortlist: {
    subject: "Congratulations! You've been shortlisted",
    body: `Dear {{name}},\n\nWe are pleased to inform you that you have been shortlisted for the next round of our hiring process.\n\nOur team will be in touch with you shortly regarding the next steps.\n\nBest regards,\nStudySphere Hiring Team`,
  },
  reject: {
    subject: "Update on your application",
    body: `Dear {{name}},\n\nThank you for your interest in joining StudySphere. After careful review, we have decided to move forward with other candidates for this position.\n\nWe encourage you to apply for future openings that match your skills and experience.\n\nBest regards,\nStudySphere Hiring Team`,
  },
};

export default function JobEmailDialog({
  applicantName,
  applicantEmail,
  action,
  onSend,
  onSkip,
  onCancel,
}: JobEmailDialogProps) {
  const [useTemplate, setUseTemplate] = useState(true);
  const [subject, setSubject] = useState(templates[action].subject);
  const [body, setBody] = useState(
    templates[action].body.replace("{{name}}", applicantName.split(" ")[0]),
  );
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    try {
      await onSend(subject, body);
    } finally {
      setSending(false);
    }
  };

  const handleSkip = async () => {
    setSending(true);
    try {
      await onSkip();
    } finally {
      setSending(false);
    }
  };

  const applyTemplate = () => {
    setSubject(templates[action].subject);
    setBody(
      templates[action].body.replace("{{name}}", applicantName.split(" ")[0]),
    );
    setUseTemplate(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Envelope className="w-5 h-5 text-blue-600" />
            Send Email
          </h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">To:</span>
            {applicantName} &lt;{applicantEmail}&gt;
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={applyTemplate}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                useTemplate
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Lightning className="w-3.5 h-3.5" />
              Use Template
            </button>
            <button
              onClick={() => {
                setUseTemplate(false);
                setSubject("");
                setBody("");
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                !useTemplate
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Write Manually
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none"
              placeholder="Email subject..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
              placeholder="Email body..."
            />
          </div>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs text-blue-600 hover:underline"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>

          {showPreview && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2 font-medium">Preview</p>
              <p className="text-sm font-medium text-gray-900 mb-2">
                Subject: {subject}
              </p>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {body}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSkip}
            disabled={sending}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Skip Email
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !body.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {sending && <Loader2 className="w-4 h-4 animate-spin" />}
            {sending ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
