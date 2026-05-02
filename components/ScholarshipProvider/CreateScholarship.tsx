"use client";

import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import { toast } from "sonner";
import { format, addDays, isAfter, parseISO, isValid } from "date-fns";
import {
  Gear, FloppyDisk, PaperPlaneTilt
} from "@phosphor-icons/react";
import { scholarshipProviderApi } from "../../services/scholarshipProviderApi";
import {
  GeneralSettingsSection,
  ContactDetailsSection,
  AboutSection,
  VideoTutorialsSection,
  JourneyTimelineSection,
  ScholarshipTimelineSection,
  ScholarshipDetailsSection,
  EligibilitySection,
  FAQSection,
  GallerySection,
  PartnersSection,
  ExamCentersSection,
  DownloadsSection,
  PaymentConfigSection,
} from "./create-scholarship";

interface VideoTutorial {
  url: string;
  title: string;
  description: string;
}

interface JourneyTimelineItem {
  year: string;
  title: string;
  description: string;
}

interface ScholarshipTypeItem {
  type: string;
  seats: string;
  coverage: string;
  eligibility: string;
}

interface SelectionRubricItem {
  criteria: string;
  description: string;
  weight: string;
}

interface SelectionProcessStepItem {
  step: number;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface GalleryImageItem {
  title: string;
  url: string;
}

interface PartnerOrganization {
  name: string;
  website: string;
}

interface PartnerGroup {
  heading: string;
  partners: PartnerOrganization[];
}

interface ExamCenterItem {
  province: string;
  centerName: string;
  contactPerson: string;
  phoneNumber: string;
  mapCoordinates: string;
}

interface DownloadItem {
  title: string;
  description: string;
}

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
}

interface CreateScholarshipProps {
  scholarshipId?: number | null;
  onNavigate?: (section: string) => void;
}

const emptyVideo = (): VideoTutorial => ({ url: "", title: "", description: "" });
const emptyJourneyItem = (): JourneyTimelineItem => ({ year: "", title: "", description: "" });
const emptyScholarshipType = (): ScholarshipTypeItem => ({ type: "", seats: "", coverage: "", eligibility: "" });
const emptyRubric = (): SelectionRubricItem => ({ criteria: "", description: "", weight: "" });
const emptyProcessStep = (): SelectionProcessStepItem => ({ step: 1, title: "", description: "" });
const emptyFAQ = (): FAQItem => ({ question: "", answer: "" });
const emptyGalleryImage = (): GalleryImageItem => ({ title: "", url: "" });
const emptyPartnerOrg = (): PartnerOrganization => ({ name: "", website: "" });
const emptyPartnerGroup = (): PartnerGroup => ({ heading: "", partners: [] });
const emptyExamCenter = (): ExamCenterItem => ({ province: "", centerName: "", contactPerson: "", phoneNumber: "", mapCoordinates: "" });
const emptyDownload = (): DownloadItem => ({ title: "", description: "" });
type ScholarshipSaveMode = "draft" | "published";
type ValidationField =
  | "pageTitle"
  | "banner"
  | "location"
  | "degreeLevel"
  | "fundingType"
  | "scholarshipType"
  | "applicationStartDate"
  | "applicationEndDate";

const toLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const CreateScholarship: React.FC<CreateScholarshipProps> = memo(({ scholarshipId, onNavigate }: CreateScholarshipProps) => {
  // General Settings
  const [mainTitle, setMainTitle] = useState("");
  const [providerName, setProviderName] = useState("");
  const [fundingType, setFundingType] = useState("");
  const [fundingTypeOther, setFundingTypeOther] = useState("");
  const [scholarshipType, setScholarshipType] = useState("");
  const [scholarshipTypeOther, setScholarshipTypeOther] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [educationLevelOther, setEducationLevelOther] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [applyLink, setApplyLink] = useState("");
  const [bannerBgUrl, setBannerBgUrl] = useState("");
  const [bannerBgPreview, setBannerBgPreview] = useState("");

  // Contact Details
  const [coverageArea, setCoverageArea] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactEmailError, setContactEmailError] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [primaryPhoneError, setPrimaryPhoneError] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [secondaryPhoneError, setSecondaryPhoneError] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteUrlError, setWebsiteUrlError] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  // About
  const [aboutOverview, setAboutOverview] = useState("");

  // Video Tutorials
  const [videoTutorials, setVideoTutorials] = useState<VideoTutorial[]>([]);

  // Journey Timeline
  const [journeyTimeline, setJourneyTimeline] = useState<JourneyTimelineItem[]>([]);

  // Scholarship Timeline (Key Dates)
  const [timelineEvents, setTimelineEvents] = useState<{ title: string; date: string; description: string }[]>([]);

  // Scholarship Details
  const [scholarshipSectionTitle, setScholarshipSectionTitle] = useState("");
  const [scholarshipSubtitle, setScholarshipSubtitle] = useState("");
  const [scholarshipDescription, setScholarshipDescription] = useState("");
  const [scholarshipTypes, setScholarshipTypes] = useState<ScholarshipTypeItem[]>([]);
  const [selectionRubric, setSelectionRubric] = useState<SelectionRubricItem[]>([]);

  // Eligibility
  const [eligibilitySectionTitle, setEligibilitySectionTitle] = useState("");
  const [eligibilitySubtitle, setEligibilitySubtitle] = useState("");
  const [basicRequirements, setBasicRequirements] = useState<string[]>([]);
  const [fullyFundedConditions, setFullyFundedConditions] = useState<string[]>([]);
  const [partiallyFundedConditions, setPartiallyFundedConditions] = useState<string[]>([]);
  const [selectionProcessSteps, setSelectionProcessSteps] = useState<SelectionProcessStepItem[]>([]);
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>([]);

  // FAQ
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Gallery
  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>([]);

  // Partners
  const [partnerGroups, setPartnerGroups] = useState<PartnerGroup[]>([]);

  // Exam Centers
  const [examCenters, setExamCenters] = useState<ExamCenterItem[]>([]);

  // Downloads
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  // Payment Config
  const [enablePayment, setEnablePayment] = useState(false);
  const [paymentFeeAmount, setPaymentFeeAmount] = useState(0);
  const [enableBank, setEnableBank] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: '',
    accountName: '',
    accountNumber: '',
    branch: '',
  });
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrCodePreview, setQrCodePreview] = useState("");

  // Form state
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const isEditing = Boolean(scholarshipId);
  const isBusy = submitting;
  const pageTitleRef = useRef<HTMLInputElement | null>(null);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const locationRef = useRef<HTMLInputElement | null>(null);
  const degreeLevelRef = useRef<HTMLDivElement | null>(null);
  const fundingTypeRef = useRef<HTMLDivElement | null>(null);
  const scholarshipTypeRef = useRef<HTMLDivElement | null>(null);
  const applicationStartDateRef = useRef<HTMLInputElement | null>(null);
  const applicationEndDateRef = useRef<HTMLInputElement | null>(null);
  const degreeLevelOptions = ["+2 / Grade 11-12", "Diploma", "Bachelor's", "Master's", "PhD"];
  const fundingTypeOptions = ["Fully Funded", "Partial Tuition", "Merit-Based", "Need-Based"];
  const scholarshipTypeOptions = ["Merit Based", "Need Based", "Sports", "Arts", "Research"];
  const provinceOptions = ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];
  const today = toLocalDateString(new Date());
  const tomorrow = toLocalDateString(new Date(Date.now() + 24 * 60 * 60 * 1000));

  // Banner file handler
  const handleBannerFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setBannerBgPreview(dataUrl);
      setBannerBgUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Map URL handler
  const handleMapUrlChange = (value: string) => {
    setMapUrl(value);
  };

  // QR Code file handler
  const handleQrCodeFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setQrCodePreview(dataUrl);
      setQrCodeUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Load existing data
  useEffect(() => {
    if (!scholarshipId) {
      setLoadingData(false);
      return;
    }
    setLoadingData(true);
    scholarshipProviderApi.getScholarshipById(scholarshipId).then((s) => {
      // General Settings
      setMainTitle(s.title || "");
      setProviderName((s as any).provider_name || s.title || "");
      setFundingType(s.funding_type || "");
      setFundingTypeOther((s as any).funding_type_other || "");
      setScholarshipType(s.scholarship_type || "");
      setScholarshipTypeOther((s as any).scholarship_type_other || "");
      setEducationLevel((s as any).education_level || s.degree_level || "");
      setEducationLevelOther((s as any).education_level_other || "");
      setLocation(s.location || "");
      setStartDate(s.application_start_date?.split('T')[0] || "");
      setEndDate(s.application_end_date?.split('T')[0] || "");
      setApplyLink((s as any).apply_link || "");
      setBannerBgUrl(s.banner_background_image_url || "");
      setBannerBgPreview(s.banner_background_image_url || "");

      // Contact Details
      setCoverageArea((s as any).coverage_area || "");
      setContactEmail((s as any).contact_email || "");
      setPrimaryPhone((s as any).primary_phone || "");
      setSecondaryPhone((s as any).secondary_phone || "");
      setWebsiteUrl((s as any).website_url || "");
      setOfficeAddress((s as any).office_address || "");
      setMapUrl((s as any).map_url || "");

      // About
      setAboutOverview(s.about_paragraph_1 || s.description || "");

      // Video Tutorials
      setVideoTutorials(s.video_tutorials || []);

      // Journey Timeline
      setJourneyTimeline(s.journey_timeline || []);

      // Scholarship Details
      setScholarshipSectionTitle(s.scholarship_section_title || "");
      setScholarshipSubtitle(s.scholarship_subtitle || "");
      setScholarshipDescription(s.scholarship_description_1 || "");
      setScholarshipTypes((s.scholarship_types_new as ScholarshipTypeItem[]) || (s.scholarship_types || []).map((t: any) => ({ type: t.type || "", seats: t.seats || "", coverage: t.coverage || "", eligibility: t.eligibility || "" })) as ScholarshipTypeItem[]);
      setTimelineEvents((s as any).timeline || []);
      setSelectionRubric(s.selection_rubric_new || []);

      // Eligibility
      setEligibilitySectionTitle(s.eligibility_section_title || "");
      setEligibilitySubtitle(s.eligibility_subtitle || "");
      setBasicRequirements(s.basic_eligibility_criteria || []);
      setFullyFundedConditions(s.fully_funded_criteria || []);
      setPartiallyFundedConditions(s.partially_funded_criteria || []);
      setSelectionProcessSteps(s.selection_process_steps || []);
      setRequiredDocuments(s.required_documents || []);

      // FAQ
      setFaqs(s.faqs_new || (s.faqs || []).map((f: any) => ({ question: f.question || "", answer: f.answer || "" })));

      // Gallery
      setGalleryImages(s.gallery_images_new || (s.gallery_images || []).map((img: string) => ({ title: "", url: img })));

      // Partners
      setPartnerGroups(s.partner_groups || []);

      // Exam Centers
      setExamCenters((s.exam_centers_new as unknown as ExamCenterItem[]) || []);

      // Downloads
      setDownloads(s.downloads || []);

      // Payment Config
      const paymentConfig = (s as any).payment_config;
      if (paymentConfig) {
        setEnablePayment(paymentConfig.enabled ?? false);
        setPaymentFeeAmount(paymentConfig.fee_amount || 100);
        setEnableBank(paymentConfig.methods?.includes('bank') ?? false);
        if (paymentConfig.bank_details) {
          setBankDetails(paymentConfig.bank_details);
        }
        if (paymentConfig.qr_code) {
          setQrCodeUrl(paymentConfig.qr_code);
          setQrCodePreview(paymentConfig.qr_code);
        }
      }

      setLoadingData(false);
    }).catch(() => setLoadingData(false));
  }, [scholarshipId]);

  const validateDates = useCallback(() => {
    let isValidDate = true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Clear previous errors
    setStartDateError("");
    setEndDateError("");

    // Validate start date - must be in the future
    if (startDate) {
      const start = parseISO(startDate);
      if (!isValid(start)) {
        setStartDateError("Invalid date format");
        isValidDate = false;
      } else if (!isAfter(start, today)) {
        setStartDateError("Start date must be in the future");
        isValidDate = false;
      }
    }

    // Validate end date - must be after start date
    if (endDate) {
      const end = parseISO(endDate);
      if (!isValid(end)) {
        setEndDateError("Invalid date format");
        isValidDate = false;
      } else if (startDate) {
        const start = parseISO(startDate);
        if (!isAfter(end, start)) {
          setEndDateError("End date must be after start date");
          isValidDate = false;
        }
      }
    }

    return isValidDate;
  }, [startDate, endDate]);

  const validateScholarship = useCallback((mode: string) => {
    // Email validation
    if (!contactEmail) {
      return { message: "Contact email is required", field: "contactEmail" };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return { message: "Invalid contact email format", field: "contactEmail" };
    }

    // Phone validation - exactly 10 digits starting with 9
    if (!primaryPhone || !/^9\d{9}$/.test(primaryPhone)) {
      return { message: "Primary phone must be exactly 10 digits and start with 9", field: "primaryPhone" };
    }

    // Secondary phone validation (optional but if provided must be valid)
    if (secondaryPhone && !/^9\d{9}$/.test(secondaryPhone)) {
      return { message: "Secondary phone must be exactly 10 digits and start with 9", field: "secondaryPhone" };
    }

    // Website URL validation
    if (!websiteUrl) {
      return { message: "Website URL is required", field: "websiteUrl" };
    }
    try {
      new URL(websiteUrl);
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        return { message: "Website URL must start with http:// or https://", field: "websiteUrl" };
      }
    } catch {
      return { message: "Invalid website URL", field: "websiteUrl" };
    }

    // Coverage area validation
    if (!coverageArea.trim()) {
      return { message: "Coverage area is required", field: "coverageArea" };
    }

    // Office address validation
    if (!officeAddress.trim()) {
      return { message: "Office address is required", field: "officeAddress" };
    }

    // Map URL validation
    if (!mapUrl.trim()) {
      return { message: "Map URL is required", field: "mapUrl" };
    }
    try {
      new URL(mapUrl);
      if (!mapUrl.startsWith('http://') && !mapUrl.startsWith('https://')) {
        return { message: "Map URL must start with http:// or https://", field: "mapUrl" };
      }
    } catch {
      return { message: "Invalid map URL", field: "mapUrl" };
    }

    return { message: "", field: "" };
  }, [contactEmail, primaryPhone, secondaryPhone, websiteUrl, coverageArea, officeAddress, mapUrl]);

  const scrollToField = useCallback((field: string) => {
    const element = document.getElementById(field);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus();
    }
  }, []);

  const handleStartDateChange = useCallback((value: string) => {
    setStartDate(value);
    setStartDateError("");
    if (endDate && value) {
      const start = parseISO(value);
      const end = parseISO(endDate);
      if (isValid(start) && isValid(end) && !isAfter(end, start)) {
        setEndDateError("End date must be after start date");
      }
    }
  }, [endDate]);

  const handleEndDateChange = useCallback((value: string) => {
    setEndDate(value);
    setEndDateError("");
  }, []);

  const handleSave = useCallback(async (draft: boolean = false) => {
    if (!mainTitle.trim()) {
      setError("Page Title is required.");
      return;
    }

    // Validate dates
    if (!validateDates()) {
      return;
    }

    const mode = draft ? "draft" : "published";
    const validationError = validateScholarship(mode);
    if (validationError.message) {
      toast.error(validationError.message);
      if (validationError.field) {
        scrollToField(validationError.field);
      }
      return;
    }

    setSubmitting(true);

    const finalFundingType = fundingType === "Other" ? fundingTypeOther : fundingType;
    const finalScholarshipType = scholarshipType === "Other" ? scholarshipTypeOther : scholarshipType;
    const finalEducationLevel = educationLevel === "Other" ? educationLevelOther : educationLevel;

    const payload = {
      title: mainTitle,
      provider: providerName,
      description: aboutOverview,
      provider_name: providerName,
      location,
      value: "",
      deadline: endDate ? new Date(endDate).toISOString() : "",
      degree_level: finalEducationLevel,
      funding_type: finalFundingType,
      scholarship_type: finalScholarshipType,
      field_of_study: [],
      status: (draft ? 'draft' : 'published') as 'draft' | 'published',
      application_start_date: startDate ? new Date(startDate).toISOString() : undefined,
      application_end_date: endDate ? new Date(endDate).toISOString() : undefined,
      apply_link: applyLink || undefined,
      banner_background_image_url: bannerBgUrl || undefined,
      coverage_area: coverageArea || undefined,
      contact_email: contactEmail || undefined,
      primary_phone: primaryPhone || undefined,
      secondary_phone: secondaryPhone || undefined,
      website_url: websiteUrl || undefined,
      office_address: officeAddress || undefined,
      map_url: mapUrl || undefined,
      about_paragraph_1: aboutOverview,
      video_tutorials: videoTutorials,
      journey_timeline: journeyTimeline,
      scholarship_section_title: scholarshipSectionTitle || undefined,
      scholarship_subtitle: scholarshipSubtitle || undefined,
      scholarship_description_1: scholarshipDescription || undefined,
      timeline: timelineEvents,
      scholarship_types_new: scholarshipTypes,
      selection_rubric_new: selectionRubric,
      eligibility_section_title: eligibilitySectionTitle || undefined,
      eligibility_subtitle: eligibilitySubtitle || undefined,
      basic_eligibility_criteria: basicRequirements,
      fully_funded_criteria: fullyFundedConditions,
      partially_funded_criteria: partiallyFundedConditions,
      selection_process_steps: selectionProcessSteps,
      required_documents: requiredDocuments,
      faqs_new: faqs,
      gallery_images_new: galleryImages,
      partner_groups: partnerGroups,
      exam_centers_new: examCenters as unknown as any,
      downloads: downloads,
      payment_config: {
        enabled: enablePayment,
        fee_amount: enablePayment ? paymentFeeAmount : 0,
        methods: enableBank ? ['bank'] : [],
        ...(enableBank ? { 
          bank_details: {
            bank_name: bankDetails.bankName,
            account_name: bankDetails.accountName,
            account_number: bankDetails.accountNumber,
            branch: bankDetails.branch,
          }, 
          qr_code: qrCodeUrl 
        } : {}),
      },
    };

    try {
      if (isEditing && scholarshipId) {
        await scholarshipProviderApi.updateScholarship(scholarshipId, payload);
      } else {
        await scholarshipProviderApi.createScholarship(payload);
      }
      toast.success(mode === "draft" ? "Draft saved successfully!" : "Scholarship published successfully!");
      if (onNavigate) {
        const nextSection = mode === "draft" ? "sec-draft-scholarship" : "sec-scholarship-directory";
        setTimeout(() => onNavigate(nextSection), 1500);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save scholarship");
    } finally {
      setSubmitting(false);
    }
  }, [mainTitle, providerName, fundingType, fundingTypeOther, scholarshipType, scholarshipTypeOther, 
      educationLevel, educationLevelOther, location, startDate, endDate, applyLink, bannerBgUrl,
      coverageArea, contactEmail, primaryPhone, secondaryPhone, websiteUrl, officeAddress, mapUrl,
      aboutOverview, videoTutorials, journeyTimeline, scholarshipSectionTitle, scholarshipSubtitle,
      scholarshipDescription, scholarshipTypes, selectionRubric, eligibilitySectionTitle, eligibilitySubtitle,
      basicRequirements, fullyFundedConditions, partiallyFundedConditions, selectionProcessSteps,
      requiredDocuments, faqs, galleryImages, partnerGroups, examCenters, downloads, scholarshipId,
      isEditing, onNavigate, status, enablePayment, enableBank, bankDetails, qrCodeUrl]);

  if (loadingData) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="py-12 text-center text-gray-500">Loading scholarship data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 pb-32">
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
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-6">{success}</div>
      )}

      {/* General Settings */}
      <GeneralSettingsSection
        mainTitle={mainTitle}
        setMainTitle={setMainTitle}
        providerName={providerName}
        setProviderName={setProviderName}
        fundingType={fundingType}
        setFundingType={setFundingType}
        fundingTypeOther={fundingTypeOther}
        setFundingTypeOther={setFundingTypeOther}
        scholarshipType={scholarshipType}
        setScholarshipType={setScholarshipType}
        scholarshipTypeOther={scholarshipTypeOther}
        setScholarshipTypeOther={setScholarshipTypeOther}
        educationLevel={educationLevel}
        setEducationLevel={setEducationLevel}
        educationLevelOther={educationLevelOther}
        setEducationLevelOther={setEducationLevelOther}
        location={location}
        setLocation={setLocation}
        startDate={startDate}
        setStartDate={handleStartDateChange}
        endDate={endDate}
        setEndDate={handleEndDateChange}
        startDateError={startDateError}
        endDateError={endDateError}
        applyLink={applyLink}
        setApplyLink={setApplyLink}
        bannerBgUrl={bannerBgUrl}
        bannerBgPreview={bannerBgPreview}
        onBannerSelect={handleBannerFileSelect}
      />

      {/* Contact Details */}
      <ContactDetailsSection
        coverageArea={coverageArea}
        setCoverageArea={setCoverageArea}
        contactEmail={contactEmail}
        setContactEmail={setContactEmail}
        contactEmailError={contactEmailError}
        setContactEmailError={setContactEmailError}
        primaryPhone={primaryPhone}
        setPrimaryPhone={setPrimaryPhone}
        primaryPhoneError={primaryPhoneError}
        setPrimaryPhoneError={setPrimaryPhoneError}
        secondaryPhone={secondaryPhone}
        setSecondaryPhone={setSecondaryPhone}
        secondaryPhoneError={secondaryPhoneError}
        setSecondaryPhoneError={setSecondaryPhoneError}
        websiteUrl={websiteUrl}
        setWebsiteUrl={setWebsiteUrl}
        websiteUrlError={websiteUrlError}
        setWebsiteUrlError={setWebsiteUrlError}
        officeAddress={officeAddress}
        setOfficeAddress={setOfficeAddress}
        mapUrl={mapUrl}
        setMapUrl={setMapUrl}
      />

      {/* About Section */}
      <AboutSection
        aboutOverview={aboutOverview}
        setAboutOverview={setAboutOverview}
      />

      {/* Journey Timeline (Provider - About Tab) */}
      <JourneyTimelineSection
        timeline={journeyTimeline}
        setTimeline={setJourneyTimeline}
      />

      {/* Video Tutorials */}
      <VideoTutorialsSection
        videos={videoTutorials}
        setVideos={setVideoTutorials}
      />

      {/* Scholarship Details */}
      <ScholarshipDetailsSection
        sectionTitle={scholarshipSectionTitle}
        setSectionTitle={setScholarshipSectionTitle}
        subtitle={scholarshipSubtitle}
        setSubtitle={setScholarshipSubtitle}
        description={scholarshipDescription}
        setDescription={setScholarshipDescription}
        scholarshipTypes={scholarshipTypes}
        setScholarshipTypes={setScholarshipTypes}
        selectionRubric={selectionRubric}
        setSelectionRubric={setSelectionRubric}
      />

      {/* Eligibility */}
      <EligibilitySection
        sectionTitle={eligibilitySectionTitle}
        setSectionTitle={setEligibilitySectionTitle}
        subtitle={eligibilitySubtitle}
        setSubtitle={setEligibilitySubtitle}
        basicRequirements={basicRequirements}
        setBasicRequirements={setBasicRequirements}
        fullyFundedConditions={fullyFundedConditions}
        setFullyFundedConditions={setFullyFundedConditions}
        partiallyFundedConditions={partiallyFundedConditions}
        setPartiallyFundedConditions={setPartiallyFundedConditions}
        selectionProcessSteps={selectionProcessSteps}
        setSelectionProcessSteps={setSelectionProcessSteps}
        requiredDocuments={requiredDocuments}
        setRequiredDocuments={setRequiredDocuments}
      />

      {/* Scholarship Timeline (Key Dates) */}
      <ScholarshipTimelineSection
        timelineEvents={timelineEvents}
        setTimelineEvents={setTimelineEvents}
      />

      {/* Gallery */}
      <GallerySection
        images={galleryImages}
        setImages={setGalleryImages}
      />

      {/* FAQ */}
      <FAQSection
        faqs={faqs}
        setFaqs={setFaqs}
      />

      {/* Partners */}
      <PartnersSection
        partnerGroups={partnerGroups}
        setPartnerGroups={setPartnerGroups}
      />

      {/* Exam Centers */}
      <ExamCentersSection
        examCenters={examCenters}
        setExamCenters={setExamCenters}
      />

      {/* Downloads */}
      <DownloadsSection
        downloads={downloads}
        setDownloads={setDownloads}
      />

      {/* Payment Configuration */}
      <PaymentConfigSection
        enablePayment={enablePayment}
        setEnablePayment={setEnablePayment}
        paymentFeeAmount={paymentFeeAmount}
        setPaymentFeeAmount={setPaymentFeeAmount}
        enableBank={enableBank}
        setEnableBank={setEnableBank}
        bankDetails={bankDetails}
        setBankDetails={setBankDetails}
        qrCodeUrl={qrCodeUrl}
        setQrCodeUrl={setQrCodeUrl}
        qrCodePreview={qrCodePreview}
        onQrCodeSelect={handleQrCodeFileSelect}
      />

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
          onClick={() => handleSave(true)}
          disabled={submitting}
        >
          <FloppyDisk size={20} /> Save as Draft
        </button>
        <button
          type="button"
          className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          onClick={() => handleSave(false)}
          disabled={submitting}
        >
          <PaperPlaneTilt size={20} /> {submitting ? "Publishing..." : "Publish Changes"}
        </button>
      </div>
    </div>
  );
});

CreateScholarship.displayName = "CreateScholarship";

export default CreateScholarship;
