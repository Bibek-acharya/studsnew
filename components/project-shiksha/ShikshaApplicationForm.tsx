"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import NepaliCalendar from "./NepaliCalendar";
import { ProjectShikshaFormData, schoolTypes, occupations, streams, examCenters, ethnicities } from "./types";
import { validateForm } from "./validation";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS, NEPAL_LOCAL_BODIES } from "@/lib/location-data";
import { apiService } from "@/services/api";
import PartnerLogosCard from "@/components/scholarship-apply/PartnerLogosCard";
import AlertDialog from "@/components/ui/AlertDialog";

function SelectArrow({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={`${className} appearance-none pr-10`}>
        {children}
      </select>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

const initialFormData: ProjectShikshaFormData = {
  fullName: "",
  gender: "",
  ethnicity: "",
  ethnicityOther: "",
  dobBS: "",
  dobAD: "",
  age: "",
  phone: "",
  email: "",

  seeSchoolType: "",
  schoolName: "",
  seeGpa: "",
  schoolProvince: "",
  schoolDistrict: "",
  schoolMunicipality: "",
  schoolTole: "",

  permProvince: "",
  permDistrict: "",
  permMunicipality: "",
  permWard: "",
  permTole: "",
  tempProvince: "",
  tempDistrict: "",
  tempMunicipality: "",
  tempWard: "",
  tempTole: "",

  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  fatherOccupation: "",
  fatherOccupationOther: "",
  motherOccupation: "",
  motherOccupationOther: "",
  familyIncome: "",
  familyMembers: "",

  birthCertificate: null,
  seeMarksheet: null,
  class8Marksheet: null,
  class9Marksheet: null,
  photo: null,

  stream: "",
  examCenter: "",

  declaration: false,
};

interface PartnerLogo {
  name: string;
  logo: string;
}

export default function ShikshaApplicationForm({
  scholarshipTitle,
  scholarshipId,
  scholarshipSlug,
  examCenters: dynamicExamCenters,
  paymentConfig,
  partnerLogos,
}: {
  scholarshipTitle?: string;
  scholarshipId?: number;
  scholarshipSlug?: string;
  examCenters?: string[];
  paymentConfig?: {
    enabled: boolean;
    fee_amount: number;
    methods: string[];
    qr_code: string;
    bank_details: {
      branch: string;
      bank_name: string;
      account_name: string;
      account_number: string;
    };
  };
  partnerLogos?: PartnerLogo[];
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectShikshaFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectShikshaFormData, string>>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleInputChange = useCallback((field: keyof ProjectShikshaFormData, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const DOCUMENT_FIELDS = new Set(["birthCertificate", "seeMarksheet", "class8Marksheet", "class9Marksheet", "photo"]);

  const handleBlur = useCallback((e: React.FocusEvent) => {
    const target = e.target as HTMLElement;
    const field = target.id as keyof ProjectShikshaFormData;
    if (!field || !(field in initialFormData) || DOCUMENT_FIELDS.has(field)) return;
    const result = validateForm(formData);
    if (result.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: result.errors[field] }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [formData]);

  const handleDobBsChange = useCallback((bsDate: string, adDate: string, age: string) => {
    setFormData((prev) => ({ ...prev, dobBS: bsDate, dobAD: adDate, age }));
    if (errors.dobBS) {
      setErrors((prev) => ({ ...prev, dobBS: undefined }));
    }
    if (parseInt(age) < 14) {
      setErrors((prev) => ({ ...prev, dobBS: "You must be at least 14 years old to apply" }));
    } else {
      setErrors((prev) => ({ ...prev, dobBS: undefined }));
    }
  }, [errors.dobBS]);

  const handleFileChange = useCallback((field: "birthCertificate" | "seeMarksheet" | "class8Marksheet" | "class9Marksheet" | "photo", file: File | null) => {
    handleInputChange(field, file);
    if (field === "photo" && file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [handleInputChange]);

  useEffect(() => {
    if (sameAsPermanent) {
      setFormData((prev) => ({
        ...prev,
        tempProvince: prev.permProvince,
        tempDistrict: prev.permDistrict,
        tempMunicipality: prev.permMunicipality,
        tempWard: prev.permWard,
        tempTole: prev.permTole,
      }));
    }
  }, [sameAsPermanent, formData.permProvince, formData.permDistrict, formData.permMunicipality, formData.permWard, formData.permTole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      const firstErrorField = Object.keys(validation.errors)[0];
      const element = document.getElementById(firstErrorField);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!scholarshipId) {
        setErrors({ fullName: "Scholarship ID is missing." });
        setIsSubmitting(false);
        return;
      }

      // Step 1: Upload Photo
      let photo_url = "";
      if (formData.photo) {
        try {
          photo_url = await apiService.uploadScholarshipFile(formData.photo, "photos");
        } catch (uploadError) {
          console.error("Photo upload error:", uploadError);
        }
      }

      // Step 2: Upload Documents
      const documents: any[] = [];
      const documentFields = [
        { key: "birthCertificate" as const, title: "Birth Certificate" },
        { key: "seeMarksheet" as const, title: "SEE Marksheet" },
        { key: "class8Marksheet" as const, title: "Class 8 Marksheet" },
        { key: "class9Marksheet" as const, title: "Class 9 Marksheet" },
      ];

      for (const docField of documentFields) {
        const file = formData[docField.key as keyof typeof formData];
        if (file instanceof File) {
          try {
            const url = await apiService.uploadScholarshipFile(file, "documents");
            documents.push({
              name: docField.title,
              url: url,
            });
          } catch (uploadError) {
            console.error(`${docField.title} upload error:`, uploadError);
          }
        }
      }

      const payload = {
        full_name: formData.fullName,
        gender: formData.gender,
        ethnicity: formData.ethnicity,
        ethnicity_other: formData.ethnicity === "Other" ? formData.ethnicityOther : "",
        date_of_birth_bs: formData.dobBS || "",
        date_of_birth_ad: formData.dobAD || "",
        age: parseInt(formData.age) || 0,
        phone_number: formData.phone || "",
        email: formData.email || "",
        photo_url: photo_url,

        see_gpa: formData.seeGpa || "",
        school_type: formData.seeSchoolType,
        school_name: formData.schoolName || "",
        school_province: formData.schoolProvince || formData.permProvince,
        school_district: formData.schoolDistrict || formData.permDistrict,
        school_municipality: formData.schoolMunicipality || formData.permMunicipality,
        school_tole: formData.schoolTole || formData.permTole,

        permanent_province: formData.permProvince,
        permanent_district: formData.permDistrict,
        permanent_municipality: formData.permMunicipality,
        permanent_ward: formData.permWard,
        permanent_tole: formData.permTole,

        temporary_province: formData.tempProvince,
        temporary_district: formData.tempDistrict,
        temporary_municipality: formData.tempMunicipality,
        temporary_ward: formData.tempWard,
        temporary_tole: formData.tempTole,

        guardian_name: formData.guardianName,
        guardian_phone: formData.guardianPhone,
        guardian_email: formData.guardianEmail || "",
        father_occupation: formData.fatherOccupation,
        father_occupation_other: formData.fatherOccupation === "Other" ? formData.fatherOccupationOther : "",
        mother_occupation: formData.motherOccupation,
        mother_occupation_other: formData.motherOccupation === "Other" ? formData.motherOccupationOther : "",
        family_monthly_income: parseFloat(formData.familyIncome) || 0,
        family_members_count: parseInt(formData.familyMembers) || 0,

        stream: formData.stream,
        exam_center: formData.examCenter,
        documents: documents,
        requires_payment: paymentConfig?.enabled && paymentConfig.fee_amount > 0,
      };
      const response = await apiService.applyScholarship(scholarshipId, payload);
      const applicationId = response.data?.id || response.id;

      const appData = {
        ...formData,
        photo_url,
        applicationId,
        photoPreview,
        scholarshipId,
        paymentConfig,
      };
      sessionStorage.setItem("shiksha_application_data", JSON.stringify(appData));
      sessionStorage.setItem("scholarship_application_data", JSON.stringify(appData));

      // Check if payment is active
      if (paymentConfig?.enabled && paymentConfig.fee_amount > 0) {
        router.push(`/scholarship-pay/${scholarshipSlug || scholarshipId}`);
      } else {
        router.push("/scholarship-apply/project-shiksha/success");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ fullName: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableDistricts = (province: string) => {
    if (!province) return [];
    return NEPAL_DISTRICTS[province as keyof typeof NEPAL_DISTRICTS] || [];
  };

  const getAvailableMunicipalities = (district: string) => {
    if (!district) return [];
    return NEPAL_LOCAL_BODIES[district as keyof typeof NEPAL_LOCAL_BODIES] || [];
  };

  const getAvailableWards = (district: string, municipality: string) => {
    if (!district || !municipality) return [];
    const localBody = NEPAL_LOCAL_BODIES[district as keyof typeof NEPAL_LOCAL_BODIES]?.find(
      (lb) => lb.name === municipality
    );
    return localBody ? Array.from({ length: localBody.wards }, (_, i) => i + 1) : [];
  };

  const permDistricts = getAvailableDistricts(formData.permProvince);
  const permMunicipalities = getAvailableMunicipalities(formData.permDistrict);
  const permWards = getAvailableWards(formData.permDistrict, formData.permMunicipality);

  const tempDistricts = getAvailableDistricts(formData.tempProvince);
  const tempMunicipalities = getAvailableMunicipalities(formData.tempDistrict);
  const tempWards = getAvailableWards(formData.tempDistrict, formData.tempMunicipality);

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 pb-20 px-4 sm:px-6" style={{ backgroundColor: "#08bd80" }}>
      <header className="w-full max-w-350 mb-8 text-left px-4 sm:px-0">
        <h1 className="text-[32px] sm:text-[40px] font-extrabold text-white mb-2 leading-tight drop-shadow-sm">
          {scholarshipTitle || "Project Shiksha Entrance 2082"}
        </h1>
        <p className="text-[18px] text-white/90 font-medium">Empowering Education, Shaping Futures.</p>
      </header>

      <div className="w-full max-w-350 flex flex-col lg:flex-row gap-6 items-start">
        <main className="w-full bg-white rounded-2xl overflow-hidden relative order-2 lg:order-1">
          <div className="bg-[#f0fdf4] border-b border-[#bbf7d0] py-3.5 px-6 flex justify-center items-center gap-3 text-[14px] text-[#166534]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Your data is secure and will be used for admission purposes only.</span>
          </div>

          <form onSubmit={handleSubmit} noValidate onBlurCapture={handleBlur} className="px-6 sm:px-12 py-8">
          {/* Section 1: Personal Details */}
          <section className="mb-12">
            <div className="mb-6 pb-3">
              <h2 className="text-[20px] font-bold text-[#1e293b]">Personal Details</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 order-2 md:order-1">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Student&apos;s Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                    placeholder="E.g. Ram Bahadur Thapa"
                  />
                  {errors.fullName && <p className="text-red-500 text-[12px] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <SelectArrow
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </SelectArrow>
                  {errors.gender && <p className="text-red-500 text-[12px] mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Ethnicity <span className="text-red-500">*</span>
                  </label>
                  <SelectArrow
                    id="ethnicity"
                    value={formData.ethnicity}
                    onChange={(e) => handleInputChange("ethnicity", e.target.value)}
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer"
                  >
                    <option value="" disabled>Select Ethnicity</option>
                    {ethnicities.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </SelectArrow>
                  {formData.ethnicity === "Other" && (
                    <input
                      type="text"
                      id="ethnicityOther"
                      value={formData.ethnicityOther}
                      onChange={(e) => handleInputChange("ethnicityOther", e.target.value)}
                      className="mt-2 w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                      placeholder="Please specify ethnicity"
                    />
                  )}
                  {errors.ethnicity && <p className="text-red-500 text-[12px] mt-1">{errors.ethnicity}</p>}
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Date of Birth (BS) <span className="text-red-500">*</span>
                  </label>
                  <NepaliCalendar
                    value={formData.dobBS}
                    onChange={handleDobBsChange}
                    error={errors.dobBS}
                    minAge={14}
                    showIcon={false}
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Date of Birth (AD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="dobAD"
                  value={formData.dobAD}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none cursor-not-allowed"
                    placeholder="Auto-calculated"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Age</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="age"
                      value={formData.age}
                      readOnly
                      className="w-full bg-gray-100 border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-600 outline-none cursor-not-allowed font-medium"
                      placeholder="Auto-calc"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Phone Number (Ncell Preferred) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                      if (val.length > 0 && val[0] !== "9") return;
                      handleInputChange("phone", val);
                    }}
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                  {errors.phone && <p className="text-red-500 text-[12px] mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                    placeholder="student@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="w-full md:w-40 flex-shrink-0 order-1 md:order-2 flex flex-col items-center md:items-start">
                <label className="block text-[14px] font-semibold text-gray-700 mb-2 w-full text-center md:text-left">
                  Passport Photo <span className="text-red-500">*</span>
                </label>
                <div
                  className="relative w-32 h-32 sm:w-32 sm:h-36 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
                  onClick={() => document.getElementById("photo")?.click()}
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover z-10"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-500 transition-colors text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                      <span className="text-[12px] font-semibold">Upload Photo</span>
                      <span className="text-[10px] text-gray-500 mt-1">PP Size (Max 2MB)</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        setAlertMessage("File is too large. Please upload an image smaller than 2MB.");
                        e.target.value = "";
                        return;
                      }
                      const img = new Image();
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        img.onload = () => {
                          const ratio = img.width / img.height;
                          if (ratio < 0.95 || ratio > 1.05) {
                            setAlertMessage("Photo must be 1:1 (square) aspect ratio.");
                            e.target.value = "";
                            return;
                          }
                          handleFileChange("photo", file);
                        };
                        img.src = ev.target?.result as string;
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {errors.photo && <p className="text-red-500 text-[12px] mt-1">{errors.photo}</p>}
              </div>
            </div>
          </section>

          {/* Section 2: Education Details */}
          <section className="mb-12">
            <div className="mb-6 pb-3">
              <h2 className="text-[20px] font-bold text-[#1e293b]">Education Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  School Type <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="seeSchoolType"
                  value={formData.seeSchoolType}
                  onChange={(e) => handleInputChange("seeSchoolType", e.target.value)}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer"
                >
                  <option value="" disabled>Select School Type</option>
                  {schoolTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </SelectArrow>
                {errors.seeSchoolType && <p className="text-red-500 text-[12px] mt-1">{errors.seeSchoolType}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="schoolName"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange("schoolName", e.target.value)}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                  placeholder="School you graduated from"
                />
                {errors.schoolName && <p className="text-red-500 text-[12px] mt-1">{errors.schoolName}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  SEE Secured GPA <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="seeGpa"
                  value={formData.seeGpa}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9.]/g, "").slice(0, 4);
                    if (raw && raw !== "." && parseFloat(raw) > 4.0) return;
                    handleInputChange("seeGpa", raw);
                  }}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                  placeholder="E.g. 3.85"
                />
                {errors.seeGpa && <p className="text-red-500 text-[12px] mt-1">{errors.seeGpa}</p>}
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  School Province <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="schoolProvince"
                  value={formData.schoolProvince}
                  onChange={(e) => {
                    handleInputChange("schoolProvince", e.target.value);
                    handleInputChange("schoolDistrict", "");
                    handleInputChange("schoolMunicipality", "");
                  }}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer"
                >
                  <option value="" disabled>Select Province</option>
                  {NEPAL_PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </SelectArrow>
                {errors.schoolProvince && <p className="text-red-500 text-[12px] mt-1">{errors.schoolProvince}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  School District <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="schoolDistrict"
                  value={formData.schoolDistrict}
                  onChange={(e) => {
                    handleInputChange("schoolDistrict", e.target.value);
                    handleInputChange("schoolMunicipality", "");
                  }}
                  disabled={!formData.schoolProvince}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select province first</option>
                  {getAvailableDistricts(formData.schoolProvince).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </SelectArrow>
                {errors.schoolDistrict && <p className="text-red-500 text-[12px] mt-1">{errors.schoolDistrict}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  School Municipality / RM <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="schoolMunicipality"
                  value={formData.schoolMunicipality}
                  onChange={(e) => handleInputChange("schoolMunicipality", e.target.value)}
                  disabled={!formData.schoolDistrict}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select district first</option>
                  {getAvailableMunicipalities(formData.schoolDistrict).map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </SelectArrow>
                {errors.schoolMunicipality && <p className="text-red-500 text-[12px] mt-1">{errors.schoolMunicipality}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">School Tole / Village <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="schoolTole"
                  value={formData.schoolTole}
                  onChange={(e) => handleInputChange("schoolTole", e.target.value)}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                  placeholder="Tole or village name"
                />
                {errors.schoolTole && <p className="text-red-500 text-[12px] mt-1">{errors.schoolTole}</p>}
              </div>
              </div>

            <div className="mt-6">
              <label className="block text-[14px] font-semibold text-gray-700 mb-3">
                Upload Documents <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col justify-center">
                  <label className="block text-[14px] font-semibold text-gray-800 mb-2">
                    Birth Certificate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="birthCertificate"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("birthCertificate", e.target.files?.[0] || null)}
                    className="file-upload-arrow w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300 cursor-pointer"
                  />
                  {errors.birthCertificate && <p className="text-red-500 text-[12px] mt-1">{errors.birthCertificate}</p>}
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col justify-center">
                  <label className="block text-[14px] font-semibold text-gray-800 mb-2">
                    SEE Marksheet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="seeMarksheet"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("seeMarksheet", e.target.files?.[0] || null)}
                    className="file-upload-arrow w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300 cursor-pointer"
                  />
                  {errors.seeMarksheet && <p className="text-red-500 text-[12px] mt-1">{errors.seeMarksheet}</p>}
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col justify-center">
                  <label className="block text-[14px] font-semibold text-gray-800 mb-2">
                    Class 8 Marksheet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="class8Marksheet"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("class8Marksheet", e.target.files?.[0] || null)}
                    className="file-upload-arrow w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300 cursor-pointer"
                  />
                  {errors.class8Marksheet && <p className="text-red-500 text-[12px] mt-1">{errors.class8Marksheet}</p>}
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col justify-center">
                  <label className="block text-[14px] font-semibold text-gray-800 mb-2">
                    Class 9 Marksheet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="class9Marksheet"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("class9Marksheet", e.target.files?.[0] || null)}
                    className="file-upload-arrow w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300 cursor-pointer"
                  />
                  {errors.class9Marksheet && <p className="text-red-500 text-[12px] mt-1">{errors.class9Marksheet}</p>}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Address Details */}
          <section className="mb-12">
            <div className="mb-6 pb-3">
              <h2 className="text-[20px] font-bold text-[#1e293b]">Address Details</h2>
            </div>

            <h3 className="text-[16px] font-semibold text-gray-700 mb-4">Permanent Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-8">
              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Province <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="permProvince"
                  value={formData.permProvince}
                  onChange={(e) => {
                    handleInputChange("permProvince", e.target.value);
                    handleInputChange("permDistrict", "");
                    handleInputChange("permMunicipality", "");
                    handleInputChange("permWard", "");
                  }}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer"
                >
                  <option value="" disabled>Select Province</option>
                  {NEPAL_PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </SelectArrow>
                {errors.permProvince && <p className="text-red-500 text-[12px] mt-1">{errors.permProvince}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  District <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="permDistrict"
                  value={formData.permDistrict}
                  onChange={(e) => {
                    handleInputChange("permDistrict", e.target.value);
                    handleInputChange("permMunicipality", "");
                    handleInputChange("permWard", "");
                  }}
                  disabled={!formData.permProvince}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select province first</option>
                  {permDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </SelectArrow>
                {errors.permDistrict && <p className="text-red-500 text-[12px] mt-1">{errors.permDistrict}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Municipality / RM <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="permMunicipality"
                  value={formData.permMunicipality}
                  onChange={(e) => {
                    handleInputChange("permMunicipality", e.target.value);
                    handleInputChange("permWard", "");
                  }}
                  disabled={!formData.permDistrict}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select district first</option>
                  {permMunicipalities.map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </SelectArrow>
                {errors.permMunicipality && <p className="text-red-500 text-[12px] mt-1">{errors.permMunicipality}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Ward No. <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="permWard"
                  value={formData.permWard}
                  onChange={(e) => handleInputChange("permWard", e.target.value)}
                  disabled={!formData.permMunicipality}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select municipality first</option>
                  {permWards.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </SelectArrow>
                {errors.permWard && <p className="text-red-500 text-[12px] mt-1">{errors.permWard}</p>}
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Tole / Village</label>
                <input
                  type="text"
                  id="permTole"
                  value={formData.permTole}
                  onChange={(e) => handleInputChange("permTole", e.target.value)}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                  placeholder="Tole or village name"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-semibold text-gray-700">Temporary Address</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="copy-address"
                  checked={sameAsPermanent}
                  onChange={(e) => setSameAsPermanent(e.target.checked)}
                  className="w-4 h-4 text-black rounded border-gray-300 focus:ring-black cursor-pointer"
                />
                <span className="text-[13px] font-bold text-black">Same as Permanent</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Province <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="tempProvince"
                  value={formData.tempProvince}
                  onChange={(e) => {
                    handleInputChange("tempProvince", e.target.value);
                    handleInputChange("tempDistrict", "");
                    handleInputChange("tempMunicipality", "");
                    handleInputChange("tempWard", "");
                  }}
                  disabled={sameAsPermanent}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select Province</option>
                  {NEPAL_PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </SelectArrow>
                {errors.tempProvince && <p className="text-red-500 text-[12px] mt-1">{errors.tempProvince}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  District <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="tempDistrict"
                  value={formData.tempDistrict}
                  onChange={(e) => {
                    handleInputChange("tempDistrict", e.target.value);
                    handleInputChange("tempMunicipality", "");
                    handleInputChange("tempWard", "");
                  }}
                  disabled={sameAsPermanent || !formData.tempProvince}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select province first</option>
                  {tempDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </SelectArrow>
                {errors.tempDistrict && <p className="text-red-500 text-[12px] mt-1">{errors.tempDistrict}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Municipality / RM <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="tempMunicipality"
                  value={formData.tempMunicipality}
                  onChange={(e) => {
                    handleInputChange("tempMunicipality", e.target.value);
                    handleInputChange("tempWard", "");
                  }}
                  disabled={sameAsPermanent || !formData.tempDistrict}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select district first</option>
                  {tempMunicipalities.map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </SelectArrow>
                {errors.tempMunicipality && <p className="text-red-500 text-[12px] mt-1">{errors.tempMunicipality}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Ward No. <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="tempWard"
                  value={formData.tempWard}
                  onChange={(e) => handleInputChange("tempWard", e.target.value)}
                  disabled={sameAsPermanent || !formData.tempMunicipality}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select municipality first</option>
                  {tempWards.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </SelectArrow>
                {errors.tempWard && <p className="text-red-500 text-[12px] mt-1">{errors.tempWard}</p>}
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Tole / Village</label>
                <input
                  type="text"
                  id="tempTole"
                  value={formData.tempTole}
                  onChange={(e) => handleInputChange("tempTole", e.target.value)}
                  disabled={sameAsPermanent}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Tole or village name"
                />
              </div>
            </div>
          </section>

          {/* Section 4: Family Background */}
          <section className="mb-12">
            <div className="mb-6 pb-3">
              <h2 className="text-[20px] font-bold text-[#1e293b]">Family Background</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Parent's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="guardianName"
                  value={formData.guardianName}
                  onChange={(e) => handleInputChange("guardianName", e.target.value)}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                  placeholder="E.g. Shyam Bahadur Thapa"
                />
                {errors.guardianName && <p className="text-red-500 text-[12px] mt-1">{errors.guardianName}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Parent's Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                    if (val.length > 0 && val[0] !== "9") return;
                    handleInputChange("guardianPhone", val);
                  }}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
                {errors.guardianPhone && <p className="text-red-500 text-[12px] mt-1">{errors.guardianPhone}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Parent's Email
                </label>
                <input
                  type="email"
                  id="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={(e) => handleInputChange("guardianEmail", e.target.value)}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                  placeholder="parent@email.com"
                />
                {errors.guardianEmail && <p className="text-red-500 text-[12px] mt-1">{errors.guardianEmail}</p>}
              </div>

              <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Father&apos;s Occupation <span className="text-red-500">*</span>
                  </label>
                  <SelectArrow
                    id="fatherOccupation"
                    value={formData.fatherOccupation}
                    onChange={(e) => handleInputChange("fatherOccupation", e.target.value)}
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer"
                  >
                    <option value="" disabled>Select Occupation</option>
                    {occupations.map((occ) => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </SelectArrow>
                  {formData.fatherOccupation === "Other" && (
                    <input
                      type="text"
                      id="fatherOccupationOther"
                      value={formData.fatherOccupationOther}
                      onChange={(e) => handleInputChange("fatherOccupationOther", e.target.value)}
                      className="mt-2 w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                      placeholder="Please specify occupation"
                    />
                  )}
                  {errors.fatherOccupation && <p className="text-red-500 text-[12px] mt-1">{errors.fatherOccupation}</p>}
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Mother&apos;s Occupation <span className="text-red-500">*</span>
                  </label>
                  <SelectArrow
                    id="motherOccupation"
                    value={formData.motherOccupation}
                    onChange={(e) => handleInputChange("motherOccupation", e.target.value)}
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer"
                  >
                    <option value="" disabled>Select Occupation</option>
                    {occupations.map((occ) => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </SelectArrow>
                  {formData.motherOccupation === "Other" && (
                    <input
                      type="text"
                      id="motherOccupationOther"
                      value={formData.motherOccupationOther}
                      onChange={(e) => handleInputChange("motherOccupationOther", e.target.value)}
                      className="mt-2 w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                      placeholder="Please specify occupation"
                    />
                  )}
                  {errors.motherOccupation && <p className="text-red-500 text-[12px] mt-1">{errors.motherOccupation}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Family Monthly Income (NPR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="familyIncome"
                  value={formData.familyIncome}
                  onChange={(e) => handleInputChange("familyIncome", e.target.value)}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                  placeholder="Estimated monthly income"
                  min={0}
                  max={500000}
                />
                {errors.familyIncome && <p className="text-red-500 text-[12px] mt-1">{errors.familyIncome}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Total Family Members Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="familyMembers"
                  value={formData.familyMembers}
                  onChange={(e) => handleInputChange("familyMembers", e.target.value)}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white"
                  placeholder="Total number of members"
                  min={1}
                  max={20}
                />
                {errors.familyMembers && <p className="text-red-500 text-[12px] mt-1">{errors.familyMembers}</p>}
              </div>
            </div>
          </section>

          {/* Section 5: Admit Card Details */}
          <section className="mb-12">
            <div className="mb-6 pb-3">
              <h2 className="text-[20px] font-bold text-[#1e293b]">{scholarshipTitle || "Project Shiksha"} Admit Card Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Student&apos;s Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="admitName"
                  value={formData.fullName}
                  readOnly
                  className="w-full bg-gray-100 border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none cursor-not-allowed"
                  placeholder="Auto-filled from Personal Details"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="admitDob"
                  value={formData.dobBS}
                  readOnly
                  className="w-full bg-gray-100 border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none cursor-not-allowed"
                  placeholder="Auto-calculated"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Gender <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="admitGender"
                  value={formData.gender || "Not selected"}
                  readOnly
                  className="w-full bg-gray-100 border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Choose Stream <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="stream"
                  value={formData.stream}
                  onChange={(e) => handleInputChange("stream", e.target.value)}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer"
                >
                  <option value="" disabled>Select Stream</option>
                  {streams.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </SelectArrow>
                {errors.stream && <p className="text-red-500 text-[12px] mt-1">{errors.stream}</p>}
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Choose Exam Center <span className="text-red-500">*</span>
                </label>
                <SelectArrow
                  id="examCenter"
                  value={formData.examCenter}
                  onChange={(e) => handleInputChange("examCenter", e.target.value)}
                  className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#006400] transition-all bg-white cursor-pointer"
                >
                  <option value="" disabled>Select Exam Center</option>
                  {/* Use dynamic exam centers if provided, otherwise fallback to static list */}
                  {(dynamicExamCenters && dynamicExamCenters.length > 0 ? dynamicExamCenters : examCenters).map((ec) => (
                    <option key={ec} value={ec}>{ec}</option>
                  ))}
                </SelectArrow>
                {errors.examCenter && <p className="text-red-500 text-[12px] mt-1">{errors.examCenter}</p>}
              </div>
            </div>
          </section>

          {/* Declaration */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="declaration"
                checked={formData.declaration}
                onChange={(e) => handleInputChange("declaration", e.target.checked)}
                className="w-5 h-5 mt-0.5 text-[#006400] rounded border-gray-300 focus:ring-0 focus:border-[#006400] cursor-pointer"
              />
              <span className="text-[15px] font-semibold text-gray-800 leading-snug">
                I confirm that all information provided is correct.
                <span className="block text-xs text-gray-500 font-normal mt-1">
                  I understand that any false information may result in the rejection of my scholarship application.
                </span>
              </span>
            </label>
            {errors.declaration && <p className="text-red-500 text-[12px] mt-2">{errors.declaration}</p>}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-brand-blue hover:bg-brand-hover disabled:bg-gray-400 text-white font-bold text-[16px] py-4 px-12 rounded transition-all hover:-translate-y-0.5 active:translate-y-0 text-center disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : (paymentConfig?.enabled && paymentConfig.fee_amount > 0 ? "Proceed to Payment" : "Submit Application")}
            </button>
          </div>
        </form>
      </main>
      {partnerLogos && partnerLogos.length > 0 && (
        <div className="w-full lg:w-72 shrink-0 order-1 lg:order-2">
          <PartnerLogosCard logos={partnerLogos} />
        </div>
      )}
      </div>
      <AlertDialog isOpen={!!alertMessage} onClose={() => setAlertMessage("")} message={alertMessage} />
    </div>
  );
}
