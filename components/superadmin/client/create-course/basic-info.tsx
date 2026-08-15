"use client";

import React, { useState } from "react";
import { BookOpen, FileText, CreditCard, ClipboardList, GraduationCap, Award, HelpCircle, ImageIcon, List } from "lucide-react";
import { FormCard } from "../add-college/FormCard";
import { FormInput } from "../add-college/FormInput";
import { generateId } from "@/lib/superadmin/constants";

const COURSE_LEVELS = [
  { value: "+2", label: "+2 / Higher Secondary" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "ctevt", label: "CTEVT" },
] as const;

const DURATIONS = [
  { value: "2", label: "2 Years" },
  { value: "3", label: "3 Years" },
  { value: "4", label: "4 Years" },
] as const;

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "upcoming", label: "Upcoming" },
] as const;

export function BasicInfoCard() {
  return (
    <FormCard icon={<BookOpen size={24} className="text-blue-600" />} title="Basic Information" sub="Essential details about the course">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FormInput label="Course Name" placeholder="e.g., 10+2 Science" required />
        <FormInput label="College / Institution" placeholder="e.g., Sowers College" required />
        <FormInput label="Level" type="select" options={COURSE_LEVELS} required />
        <FormInput label="Duration" type="select" options={DURATIONS} required />
        <FormInput label="Semester / Year System" placeholder="e.g., 8 Semester" />
        <FormInput label="Affiliation" placeholder="e.g., NEB, Tribhuvan University" />
        <FormInput label="Status" type="select" options={STATUSES} required />
        <FormInput label="Stream / Faculty" placeholder="e.g., Science, Management, Humanities" />
        <FormInput label="Total Seats" type="number" placeholder="e.g., 120" />
      </div>
    </FormCard>
  );
}

export function DescriptionCard() {
  return (
    <FormCard icon={<FileText size={24} className="text-amber-600" />} title="Description & Overview" sub="Course description and target audience">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Course Description</label>
          <textarea className="input-field min-h-[120px]" rows={4} placeholder="Describe the course, its curriculum, and what students will learn..." />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Who Should Choose This Course?</label>
          <p className="mb-2 text-xs text-gray-500">Describe the ideal student profile for this course</p>
          <textarea className="input-field min-h-[100px]" rows={3} placeholder="e.g., Students who are naturally curious about how things work, enjoy asking questions, and seek to understand the world around them through scientific inquiry." />
        </div>
      </div>
    </FormCard>
  );
}

export function FeesCard() {
  const [particulars, setParticulars] = useState([
    { id: generateId(), name: "Admission Fee", amount: "25,000", freq: "One-time", note: "Non-refundable" },
    { id: generateId(), name: "Monthly Tuition Fee", amount: "6,500", freq: "Monthly (x12)", note: "Per month" },
    { id: generateId(), name: "Laboratory Fee", amount: "10,000", freq: "Annual", note: "Per year" },
    { id: generateId(), name: "Library & Extra-curricular", amount: "5,000", freq: "Annual", note: "Per year" },
  ]);

  return (
    <FormCard icon={<CreditCard size={24} className="text-green-600" />} title="Fee Structure" sub="Course fees and payment particulars" action={
      <button type="button" onClick={() => setParticulars((prev) => [...prev, { id: generateId(), name: "", amount: "", freq: "", note: "" }])} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add Row
      </button>
    }>
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r border-gray-200">Particulars</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r border-gray-200">Amount (NPR)</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r border-gray-200">Frequency</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Notes</th>
              <th className="w-16 px-4 py-3 text-center font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {particulars.map((p) => (
              <tr key={p.id}>
                <td className="border-r border-gray-200 px-4 py-2"><input type="text" className="input-field py-1.5 text-sm" defaultValue={p.name} /></td>
                <td className="border-r border-gray-200 px-4 py-2"><input type="text" className="input-field py-1.5 text-sm" defaultValue={p.amount} /></td>
                <td className="border-r border-gray-200 px-4 py-2"><input type="text" className="input-field py-1.5 text-sm" defaultValue={p.freq} /></td>
                <td className="px-4 py-2"><input type="text" className="input-field py-1.5 text-sm" defaultValue={p.note} /></td>
                <td className="px-4 py-2 text-center">
                  <button type="button" onClick={() => setParticulars((prev) => prev.filter((x) => x.id !== p.id))} className="rounded p-1 text-red-500 hover:bg-red-50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <FormInput label="Fee Range Note" placeholder="e.g., 90,000 - 150,000 NPR (varies by college)" />
      </div>
    </FormCard>
  );
}

