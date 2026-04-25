"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { FileCheck, UploadCloud, Bell, Calendar, Save } from "lucide-react";
import SectionCard from "./common/SectionCard";
import SelectField from "./common/SelectField";
import InputField from "./common/InputField";
import ToggleSwitch from "./common/ToggleSwitch";
import Button from "./common/Button";
import { scholarshipProviderApi, ProviderScholarship, ProviderResult } from "@/services/scholarshipProviderApi";

const ResultPublish: React.FC = memo(() => {
  const [selectedScholarship, setSelectedScholarship] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scholarships, setScholarships] = useState<ProviderScholarship[]>([]);
  const [results, setResults] = useState<ProviderResult[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [schRes, resRes] = await Promise.all([
          scholarshipProviderApi.getScholarships(1, 50),
          scholarshipProviderApi.getResults(1, 50),
        ]);
        setScholarships(schRes.scholarships);
        setResults(resRes.results);
      } catch {
        setScholarships([]);
        setResults([]);
      }
    }
    fetchData();
  }, []);

  const scholarshipOptions = [
    { value: "", label: "Select Scholarship" },
    ...scholarships.map((s) => ({ value: String(s.id), label: s.title })),
  ];

  const handlePublish = useCallback(async () => {
    if (!selectedScholarship) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await scholarshipProviderApi.createResult({
        scholarship_id: Number(selectedScholarship),
        title: `Results for ${scholarships.find((s) => s.id === Number(selectedScholarship))?.title || "Scholarship"}`,
        status: publishDate ? "scheduled" : "published",
        results: {},
      });
      setSuccess("Results published successfully! Notifications sent.");
      setSelectedScholarship("");
      setPublishDate("");
    } catch (err: any) {
      setError(err.message || "Failed to publish results");
    } finally {
      setSubmitting(false);
    }
  }, [selectedScholarship, scholarships, publishDate]);

  return (
    <div className="space-y-6">
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-blue-600" /> Result Publish
        </h2>

        <div className="space-y-6">
          <SelectField label="Select Scholarship" required value={selectedScholarship} onChange={(e) => setSelectedScholarship(e.target.value)} options={scholarshipOptions} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Results File</label>
            <div className="border-2 border-dashed border-slate-200 rounded-md py-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all">
              <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">CSV, XLSX, PDF up to 10MB</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Publish Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Notification Settings</label>
            <div className="space-y-4">
              <ToggleSwitch checked={emailNotify} onChange={setEmailNotify} label="Email Notifications" description="Send email to all applicants" />
              <ToggleSwitch checked={smsNotify} onChange={setSmsNotify} label="SMS Notifications" description="Send SMS to all applicants" />
            </div>
          </div>
        </div>
      </SectionCard>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

      {results.length > 0 && (
        <SectionCard>
          <h3 className="text-md font-bold text-slate-900 mb-4">Published Results</h3>
          <div className="space-y-3">
            {results.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-slate-900">{r.title}</p>
                  <p className="text-xs text-slate-500">{r.published_at ? new Date(r.published_at).toLocaleDateString() : "Draft"}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline"><Save className="w-4 h-4" /> Save Draft</Button>
        <Button onClick={handlePublish} disabled={submitting || !selectedScholarship}>
          <FileCheck className="w-4 h-4" /> {submitting ? "Publishing..." : "Publish Results"}
        </Button>
      </div>
    </div>
  );
});

ResultPublish.displayName = "ResultPublish";

export default ResultPublish;
