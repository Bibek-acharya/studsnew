"use client";

import React from "react";
import { BadgeCheckIcon, MessageSquarePlus } from "lucide-react";
import { getImageUrl } from "@/services/api";
import { isCollegeVerified } from "../../types";
import { useRouter } from "next/navigation";

interface CollegeHeaderProps {
  name: string;
  locationText: string;
  rating: number;
  reviewsCount: string;
  website: string;
  websiteHref: string;
  instLogo: string | null;
  instBanner: string | null;
  followerCount: number;
  isVerified: boolean;
  college: any;
  isInstitution: boolean;
  isFollowed: boolean;
  showUnfollowDialog: boolean;
  setShowUnfollowDialog: (v: boolean) => void;
  onToggleFollow?: () => void;
  followLoading?: boolean;
  isBookmarked?: boolean;
  bookmarkLoading?: boolean;
  onToggleBookmark?: () => void;
  setIsAskQuestionOpen: (v: boolean) => void;
  setIsShareModalOpen: (v: boolean) => void;
  setIsClaimModalOpen: (v: boolean) => void;
  setIsCounsellingModalOpen: (v: boolean) => void;
}

const CollegeHeader: React.FC<CollegeHeaderProps> = ({
  name,
  locationText,
  rating,
  reviewsCount,
  website,
  websiteHref,
  instLogo,
  instBanner,
  followerCount,
  isVerified,
  college,
  isInstitution,
  isFollowed,
  setShowUnfollowDialog,
  onToggleFollow,
  followLoading,
  isBookmarked,
  bookmarkLoading,
  onToggleBookmark,
  setIsAskQuestionOpen,
  setIsShareModalOpen,
  setIsClaimModalOpen,
  setIsCounsellingModalOpen,
}) => {
  const router = useRouter();
  return (
    <>
      <div className="relative w-full bg-brand-blue overflow-hidden min-h-55 md:min-h-[400px]">
        {instBanner && (
          <img
            src={instBanner}
            alt="College Banner"
            className="w-full h-auto object-cover"
          />
        )}
        <div className="absolute bottom-10 right-4 z-20 md:bottom-6 md:right-6">
          {isVerified ? (
            <button
              onClick={() =>
                router.push(
                  `/counselling?collegeName=${encodeURIComponent(name)}&collegeId=${college?.id || ""}`,
                )
              }
              className="flex items-center gap-2 rounded-md bg-blue-200 text-blue-800 cursor-pointer px-4 py-2 text-xs font-bold transition-all duration-300 md:bg-black/60 md:text-white md:px-6 md:py-3 md:text-base"
            >
              <MessageSquarePlus className="w-4 h-4 md:w-5 md:h-5" />
              <span>Open Counselling</span>
            </button>
          ) : (
            <button
              onClick={() => setIsClaimModalOpen(true)}
              className="flex items-center gap-2 rounded-md bg-blue-200 text-blue-800 px-4 py-1 text-xs font-bold transition-all duration-300 md:bg-black/50 md:text-white md:px-6 md:py-1 md:text-base"
            >
              Is this your college?{" "}
              <span className="underline hover:text-brand-blue cursor-pointer">
                Claim now
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="relative bg-white">
        <div className="relative flex flex-row items-start gap-3 px-6 pb-8 md:block md:px-12 lg:px-24 xl:px-32">
          <div className="relative z-10 -mt-2 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white p-1.5 md:absolute md:-top-4 md:left-12 md:mx-0 md:mt-0 md:h-37.5 md:w-37.5 lg:left-24 xl:left-32">
            {instLogo ? (
              <img
                src={instLogo}
                alt="College Logo"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="h-full w-full rounded-sm bg-brand-blue" />
            )}
          </div>

          <div className="min-w-0 flex-1 pt-1 flex flex-col items-start gap-3 md:items-center md:mt-4 md:pt-0 md:gap-6 lg:mt-0 lg:flex-row lg:items-end lg:justify-between lg:gap-0 lg:pl-42.5">
            <div className="w-full space-y-1.5 md:space-y-3 text-left lg:w-auto">
              <div className="flex items-center justify-start gap-2 pt-0 md:pt-4">
                <h1 className="min-w-0 text-[18px] font-bold tracking-tight text-gray-900 truncate md:text-[24px] md:overflow-visible md:whitespace-normal lg:text-3xl">
                  {name}
                </h1>
                {isCollegeVerified(college?.verified) && (
                  <BadgeCheckIcon className="shrink-0 text-white fill-brand-blue" />
                )}
              </div>
              <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-0.5 text-[12px] font-medium md:gap-x-5 md:gap-y-1 md:text-[14px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <i className="fa-solid fa-location-dot text-gray-500 shrink-0"></i>
                  <span className="text-gray-600 truncate max-w-[120px] md:max-w-none">
                    {locationText}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  <span className="font-bold text-gray-900">{rating}</span>
                  <span className="text-gray-500 whitespace-nowrap">
                    ({reviewsCount} Reviews)
                  </span>
                </div>
                {college?.featured && website && (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden md:flex items-center gap-1 text-[13px] font-medium tracking-wide text-brand-blue transition-colors hover:text-brand-hover"
                  >
                    <i className="fa-solid fa-globe text-gray-500 text-[12px]"></i>
                    {website.toLowerCase()}
                  </a>
                )}
                {followerCount > 0 && (
                  <span className="text-gray-500 hidden md:inline">|</span>
                )}
                <div className="flex items-center gap-1.5 shrink-0">
                  <i className="fa-solid fa-users text-gray-500"></i>
                  <span className="font-bold text-gray-900">
                    {followerCount >= 1000000
                      ? `${(followerCount / 1000000).toFixed(1).replace(/\.0$/, "")}M`
                      : followerCount >= 1000
                        ? `${(followerCount / 1000).toFixed(1).replace(/\.0$/, "")}k`
                        : followerCount}
                  </span>
                  <span className="text-gray-500 whitespace-nowrap">
                    {followerCount === 1 ? "Follower" : "Followers"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={followLoading}
                onClick={() => {
                  if (isFollowed) {
                    setShowUnfollowDialog(true);
                  } else {
                    onToggleFollow?.();
                  }
                }}
                className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition-colors md:px-4 md:py-1.5 md:text-[13px] disabled:opacity-50 ${isFollowed ? "bg-green-300 text-gray-800 hover:bg-green-400" : "bg-brand-blue text-white hover:bg-brand-hover"}`}
              >
                {followLoading ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : isFollowed ? (
                  <>
                    <i className="fa-solid fa-check"></i>Following
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-plus"></i>Follow
                  </>
                )}
              </button>
              <button
                type="button"
                disabled={bookmarkLoading}
                onClick={onToggleBookmark}
                className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition-colors md:px-4 md:py-1.5 md:text-[13px] disabled:opacity-50 ${isBookmarked ? "bg-blue-200 text-blue-800 hover:bg-blue-300" : "border border-gray-300 text-gray-600 hover:bg-gray-100"}`}
              >
                {bookmarkLoading ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : isBookmarked ? (
                  <>
                    <i className="fa-solid fa-bookmark"></i>Bookmarked
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-bookmark"></i>Bookmark
                  </>
                )}
              </button>
              </div>
            </div>

            <div className="hidden mt-8 w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1 md:flex lg:mt-0 lg:w-auto lg:gap-3 lg:overflow-visible lg:pb-0">
              {college?.brochure_data?.url ? (
                <a
                  href={getImageUrl(college.brochure_data.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:px-5 lg:py-3 lg:text-[15px]"
                >
                  <i className="fa-solid fa-download"></i>Brochure
                </a>
              ) : (
                <button
                  className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-400 transition-colors lg:px-5 lg:py-3 lg:text-[15px] cursor-not-allowed"
                  disabled
                >
                  <i className="fa-solid fa-download"></i>Brochure
                </button>
              )}
              <button
                onClick={() => setIsAskQuestionOpen(true)}
                className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:px-5 lg:py-3 lg:text-[15px]"
              >
                <i className="fa-regular fa-circle-question"></i>Inquiry
              </button>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="shrink-0 flex items-center justify-center rounded-md border border-gray-200 bg-white p-2.5 text-gray-700 transition-colors hover:bg-gray-50 lg:p-3"
                aria-label="Share college profile"
              >
                <i className="fa-solid fa-share-nodes"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile action buttons */}
        <div className="grid grid-cols-3 gap-2 px-6 pb-6 md:hidden">
          {college?.brochure_data?.url ? (
            <a
              href={getImageUrl(college.brochure_data.url)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <i className="fa-solid fa-download"></i>Brochure
            </a>
          ) : (
            <button
              className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-400 cursor-not-allowed"
              disabled
            >
              <i className="fa-solid fa-download"></i>Brochure
            </button>
          )}
          <button
            onClick={() => setIsAskQuestionOpen(true)}
            className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <i className="fa-regular fa-circle-question"></i>Inquiry
          </button>
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-2.5 text-gray-700 transition-colors hover:bg-gray-50"
            aria-label="Share college profile"
          >
            <i className="fa-solid fa-share-nodes"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default CollegeHeader;