export function FeaturesCard( ) {
  const [features, setFeatures] = useState([
    { id: generateId(), num: 1, title: "Comprehensive Curriculum", desc: "NEB-approved curriculum covering theoretical and practical components with regular assessments and laboratory sessions." },
    { id: generateId(), num: 2, title: "State-of-the-Art Laboratories", desc: "Fully equipped Physics, Chemistry, and Biology laboratories with modern instruments." },
    { id: generateId(), num: 3, title: "Expert Faculty", desc: "Experienced and qualified teachers specializing in their respective subjects." },
    { id: generateId(), num: 4, title: "Entrance Preparation", desc: "Dedicated coaching for IOE, CEE, BSc. CSIT, and other competitive entrance examinations." },
    { id: generateId(), num: 5, title: "Scholarship Opportunities", desc: "Merit-based scholarships up to 100% for top performers." },
    { id: generateId(), num: 6, title: "Career Guidance", desc: "Regular career counseling sessions, college visits, and interaction with professionals." },
  ]);

  const addFeature = () => setFeatures((prev) => [...prev, { id: generateId(), num: prev.length + 1, title: "", desc: "" }]);

  return (
    <FormCard icon={<Award size={24} className="text-purple-600" />} title="Course Features" sub="Key features and highlights of the course" action={
      <button type="button" onClick={addFeature} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add Feature
      </button>
    }>
      <div className="space-y-4">
        {features.map((f) => (
          <div key={f.id} className="flex items-start gap-4 rounded-md border border-gray-200 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{f.num}</div>
            <div className="flex-1 space-y-3">
              <input type="text" className="input-field font-bold text-sm" placeholder="Feature title" defaultValue={f.title} />
              <textarea className="input-field min-h-[60px] text-sm" rows={2} placeholder="Description..." defaultValue={f.desc} />
            </div>
            <button type="button" onClick={() => setFeatures((prev) => prev.filter((x) => x.id !== f.id))} className="rounded p-1 text-red-500 hover:bg-red-50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
            </button>
          </div>
        ))}
      </div>
    </FormCard>
  );
}

