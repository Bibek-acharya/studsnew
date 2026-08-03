"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, FileText, Upload } from "lucide-react";
import { careersApi } from "@/services/api";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
});

type FormData = z.infer<typeof schema>;

interface ApplicationModalProps {
  jobId: number;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationModal({ jobId, jobTitle, isOpen, onClose }: ApplicationModalProps) {
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const resumeRef = useRef<HTMLInputElement>(null);
  const clRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!isOpen) return null;

  const validateFile = (file: File, name: string): boolean => {
    if (file.type !== "application/pdf") {
      toast.error(`${name} must be a PDF file`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${name} must be less than 5MB`);
      return false;
    }
    return true;
  };

  const onSubmit = async (data: FormData) => {
    if (!resume) {
      toast.error("Resume is required");
      return;
    }
    if (!validateFile(resume, "Resume")) return;
    if (coverLetter && !validateFile(coverLetter, "Cover letter")) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("full_name", data.full_name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("resume", resume);
      if (coverLetter) {
        formData.append("cover_letter", coverLetter);
      }

      await careersApi.submitApplication(jobId, formData);
      toast.success("Application submitted successfully!");
      reset();
      setResume(null);
      setCoverLetter(null);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Apply for Position</h2>
            <p className="text-sm text-gray-500">{jobTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              {...register("full_name")}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              {...register("phone")}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+977 9800000000"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF, max 5MB) *</label>
            <input
              ref={resumeRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => resumeRef.current?.click()}
              className="w-full flex items-center gap-3 px-3 py-3 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors text-left"
            >
              {resume ? (
                <>
                  <FileText size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{resume.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(resume.size)}</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={20} className="text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload resume</p>
                </>
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (PDF, max 5MB, optional)</label>
            <input
              ref={clRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setCoverLetter(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => clRef.current?.click()}
              className="w-full flex items-center gap-3 px-3 py-3 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors text-left"
            >
              {coverLetter ? (
                <>
                  <FileText size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{coverLetter.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(coverLetter.size)}</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={20} className="text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload cover letter</p>
                </>
              )}
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
