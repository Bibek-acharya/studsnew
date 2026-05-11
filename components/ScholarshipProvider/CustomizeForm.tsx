"use client";

import React, { useState, memo } from "react";
import { Home, User, BookOpen, MapPin, Users, Info, Plus, SlidersHorizontal, X } from "lucide-react";
import ToggleSwitch from "./common/ToggleSwitch";
import { toast } from "sonner";

type FieldType = "text" | "number" | "email" | "file" | "textarea" | "tel" | "date" | "select";

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  disabled?: boolean;
}

interface FieldSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  btnColor: string;
  btnHover: string;
  fields: FormField[];
}

const FIELD_TYPE_OPTIONS: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "date", label: "Date" },
  { value: "textarea", label: "Textarea" },
  { value: "file", label: "File Upload" },
  { value: "select", label: "Dropdown" },
];

const CustomizeForm: React.FC = memo(() => {
  const [sections, setSections] = useState<FieldSection[]>([
    {
      id: "personal-details",
      title: "Personal Details",
      description: "Student name, gender, ethnicity, date of birth, contact info",
      icon: User,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      btnColor: "bg-blue-600",
      btnHover: "hover:bg-blue-700",
      fields: [
        { id: "full-name", label: "Student's Full Name", type: "text", required: true, disabled: true },
        { id: "gender", label: "Gender", type: "select", required: true, disabled: true },
        { id: "dob", label: "Date of Birth", type: "date", required: true, disabled: true },
        { id: "phone", label: "Phone Number", type: "tel", required: true },
        { id: "email", label: "Email Address", type: "email", required: false },
        { id: "photo", label: "Passport Size Photo", type: "file", required: true },
      ],
    },
    {
      id: "education-details",
      title: "Education Details",
      description: "SEE GPA, school information, academic records",
      icon: BookOpen,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      btnColor: "bg-green-600",
      btnHover: "hover:bg-green-700",
      fields: [
        { id: "see-gpa", label: "SEE Secured GPA", type: "text", required: true },
        { id: "school-type", label: "School Type", type: "select", required: true },
        { id: "school-name", label: "School Name", type: "text", required: true },
        { id: "school-province", label: "School Province", type: "select", required: true },
        { id: "school-district", label: "School District", type: "select", required: true },
        { id: "school-municipality", label: "School Municipality / RM", type: "text", required: true },
        { id: "school-tole", label: "School Tole / Village", type: "text", required: false },
        { id: "upload-docs", label: "Upload Documents (All)", type: "file", required: true },
      ],
    },
    {
      id: "address-details",
      title: "Address Details",
      description: "Permanent and temporary address information",
      icon: MapPin,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      btnColor: "bg-purple-600",
      btnHover: "hover:bg-purple-700",
      fields: [
        { id: "perm-province", label: "Permanent Province", type: "select", required: true },
        { id: "perm-district", label: "Permanent District", type: "select", required: true },
        { id: "perm-municipality", label: "Permanent Municipality / RM", type: "text", required: true },
        { id: "perm-ward", label: "Permanent Ward No.", type: "number", required: true },
        { id: "perm-tole", label: "Permanent Tole / Village", type: "text", required: false },
        { id: "temp-address", label: "Temporary Address (All Fields)", type: "textarea", required: false },
      ],
    },
    {
      id: "family-background",
      title: "Family Background",
      description: "Parent occupation details",
      icon: Users,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      btnColor: "bg-orange-600",
      btnHover: "hover:bg-orange-700",
      fields: [
        { id: "guardian-name", label: "Parent's Name", type: "text", required: true },
        { id: "guardian-phone", label: "Parent's Phone", type: "tel", required: true },
        { id: "guardian-email", label: "Parent's Email", type: "email", required: false },
        { id: "father-occupation", label: "Father's Occupation", type: "text", required: true },
        { id: "mother-occupation", label: "Mother's Occupation", type: "text", required: true },
        { id: "annual-income", label: "Annual Income", type: "number", required: true },
        { id: "family-assets", label: "Family Assets", type: "text", required: false },
      ],
    },
    {
      id: "additional-info",
      title: "Additional Information",
      description: "Extra-curricular activities, achievements, essays",
      icon: Info,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      btnColor: "bg-pink-600",
      btnHover: "hover:bg-pink-700",
      fields: [
        { id: "extra-curricular", label: "Extra-curricular Activities", type: "textarea", required: false },
        { id: "achievements", label: "Achievements & Awards", type: "textarea", required: false },
        { id: "essay", label: "Essay / Personal Statement", type: "textarea", required: false },
        { id: "reference-letters", label: "Reference Letters", type: "file", required: false },
      ],
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSectionId, setModalSectionId] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("text");
  const [labelError, setLabelError] = useState("");

  const openAddFieldModal = (sectionId: string) => {
    setModalSectionId(sectionId);
    setNewFieldLabel("");
    setNewFieldType("text");
    setLabelError("");
    setModalOpen(true);
  };

  const confirmAddField = () => {
    if (!newFieldLabel.trim()) {
      setLabelError("Field label is required");
      return;
    }
    setSections((prev) =>
      prev.map((section) =>
        section.id === modalSectionId
          ? {
              ...section,
              fields: [
                ...section.fields,
                { id: `custom-${Date.now()}`, label: newFieldLabel.trim(), type: newFieldType, required: true },
              ],
            }
          : section
      )
    );
    setModalOpen(false);
  };

  const toggleField = (sectionId: string, fieldId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map((field) =>
                field.id === fieldId && !field.disabled
                  ? { ...field, required: !field.required }
                  : field
              ),
            }
          : section
      )
    );
  };

  const resetDefaults = () => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        fields: section.fields.map((field) => ({
          ...field,
          required: !field.disabled,
        })),
      }))
    );
  };

  const saveChanges = () => {
    const config = sections.map((s) => ({
      section: s.title,
      fields: s.fields.map((f) => ({ label: f.label, type: f.type, required: f.required })),
    }));
    console.log("Form customization saved:", config);
    toast.success("Your custom application form is now live.");
  };

  const typeBadge = (type: FieldType) => {
    const colors: Record<FieldType, string> = {
      text: "bg-blue-50 text-blue-600",
      number: "bg-green-50 text-green-600",
      email: "bg-purple-50 text-purple-600",
      file: "bg-orange-50 text-orange-600",
      textarea: "bg-pink-50 text-pink-600",
      tel: "bg-cyan-50 text-cyan-600",
      date: "bg-yellow-50 text-yellow-600",
      select: "bg-indigo-50 text-indigo-600",
    };
    return (
      <span className={`${colors[type]} text-[10px] font-semibold px-1.5 py-0.5 rounded`}>
        {FIELD_TYPE_OPTIONS.find((o) => o.value === type)?.label || type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Customize Application Form</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Manage Scholarship</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Customize Form</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" /> Form Field Requirements
            </h2>
            <p className="text-sm text-gray-500 mt-1">Toggle fields to make them required or optional, add custom fields</p>
          </div>
          <div className="flex gap-2">
            <button onClick={resetDefaults} className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
              Reset to Default
            </button>
            <button onClick={saveChanges} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.id} className="border border-gray-200 rounded-lg p-5 mb-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${section.iconBg} ${section.iconColor} flex items-center justify-center`}>
                  <section.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{section.title}</h3>
                  <p className="text-xs text-gray-500">{section.description}</p>
                </div>
              </div>
              <button
                onClick={() => openAddFieldModal(section.id)}
                className={`px-4 py-2 ${section.btnColor} ${section.btnHover} text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2`}
              >
                <Plus className="w-4 h-4" /> Add Field
              </button>
            </div>
            <div className="space-y-2">
              {section.fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between py-2 px-3 bg-white rounded border border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{field.label}</span>
                    {typeBadge(field.type)}
                  </div>
                  <ToggleSwitch
                    checked={field.required}
                    onChange={() => toggleField(section.id, field.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Add Custom Field</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Field Label <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(e) => { setNewFieldLabel(e.target.value); setLabelError(""); }}
                  className={`w-full px-3 py-2 border ${labelError ? "border-red-400" : "border-gray-300"} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g. Mother's Name"
                  autoFocus
                />
                {labelError && <p className="text-xs text-red-500 mt-1">{labelError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Field Type</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {FIELD_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={confirmAddField} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

CustomizeForm.displayName = "CustomizeForm";

export default CustomizeForm;
