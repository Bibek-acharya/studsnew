"use client";

import React, { useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import RichTextEditor from "../common/RichTextEditor";

interface SelectionProcessStepItem {
  step: number;
  title: string;
  description: string;
}

interface EligibilitySectionProps {
  sectionTitle: string;
  setSectionTitle: (v: string) => void;
  subtitle: string;
  setSubtitle: (v: string) => void;
  basicRequirements: string[];
  setBasicRequirements: React.Dispatch<React.SetStateAction<string[]>>;
  fullyFundedConditions: string[];
  setFullyFundedConditions: React.Dispatch<React.SetStateAction<string[]>>;
  partiallyFundedConditions: string[];
  setPartiallyFundedConditions: React.Dispatch<React.SetStateAction<string[]>>;
  selectionProcessSteps: SelectionProcessStepItem[];
  setSelectionProcessSteps: React.Dispatch<React.SetStateAction<SelectionProcessStepItem[]>>;
  requiredDocuments: string[];
  setRequiredDocuments: React.Dispatch<React.SetStateAction<string[]>>;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

const StringListInput: React.FC<{
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder?: string;
}> = ({ label, items, onAdd, onRemove, placeholder = "Add item..." }) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-800">{label}</h4>
      </div>
      <div className="flex gap-2 mb-2">
        <input
          className={`${formInputClass} text-sm flex-grow`}
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 flex items-center gap-1"
          onClick={handleAdd}
        >
          <Plus size={14} weight="bold" /> Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-3">
              <input className={`${formInputClass} text-sm flex-grow`} value={item} readOnly />
              <button
                type="button"
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                onClick={() => onRemove(i)}
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const EligibilitySection: React.FC<EligibilitySectionProps> = ({
  sectionTitle, setSectionTitle,
  subtitle, setSubtitle,
  basicRequirements, setBasicRequirements,
  fullyFundedConditions, setFullyFundedConditions,
  partiallyFundedConditions, setPartiallyFundedConditions,
  selectionProcessSteps, setSelectionProcessSteps,
  requiredDocuments, setRequiredDocuments,
}) => {
  const addStringItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter((prev) => [...prev, value]);
  };

  const removeStringItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const addStep = () => {
    setSelectionProcessSteps([...selectionProcessSteps, { step: selectionProcessSteps.length + 1, title: "", description: "" }]);
  };

  const removeStep = (index: number) => {
    setSelectionProcessSteps(selectionProcessSteps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof SelectionProcessStepItem, value: string | number) => {
    setSelectionProcessSteps(selectionProcessSteps.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const addDocument = () => {
    setRequiredDocuments([...requiredDocuments, ""]);
  };

  const removeDocument = (index: number) => {
    setRequiredDocuments(requiredDocuments.filter((_, i) => i !== index));
  };

  const updateDocument = (index: number, value: string) => {
    setRequiredDocuments(requiredDocuments.map((d, i) => i === index ? value : d));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Eligibility & Criteria Tab</h2>
          <p className="text-sm text-gray-500 mt-0.5">Requirements and conditions for applicants</p>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-6 border-b border-gray-200 pb-8 mb-8">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Section Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={formInputClass}
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Eligibility & Selection Criteria"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Short Description <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={subtitle}
              onChange={setSubtitle}
              placeholder="Requirements and selection process"
              minHeight={80}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-gray-200 pb-8">
          <StringListInput
            label="Basic Eligibility Requirements"
            items={basicRequirements}
            onAdd={(v) => addStringItem(setBasicRequirements, v)}
            onRemove={(i) => removeStringItem(setBasicRequirements, i)}
            placeholder="e.g. SEE pass with minimum GPA 2.5"
          />
          
          <StringListInput
            label="Fully Funded - Conditions"
            items={fullyFundedConditions}
            onAdd={(v) => addStringItem(setFullyFundedConditions, v)}
            onRemove={(i) => removeStringItem(setFullyFundedConditions, i)}
            placeholder="e.g. Family income below NPR 50,000"
          />
          
          <StringListInput
            label="Partially Funded - Conditions"
            items={partiallyFundedConditions}
            onAdd={(v) => addStringItem(setPartiallyFundedConditions, v)}
            onRemove={(i) => removeStringItem(setPartiallyFundedConditions, i)}
            placeholder="e.g. GPA above 3.0"
          />
        </div>

        <div className="pb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Selection Process Steps</h3>
            <button
              type="button"
              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm"
              onClick={addStep}
            >
              <Plus size={16} /> Add Step
            </button>
          </div>
          <div className="space-y-4">
            {selectionProcessSteps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Step #</label>
                    <input
                      className={formInputClass}
                      type="number"
                      value={step.step}
                      onChange={(e) => updateStep(index, "step", parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      className={formInputClass}
                      placeholder="Application"
                      value={step.title}
                      onChange={(e) => updateStep(index, "title", e.target.value)}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-grow">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <input
                        className={formInputClass}
                        placeholder="Online application submission"
                        value={step.description}
                        onChange={(e) => updateStep(index, "description", e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg mb-1"
                      onClick={() => removeStep(index)}
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Documents Required for Application</h3>
              <p className="text-sm text-gray-500 mt-0.5">List of documents applicants need to submit</p>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
              onClick={addDocument}
            >
              <Plus size={16} /> Add Document
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {requiredDocuments.map((doc, index) => (
              <div key={index} className="flex gap-3">
                <input
                  className={`${formInputClass} text-sm`}
                  placeholder="SEE Mark Sheet"
                  value={doc}
                  onChange={(e) => updateDocument(index, e.target.value)}
                />
                <button
                  type="button"
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  onClick={() => removeDocument(index)}
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilitySection;