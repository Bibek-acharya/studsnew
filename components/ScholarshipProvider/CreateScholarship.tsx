"use client";

import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import {
  PlusCircle, Info, DollarSign, Calendar, CircleCheck, FileText,
  Paperclip, ClipboardList, Save, UploadCloud, Globe, Edit,
  Image as ImageIcon, Table, ListChecks, MapPin, HelpCircle, Handshake, Trophy,
  Newspaper, X, Plus,
} from "lucide-react";
import SectionCard from "./common/SectionCard";
import InputField from "./common/InputField";
import SelectField from "./common/SelectField";
import Button from "./common/Button";
import FileUpload from "./common/FileUpload";
import { scholarshipProviderApi } from "../../services/scholarshipProviderApi";
import type {
  ScholarshipType, SelectionRubric, SelectionProcessStep,
  TimelineEvent, JourneyTimelineItem, ExamCenter, FAQ,
  Partner, Achievement, NewsItem, SocialLinks,
} from "../../services/scholarshipProviderApi";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header", "bold", "italic", "underline", "strike",
  "list", "align", "link", "image",
];

const SCHOLARSHIP_TYPE_OPTIONS = [
  { value: "", label: "Select Type" },
  { value: "merit", label: "Merit Based" },
  { value: "need", label: "Need Based" },
  { value: "minority", label: "Minority" },
  { value: "sports", label: "Sports" },
  { value: "research", label: "Research" },
  { value: "disability", label: "Disability Support" },
  { value: "community", label: "Community Service" },
];

const DISBURSEMENT_OPTIONS = [
  { value: "", label: "Select Disbursement" },
  { value: "one-time", label: "One Time" },
  { value: "semester", label: "Per Semester" },
  { value: "annual", label: "Annual" },
  { value: "monthly", label: "Monthly" },
];

const COVERAGE_OPTIONS = [
  { value: "", label: "Select Coverage" },
  { value: "full", label: "Full Tuition" },
  { value: "partial", label: "Partial Tuition" },
  { value: "books", label: "Books Only" },
  { value: "living", label: "Living Expenses" },
  { value: "comprehensive", label: "Comprehensive" },
];

const GRADE_OPTIONS = [
  { value: "", label: "Select Grade" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
  { value: "both", label: "Both (11 & 12)" },
];

const GENDER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "male", label: "Male Only" },
  { value: "female", label: "Female Only" },
  { value: "other", label: "Other" },
];

const MARITAL_OPTIONS = [
  { value: "all", label: "No Preference" },
  { value: "single", label: "Single Only" },
  { value: "married", label: "Married" },
];

const SELECTION_CRITERIA_OPTIONS = [
  { value: "merit", label: "Merit Based" },
  { value: "interview", label: "Interview Required" },
  { value: "written", label: "Written Test" },
  { value: "combined", label: "Combined (Merit + Interview)" },
];

const PROVINCES = ["Province 1", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];
const DEGREE_OPTIONS = [
  { value: "", label: "Select Degree Level" },
  { value: "+2", label: "+2 / Grade 11-12" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "phd", label: "PhD" },
  { value: "ctevt", label: "CTEVT" },
  { value: "all", label: "All Levels" },
];
const FUNDING_OPTIONS = [
  { value: "", label: "Select Funding Type" },
  { value: "fully", label: "Fully Funded" },
  { value: "partially", label: "Partially Funded" },
  { value: "both", label: "Both" },
];
const PROVINCE_OPTIONS = [
  { value: "Koshi", label: "Koshi" },
  { value: "Madhesh", label: "Madhesh" },
  { value: "Bagmati", label: "Bagmati" },
  { value: "Gandaki", label: "Gandaki" },
  { value: "Lumbini", label: "Lumbini" },
  { value: "Karnali", label: "Karnali" },
  { value: "Sudurpashchim", label: "Sudurpashchim" },
];
const NEWS_CATEGORY_OPTIONS = [
  { value: "notice", label: "Notice" },
  { value: "result", label: "Result" },
  { value: "event", label: "Event" },
  { value: "update", label: "Update" },
];


interface CreateScholarshipProps {
  scholarshipId?: number | null;
  onNavigate?: (section: string) => void;
}

const emptyScholarshipType = (): ScholarshipType => ({ type: "", seats: "", coverage: "", eligibility: "" });
const emptyRubric = (): SelectionRubric => ({ criteria: "", description: "", weight: "", marks: "", pass_mark: "" });
const emptyTimelineEvent = (): TimelineEvent => ({ title: "", date: "", description: "" });
const emptyJourneyItem = (): JourneyTimelineItem => ({ year: "", title: "", description: "" });
const emptyExamCenter = (): ExamCenter => ({ province: "", city: "", venue: "", contact: "", phone: "" });
const emptyFAQ = (): FAQ => ({ question: "", answer: "" });
const emptyPartner = (): Partner => ({ name: "", logo_url: "", website: "" });
const emptyAchievement = (): Achievement => ({ title: "", description: "", tags: [], link: "" });
const emptyNewsItem = (): NewsItem => ({ title: "", description: "", date: "", category: "notice", link: "" });

