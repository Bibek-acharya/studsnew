"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import JobCard from "./JobCard";
import { careersApi, Job } from "@/services/api";

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [activeDept, setActiveDept] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, deptsRes] = await Promise.all([
          careersApi.listPublishedJobs({ limit: 50 }),
          careersApi.getDepartments(),
        ]);
        setJobs(jobsRes.data?.jobs || []);
        setDepartments(deptsRes.data || []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchDept = activeDept === "All" || job.department === activeDept;
      const matchSearch =
        !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [jobs, activeDept, search]);

  const hasJobs = !loading && jobs.length > 0;

  return (
    <div className="py-4 sm:py-6 lg:py-4 w-full max-w-350 mx-auto flex flex-col gap-10 lg:gap-12 mb-4">
      <section className="bg-brand-blue rounded-md py-16 sm:py-24 px-6 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Careers
          </h1>
          <p className="text-[13px] md:text-sm lg:text-base text-gray-200 max-w-2xl mx-auto">
            Join our team and help shape the future of education technology.
            We&apos;re always looking for talented people who are passionate about
            making a difference.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-8">
        {hasJobs && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {departments.length > 0 && (
              <select
                value={activeDept}
                onChange={(e) => setActiveDept(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">No job openings found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
