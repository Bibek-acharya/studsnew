"use client";

import React from "react";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiService, getImageUrl } from "@/services/api";
import { Calendar, ChevronRight } from "lucide-react";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  return `${diffMonths} months ago`;
}

function toSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "volunteer";
}

export default function VolunteerDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [volunteer, setVolunteer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const res = await apiService.getPublicVolunteerByID(slug);
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
  }, [slug]);

  const isPaid = volunteer?.volunteer_type === "paid";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (notFound || !volunteer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg font-semibold">Volunteer opportunity not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 antialiased pb-20 min-h-screen">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
          <button onClick={() => router.push("/")} className="hover:text-gray-800 transition-colors">Home</button>
          <ChevronRight size={14} className="text-gray-400" />
          <button onClick={() => router.push("/volunteer")} className="hover:text-gray-800 transition-colors">Volunteer</button>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-[300px]">{volunteer.title}</span>
        </nav>

        {/* Header above image */}
        <div className="px-2 md:px-4 mb-8">

          <h1 className="text-3xl md:text-[32px] font-bold tracking-tight text-gray-900 mb-2">{volunteer.title}</h1>
          {/* <p className="text-gray-600 text-lg mb-1">{volunteer.organizer || "—"}</p>
          <p className="text-gray-400 text-sm">{volunteer.location} &bull; {volunteer.created_at ? timeAgo(volunteer.created_at) : ""}</p> */}
        </div>

        {/* Cover Image */}
        <div className="mb-12 px-2 md:px-4">
          <div className="h-[200px] sm:h-[240px] md:h-[320px] w-full rounded-3xl overflow-hidden">
            <img
              src={getImageUrl(volunteer.banner_image)}
              alt={volunteer.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/1200x400?text=Volunteer+Event"; }}
            />
          </div>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-2 md:px-4">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {volunteer.description && (
              <section>
                <h2 className="text-[22px] font-bold mb-4">About this opportunity</h2>
                <div
                  className="rich-text [word-break:keep-all] [&_*]:[word-break:keep-all] [overflow-wrap:break-word] [&_*]:[overflow-wrap:break-word] [&_img]:max-w-full [&_img]:h-auto [&_table]:max-w-full [&_pre]:whitespace-pre-wrap [&_iframe]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: volunteer.description }}
                />
              </section>
            )}


          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-gray-100 rounded-3xl p-7 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)]">
              {isPaid && (
                <>
                  <div className="text-[34px] font-bold text-gray-900 leading-tight">
                    {volunteer.volunteer_payment ? `NPR ${volunteer.volunteer_payment}` : "Stipend"}
                  </div>
                  <div className="text-sm text-gray-500 mb-8 font-medium">Compensation</div>
                </>
              )}

              {/* Details */}
              <div className="text-xs text-gray-400 font-medium mb-5">Details</div>

              <div className="space-y-5 mb-8">
                <div className="flex items-start">
                  <div className="mt-0.5 mr-4 text-gray-500">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-gray-900">{formatDate(volunteer.application_deadline) || "—"}</div>
                    <div className="text-[13px] text-gray-400">Deadline</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-0.5 mr-4 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-gray-900">{isPaid ? "Paid" : "Unpaid"}</div>
                    <div className="text-[13px] text-gray-400">Volunteer Type</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-0.5 mr-4 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-gray-900">Free</div>
                    <div className="text-[13px] text-gray-400">Application Fee</div>
                  </div>
                </div>
              </div>

              {/* Apply button */}
              <button
                onClick={() => router.push(`/volunteer/apply/${volunteer.slug || toSlug(volunteer.title)}`)}
                className="w-full bg-brand-blue hover:bg-brand-hover text-white rounded-full py-3.5 font-semibold text-[15px] transition-colors shadow-sm"
              >
                Apply Now
              </button>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
