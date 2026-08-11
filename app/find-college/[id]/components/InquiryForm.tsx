"use client";

import React, { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ContactInfoRow } from "./index";
import AboutVideoInteractive from "./AboutVideoInteractive";

interface InquiryFormProps {
  name: string;
  locationText: string;
  website: string;
  websiteHref: string;
  college: any;
  collegeId: number | null;
  isAuthenticated: boolean;
  mappedPrograms: any[] | null;
  isAskQuestionOpen: boolean;
  setIsAskQuestionOpen: (v: boolean) => void;
  instVideos?: any;
}

const InquiryForm: React.FC<InquiryFormProps> = ({
  name,
  locationText,
  website,
  websiteHref,
  college,
  collegeId,
  isAuthenticated,
  mappedPrograms,
  isAskQuestionOpen,
  setIsAskQuestionOpen,
  instVideos,
}) => {
  const router = useRouter();

  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryCourse, setInquiryCourse] = useState("");
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const inquiryTouched = useRef(false);

  const [askName, setAskName] = useState("");
  const [askEmail, setAskEmail] = useState("");
  const [askPhone, setAskPhone] = useState("");
  const [askMessage, setAskMessage] = useState("");
  const [askSending, setAskSending] = useState(false);
  const [askSent, setAskSent] = useState(false);
  const askTouched = useRef(false);

  const inquiryErrors = useMemo(
    () => ({
      name:
        inquiryName && inquiryName.trim().length < 2
          ? "Name must be at least 2 characters"
          : "",
      email:
        inquiryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiryEmail)
          ? "Enter a valid email"
          : "",
      phone:
        inquiryPhone && !/^9\d{9}$/.test(inquiryPhone)
          ? "Must be 10 digits starting with 9"
          : "",
    }),
    [inquiryName, inquiryEmail, inquiryPhone],
  );

  const askErrors = useMemo(
    () => ({
      name:
        askName && askName.trim().length < 2
          ? "Name must be at least 2 characters"
          : "",
      email:
        askEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(askEmail)
          ? "Enter a valid email"
          : "",
      phone:
        askPhone && !/^9\d{9}$/.test(askPhone)
          ? "Must be 10 digits starting with 9"
          : "",
    }),
    [askName, askEmail, askPhone],
  );

  const inquiryValid =
    inquiryName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiryEmail) &&
    (!inquiryPhone || /^9\d{9}$/.test(inquiryPhone));
  const askValid =
    askName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(askEmail) &&
    (!askPhone || /^9\d{9}$/.test(askPhone)) &&
    askMessage.trim().length > 0;

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeId) return;
    setInquirySending(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const subject = `Inquiry about ${name} - ${inquiryCourse || "General"}`;
      const content = `Name: ${inquiryName}\nEmail: ${inquiryEmail}\nPhone: ${inquiryPhone ? "+977" + inquiryPhone : "Not provided"}\nCourse: ${inquiryCourse || "General"}\n\n${inquiryCourse || "General inquiry"}`;
      await fetch(`${API_BASE}/api/v1/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ institution_id: Number(collegeId), content, subject, client_message_id: crypto.randomUUID() }),
      });
      setInquirySent(true);
    } catch {
      /* silently fail */
    } finally {
      setInquirySending(false);
    }
  };

  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeId || !isAuthenticated) return;
    setAskSending(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const subject = `Question about ${name}`;
      const content = askMessage;
      await fetch(`${API_BASE}/api/v1/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ institution_id: Number(collegeId), content, subject, client_message_id: crypto.randomUUID() }),
      });
      setAskSent(true);
    } catch {
      /* silently fail */
    } finally {
      setAskSending(false);
    }
  };

  return (
    <div className="space-y-6 lg:col-span-1 lg:w-full lg:max-w-[400px] lg:justify-self-end">
      {instVideos && instVideos.length > 0 && (
        <AboutVideoInteractive videos={instVideos} />
      )}
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-10">
        <h3 className="mb-8 text-2xl font-bold text-gray-900">
          Contact Information
        </h3>
        <div className="flex flex-col gap-3">
          {locationText && (
            <ContactInfoRow
              icon="fa-solid fa-location-dot"
              title="Address"
              value={locationText}
              badge="bg-brand-blue/5 text-[#0000FF]"
            />
          )}
          {(college?.contact_phone || college?.phone) && (
            <ContactInfoRow
              icon="fa-solid fa-phone"
              title="Phone"
              value={college?.contact_phone || college?.phone}
              badge="bg-emerald-50 text-emerald-600"
            />
          )}
          {(college?.contact_email || college?.email) && (
            <ContactInfoRow
              icon="fa-solid fa-envelope"
              title="Email"
              value={college?.contact_email || college?.email}
              badge="bg-red-50 text-red-500"
              link
              linkHref={`mailto:${college?.contact_email || college?.email}`}
            />
          )}
          {website && (
            <ContactInfoRow
              icon="fa-solid fa-globe"
              title="Website"
              value={website}
              badge="bg-purple-50 text-purple-600"
              link
              linkHref={websiteHref}
            />
          )}
          {(college?.facebook_url ||
            college?.instagram_url ||
            college?.tiktok_url ||
            college?.youtube_url ||
            college?.linkedin_url) && (
            <div className="w-full">
              <h3 className="text-[15px] font-bold text-gray-900">
                Social Media
              </h3>
              <div className="mt-3 flex gap-5 text-[26px]">
                {college?.facebook_url && (
                  <a
                    href={college.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1877F2] transition-transform hover:scale-110"
                    title="Facebook"
                  >
                    <i className="fa-brands fa-facebook"></i>
                  </a>
                )}
                {college?.instagram_url && (
                  <a
                    href={college.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#E4405F] transition-transform hover:scale-110"
                    title="Instagram"
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                )}
                {college?.tiktok_url && (
                  <a
                    href={college.tiktok_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-black transition-transform hover:scale-110"
                    title="TikTok"
                  >
                    <i className="fa-brands fa-tiktok"></i>
                  </a>
                )}
                {college?.youtube_url && (
                  <a
                    href={college.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#FF0000] transition-transform hover:scale-110"
                    title="YouTube"
                  >
                    <i className="fa-brands fa-youtube"></i>
                  </a>
                )}
                {college?.linkedin_url && (
                  <a
                    href={college.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0A66C2] transition-transform hover:scale-110"
                    title="LinkedIn"
                  >
                    <i className="fa-brands fa-linkedin"></i>
                  </a>
                )}
              </div>
            </div>
          )}
          <div className="mt-4 h-32 w-full overflow-hidden rounded-md border border-gray-200">
            <iframe
              src={
                college?.map_url ||
                `https://www.google.com/maps?q=${encodeURIComponent(name + " " + locationText)}&output=embed`
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
              title={`Map of ${name}`}
            ></iframe>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-2 text-[18px] font-bold text-gray-900">
          Request Information
        </h3>
        {!isAuthenticated ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm mb-4">
              Please log in to send an inquiry to this institution.
            </p>
            <button
              onClick={() =>
                router.push(
                  `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
                )
              }
              className="rounded-md bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Log In to Continue
            </button>
          </div>
        ) : inquirySent ? (
          <div className="text-center py-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto">
              <i className="fa-solid fa-check text-green-600 text-xl"></i>
            </div>
            <p className="text-gray-900 font-semibold">Inquiry Sent!</p>
            <p className="text-sm text-gray-500 mt-1">
              The institution will get back to you soon.
            </p>
            <button
              onClick={() => router.push("/user/dashboard?tab=message")}
              className="mt-4 rounded-md bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:bg-brand-hover transition-colors"
            >
              <i className="fa-regular fa-message mr-1.5"></i>View in Messages
            </button>
          </div>
        ) : (
          <>
            <p className="mb-5 text-[13px] text-gray-500">
              Fill the form and our admission counselor will contact you.
            </p>
            <form className="space-y-3" onSubmit={handleInquirySubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={inquiryName}
                  onChange={(e) => {
                    setInquiryName(e.target.value);
                    inquiryTouched.current = true;
                  }}
                  className={`w-full rounded-md border px-4 py-3 text-[13.5px] focus:outline-none focus:ring-0 ${inquiryTouched.current && inquiryErrors.name ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`}
                />
                {inquiryTouched.current && inquiryErrors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {inquiryErrors.name}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={inquiryEmail}
                  onChange={(e) => {
                    setInquiryEmail(e.target.value);
                    inquiryTouched.current = true;
                  }}
                  className={`w-full rounded-md border px-4 py-3 text-[13.5px] focus:outline-none focus:ring-0 ${inquiryTouched.current && inquiryErrors.email ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`}
                />
                {inquiryTouched.current && inquiryErrors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {inquiryErrors.email}
                  </p>
                )}
              </div>
              <div>
                <div
                  className="flex rounded-md border overflow-hidden focus-within:ring-0 focus-within:ring-brand-blue/20 focus-within:border-brand-blue"
                  style={
                    inquiryTouched.current && inquiryErrors.phone
                      ? { borderColor: "#fca5a5" }
                      : { borderColor: "#e5e7eb" }
                  }
                >
                  <span className="flex items-center bg-gray-100 px-3 text-sm text-gray-500 font-medium border-r border-brand-blue">
                    +977
                  </span>
                  <input
                    type="tel"
                    placeholder="98XXXXXXXX"
                    maxLength={10}
                    value={inquiryPhone}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      setInquiryPhone(v);
                      inquiryTouched.current = true;
                    }}
                    className="w-full bg-gray-50 px-4 py-3 text-[13.5px] focus:outline-none"
                  />
                </div>
                {inquiryTouched.current && inquiryErrors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {inquiryErrors.phone}
                  </p>
                )}
              </div>
              <select
                value={inquiryCourse}
                onChange={(e) => setInquiryCourse(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-[13.5px] text-gray-600 focus:border-brand-blue focus:outline-none focus:ring-0 focus:ring-brand-blue/20"
              >
                <option value="">Select Course of Interest</option>
                {(mappedPrograms || []).map((p: any) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={inquirySending || !inquiryValid}
                className="mt-2 w-full rounded-md bg-brand-blue py-3.5 text-[14px] font-bold text-white shadow-brand-blue/20 transition-colors hover:bg-brand-hover disabled:opacity-50"
              >
                {inquirySending ? "Sending..." : "Submit Request"}
              </button>
            </form>
          </>
        )}
      </div>

      {isAskQuestionOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setIsAskQuestionOpen(false);
            setAskSent(false);
          }}
        >
          <div
            className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Inquiry</h3>
              <button
                onClick={() => {
                  setIsAskQuestionOpen(false);
                  setAskSent(false);
                }}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <i className="fa-solid fa-xmark text-gray-500"></i>
              </button>
            </div>
            {askSent ? (
              <div className="text-center py-8 px-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mx-auto">
                  <i className="fa-solid fa-check text-green-600 text-2xl"></i>
                </div>
                <p className="text-gray-900 font-bold text-lg">
                  Question Sent!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  The institution will respond to your inquiry soon.
                </p>
                <div className="mt-6 flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setIsAskQuestionOpen(false);
                      setAskSent(false);
                    }}
                    className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => router.push("/user/dashboard?tab=message")}
                    className="rounded-md bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover transition-colors"
                  >
                    <i className="fa-regular fa-message mr-1.5"></i>View in
                    Messages
                  </button>
                </div>
              </div>
            ) : (
              <form className="px-6 py-4 space-y-4" onSubmit={handleAskSubmit}>
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={askName}
                    onChange={(e) => {
                      setAskName(e.target.value);
                      askTouched.current = true;
                    }}
                    className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-0 ${askTouched.current && askErrors.name ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`}
                  />
                  {askTouched.current && askErrors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {askErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={askEmail}
                    onChange={(e) => {
                      setAskEmail(e.target.value);
                      askTouched.current = true;
                    }}
                    className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-0 ${askTouched.current && askErrors.email ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`}
                  />
                  {askTouched.current && askErrors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {askErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <div
                    className="flex rounded-md border overflow-hidden focus-within:ring-0 focus-within:ring-brand-blue/20 focus-within:border-brand-blue"
                    style={
                      askTouched.current && askErrors.phone
                        ? { borderColor: "#fca5a5" }
                        : { borderColor: "#e5e7eb" }
                    }
                  >
                    <span className="flex items-center bg-gray-100 px-3 text-sm text-gray-500 font-medium border-r border-gray-200">
                      +977
                    </span>
                    <input
                      type="tel"
                      placeholder="98XXXXXXXX"
                      maxLength={10}
                      value={askPhone}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        setAskPhone(v);
                        askTouched.current = true;
                      }}
                      className="w-full bg-gray-50 px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  {askTouched.current && askErrors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {askErrors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <textarea
                    placeholder="Type your message..."
                    rows={4}
                    value={askMessage}
                    maxLength={500}
                    onChange={(e) => {
                      setAskMessage(e.target.value);
                      askTouched.current = true;
                    }}
                    className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-0 resize-none ${askTouched.current && !askMessage.trim() ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`}
                  />
                  <div className="flex justify-between mt-1">
                    {askTouched.current && !askMessage.trim() ? (
                      <p className="text-xs text-red-500">
                        Message is required
                      </p>
                    ) : (
                      <span />
                    )}
                    <p
                      className={`text-xs ${askMessage.length >= 500 ? "text-red-500 font-medium" : "text-gray-400"}`}
                    >
                      {askMessage.length}/500
                    </p>
                  </div>
                </div>
                {isAuthenticated ? (
                  <button
                    type="submit"
                    disabled={askSending || !askValid}
                    className="w-full rounded-md bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-hover disabled:opacity-50 transition-colors"
                  >
                    {askSending ? "Sending..." : "Submit Question"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
                      )
                    }
                    className="w-full rounded-md bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-hover transition-colors"
                  >
                    <i className="fa-solid fa-lock mr-1.5"></i>Login to Submit
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryForm;
