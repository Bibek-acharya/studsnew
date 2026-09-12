"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { parseISO, isValid, isAfter } from "date-fns";
import {
  Gear, FloppyDisk, PaperPlaneTilt
} from "@phosphor-icons/react";
import { scholarshipEducationApi } from "@/services/scholarship-education.api";
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
  ExamCentersSection,
  PaymentConfigSection,
  type ExamCenterItem,
} from "@/components/ScholarshipProvider/create-scholarship";
import { GallerySection, type GalleryGroup } from "./create-scholarship/gallery-section";
import { PartnersSection, type PartnerGroup } from "./create-scholarship/partners-section";
import { PartnerMessagesSection, type PartnerMessageItem } from "./create-scholarship/partner-messages-section";
import { DownloadsSection, type DownloadItem } from "./create-scholarship/downloads-section";
import { FinancialCard } from "./create-scholarship/financial-card";

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

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
}

interface CreateScholarshipSectionProps {
  setActiveSection: (s: string) => void;
  scholarshipId?: number | null;
}

// Admin detail dates arrive as "Jan 02, 2006" (or ISO); date inputs need YYYY-MM-DD.
const toInputDate = (v: unknown): string => {
  if (!v || typeof v !== "string") return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const toStringList = (v: unknown): string[] => {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      for (const k of ["title", "label", "name", "value", "text"]) {
        if (typeof o[k] === "string" && (o[k] as string).trim()) return o[k] as string;
      }
    }
    return "";
  }).filter(Boolean);
};