export function StreamsCard( ) {
  const [streams, setStreams] = useState([
    { id: generateId(), name: "Physical Group", subtitle: "Physics, Chemistry, Mathematics", desc: "Designed for students who aspire to pursue careers in engineering, technology, and pure sciences.", streams: "Physics, Chemistry, Mathematics (PCM)\nComputer Science & IT\nStatistics & Mathematics", careers: "Engineering (BE, BTech)\nB.Sc. CSIT / BIT\nArchitecture" },
    { id: generateId(), name: "Biology Group", subtitle: "Physics, Chemistry, Biology", desc: "Designed for students who aspire to pursue careers in medicine, healthcare, and life sciences.", streams: "Physics, Chemistry, Biology (PCB)\nMathematics (Optional)\nComputer Science (Optional)", careers: "Medicine (MBBS, BDS)\nNursing / Pharmacy\nAgriculture / Forestry" },
  ]);

  return (
    <FormCard icon={<GraduationCap size={24} className="text-indigo-600" />} title="Course Streams & Groups" sub="Available streams within the course" action={
      <button type="button" onClick={() => setStreams((prev) => [...prev, { id: generateId(), name: "", subtitle: "", desc: "", streams: "", careers: "" }])} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add Stream
      </button>
    }>
      <div className="space-y-6">
        {streams.map((s, i) => (
          <div key={s.id} className="rounded-md border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Group {i + 1}</span>
              <button type="button" onClick={() => setStreams((prev) => prev.filter((x) => x.id !== s.id))} className="rounded p-1 text-red-500 hover:bg-red-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input type="text" className="input-field" placeholder="Stream name (e.g., Physical Group)" defaultValue={s.name} />
              <input type="text" className="input-field" placeholder="Subtitle (e.g., Physics, Chemistry, Math)" defaultValue={s.subtitle} />
            </div>
            <textarea className="input-field mt-4 min-h-[60px]" rows={2} placeholder="Description..." defaultValue={s.desc} />
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600">Available Streams (one per line)</label>
                <textarea className="input-field min-h-[80px] text-sm" rows={3} defaultValue={s.streams} />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600">Career Opportunities (one per line)</label>
                <textarea className="input-field min-h-[80px] text-sm" rows={3} defaultValue={s.careers} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </FormCard>
  );
}

export function ScholarshipsOverviewCard( ) {
  const [items, setItems] = useState([
    { id: generateId(), name: "Merit-Based (SEE GPA)", coverage: "50-100% Coverage", tag1: "GPA 3.6+", tag2: "", desc: "Students securing exceptionally high GPAs (typically above 3.6 or A+ aggregate) in their SEE examinations receive direct waivers." },
    { id: generateId(), name: "Entrance Toppers", coverage: "Up to 100%", tag1: "Top 10 Ranks", tag2: "", desc: "Top performers in the college's internal entrance examinations are rewarded with up to 100% scholarships." },
    { id: generateId(), name: "Need-Based Scholarships", coverage: "25-50% Coverage", tag1: "Income Based", tag2: "", desc: "Financial aid scholarships for students from economically disadvantaged backgrounds." },
    { id: generateId(), name: "Sports & Cultural Excellence", coverage: "30-70% Coverage", tag1: "Certificate Required", tag2: "", desc: "Special scholarships for students who have excelled in sports, arts, music, or cultural activities." },
  ]);

  return (
    <FormCard icon={<Award size={24} className="text-yellow-600" />} title="Scholarship Overview" sub="Scholarship types and coverage details" action={
      <button type="button" onClick={() => setItems((prev) => [...prev, { id: generateId(), name: "", coverage: "", tag1: "", tag2: "", desc: "" }])} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add
      </button>
    }>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-md border border-gray-200 p-4">
            <input type="text" className="input-field mb-2 font-bold" placeholder="Scholarship name" defaultValue={item.name} />
            <textarea className="input-field mb-2 min-h-[60px] text-sm" rows={2} placeholder="Description..." defaultValue={item.desc} />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <input type="text" className="input-field text-sm" placeholder="Coverage (e.g., 50-100%)" defaultValue={item.coverage} />
              <input type="text" className="input-field text-sm" placeholder="Tag 1 (e.g., GPA 3.6+)" defaultValue={item.tag1} />
              <input type="text" className="input-field text-sm" placeholder="Tag 2 (optional)" defaultValue={item.tag2} />
            </div>
          </div>
        ))}
      </div>
    </FormCard>
  );
}

export function AdmissionProcessCard( ) {
  const [steps, setSteps] = useState([
    { id: generateId(), step: "1", title: "Application Form", desc: "Many colleges from different districts open online admission forms, while many others still require you to open/submit the form physically at the college." },
    { id: generateId(), step: "2", title: "Entrance Examination", desc: "Colleges can have different admission times and schedules for their entrance exams." },
  ]);

  return (
    <FormCard icon={<ClipboardList size={24} className="text-blue-600" />} title="Admission Process" sub="Step-by-step admission process" action={
      <button type="button" onClick={() => setSteps((prev) => [...prev, { id: generateId(), step: String(prev.length + 1), title: "", desc: "" }])} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add Step
      </button>
    }>
      <div className="space-y-4">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-start gap-4 rounded-md border border-gray-200 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{s.step}</div>
            <div className="flex-1 space-y-3">
              <input type="text" className="input-field font-bold text-sm" placeholder="Step title" defaultValue={s.title} />
              <textarea className="input-field min-h-[80px] text-sm" rows={3} placeholder="Step description..." defaultValue={s.desc} />
            </div>
            <button type="button" onClick={() => setSteps((prev) => prev.filter((x) => x.id !== s.id))} className="rounded p-1 text-red-500 hover:bg-red-50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
            </button>
          </div>
        ))}
      </div>
    </FormCard>
  );
}

