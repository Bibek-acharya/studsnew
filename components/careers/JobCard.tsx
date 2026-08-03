"use client";

import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { stripHtml } from "@/services/api";

interface JobCardProps {
  job: {
    id: number;
    title: string;
    department: string;
    description: string;
    location: string;
    job_type: string;
    positions_open: number;
    status: string;
    application_deadline?: string;
  };
}

export default function JobCard({ job }: JobCardProps) {
  const isClosed = job.status === "closed";

  return (
    <Link href={`/careers/${job.id}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
            {job.department}
          </span>
          {isClosed && (
            <span className="inline-block px-3 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full">
              Closed
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {job.title}
        </h3>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {job.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {job.job_type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {job.positions_open || 1} {job.positions_open === 1 ? "Position" : "Positions"}
          </span>
        </div>
        <div
          className="prose prose-xs prose-p:my-1 prose-p:text-gray-500 prose-p:text-xs prose-p:leading-relaxed max-w-none mb-4 flex-1 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />
        <div className="pt-3 border-t border-gray-100">
          <span className="inline-flex items-center gap-1 text-blue-600 font-semibold text-xs group-hover:text-blue-700 transition-colors">
            {isClosed ? "View Details" : "Apply Now"}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
