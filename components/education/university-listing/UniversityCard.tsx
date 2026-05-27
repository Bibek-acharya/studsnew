import React from "react";
import Link from "next/link";
import Image from "next/image";
import { UniversityData } from "./types";
import {
  BadgeCheck,
  Star,
  Award,
  MapPin,
  Bookmark,
  GraduationCap,
  Globe,
} from "lucide-react";

const toSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const UniversityCard: React.FC<{ university: UniversityData }> = ({
  university: uni,
}) => {
  const slug = toSlug(uni.name);
  const website = `www.${uni.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.edu.np`;

  return (
    <div className="flex h-full flex-col rounded-md border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20 overflow-visible">
      {/* Image Section */}
      <Link
        href={`/universities/${slug}`}
        className="group relative h-35 shrink-0 cursor-pointer overflow-hidden rounded-md"
      >
        <div className="flex h-full w-full items-center justify-center bg-brand-blue"></div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-visible px-0 pt-3">
        {/* Name */}
        <div className="mb-2 flex items-center gap-1.5">
          <Link
            href={`/universities/${slug}`}
            className="group/title relative cursor-pointer truncate text-left text-[20px] font-bold tracking-tight text-slate-800 transition-colors hover:text-blue-600"
          >
            <span className="block truncate" title={uni.name}>
              {uni.name}
            </span>
            <span className="invisible absolute bottom-full left-0 mb-2 whitespace-nowrap rounded bg-gray-900 px-3 py-1.5 text-[13px] font-medium text-white opacity-0 transition-all duration-200 group-hover/title:visible group-hover/title:opacity-100">
              {uni.name}
              <span className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></span>
            </span>
          </Link>
          <BadgeCheck className="h-5 w-5 shrink-0 fill-blue-500 text-white" />
        </div>

        {/* Stats Row */}
        <div className="mb-2 flex min-w-0 items-center text-[14px] text-gray-500">
          <div className="flex items-center gap-1 font-bold text-slate-700">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>{uni.rating}</span>
          </div>
          <span className="mx-3 font-light text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <Award className="h-4.5 w-4.5 text-gray-400" />
            <span className="font-semibold text-slate-700">{uni.type}</span>
          </div>
          <span className="mx-3 font-light text-gray-300">|</span>
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <MapPin className="h-4.5 w-4.5 shrink-0 text-gray-400" />
            <span className="group/location block min-w-0 truncate font-semibold text-slate-700" title={uni.location}>
              <span className="block truncate">{uni.location}</span>
              <span className="invisible absolute bottom-full left-0 mb-2 whitespace-nowrap rounded bg-gray-900 px-3 py-1.5 text-[13px] font-medium text-white opacity-0 transition-all duration-200 group-hover/location:visible group-hover/location:opacity-100">
                {uni.location}
                <span className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></span>
              </span>
            </span>
          </div>
        </div>

        {/* Programs & Colleges Stats */}
        <div className="mb-2 mt-1 flex items-center gap-4 text-[14px] text-gray-500">
          <GraduationCap className="h-4.5 w-4.5 shrink-0 text-gray-400" />
          <p className="font-semibold text-slate-700">
            {uni.programs} Programs · {uni.colleges} Colleges
          </p>
        </div>

        {/* Website */}
        <div className="mb-2 mt-1 flex items-center gap-2 text-[14px] text-gray-500">
          <Globe className="h-4.5 w-4.5 shrink-0 text-gray-400" />
          <a
            href={`https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate cursor-pointer font-medium text-brand-blue hover:underline"
          >
            {website}
          </a>
        </div>

        {/* Quick Links */}
        <div className="mb-4 mt-2 flex items-center gap-4">
          <span className="flex cursor-pointer items-center text-[12px] font-medium text-brand-blue transition-colors hover:text-blue-800">
            Programs
            <svg
              className="ml-1 h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M7 7h10v10"
              />
            </svg>
          </span>
          <span className="flex cursor-pointer items-center text-[12px] font-medium text-brand-blue transition-colors hover:text-blue-800">
            Scholarships
            <svg
              className="ml-1 h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M7 7h10v10"
              />
            </svg>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex gap-2">
            <Link
              href={`/universities/${slug}`}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white py-2 px-2 text-[13px] font-medium text-slate-600 transition-colors hover:bg-gray-50"
            >
              Details
            </Link>
            <Link
              href={`/universities/${slug}/affiliated-colleges`}
              className="flex-[1.2] flex cursor-pointer items-center justify-center gap-1.5 rounded-md bg-brand-blue py-2 px-2 text-[13px] font-medium text-white transition-colors hover:bg-brand-hover"
            >
              View Colleges
            </Link>
            <button
              type="button"
              className="flex w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-gray-200 transition-colors hover:bg-gray-50"
              title="Bookmark"
            >
              <Bookmark className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