export function FaqCard( ) {
  const [faqs, setFaqs] = useState([
    { id: generateId(), question: "Is it mandatory to take Extra Mathematics if I choose the Biology group?", answer: "No, extra mathematics is an optional subject for Biology students. However, it is highly recommended if you are unsure whether you want to pursue medical or engineering fields later." },
    { id: generateId(), question: "Can I change my stream from Science to Management in Grade 12?", answer: "Once you are registered for the Science stream in Grade 11 with NEB, switching faculties for Grade 12 is generally not permitted." },
  ]);

  return (
    <FormCard icon={<HelpCircle size={24} className="text-blue-600" />} title="FAQ" sub="Frequently asked questions" action={
      <button type="button" onClick={() => setFaqs((prev) => [...prev, { id: generateId(), question: "", answer: "" }])} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add FAQ
      </button>
    }>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={f.id} className="rounded-md border border-gray-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600">Q{i + 1}</span>
              <button type="button" onClick={() => setFaqs((prev) => prev.filter((x) => x.id !== f.id))} className="rounded p-1 text-red-500 hover:bg-red-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
              </button>
            </div>
            <input type="text" className="input-field mb-2" placeholder="Question..." defaultValue={f.question} />
            <textarea className="input-field min-h-[60px]" rows={2} placeholder="Answer..." defaultValue={f.answer} />
          </div>
        ))}
      </div>
    </FormCard>
  );
}

export function MediaCard( ) {
  return (
    <FormCard icon={<ImageIcon size={24} className="text-green-600" />} title="Media" sub="Cover photo and gallery images">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">Cover / Banner Photo</label>
          <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
            <div className="mx-auto mb-4 flex h-40 w-full items-center justify-center rounded-md bg-gray-50">
              <ImageIcon size={48} className="text-gray-400" />
            </div>
            <p className="text-base font-medium text-gray-700">Upload Cover Photo</p>
            <p className="mt-1 text-sm text-gray-500">Recommended: 1200x400px</p>
            <input type="file" className="hidden" accept="image/*" />
          </div>
        </div>
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">Gallery Images</label>
          <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
            <div className="mx-auto mb-4 flex h-40 w-full items-center justify-center rounded-md bg-gray-50">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-700">Upload Images</p>
            <p className="mt-1 text-sm text-gray-500">Multi-upload supported (max. 20 photos)</p>
            <input type="file" className="hidden" accept="image/*" multiple />
          </div>
        </div>
      </div>
    </FormCard>
  );
}

interface CurriculumSection {
  id: string;
  title: string;
  subjects: { code: string; name: string; credits: string }[];
  electives: { id: string; name: string; code: string }[];
}

