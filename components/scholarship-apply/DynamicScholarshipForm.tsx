"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService, scholarshipApi } from "@/services/api";

interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "email" | "tel" | "date" | "textarea" | "select" | "file";
  required: boolean;
  options?: string[];
}

interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

type FormDataValue = string | number | null;

interface DynamicScholarshipFormProps {
  scholarshipId: number;
  scholarshipSlug?: string;
  scholarshipTitle: string;
  formConfig: { sections: FormSection[] };
}

export default function DynamicScholarshipForm({
  scholarshipId,
  scholarshipSlug,
  scholarshipTitle,
  formConfig,
}: DynamicScholarshipFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, FormDataValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (fieldId: string, value: FormDataValue) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
  };

  const handleFileChange = (fieldId: string, file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [fieldId]: typeof reader.result === "string" ? reader.result : null,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      handleChange(fieldId, null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    formConfig.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.required && !formData[field.id]) {
          newErrors[field.id] = `${field.label} is required`;
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        form_data: formData,
        scholarship_id: scholarshipId,
      };

      const response = await apiService.applyScholarship(scholarshipId, payload);
      const applicationId = response.data?.id || response.id;

      sessionStorage.setItem("scholarship_application_data", JSON.stringify({
        applicationId,
        scholarshipId,
        fullName: formData.full_name || formData.fullName || "",
        phone: formData.phone || formData.phone_number || "",
      }));
      router.push(`/scholarship-pay/${scholarshipSlug || scholarshipId}`);
    } catch (error) {
      console.error("Application error:", error);
      setSubmitError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const baseClass = "w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500";
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            value={formData[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={baseClass}
            rows={4}
          />
        );
      case "select":
        return (
          <select
            value={formData[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={baseClass}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case "file":
        return (
          <input
            type="file"
            onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
            className="w-full"
          />
        );
      default:
        return (
          <input
            type={field.type}
            value={formData[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={baseClass}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{scholarshipTitle}</h1>

      <form onSubmit={handleSubmit}>
        {formConfig.sections.map((section) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-800">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div
                  key={field.id}
                  className={field.type === "textarea" ? "md:col-span-2" : ""}
                >
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                  {renderField(field)}
                  {errors[field.id] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{submitError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}