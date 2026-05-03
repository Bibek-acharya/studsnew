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
  type GalleryImageItem,
  type PartnerOrganization,
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

interface PartnerFormItem {
  groupHeading: string;
  name: string;
  website: string;
  logo: string;
}

interface ExamCenterItem {
  province: string;
  headerColor: string;
  info: string;
  centerName: string;
  contactPerson: string;
  phoneNumber: string;
  mapCoordinates: string;
}

interface DownloadItem {
  title: string;
  description: string;
  url: string;
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
  const [mainTitleError, setMainTitleError] = useState("");
  const [providerNameError, setProviderNameError] = useState("");
  const [fundingTypeError, setFundingTypeError] = useState("");
  const [scholarshipTypeError, setScholarshipTypeError] = useState("");
  const [educationLevelError, setEducationLevelError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [bannerError, setBannerError] = useState("");
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
  const [officeAddressError, setOfficeAddressError] = useState("");
  const [coverageAreaError, setCoverageAreaError] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [mapUrlError, setMapUrlError] = useState("");

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
  
  const [schSectionTitleError, setSchSectionTitleError] = useState("");
  const [schSubtitleError, setSchSubtitleError] = useState("");
  const [schDescriptionError, setSchDescriptionError] = useState("");

  // Eligibility
  const [eligibilitySectionTitle, setEligibilitySectionTitle] = useState("");
  const [eligibilitySubtitle, setEligibilitySubtitle] = useState("");
  const [basicRequirements, setBasicRequirements] = useState<string[]>([]);
  const [fullyFundedConditions, setFullyFundedConditions] = useState<string[]>([]);
  const [partiallyFundedConditions, setPartiallyFundedConditions] = useState<string[]>([]);
  const [selectionProcessSteps, setSelectionProcessSteps] = useState<SelectionProcessStepItem[]>([]);
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>([]);

  const [eligSectionTitleError, setEligSectionTitleError] = useState("");
  const [eligSubtitleError, setEligSubtitleError] = useState("");

  // FAQ
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Gallery
  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>([]);

  // Partners
  const [partnerGroups, setPartnerGroups] = useState<PartnerFormItem[]>([]);

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
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const isEditing = Boolean(scholarshipId);

  // Banner file handler
  const handleBannerFileSelect = async (file: File) => {
    try {
      const url = await scholarshipProviderApi.uploadImage(file, "scholarships");
      setBannerBgUrl(url);
      setBannerBgPreview(url);
    } catch (err) {
      toast.error("Failed to upload banner image");
      console.error(err);
    }
  };

  // Map URL handler

  // QR Code file handler
  const handleQrCodeFileSelect = async (file: File) => {
    try {
      const url = await scholarshipProviderApi.uploadImage(file, "payments");
      setQrCodeUrl(url);
      setQrCodePreview(url);
    } catch (err) {
      toast.error("Failed to upload QR code");
      console.error(err);
    }
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
      setScholarshipDescription(s.scholarship_description_1 || s.description || "");
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
      setGalleryImages(s.gallery_images_new || (s.gallery_images || []).map((img: any) => ({
        title: img.title || "",
        url: img.url || img || ""
      })));

      // Partners
      setPartnerGroups(((s as any).partner_groups || []) as PartnerFormItem[]);

      // Exam Centers
      setExamCenters((s.exam_centers_new as unknown as ExamCenterItem[]) || []);

      // Downloads
      setDownloads(s.downloads || []);

      // Payment Config
      const paymentConfig = (s as any).payment_config;
      if (paymentConfig) {
        setEnablePayment(paymentConfig.enabled ?? false);
        setPaymentFeeAmount(paymentConfig.fee_amount ?? 0);
        setEnableBank(paymentConfig.methods?.includes('bank') ?? false);
        if (paymentConfig.bank_details) {
          setBankDetails({
            bankName: paymentConfig.bank_details.bank_name || "",
            accountName: paymentConfig.bank_details.account_name || "",
            accountNumber: paymentConfig.bank_details.account_number || "",
            branch: paymentConfig.bank_details.branch || "",
          });
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
    let firstInvalidField = "";
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
        firstInvalidField ||= "startDate";
      } else if (!isAfter(start, today)) {
        setStartDateError("Start date must be in the future");
        isValidDate = false;
        firstInvalidField ||= "startDate";
      }
    }

    // Validate end date - must be after start date
    if (endDate) {
      const end = parseISO(endDate);
      if (!isValid(end)) {
        setEndDateError("Invalid date format");
        isValidDate = false;
        firstInvalidField ||= "endDate";
      } else if (startDate) {
        const start = parseISO(startDate);
        if (!isAfter(end, start)) {
          setEndDateError("End date must be after start date");
          isValidDate = false;
          firstInvalidField ||= "endDate";
        }
      }
    }

    return { isValidDate, field: firstInvalidField };
  }, [startDate, endDate]);

