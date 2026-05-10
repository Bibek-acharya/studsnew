"use client";

import { ChevronRight, CheckCircle, CircleAlert, ClipboardList, FileText } from "lucide-react";

export function EligibilityTab({ criteria, docs, selectionSteps, sectionTitle, sectionSubtitle }: { criteria: string[]; docs: string[]; selectionSteps: { num: string; title: string; desc: string }[] | null; sectionTitle?: string; sectionSubtitle?: string }) {
  if (criteria.length === 0 && docs.length === 0 && !selectionSteps) return null;
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900 break-words hyphens-none" dangerouslySetInnerHTML={{ __html: sectionTitle || "Eligibility &amp; Selection Criteria" }} />
        <p className="mt-1 text-[14px] text-gray-500 break-words hyphens-none" dangerouslySetInnerHTML={{ __html: sectionSubtitle || "Requirements and selection process" }} />
      </div>
      <div className="space-y-6">
        {criteria.length > 0 && (
        <div className="rounded-md border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-[17px] font-bold text-gray-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white"><CheckCircle size={16} /></div>
            Eligibility Criteria
          </h3>
          <ul className="space-y-3">
            {criteria.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-gray-700">
                <ChevronRight size={20} className="mt-0.5 shrink-0 text-blue-600" />
                <span className="break-words" dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        </div>
        )}
        {selectionSteps && (
          <SelectionProcessSteps steps={selectionSteps} />
        )}
        {docs.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-[16px] font-bold text-amber-900">
            <CircleAlert size={20} className="text-amber-600" /> Required Documents
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {docs.map((doc, i) => (
              <div key={i} className="flex items-center gap-2 text-[14px] text-amber-800">
                <FileText size={16} className="shrink-0 text-amber-600" />
                <span className="break-words hyphens-none" dangerouslySetInnerHTML={{ __html: doc }} />
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export function SelectionProcessSteps({ steps }: { steps: { num: string; title: string; desc: string }[] | null }) {
  if (!steps || steps.length === 0) return null;
  const colors = ["bg-purple-600", "bg-blue-600", "bg-green-600", "bg-orange-600"];
  const bgs = ["bg-purple-50", "bg-blue-50", "bg-green-50", "bg-orange-50"];
  return (
    <div className="rounded-md border border-gray-100 bg-white p-6">
      <h3 className="mb-4 flex items-center gap-2 text-[17px] font-bold text-gray-900">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 text-purple-600"><ClipboardList size={16} /></div>
        Selection Process
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.num} className={`rounded-md p-4 text-center ${bgs[i % bgs.length]}`}>
            <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${colors[i % colors.length]} font-bold text-white`}>{s.num}</div>
            <h4 className="mb-1 text-[14px] font-bold text-gray-900 break-words hyphens-none" dangerouslySetInnerHTML={{ __html: s.title }} />
            <p className="text-[12px] text-gray-600 break-words hyphens-none" dangerouslySetInnerHTML={{ __html: s.desc }} />
          </div>
        ))}
      </div>
    </div>
  );
}
