"use client";

import React, { useState } from "react";
import { CircleCheck, ClipboardList, FileText } from "lucide-react";
import { FormCard } from "../add-college/FormCard";
import { generateId } from "@/lib/superadmin/constants";

export function EligibilityCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  return (
    <FormCard icon={<CircleCheck size={24} className="text-indigo-600" />} title="Eligibility & Selection" sub="Detailed criteria, selection process, and required documents" locked={locked} onToggleLock={onToggleLock}>
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Basic Eligibility Criteria</label>
          <p className="mb-2 text-xs text-gray-500">Enter one criterion per line</p>
          <textarea className="input-field min-h-[120px]" rows={4} placeholder={"Must be a SEE graduate of 2081/2082 from any board in Nepal\nMust have scored minimum 2.0 GPA in SEE examination\nAge limit: Maximum 18 years as of application date\nMust be enrolled or planning to enroll in Grade 11/+2 program in Nepal\nPriority given to students from economically disadvantaged backgrounds"} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-md border border-green-100 bg-green-50/50 p-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-green-100 text-green-600"><CircleCheck size={14} /></div>
              Fully Funded Criteria
            </label>
            <textarea className="input-field min-h-[100px]" rows={3} placeholder={"Family annual income below NPR 150,000\nStrong academic record in SEE\nMust demonstrate financial need\n30 seats for boys, 30 seats for girls\nCovers tuition, food & accommodation"} />
          </div>
          <div className="rounded-md border border-blue-100 bg-blue-50/50 p-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-blue-600"><CircleCheck size={14} /></div>
              Partially Funded Criteria
            </label>
            <textarea className="input-field min-h-[100px]" rows={3} placeholder={"Family annual income below NPR 300,000\nGood academic performance in SEE\nMerit-based selection\nOpen to all genders\nCovers tuition fees only"} />
          </div>
        </div>

        <SelectionProcessSection />

        <RequiredDocsSection />
      </div>
    </FormCard>
  );
}

function SelectionProcessSection() {
  const [steps, setSteps] = useState([
    { id: generateId(), step: "1", title: "Application", desc: "Online application submission" },
    { id: generateId(), step: "2", title: "Entrance Exam", desc: "Written test (40% pass mark)" },
    { id: generateId(), step: "3", title: "Interview", desc: "Personal interview round" },
    { id: generateId(), step: "4", title: "Final Selection", desc: "Result publication" },
  ]);

  return (
    <div className="rounded-md border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-100 text-purple-600"><ClipboardList size={14} /></div>
          Selection Process Steps
        </label>
        <button type="button" onClick={() => setSteps((prev) => [...prev, { id: generateId(), step: String(prev.length + 1), title: "", desc: "" }])} className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add Step
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {steps.map((s) => (
          <div key={s.id} className="group relative rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
            <button type="button" onClick={() => setSteps((prev) => prev.filter((x) => x.id !== s.id))} className="absolute -right-2 -top-2 hidden rounded-full bg-red-500 p-0.5 text-white group-hover:block">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
            </button>
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{s.step}</div>
            <input type="text" className="mb-1 w-full bg-transparent text-center text-sm font-bold text-gray-900 outline-none" placeholder="Step title" defaultValue={s.title} />
            <input type="text" className="w-full bg-transparent text-center text-xs text-gray-600 outline-none" placeholder="Description" defaultValue={s.desc} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RequiredDocsSection() {
  const [docs, setDocs] = useState([
    "SEE Mark Sheet (Original & Copy)",
    "SEE Character Certificate",
    "Citizenship Certificate (if available)",
    "Birth Certificate",
    "Family Income Certificate",
    "Recommendation Letter",
    "Passport-sized Photos (4 copies)",
    "+2 Admission Confirmation",
  ]);

  const addDoc = () => {
    const newDoc = `Document ${docs.length + 1}`;
    setDocs((prev) => [...prev, newDoc]);
  };

  const removeDoc = (idx: number) => {
    setDocs((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateDoc = (idx: number, val: string) => {
    setDocs((prev) => prev.map((d, i) => (i === idx ? val : d)));
  };

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-bold text-amber-900">
          <FileText size={16} className="text-amber-600" /> Required Documents
        </label>
        <button type="button" onClick={addDoc} className="flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-700">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {docs.map((doc, i) => (
          <div key={i} className="flex items-center gap-2">
            <FileText size={14} className="shrink-0 text-amber-600" />
            <input type="text" className="w-full bg-transparent text-sm text-amber-800 outline-none" value={doc} onChange={(e) => updateDoc(i, e.target.value)} />
            <button type="button" onClick={() => removeDoc(i)} className="shrink-0 rounded p-0.5 text-amber-500 transition-colors hover:bg-amber-100 hover:text-amber-700">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
