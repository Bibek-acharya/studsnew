"use client";

import React from "react";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiService, getImageUrl } from "@/services/api";
import { Building2, MapPin, Clock, Banknote, ArrowLeft, Calendar, Users } from "lucide-react";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function VolunteerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [volunteer, setVolunteer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const res = await apiService.getPublicVolunteerByID(Number(id));
        if (res?.success && res?.data) {
          setVolunteer(res.data);
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

  const isPaid = volunteer?.volunteer_type === "paid";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden">
        <img
          src={getImageUrl(volunteer.banner_image)}
          alt={volunteer.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/1200x400?text=Volunteer+Event"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <button
          onClick={() => router.push("/volunteer")}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 sm:gap-2 rounded-lg bg-white/90 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="mx-auto max-w-5xl -mt-12 sm:-mt-16 relative z-10 px-4 pb-16">
        <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-4 sm:mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="rounded-full bg-[#0000ff] px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
                {isPaid ? "Paid Volunteer" : "Unpaid Volunteer"}
              </span>
              {volunteer.active !== false && (
                <span className="rounded-full bg-green-100 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-green-700">
                  Active
                </span>
              )}
              {volunteer.applicant_count > 0 && (
                <span className="rounded-full bg-blue-100 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-blue-700 flex items-center gap-1">
                  <Users size={13} />
                  {volunteer.applicant_count} applicant{volunteer.applicant_count !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">{volunteer.title}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-start gap-2 sm:gap-3 rounded-xl bg-gray-50 p-3 sm:p-4">
                <Building2 size={18} className="mt-0.5 shrink-0 text-gray-500" />
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">Organizer</p>
                  <p className="text-sm font-semibold text-gray-800 break-words">{volunteer.organizer || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 rounded-xl bg-gray-50 p-3 sm:p-4">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gray-500" />
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">Location</p>
                  <p className="text-sm font-semibold text-gray-800 break-words">{volunteer.location || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 rounded-xl bg-gray-50 p-3 sm:p-4">
                <Clock size={18} className="mt-0.5 shrink-0 text-gray-500" />
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">Deadline</p>
                  <p className="text-sm font-semibold text-orange-600">{formatDate(volunteer.application_deadline) || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 rounded-xl bg-gray-50 p-3 sm:p-4">
                <Banknote size={18} className="mt-0.5 shrink-0 text-gray-500" />
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">Compensation</p>
                  <p className="text-sm font-semibold text-gray-800 break-words">
                    {isPaid
                      ? volunteer.volunteer_payment
                        ? `NPR ${volunteer.volunteer_payment}`
                        : "Stipend Provided"
                      : "Unpaid Volunteer Role"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 rounded-xl bg-gray-50 p-3 sm:p-4">
                <Banknote size={18} className="mt-0.5 shrink-0 text-gray-500" />
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">Application Fee</p>
                  <p className="text-sm font-semibold text-[#0000ff]">Free</p>
                </div>
              </div>
              {volunteer.districts && volunteer.districts.length > 0 && (
                <div className="flex items-start gap-2 sm:gap-3 rounded-xl bg-gray-50 p-3 sm:p-4">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-gray-500" />
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">Participating Districts</p>
                    <p className="text-sm font-semibold text-gray-800 break-words">{volunteer.districts.join(", ")}</p>
                  </div>
                </div>
              )}
            </div>

            {volunteer.description && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">About This Opportunity</h2>
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: volunteer.description }}
                />
              </div>
            )}

            {(volunteer.specific_dates?.length > 0 || volunteer.date_mode === "range") && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={18} />
                  Schedule
                </h2>
                <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                  {volunteer.date_mode === "range" && volunteer.range_start && volunteer.range_end && (
                    <p className="text-sm text-gray-700">
                      <strong>Date Range:</strong> {formatDate(volunteer.range_start)} &mdash; {formatDate(volunteer.range_end)}
                    </p>
                  )}
                  {volunteer.specific_dates && volunteer.specific_dates.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Available Dates:</p>
                      <div className="flex flex-wrap gap-2">
                        {volunteer.specific_dates.map((date: string, i: number) => (
                          <span key={i} className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 sm:px-3 sm:py-1 text-xs font-medium text-blue-700">
                            {formatDate(date)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={() => router.push(`/volunteer/apply/${volunteer.id}`)}
              className="w-full sm:w-auto rounded-lg bg-[#0000ff] px-6 sm:px-8 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-800"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
