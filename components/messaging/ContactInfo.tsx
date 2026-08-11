"use client";

import React, { useEffect, useState } from "react";
import { Conversation } from "@/services/message.api";
import { dashboardApi } from "@/services/dashboard.api";
import { collegeApi } from "@/services/college.api";

interface ContactInfoProps {
  conversation: Conversation;
  userRole: "student" | "institution";
  onClose?: () => void;
}

interface InstitutionProfile {
  institution_name?: string;
  about?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  district?: string;
  logo_url?: string;
}

interface StudentProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  image_url: string;
}

export default function ContactInfo({ conversation, userRole, onClose }: ContactInfoProps) {
  const [instProfile, setInstProfile] = useState<InstitutionProfile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (userRole === "student" && conversation.institution_id) {
          const resp = await collegeApi.getPublicInstitutionById(conversation.institution_id);
          setInstProfile(resp?.data || resp);
        } else if (userRole === "institution" && conversation.student_id) {
          const resp = await dashboardApi.getStudentProfile(conversation.student_id);
          setStudentProfile(resp?.data || resp);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [userRole, conversation.institution_id, conversation.student_id]);

  const name = userRole === "student"
    ? (instProfile?.institution_name || conversation.institution_name || "Unknown")
    : (studentProfile ? `${studentProfile.first_name} ${studentProfile.last_name}` : conversation.student_name || "Unknown");

  function formatAddress(raw: string): string {
    try {
      const parsed = JSON.parse(raw);
      const parts: string[] = [];
      if (parsed.localLevel) parts.push(parsed.localLevel);
      if (parsed.district) parts.push(parsed.district);
      if (parsed.province) parts.push(parsed.province);
      if (parsed.country) parts.push(parsed.country);
      return parts.length > 0 ? parts.join(", ") : raw;
    } catch {
      return raw;
    }
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const [aboutOpen, setAboutOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);

  return (
    <aside className="w-full md:w-80 lg:w-[360px] flex-shrink-0 bg-white border-l border-slate-200 flex flex-col z-20 transition-all duration-300">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {userRole === "student" ? "College Info" : "Student Info"}
        </span>
        {onClose && (
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md">
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold mx-auto ring-2 ring-slate-200">
              {initials}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{name}</h3>

            <div className="flex flex-col items-center justify-center space-y-1 mt-2 text-slate-500 text-xs">
              <div className="flex items-center space-x-1.5">
                <i className="fa-solid fa-user w-3"></i>
                <span>{userRole === "student" ? "Institution" : "Student"}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <i className="fa-regular fa-calendar w-3"></i>
                <span>
                  {conversation.last_message_at
                    ? "Last active " + new Date(conversation.last_message_at).toLocaleDateString()
                    : "Never active"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-200" />

        {loading ? (
          <div className="text-center text-slate-400 text-xs py-4">Loading...</div>
        ) : (
          <>
            <div className="border-b border-slate-200 pb-4">
              <button
                onClick={() => setAboutOpen(!aboutOpen)}
                className="w-full flex items-center justify-between text-left font-bold text-slate-900 py-1 text-xs"
              >
                <span>About</span>
                <i className={`fa-solid fa-chevron-up text-[10px] text-slate-400 transition-transform ${aboutOpen ? "" : "rotate-180"}`}></i>
              </button>
              <div style={{ display: aboutOpen ? "block" : "none" }} className="space-y-3 pt-2 text-xs">
                {userRole === "student" && instProfile?.about ? (
                  <div
                    className="text-slate-600 leading-relaxed prose prose-xs max-w-none"
                    dangerouslySetInnerHTML={{ __html: instProfile.about }}
                  />
                ) : userRole === "institution" && studentProfile?.bio ? (
                  <p className="text-slate-600 leading-relaxed">{studentProfile.bio}</p>
                ) : (
                  <p className="text-slate-400 italic">No information available</p>
                )}
              </div>
            </div>

            <div className="pb-4">
              <button
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="w-full flex items-center justify-between text-left font-bold text-slate-900 py-1 text-xs"
              >
                <span>Contact Details</span>
                <i className={`fa-solid fa-chevron-up text-[10px] text-slate-400 transition-transform ${detailsOpen ? "" : "rotate-180"}`}></i>
              </button>
              <div style={{ display: detailsOpen ? "block" : "none" }} className="space-y-2 pt-2 text-xs">
                {userRole === "student" ? (
                  <>
                    {instProfile?.website_url && (
                      <div>
                        <p className="text-slate-400 font-medium">Website</p>
                        <a href={instProfile.website_url} target="_blank" rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-semibold mt-0.5 block">
                          {instProfile.website_url}
                        </a>
                      </div>
                    )}
                    {instProfile?.contact_email && (
                      <div>
                        <p className="text-slate-400 font-medium">Email</p>
                        <p className="text-slate-800 font-semibold mt-0.5">{instProfile.contact_email}</p>
                      </div>
                    )}
                    {instProfile?.contact_phone && (
                      <div>
                        <p className="text-slate-400 font-medium">Phone</p>
                        <p className="text-slate-800 font-semibold mt-0.5">{instProfile.contact_phone}</p>
                      </div>
                    )}
                    {instProfile?.district && (
                      <div>
                        <p className="text-slate-400 font-medium">Location</p>
                        <p className="text-slate-800 font-semibold mt-0.5">{instProfile.district}</p>
                      </div>
                    )}
                    {!instProfile?.website_url && !instProfile?.contact_email && !instProfile?.contact_phone && !instProfile?.district && (
                      <p className="text-slate-400 italic">No contact details available</p>
                    )}
                  </>
                ) : (
                  <>
                    {studentProfile?.email && (
                      <div>
                        <p className="text-slate-400 font-medium">Email</p>
                        <p className="text-slate-800 font-semibold mt-0.5">{studentProfile.email}</p>
                      </div>
                    )}
                    {studentProfile?.phone && (
                      <div>
                        <p className="text-slate-400 font-medium">Phone</p>
                        <p className="text-slate-800 font-semibold mt-0.5">{studentProfile.phone}</p>
                      </div>
                    )}
                    {studentProfile?.address && (
                      <div>
                        <p className="text-slate-400 font-medium">Address</p>
                        <p className="text-slate-800 font-semibold mt-0.5">{formatAddress(studentProfile.address)}</p>
                      </div>
                    )}
                    {!studentProfile?.email && !studentProfile?.phone && !studentProfile?.address && (
                      <p className="text-slate-400 italic">No contact details available</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
