"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Building2, Download, Share2 } from "lucide-react";

interface UniversityBannerProps {
  university: any;
  name: string;
  id: number;
  contactData: Record<string, any>;
  aboutData: Record<string, any>;
  isFollowed: boolean;
  followLoading: boolean;
  toggleFollow: () => void;
  setShowUnfollowDialog: (show: boolean) => void;
  setIsShareModalOpen: (show: boolean) => void;
}

export default function UniversityBanner({
  university: uni,
  name,
  id,
  contactData,
  aboutData,
  isFollowed,
  followLoading,
  toggleFollow,
  setShowUnfollowDialog,
  setIsShareModalOpen,
}: UniversityBannerProps) {
  return (
    <>
      {/* Banner */}
      <div
        className="relative w-full bg-brand-blue bg-cover bg-center bg-no-repeat aspect-[16/3] px-4 sm:px-0"
        style={
          uni?.cover ? { backgroundImage: `url(${uni.cover})` } : undefined
        }
      />

      <div className="relative bg-white px-4 sm:px-0">
        <div className="relative mx-auto max-w-[1400px] pb-8">
          {/* Logo */}
          <div className="relative -mt-2 z-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white p-1.5 md:absolute md:-top-4 md:left-0 md:h-[150px] md:w-[150px]">
            {uni?.logo ? (
              <Image
                src={uni.logo}
                alt={`${name} logo`}
                width={150}
                height={150}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-blue rounded-sm" />
            )}
          </div>

          {/* Profile Header */}
          <div className="flex flex-col items-start justify-between pt-4 md:pt-24 md:pl-[170px] lg:flex-row lg:items-end lg:pt-6 lg:pl-[170px]">
            <div className="w-full space-y-3 lg:w-auto">
              <div className="flex items-center gap-2">
                <h1 className="text-[18px] font-bold tracking-tight text-gray-900 md:text-[24px] lg:text-3xl truncate">
                  {name}
                </h1>
                {uni?.verified && (
                  <BadgeCheck className="h-6 w-6 shrink-0 fill-blue-500 text-white" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium md:text-[14px]">
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-location-dot text-gray-500"></i>
                  <span className="text-gray-600">{contactData?.district || uni?.location || ""}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  <span className="font-bold text-gray-900">{uni?.rating ?? "—"}</span>
                  <span className="text-gray-500 whitespace-nowrap">({uni?.review_count ?? 0} Reviews)</span>
                </div>
                {uni?.website && (
                  <a href={uni.website.startsWith("http") ? uni.website : `https://${uni.website}`} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-1 text-[13px] font-medium tracking-wide text-brand-blue hover:text-brand-hover">
                    <i className="fa-solid fa-globe text-gray-500 text-[12px]"></i>
                    {uni.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
              <button
                type="button"
                disabled={followLoading}
                onClick={() => {
                  if (isFollowed) {
                    setShowUnfollowDialog(true);
                  } else {
                    toggleFollow();
                  }
                }}
                className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition-colors md:px-4 md:py-1.5 md:text-[13px] disabled:opacity-50 ${
                  isFollowed
                    ? "bg-green-300 text-gray-800 hover:bg-green-400"
                    : "bg-brand-blue text-white hover:bg-brand-hover"
                }`}
              >
                {followLoading ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  <i className={`fa-solid ${isFollowed ? "fa-check" : "fa-plus"}`}></i>
                )}
                {isFollowed ? "Following" : "Follow"}
              </button>
            </div>

            <div className="hidden mt-8 w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1 md:flex lg:mt-0 lg:w-auto lg:gap-3 lg:overflow-visible lg:pb-0">
              <Link
                href={`/universities/${id}/affiliated-colleges`}
                className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-brand-blue px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-hover lg:px-5 lg:py-3 lg:text-[15px]"
              >
                <Building2 className="h-4 w-4" />
                View Affiliated Colleges
              </Link>
              {(aboutData?.prospectus_url as string) ? (
                <a
                  href={aboutData?.prospectus_url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:px-5 lg:py-3 lg:text-[15px]"
                >
                  <Download className="h-4 w-4" />
                  <span>{aboutData?.prospectus_title as string || "Prospectus"}</span>
                </a>
              ) : null}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="shrink-0 flex items-center justify-center rounded-md border border-gray-200 bg-white p-2.5 text-gray-700 transition-colors hover:bg-gray-50 lg:p-3"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
