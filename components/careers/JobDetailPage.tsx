"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Clock, DollarSign, Calendar } from "lucide-react";
import { careersApi, Job } from "@/services/api";
import RichText from "@/components/RichText";
import ApplicationModal from "./ApplicationModal";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = Number(params.id);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await careersApi.getPublishedJob(jobId);
        setJob(res.data);
      } catch {
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="py-4 sm:py-6 lg:py-4 w-full max-w-350 mx-auto px-4 sm:px-6 md:px-8 mb-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-4 sm:py-6 lg:py-4 w-full max-w-350 mx-auto px-4 sm:px-6 md:px-8 mb-4 text-center py-20">
        <p className="text-gray-500">Job not found.</p>
        <Link href="/careers" className="text-blue-600 text-sm mt-2 inline-block">
          Back to Careers
        </Link>
      </div>
    );
  }

  const isClosed = job.status === "closed";
  const deadlinePassed = job.application_deadline && new Date(job.application_deadline) < new Date();

  return (
    <div className="py-4 sm:py-6 lg:py-4 w-full max-w-350 mx-auto px-4 sm:px-6 md:px-8 mb-4">

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
            {job.department}
          </span>
          {isClosed && (
            <span className="inline-block px-3 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full">
              Closed
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={16} />
              {job.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={16} />
            {job.job_type}
          </span>
          {job.salary_range && (
            <span className="flex items-center gap-1.5">
              <DollarSign size={16} />
              {job.salary_range}
            </span>
          )}
          {job.application_deadline && (
            <span className="flex items-center gap-1.5">
              <Calendar size={16} />
              Deadline: {new Date(job.application_deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
          <RichText
            html={job.description}
            className="space-y-4 text-[14px] leading-[1.8] text-gray-600 md:text-[15px]"
          />
        </div>

        {job.requirements && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Requirements</h2>
            <RichText
              html={job.requirements}
              className="space-y-4 text-[14px] leading-[1.8] text-gray-600 md:text-[15px]"
            />
          </div>
        )}

        {!isClosed && !deadlinePassed && (
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </button>
        )}

        {isClosed && (
          <p className="text-sm text-gray-500">This position is no longer accepting applications.</p>
        )}

        {deadlinePassed && !isClosed && (
          <p className="text-sm text-gray-500">The application deadline has passed.</p>
        )}
      </div>

      <ApplicationModal
        jobId={job.id}
        jobTitle={job.title}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
