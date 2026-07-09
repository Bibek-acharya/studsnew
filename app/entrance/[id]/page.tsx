"use client";

import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  entranceService,
  EntranceDetailsResponse,
  mapRawEntrance,
} from "@/services/entrance.api";
import { institutionEntranceApi } from "@/services/institutionEntranceApi";
import { Exam } from "@/components/entrance/types";
import type { ExamDetails } from "@/app/entrance/types";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Download,
  Globe2,
  Timer,
  FileCheck2,
  Building,
  Phone,
  Mail,
  Globe,
  MapPin,
  ExternalLink,
  X,
  FolderOpen,
} from "lucide-react";
import { safeHtml } from "@/lib/html";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const EmptyTabState = ({ tabName }: { tabName: string }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <FolderOpen className="w-32 h-32 text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg font-medium mb-6">
        No {tabName} information is currently available.
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-[#0000ff] hover:bg-[#0000cc] cursor-pointer text-white font-semibold py-2.5 px-6 rounded-md transition-colors text-sm"
      >
        Explore More
      </button>
    </div>
  );
};

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "eligibility", label: "Eligibility" },
  { id: "application", label: "Application Process" },
  { id: "syllabus", label: "Syllabus & Pattern" },
  { id: "modelsets", label: "Model Sets" },
  { id: "timeline", label: "Timeline" },
  { id: "contact", label: "Contact" },
  { id: "faq", label: "FAQ" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function mapExamToDetails(exam: Exam): ExamDetails {
  const mapUpcomingDates = () => {
    if (exam.upcomingDates && exam.upcomingDates.length > 0) {
      return exam.upcomingDates.map((d) => ({
        date: d.date,
        dateEn: (() => {
          try {
            const dt = new Date(d.date);
            return isNaN(dt.getTime())
              ? d.date
              : dt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
          } catch {
            return d.date;
          }
        })(),
        event: d.event,
        status: "",
      }));
    }
    if (exam.examDate) {
      return [
        {
          date: exam.examDate,
          dateEn: (() => {
            try {
              const d = new Date(exam.examDate);
              return isNaN(d.getTime())
                ? exam.examDate
                : d.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
            } catch {
              return exam.examDate;
            }
          })(),
          event: `${exam.title} Exam`,
          status: exam.status,
        },
      ];
    }
    return [];
  };

  return {
    id: exam.id,
    title: exam.title || "",
    university: exam.institution || "",
    faculty: "",
    status: (exam.status as ExamDetails["status"]) || "Ongoing",
    examDate: exam.examDate || "",
    nepaliDate: exam.nepaliDate || "",
    imageUrl: exam.imageUrl || "",
    registrationStart: "",
    registrationEnd: "",
    examLevel: "",
    duration: "",
    questionType: "",
    description: exam.description || exam.eligibility || "",
    conductingBody: exam.institution || exam.affiliation || "",
    examFrequency: "",
    examMode: "",
    applicationFee: exam.applicationFee || "",
    foreignFee: "",
    phone: exam.phone || "",
    email: exam.email || "",
    website: exam.website || "",
    location: exam.location || "",
    applicationSteps: (exam.applicationSteps || []).map((s) => ({
      title: s.title,
      description: s.description,
    })),
    eligibility: (exam.eligibilityList || []).map((e) => ({
      title: e.title,
      description: e.description,
    })),
    examPattern: (exam.examPattern || []).map((p) => ({
      label: p.label,
      value: p.value,
    })),
    subjectMarks: (exam.subjectMarks || []).map((s) => ({
      subject: s.subject,
      marks: Number(s.marks) || 0,
    })),
    modelSets: (exam.modelSets || []).map((m) => ({
      title: m.title,
      size: m.size || "",
      description: m.description || "",
      fileUrl: m.fileUrl,
    })),
    courses: [],
    admissionSteps: [],
    admitCardInfo: "",
    upcomingDates: mapUpcomingDates(),
    pastDates: [],
    faqs: (exam.faqs || []).map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
    contactPersons: (exam.contactPersons || []).map((c) => ({
      name: c.name,
      role: c.role || "",
      phone: c.phone || "",
      email: c.email || "",
      img: c.image || "",
      wa: c.whatsapp || "",
    })),
    overviewDetails: exam.overviewDetails,
    applicationLink: exam.applicationLink,
    noticeFile: exam.noticeFile,
  };
}

const EntranceDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const tabNavRef = useRef<HTMLDivElement>(null);

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["entrance", id],
    queryFn: async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("institutionToken")
          : null;
      if (token) {
        try {
          const instData = await institutionEntranceApi.getById(
            Number(id) || 0,
          );
          if (instData) {
            return {
              data: mapRawEntrance(instData),
            } as EntranceDetailsResponse;
          }
        } catch {
          /* fallback to public */
        }
      }
      return entranceService.getEntranceById(id);
    },
    staleTime: 5 * 60 * 1000,
  });

  const entrance = apiData?.data;
  const currentYear = new Date().getFullYear();

  const exam: ExamDetails | undefined = entrance
    ? mapExamToDetails(entrance)
    : undefined;

  const scrollTabs = (direction: number) => {
    if (tabNavRef.current) {
      tabNavRef.current.scrollBy({ left: direction * 200, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading entrance details...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Exam Not Found
          </h1>
          <p className="text-gray-500 mb-4">
            The entrance exam you are looking for does not exist.
          </p>
          <button
            onClick={() => router.push("/entrance")}
            className="bg-[#0000ff] hover:bg-[#0000cc] text-white px-6 py-2.5 rounded-md font-semibold transition-colors"
          >
            Back to Entrance Exams
          </button>
        </div>
      </div>
    );
  }

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <nav className="flex items-center text-sm text-gray-500 mb-6 gap-2">
          <span
            className="hover:text-gray-900 transition-colors cursor-pointer"
            onClick={() => router.push("/")}
          >
            Home
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span
            className="hover:text-gray-900 transition-colors cursor-pointer"
            onClick={() => router.push("/entrance")}
          >
            Entrance
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">{exam.title}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-[28px] md:text-4xl font-bold text-gray-900">
            {exam.title}: Application ({exam.status}), Exam Date, Syllabus,
            Preparation, Admit Card, Admission
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-2">
            {exam.conductingBody} &middot; {exam.examLevel}
          </p>
        </div>

        <div
          className="relative w-full h-[280px] md:h-[380px] max-md:bg-contain bg-cover bg-center bg-no-repeat rounded-md overflow-hidden"
          style={{
            backgroundImage: `url('${exam.imageUrl}')`,
            backgroundPosition: "center 20%",
          }}
        >
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 overflow-hidden">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8 relative">
          <button
            onClick={() => scrollTabs(-1)}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center md:hidden ${TABS[0].id === activeTab ? "hidden" : ""}`}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="overflow-x-auto no-scrollbar" ref={tabNavRef}>
            <nav className="flex space-x-8 whitespace-nowrap border-b border-gray-100">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={
                    activeTab === tab.id
                      ? "border-b-2 border-[#0000ff] py-4 text-[14px] font-bold text-gray-900"
                      : "border-b-2 border-transparent py-4 text-[14px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                  }
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <button
            onClick={() => scrollTabs(1)}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center md:hidden ${TABS[TABS.length - 1].id === activeTab ? "hidden" : ""}`}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-10 bg-white">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 min-h-[500px]">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-10">
              <div className="space-y-6 text-gray-600 text-[15px] md:text-[15.5px] leading-[1.8]">
                <h2 className="text-2xl font-bold text-gray-900">
                  About {exam.title}
                </h2>
                <div
                  className="prose prose-gray max-w-none text-gray-600 break-words overflow-x-auto [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_img]:max-w-full [&_table]:block [&_table]:overflow-x-auto [&_iframe]:max-w-full"
                  dangerouslySetInnerHTML={{
                    __html: safeHtml(exam.description),
                  }}
                />
              </div>

              {exam.overviewDetails && exam.overviewDetails.length > 0 && (
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#eff4fc]">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-bold text-gray-900 w-1/3">
                          Detail
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-bold text-gray-900">
                          Information
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {exam.overviewDetails.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                            {item.detail}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {item.information}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Exam Dates & Schedule */}
              <div className="border border-gray-100 rounded-md p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Exam Dates & Schedule
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Complete schedule for {exam.title}
                    </p>
                  </div>
                  <button className="bg-[#0000ff] hover:bg-[#0000cc] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors shrink-0">
                    <Bell className="w-4 h-4" /> Keep Me Notified
                  </button>
                </div>

                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-[#eff4fc]">
                      <tr>
                        <th className="p-4 font-bold text-gray-900 w-1/3 border-r border-gray-200">
                          Dates
                        </th>
                        <th className="p-4 font-bold text-gray-900 border-r border-gray-200">
                          Upcoming Exam Dates
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[15%]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[15px]">
                      {exam.upcomingDates.map((date, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                            {date.dateEn}
                          </td>
                          <td className="p-4 align-top border-r border-gray-200">
                            <span className="font-semibold text-gray-900">
                              {date.event}
                            </span>
                          </td>
                          <td className="p-4 align-top">
                            {date.status && (
                              <span className="inline-block bg-green-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                {date.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Eligibility Tab */}
          {activeTab === "eligibility" && (
            <div>
              <div className="mb-6">
                {exam.eligibility.length > 0 ? (
                  <>
                    <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                      Eligibility Criteria {currentYear}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Candidates must meet the following mandatory eligibility
                      criteria to appear for the {exam.title} examination.
                    </p>
                    <div className="space-y-4">
                      {exam.eligibility.map((item, idx) => (
                        <div
                          key={idx}
                          className="border border-gray-200 rounded-md p-5 bg-white"
                        >
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />{" "}
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 ml-6">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyTabState tabName="Eligibility" />
                )}
              </div>
            </div>
          )}

          {/* Application Tab */}
          {activeTab === "application" && (
            <div>
              {exam.applicationSteps.length > 0 ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-[22px] font-bold text-gray-900 mb-2">
                      Application Form Process {currentYear}
                    </h2>
                    <p className="text-gray-600">
                      The application process for {exam.title} is entirely
                      online. Candidates must visit the official portal to
                      submit their forms.
                    </p>
                  </div>
                  <div className="space-y-6">
                    {exam.applicationSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-md p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-3">
                              {step.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-6 border border-gray-200 rounded-md p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">
                            Application Fee
                          </h4>
                          <p className="text-sm text-gray-600">
                            Regular: {exam.applicationFee}
                          </p>
                          {exam.foreignFee && (
                            <p className="text-sm text-gray-600">
                              Foreign: {exam.foreignFee}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="Application Process" />
              )}
            </div>
          )}

          {/* Syllabus & Pattern Tab */}
          {activeTab === "syllabus" && (
            <div>
              {exam.examPattern.length > 0 || exam.subjectMarks.length > 0 ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-[22px] font-bold text-gray-900 mb-2">
                      Exam Pattern & Syllabus
                    </h2>
                    <p className="text-gray-600">
                      {exam.title} is a single-paper examination consisting of
                      Multiple Choice Questions (MCQs). The syllabus is based on
                      the prescribed curriculum.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border border-gray-200 rounded-md p-5 bg-white">
                      <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">
                        Exam Pattern
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {exam.examPattern.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center"
                          >
                            <span className="font-medium text-gray-700">
                              {item.label}:
                            </span>
                            <span className="text-gray-900 font-medium">
                              {item.value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-brand-blue text-white">
                          <tr>
                            <th className="py-2.5 px-4 text-left text-sm font-semibold">
                              Subject
                            </th>
                            <th className="py-2.5 px-4 text-right text-sm font-semibold">
                              Marks
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {exam.subjectMarks.map((item, idx) => (
                            <tr
                              key={idx}
                              className={idx % 2 === 1 ? "bg-gray-50" : ""}
                            >
                              <td className="py-2.5 px-4 text-sm text-gray-700">
                                {item.subject}
                              </td>
                              <td className="py-2.5 px-4 text-sm text-gray-700 text-right font-medium">
                                {item.marks}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="Syllabus" />
              )}
            </div>
          )}

          {/* Model Sets Tab */}
          {activeTab === "modelsets" && (
            <div>
              {exam.modelSets.length > 0 ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-[22px] font-bold text-gray-900 mb-2">
                      Model Sets & Past Papers
                    </h2>
                    <p className="text-gray-600">
                      Practicing with model sets and past year question papers
                      is crucial to understand the exam format and time
                      management.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {exam.modelSets.map((set, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-md bg-white"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-50 text-brand-blue rounded-md">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {set.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              PDF &bull; {set.size} &bull; {set.description}
                            </p>
                          </div>
                        </div>
                        <button className="text-[#0000ff] hover:bg-blue-50 p-2 rounded-full transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="Model Sets" />
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div>
              {exam.upcomingDates.length > 0 || exam.pastDates.length > 0 ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-[20px] font-bold text-gray-900">
                      Key Dates & Timeline
                    </h2>
                    <p className="mt-1 text-[14px] text-gray-500">
                      Important dates for {exam.title}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {[
                      ...exam.upcomingDates.map((d) => ({
                        ...d,
                        icon: "Calendar",
                        type: "upcoming",
                      })),
                      ...exam.pastDates.map((d) => ({
                        ...d,
                        icon: "Calendar",
                        type: "past",
                      })),
                    ].map((ev, i, arr) => {
                      const colors = [
                        "bg-blue-600",
                        "bg-green-600",
                        "bg-orange-600",
                        "bg-purple-600",
                        "bg-red-600",
                      ];
                      const color = colors[i % colors.length];
                      const isLast = i === arr.length - 1;
                      const displayDate = (() => {
                        try {
                          const d = new Date(ev.date);
                          return isNaN(d.getTime())
                            ? ev.date
                            : d.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              });
                        } catch {
                          return ev.date;
                        }
                      })();
                      return (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full ${color} text-white`}
                            >
                              <Calendar size={16} />
                            </div>
                            {!isLast && (
                              <div className="mt-2 w-0.5 flex-1 bg-gray-200" />
                            )}
                          </div>
                          <div className={!isLast ? "pb-6" : ""}>
                            <h3 className="text-[15px] font-bold text-gray-900">
                              {ev.event}
                            </h3>
                            <p
                              className={`text-[13px] font-semibold ${color.replace("bg-", "text-")}`}
                            >
                              {displayDate}
                            </p>
                            <p className="mt-1 text-[13px] text-gray-600">
                              {ev.type === "upcoming" ? "Upcoming" : "Past"}{" "}
                              event
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="Timeline" />
              )}
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div>
              {exam.contactPersons.length > 0 ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Contact Information
                    </h2>
                    <p className="text-gray-600">
                      Get in touch with our admission team
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exam.contactPersons.map((person, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-md p-6 bg-white"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={person.img}
                            alt={person.name}
                            className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {person.name}
                            </h4>
                            <p className="text-sm text-[#0000ff] font-medium">
                              {person.role}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 text-[#0000ff]" />
                            <span>{person.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-[#0000ff]" />
                            <a
                              href={`mailto:${person.email}`}
                              className="hover:text-[#0000ff] transition"
                            >
                              {person.email}
                            </a>
                          </div>
                        </div>
                        <a
                          href={`https://wa.me/${person.wa}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-[#0000ff] hover:bg-[#0000cc] text-white font-semibold py-2.5 px-4 rounded-md transition-colors text-sm"
                        >
                          <WhatsAppIcon className="w-5 h-5" />
                          Message on WhatsApp
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="Contact" />
              )}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div>
              {exam.faqs.length > 0 ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-[20px] font-bold text-gray-900">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-[14px] text-gray-500 mt-1">
                      Find answers to common questions about {exam.title}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {exam.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-md overflow-hidden border border-gray-100"
                      >
                        <button
                          onClick={() => toggleFaq(idx)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left transition"
                        >
                          <span className="font-semibold text-gray-900 text-[15px] pr-4">
                            Q: {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                              openFaq === idx ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {openFaq === idx && (
                          <div className="px-5 pb-4">
                            <p className="text-[14px] text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="FAQ" />
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-md p-5 text-white">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-bold text-white text-[15px] mb-2">
                  Are You Interested in this Exam?
                </h3>
                <p className="text-[13px] text-white/90 leading-relaxed mb-3">
                  Apply now or download the notice for more information about
                  the exam, syllabus, and admission process.
                </p>
              </div>
              <div className="space-y-3 pt-4 border-t border-blue-500/50">
                <button
                  onClick={() => {
                    if (exam.applicationLink) {
                      window.open(
                        exam.applicationLink,
                        "_blank",
                        "noopener,noreferrer",
                      );
                    } else {
                      window.open(`/entrance/apply/${exam.id}`, "_blank");
                    }
                  }}
                  className="w-full flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-md transition-colors text-sm"
                >
                  Apply Now
                </button>
                {exam.noticeFile && (
                  <button
                    onClick={() =>
                      window.open(
                        exam.noticeFile,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                    className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-4 rounded-md transition-colors text-sm"
                  >
                    Download Notice
                    <Download className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {(exam.conductingBody ||
            exam.phone ||
            exam.email ||
            exam.website ||
            exam.location ||
            exam.contactNumber ||
            (exam.socialLinks && exam.socialLinks.length > 0)) && (
            <div className="bg-white border border-gray-100 rounded-md p-5">
              <h3 className="font-bold text-gray-900 text-[18px] mb-5">
                Contact Information
              </h3>
              <ul className="space-y-4">
                {exam.conductingBody && (
                  <li className="flex items-start gap-3 text-[13px]">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-gray-900 font-bold text-[13px]">
                        Conducting Body
                      </span>
                      <span className="text-gray-500 font-medium text-[12px]">
                        {exam.conductingBody}
                      </span>
                    </div>
                  </li>
                )}
                {exam.phone && (
                  <li className="flex items-start gap-3 text-[13px]">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-gray-900 font-bold text-[13px]">
                        Phone
                      </span>
                      <span className="text-gray-500 font-medium text-[12px]">
                        {exam.phone}
                      </span>
                    </div>
                  </li>
                )}
                {exam.contactNumber && exam.contactNumber !== exam.phone && (
                  <li className="flex items-start gap-3 text-[13px]">
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-gray-900 font-bold text-[13px]">
                        Contact Number
                      </span>
                      <span className="text-gray-500 font-medium text-[12px]">
                        {exam.contactNumber}
                      </span>
                    </div>
                  </li>
                )}
                {exam.email && (
                  <li className="flex items-start gap-3 text-[13px]">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-gray-900 font-bold text-[13px]">
                        Email
                      </span>
                      <a
                        href={`mailto:${exam.email}`}
                        className="text-gray-500 font-medium text-[12px] hover:text-[#0000ff] transition-colors"
                      >
                        {exam.email}
                      </a>
                    </div>
                  </li>
                )}
                {exam.website && (
                  <li className="flex items-start gap-3 text-[13px]">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-gray-900 font-bold text-[13px]">
                        Website
                      </span>
                      <a
                        href={
                          exam.website.startsWith("http")
                            ? exam.website
                            : `https://${exam.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0000ff] font-medium text-[12px] hover:underline cursor-pointer"
                      >
                        {exam.website}
                      </a>
                    </div>
                  </li>
                )}
                {exam.socialLinks &&
                  exam.socialLinks.length > 0 &&
                  exam.socialLinks.map((link, idx) => {
                    const platformColors: Record<string, string> = {
                      facebook: "bg-blue-50 text-blue-600",
                      twitter: "bg-sky-50 text-sky-500",
                      instagram: "bg-pink-50 text-pink-500",
                      linkedin: "bg-blue-50 text-blue-700",
                      youtube: "bg-red-50 text-red-600",
                      tiktok: "bg-gray-100 text-gray-800",
                      whatsapp: "bg-green-50 text-green-600",
                      telegram: "bg-sky-50 text-sky-600",
                    };
                    const colorClass =
                      platformColors[link.platform] ||
                      "bg-gray-50 text-gray-600";
                    return (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-[13px]"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
                        >
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-gray-900 font-bold text-[13px] capitalize">
                            {link.platform}
                          </span>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0000ff] font-medium text-[12px] hover:underline cursor-pointer"
                          >
                            View Profile
                          </a>
                        </div>
                      </li>
                    );
                  })}
              </ul>

              {exam.location && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div
                    onClick={() =>
                      window.open(
                        "https://www.google.com/maps/search/" +
                          encodeURIComponent(exam.location),
                        "_blank",
                      )
                    }
                    className="rounded-md overflow-hidden cursor-pointer group hover:border-[#0000ff] transition-colors border border-gray-200"
                  >
                    <div className="bg-gray-100 h-[160px] flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 text-[#0000ff] mx-auto mb-1" />
                          <p className="text-xs font-medium text-gray-700 mb-1">
                            {exam.location}
                          </p>
                          <p className="text-[10px] text-[#0000ff] flex items-center justify-center gap-1 group-hover:underline">
                            <ExternalLink className="w-3 h-3" /> Open in Google
                            Maps
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {(exam.examLevel ||
            exam.duration ||
            exam.questionType ||
            exam.applicationFee) && (
            <div className="bg-white border border-gray-100 rounded-md p-5">
              <h3 className="font-bold text-gray-900 text-[18px] mb-5">
                Exam Highlights
              </h3>
              <ul className="space-y-4">
                {exam.examLevel && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-gray-900 font-bold text-[13px]">
                        Exam Level
                      </span>
                      <span className="text-gray-500 font-medium text-[12px]">
                        {exam.examLevel}
                      </span>
                    </div>
                  </li>
                )}
                {exam.duration && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                      <Timer className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-gray-900 font-bold text-[13px]">
                        Duration
                      </span>
                      <span className="text-gray-500 font-medium text-[12px]">
                        {exam.duration}
                      </span>
                    </div>
                  </li>
                )}
                {exam.questionType && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-gray-900 font-bold text-[13px]">
                        Question Type
                      </span>
                      <span className="text-gray-500 font-medium text-[12px]">
                        {exam.questionType}
                      </span>
                    </div>
                  </li>
                )}
                {exam.applicationFee && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-gray-900 font-bold text-[13px]">
                        Application Fee
                      </span>
                      <span className="text-gray-500 font-medium text-[12px]">
                        {exam.applicationFee}
                      </span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900/40 transition-opacity backdrop-blur-sm"
              onClick={() => setShowNotificationModal(false)}
            />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-md px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 relative">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="px-2 pt-2">
                <h3
                  className="text-[17px] font-bold text-gray-900 leading-snug mb-5"
                  id="modal-title"
                >
                  To get Recommendations &amp; Alerts, please share these
                  details
                </h3>

                <div className="space-y-4">
                  <div className="relative">
                    <select className="w-full px-3 py-2.5 border border-gray-400 rounded-md text-[15px] text-gray-500 appearance-none bg-white focus:outline-none focus:border-gray-600 transition-colors">
                      <option value="" disabled selected hidden>
                        Course you&apos;re interested in
                      </option>
                      {exam.courses.map((course, idx) => (
                        <option key={idx} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-900">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Add Gmail"
                      className="w-full px-3 py-2.5 border border-gray-400 rounded-md text-[15px] text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:border-gray-600 transition-colors"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Contact Number"
                      className="w-full px-3 py-2.5 border border-gray-400 rounded-md text-[15px] text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:border-gray-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center pb-2">
                <button
                  type="button"
                  onClick={() => setShowNotificationModal(false)}
                  className="rounded-md px-6 py-2 bg-[#0000ff] text-[15px] font-bold text-white hover:bg-[#0000cc] focus:outline-none transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default EntranceDetailsPage;
