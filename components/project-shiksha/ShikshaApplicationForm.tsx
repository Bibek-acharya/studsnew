"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, User, Phone, Mail, MapPin, Users, FileText, CheckCircle, Calendar } from "lucide-react";
import NepaliCalendar from "./NepaliCalendar";
import { ProjectShikshaFormData, schoolTypes, occupations } from "./types";
import { validateForm } from "./validation";
import { adToBs, formatNepaliDate, calculateAge } from "@/utils/nepali-date-converter";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS, NEPAL_LOCAL_BODIES } from "@/lib/location-data";

const initialFormData: ProjectShikshaFormData = {
  // Personal Details
  fullName: "",
  gender: "",
  dobBS: "",
  dobAD: "",
  age: "",
  phone: "",
  email: "",
  seeSchoolType: "",
  otherSchoolType: "",
  schoolName: "",
  
  // Address
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
  
  // Family
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  fatherOccupation: "",
  motherOccupation: "",
  familyIncome: "",
  familyMembers: "",
  
  // Documents
  seeMarksheet: null,
  citizenship: null,
  photo: null,
  
  // Declaration
  declaration: false,
};

export default function ShikshaApplicationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectShikshaFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectShikshaFormData, string>>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((field: keyof ProjectShikshaFormData, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

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

  const handleDobAdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const adDateStr = e.target.value;
    
    if (!adDateStr) {
      setFormData((prev) => ({ ...prev, dobAD: "", dobBS: "", age: "" }));
      return;
    }
    
    const adDate = new Date(adDateStr);
    
    if (!isNaN(adDate.getTime())) {
      const bsDate = adToBs(adDate);
      const bsDateFormatted = formatNepaliDate(bsDate.year, bsDate.month, bsDate.day);
      const age = calculateAge(adDate);
      
      setFormData((prev) => ({ 
        ...prev, 
        dobAD: adDateStr,
        dobBS: bsDateFormatted,
        age
      }));
      
      if (parseInt(age) < 14) {
        setErrors((prev) => ({ ...prev, dobAD: "You must be at least 14 years old to apply", dobBS: "You must be at least 14 years old to apply" }));
      } else {
        setErrors((prev) => ({ ...prev, dobAD: undefined, dobBS: undefined }));
      }
    }
  }, []);

  const handleFileChange = useCallback((field: "seeMarksheet" | "citizenship" | "photo", file: File | null) => {
    handleInputChange(field, file);
    if (field === "photo" && file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [handleInputChange]);

  // Handle same as permanent address
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
      // Scroll to first error
      const firstErrorField = Object.keys(validation.errors)[0];
      const element = document.getElementById(firstErrorField);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Store form data in sessionStorage for payment page
      sessionStorage.setItem("shiksha_application_data", JSON.stringify({
        ...formData,
        photoPreview,
      }));
      
      // Navigate to payment page
      router.push("/scholarship-apply/project-shiksha/payment");
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ fullName: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showOtherSchoolType = formData.seeSchoolType === "Other";
  const showSchoolName = formData.seeSchoolType && formData.seeSchoolType !== "";

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
    <div className="min-h-screen bg-[#0000ff] flex flex-col items-center pt-8 pb-20 px-4 sm:px-6">
      {/* Header */}
      <header className="w-full max-w-[900px] mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
            <Image
              src="/studsphere.png"
              alt="StudSphere"
              width={180}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>
          <h1 className="text-[32px] sm:text-[40px] font-extrabold text-white mb-2 leading-tight drop-shadow-sm">
            Project Shiksha Entrance 2082
          </h1>
          <p className="text-[18px] text-white/90 font-medium">Empowering Education, Shaping Futures.</p>
        </div>
      </header>

      {/* Form Container */}
      <main className="w-full max-w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Trust Banner */}
        <div className="bg-[#f0fdf4] border-b border-[#bbf7d0] py-3.5 px-6 flex justify-center items-center gap-3 text-[14px] text-[#166534]">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Your data is secure and will be used for admission purposes only.</span>
        </div>

        {/* Important Note */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 mt-6 mx-6 sm:mx-12 rounded-r-lg shadow-sm">
          <p className="font-bold text-[14px] text-yellow-800 uppercase tracking-wide mb-1.5 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            Note:
          </p>
          <p className="text-[13.5px] text-yellow-800 leading-relaxed">
            This scholarship entrance examination is for students who have completed SEE. Applicants from all districts of Nepal are eligible to participate. Candidates must bring this admit card to the exam center. The entrance form charge is <span className="font-bold">NPR 250</span> and is non-refundable.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 sm:px-12 py-8">
          {/* Section 1: Personal Details */}
          <section className="mb-12">
            <div className="mb-6 border-b border-gray-200 pb-3">
              <h2 className="text-[20px] font-bold text-[#1e293b]">Personal Details</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              {/* Left side fields */}
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 order-2 md:order-1">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Student&apos;s Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
                      placeholder="E.g. Ram Bahadur Thapa"
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-[12px] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23111827%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em]"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-[12px] mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Date of Birth (BS) <span className="text-red-500">*</span>
                  </label>
                  <NepaliCalendar
                    value={formData.dobBS}
                    onChange={(value, adDate, age) => {
                      handleInputChange("dobBS", value);
                      handleInputChange("dobAD", adDate);
                      handleInputChange("age", age);
                      if (parseInt(age) < 14) {
                        setErrors((prev) => ({ ...prev, dobBS: "You must be at least 14 years old to apply" }));
                      } else {
                        setErrors((prev) => ({ ...prev, dobBS: undefined }));
                      }
                    }}
                    error={errors.dobBS}
                    minAge={14}
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Date of Birth (AD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.dobAD}
                      onChange={handleDobAdChange}
                      className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Age</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.age}
                      readOnly
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 pr-12 text-[15px] text-gray-600 outline-none cursor-not-allowed font-medium"
                      placeholder="Auto-calc"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Yrs</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                      className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-[12px] mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
                      placeholder="student@email.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>}
                </div>

                {/* SEE Details */}
                <div className="col-span-1 sm:col-span-2 mt-2">
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    From where did you give SEE? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.seeSchoolType}
                    onChange={(e) => handleInputChange("seeSchoolType", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23111827%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em]"
                  >
                    <option value="" disabled>Select School Type</option>
                    {schoolTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.seeSchoolType && <p className="text-red-500 text-[12px] mt-1">{errors.seeSchoolType}</p>}

                  {showOtherSchoolType && (
                    <div className="mt-4">
                      <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                        Please specify the reason/type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.otherSchoolType}
                        onChange={(e) => handleInputChange("otherSchoolType", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
                        placeholder="Specify other type/reason"
                      />
                    </div>
                  )}

                  {showSchoolName && (
                    <div className="mt-4">
                      <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                        School Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.schoolName}
                        onChange={(e) => handleInputChange("schoolName", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
                        placeholder="Enter your school's full name"
                      />
                      {errors.schoolName && <p className="text-red-500 text-[12px] mt-1">{errors.schoolName}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Right side Photo Upload */}
              <div className="w-full md:w-40 flex-shrink-0 order-1 md:order-2 flex flex-col items-center">
                <label className="block text-[14px] font-semibold text-gray-700 mb-2 w-full text-center md:text-left">
                  Passport Photo <span className="text-red-500">*</span>
                </label>
                <div
                  className="relative w-32 h-36 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      fill
                      className="object-cover z-10"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-500 transition-colors p-4 text-center">
                      <Upload className="w-10 h-10 mb-2" />
                      <span className="text-[12px] font-semibold">Upload Photo</span>
                      <span className="text-[10px] text-gray-500 mt-1">PP Size (Max 2MB)</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange("photo", e.target.files?.[0] || null)}
                />
                {errors.photo && <p className="text-red-500 text-[12px] mt-1">{errors.photo}</p>}
              </div>
            </div>
          </section>

          {/* Section 2: Address */}
          <section className="mb-12">
            <div className="mb-6 border-b border-gray-200 pb-3">
              <h2 className="text-[20px] font-bold text-[#1e293b]">Address Details</h2>
            </div>

            <h3 className="text-[16px] font-semibold text-gray-700 mb-4">Permanent Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-8">
              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Province <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.permProvince}
                    onChange={(e) => {
                      handleInputChange("permProvince", e.target.value);
                      handleInputChange("permDistrict", "");
                      handleInputChange("permMunicipality", "");
                      handleInputChange("permWard", "");
                    }}
                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23111827%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em]"
                  >
                    <option value="" disabled>Select Province</option>
                    {NEPAL_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                {errors.permProvince && <p className="text-red-500 text-[12px] mt-1">{errors.permProvince}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.permDistrict}
                  onChange={(e) => {
                    handleInputChange("permDistrict", e.target.value);
                    handleInputChange("permMunicipality", "");
                    handleInputChange("permWard", "");
                  }}
                  disabled={!formData.permProvince}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23111827%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select province first</option>
                  {permDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.permDistrict && <p className="text-red-500 text-[12px] mt-1">{errors.permDistrict}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Municipality / RM <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.permMunicipality}
                  onChange={(e) => {
                    handleInputChange("permMunicipality", e.target.value);
                    handleInputChange("permWard", "");
                  }}
                  disabled={!formData.permDistrict}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23111827%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select district first</option>
                  {permMunicipalities.map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
                {errors.permMunicipality && <p className="text-red-500 text-[12px] mt-1">{errors.permMunicipality}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Ward No. <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.permWard}
                  onChange={(e) => handleInputChange("permWard", e.target.value)}
                  disabled={!formData.permMunicipality}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23111827%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select municipality first</option>
                  {permWards.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
                {errors.permWard && <p className="text-red-500 text-[12px] mt-1">{errors.permWard}</p>}
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Tole / Village</label>
                <input
                  type="text"
                  value={formData.permTole}
                  onChange={(e) => handleInputChange("permTole", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
                  placeholder="Tole or village name"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-semibold text-gray-700">Temporary Address</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
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
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.tempProvince}
                    onChange={(e) => {
                      handleInputChange("tempProvince", e.target.value);
                      handleInputChange("tempDistrict", "");
                      handleInputChange("tempMunicipality", "");
                      handleInputChange("tempWard", "");
                    }}
                    disabled={sameAsPermanent}
                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23111827%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>Select Province</option>
                    {NEPAL_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                {errors.tempProvince && <p className="text-red-500 text-[12px] mt-1">{errors.tempProvince}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.tempDistrict}
                  onChange={(e) => {
                    handleInputChange("tempDistrict", e.target.value);
                    handleInputChange("tempMunicipality", "");
                    handleInputChange("tempWard", "");
                  }}
                  disabled={sameAsPermanent || !formData.tempProvince}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23111827%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select province first</option>
                  {tempDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.tempDistrict && <p className="text-red-500 text-[12px] mt-1">{errors.tempDistrict}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Municipality / RM <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.tempMunicipality}
                  onChange={(e) => {
                    handleInputChange("tempMunicipality", e.target.value);
                    handleInputChange("tempWard", "");
                  }}
                  disabled={sameAsPermanent || !formData.tempDistrict}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23111827%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select district first</option>
                  {tempMunicipalities.map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
                {errors.tempMunicipality && <p className="text-red-500 text-[12px] mt-1">{errors.tempMunicipality}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Ward No. <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.tempWard}
                  onChange={(e) => handleInputChange("tempWard", e.target.value)}
                  disabled={sameAsPermanent || !formData.tempMunicipality}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23111827%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select municipality first</option>
                  {tempWards.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
                {errors.tempWard && <p className="text-red-500 text-[12px] mt-1">{errors.tempWard}</p>}
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Tole / Village</label>
                <input
                  type="text"
                  value={formData.tempTole}
                  onChange={(e) => handleInputChange("tempTole", e.target.value)}
                  disabled={sameAsPermanent}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Tole or village name"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Family Background */}
          <section className="mb-12">
            <div className="mb-6 border-b border-gray-200 pb-3">
              <h2 className="text-[20px] font-bold text-[#1e293b]">
                Family Background <span className="text-sm font-normal text-gray-500 ml-2">(Scholarship Need-Based)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Guardian&apos;s Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => handleInputChange("guardianName", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
                    placeholder="E.g. Shyam Bahadur Thapa"
                  />
                </div>
                {errors.guardianName && <p className="text-red-500 text-[12px] mt-1">{errors.guardianName}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Guardian&apos;s Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.guardianPhone}
                    onChange={(e) => handleInputChange("guardianPhone", e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>
                {errors.guardianPhone && <p className="text-red-500 text-[12px] mt-1">{errors.guardianPhone}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Guardian&apos;s Email <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={formData.guardianEmail}
                    onChange={(e) => handleInputChange("guardianEmail", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
                    placeholder="guardian@email.com"
                  />
                </div>
                {errors.guardianEmail && <p className="text-red-500 text-[12px] mt-1">{errors.guardianEmail}</p>}
              </div>

              <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Father&apos;s Occupation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.fatherOccupation}
                    onChange={(e) => handleInputChange("fatherOccupation", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23111827%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em]"
                  >
                    <option value="" disabled>Select Occupation</option>
                    {occupations.map((occ) => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </select>
                  {errors.fatherOccupation && <p className="text-red-500 text-[12px] mt-1">{errors.fatherOccupation}</p>}
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Mother&apos;s Occupation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.motherOccupation}
                    onChange={(e) => handleInputChange("motherOccupation", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23111827%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em]"
                  >
                    <option value="" disabled>Select Occupation</option>
                    {occupations.map((occ) => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </select>
                  {errors.motherOccupation && <p className="text-red-500 text-[12px] mt-1">{errors.motherOccupation}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                  Family Monthly Income (NPR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.familyIncome}
                  onChange={(e) => handleInputChange("familyIncome", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
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
                  value={formData.familyMembers}
                  onChange={(e) => handleInputChange("familyMembers", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
                  placeholder="Total number of members"
                  min={1}
                  max={20}
                />
                {errors.familyMembers && <p className="text-red-500 text-[12px] mt-1">{errors.familyMembers}</p>}
              </div>
            </div>
          </section>

          {/* Section 4: Document Uploads */}
          <section className="mb-10">
            <div className="mb-6 border-b border-gray-200 pb-3">
              <h2 className="text-[20px] font-bold text-[#1e293b]">Documents Upload</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col justify-center">
                <label className="block text-[14px] font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  SEE Marksheet <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange("seeMarksheet", e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0000ff] file:text-white hover:file:bg-[#0000cc] cursor-pointer"
                />
                {formData.seeMarksheet && (
                  <p className="text-green-600 text-[12px] mt-1">✓ {formData.seeMarksheet.name}</p>
                )}
                {errors.seeMarksheet && <p className="text-red-500 text-[12px] mt-1">{errors.seeMarksheet}</p>}
              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col justify-center">
                <label className="block text-[14px] font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Citizenship / Birth Certificate <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange("citizenship", e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0000ff] file:text-white hover:file:bg-[#0000cc] cursor-pointer"
                />
                {formData.citizenship && (
                  <p className="text-green-600 text-[12px] mt-1">✓ {formData.citizenship.name}</p>
                )}
                {errors.citizenship && <p className="text-red-500 text-[12px] mt-1">{errors.citizenship}</p>}
              </div>
            </div>
          </section>

          {/* Declaration */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.declaration}
                onChange={(e) => handleInputChange("declaration", e.target.checked)}
                className="w-5 h-5 mt-0.5 text-[#0000ff] rounded border-gray-300 focus:ring-0 focus:border-[#0000ff] cursor-pointer"
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
              className="w-full sm:w-auto bg-[#0000ff] hover:bg-[#0000cc] disabled:bg-gray-400 text-white font-bold text-[16px] py-4 px-12 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-center disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Submit Application"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
