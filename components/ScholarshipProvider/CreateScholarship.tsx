"use client";

import React, { useState, useCallback, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import {
  Gear, FileText, Video, ClockClockwise, GraduationCap,
  ClipboardText, CheckSquare, Files, Question, Image,
  Handshake, Buildings, Download, Plus, Trash,
} from "@phosphor-icons/react";
import { scholarshipProviderApi } from "../../services/scholarshipProviderApi";
import FileUpload from "./common/FileUpload";
import type {
  VideoTutorial, JourneyTimelineItem, ScholarshipTypeItem,
  SelectionRubricItem, SelectionProcessStepItem, FAQItem,
  GalleryImageItem, PartnerGroup, PartnerOrganization,
  ExamCenterItem, DownloadItem,
} from "../../services/scholarshipProviderApi";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = [
  "bold", "italic", "underline",
  "list", "align", "link",
];

interface CreateScholarshipProps {
  scholarshipId?: number | null;
  onNavigate?: (section: string) => void;
}

const emptyJourneyItem = (): JourneyTimelineItem => ({ year: "", title: "", description: "" });
const emptyVideo = (): VideoTutorial => ({ url: "", title: "", description: "" });
const emptyScholarshipType = (): ScholarshipTypeItem => ({ type: "", seats: "", coverage: "" });
const emptyRubric = (): SelectionRubricItem => ({ criteria: "", description: "", weight: "" });
const emptyProcessStep = (): SelectionProcessStepItem => ({ step: 1, title: "", description: "" });
const emptyFAQ = (): FAQItem => ({ question: "", answer: "" });
const emptyGalleryImage = (): GalleryImageItem => ({ title: "", url: "" });
const emptyPartnerOrg = (): PartnerOrganization => ({ name: "", website: "" });
const emptyPartnerGroup = (): PartnerGroup => ({ heading: "", partners: [] });
const emptyExamCenter = (): ExamCenterItem => ({ province: "", center_name: "", contact_person: "", phone_number: "", map_coordinates: "" });
const emptyDownload = (): DownloadItem => ({ title: "", description: "" });

const CreateScholarship: React.FC<CreateScholarshipProps> = memo(({ scholarshipId, onNavigate }: CreateScholarshipProps) => {
  const [pageTitle, setPageTitle] = useState("");
  const [scholarshipValue, setScholarshipValue] = useState("");
  const [scholarshipLocation, setScholarshipLocation] = useState("");
  const [scholarshipDegreeLevel, setScholarshipDegreeLevel] = useState("");
  const [scholarshipFundingType, setScholarshipFundingType] = useState("");
  const [scholarshipType, setScholarshipType] = useState("");
  const [scholarshipFieldOfStudy, setScholarshipFieldOfStudy] = useState<string[]>([]);
  const [totalSeats, setTotalSeats] = useState<number>(0);
  const [amountPerStudent, setAmountPerStudent] = useState<number>(0);
  const [applicationStartDate, setApplicationStartDate] = useState("");
  const [applicationEndDate, setApplicationEndDate] = useState("");
  const [bannerBgUrl, setBannerBgUrl] = useState("");
  const [bannerBgPreview, setBannerBgPreview] = useState("");
  const [aboutParagraph1, setAboutParagraph1] = useState("");
  const [aboutParagraph2, setAboutParagraph2] = useState("");
  const [videoTutorials, setVideoTutorials] = useState<VideoTutorial[]>([]);
  const [journeyTimeline, setJourneyTimeline] = useState<JourneyTimelineItem[]>([]);
  const [scholarshipSectionTitle, setScholarshipSectionTitle] = useState("");
  const [scholarshipSubtitle, setScholarshipSubtitle] = useState("");
  const [scholarshipDesc1, setScholarshipDesc1] = useState("");
  const [scholarshipDesc2, setScholarshipDesc2] = useState("");
  const [scholarshipTypes, setScholarshipTypes] = useState<ScholarshipTypeItem[]>([]);
  const [selectionRubric, setSelectionRubric] = useState<SelectionRubricItem[]>([]);
  const [eligibilitySectionTitle, setEligibilitySectionTitle] = useState("");
  const [eligibilitySubtitle, setEligibilitySubtitle] = useState("");
  const [basicEligibility, setBasicEligibility] = useState<string[]>([]);
  const [fullyFundedCriteria, setFullyFundedCriteria] = useState<string[]>([]);
  const [partiallyFundedCriteria, setPartiallyFundedCriteria] = useState<string[]>([]);
  const [selectionProcessSteps, setSelectionProcessSteps] = useState<SelectionProcessStepItem[]>([]);
  const [requiredDocs, setRequiredDocs] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>([]);
  const [partnerGroups, setPartnerGroups] = useState<PartnerGroup[]>([]);
  const [examCenters, setExamCenters] = useState<ExamCenterItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [paymentFeeAmount, setPaymentFeeAmount] = useState(0);
  const [enableEsewa, setEnableEsewa] = useState(true);
  const [enableKhalti, setEnableKhalti] = useState(true);
  const [enableBank, setEnableBank] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    branch: '',
  });
  const isEditing = Boolean(scholarshipId);

  useEffect(() => {
    if (!scholarshipId) {
      setLoadingData(false);
      return;
    }
    setLoadingData(true);
    scholarshipProviderApi.getScholarshipById(scholarshipId).then((s) => {
      setPageTitle(s.title || "");
      setScholarshipValue(s.value || "");
      setScholarshipLocation(s.location || "");
      setScholarshipDegreeLevel(s.degree_level || "");
      setScholarshipFundingType(s.funding_type || "");
      setScholarshipType(s.scholarship_type || "");
      setScholarshipFieldOfStudy(s.field_of_study || []);
      setTotalSeats(s.total_seats || 0);
      setAmountPerStudent(s.amount_per_student || 0);
      setApplicationStartDate(s.application_start_date?.split('T')[0] || "");
      setApplicationEndDate(s.application_end_date?.split('T')[0] || "");
      setBannerBgUrl(s.banner_background_image_url || "");
      setBannerBgPreview(s.banner_background_image_url || "");
      setAboutParagraph1(s.about_paragraph_1 || s.description || "");
      setAboutParagraph2(s.about_paragraph_2 || "");
      setVideoTutorials(s.video_tutorials || []);
      setJourneyTimeline(s.journey_timeline || []);
      setScholarshipSectionTitle(s.scholarship_section_title || "");
      setScholarshipSubtitle(s.scholarship_subtitle || "");
      setScholarshipDesc1(s.scholarship_description_1 || "");
      setScholarshipDesc2(s.scholarship_description_2 || "");
      setScholarshipTypes(s.scholarship_types_new || (s.scholarship_types || []).map((t: any) => ({ type: t.type || "", seats: t.seats || "", coverage: t.coverage || "" })));
      setSelectionRubric(s.selection_rubric_new || []);
      setEligibilitySectionTitle(s.eligibility_section_title || "");
      setEligibilitySubtitle(s.eligibility_subtitle || "");
      setBasicEligibility(s.basic_eligibility_criteria || []);
      setFullyFundedCriteria(s.fully_funded_criteria || []);
      setPartiallyFundedCriteria(s.partially_funded_criteria || []);
      setSelectionProcessSteps(s.selection_process_steps || []);
      setRequiredDocs(s.required_documents || []);
      setFaqs(s.faqs_new || (s.faqs || []).map((f: any) => ({ question: f.question || "", answer: f.answer || "" })));
      setGalleryImages(s.gallery_images_new || (s.gallery_images || []).map((img: string) => ({ title: "", url: img })));
      setPartnerGroups(s.partner_groups || []);
      setExamCenters(s.exam_centers_new || []);
      setDownloads(s.downloads || []);
      setLoadingData(false);
    }).catch(() => setLoadingData(false));
  }, [scholarshipId]);

  const addArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, factory: () => T) => {
    setter((prev) => [...prev, factory()]);
  };

  const removeArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateArrayItem = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    field: keyof T,
    value: T[keyof T],
  ) => {
    setter((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addStringItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (value.trim()) setter((prev) => [...prev, value.trim()]);
  };

  const handleBannerFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setBannerBgPreview(dataUrl);
      setBannerBgUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = useCallback(async (draft: boolean = false) => {
    if (!pageTitle.trim()) {
      setError("Page Title is required.");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      title: pageTitle,
      provider: pageTitle,
      location: scholarshipLocation || "",
      value: scholarshipValue || "",
      deadline: applicationEndDate ? new Date(applicationEndDate).toISOString() : "",
      degree_level: scholarshipDegreeLevel || "",
      funding_type: scholarshipFundingType || "",
      scholarship_type: scholarshipType || "",
      description: aboutParagraph1 || "",
      field_of_study: scholarshipFieldOfStudy.length > 0 ? scholarshipFieldOfStudy : [],
      status: (draft ? 'draft' : status) as 'draft' | 'published',
      total_seats: totalSeats || undefined,
      amount_per_student: amountPerStudent || undefined,
      application_start_date: applicationStartDate ? new Date(applicationStartDate).toISOString() : undefined,
      application_end_date: applicationEndDate ? new Date(applicationEndDate).toISOString() : undefined,
      banner_background_image_url: bannerBgUrl || undefined,
      about_paragraph_1: aboutParagraph1,
      about_paragraph_2: aboutParagraph2,
      video_tutorials: videoTutorials.length > 0 ? videoTutorials : undefined,
      journey_timeline: journeyTimeline.length > 0 ? journeyTimeline : undefined,
      scholarship_section_title: scholarshipSectionTitle || undefined,
      scholarship_subtitle: scholarshipSubtitle || undefined,
      scholarship_description_1: scholarshipDesc1 || undefined,
      scholarship_description_2: scholarshipDesc2 || undefined,
      scholarship_types_new: scholarshipTypes.length > 0 ? scholarshipTypes : undefined,
      selection_rubric_new: selectionRubric.length > 0 ? selectionRubric : undefined,
      eligibility_section_title: eligibilitySectionTitle || undefined,
      eligibility_subtitle: eligibilitySubtitle || undefined,
      basic_eligibility_criteria: basicEligibility.length > 0 ? basicEligibility : undefined,
      fully_funded_criteria: fullyFundedCriteria.length > 0 ? fullyFundedCriteria : undefined,
      partially_funded_criteria: partiallyFundedCriteria.length > 0 ? partiallyFundedCriteria : undefined,
      selection_process_steps: selectionProcessSteps.length > 0 ? selectionProcessSteps : undefined,
      required_documents: requiredDocs.length > 0 ? requiredDocs : undefined,
      faqs_new: faqs.length > 0 ? faqs : undefined,
      gallery_images_new: galleryImages.length > 0 ? galleryImages : undefined,
      partner_groups: partnerGroups.length > 0 ? partnerGroups : undefined,
      exam_centers_new: examCenters.length > 0 ? examCenters : undefined,
      downloads: downloads.length > 0 ? downloads : undefined,
      payment_config: {
        fee_amount: paymentFeeAmount,
        methods: [
          ...(enableEsewa ? ['esewa'] : []),
          ...(enableKhalti ? ['khalti'] : []),
          ...(enableBank ? ['bank'] : []),
        ],
        ...(enableBank ? { bank_details: bankDetails } : {}),
      },
    };

    try {
      if (isEditing && scholarshipId) {
        await scholarshipProviderApi.updateScholarship(scholarshipId, payload);
      } else {
        await scholarshipProviderApi.createScholarship(payload);
      }
      setSuccess(draft ? "Draft saved successfully!" : "Scholarship published successfully!");
      if (onNavigate) setTimeout(() => onNavigate("sec-scholarship-directory"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save scholarship");
    } finally {
      setSubmitting(false);
    }
}, [pageTitle, bannerBgUrl, aboutParagraph1, aboutParagraph2, videoTutorials,
       journeyTimeline, scholarshipSectionTitle, scholarshipSubtitle, scholarshipDesc1,
       scholarshipDesc2, scholarshipTypes, selectionRubric, eligibilitySectionTitle,
       eligibilitySubtitle, basicEligibility, fullyFundedCriteria, partiallyFundedCriteria,
       selectionProcessSteps, requiredDocs, faqs, galleryImages, partnerGroups,
       examCenters, downloads, scholarshipId, isEditing, onNavigate, status,
       paymentFeeAmount, enableEsewa, enableKhalti, enableBank, bankDetails]);

  const renderStringList = (label: string, items: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const [input, setInput] = useState("");
    return (
      <div>
        <label className="input-label">{label}</label>
        <div className="flex gap-2 mb-2">
          <input className="input-field text-sm" placeholder="Add item..." value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addStringItem(setter, input); setInput(""); } }} />
          <button type="button" className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
            onClick={() => { addStringItem(setter, input); setInput(""); }}>
            <Plus size={14} weight="bold" /> Add
          </button>
        </div>
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-3">
                <input className="input-field text-sm flex-grow" value={item} readOnly />
                <button type="button" className="icon-btn-circle" onClick={() => removeArrayItem(setter, i)}>
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loadingData) {
    return (
      <div className="section-card">
        <div className="py-12 text-center text-slate-500">Loading scholarship data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? "Edit Scholarship" : "Create Scholarship"}
        </h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Gear size={16} />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">{isEditing ? "Edit Scholarship" : "Create Scholarship"}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>
      )}

      {/* General Settings */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Gear size={20} className="text-blue-600" /> General Settings
          </h2>
          <div className="section-actions">
            <button type="button" className="btn-draft" onClick={() => handleSave(true)} disabled={submitting}>Draft</button>
            <button type="button" className="btn-save" onClick={() => handleSave(false)} disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="input-label">Page Title</label>
            <input type="text" className="input-field" placeholder="e.g., Project Shiksha Scholarship 2025"
              value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} />
          </div>
          <div>
            <label className="input-label">Banner Background Image</label>
            <FileUpload
              accept="image/*"
              maxSize="5MB"
              recommendedSize="1920x400"
              onFileSelect={handleBannerFileSelect}
              previewUrl={bannerBgPreview}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          <div>
            <label className="input-label">Value (Amount)</label>
            <input type="text" className="input-field" placeholder="e.g., 50000 or NPR 50,000"
              value={scholarshipValue} onChange={(e) => setScholarshipValue(e.target.value)} />
          </div>
          <div>
            <label className="input-label">Location</label>
            <input type="text" className="input-field" placeholder="e.g., Kathmandu, Nepal"
              value={scholarshipLocation} onChange={(e) => setScholarshipLocation(e.target.value)} />
          </div>
          <div>
            <label className="input-label">Degree Level</label>
            <select className="input-field" value={scholarshipDegreeLevel} onChange={(e) => setScholarshipDegreeLevel(e.target.value)}>
              <option value="">Select Degree Level</option>
              <option value="+2">+2 / Grade 11-12</option>
              <option value="diploma">Diploma</option>
              <option value="bachelor">Bachelor's</option>
              <option value="masters">Master's</option>
              <option value="phd">PhD</option>
            </select>
          </div>
          <div>
            <label className="input-label">Funding Type</label>
            <select className="input-field" value={scholarshipFundingType} onChange={(e) => setScholarshipFundingType(e.target.value)}>
              <option value="">Select Funding Type</option>
              <option value="FULLY FUNDED">Fully Funded</option>
              <option value="PARTIAL TUITION">Partial Tuition</option>
              <option value="MERIT-BASED">Merit-Based</option>
              <option value="NEED-BASED">Need-Based</option>
            </select>
          </div>
          <div>
            <label className="input-label">Scholarship Type</label>
            <select className="input-field" value={scholarshipType} onChange={(e) => setScholarshipType(e.target.value)}>
              <option value="">Select Type</option>
              <option value="merit-based">Merit Based</option>
              <option value="need-based">Need Based</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts</option>
              <option value="research">Research</option>
            </select>
          </div>
          <div>
            <label className="input-label">Total Seats</label>
            <input type="number" className="input-field" placeholder="e.g., 25"
              value={totalSeats || ""} onChange={(e) => setTotalSeats(parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label className="input-label">Amount Per Student</label>
            <input type="number" className="input-field" placeholder="e.g., 50000"
              value={amountPerStudent || ""} onChange={(e) => setAmountPerStudent(parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label className="input-label">Application Start Date</label>
            <input type="date" className="input-field"
              value={applicationStartDate} onChange={(e) => setApplicationStartDate(e.target.value)} />
          </div>
          <div>
            <label className="input-label">Application End Date</label>
            <input type="date" className="input-field"
              value={applicationEndDate} onChange={(e) => setApplicationEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* About Tab - Description */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" /> About Tab - Description
          </h2>
        </div>
        <div className="space-y-5">
          <div>
            <label className="input-label">Paragraph 1</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <ReactQuill theme="snow" value={aboutParagraph1} onChange={setAboutParagraph1}
                modules={quillModules} formats={quillFormats} className="bg-white" />
            </div>
          </div>
          <div>
            <label className="input-label">Paragraph 2</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <ReactQuill theme="snow" value={aboutParagraph2} onChange={setAboutParagraph2}
                modules={quillModules} formats={quillFormats} className="bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Video size={20} className="text-blue-600" /> Video Tutorials
          </h2>
        </div>
        <div className="space-y-4">
          {videoTutorials.map((v, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label text-xs">Video {i + 1} - YouTube URL</label>
                  <input className="input-field text-sm" placeholder="https://www.youtube.com/embed/..."
                    value={v.url} onChange={(e) => updateArrayItem(setVideoTutorials, i, "url", e.target.value)} />
                </div>
                <div>
                  <label className="input-label text-xs">Video {i + 1} - Title</label>
                  <input className="input-field text-sm" placeholder="Video title"
                    value={v.title} onChange={(e) => updateArrayItem(setVideoTutorials, i, "title", e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="input-label text-xs">Video {i + 1} - Description</label>
                  <textarea className="input-field text-sm" rows={2} placeholder="Video description"
                    value={v.description} onChange={(e) => updateArrayItem(setVideoTutorials, i, "description", e.target.value)} />
                </div>
              </div>
              <button type="button" className="icon-btn-circle mt-3" onClick={() => removeArrayItem(setVideoTutorials, i)}>
                <Trash size={14} />
              </button>
            </div>
          ))}
          <button type="button" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
            onClick={() => addArrayItem(setVideoTutorials, emptyVideo)}>
            <Plus size={16} /> Add Video
          </button>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ClockClockwise size={20} className="text-blue-600" /> Journey Timeline
          </h2>
        </div>
        <div className="space-y-3">
          {journeyTimeline.map((jt, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex items-start gap-3">
                <div><label className="input-label text-xs">Year</label><input className="input-field text-sm w-24"
                  placeholder="2024" value={jt.year} onChange={(e) => updateArrayItem(setJourneyTimeline, i, "year", e.target.value)} /></div>
                <div className="flex-grow"><label className="input-label text-xs">Title</label><input className="input-field text-sm"
                  placeholder="Milestone title" value={jt.title} onChange={(e) => updateArrayItem(setJourneyTimeline, i, "title", e.target.value)} /></div>
                <button type="button" className="icon-btn-circle mt-5" onClick={() => removeArrayItem(setJourneyTimeline, i)}>
                  <Trash size={14} />
                </button>
              </div>
              <div className="mt-2"><label className="input-label text-xs">Description</label>
                <textarea className="input-field text-sm" rows={2} placeholder="Description"
                  value={jt.description} onChange={(e) => updateArrayItem(setJourneyTimeline, i, "description", e.target.value)} />
              </div>
            </div>
          ))}
          <button type="button" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
            onClick={() => addArrayItem(setJourneyTimeline, emptyJourneyItem)}>
            <Plus size={16} /> Add Timeline Entry
          </button>
        </div>
      </div>

      {/* Scholarship Tab - General Info */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap size={20} className="text-blue-600" /> Scholarship Tab - General Info
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div><label className="input-label">Section Title</label><input className="input-field"
            placeholder="Scholarship Program 2082" value={scholarshipSectionTitle}
            onChange={(e) => setScholarshipSectionTitle(e.target.value)} /></div>
          <div><label className="input-label">Subtitle</label><input className="input-field"
            placeholder="Fully funded higher secondary education" value={scholarshipSubtitle}
            onChange={(e) => setScholarshipSubtitle(e.target.value)} /></div>
        </div>
        <div className="mb-4">
          <label className="input-label">Description 1</label>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <ReactQuill theme="snow" value={scholarshipDesc1} onChange={setScholarshipDesc1}
              modules={quillModules} formats={quillFormats} className="bg-white" />
          </div>
        </div>
        <div className="mb-4">
          <label className="input-label">Description 2</label>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <ReactQuill theme="snow" value={scholarshipDesc2} onChange={setScholarshipDesc2}
              modules={quillModules} formats={quillFormats} className="bg-white" />
          </div>
        </div>
        <div className="border-t border-slate-200 pt-5">
          <h4 className="font-bold text-gray-900 text-sm mb-4">Scholarship Types</h4>
          <div className="space-y-3">
            {scholarshipTypes.map((st, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div><label className="input-label text-xs">Type</label><input className="input-field text-sm"
                    placeholder="Fully Funded" value={st.type}
                    onChange={(e) => updateArrayItem(setScholarshipTypes, i, "type", e.target.value)} /></div>
                  <div><label className="input-label text-xs">Seats</label><input className="input-field text-sm"
                    placeholder="60 Seats" value={st.seats}
                    onChange={(e) => updateArrayItem(setScholarshipTypes, i, "seats", e.target.value)} /></div>
                  <div><label className="input-label text-xs">Coverage</label><input className="input-field text-sm"
                    placeholder="Full Support" value={st.coverage}
                    onChange={(e) => updateArrayItem(setScholarshipTypes, i, "coverage", e.target.value)} /></div>
                  <button type="button" className="icon-btn-circle mt-5" onClick={() => removeArrayItem(setScholarshipTypes, i)}>
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
              onClick={() => addArrayItem(setScholarshipTypes, emptyScholarshipType)}>
              <Plus size={16} /> Add Scholarship Type
            </button>
          </div>
        </div>
      </div>

      {/* Selection Process & Rubric */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ClipboardText size={20} className="text-blue-600" /> Selection Process & Rubric
          </h2>
        </div>
        <div className="space-y-3">
          {selectionRubric.map((r, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div><label className="input-label text-xs">Criteria</label><input className="input-field text-sm"
                  placeholder="Written Examination" value={r.criteria}
                  onChange={(e) => updateArrayItem(setSelectionRubric, i, "criteria", e.target.value)} /></div>
                <div><label className="input-label text-xs">Description</label><input className="input-field text-sm"
                  placeholder="English, Math, Science" value={r.description}
                  onChange={(e) => updateArrayItem(setSelectionRubric, i, "description", e.target.value)} /></div>
                <div><label className="input-label text-xs">Weight</label><input className="input-field text-sm"
                  placeholder="60%" value={r.weight}
                  onChange={(e) => updateArrayItem(setSelectionRubric, i, "weight", e.target.value)} /></div>
                <button type="button" className="icon-btn-circle mt-5" onClick={() => removeArrayItem(setSelectionRubric, i)}>
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
            onClick={() => addArrayItem(setSelectionRubric, emptyRubric)}>
            <Plus size={16} /> Add Rubric Row
          </button>
        </div>
      </div>

      {/* Eligibility & Criteria */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CheckSquare size={20} className="text-blue-600" /> Eligibility & Criteria
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div><label className="input-label">Section Title</label><input className="input-field"
            placeholder="Eligibility & Selection Criteria" value={eligibilitySectionTitle}
            onChange={(e) => setEligibilitySectionTitle(e.target.value)} /></div>
          <div><label className="input-label">Subtitle</label><input className="input-field"
            placeholder="Requirements and selection process" value={eligibilitySubtitle}
            onChange={(e) => setEligibilitySubtitle(e.target.value)} /></div>
        </div>

        <div className="mb-5">
          <EligibilityList label="Basic Eligibility Criteria" items={basicEligibility}
            onAdd={(v) => addStringItem(setBasicEligibility, v)}
            onRemove={(i) => removeArrayItem(setBasicEligibility, i)} />
        </div>
        <div className="border-t border-slate-200 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <EligibilityList label="Fully Funded Conditions" items={fullyFundedCriteria}
              onAdd={(v) => addStringItem(setFullyFundedCriteria, v)}
              onRemove={(i) => removeArrayItem(setFullyFundedCriteria, i)} />
            <EligibilityList label="Partially Funded Conditions" items={partiallyFundedCriteria}
              onAdd={(v) => addStringItem(setPartiallyFundedCriteria, v)}
              onRemove={(i) => removeArrayItem(setPartiallyFundedCriteria, i)} />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-5 mt-5">
          <h4 className="font-bold text-gray-900 text-sm mb-3">Selection Process Steps</h4>
          <div className="space-y-3">
            {selectionProcessSteps.map((sp, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="input-label text-xs">Step #</label><input className="input-field text-sm" type="number"
                    value={sp.step} onChange={(e) => updateArrayItem(setSelectionProcessSteps, i, "step", parseInt(e.target.value) || 1)} /></div>
                  <div><label className="input-label text-xs">Title</label><input className="input-field text-sm"
                    placeholder="Application" value={sp.title}
                    onChange={(e) => updateArrayItem(setSelectionProcessSteps, i, "title", e.target.value)} /></div>
                  <div className="flex items-end gap-2">
                    <div className="flex-grow"><label className="input-label text-xs">Description</label><input className="input-field text-sm"
                      placeholder="Online application submission" value={sp.description}
                      onChange={(e) => updateArrayItem(setSelectionProcessSteps, i, "description", e.target.value)} /></div>
                    <button type="button" className="icon-btn-circle mb-1" onClick={() => removeArrayItem(setSelectionProcessSteps, i)}>
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
              onClick={() => addArrayItem(setSelectionProcessSteps, emptyProcessStep)}>
              <Plus size={16} /> Add Step
            </button>
          </div>
        </div>
      </div>

      {/* Required Documents */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Files size={20} className="text-blue-600" /> Required Documents
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {requiredDocs.map((doc, i) => (
            <div key={i} className="flex gap-3">
              <input className="input-field text-sm" placeholder="SEE Mark Sheet"
                value={doc} onChange={(e) => setRequiredDocs((prev) => prev.map((d, j) => j === i ? e.target.value : d))} />
              <button type="button" className="icon-btn-circle mt-0" onClick={() => removeArrayItem(setRequiredDocs, i)}>
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 mt-3"
          onClick={() => addArrayItem(setRequiredDocs, () => "")}>
          <Plus size={16} /> Add Document
        </button>
      </div>

      {/* FAQ */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Question size={20} className="text-blue-600" /> Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex justify-between gap-2">
                <div className="flex-grow space-y-2">
                  <div><label className="input-label text-xs">Question</label><input className="input-field text-sm"
                    placeholder="What is this scholarship?" value={faq.question}
                    onChange={(e) => updateArrayItem(setFaqs, i, "question", e.target.value)} /></div>
                  <div><label className="input-label text-xs">Answer</label><textarea className="input-field text-sm" rows={2}
                    placeholder="Answer..." value={faq.answer}
                    onChange={(e) => updateArrayItem(setFaqs, i, "answer", e.target.value)} /></div>
                </div>
                <button type="button" className="icon-btn-circle mt-6" onClick={() => removeArrayItem(setFaqs, i)}>
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
            onClick={() => addArrayItem(setFaqs, emptyFAQ)}>
            <Plus size={16} /> Add FAQ
          </button>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Image size={20} className="text-blue-600" /> Gallery Images
          </h2>
        </div>
        <div className="space-y-3">
          {galleryImages.map((img, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex items-center gap-3">
              <div className="flex-grow"><label className="input-label text-xs">Image Title</label><input className="input-field text-sm"
                placeholder="Leadership Training" value={img.title}
                onChange={(e) => updateArrayItem(setGalleryImages, i, "title", e.target.value)} /></div>
              <div className="flex-grow"><label className="input-label text-xs">Image URL</label><input className="input-field text-sm"
                placeholder="https://example.com/image.jpg" value={img.url}
                onChange={(e) => updateArrayItem(setGalleryImages, i, "url", e.target.value)} /></div>
              <button type="button" className="icon-btn-circle mt-6" onClick={() => removeArrayItem(setGalleryImages, i)}>
                <Trash size={14} />
              </button>
            </div>
          ))}
          <button type="button" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
            onClick={() => addArrayItem(setGalleryImages, emptyGalleryImage)}>
            <Plus size={16} /> Add Image
          </button>
        </div>
      </div>

      {/* Partners */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Handshake size={20} className="text-blue-600" /> Partners
          </h2>
        </div>
        <div className="space-y-4">
          {partnerGroups.map((group, gi) => (
            <div key={gi} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex justify-between items-center mb-3">
                <input className="input-field text-sm flex-grow mr-3" placeholder="Group Heading (e.g., Lead Organizers)"
                  value={group.heading} onChange={(e) => updateArrayItem(setPartnerGroups, gi, "heading", e.target.value)} />
                <button type="button" className="icon-btn-circle" onClick={() => removeArrayItem(setPartnerGroups, gi)}>
                  <Trash size={14} />
                </button>
              </div>
              <div className="space-y-2">
                {group.partners.map((partner, pi) => (
                  <div key={pi} className="flex items-center gap-3">
                    <input className="input-field text-sm flex-grow" placeholder="Organization Name"
                      value={partner.name} onChange={(e) => {
                        const newPartners = [...group.partners];
                        newPartners[pi] = { ...newPartners[pi], name: e.target.value };
                        updateArrayItem(setPartnerGroups, gi, "partners", newPartners);
                      }} />
                    <input className="input-field text-sm flex-grow" placeholder="Website URL"
                      value={partner.website} onChange={(e) => {
                        const newPartners = [...group.partners];
                        newPartners[pi] = { ...newPartners[pi], website: e.target.value };
                        updateArrayItem(setPartnerGroups, gi, "partners", newPartners);
                      }} />
                    <button type="button" className="icon-btn-circle mt-0" onClick={() => {
                      const newPartners = group.partners.filter((_: any, j: any) => j !== pi);
                      const updated = { ...group, partners: newPartners };
                      setPartnerGroups((prev) => prev.map((g, j) => j === gi ? updated : g));
                    }}>
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                  onClick={() => {
                    const newPartners = [...group.partners, emptyPartnerOrg()];
                    updateArrayItem(setPartnerGroups, gi, "partners", newPartners);
                  }}>
                  <Plus size={14} /> Add Partner
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
            onClick={() => addArrayItem(setPartnerGroups, emptyPartnerGroup)}>
            <Plus size={16} /> Add Partner Group
          </button>
        </div>
      </div>

      {/* Exam Centers */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Buildings size={20} className="text-blue-600" /> Exam Centers
          </h2>
        </div>
        <div className="space-y-4">
          {examCenters.map((ec, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex justify-between items-start gap-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-grow">
                  <div><label className="input-label text-xs">Province</label>
                    <select className="input-field text-sm" value={ec.province}
                      onChange={(e) => updateArrayItem(setExamCenters, i, "province", e.target.value)}>
                      <option value="">Select Province</option>
                      <option value="Koshi">Koshi</option>
                      <option value="Madhesh">Madhesh</option>
                      <option value="Bagmati">Bagmati</option>
                      <option value="Gandaki">Gandaki</option>
                      <option value="Lumbini">Lumbini</option>
                      <option value="Karnali">Karnali</option>
                      <option value="Sudurpashchim">Sudurpashchim</option>
                    </select>
                  </div>
                  <div><label className="input-label text-xs">Center Name</label><input className="input-field text-sm"
                    placeholder="Advance Academy Biratnagar" value={ec.center_name}
                    onChange={(e) => updateArrayItem(setExamCenters, i, "center_name", e.target.value)} /></div>
                  <div><label className="input-label text-xs">Contact Person</label><input className="input-field text-sm"
                    placeholder="Mr. Ram Kumar Sharma" value={ec.contact_person}
                    onChange={(e) => updateArrayItem(setExamCenters, i, "contact_person", e.target.value)} /></div>
                  <div><label className="input-label text-xs">Phone Number</label><input className="input-field text-sm"
                    placeholder="9842012345" value={ec.phone_number}
                    onChange={(e) => updateArrayItem(setExamCenters, i, "phone_number", e.target.value)} /></div>
                  <div className="md:col-span-2"><label className="input-label text-xs">Map Coordinates (lat, lng)</label><input className="input-field text-sm"
                    placeholder="26.4525, 87.2718" value={ec.map_coordinates}
                    onChange={(e) => updateArrayItem(setExamCenters, i, "map_coordinates", e.target.value)} /></div>
                </div>
                <button type="button" className="icon-btn-circle mt-6" onClick={() => removeArrayItem(setExamCenters, i)}>
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
            onClick={() => addArrayItem(setExamCenters, emptyExamCenter)}>
            <Plus size={16} /> Add Exam Center
          </button>
        </div>
      </div>

      {/* Downloads */}
      <div className="section-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Download size={20} className="text-blue-600" /> Downloads
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {downloads.map((d, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center gap-3">
              <div className="flex-grow">
                <label className="input-label text-xs">Title</label>
                <input className="input-field text-sm" placeholder="Scholarship Information Brochure"
                  value={d.title} onChange={(e) => updateArrayItem(setDownloads, i, "title", e.target.value)} />
              </div>
              <div className="flex-grow">
                <label className="input-label text-xs">Description</label>
                <input className="input-field text-sm" placeholder="Complete guide about the scholarship"
                  value={d.description} onChange={(e) => updateArrayItem(setDownloads, i, "description", e.target.value)} />
              </div>
              <button type="button" className="icon-btn-circle mt-6" onClick={() => removeArrayItem(setDownloads, i)}>
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 mt-3"
          onClick={() => addArrayItem(setDownloads, emptyDownload)}>
          <Plus size={16} /> Add Download
        </button>
      </div>

      {/* Payment Configuration */}
      <div className="section-card">
        <h3 className="font-bold mb-4">Payment Configuration</h3>
        
        <div className="mb-4">
          <label className="input-label">Application Fee (NPR)</label>
          <input
            type="number"
            value={paymentFeeAmount}
            onChange={(e) => setPaymentFeeAmount(Number(e.target.value))}
            className="input-field"
            placeholder="0 for free"
          />
        </div>
        
        <div className="mb-4">
          <label className="input-label">Payment Methods</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={enableEsewa} onChange={(e) => setEnableEsewa(e.target.checked)} />
              <span>eSewa</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={enableKhalti} onChange={(e) => setEnableKhalti(e.target.checked)} />
              <span>Khalti</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={enableBank} onChange={(e) => setEnableBank(e.target.checked)} />
              <span>Bank Transfer</span>
            </label>
          </div>
        </div>
        
        {enableBank && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="input-label text-xs">Bank Name</label>
              <input
                className="input-field text-sm"
                placeholder="Bank Name"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              />
            </div>
            <div>
              <label className="input-label text-xs">Account Name</label>
              <input
                className="input-field text-sm"
                placeholder="Account Name"
                value={bankDetails.accountName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
              />
            </div>
            <div>
              <label className="input-label text-xs">Account Number</label>
              <input
                className="input-field text-sm"
                placeholder="Account Number"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="input-label text-xs">Branch</label>
              <input
                className="input-field text-sm"
                placeholder="Branch"
                value={bankDetails.branch}
                onChange={(e) => setBankDetails({ ...bankDetails, branch: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Publication Status */}
      <div className="section-card">
        <h3 className="font-bold mb-4">Publication Status</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={status === 'draft'}
              onChange={() => setStatus('draft')}
            />
            <span>Draft (Hidden from public)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="active"
              checked={status === 'published'}
              onChange={() => setStatus('published')}
            />
            <span>Published (Visible to public)</span>
          </label>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-4">
        <button type="button" className="btn-draft" onClick={() => handleSave(true)} disabled={submitting}>
          Save as Draft
        </button>
        <button type="button" className="btn-save" onClick={() => handleSave(false)} disabled={submitting}>
          {submitting ? "Publishing..." : "Publish Scholarship"}
        </button>
      </div>
    </div>
  );
});

CreateScholarship.displayName = "CreateScholarship";

function EligibilityList({ label, items, onAdd, onRemove }: {
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [input, setInput] = useState("");
  return (
    <div>
      <h4 className="font-bold text-gray-900 text-sm mb-3">{label}</h4>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <input className="input-field text-sm" value={item} readOnly />
            <button type="button" className="icon-btn-circle mt-0" onClick={() => onRemove(i)}>
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-2">
        <input className="input-field text-sm flex-grow" placeholder="Add criteria..."
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(input); setInput(""); } }} />
        <button type="button" className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
          onClick={() => { onAdd(input); setInput(""); }}>
          <Plus size={14} weight="bold" /> Add
        </button>
      </div>
    </div>
  );
}

export default CreateScholarship;