  const validateScholarship = useCallback(() => {
    let hasError = false;
    
    // Clear previous errors
    setMainTitleError("");
    setProviderNameError("");
    setFundingTypeError("");
    setScholarshipTypeError("");
    setEducationLevelError("");
    setLocationError("");
    setContactEmailError("");
    setPrimaryPhoneError("");
    setSecondaryPhoneError("");
    setWebsiteUrlError("");
    setCoverageAreaError("");
    setOfficeAddressError("");
    setMapUrlError("");
    setBannerError("");
    setSchSectionTitleError("");
    setSchSubtitleError("");
    setSchDescriptionError("");
    setEligSectionTitleError("");
    setEligSubtitleError("");

    if (!mainTitle.trim()) {
      setMainTitleError("Main title is required");
      hasError = true;
    }

    if (!providerName.trim()) {
      setProviderNameError("Provider name is required");
      hasError = true;
    }

    if (!fundingType) {
      setFundingTypeError("Funding type is required");
      hasError = true;
    }

    if (!scholarshipType) {
      setScholarshipTypeError("Scholarship type is required");
      hasError = true;
    }

    if (!educationLevel) {
      setEducationLevelError("Education level is required");
      hasError = true;
    }

    if (!location.trim()) {
      setLocationError("Location is required");
      hasError = true;
    }

    if (!bannerBgUrl) {
      setBannerError("Banner image is required");
      hasError = true;
    }

    if (!contactEmail) {
      setContactEmailError("Contact email is required");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      setContactEmailError("Invalid contact email format");
      hasError = true;
    }

    if (!primaryPhone) {
      setPrimaryPhoneError("Primary phone is required");
      hasError = true;
    } else if (!/^9\d{9}$/.test(primaryPhone)) {
      setPrimaryPhoneError("Primary phone must be 10 digits starting with 9");
      hasError = true;
    }

    if (secondaryPhone && !/^9\d{9}$/.test(secondaryPhone)) {
      setSecondaryPhoneError("Secondary phone must be 10 digits starting with 9");
      hasError = true;
    }

    if (!websiteUrl) {
      setWebsiteUrlError("Website URL is required");
      hasError = true;
    } else {
      try {
        new URL(websiteUrl);
        if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
          setWebsiteUrlError("Website URL must start with http:// or https://");
          hasError = true;
        }
      } catch {
        setWebsiteUrlError("Invalid website URL");
        hasError = true;
      }
    }

    if (!coverageArea.trim()) {
      setCoverageAreaError("Coverage area is required");
      hasError = true;
    }

    if (!officeAddress.trim()) {
      setOfficeAddressError("Office address is required");
      hasError = true;
    }

    if (!mapUrl.trim()) {
      setMapUrlError("Map URL is required");
      hasError = true;
    } else {
      try {
        new URL(mapUrl);
        if (!mapUrl.startsWith('http://') && !mapUrl.startsWith('https://')) {
          setMapUrlError("Map URL must start with http:// or https://");
          hasError = true;
        }
      } catch {
        setMapUrlError("Invalid map URL");
        hasError = true;
      }
    }

    if (!scholarshipSectionTitle.trim()) {
      setSchSectionTitleError("Section title is required");
      hasError = true;
    }

    if (!scholarshipSubtitle.trim()) {
      setSchSubtitleError("Subtitle is required");
      hasError = true;
    }

    if (!scholarshipDescription.trim()) {
      setSchDescriptionError("Description is required");
      hasError = true;
    }

    if (!eligibilitySectionTitle.trim()) {
      setEligSectionTitleError("Section title is required");
      hasError = true;
    }

    if (!eligibilitySubtitle.trim()) {
      setEligSubtitleError("Short description is required");
      hasError = true;
    }

    return !hasError;
  }, [mainTitle, providerName, fundingType, scholarshipType, educationLevel, location, bannerBgUrl, contactEmail, primaryPhone, secondaryPhone, websiteUrl, coverageArea, officeAddress, mapUrl, scholarshipSectionTitle, scholarshipSubtitle, scholarshipDescription, eligibilitySectionTitle, eligibilitySubtitle]);

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
    // Validate dates
    const dateValidation = validateDates();
    if (!dateValidation.isValidDate) {
      setError("Please fix the date errors.");
      if (dateValidation.field) {
        scrollToField(dateValidation.field);
      }
      return;
    }

    if (!validateScholarship()) {
      setError("Please fix the errors below.");
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
      funding_type_other: fundingTypeOther || undefined,
      scholarship_type_other: scholarshipTypeOther || undefined,
      education_level: educationLevel || undefined,
      education_level_other: educationLevelOther || undefined,
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
      scholarship_description_2: undefined,
      timeline: timelineEvents,
      scholarship_types: scholarshipTypes,
      scholarship_types_new: scholarshipTypes,
      selection_rubric: selectionRubric.map((item) => ({
        criteria: item.criteria,
        description: item.description,
        weight: item.weight,
        marks: "",
        pass_mark: "",
      })),
      selection_rubric_new: selectionRubric,
      eligibility_section_title: eligibilitySectionTitle || undefined,
      eligibility_subtitle: eligibilitySubtitle || undefined,
      basic_eligibility_criteria: basicRequirements,
      fully_funded_criteria: fullyFundedConditions,
      partially_funded_criteria: partiallyFundedConditions,
      selection_process_steps: selectionProcessSteps,
      required_documents: requiredDocuments,
      faqs: faqs,
      faqs_new: faqs,
      gallery_images: galleryImages,
      gallery_images_new: galleryImages,
      partner_groups: partnerGroups as unknown as any,
      exam_centers: examCenters as unknown as any,
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

    const mode = draft ? "draft" : "published";
    try {
      if (isEditing && scholarshipId) {
        await scholarshipProviderApi.updateScholarship(scholarshipId, payload);
      } else {
        await scholarshipProviderApi.createScholarship(payload);
      }
      if (mode === "draft") {
        toast.success(isEditing ? "Your scholarship draft has been updated." : "Your scholarship has been saved as a draft.");
      } else {
        toast.success(isEditing ? "Your scholarship has been updated successfully." : "Your scholarship has been created successfully.");
        if (!isEditing) {
          setTimeout(() => toast.success("Your scholarship is now live and visible in the directory."), 500);
        }
      }
      if (onNavigate) {
        const nextSection = mode === "draft" ? "sec-draft-scholarship" : "sec-scholarship-directory";
        setTimeout(() => onNavigate(nextSection), 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save scholarship");
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
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
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
        mainTitleError={mainTitleError}
        providerNameError={providerNameError}
        fundingTypeError={fundingTypeError}
        scholarshipTypeError={scholarshipTypeError}
        educationLevelError={educationLevelError}
        locationError={locationError}
        bannerError={bannerError}
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
        coverageAreaError={coverageAreaError}
        officeAddressError={officeAddressError}
        mapUrl={mapUrl}
        setMapUrl={setMapUrl}
        mapUrlError={mapUrlError}
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
        sectionTitleError={schSectionTitleError}
        subtitleError={schSubtitleError}
        descriptionError={schDescriptionError}
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
        sectionTitleError={eligSectionTitleError}
        subtitleError={eligSubtitleError}
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
