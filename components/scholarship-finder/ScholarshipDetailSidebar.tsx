"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Phone, Mail, Globe, Send, ChevronLeft, ChevronRight, ExternalLink, Bell, MapPin } from "lucide-react";
import { CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/services/AuthContext";
import apiService from "@/services/apiService";
import { toast } from "sonner";

export function ContactSidebar({ scholarship }: { scholarship: any }) {
  const provider = scholarship.provider || "";
  const providerId = scholarship.provider_id;
  const location = scholarship.location || "Nationwide Scholarship Program";
  const phone = scholarship.provider_phone || scholarship.phone || "";
  const email = scholarship.provider_email || scholarship.email || "";
  const website = scholarship.provider_website || scholarship.provider_domain || "";
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-[18px] font-bold text-gray-900">Contact Information</h3>
      <ul className="space-y-4">
        <li className="flex items-start gap-3 text-[13px]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <MapPin size={16} />
          </div>
          <div>
            <span className="block text-[13px] font-bold text-gray-900">Coverage</span>
            <span className="text-[12px] font-medium text-gray-500">{location}</span>
          </div>
        </li>
        <li className="flex items-center gap-3 text-[13px]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Phone size={16} />
          </div>
          <div>
            <span className="block text-[13px] font-bold text-gray-900">Phone</span>
            <a href={`tel:${phone || '9851131074'}`} className="text-[12px] font-medium text-gray-500 transition hover:text-emerald-600">{phone || '9851131074'}</a>
          </div>
        </li>
        <li className="flex items-center gap-3 text-[13px]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Mail size={16} />
          </div>
          <div>
            <span className="block text-[13px] font-bold text-gray-900">Email</span>
            <a href={`mailto:${email || 'info@projectshiksha.hundredgroupnepal.org'}`} className="text-[12px] font-medium text-gray-500 transition hover:text-red-500">{email || 'info@projectshiksha.hundredgroupnepal.org'}</a>
          </div>
        </li>
        <li className="flex items-center gap-3 text-[13px]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
            <Globe size={16} />
          </div>
          <div>
            <span className="block text-[13px] font-bold text-gray-900">Website</span>
            <a href={website.startsWith("http") ? website : `https://${website}` || "https://projectshiksha.hundredgroupnepal.org"} target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium text-blue-500 transition hover:underline">{website || "projectshiksha.hundredgroupnepal.org"}</a>
          </div>
        </li>
      </ul>

      <div className="mt-5">
        <h4 className="mb-3 text-[13px] font-bold text-gray-900">Follow Us</h4>
        <div className="flex items-center gap-3 text-xl">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-[#1877F2] transition hover:opacity-80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-[#E4405F] transition hover:opacity-80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-[#FF0000] transition hover:opacity-80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-5">
        <h4 className="mb-3 text-[13px] font-bold text-gray-900">Location</h4>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.4762842059996!2d85.3897!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190c0b8c5e01%3A0x1234567890abcdef!2sGokarneshwor%2008%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1234567890" width="100%" height="150" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>

      {providerId && providerId > 0 && (
        <div className="mt-6">
          <Link href={`/providers/${providerId}`} className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-[14px] font-bold text-gray-900 transition hover:bg-gray-50 hover:text-blue-600 shadow-sm">
            View Provider Profile
            <ExternalLink size={16} />
          </Link>
        </div>
      )}
    </div>


  );
}

export function PartnerMessageCarousel({ messages, getImageUrl }: { messages?: any[]; getImageUrl?: (url: string) => string }) {
  const resolveUrl = (url: string) => getImageUrl ? getImageUrl(url) : url;
  const realMessages = (messages && messages.length > 0)
    ? messages.map((p: any) => ({
        logo: resolveUrl(p.logo || ""),
        message: p.message || "",
        author: p.name || "",
        subtitle: p.label || "",
      }))
    : [];

  const fallback = [
    { logo: "https://projectshiksha.hundredgroupnepal.org/images/shiks.jpg", message: "\"Empower minds, transform futures: Free education for all! We believe every talented student deserves access to quality education regardless of their financial background.\"", author: "Project Shiksha Team", subtitle: "100 Group, Sowers Action Nepal & Hong Kong, RONB" },
    { logo: "https://projectshiksha.hundredgroupnepal.org/images/hundred.jpg", message: "\"At 100 Group, we are committed to creating opportunities for underprivileged students. Education is the foundation of a prosperous society, and we are proud to lead this initiative.\"", author: "100 Group", subtitle: "Lead Organizer" },
    { logo: "https://projectshiksha.hundredgroupnepal.org/images/sa_new.jpeg", message: "\"Sowers Action Nepal believes in serving communities through education, healthcare, and sustainable development. This scholarship program embodies our mission to uplift those in need.\"", author: "Sowers Action Nepal", subtitle: "Lead Organizer" },
    { logo: "https://projectshiksha.hundredgroupnepal.org/images/ronb.jpg", message: "\"RONB is dedicated to connecting Nepalis worldwide for social causes. Project Shiksha is a testament to what we can achieve when we come together for a common goal.\"", author: "Routine of Nepal Banda (RONB)", subtitle: "Lead Organizer" },
  ];

  const items = realMessages.length > 0 ? realMessages : fallback;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % items.length), 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  const goTo = (i: number) => setCurrent(i);
  const prev = () => setCurrent((p) => (p - 1 + items.length) % items.length);
  const next = () => setCurrent((p) => (p + 1) % items.length);

  const m = items[current];

  return (
    <div>
      <div className="min-h-[280px] rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-white/30 bg-white">
              <img src={m.logo} alt={m.author} className="h-full w-full object-contain p-1" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-[15px] font-bold text-white">Partner Message</h3>
              <p className="mb-3 text-[13px] font-medium leading-relaxed text-white">{m.message}</p>
            </div>
          </div>
          <div className="border-t border-blue-500/50 pt-4">
            <p className="text-[13px] font-bold text-white">{m.author}</p>
            <p className="text-[11px] text-blue-200">{m.subtitle}</p>
          </div>
        </div>
      </div>
      {items.length > 1 && (
      <div className="mt-2 flex items-center justify-center gap-3">
        <button type="button" onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full text-blue-600 transition hover:bg-blue-50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button key={i} type="button" onClick={() => goTo(i)} className={`h-2.5 w-2.5 rounded-full transition ${i === current ? "bg-blue-600" : "bg-gray-300 hover:bg-blue-400"}`} />
          ))}
        </div>
        <button type="button" onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full text-blue-600 transition hover:bg-blue-50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      )}
    </div>
  );
}