export default function CreateScholarshipSection({
  setActiveSection,
  scholarshipId,
}: CreateScholarshipSectionProps) {
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

  // Financial
  const [totalValue, setTotalValue] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);

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
  const submittingRef = useRef(false);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(() => Boolean(scholarshipId));

  const isEditing = Boolean(scholarshipId);

  // Banner file handler
  const handleBannerFileSelect = async (file: File) => {
    try {
      const url = await scholarshipEducationApi.uploadScholarshipFile(file, "scholarships");
      setBannerBgUrl(url);
      setBannerBgPreview(url);
      setBannerError("");
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
      const url = await scholarshipEducationApi.uploadScholarshipFile(file, "payments");
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
      return;
    }
    scholarshipEducationApi.getAdminScholarshipById(scholarshipId).then((s) => {
      // General Settings
      setMainTitle(s.title || "");
      setProviderName(s.provider_name || s.provider || "");
      setFundingType(s.funding_type || "");
      setFundingTypeOther(s.funding_type_other || "");
      setScholarshipType(s.scholarship_type || "");
      setScholarshipTypeOther(s.scholarship_type_other || "");
      setEducationLevel(s.education_level || s.degree_level || "");
      setEducationLevelOther(s.education_level_other || "");
      setLocation(s.location || "");
      setStartDate(toInputDate(s.application_start_date));
      setEndDate(toInputDate(s.deadline || s.application_end_date));
      setExamDate(s.exam_date || "");
      setExamTime(s.exam_time || "");
      setApplyLink(s.apply_link || "");
      setBannerBgUrl(s.banner_background_image_url || s.image_url || "");
      setBannerBgPreview(s.banner_background_image_url || s.image_url || "");

      // Financial
      setTotalValue(s.value || "");
      setTotalSeats(s.total_seats ? String(s.total_seats) : "");
      setFieldOfStudy(Array.isArray(s.field_of_study) ? s.field_of_study.join(", ") : (s.field_of_study || ""));
      setBenefits(toStringList(s.benefits));

      // Contact Details
      setCoverageArea(s.coverage_area || "");
      setContactEmail(s.contact_email || "");
      setPrimaryPhone(s.primary_phone || "");
      setSecondaryPhone(s.secondary_phone || "");
      setWebsiteUrl(s.website_url || "");
      setOfficeAddress(s.office_address || "");
      setMapUrl(s.map_url || "");

      // About
      setAboutOverview(s.about_paragraph_1 || s.description || "");

      // Video Tutorials
      setVideoTutorials(Array.isArray(s.video_tutorials) ? s.video_tutorials : []);

      // Journey Timeline
      setJourneyTimeline(Array.isArray(s.journey_timeline) ? s.journey_timeline : []);

      // Scholarship Details
      setScholarshipSectionTitle(s.scholarship_section_title || "");
      setScholarshipSubtitle(s.scholarship_subtitle || "");
      setScholarshipDescription(s.scholarship_description_1 || s.description || "");
      setScholarshipTypes(
        (s.scholarship_types_new as ScholarshipTypeItem[]) ||
        (Array.isArray(s.scholarship_types) ? s.scholarship_types.map((t: any) => ({ type: t.type || "", seats: t.seats || "", coverage: t.coverage || "", eligibility: t.eligibility || "" })) : []) as ScholarshipTypeItem[]
      );
      setTimelineEvents(Array.isArray(s.timeline) ? s.timeline : []);
      setSelectionRubric(Array.isArray(s.selection_rubric_new) ? s.selection_rubric_new : []);

      // Eligibility
      setEligibilitySectionTitle(s.eligibility_section_title || "");
      setEligibilitySubtitle(s.eligibility_subtitle || "");
      setBasicRequirements(toStringList(s.basic_eligibility_criteria));
      setFullyFundedConditions(toStringList(s.fully_funded_criteria));
      setPartiallyFundedConditions(toStringList(s.partially_funded_criteria));
      setSelectionProcessSteps(Array.isArray(s.selection_process_steps) ? s.selection_process_steps : []);
      setRequiredDocuments(toStringList(s.required_documents));

      // FAQ
      setFaqs(
        (Array.isArray(s.faqs_new) && s.faqs_new.length > 0 ? s.faqs_new : (s.faqs || []).map((f: any) => ({ question: f.question || "", answer: f.answer || "" }))) as FAQItem[]
      );

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
      const rawGroups: any[] = s.partner_groups || [];
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
      setPartnerMessages((Array.isArray(s.partner_messages) ? s.partner_messages : []) as PartnerMessageItem[]);

      // Exam Centers
      setExamCenters((s.exam_centers_new as unknown as ExamCenterItem[]) || []);

      // Downloads
      setDownloads(Array.isArray(s.downloads) ? s.downloads : []);

      // Payment Config
      const paymentConfig = s.payment_config;
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
    if (submittingRef.current) return;
    submittingRef.current = true;

    // Clear the main error before running validation
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
        submittingRef.current = false;
        return;
      }

      const dateValidation = validateFormDates();
      if (!dateValidation.isValidDate) {
        if (dateValidation.field) {
          scrollToField(dateValidation.field);
        }
        submittingRef.current = false;
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
      value: totalValue,
      total_seats: totalSeats ? parseInt(totalSeats, 10) : 0,
      field_of_study: fieldOfStudy.split(",").map((f) => f.trim()).filter(Boolean),
      benefits,
      deadline: endDate ? new Date(endDate).toISOString() : "",
      degree_level: finalEducationLevel,
      funding_type: finalFundingType,
      scholarship_type: finalScholarshipType,
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
      gallery_images: galleryGroups.flatMap(g => g.images.map(img => ({ folder: g.folder, title: img.title, url: img.url }))) as unknown as any,
      gallery_images_new: galleryGroups.flatMap(g => g.images.map(img => ({ folder: g.folder, title: img.title, url: img.url }))) as unknown as any,
      partner_groups: partnerGroups as unknown as any,
      partner_messages: partnerMessages as unknown as any,
      exam_centers: examCenters as unknown as any,
      exam_centers_new: examCenters as unknown as any,
      downloads: downloads.map((d) => ({ title: d.title, description: d.description, url: d.url })),
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
        await scholarshipEducationApi.updateAdminScholarship(scholarshipId, payload);
      } else {
        await scholarshipEducationApi.createAdminScholarship(payload);
      }
      if (mode === "draft") {
        toast.success(isEditing ? "Scholarship draft updated." : "Scholarship saved as draft.");
      } else {
        toast.success(isEditing ? "Scholarship updated successfully." : "Scholarship created successfully.");
      }
      setTimeout(() => setActiveSection("manage-scholarship"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save scholarship");
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  }, [mainTitle, providerName, fundingType, fundingTypeOther, scholarshipType, scholarshipTypeOther,
      educationLevel, educationLevelOther, location, startDate, endDate, applyLink, bannerBgUrl,
      totalValue, totalSeats, fieldOfStudy, benefits,
      coverageArea, contactEmail, primaryPhone, secondaryPhone, websiteUrl, officeAddress, mapUrl,
      aboutOverview, videoTutorials, journeyTimeline, scholarshipSectionTitle, scholarshipSubtitle,
      scholarshipDescription, scholarshipTypes, selectionRubric, eligibilitySectionTitle, eligibilitySubtitle,
      basicRequirements, fullyFundedConditions, partiallyFundedConditions, selectionProcessSteps,
    requiredDocuments, faqs, galleryGroups, partnerGroups, partnerMessages, examCenters, downloads, scholarshipId,
    isEditing, setActiveSection, enablePayment, enableBank, bankDetails, qrCodeUrl, timelineEvents, paymentFeeAmount,
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
        setMainTitle={(v) => { setMainTitle(v); setMainTitleError(""); }}
        providerName={providerName}
        setProviderName={(v) => { setProviderName(v); setProviderNameError(""); }}
        fundingType={fundingType}
        setFundingType={(v) => { setFundingType(v); setFundingTypeError(""); }}
        fundingTypeOther={fundingTypeOther}
        setFundingTypeOther={(v) => { setFundingTypeOther(v); fundingTypeError && setFundingTypeError(""); }}
        scholarshipType={scholarshipType}
        setScholarshipType={(v) => { setScholarshipType(v); setScholarshipTypeError(""); }}
        scholarshipTypeOther={scholarshipTypeOther}
        setScholarshipTypeOther={(v) => { setScholarshipTypeOther(v); scholarshipTypeError && setScholarshipTypeError(""); }}
        educationLevel={educationLevel}
        setEducationLevel={(v) => { setEducationLevel(v); setEducationLevelError(""); }}
        educationLevelOther={educationLevelOther}
        setEducationLevelOther={(v) => { setEducationLevelOther(v); educationLevelError && setEducationLevelError(""); }}
        location={location}
        setLocation={(v) => { setLocation(v); setLocationError(""); }}
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

      {/* Financial Details */}
      <FinancialCard
        totalValue={totalValue}
        setTotalValue={setTotalValue}
        totalSeats={totalSeats}
        setTotalSeats={setTotalSeats}
        fieldOfStudy={fieldOfStudy}
        setFieldOfStudy={setFieldOfStudy}
        benefits={benefits}
        setBenefits={setBenefits}
      />

      {/* Contact Details */}
      <ContactDetailsSection
        coverageArea={coverageArea}
        setCoverageArea={(v) => { setCoverageArea(v); setCoverageAreaError(""); }}
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
        setOfficeAddress={(v) => { setOfficeAddress(v); setOfficeAddressError(""); }}
        coverageAreaError={coverageAreaError}
        officeAddressError={officeAddressError}
        mapUrl={mapUrl}
        setMapUrl={setMapUrl}
        mapUrlError={mapUrlError}
        setMapUrlError={setMapUrlError}
      />

      {/* About Section */}
      <AboutSection
        aboutOverview={aboutOverview}
        setAboutOverview={setAboutOverview}
      />

      {/* Journey Timeline */}
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
        setSectionTitle={(v) => { setScholarshipSectionTitle(v); setSchSectionTitleError(""); }}
        subtitle={scholarshipSubtitle}
        setSubtitle={(v) => { setScholarshipSubtitle(v); setSchSubtitleError(""); }}
        description={scholarshipDescription}
        setDescription={(v) => { setScholarshipDescription(v); setSchDescriptionError(""); }}
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
        setSectionTitle={(v) => { setEligibilitySectionTitle(v); setEligSectionTitleError(""); }}
        subtitle={eligibilitySubtitle}
        setSubtitle={(v) => { setEligibilitySubtitle(v); setEligSubtitleError(""); }}
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
}
