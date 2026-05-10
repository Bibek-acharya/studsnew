"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { use, useState, useEffect, useRef } from "react";
import { apiService } from "@/services/api";
import NepaliCalendar from "@/components/volunteer/VolunteerNepaliCalendar";
import Dropdown from "@/components/college-recommender/Dropdown";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS, NEPAL_LOCAL_BODIES } from "@/lib/location-data";

export default function VolunteerApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [volunteer, setVolunteer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [otherDesignation, setOtherDesignation] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [ward, setWard] = useState("");
  const [tole, setTole] = useState("");
  const [participateDistrict, setParticipateDistrict] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [volunteeredBefore, setVolunteeredBefore] = useState("");
  const [volunteerDetails, setVolunteerDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [declaration, setDeclaration] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    fullName: useRef<HTMLDivElement>(null),
    gender: useRef<HTMLDivElement>(null),
    phone: useRef<HTMLDivElement>(null),
    email: useRef<HTMLDivElement>(null),
    designation: useRef<HTMLDivElement>(null),
    province: useRef<HTMLDivElement>(null),
    district: useRef<HTMLDivElement>(null),
    municipality: useRef<HTMLDivElement>(null),
    ward: useRef<HTMLDivElement>(null),
    tole: useRef<HTMLDivElement>(null),
    participateDistrict: useRef<HTMLDivElement>(null),
    availableDays: useRef<HTMLDivElement>(null),
    volunteeredBefore: useRef<HTMLDivElement>(null),
    declaration: useRef<HTMLDivElement>(null),
  };

  const fieldOrder = [
    "fullName", "gender", "phone", "email", "designation",
    "province", "district", "municipality", "ward", "tole",
    "participateDistrict", "availableDays", "volunteeredBefore", "declaration"
  ];

  function getFieldErrors(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!gender) e.gender = "Gender is required";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (phone.length < 10) e.phone = "Phone number must be 10 digits";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    if (!designation) e.designation = "Designation is required";
    if (designation === "Other" && !otherDesignation.trim()) e.designation = "Please specify your designation";
    if (!province) e.province = "Province is required";
    if (!district) e.district = "District is required";
    if (!municipality) e.municipality = "Municipality is required";
    if (!ward) e.ward = "Ward number is required";
    if (!tole.trim()) e.tole = "Tole/Village is required";
    if (!participateDistrict) e.participateDistrict = "Participating district is required";
    if (selectedDays.length === 0) e.availableDays = "Select at least one available day";
    if (!volunteeredBefore) e.volunteeredBefore = "Please select an option";
    if (volunteeredBefore === "Yes" && !volunteerDetails.trim()) e.volunteerDetails = "Previous role details are required";
    if (!declaration) e.declaration = "Please confirm the declaration";
    return e;
  }

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const res = await apiService.getPublicVolunteerByID(Number(id));
        if (res?.success && res?.data) {
          const data = res.data;
          let dates: string[] = [];
          if (data.date_mode === "specific") {
            dates = data.specific_dates || [];
          } else if (data.date_mode === "range" && data.range_start && data.range_end) {
            const sp = data.range_start.split("-").map(Number);
            const ep = data.range_end.split("-").map(Number);
            const start = new Date(sp[0], sp[1] - 1, sp[2]);
            const end = new Date(ep[0], ep[1] - 1, ep[2]);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              const y = d.getFullYear();
              const m = String(d.getMonth() + 1).padStart(2, "0");
              const day = String(d.getDate()).padStart(2, "0");
              dates.push(`${y}-${m}-${day}`);
            }
          }
          setVolunteer({ ...data, availableDates: dates });
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteer();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = getFieldErrors();
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      for (const key of fieldOrder) {
        if (fieldErrors[key]) {
          fieldRefs[key]?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          break;
        }
      }
      return;
    }

    setSubmitting(true);
    try {
      await apiService.submitVolunteerApplication(volunteer.id, {
        full_name: fullName,
        gender,
        phone,
        email,
        designation,
        other_designation: otherDesignation,
        province,
        district,
        municipality,
        ward,
        tole,
        participate_district: participateDistrict,
        available_days: selectedDays,
        volunteered_before: volunteeredBefore,
        volunteer_details: volunteerDetails,
      });
      setSubmitted(true);
    } catch {
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0000ff" }}>
        <p className="text-white text-lg font-bold">Loading...</p>
      </div>
    );
  }

  if (notFound || !volunteer) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0000ff" }}>
        <p className="text-white text-lg font-bold">Volunteer opportunity not found.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: "#0000ff" }}>
        <div className="w-full max-w-[500px] bg-white rounded-2xl p-10 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-8 text-center">Thank you for registering as a volunteer. We will contact you soon.</p>
          <button onClick={() => router.push("/volunteer")} className="bg-[#0000ff] hover:bg-[#0000cc] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 pb-20 px-4 sm:px-6" style={{ backgroundColor: "#0000ff" }}>
      <header className="w-full max-w-[900px] mb-8 text-center sm:text-left">
        <h1 className="text-[32px] sm:text-[40px] font-extrabold text-white mb-2 leading-tight drop-shadow-sm">Volunteer Registration</h1>
        <p className="text-[18px] text-white/90 font-medium">{volunteer.title} &mdash; {volunteer.organizer}</p>
      </header>

      <main className="w-full max-w-[900px] bg-white rounded-2xl relative">
        <div className="bg-[#f0fdf4] border-b border-[#bbf7d0] py-3.5 px-6 flex justify-center items-center gap-3 text-[14px] text-[#166534]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Your data is secure and will be used for volunteer registration purposes only.</span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="px-6 sm:px-12 py-8">
          <div className="mb-12">
            <div className="mb-6 pb-3">
              <h2 className="text-[20px] font-bold text-[#1e293b]">Personal Details</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div ref={fieldRefs.fullName} className="col-span-1 sm:col-span-2">
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={fullName} onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors((p) => { const n = { ...p }; delete n.fullName; return n; }); }} required
                  className={`w-full border rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter your full name" />
                {errors.fullName && <p className="text-red-500 text-[13px] mt-1">{errors.fullName}</p>}
              </div>
              <div ref={fieldRefs.gender}>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                <Dropdown id="gender" value={gender} onChange={(v) => { setGender(v); if (errors.gender) setErrors((p) => { const n = { ...p }; delete n.gender; return n; }); }} options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]} placeholder="Select Gender" error={errors.gender} />
                {errors.gender && <p className="text-red-500 text-[13px] mt-1">{errors.gender}</p>}
              </div>
              <div ref={fieldRefs.phone}>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10)); if (errors.phone) setErrors((p) => { const n = { ...p }; delete n.phone; return n; }); }} required
                  className={`w-full border rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter your phone number" />
                {errors.phone && <p className="text-red-500 text-[13px] mt-1">{errors.phone}</p>}
              </div>
              <div ref={fieldRefs.email}>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => { const n = { ...p }; delete n.email; return n; }); }} required
                  className={`w-full border rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter your email" />
                {errors.email && <p className="text-red-500 text-[13px] mt-1">{errors.email}</p>}
              </div>
              <div ref={fieldRefs.designation}>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Designation <span className="text-red-500">*</span></label>
                <Dropdown id="designation" value={designation} onChange={(v) => { setDesignation(v); if (errors.designation) setErrors((p) => { const n = { ...p }; delete n.designation; return n; }); }} options={[{ value: "Student", label: "Student" }, { value: "Job Holder", label: "Job Holder" }, { value: "Business Owner", label: "Business Owner" }, { value: "Freelancer", label: "Freelancer" }, { value: "Teacher", label: "Teacher" }, { value: "Social Worker", label: "Social Worker" }, { value: "Other", label: "Other" }]} placeholder="Select Designation" error={errors.designation} />
                {errors.designation && <p className="text-red-500 text-[13px] mt-1">{errors.designation}</p>}
              </div>
              {designation === "Other" && (
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">If Other, Please Specify <span className="text-red-500">*</span></label>
                  <input type="text" value={otherDesignation} onChange={(e) => setOtherDesignation(e.target.value)} required
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white"
                    placeholder="Please specify your designation" />
                </div>
              )}

              <div className="col-span-1 sm:col-span-2 pt-4 border-t border-gray-100">
                <h3 className="text-[16px] font-semibold text-gray-700 mb-4">Current Address</h3>
              </div>
              <div ref={fieldRefs.province}>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Province <span className="text-red-500">*</span></label>
                <Dropdown id="province" value={province} onChange={(v) => { setProvince(v); setDistrict(""); setMunicipality(""); if (errors.province) setErrors((p) => { const n = { ...p }; delete n.province; return n; }); }} options={NEPAL_PROVINCES.map((p: string) => ({ value: p, label: p }))} placeholder="Select Province" error={errors.province} />
                {errors.province && <p className="text-red-500 text-[13px] mt-1">{errors.province}</p>}
              </div>
              <div ref={fieldRefs.district}>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">District <span className="text-red-500">*</span></label>
                <Dropdown id="district" value={district} onChange={(v) => { setDistrict(v); setMunicipality(""); if (errors.district) setErrors((p) => { const n = { ...p }; delete n.district; return n; }); }} options={province ? (NEPAL_DISTRICTS[province as keyof typeof NEPAL_DISTRICTS] || []).map((d: string) => ({ value: d, label: d })) : []} placeholder="Select District" error={errors.district} />
                {errors.district && <p className="text-red-500 text-[13px] mt-1">{errors.district}</p>}
              </div>
              <div ref={fieldRefs.municipality}>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Municipality / RM <span className="text-red-500">*</span></label>
                <Dropdown id="municipality" value={municipality} onChange={(v) => { setMunicipality(v); if (errors.municipality) setErrors((p) => { const n = { ...p }; delete n.municipality; return n; }); }} options={district && NEPAL_LOCAL_BODIES[district as keyof typeof NEPAL_LOCAL_BODIES] ? (NEPAL_LOCAL_BODIES[district as keyof typeof NEPAL_LOCAL_BODIES] as Array<{name: string; wards: number}>).map((lb) => ({ value: lb.name, label: lb.name })) : []} placeholder="Select Municipality" error={errors.municipality} />
                {errors.municipality && <p className="text-red-500 text-[13px] mt-1">{errors.municipality}</p>}
              </div>
              <div ref={fieldRefs.ward}>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Ward No. <span className="text-red-500">*</span></label>
                <input type="number" value={ward} onChange={(e) => { setWard(e.target.value); if (errors.ward) setErrors((p) => { const n = { ...p }; delete n.ward; return n; }); }} required min={1}
                  className={`w-full border rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white ${errors.ward ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Ward Number" />
                {errors.ward && <p className="text-red-500 text-[13px] mt-1">{errors.ward}</p>}
              </div>
              <div ref={fieldRefs.tole} className="col-span-1 sm:col-span-2">
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Tole / Village <span className="text-red-500">*</span></label>
                <input type="text" value={tole} onChange={(e) => { setTole(e.target.value); if (errors.tole) setErrors((p) => { const n = { ...p }; delete n.tole; return n; }); }} required
                  className={`w-full border rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white ${errors.tole ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter tole or village name" />
                {errors.tole && <p className="text-red-500 text-[13px] mt-1">{errors.tole}</p>}
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="mb-6 pb-3">
              <h2 className="text-[20px] font-bold text-[#1e293b]">Volunteer Preferences</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div ref={fieldRefs.participateDistrict}>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">District to Participate <span className="text-red-500">*</span></label>
                {volunteer.districts && volunteer.districts.length > 0 ? (
                  <Dropdown id="participateDistrict" value={participateDistrict} onChange={(v) => { setParticipateDistrict(v); if (errors.participateDistrict) setErrors((p) => { const n = { ...p }; delete n.participateDistrict; return n; }); }} options={volunteer.districts.map((d: string) => ({ value: d, label: d }))} placeholder="Select District" error={errors.participateDistrict} />
                ) : (
                  <p className="text-sm text-gray-500 italic">No participating districts listed</p>
                )}
                {errors.participateDistrict && <p className="text-red-500 text-[13px] mt-1">{errors.participateDistrict}</p>}
              </div>
              <div ref={fieldRefs.availableDays}>
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Available Days <span className="text-red-500">*</span></label>
                <NepaliCalendar availableDates={volunteer.availableDates} selectedDays={selectedDays} onDaysChange={(days) => { setSelectedDays(days); if (errors.availableDays) setErrors((p) => { const n = { ...p }; delete n.availableDays; return n; }); }} />
                {errors.availableDays && <p className="text-red-500 text-[13px] mt-1">{errors.availableDays}</p>}
              </div>
            </div>

            <div ref={fieldRefs.volunteeredBefore} className="mt-6">
              <label className="block text-[14px] font-semibold text-gray-700 mb-3">Have you volunteered before on {volunteer.organizer}? <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="volunteered_before" value={opt} checked={volunteeredBefore === opt} onChange={() => { setVolunteeredBefore(opt); if (errors.volunteeredBefore) setErrors((p) => { const n = { ...p }; delete n.volunteeredBefore; return n; }); }}
                      className="w-4 h-4 text-[#0000ff] border-gray-300 focus:ring-0 cursor-pointer" />
                    <span className="text-[15px] font-semibold text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
              {errors.volunteeredBefore && <p className="text-red-500 text-[13px] mt-1">{errors.volunteeredBefore}</p>}
            </div>

            {volunteeredBefore === "Yes" && (
              <div className="mt-5">
                <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Previous Role / Details <span className="text-red-500">*</span></label>
                <textarea value={volunteerDetails} onChange={(e) => { setVolunteerDetails(e.target.value); if (errors.volunteerDetails) setErrors((p) => { const n = { ...p }; delete n.volunteerDetails; return n; }); }} required
                  className={`w-full border rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:ring-0 focus:border-[#0000ff] transition-all bg-white resize-none ${errors.volunteerDetails ? "border-red-500" : "border-gray-300"}`}
                  rows={3} placeholder="Please describe your previous volunteer role or details" />
                {errors.volunteerDetails && <p className="text-red-500 text-[13px] mt-1">{errors.volunteerDetails}</p>}
              </div>
            )}
          </div>

          <div ref={fieldRefs.declaration} className="mt-10 pt-6 border-t border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={declaration} onChange={(e) => { setDeclaration(e.target.checked); if (errors.declaration) setErrors((p) => { const n = { ...p }; delete n.declaration; return n; }); }} required
                className="w-5 h-5 mt-0.5 text-[#0000ff] rounded border-gray-300 focus:ring-0 focus:border-[#0000ff] cursor-pointer" />
              <span className="text-[15px] font-semibold text-gray-800 leading-snug">I confirm that the information provided is correct.</span>
            </label>
            {errors.declaration && <p className="text-red-500 text-[13px] mt-1 ml-8">{errors.declaration}</p>}
          </div>

          <div className="mt-8 flex justify-end">
            <button type="submit" disabled={submitting}
              className="w-full sm:w-auto bg-[#0000ff] hover:bg-[#0000cc] text-white font-bold text-[16px] py-4 px-12 rounded-lg transition-all hover:-translate-y-0.5 active:translate-y-0 text-center disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
