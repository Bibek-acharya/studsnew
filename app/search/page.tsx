"use client";

import React, { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Award,
  MapPin,
  Bookmark,
  GraduationCap,
  Globe,
  Calendar,
  BadgeCheck,
  Banknote,
  Clock,
  Building2,
  Image as ImageIcon,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const ENTITY_TYPES = [
  { value: "all", label: "All" },
  { value: "college", label: "Colleges" },
  { value: "institution", label: "Institutions" },
  { value: "course", label: "Courses" },
  { value: "university", label: "Universities" },
  { value: "scholarship", label: "Scholarships" },
  { value: "event", label: "Events" },
  { value: "news", label: "News" },
  { value: "blog", label: "Blogs" },
  { value: "exam", label: "Exams" },
  { value: "admission_page", label: "Admissions" },
] as const;

const SORT_OPTIONS: Record<string, string> = {
  Popular: "relevance",
  "Newest First": "created_at_desc",
  "Highest Rated": "rating_desc",
  "Title A-Z": "title_asc",
};

interface SearchItem {
  id: number;
  type: string;
  title: string;
  description: string;
  image: string;
  featured: boolean;
  verified: boolean;
  rating: number;
  institutionType: string;
  location: string;
  university: string;
  website: string;
  slug: string;
  tags: string[];
}

interface SearchCategory {
  title: string;
  description: string;
  related: string[];
  tabs: string[];
  key: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface SearchResponse {
  success: boolean;
  message: string;
  data: {
    items: SearchItem[];
    category: SearchCategory | null;
    categoryKey: string;
    meta: PaginationMeta;
    facets?: Record<string, Record<string, number>>;
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

const categoryColors: Record<string, string> = {
  workshop: "bg-orange-500",
  seminar: "bg-blue-500",
  webinar: "bg-purple-500",
  conference: "bg-green-500",
  competition: "bg-pink-500",
  education: "bg-blue-600",
  exams: "bg-orange-600",
  admissions: "bg-blue-500",
  career: "bg-emerald-500",
  policy: "bg-violet-500",
  default: "bg-gray-500",
};

function mapCategoryColor(cat?: string): string {
  if (!cat) return "default";
  const c = cat.toLowerCase();
  for (const key of Object.keys(categoryColors)) {
    if (c.includes(key)) return key;
  }
  return "default";
}

const newsCategoryColors: Record<string, string> = {
  admission: "bg-blue-700",
  scholarship: "bg-emerald-500",
  exams: "bg-red-500",
  events: "bg-purple-500",
  achievements: "bg-amber-500",
  notice: "bg-indigo-500",
  news: "bg-cyan-500",
  default: "bg-slate-500",
};

function mapNewsCategoryColor(cat?: string): string {
  if (!cat) return "default";
  const c = cat.toLowerCase();
  for (const key of Object.keys(newsCategoryColors)) {
    if (c.includes(key)) return key;
  }
  return "default";
}

function CollegeCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  return (
    <div className="flex h-full flex-col rounded-md border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20">
      <Link href={`/find-college/${slug}`} className="relative h-35 shrink-0 overflow-hidden rounded-md mb-3">
        <img
          src={item.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {item.featured && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
            Featured
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-1.5">
          <Link href={`/find-college/${slug}`} className="truncate text-[18px] font-bold text-slate-800 hover:text-blue-600">
            {item.title}
          </Link>
          {item.verified && <BadgeCheck className="h-5 w-5 shrink-0 fill-blue-500 text-white" />}
        </div>
        <div className="mb-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-500">
          {item.rating > 0 && (
            <div className="flex items-center gap-1 font-bold text-slate-700">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{item.rating}</span>
            </div>
          )}
          {item.institutionType && (
            <div className="flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-semibold text-slate-700">{item.institutionType}</span>
            </div>
          )}
          {item.location && (
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate font-semibold text-slate-700">{item.location}</span>
            </div>
          )}
        </div>
        {item.university && (
          <div className="mb-2 flex items-center gap-1.5 text-[13px] text-gray-500">
            <GraduationCap className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="font-semibold text-slate-700 truncate">{item.university}</span>
          </div>
        )}
        {item.website && (
          <div className="mb-2 flex items-center gap-1.5 text-[13px] text-gray-500">
            <Globe className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <a href={item.website.startsWith("http") ? item.website : `https://${item.website}`} target="_blank" rel="noopener noreferrer" className="truncate font-medium text-blue-600 hover:underline">
              {item.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
        <div className="mt-auto flex gap-2 pt-2">
          <Link href={`/find-college/${slug}`} className="flex-1 flex items-center justify-center rounded-md border border-gray-200 bg-white py-2 text-[13px] font-medium text-slate-600 hover:bg-gray-50 transition-colors">
            Details
          </Link>
          <Link href={`/find-college/${slug}`} className="flex-[1.2] flex items-center justify-center rounded-md bg-[#0000ff] py-2 text-[13px] font-medium text-white hover:bg-[#0000cc] transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function InstitutionCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  return (
    <div className="flex h-full flex-col rounded-md border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20">
      <Link href={`/find-college/inst_${slug}`} className="relative h-35 shrink-0 overflow-hidden rounded-md mb-3">
        <img
          src={item.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {item.featured && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
            Featured
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-1.5">
          <Link href={`/find-college/inst_${slug}`} className="truncate text-[18px] font-bold text-slate-800 hover:text-blue-600">
            {item.title}
          </Link>
          {item.verified && <BadgeCheck className="h-5 w-5 shrink-0 fill-blue-500 text-white" />}
        </div>
        <div className="mb-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-500">
          {item.institutionType && (
            <div className="flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-semibold text-slate-700">{item.institutionType}</span>
            </div>
          )}
          {item.location && (
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate font-semibold text-slate-700">{item.location}</span>
            </div>
          )}
        </div>
        {item.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>
        )}
        <div className="mt-auto flex gap-2">
          <Link href={`/find-college/inst_${slug}`} className="flex-1 flex items-center justify-center rounded-md border border-gray-200 bg-white py-2 text-[13px] font-medium text-slate-600 hover:bg-gray-50 transition-colors">
            Details
          </Link>
          <Link href={`/find-college/inst_${slug}`} className="flex-[1.2] flex items-center justify-center rounded-md bg-[#0000ff] py-2 text-[13px] font-medium text-white hover:bg-[#0000cc] transition-colors">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ item }: { item: SearchItem }) {
  return (
    <div className="flex h-full flex-col rounded-md border border-gray-200 bg-white overflow-hidden transition-all duration-300 hover:border-blue-500/20">
      <div className="h-[140px] w-full bg-gradient-to-r from-blue-600 to-blue-400 p-4 flex items-end relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-2 left-8 w-12 h-12 rounded-full border border-white/20" />
        </div>
        <span className="relative text-white font-bold text-[17px] leading-tight line-clamp-2">{item.title}</span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        {item.institutionType && (
          <span className="self-start bg-pink-50 text-[#D11D5A] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide mb-2">
            {item.institutionType}
          </span>
        )}
        {item.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>
        )}
        <div className="mt-auto flex gap-2">
          <Link href={`/course-finder/${item.id}`} className="flex-1 flex items-center justify-center rounded-md border border-gray-200 py-2 text-[13px] font-medium text-slate-600 hover:bg-gray-50 transition-colors">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function UniversityCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  return (
    <div className="flex h-full flex-col rounded-md border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20">
      <Link href={`/universities/${slug}`} className="relative h-35 shrink-0 overflow-hidden rounded-md mb-3">
        <img
          src={item.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-1.5">
          <Link href={`/universities/${slug}`} className="truncate text-[18px] font-bold text-slate-800 hover:text-blue-600">
            {item.title}
          </Link>
          {item.verified && <BadgeCheck className="h-5 w-5 shrink-0 fill-blue-500 text-white" />}
        </div>
        <div className="mb-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-500">
          {item.rating > 0 && (
            <div className="flex items-center gap-1 font-bold text-slate-700">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{item.rating}</span>
            </div>
          )}
          {item.institutionType && (
            <div className="flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-semibold text-slate-700">{item.institutionType}</span>
            </div>
          )}
          {item.location && (
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate font-semibold text-slate-700">{item.location}</span>
            </div>
          )}
        </div>
        {item.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>
        )}
        <div className="mt-auto flex gap-2">
          <Link href={`/universities/${slug}`} className="flex-1 flex items-center justify-center rounded-md border border-gray-200 py-2 text-[13px] font-medium text-slate-600 hover:bg-gray-50 transition-colors">
            Details
          </Link>
          <Link href={`/universities/${slug}`} className="flex-[1.2] flex items-center justify-center rounded-md bg-[#0000ff] py-2 text-[13px] font-medium text-white hover:bg-[#0000cc] transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScholarshipCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  return (
    <div className="relative flex flex-col bg-white rounded-md border border-gray-200/80 transition-all duration-300 p-3 h-full">
      <div className="h-32 w-full bg-gray-100 relative overflow-hidden rounded-md mb-3">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full p-3 flex items-start bg-linear-to-br from-gray-200 to-gray-50">
            <span className="text-gray-600 text-[13px] font-medium flex items-start gap-1.5 leading-snug">
              <ImageIcon className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
              {item.title}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col grow px-1">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-blue-600 bg-blue-50 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
            Scholarship
          </span>
        </div>
        <h3 className="font-bold text-[16px] leading-tight text-slate-900 mb-1 line-clamp-2">{item.title}</h3>
        {item.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>
        )}
        <div className="mt-auto flex gap-2">
          <Link href={`/scholarship-finder/${slug}`} className="flex-1 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-center">
            Details
          </Link>
          <Link href={`/scholarship-finder/apply/${slug}`} className="flex-[1.2] py-2 text-[13px] font-semibold text-white bg-[#0000ff] rounded-md hover:bg-[#0000cc] transition-colors text-center">
            Apply
          </Link>
        </div>
      </div>
    </div>
  );
}

function EventCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  const mapped = mapCategoryColor(item.institutionType);
  return (
    <article className="bg-white rounded-md border border-gray-200 hover:border-blue-500/20 overflow-hidden flex flex-col duration-300 h-full">
      <div className="h-35 w-full overflow-hidden p-4">
        <img
          src={item.image || "/placeholder.jpg"}
          alt={item.title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-center mb-3">
          <span className={`${categoryColors[mapped] || categoryColors.default} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}>
            {item.institutionType || "Event"}
          </span>
        </div>
        <Link href={`/events/${slug}`} className="font-bold text-lg mb-3 leading-tight text-left text-black hover:text-blue-600">
          {item.title}
        </Link>
        {item.location && (
          <div className="flex items-center text-xs text-gray-600 mb-3 font-semibold">
            <MapPin className="w-3.5 h-3.5 mr-2 text-gray-500" />
            {item.location}
          </div>
        )}
        {item.description && (
          <p className="text-xs text-gray-500 mb-5 line-clamp-3 leading-relaxed font-medium">
            {stripHtml(item.description)}
          </p>
        )}
        <div className="mt-auto flex gap-2">
          <Link href={`/events/${slug}`} className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2 rounded-md hover:bg-gray-50 transition text-center">
            Details
          </Link>
          <button className="flex-1 text-white text-sm font-bold py-2 rounded-md transition bg-[#0000ff] hover:bg-[#0000cc]">
            Register
          </button>
        </div>
      </div>
    </article>
  );
}

function NewsCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  const colorKey = mapNewsCategoryColor(item.institutionType);
  return (
    <article className="bg-white rounded-md border border-gray-200 overflow-hidden flex flex-col h-full hover:border-blue-500/20 transition-all duration-300">
      <div className="h-30 w-full overflow-hidden p-3">
        <img
          src={item.image || "/placeholder.jpg"}
          alt={item.title}
          className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`${newsCategoryColors[colorKey] || newsCategoryColors.default} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase`}>
            {item.institutionType || "News"}
          </span>
        </div>
        <Link href={`/news/${slug}`} className="font-bold text-lg leading-tight text-black hover:text-blue-600 mb-2 line-clamp-2">
          {item.title}
        </Link>
        {item.description && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>
        )}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.university || ""}
          </span>
          <Link href={`/news/${slug}`} className="text-sm font-semibold text-blue-600 hover:underline">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function BlogCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  const colorKey = mapNewsCategoryColor(item.institutionType);
  return (
    <article className="bg-white rounded-md border border-gray-200 overflow-hidden flex flex-col h-full hover:border-blue-500/20 transition-all duration-300">
      <div className="h-32 w-full overflow-hidden p-3">
        <img
          src={item.image || "/placeholder.jpg"}
          alt={item.title}
          className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`${newsCategoryColors[colorKey] || newsCategoryColors.default} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase`}>
            {item.institutionType || "Blog"}
          </span>
        </div>
        <Link href={`/blogs/${slug}`} className="font-bold text-lg leading-tight text-black hover:text-blue-600 mb-2 line-clamp-2">
          {item.title}
        </Link>
        {item.description && (
          <p className="text-sm text-slate-500 line-clamp-3 mb-3">{stripHtml(item.description)}</p>
        )}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">{item.university || ""}</span>
          <Link href={`/blogs/${slug}`} className="text-sm font-semibold text-blue-600 hover:underline">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function ExamCard({ item }: { item: SearchItem }) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-4 flex flex-col h-full hover:border-blue-500/20 transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Exam</span>
        {item.institutionType && (
          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{item.institutionType}</span>
        )}
      </div>
      <h3 className="font-bold text-[17px] text-slate-800 mb-1 line-clamp-2">{item.title}</h3>
      {item.description && (
        <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>
      )}
      {item.university && (
        <div className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-2">
          <Building2 className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold">{item.university}</span>
        </div>
      )}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <span className="text-sm font-semibold text-blue-600">View Details</span>
      </div>
    </div>
  );
}

function AdmissionCard({ item }: { item: SearchItem }) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-4 flex flex-col h-full hover:border-blue-500/20 transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Admission</span>
        {item.institutionType && (
          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{item.institutionType}</span>
        )}
      </div>
      <h3 className="font-bold text-[17px] text-slate-800 mb-1 line-clamp-2">{item.title}</h3>
      {item.description && (
        <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>
      )}
      {item.location && (
        <div className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-2">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold">{item.location}</span>
        </div>
      )}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <span className="text-sm font-semibold text-blue-600">View Details</span>
      </div>
    </div>
  );
}

function SearchResultCard({ item }: { item: SearchItem }) {
  switch (item.type) {
    case "college": return <CollegeCard item={item} />;
    case "institution": return <InstitutionCard item={item} />;
    case "course": return <CourseCard item={item} />;
    case "university": return <UniversityCard item={item} />;
    case "scholarship": return <ScholarshipCard item={item} />;
    case "event": return <EventCard item={item} />;
    case "news": return <NewsCard item={item} />;
    case "blog": return <BlogCard item={item} />;
    case "exam": return <ExamCard item={item} />;
    case "admission_page": return <AdmissionCard item={item} />;
    default: return <CollegeCard item={item} />;
  }
}

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") || "";
  const pageParam = parseInt(params.get("page") || "1", 10);
  const sortParam = params.get("sort") || "relevance";
  const typeFilter = params.get("type") || "all";

  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [currentSort, setCurrentSort] = useState(
    Object.keys(SORT_OPTIONS).find((k) => SORT_OPTIONS[k] === sortParam) || "Popular"
  );
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    locations: [] as string[],
    types: [] as string[],
    rating: "any",
    universities: [] as string[],
  });

  const currentPage = Math.min(Math.max(pageParam, 1), 5);

  const filteredItems = useMemo(() => {
    if (typeFilter === "all") return items;
    return items.filter((item) => item.type === typeFilter);
  }, [items, typeFilter]);

  const buildSearchUrl = useCallback(
    (page: number, sort: string) => {
      let url = `${API_BASE_URL}/api/v1/search?q=${encodeURIComponent(q)}&page=${page}&limit=20&sort=${sort}`;
      if (activeFilters.locations.length > 0) url += `&location=${encodeURIComponent(activeFilters.locations[0])}`;
      if (activeFilters.types.length > 0) url += `&type=${encodeURIComponent(activeFilters.types[0])}`;
      if (activeFilters.rating !== "any") url += `&rating_min=${activeFilters.rating}`;
      if (activeFilters.universities.length > 0) url += `&university=${encodeURIComponent(activeFilters.universities[0])}`;
      return url;
    },
    [q, activeFilters]
  );

  useEffect(() => {
    setLoading(true);
    const fetchSearch = async () => {
      try {
        const sortValue = SORT_OPTIONS[currentSort] || "relevance";
        const url = buildSearchUrl(currentPage, sortValue);
        const res = await fetch(url, { credentials: "include" });
        const json: SearchResponse = await res.json();
        if (json.success) {
          setItems(json.data.items || []);
          setMeta(json.data.meta);
        }
      } catch (e) {
        console.error("Search fetch failed:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [q, currentPage, currentSort, activeFilters, buildSearchUrl]);

  const navigateToPage = (page: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set("q", q);
    searchParams.set("page", String(page));
    searchParams.set("sort", SORT_OPTIONS[currentSort] || "relevance");
    if (typeFilter !== "all") searchParams.set("type", typeFilter);
    router.push(`/search?${searchParams.toString()}`);
  };

  const handleSortChange = (label: string) => {
    setCurrentSort(label);
    setIsSortOpen(false);
    const searchParams = new URLSearchParams();
    searchParams.set("q", q);
    searchParams.set("page", "1");
    searchParams.set("sort", SORT_OPTIONS[label] || "relevance");
    if (typeFilter !== "all") searchParams.set("type", typeFilter);
    router.push(`/search?${searchParams.toString()}`);
  };

  const handleTypeFilter = (value: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set("q", q);
    searchParams.set("page", "1");
    searchParams.set("sort", SORT_OPTIONS[currentSort] || "relevance");
    if (value !== "all") searchParams.set("type", value);
    router.push(`/search?${searchParams.toString()}`);
  };

  const sortPopoverItems = [
    { label: "Popular", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
    { label: "Newest First", icon: "M3 6h18M3 12h18M3 18h18" },
    { label: "Highest Rated", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
    { label: "Title A-Z", icon: "M3 6h18M3 12h18M3 18h18" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto w-full pt-8 px-8">
        <div className="flex flex-col w-full mt-8">
          <h1 className="text-[28px] font-bold text-[#0d0c22] mb-1">Search Results</h1>
          {q && <p className="text-[15px] text-[#6e6d7a] mb-6">Showing results for &quot;<span className="font-semibold text-gray-900">{q}</span>&quot;{meta.total > 0 && ` — ${meta.total} found`}</p>}

          {/* Category filter chips */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
            {ENTITY_TYPES.map((et) => (
              <button
                key={et.value}
                onClick={() => handleTypeFilter(et.value)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                  typeFilter === et.value
                    ? "bg-[#0d0c22] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {et.label}
              </button>
            ))}
          </div>

          {/* Sort + Filters bar */}
          <div className="flex items-center justify-between pb-2 mb-4">
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-[14px] font-medium text-[#0d0c22] hover:border-gray-300 hover:shadow-sm transition-all bg-white"
              >
                <span>{currentSort}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-20">
                    {sortPopoverItems.map((item) => (
                      <div
                        key={item.label}
                        className={`px-4 py-2.5 text-[14px] hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2 ${
                          currentSort === item.label ? "text-blue-600 font-semibold" : "text-gray-700"
                        }`}
                        onClick={() => handleSortChange(item.label)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <path d={item.icon}></path>
                        </svg>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <span className="text-[13px] text-gray-400">
              {loading ? "Searching..." : `${filteredItems.length} results`}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <div className="w-32 h-32 mb-6 flex items-center justify-center">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="#f1f5f9"/>
                  <circle cx="45" cy="45" r="20" fill="none" stroke="#94a3b8" strokeWidth="4"/>
                  <line x1="60" y1="60" x2="75" y2="75" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-[26px] font-bold text-gray-900 mb-3">No results found</h3>
              <p className="text-[15px] text-gray-600 text-center max-w-md mb-8">
                We couldn&apos;t find anything matching &quot;<span className="font-semibold text-gray-900">{q}</span>&quot;. Try different keywords or broaden your search.
              </p>
              <div className="flex gap-3 flex-wrap justify-center">
                <button onClick={() => router.push("/search")} className="px-6 py-3 bg-blue-600 text-white rounded-lg text-[14px] font-semibold hover:bg-blue-700 transition-colors">
                  Clear Search
                </button>
                <button onClick={() => router.push("/search?q=Colleges")} className="px-6 py-3 border border-gray-200 bg-white text-gray-700 rounded-lg text-[14px] font-semibold hover:bg-gray-50 transition-colors">
                  Browse Colleges
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full pb-10">
                {filteredItems.map((item, idx) => (
                  <SearchResultCard key={`${item.type}-${item.id}-${idx}`} item={item} />
                ))}
              </div>

              {meta.pages > 1 && (
                <div className="flex items-center justify-center gap-2 py-8">
                  <button
                    onClick={() => navigateToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 rounded-lg text-[14px] font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(meta.pages, 5) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => navigateToPage(p)}
                      className={`w-10 h-10 rounded-lg text-[14px] font-medium transition-colors ${
                        currentPage === p
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => navigateToPage(currentPage + 1)}
                    disabled={currentPage >= meta.pages || currentPage >= 5}
                    className="px-4 py-2 rounded-lg text-[14px] font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}

              {currentPage >= 5 && meta.total > 100 && (
                <p className="text-[13px] text-gray-500 text-center pb-4">
                  Showing top results. Refine your search to find what you need.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function SearchLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto w-full pt-32 px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mb-4"></div>
          <div className="h-4 w-96 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