export function CurriculumCard() {
  const [sections, setSections] = useState<CurriculumSection[]>([
    {
      id: generateId(),
      title: "Semester I",
      subjects: [{ code: "", name: "", credits: "" }],
      electives: [],
    },
  ]);

  const addSection = () =>
    setSections((prev) => [
      ...prev,
      { id: generateId(), title: "", subjects: [{ code: "", name: "", credits: "" }], electives: [] },
    ]);

  const removeSection = (id: string) =>
    setSections((prev) => prev.filter((s) => s.id !== id));

  const updateSectionTitle = (id: string, title: string) =>
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s)),
    );

  const addSubject = (sectionId: string) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, subjects: [...s.subjects, { code: "", name: "", credits: "" }] } : s,
      ),
    );

  const updateSubject = (
    sectionId: string,
    index: number,
    field: "code" | "name" | "credits",
    value: string,
  ) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              subjects: s.subjects.map((sub, i) =>
                i === index ? { ...sub, [field]: value } : sub,
              ),
            }
          : s,
      ),
    );

  const removeSubject = (sectionId: string, index: number) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, subjects: s.subjects.filter((_, i) => i !== index) }
          : s,
      ),
    );

  const addElective = (sectionId: string) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              electives: [
                ...s.electives,
                { id: generateId(), name: "", code: "" },
              ],
            }
          : s,
      ),
    );

  const updateElective = (
    sectionId: string,
    electiveId: string,
    field: "name" | "code",
    value: string,
  ) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              electives: s.electives.map((e) =>
                e.id === electiveId ? { ...e, [field]: value } : e,
              ),
            }
          : s,
      ),
    );

  const removeElective = (sectionId: string, electiveId: string) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, electives: s.electives.filter((e) => e.id !== electiveId) }
          : s,
      ),
    );

  return (
    <FormCard
      icon={<List size={24} className="text-indigo-600" />}
      title="Curriculum"
      sub="Semester or year-wise course structure"
      action={
        <button
          type="button"
          onClick={addSection}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>{" "}
          Add Section
        </button>
      }
    >
      <div className="space-y-6">
        {sections.map((section, sIdx) => (
          <div
            key={section.id}
            className="rounded-md border border-gray-200 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">
                Section {sIdx + 1}
              </span>
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(section.id)}
                  className="rounded p-1 text-red-500 hover:bg-red-50"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              )}
            </div>

            <input
              type="text"
              className="input-field mb-4"
              placeholder='e.g. "Semester I" or "Year 1"'
              value={section.title}
              onChange={(e) =>
                updateSectionTitle(section.id, e.target.value)
              }
            />

            {/* Subjects */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Subjects
              </label>
              <div className="space-y-2">
                {section.subjects.map((subject, subIdx) => (
                  <div key={subIdx} className="flex items-center gap-2">
                    <span className="w-6 text-right text-xs font-semibold text-gray-400">
                      {subIdx + 1}.
                    </span>
                    <input
                      type="text"
                      className="input-field w-20 py-1.5 text-sm"
                      placeholder="Code"
                      value={subject.code}
                      onChange={(e) =>
                        updateSubject(section.id, subIdx, "code", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="input-field flex-1 py-1.5 text-sm"
                      placeholder="Subject name"
                      value={subject.name}
                      onChange={(e) =>
                        updateSubject(section.id, subIdx, "name", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="input-field w-20 py-1.5 text-sm"
                      placeholder="Credits"
                      value={subject.credits}
                      onChange={(e) =>
                        updateSubject(section.id, subIdx, "credits", e.target.value)
                      }
                    />
                    {section.subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubject(section.id, subIdx)}
                        className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M18 6L6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addSubject(section.id)}
                className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + Add Subject
              </button>
            </div>

            {/* Electives */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Electives{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              {section.electives.length > 0 && (
                <div className="space-y-2 mb-2">
                  {section.electives.map((elective) => (
                    <div
                      key={elective.id}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        className="input-field w-20 py-1.5 text-sm"
                        placeholder="Code"
                        value={elective.code}
                        onChange={(e) =>
                          updateElective(
                            section.id,
                            elective.id,
                            "code",
                            e.target.value,
                          )
                        }
                      />
                      <input
                        type="text"
                        className="input-field flex-1 py-1.5 text-sm"
                        placeholder="Elective name"
                        value={elective.name}
                        onChange={(e) =>
                          updateElective(
                            section.id,
                            elective.id,
                            "name",
                            e.target.value,
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeElective(section.id, elective.id)
                        }
                        className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M18 6L6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => addElective(section.id)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + Add Elective
              </button>
            </div>
          </div>
        ))}
      </div>
    </FormCard>
  );
}
