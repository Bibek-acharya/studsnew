"use client";

import React, { useState } from "react";
import { HelpCircle, Handshake } from "lucide-react";
import { FormCard } from "../add-college/FormCard";
import { generateId } from "@/lib/superadmin/constants";

export function FaqCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  const [faqs, setFaqs] = useState([
    { id: generateId(), question: "Who is eligible to apply for this scholarship?", answer: "" },
    { id: generateId(), question: "What is the selection process?", answer: "" },
  ]);

  const addFaq = () => setFaqs((prev) => [...prev, { id: generateId(), question: "", answer: "" }]);
  const removeFaq = (id: string) => setFaqs((prev) => prev.filter((f) => f.id !== id));
  const updateFaq = (id: string, field: "question" | "answer", val: string) =>
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: val } : f)));

  return (
    <FormCard icon={<HelpCircle size={24} className="text-blue-600" />} title="FAQ" sub="Frequently asked questions about the scholarship" locked={locked} onToggleLock={onToggleLock} action={
      <button type="button" onClick={addFaq} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add FAQ
      </button>
    }>
      <div className="space-y-4">
        {faqs.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No FAQs added yet.</p>}
        {faqs.map((f, i) => (
          <div key={f.id} className="rounded-md border border-gray-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600">Q{i + 1}</span>
              <button type="button" onClick={() => removeFaq(f.id)} className="rounded-md p-1 text-red-500 transition-colors hover:bg-red-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
              </button>
            </div>
            <input type="text" className="input-field mb-3" placeholder="e.g., Who is eligible to apply?" defaultValue={f.question} onChange={(e) => updateFaq(f.id, "question", e.target.value)} />
            <textarea className="input-field min-h-[60px]" rows={2} placeholder="Answer..." defaultValue={f.answer} onChange={(e) => updateFaq(f.id, "answer", e.target.value)} />
          </div>
        ))}
      </div>
    </FormCard>
  );
}

export function PartnersCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  const [partners, setPartners] = useState([
    { id: generateId(), name: "100 Group", logoUrl: "", website: "" },
    { id: generateId(), name: "Sowers Action Nepal", logoUrl: "", website: "" },
  ]);

  const addPartner = () => setPartners((prev) => [...prev, { id: generateId(), name: "", logoUrl: "", website: "" }]);
  const removePartner = (id: string) => setPartners((prev) => prev.filter((p) => p.id !== id));
  const updatePartner = (id: string, field: "name" | "logoUrl" | "website", val: string) =>
    setPartners((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: val } : p)));

  return (
    <FormCard icon={<Handshake size={24} className="text-purple-600" />} title="Partners" sub="Organizations supporting the scholarship" locked={locked} onToggleLock={onToggleLock} action={
      <button type="button" onClick={addPartner} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add Partner
      </button>
    }>
      <div className="space-y-4">
        {partners.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No partners added yet.</p>}
        {partners.map((p, i) => (
          <div key={p.id} className="flex flex-wrap items-end gap-4 rounded-md border border-gray-200 p-4">
            <div className="flex-1 space-y-2">
              <label className="block text-xs font-medium text-gray-600">Partner {i + 1} Name</label>
              <input type="text" className="input-field text-sm" placeholder="Organization name" defaultValue={p.name} onChange={(e) => updatePartner(p.id, "name", e.target.value)} />
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-xs font-medium text-gray-600">Logo URL</label>
              <input type="url" className="input-field text-sm" placeholder="https://example.com/logo.svg" defaultValue={p.logoUrl} onChange={(e) => updatePartner(p.id, "logoUrl", e.target.value)} />
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-xs font-medium text-gray-600">Website</label>
              <input type="url" className="input-field text-sm" placeholder="https://partner.org" defaultValue={p.website} onChange={(e) => updatePartner(p.id, "website", e.target.value)} />
            </div>
            <button type="button" onClick={() => removePartner(p.id)} className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
            </button>
          </div>
        ))}
      </div>
    </FormCard>
  );
}