const CreateScholarship: React.FC<CreateScholarshipProps> = memo(({ scholarshipId, onNavigate }: CreateScholarshipProps) => {
  const [scholarshipName, setScholarshipName] = useState("");
  const [scholarshipType, setScholarshipType] = useState("");
  const [provider, setProvider] = useState("");
  const [providerEmail, setProviderEmail] = useState("");
  const [providerPhone, setProviderPhone] = useState("");
  const [providerWebsite, setProviderWebsite] = useState("");
  const [providerDomain, setProviderDomain] = useState("");
  const [degreeLevel, setDegreeLevel] = useState("");
  const [fundingType, setFundingType] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [amountPerStudent, setAmountPerStudent] = useState("");
  const [disbursementType, setDisbursementType] = useState("");
  const [coverage, setCoverage] = useState("");
  const [appStartDate, setAppStartDate] = useState("");
  const [appEndDate, setAppEndDate] = useState("");
  const [resultDate, setResultDate] = useState("");
  const [eligibleGrades, setEligibleGrades] = useState("");
  const [minGpa, setMinGpa] = useState("");
  const [streams, setStreams] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [gender, setGender] = useState("all");
  const [maritalStatus, setMaritalStatus] = useState("all");
  const [provinces, setProvinces] = useState<string[]>(["1", "2", "3", "4", "5"]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [notes, setNotes] = useState("");
  const [selectionCriteria, setSelectionCriteria] = useState("");
  const [interviewRounds, setInterviewRounds] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [guidelinesFile, setGuidelinesFile] = useState<File | null>(null);
  const [scholarshipTypes, setScholarshipTypes] = useState<ScholarshipType[]>([]);
  const [selectionRubric, setSelectionRubric] = useState<SelectionRubric[]>([]);
  const [eligibilityCriteria, setEligibilityCriteria] = useState<string[]>([]);
  const [fullyFundedCriteria, setFullyFundedCriteria] = useState<string[]>([]);
  const [partiallyFundedCriteria, setPartiallyFundedCriteria] = useState<string[]>([]);
  const [selectionProcess, setSelectionProcess] = useState<SelectionProcessStep[]>([]);
  const [requiredDocs, setRequiredDocs] = useState<string[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [journeyTimeline, setJourneyTimeline] = useState<JourneyTimelineItem[]>([]);
  const [examCenters, setExamCenters] = useState<ExamCenter[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(scholarshipId);

  useEffect(() => {
    scholarshipProviderApi.getProfile().then((p) => {
      if (p.provider_name && !isEditing) setProvider(p.provider_name);
    }).catch(() => {});
  }, [isEditing]);

  useEffect(() => {
    if (!scholarshipId) {
      setLoadingData(false);
      return;
    }
    setLoadingData(true);
    Promise.all([
      scholarshipProviderApi.getScholarshipById(scholarshipId),
      scholarshipProviderApi.getProfile().catch(() => ({ provider_name: "" })),
    ]).then(([s, profile]) => {
      const fmtDate = (d: string) => d ? d.substring(0, 10) : "";
      setScholarshipName(s.title || "");
      setProvider(profile?.provider_name || s.provider || "");
      setScholarshipType(s.scholarship_type || "");
      setDegreeLevel(s.degree_level || "");
      setFundingType(s.funding_type || "");
      setFieldOfStudy(Array.isArray(s.field_of_study) ? s.field_of_study.join(", ") : "");
      setFullDesc(s.description || "");
      setAppEndDate(fmtDate(s.deadline));
      setLoadingData(false);
    }).catch(() => {
      setLoadingData(false);
    });
  }, [scholarshipId]);

  const totalBudget = totalSeats && amountPerStudent
    ? (parseInt(totalSeats) * parseInt(amountPerStudent)).toLocaleString()
    : "";

  const toggleProvince = useCallback((province: string) => {
    setProvinces((prev) => prev.includes(province) ? prev.filter((p) => p !== province) : [...prev, province]);
  }, []);

  const toggleRequirement = useCallback((req: string) => {
    setRequirements((prev) => prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]);
  }, []);

  const addArrayItem = useCallback(<T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, factory: () => T) => {
    setter((prev) => [...prev, factory()]);
  }, []);

  const removeArrayItem = useCallback(<T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateArrayItem = useCallback(<T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    field: keyof T,
    value: T[keyof T],
  ) => {
    setter((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }, []);

  const addEligibilityItem = useCallback((setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (value.trim()) setter((prev) => [...prev, value.trim()]);
  }, []);

  const removeEligibilityItem = useCallback((setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleSave = useCallback(async (draft: boolean = false) => {
    if (!scholarshipName.trim()) {
      setError("Scholarship name is required.");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");

    let bannerImageUrl: string | undefined;
    if (bannerImage) {
      bannerImageUrl = await fileToBase64(bannerImage);
    }

    const galleryUrls: string[] = [];
    for (const f of galleryFiles) {
      galleryUrls.push(await fileToBase64(f));
    }

    let guidelinesUrl: string | undefined;
    if (guidelinesFile) {
      guidelinesUrl = await fileToBase64(guidelinesFile);
    }

    const payload = {
      title: scholarshipName,
      provider: provider || scholarshipName,
      provider_email: providerEmail || undefined,
      provider_phone: providerPhone || undefined,
      provider_website: providerWebsite || undefined,
      provider_domain: providerDomain || undefined,
      location: "",
      value: totalBudget || amountPerStudent || "",
      deadline: appEndDate || "",
      degree_level: degreeLevel || undefined,
      funding_type: fundingType || undefined,
      scholarship_type: scholarshipType,
      description: fullDesc || "",
      short_description: shortDesc || undefined,
      important_notes: notes || undefined,
      image_url: bannerImageUrl,
      field_of_study: fieldOfStudy ? fieldOfStudy.split(",").map((s) => s.trim()) : [],
      status: draft ? 'draft' as const : 'active' as const,
      total_seats: totalSeats ? parseInt(totalSeats) : undefined,
      amount_per_student: amountPerStudent ? parseInt(amountPerStudent) : undefined,
      disbursement_type: disbursementType || undefined,
      coverage: coverage || undefined,
      application_start_date: appStartDate || undefined,
      application_end_date: appEndDate || undefined,
      result_publication_date: resultDate || undefined,
      eligible_grades: eligibleGrades || undefined,
      min_gpa: minGpa || undefined,
      streams: streams.length > 0 ? streams : undefined,
      age_min: ageMin ? parseInt(ageMin) : undefined,
      age_max: ageMax ? parseInt(ageMax) : undefined,
      gender: gender || undefined,
      marital_status: maritalStatus || undefined,
      eligible_provinces: provinces.length > 0 ? provinces : undefined,
      additional_requirements: requirements.length > 0 ? requirements : undefined,
      selection_criteria: selectionCriteria || undefined,
      interview_rounds: interviewRounds ? parseInt(interviewRounds) : undefined,
      interview_location: interviewLocation || undefined,
      scholarship_types: scholarshipTypes.length > 0 ? scholarshipTypes : undefined,
      selection_rubric: selectionRubric.length > 0 ? selectionRubric : undefined,
      eligibility_criteria: eligibilityCriteria.length > 0 ? eligibilityCriteria : undefined,
      fully_funded_criteria: fullyFundedCriteria.length > 0 ? fullyFundedCriteria : undefined,
      partially_funded_criteria: partiallyFundedCriteria.length > 0 ? partiallyFundedCriteria : undefined,
      selection_process: selectionProcess.length > 0 ? selectionProcess : undefined,
      required_documents: requiredDocs.length > 0 ? requiredDocs : undefined,
      timeline: timelineEvents.length > 0 ? timelineEvents : undefined,
      journey_timeline: journeyTimeline.length > 0 ? journeyTimeline : undefined,
      exam_centers: examCenters.length > 0 ? examCenters : undefined,
      faqs: faqs.length > 0 ? faqs : undefined,
      partners: partners.length > 0 ? partners : undefined,
      achievements: achievements.length > 0 ? achievements : undefined,
      guidelines_url: guidelinesUrl,
      gallery_images: galleryUrls.length > 0 ? galleryUrls : undefined,
      news_items: newsItems.length > 0 ? newsItems : undefined,
      map_embed_url: mapEmbedUrl || undefined,
      social_links: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
    };

    try {
      if (isEditing && scholarshipId) {
        await scholarshipProviderApi.updateScholarship(scholarshipId, payload);
      } else {
        await scholarshipProviderApi.createScholarship(payload);
      }
      setSuccess(draft ? "Draft saved successfully!" : "Scholarship published successfully!");
      if (onNavigate) setTimeout(() => onNavigate("sec-manage-scholarships"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save scholarship");
    } finally {
      setSubmitting(false);
    }
  }, [scholarshipName, provider, providerEmail, providerPhone, providerWebsite, providerDomain,
      degreeLevel, fundingType, fieldOfStudy, totalSeats, amountPerStudent, disbursementType,
      coverage, appStartDate, appEndDate, resultDate, eligibleGrades, minGpa, streams,
      ageMin, ageMax, gender, maritalStatus, provinces, requirements, shortDesc, fullDesc,
      notes, selectionCriteria, interviewRounds, interviewLocation, totalBudget,
      scholarshipTypes, selectionRubric, eligibilityCriteria, fullyFundedCriteria,
      partiallyFundedCriteria, selectionProcess, requiredDocs, timelineEvents,
      journeyTimeline, examCenters, faqs, partners, achievements, newsItems,
      mapEmbedUrl, socialLinks, scholarshipType, bannerImage, galleryFiles, guidelinesFile,
      fileToBase64, scholarshipId, isEditing, onNavigate]);

  return (
    <div className="space-y-6">
      {loadingData ? (
        <SectionCard>
          <div className="py-12 text-center text-slate-500">Loading scholarship data...</div>
        </SectionCard>
      ) : (
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          {isEditing ? <Edit className="w-5 h-5 text-blue-600" /> : <PlusCircle className="w-5 h-5 text-blue-600" />} {isEditing ? "Edit Scholarship" : "Create New Scholarship"}
        </h2>

        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" /> Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Scholarship Name" required placeholder="e.g., Merit Scholarship 2026" value={scholarshipName} onChange={(e) => setScholarshipName(e.target.value)} />
            <SelectField label="Scholarship Type" required value={scholarshipType} onChange={(e) => setScholarshipType(e.target.value)} options={SCHOLARSHIP_TYPE_OPTIONS} />
            <InputField label="Provider / Organization Name" value={provider} readOnly className="bg-slate-50 text-slate-500" />
            <SelectField label="Degree Level" value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)} options={DEGREE_OPTIONS} />
            <SelectField label="Funding Type" value={fundingType} onChange={(e) => setFundingType(e.target.value)} options={FUNDING_OPTIONS} />
            <InputField label="Field of Study (comma-separated)" placeholder="e.g., Science, Management, IT" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} />
          </div>
        </div>

        {/* Provider Contact */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-600" /> Provider Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Provider Email" type="email" placeholder="info@organization.org" value={providerEmail} onChange={(e) => setProviderEmail(e.target.value)} />
            <InputField label="Provider Phone" placeholder="e.g., 9851131074" value={providerPhone} onChange={(e) => setProviderPhone(e.target.value)} />
            <InputField label="Provider Website" placeholder="https://organization.org" value={providerWebsite} onChange={(e) => setProviderWebsite(e.target.value)} />
            <InputField label="Provider Domain" placeholder="organization.org" value={providerDomain} onChange={(e) => setProviderDomain(e.target.value)} />
          </div>
        </div>

        {/* Media */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-cyan-600" /> Media
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload label="Banner / Cover Photo" accept="image/*" previewUrl={bannerPreview} onFileSelect={(f) => { setBannerImage(f); setBannerPreview(URL.createObjectURL(f)); }} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Social Links</label>
              <div className="space-y-3">
                <InputField placeholder="Facebook URL" value={socialLinks.facebook || ""} onChange={(e) => setSocialLinks((prev) => ({ ...prev, facebook: e.target.value }))} />
                <InputField placeholder="Instagram URL" value={socialLinks.instagram || ""} onChange={(e) => setSocialLinks((prev) => ({ ...prev, instagram: e.target.value }))} />
                <InputField placeholder="YouTube URL" value={socialLinks.youtube || ""} onChange={(e) => setSocialLinks((prev) => ({ ...prev, youtube: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <InputField label="Google Maps Embed URL" placeholder="https://www.google.com/maps/embed?pb=..." value={mapEmbedUrl} onChange={(e) => setMapEmbedUrl(e.target.value)} />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Gallery Images</label>
            <div className="border-2 border-dashed border-slate-200 rounded-md py-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
              onClick={() => galleryInputRef.current?.click()}>
              <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Click to upload gallery images</p>
              <p className="text-xs text-slate-500 mt-1">Multiple images allowed</p>
              <input ref={galleryInputRef} type="file" multiple accept="image/*" className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) setGalleryFiles((prev) => [...prev, ...Array.from(files)]);
                }} />
            </div>
            {galleryFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {galleryFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md text-xs">
                    <span className="truncate max-w-32">{f.name}</span>
                    <button type="button" onClick={() => setGalleryFiles((prev) => prev.filter((_, j) => j !== i))}><X size={14} className="text-red-500" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Financial Details */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" /> Financial Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Total Seats" required type="number" placeholder="Number of seats" value={totalSeats} onChange={(e) => setTotalSeats(e.target.value)} />
            <InputField label="Amount per Student (Rs)" required type="number" placeholder="Amount in NPR" value={amountPerStudent} onChange={(e) => setAmountPerStudent(e.target.value)} />
            <InputField label="Total Budget (Rs)" placeholder="Auto-calculated" value={totalBudget} readOnly className="bg-slate-50" />
            <SelectField label="Disbursement Type" value={disbursementType} onChange={(e) => setDisbursementType(e.target.value)} options={DISBURSEMENT_OPTIONS} />
            <SelectField label="Coverage" value={coverage} onChange={(e) => setCoverage(e.target.value)} options={COVERAGE_OPTIONS} />
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" /> Application Timeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <InputField label="Application Start Date" required type="date" value={appStartDate} onChange={(e) => setAppStartDate(e.target.value)} />
            <InputField label="Application End Date" required type="date" value={appEndDate} onChange={(e) => setAppEndDate(e.target.value)} />
            <InputField label="Result Publication Date" type="date" value={resultDate} onChange={(e) => setResultDate(e.target.value)} />
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Calendar className="w-4 h-4" /> Key Timeline Events</h4>
              <Button variant="outline" type="button" onClick={() => addArrayItem(setTimelineEvents, emptyTimelineEvent)}>
                <Plus size={14} /> Add Event
              </Button>
            </div>
            {timelineEvents.map((ev, i) => (
              <div key={i} className="flex gap-3 items-start mb-3 p-3 bg-slate-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InputField placeholder="Event title (e.g., Entrance Exam)" value={ev.title} onChange={(e) => updateArrayItem(setTimelineEvents, i, "title", e.target.value)} />
                  <InputField placeholder="Date" value={ev.date} onChange={(e) => updateArrayItem(setTimelineEvents, i, "date", e.target.value)} />
                  <InputField placeholder="Description" value={ev.description} onChange={(e) => updateArrayItem(setTimelineEvents, i, "description", e.target.value)} />
                </div>
                <button type="button" onClick={() => removeArrayItem(setTimelineEvents, i)} className="mt-6 text-red-400 hover:text-red-600"><X size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-orange-600" /> Eligibility Criteria
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="Eligible Grades" required value={eligibleGrades} onChange={(e) => setEligibleGrades(e.target.value)} options={GRADE_OPTIONS} />
            <InputField label="Minimum GPA Required" required type="number" step="0.01" placeholder="e.g., 3.5" value={minGpa} onChange={(e) => setMinGpa(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Stream/Subject</label>
              <select multiple className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 h-32" value={streams}
                onChange={(e) => { const selected = Array.from(e.target.selectedOptions, (o) => o.value); setStreams(selected); }}>
                <option value="science">Science</option>
                <option value="management">Management</option>
                <option value="humanities">Humanities</option>
                <option value="education">Education</option>
                <option value="law">Law</option>
                <option value="engineering">Engineering</option>
                <option value="medical">Medical</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Age Range</label>
              <div className="flex items-center gap-2">
                <input type="number" className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600" placeholder="Min" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} />
                <span className="text-slate-400">-</span>
                <input type="number" className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600" placeholder="Max" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} />
              </div>
            </div>
            <SelectField label="Gender Eligibility" value={gender} onChange={(e) => setGender(e.target.value)} options={GENDER_OPTIONS} />
            <SelectField label="Marital Status" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} options={MARITAL_OPTIONS} />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Eligible Provinces <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-4 gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
              {PROVINCES.map((province, index) => {
                const val = (index + 1).toString();
                return (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" checked={provinces.includes(val)} onChange={() => toggleProvince(val)} />
                    <span className="text-sm">{province}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Requirements</label>
            <div className="space-y-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
              {["Nepali Citizenship Required", "Must be enrolled in recognized institution", "Family income below threshold", "No other scholarship recipient", "Community service experience preferred"].map((req) => (
                <label key={req} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded w-4 h-4" checked={requirements.includes(req)} onChange={() => toggleRequirement(req)} />
                  <span className="text-sm text-slate-700">{req}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Eligibility Lists */}
        <div className="mb-8 border-t border-slate-100 pt-6">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-amber-600" /> Detailed Eligibility & Criteria
          </h3>

          <EligibilityList label="Basic Eligibility Criteria" items={eligibilityCriteria}
            onAdd={(v) => addEligibilityItem(setEligibilityCriteria, v)}
            onRemove={(i) => removeEligibilityItem(setEligibilityCriteria, i)} />
          <div className="mt-4" />
          <EligibilityList label="Fully Funded Criteria" items={fullyFundedCriteria}
            onAdd={(v) => addEligibilityItem(setFullyFundedCriteria, v)}
            onRemove={(i) => removeEligibilityItem(setFullyFundedCriteria, i)} />
          <div className="mt-4" />
          <EligibilityList label="Partially Funded Criteria" items={partiallyFundedCriteria}
            onAdd={(v) => addEligibilityItem(setPartiallyFundedCriteria, v)}
            onRemove={(i) => removeEligibilityItem(setPartiallyFundedCriteria, i)} />
        </div>

        {/* Scholarship Types Table */}
        <div className="mb-8 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-600" /> Scholarship Types
            </h3>
            <Button variant="outline" type="button" onClick={() => addArrayItem(setScholarshipTypes, emptyScholarshipType)}>
              <Plus size={14} /> Add Type
            </Button>
          </div>
          {scholarshipTypes.length > 0 && (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Seats</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Coverage</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Eligibility</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {scholarshipTypes.map((st, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2"><input className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm" placeholder="e.g., Fully Funded" value={st.type} onChange={(e) => updateArrayItem(setScholarshipTypes, i, "type", e.target.value)} /></td>
                      <td className="px-4 py-2"><input className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm" placeholder="e.g., 60 Seats" value={st.seats} onChange={(e) => updateArrayItem(setScholarshipTypes, i, "seats", e.target.value)} /></td>
                      <td className="px-4 py-2"><input className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm" placeholder="e.g., Full Support" value={st.coverage} onChange={(e) => updateArrayItem(setScholarshipTypes, i, "coverage", e.target.value)} /></td>
                      <td className="px-4 py-2"><input className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm" placeholder="e.g., Financial Need" value={st.eligibility} onChange={(e) => updateArrayItem(setScholarshipTypes, i, "eligibility", e.target.value)} /></td>
                      <td className="px-4 py-2"><button type="button" onClick={() => removeArrayItem(setScholarshipTypes, i)} className="text-red-400 hover:text-red-600"><X size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selection Rubric */}
        <div className="mb-8 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-purple-600" /> Selection Rubric
            </h3>
            <Button variant="outline" type="button" onClick={() => addArrayItem(setSelectionRubric, emptyRubric)}>
              <Plus size={14} /> Add Criteria
            </Button>
          </div>
          {selectionRubric.length > 0 && (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Criteria</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Description</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Weight</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Marks</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Pass Mark</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectionRubric.map((r, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2"><input className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm" placeholder="Written Exam" value={r.criteria} onChange={(e) => updateArrayItem(setSelectionRubric, i, "criteria", e.target.value)} /></td>
                      <td className="px-4 py-2"><input className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm" placeholder="Description" value={r.description} onChange={(e) => updateArrayItem(setSelectionRubric, i, "description", e.target.value)} /></td>
                      <td className="px-4 py-2"><input className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm" placeholder="60%" value={r.weight} onChange={(e) => updateArrayItem(setSelectionRubric, i, "weight", e.target.value)} /></td>
                      <td className="px-4 py-2"><input className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm" placeholder="60 Marks" value={r.marks} onChange={(e) => updateArrayItem(setSelectionRubric, i, "marks", e.target.value)} /></td>
                      <td className="px-4 py-2"><input className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm" placeholder="24 Marks" value={r.pass_mark} onChange={(e) => updateArrayItem(setSelectionRubric, i, "pass_mark", e.target.value)} /></td>
                      <td className="px-4 py-2"><button type="button" onClick={() => removeArrayItem(setSelectionRubric, i)} className="text-red-400 hover:text-red-600"><X size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selection Process */}
        <div className="mb-8 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-indigo-600" /> Selection Process
            </h3>
            <Button variant="outline" type="button" onClick={() => addArrayItem(setSelectionProcess, () => ({ step: selectionProcess.length + 1, title: "", description: "" }))}>
              <Plus size={14} /> Add Step
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <SelectField label="Selection Criteria" value={selectionCriteria} onChange={(e) => setSelectionCriteria(e.target.value)} options={SELECTION_CRITERIA_OPTIONS} />
            <InputField label="Number of Interview Rounds" type="number" placeholder="e.g., 1" value={interviewRounds} onChange={(e) => setInterviewRounds(e.target.value)} />
            <InputField label="Interview Location" placeholder="e.g., Kathmandu Office" value={interviewLocation} onChange={(e) => setInterviewLocation(e.target.value)} />
          </div>
          {selectionProcess.map((sp, i) => (
            <div key={i} className="flex gap-3 items-start mb-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm shrink-0">{sp.step}</div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField placeholder="Step title (e.g., Entrance Exam)" value={sp.title} onChange={(e) => updateArrayItem(setSelectionProcess, i, "title", e.target.value)} />
                <InputField placeholder="Description" value={sp.description} onChange={(e) => updateArrayItem(setSelectionProcess, i, "description", e.target.value)} />
              </div>
              <button type="button" onClick={() => removeArrayItem(setSelectionProcess, i)} className="text-red-400 hover:text-red-600 mt-1"><X size={18} /></button>
            </div>
          ))}
        </div>

        {/* Description & Details */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" /> Description & Details
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Short Description <span className="text-red-500">*</span></label>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <ReactQuill theme="snow" value={shortDesc} onChange={setShortDesc} modules={quillModules} formats={quillFormats} className="bg-white" />
              </div>
              <p className="text-xs text-slate-500 text-right mt-1">{shortDesc.length}/200 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Program Description (About) <span className="text-red-500">*</span></label>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <ReactQuill theme="snow" value={fullDesc} onChange={setFullDesc} modules={quillModules} formats={quillFormats} className="bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Important Notes</label>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <ReactQuill theme="snow" value={notes} onChange={setNotes} modules={quillModules} formats={quillFormats} className="bg-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Required Documents */}
        <div className="mb-8 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-pink-600" /> Required Documents
            </h3>
            <Button variant="outline" type="button" onClick={() => addArrayItem(setRequiredDocs, () => "")}>
              <Plus size={14} /> Add Document
            </Button>
          </div>
          {requiredDocs.map((doc, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input className="flex-1 px-3.5 py-2 border border-slate-200 rounded-md text-sm" placeholder="e.g., SEE Mark Sheet" value={doc}
                onChange={(e) => setRequiredDocs((prev) => prev.map((d, j) => j === i ? e.target.value : d))} />
              <button type="button" onClick={() => removeArrayItem(setRequiredDocs, i)} className="text-red-400 hover:text-red-600"><X size={18} /></button>
            </div>
          ))}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Scholarship Guidelines/PDF</label>
            <div className="border-2 border-dashed border-slate-200 rounded-md py-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
              onClick={() => document.getElementById("guidelines-upload")?.click()}>
              <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
              <input id="guidelines-upload" type="file" accept=".pdf,.doc,.docx" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setGuidelinesFile(f); }} />
            </div>
            {guidelinesFile && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Paperclip size={12} /> {guidelinesFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="mb-8 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600" /> Journey Timeline
            </h3>
            <Button variant="outline" type="button" onClick={() => addArrayItem(setJourneyTimeline, emptyJourneyItem)}>
              <Plus size={14} /> Add Milestone
            </Button>
          </div>
          {journeyTimeline.map((jt, i) => (
            <div key={i} className="flex gap-3 items-start mb-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <InputField placeholder="Year (e.g., 2022)" value={jt.year} onChange={(e) => updateArrayItem(setJourneyTimeline, i, "year", e.target.value)} />
                <InputField placeholder="Title" value={jt.title} onChange={(e) => updateArrayItem(setJourneyTimeline, i, "title", e.target.value)} />
                <InputField placeholder="Description" value={jt.description} onChange={(e) => updateArrayItem(setJourneyTimeline, i, "description", e.target.value)} />
              </div>
              <button type="button" onClick={() => removeArrayItem(setJourneyTimeline, i)} className="mt-6 text-red-400 hover:text-red-600"><X size={18} /></button>
            </div>
          ))}
        </div>

        {/* Exam Centers */}
        <div className="mb-8 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> Exam Centers
            </h3>
            <Button variant="outline" type="button" onClick={() => addArrayItem(setExamCenters, emptyExamCenter)}>
              <Plus size={14} /> Add Center
            </Button>
          </div>
          {examCenters.map((ec, i) => (
            <div key={i} className="flex gap-3 items-start mb-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2">
                <SelectField value={ec.province} onChange={(e) => updateArrayItem(setExamCenters, i, "province", e.target.value)} options={PROVINCE_OPTIONS} />
                <InputField placeholder="City" value={ec.city} onChange={(e) => updateArrayItem(setExamCenters, i, "city", e.target.value)} />
                <InputField placeholder="Venue" value={ec.venue} onChange={(e) => updateArrayItem(setExamCenters, i, "venue", e.target.value)} />
                <InputField placeholder="Contact Person" value={ec.contact} onChange={(e) => updateArrayItem(setExamCenters, i, "contact", e.target.value)} />
                <InputField placeholder="Phone" value={ec.phone} onChange={(e) => updateArrayItem(setExamCenters, i, "phone", e.target.value)} />
              </div>
              <button type="button" onClick={() => removeArrayItem(setExamCenters, i)} className="mt-6 text-red-400 hover:text-red-600"><X size={18} /></button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-8 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-600" /> Frequently Asked Questions
            </h3>
            <Button variant="outline" type="button" onClick={() => addArrayItem(setFaqs, emptyFAQ)}>
              <Plus size={14} /> Add FAQ
            </Button>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className="flex gap-3 items-start mb-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex-1 grid grid-cols-1 gap-2">
                <InputField placeholder="Question" value={faq.question} onChange={(e) => updateArrayItem(setFaqs, i, "question", e.target.value)} />
                <InputField placeholder="Answer" value={faq.answer} onChange={(e) => updateArrayItem(setFaqs, i, "answer", e.target.value)} />
              </div>
              <button type="button" onClick={() => removeArrayItem(setFaqs, i)} className="mt-1 text-red-400 hover:text-red-600"><X size={18} /></button>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="mb-8 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Handshake className="w-4 h-4 text-teal-600" /> Partners
            </h3>
            <Button variant="outline" type="button" onClick={() => addArrayItem(setPartners, emptyPartner)}>
              <Plus size={14} /> Add Partner
            </Button>
          </div>
          {partners.map((p, i) => (
            <div key={i} className="flex gap-3 items-start mb-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <InputField placeholder="Partner Name" value={p.name} onChange={(e) => updateArrayItem(setPartners, i, "name", e.target.value)} />
                <InputField placeholder="Logo URL" value={p.logo_url} onChange={(e) => updateArrayItem(setPartners, i, "logo_url", e.target.value)} />
                <InputField placeholder="Website" value={p.website} onChange={(e) => updateArrayItem(setPartners, i, "website", e.target.value)} />
              </div>
              <button type="button" onClick={() => removeArrayItem(setPartners, i)} className="mt-6 text-red-400 hover:text-red-600"><X size={18} /></button>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="mb-8 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-600" /> Achievements
            </h3>
            <Button variant="outline" type="button" onClick={() => addArrayItem(setAchievements, emptyAchievement)}>
              <Plus size={14} /> Add Achievement
            </Button>
          </div>
          {achievements.map((a, i) => (
            <div key={i} className="flex gap-3 items-start mb-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                <InputField placeholder="Title" value={a.title} onChange={(e) => updateArrayItem(setAchievements, i, "title", e.target.value)} />
                <InputField placeholder="Description" value={a.description} onChange={(e) => updateArrayItem(setAchievements, i, "description", e.target.value)} />
                <InputField placeholder="Tags (comma-sep)" value={a.tags.join(", ")} onChange={(e) => updateArrayItem(setAchievements, i, "tags", e.target.value.split(",").map((t) => t.trim()))} />
                <InputField placeholder="Link (optional)" value={a.link || ""} onChange={(e) => updateArrayItem(setAchievements, i, "link", e.target.value)} />
              </div>
              <button type="button" onClick={() => removeArrayItem(setAchievements, i)} className="mt-6 text-red-400 hover:text-red-600"><X size={18} /></button>
            </div>
          ))}
        </div>

        {/* News & Notices */}
        <div className="mb-8 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-blue-600" /> News & Notices
            </h3>
            <Button variant="outline" type="button" onClick={() => addArrayItem(setNewsItems, emptyNewsItem)}>
              <Plus size={14} /> Add News
            </Button>
          </div>
          {newsItems.map((n, i) => (
            <div key={i} className="flex gap-3 items-start mb-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2">
                <InputField placeholder="Title" value={n.title} onChange={(e) => updateArrayItem(setNewsItems, i, "title", e.target.value)} />
                <InputField placeholder="Description" value={n.description} onChange={(e) => updateArrayItem(setNewsItems, i, "description", e.target.value)} />
                <InputField placeholder="Date" type="date" value={n.date} onChange={(e) => updateArrayItem(setNewsItems, i, "date", e.target.value)} />
                <SelectField value={n.category} onChange={(e) => updateArrayItem(setNewsItems, i, "category", e.target.value)} options={NEWS_CATEGORY_OPTIONS} />
                <InputField placeholder="Link (optional)" value={n.link || ""} onChange={(e) => updateArrayItem(setNewsItems, i, "link", e.target.value)} />
              </div>
              <button type="button" onClick={() => removeArrayItem(setNewsItems, i)} className="mt-6 text-red-400 hover:text-red-600"><X size={18} /></button>
            </div>
          ))}
        </div>
      </SectionCard>
      )}
      {/* Action Buttons */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>
      )}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => handleSave(true)} disabled={submitting}>
          <Save className="w-4 h-4" /> Save as Draft
        </Button>
        <Button onClick={() => handleSave(false)} disabled={submitting}>
          <PlusCircle className="w-4 h-4" /> {submitting ? "Publishing..." : "Publish Scholarship"}
        </Button>
      </div>
    </div>
  );
});

CreateScholarship.displayName = "CreateScholarship";

/* Helper sub-component for eligibility list */
function EligibilityList({ label, items, onAdd, onRemove }: {
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [input, setInput] = useState("");
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="flex gap-2 mb-2">
        <input className="flex-1 px-3.5 py-2 border border-slate-200 rounded-md text-sm" placeholder="Add a criteria..." value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(input); setInput(""); } }} />
        <Button variant="secondary" type="button" onClick={() => { onAdd(input); setInput(""); }}>
          <Plus size={14} /> Add
        </Button>
      </div>
      {items.length > 0 && (
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-md text-sm text-slate-700">
              <span className="flex-1">{item}</span>
              <button type="button" onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreateScholarship;
