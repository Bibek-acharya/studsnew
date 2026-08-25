"use client";

import React from "react";
import Link from "next/link";
import ContactInfoRow from "@/app/find-college/[id]/components/ContactInfoRow";

function getMapEmbedUrl(mapUrl?: string, address?: string): string {
  if (!mapUrl && !address) return "";
  if (!mapUrl) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address || "")}&output=embed`;
  }
  if (mapUrl.includes("/maps/embed") || mapUrl.includes("output=embed")) {
    return mapUrl;
  }
  const iframeMatch = mapUrl.match(/src=["']([^"']+)["']/);
  if (iframeMatch) {
    return iframeMatch[1];
  }
  const placeMatch = mapUrl.match(/google\.com\/maps\/place\/([^/?]+)/);
  if (placeMatch) {
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10000!2d0!3d0!2m2!1f0!2f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2s!4v1`;
  }
  const queryMatch = mapUrl.match(/[?&]q=([^&]+)/);
  if (queryMatch) {
    return `https://www.google.com/maps?q=${queryMatch[1]}&output=embed`;
  }
  const gooGlMatch = mapUrl.match(/maps\.app\.goo\.gl|goo\.gl\/maps/);
  if (gooGlMatch) {
    return mapUrl;
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(mapUrl)}&output=embed`;
}

interface UniversitySidebarProps {
  contactData: Record<string, any>;
  aboutData: Record<string, any>;
  sponsoredInsts: any[];
  id: number;
}

export default function UniversitySidebar({
  contactData,
  aboutData,
  sponsoredInsts,
  id,
}: UniversitySidebarProps) {
  const fullAddress = [contactData?.state, contactData?.district, contactData?.municipality].filter(Boolean).join(" / ");
  const displayAddress = fullAddress || contactData?.address || "";
  const hasAddress = !!displayAddress;
  const hasPhone = !!contactData?.phone;
  const hasEmail = !!contactData?.email;
  const hasWebsite = !!(contactData?.website || aboutData?.website);
  const hasSocial = !!(contactData?.social ||
    contactData?.facebook ||
    contactData?.twitter ||
    contactData?.instagram ||
    contactData?.youtube ||
    contactData?.linkedin);
  const hasMap = !!(contactData?.mapUrl || contactData?.address);
  const hasAny = hasAddress || hasPhone || hasEmail || hasWebsite || hasSocial || hasMap;

  if (!hasAny && sponsoredInsts.length === 0) return null;

  return (
    <div className="space-y-6 lg:col-span-1 lg:w-full lg:max-w-[400px] lg:ml-8 xl:ml-12">
      {hasAny && (
        <div className="w-full rounded-md border border-gray-100 bg-white p-5">
          <h3 className="mb-5 text-[18px] font-bold text-gray-900">
            Contact Information
          </h3>
          <div className="space-y-4">
            {hasAddress && (
              <ContactInfoRow
                icon="fa-solid fa-location-dot"
                title="Address"
                value={displayAddress}
                badge="bg-brand-blue/5 text-[#0000FF]"
              />
            )}
            {hasPhone && (
              <ContactInfoRow
                icon="fa-solid fa-phone"
                title="Phone"
                value={contactData?.phone as string}
                badge="bg-emerald-50 text-emerald-600"
              />
            )}
            {hasEmail && (
              <ContactInfoRow
                icon="fa-solid fa-envelope"
                title="Email"
                value={contactData?.email as string}
                badge="bg-red-50 text-red-500"
                link
                linkHref={`mailto:${contactData?.email || ""}`}
              />
            )}
            {hasWebsite && (
              <ContactInfoRow
                icon="fa-solid fa-globe"
                title="Website"
                value={(contactData?.website as string) || (aboutData?.website as string) || ""}
                badge="bg-purple-50 text-purple-600"
                link
                linkHref={(contactData?.website as string) || (aboutData?.website as string) || "#"}
              />
            )}
            {hasSocial && (
              <div className="w-full">
                <h3 className="text-[15px] font-bold text-gray-900">
                  Social Media
                </h3>
                <div className="mt-3 flex gap-5 text-[26px]">
                  {(contactData?.facebook as string) && (
                    <a
                      href={contactData.facebook as string}
                      className="text-[#1877F2] transition-transform hover:scale-110"
                      title="Facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-facebook"></i>
                    </a>
                  )}
                  {(contactData?.instagram as string) && (
                    <a
                      href={contactData.instagram as string}
                      className="text-[#E4405F] transition-transform hover:scale-110"
                      title="Instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  )}
                  {(contactData?.tiktok as string) && (
                    <a
                      href={contactData.tiktok as string}
                      className="text-black transition-transform hover:scale-110"
                      title="TikTok"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-tiktok"></i>
                    </a>
                  )}
                  {(contactData?.youtube as string) && (
                    <a
                      href={contactData.youtube as string}
                      className="text-[#FF0000] transition-transform hover:scale-110"
                      title="YouTube"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-youtube"></i>
                    </a>
                  )}
                  {(contactData?.linkedin as string) && (
                    <a
                      href={contactData.linkedin as string}
                      className="text-[#0A66C2] transition-transform hover:scale-110"
                      title="LinkedIn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
                  )}
                </div>
              </div>
            )}
            {hasMap && (
              <div className="mt-8 h-40 w-full overflow-hidden rounded-md">
                <iframe
                  src={getMapEmbedUrl(contactData?.mapUrl as string, contactData?.address as string)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-md"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}

      {sponsoredInsts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[20px] font-bold text-gray-900">Affiliated Colleges</h3>
          </div>
          <div className="space-y-4">
            {sponsoredInsts.map((inst: any) => (
              <div key={inst.id} className="bg-white border border-gray-200 rounded-[14px] p-5 flex items-center gap-4 transition-colors">
                <div className="w-[60px] h-[60px] rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 p-1">
                  {inst.logo_url ? (
                    <img src={inst.logo_url} alt={inst.institution_name} className="w-full h-full object-contain rounded" />
                  ) : (
                    <div className="w-full h-full bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center rounded uppercase text-center leading-tight">{inst.institution_name?.charAt(0) || "C"}</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/find-college/${inst.college_id || inst.id}`} className="block">
                    <h4 className="text-[17px] font-bold text-gray-900 truncate hover:text-brand-hover transition-colors" title={inst.institution_name}>{inst.institution_name}</h4>
                  </Link>
                  <div className="flex items-center gap-1.5 text-gray-500 text-[13px] mt-1">
                    <i className="fa-solid fa-location-dot text-xs"></i>
                    <span className="truncate">{inst.district || ""}</span>
                  </div>
                  {inst.website_url && (
                    <a href={inst.website_url.startsWith("http") ? inst.website_url : `https://${inst.website_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-blue text-[13px] font-medium hover:text-brand-hover mt-1">
                      <i className="fa-solid fa-globe text-xs"></i>
                      {inst.website_url.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
