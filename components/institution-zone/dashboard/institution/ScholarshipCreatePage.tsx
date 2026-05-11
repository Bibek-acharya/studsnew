"use client";

import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { parseISO, isValid, isAfter } from "date-fns";
import {
  Gear, FloppyDisk, PaperPlaneTilt, ArrowLeft
} from "@phosphor-icons/react";
import { institutionScholarshipApi } from "../../../../services/institutionScholarshipApi";
import { validateScholarshipData, validateDates, type ScholarshipFormData } from "@/lib/scholarship-validation";
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
  PartnerMessagesSection,
  ExamCentersSection,
  DownloadsSection,
  PaymentConfigSection,
  type GalleryGroup,
  type GalleryEntry,
  type PartnerGroup,
  type PartnerMessageItem,
} from "@/components/ScholarshipProvider/create-scholarship";
import { useRouter } from "next/navigation";

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

interface ScholarshipCreatePageProps {
  onBack?: () => void;
  scholarshipId?: number | null;
}

const ScholarshipCreatePage: React.FC<ScholarshipCreatePageProps> = ({ onBack, scholarshipId }) => {
  const router = useRouter();

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
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
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
  const [timelineEvents, setTimelineEvents] = useState<{ title: string; date: string; description: string; icon: string }[]>([]);

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
  const [galleryGroups, setGalleryGroups] = useState<GalleryGroup[]>([]);

  // Partners
  const [partnerGroups, setPartnerGroups] = useState<PartnerGroup[]>([]);

  // Partner Messages
  const [partnerMessages, setPartnerMessages] = useState<PartnerMessageItem[]>([]);

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

  const isEditing = Boolean(scholarshipId);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/institution-zone/dashboard/scholarship");
    }
  };

  // Banner file handler
  const handleBannerFileSelect = async (file: File) => {
    try {
      const url = await institutionScholarshipApi.uploadImage(file, "scholarships");
      setBannerBgUrl(url);
      setBannerBgPreview(url);
    } catch (err) {
      toast.error("Failed to upload banner image");
      console.error(err);
    }
  };

  const handleBannerClear = () => {
    setBannerBgUrl("");
    setBannerBgPreview("");
    setBannerError("");
  };

  // QR Code file handler
  const handleQrCodeFileSelect = async (file: File) => {
    try {
      const url = await institutionScholarshipApi.uploadImage(file, "payments");
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
    institutionScholarshipApi.getScholarshipById(scholarshipId).then((s: any) => {
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
      setExamDate((s as any).exam_date || "");
      setExamTime((s as any).exam_time || "");
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
      const rawImages: any[] = s.gallery_images_new || (s.gallery_images || []).map((img: any) => ({
        title: img.title || "", url: img.url || img || "", folder: img.folder || "",
      }));
      if (rawImages.length > 0 && rawImages[0].images) {
        setGalleryGroups(rawImages as GalleryGroup[]);
      } else {
        const map = new Map<string, { title: string; url: string }[]>();
        for (const img of rawImages) {
          const key = img.folder || "Gallery";
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push({ title: img.title || "", url: img.url || "" });
        }
        setGalleryGroups(Array.from(map.entries()).map(([folder, images]) => ({ folder, images })));
      }

      // Partners
      const rawGroups: any[] = (s as any).partner_groups || [];
      if (rawGroups.length > 0 && rawGroups[0].partners) {
        setPartnerGroups(rawGroups as PartnerGroup[]);
      } else {
        const map = new Map<string, { name: string; website: string; logo: string }[]>();
        for (const item of rawGroups) {
          const key = item.groupHeading || "Partners";
          if (!item.name) continue;
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push({ name: item.name || "", website: item.website || "", logo: item.logo || "" });
        }
        setPartnerGroups(Array.from(map.entries()).map(([groupHeading, partners]) => ({ groupHeading, partners })));
      }

      // Partner Messages
      setPartnerMessages(((s as any).partner_messages || []) as PartnerMessageItem[]);

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

  const validateFormDates = useCallback(() => {
    setStartDateError("");
    setEndDateError("");

    const result = validateDates(startDate, endDate);
    let firstField = "";

    for (const err of result.errors) {
      if (err.field === "startDate") {
        setStartDateError(err.message);
        firstField ||= "startDate";
      } else if (err.field === "endDate") {
        setEndDateError(err.message);
        firstField ||= "endDate";
      }
    }

    return { isValidDate: result.isValid, field: firstField };
  }, [startDate, endDate]);

  const validateScholarship = useCallback(() => {
    let hasError = false;
    let firstFieldId: string | null = null;

    const setFirstError = (fieldId: string) => {
      if (!firstFieldId) firstFieldId = fieldId;
    };

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

    const data: ScholarshipFormData = {
      mainTitle, providerName, fundingType, scholarshipType, educationLevel,
      location, bannerBgUrl, startDate, endDate, contactEmail, primaryPhone,
      secondaryPhone, websiteUrl, coverageArea, officeAddress, mapUrl,
      scholarshipSectionTitle, scholarshipSubtitle, scholarshipDescription,
      eligibilitySectionTitle, eligibilitySubtitle,
    };

    const result = validateScholarshipData(data);

    for (const err of result.errors) {
      hasError = true;
      setFirstError(err.field);
      switch (err.field) {
        case "mainTitle": setMainTitleError(err.message); break;
        case "providerName": setProviderNameError(err.message); break;
        case "fundingType": setFundingTypeError(err.message); break;
        case "scholarshipType": setScholarshipTypeError(err.message); break;
        case "educationLevel": setEducationLevelError(err.message); break;
        case "location": setLocationError(err.message); break;
        case "bannerBgUrl": setBannerError(err.message); break;
        case "contactEmail": setContactEmailError(err.message); break;
        case "primaryPhone": setPrimaryPhoneError(err.message); break;
        case "secondaryPhone": setSecondaryPhoneError(err.message); break;
        case "websiteUrl": setWebsiteUrlError(err.message); break;
        case "coverageArea": setCoverageAreaError(err.message); break;
        case "officeAddress": setOfficeAddressError(err.message); break;
        case "mapUrl": setMapUrlError(err.message); break;
        case "scholarshipSectionTitle": setSchSectionTitleError(err.message); break;
        case "scholarshipSubtitle": setSchSubtitleError(err.message); break;
        case "scholarshipDescription": setSchDescriptionError(err.message); break;
        case "eligibilitySectionTitle": setEligSectionTitleError(err.message); break;
        case "eligibilitySubtitle": setEligSubtitleError(err.message); break;
      }
    }

    return { isValid: !hasError, firstFieldId };
  }, [mainTitle, providerName, fundingType, scholarshipType, educationLevel, location, bannerBgUrl, startDate, endDate, contactEmail, primaryPhone, secondaryPhone, websiteUrl, coverageArea, officeAddress, mapUrl, scholarshipSectionTitle, scholarshipSubtitle, scholarshipDescription, eligibilitySectionTitle, eligibilitySubtitle]);

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
    setError("");

    if (!draft) {
      const validation = validateScholarship();
      if (!validation.isValid) {
        if (validation.firstFieldId) {
          scrollToField(validation.firstFieldId);
        }
        setTimeout(() => {
          const firstErrorElement = document.querySelector('.border-red-500');
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 0);
        return;
      }

      const dateValidation = validateFormDates();
      if (!dateValidation.isValidDate) {
        if (dateValidation.field) {
          scrollToField(dateValidation.field);
        }
        return;
      }
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
      exam_date: examDate || undefined,
      exam_time: examTime || undefined,
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
      gallery_images: galleryGroups.flatMap(g => g.images.map(img => ({ folder: g.folder, title: img.title, url: img.url }))),
      gallery_images_new: galleryGroups.flatMap(g => g.images.map(img => ({ folder: g.folder, title: img.title, url: img.url }))),
      partner_groups: partnerGroups,
      partner_messages: partnerMessages,
      exam_centers: examCenters,
      exam_centers_new: examCenters,
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
        await institutionScholarshipApi.updateScholarship(scholarshipId, payload);
      } else {
        await institutionScholarshipApi.createScholarship(payload);
      }
      if (draft) {
        toast.success(isEditing ? "Your scholarship draft has been updated." : "Your scholarship has been saved as a draft.");
      } else {
        toast.success(isEditing ? "Your scholarship has been updated successfully." : "Your scholarship has been created successfully.");
        if (!isEditing) {
          setTimeout(() => toast.success("Your scholarship is now live and visible in the directory."), 500);
        }
      }
      setTimeout(() => handleBack(), 1500);
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
    requiredDocuments, faqs, galleryGroups, partnerGroups, partnerMessages, examCenters, downloads, scholarshipId,
    isEditing, enablePayment, enableBank, bankDetails, qrCodeUrl, timelineEvents, paymentFeeAmount,
    examDate, examTime]);

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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Scholarship" : "Create Scholarship"}
          </h1>
        </div>
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
        examDate={examDate}
        setExamDate={setExamDate}
        examTime={examTime}
        setExamTime={setExamTime}
        startDateError={startDateError}
        endDateError={endDateError}
        applyLink={applyLink}
        setApplyLink={setApplyLink}
        bannerBgUrl={bannerBgUrl}
        bannerBgPreview={bannerBgPreview}
        onBannerSelect={handleBannerFileSelect}
        onBannerClear={handleBannerClear}
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
        groups={galleryGroups}
        setGroups={setGalleryGroups}
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

      {/* Partner Messages */}
      <PartnerMessagesSection
        messages={partnerMessages}
        setMessages={setPartnerMessages}
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
};

export default ScholarshipCreatePage;