export function RequestInfoForm({ scholarship }: { scholarship: any }) {
  const { user, isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState(user ? `${user.first_name} ${user.last_name}`.trim() : "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = useCallback(() => {
    const errs: typeof errors = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) errs.email = "Please enter a valid email address";
    if (phone && !/^9\d{9}$/.test(phone)) errs.phone = "Phone must be 10 digits starting with 9";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [email, phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    if (!isAuthenticated || !user) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      await apiService.post("/api/v1/scholarship-providers/messages/from-user", {
        provider_id: scholarship.provider_id,
        user_id: user.id,
        user_name: fullName,
        user_email: email,
        subject: `Inquiry from ${fullName}`,
        content: message,
        phone: phone || undefined,
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage("");
        setPhone("");
      }, 2000);
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded-md border border-gray-100 bg-white p-6 sm:p-7">
        <h2 className="mb-2 text-[22px] font-bold text-gray-900">Request Information</h2>
        <p className="mb-4 text-[15px] font-medium leading-snug text-gray-500">Please log in to send a message to the scholarship provider.</p>
        <Link href="/login" className="flex w-full items-center justify-center gap-2.5 rounded-md bg-blue-600 py-4 text-[15px] font-bold text-white transition-all hover:bg-blue-700">
          Log In to Send Message
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-100 bg-white p-6 sm:p-7">
      <h2 className="mb-2 text-[22px] font-bold text-gray-900">Request Information</h2>
      <p className="mb-6 text-[15px] font-medium leading-snug text-gray-500">Send a message to the scholarship provider.</p>
      {sent ? (
        <div className="rounded-md bg-green-50 p-5 text-center">
          <CheckCircle size={32} className="mx-auto mb-2 text-green-600" />
          <p className="text-[15px] font-semibold text-green-700">Submitted</p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded-md border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
            required
            className={`w-full rounded-md border bg-white px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-1 ${
              errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-blue-600 focus:ring-blue-600"
            }`}
          />
          {errors.email && <p className="-mt-2 text-xs text-red-500">{errors.email}</p>}
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
            className={`w-full rounded-md border bg-white px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-1 ${
              errors.phone ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-blue-600 focus:ring-blue-600"
            }`}
          />
          {errors.phone && <p className="-mt-2 text-xs text-red-500">{errors.phone}</p>}
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full resize-none rounded-md border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2.5 rounded-md bg-blue-600 py-4 text-[15px] font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-60"
            >
              <Send size={18} /> {submitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function RelatedScholarships({ scholarships }: { scholarships: any[] }) {
  return (
    <div className="mt-2 flex flex-col gap-5">
      <h2 className="text-xl font-bold text-gray-800">Related Scholarships</h2>
      {scholarships.length > 0 ? scholarships.map((item: any) => (
        <Link key={item.id} href={`/scholarship-finder/${item.id}`} className="group rounded-md border border-gray-100 bg-white p-5 transition-all hover:border-blue-200">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">Grant</span>
          </div>
          <h3 className="text-[14.5px] font-bold leading-tight text-gray-800 transition-colors group-hover:text-blue-600">{item.title}</h3>
          <p className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
            <Clock size={14} className="text-gray-400" /> Deadline: {item.deadline || "Soon"}
          </p>
        </Link>
      )) : (
        <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
          <p className="text-xs font-bold text-gray-400">No similar scholarship found.</p>
        </div>
      )}
    </div>
  );
}
