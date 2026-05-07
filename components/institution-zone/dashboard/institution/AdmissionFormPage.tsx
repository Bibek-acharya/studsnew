"use client";
import React, { useState } from "react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { Plus, Trash, Eye, Gear } from "@phosphor-icons/react";

interface FormField {
  id: number;
  name: string;
  type: string;
  placeholder: string;
}

const inputClass =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

const FIELD_TYPES = [
  "text",
  "email",
  "number",
  "tel",
  "date",
  "select",
  "textarea",
  "file",
];

const DEFAULT_FIELDS: FormField[] = [
  { id: 1, name: "Student Name", type: "text", placeholder: "Enter full name" },
  { id: 2, name: "Contact Number", type: "tel", placeholder: "98XXXXXXXX" },
  { id: 3, name: "Email", type: "email", placeholder: "student@example.com" },
  { id: 4, name: "Parent Contact", type: "tel", placeholder: "98XXXXXXXX" },
  { id: 5, name: "Current Address", type: "textarea", placeholder: "Enter current address" },
  { id: 6, name: "SEE School", type: "text", placeholder: "School name" },
  { id: 7, name: "School Address", type: "textarea", placeholder: "School address" },
  { id: 8, name: "Stream", type: "select", placeholder: "Select stream" },
  { id: 9, name: "Shift", type: "select", placeholder: "Select shift" },
];

const AdmissionFormPage: React.FC = () => {
  const [mode, setMode] = useState<"configure" | "preview">("configure");
  const [formFields, setFormFields] = useState<FormField[]>(DEFAULT_FIELDS);
  const [newField, setNewField] = useState({ name: "", type: "text", placeholder: "" });

  const [previewValues, setPreviewValues] = useState<Record<number, string>>({});

  const addField = () => {
    if (!newField.name.trim()) return;
    const maxId = Math.max(0, ...formFields.map((f) => f.id));
    setFormFields((prev) => [
      ...prev,
      { id: maxId + 1, name: newField.name, type: newField.type, placeholder: newField.placeholder },
    ]);
    setNewField({ name: "", type: "text", placeholder: "" });
  };

  const removeField = (id: number) => {
    setFormFields((prev) => prev.filter((f) => f.id !== id));
  };

  const renderFieldInput = (field: FormField) => {
    const val = previewValues[field.id] || "";
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setPreviewValues((prev) => ({ ...prev, [field.id]: e.target.value }));

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            rows={3}
            placeholder={field.placeholder}
            value={val}
            onChange={onChange}
            className={`${inputClass} resize-none`}
          />
        );
      case "select":
        return (
          <select value={val} onChange={onChange} className={inputClass}>
            <option value="">{field.placeholder}</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        );
      case "file":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500">Click to upload file</p>
            <input type="file" className="mt-2 text-sm" />
          </div>
        );
      default:
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={val}
            onChange={onChange}
            className={inputClass}
          />
        );
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader
        title="Admission Form"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
          { label: "Admission Form" },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <button
            onClick={() => setMode("configure")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              mode === "configure"
                ? "bg-blue-600 text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Gear weight="bold" className="w-4 h-4" /> Configure
          </button>
          <button
            onClick={() => setMode("preview")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              mode === "preview"
                ? "bg-blue-600 text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Eye weight="bold" className="w-4 h-4" /> Preview
          </button>
        </div>

        {mode === "configure" ? (
          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Add New Field</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className={labelClass}>Field Name</label>
                  <input
                    placeholder="e.g. Date of Birth"
                    value={newField.name}
                    onChange={(e) =>
                      setNewField((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Field Type</label>
                  <select
                    value={newField.type}
                    onChange={(e) =>
                      setNewField((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className={inputClass}
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Placeholder</label>
                  <input
                    placeholder="Placeholder text"
                    value={newField.placeholder}
                    onChange={(e) =>
                      setNewField((prev) => ({
                        ...prev,
                        placeholder: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <button
                    onClick={addField}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-1.5"
                  >
                    <Plus weight="bold" className="w-4 h-4" /> Add Field
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Existing Fields ({formFields.length})
              </h3>
              <div className="space-y-2">
                {formFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-200 px-4 py-3"
                  >
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 min-w-[140px]">
                        {field.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {field.type}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {field.placeholder || "No placeholder"}
                      </span>
                    </div>
                    <button
                      onClick={() => removeField(field.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50"
                    >
                      <Trash weight="bold" className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="max-w-2xl mx-auto space-y-5">
              {formFields.map((field) => (
                <div key={field.id}>
                  <label className={labelClass}>
                    {field.name}
                    {field.type !== "file" && field.type !== "select" && field.type !== "textarea" && (
                      <span className="text-red-500 ml-0.5">*</span>
                    )}
                  </label>
                  {renderFieldInput(field)}
                </div>
              ))}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionFormPage;
