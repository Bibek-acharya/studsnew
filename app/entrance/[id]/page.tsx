"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MOCK_EXAM_DETAILS } from "@/components/entrance/examDetailsData";
import { ExamDetails } from "@/app/entrance/types";
import {
  Download,
  Calendar,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Bell,
  MapPin,
  Building,
  Bookmark,
  ChevronRight,
  Headset,
  ArrowRight,
  ThumbsDown,
  ThumbsUp,
  ChevronLeft,
  MessageCircleQuestion,
  Globe2,
  Timer,
  FileCheck2,
  Target,
  ChevronDown,
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "application", label: "Application Form" },
  { id: "eligibility", label: "Eligibility" },
  { id: "syllabus", label: "Syllabus & Pattern" },
  { id: "modelsets", label: "Model Sets" },
  { id: "courses", label: "Courses" },
  { id: "admitcard", label: "Admit Card" },
];

const EntranceDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const exam: ExamDetails | undefined = MOCK_EXAM_DETAILS[id];

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Not Found</h1>
          <p className="text-gray-500 mb-4">The entrance exam you are looking for does not exist.</p>
          <button
            onClick={() => router.push("/entrance")}
            className="bg-brand-blue text-white px-6 py-2.5 rounded-md font-semibold hover:bg-brand-hover transition-colors"
          >
            Back to Entrance Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[68%] flex flex-col gap-8">
          {/* Top Header */}
          <div className="bg-white rounded-md  border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {exam.title}: Application ({exam.status}), Exam Date, Syllabus, Preparation, Admit Card, Admission
              </h1>
            </div>
            <div className="flex flex-col items-end gap-3 shrink-0">
              <button className="bg-[#00a844] hover:bg-green-700 text-white px-5 py-2.5 rounded-md font-semibold flex items-center gap-2 transition-all ">
                <Download className="w-4 h-4" /> Download Notice
              </button>
              <div className="border border-purple-200 rounded-md px-4 py-1.5 text-sm bg-purple-50 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-800">Registration-</span> {exam.registrationStart} - {exam.registrationEnd}
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="bg-white rounded-md  border border-gray-200 overflow-hidden">
            <div className="bg-white border-b border-gray-200 overflow-x-auto hide-scrollbar">
              <ul className="flex space-x-6 px-6">
                {TABS.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 text-sm whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "font-semibold text-gray-900 border-gray-900"
                          : "font-medium text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6">
              {/* Overview */}
              {activeTab === "overview" && (
                <div className="animate-fadeIn">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{exam.title} Overview</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">{exam.description}</p>

                  <div className="mt-6 border border-gray-200 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Exam Name</td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-700">{exam.title}</td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 bg-gray-50">Conducting Body</td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-700">{exam.conductingBody}</td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 bg-gray-50">Exam Frequency</td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-700">{exam.examFrequency}</td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 bg-gray-50">Mode of Exam</td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-700">{exam.examMode}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Application Form */}
              {activeTab === "application" && (
                <div className="animate-fadeIn">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Application Form Process 2026</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    The application process for {exam.title} is entirely online. Candidates must visit the official MEC portal to submit their forms.
                  </p>

                  <h3 className="text-lg font-bold text-gray-800 mb-3 mt-6">Step-by-Step Registration</h3>
                  <div className="space-y-4">
                    {exam.applicationSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-md bg-gray-50">
                        <div className="bg-blue-100 text-brand-blue w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">{idx + 1}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">{step.title}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Eligibility */}
              {activeTab === "eligibility" && (
                <div className="animate-fadeIn">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Candidates must meet the following mandatory eligibility criteria laid down by the Medical Education Commission (MEC) to appear for the {exam.title} examination.
                  </p>
                  <div className="bg-blue-50/50 p-5 rounded-md border border-blue-100 mt-4 space-y-4">
                    {exam.eligibility.map((item, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" /> {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 ml-6 mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Syllabus & Pattern */}
              {activeTab === "syllabus" && (
                <div className="animate-fadeIn">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Exam Pattern & Syllabus</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {exam.title} is a single-paper examination consisting of Multiple Choice Questions (MCQs). The syllabus is based on the 10+2 science curriculum prescribed by the National Examination Board (NEB) of Nepal.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border border-gray-200 rounded-md p-5 bg-white ">
                      <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Exam Pattern</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {exam.examPattern.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">{item.label}:</span>
                            <span>{item.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-md overflow-hidden ">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-900 text-white">
                          <tr>
                            <th className="py-2.5 px-4 text-left text-sm font-semibold">Subject</th>
                            <th className="py-2.5 px-4 text-right text-sm font-semibold">Marks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {exam.subjectMarks.map((item, idx) => (
                            <tr key={idx} className={idx % 2 === 1 ? "bg-gray-50" : ""}>
                              <td className="py-2.5 px-4 text-sm text-gray-700">{item.subject}</td>
                              <td className="py-2.5 px-4 text-sm text-gray-700 text-right font-medium">{item.marks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Model Sets */}
              {activeTab === "modelsets" && (
                <div className="animate-fadeIn">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Model Sets & Past Papers</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Practicing with model sets and past year question papers is crucial to understand the exam format and time management.
                  </p>

                  <div className="space-y-3 mt-4">
                    {exam.modelSets.map((set, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover: transition-shadow bg-white">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-red-50 text-red-600 rounded-md"><FileText className="w-6 h-6" /></div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{set.title}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">PDF • {set.size} • {set.description}</p>
                          </div>
                        </div>
                        <button className="text-brand-blue hover:bg-blue-50 p-2 rounded-full"><Download className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses */}
              {activeTab === "courses" && (
                <div className="animate-fadeIn">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Courses & Admission Process</h2>
                  <p className="text-gray-600 mb-4">Through {exam.title}, candidates can secure admissions to various undergraduate medical programs. The major courses include:</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {exam.courses.map((course, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md text-sm font-medium border border-blue-100">{course}</span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Admission Process</h3>
                  <ol className="relative border-s border-gray-200 ml-3 space-y-4">
                    {exam.admissionSteps.map((step, idx) => (
                      <li key={idx} className="mb-4 ms-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-4 ring-white">
                          <span className="text-blue-800 text-xs font-bold">{idx + 1}</span>
                        </span>
                        <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Admit Card */}
              {activeTab === "admitcard" && (
                <div className="animate-fadeIn">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Admit Card Details</h2>
                  <p className="text-gray-600 mb-4">{exam.admitCardInfo}</p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 shrink-0" />
                      <p className="text-sm text-yellow-800"><strong>Important:</strong> Print your admit card in color and ensure your photograph is clearly visible.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exam Dates & Schedule */}
          <div className="bg-white rounded-md  border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{exam.title} Exam Dates & Schedule</h2>
                <p className="text-sm text-gray-500 mt-1">Take a look at the table below for the complete schedule of {exam.title} exam</p>
              </div>
              <button className="bg-[#00a844] hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-colors shrink-0">
                <Bell className="w-4 h-4" /> Keep Me Notified
              </button>
            </div>

            {/* Upcoming Dates */}
            <div className="border border-gray-200 rounded-md overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f3f4fb]">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 w-1/3">Dates</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Upcoming Exam Dates</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {exam.upcomingDates.map((date, idx) => (
                    <tr key={idx}>
                      <td className="py-4 px-4 text-sm text-gray-700">{date.date}</td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        <div>{date.event}</div>
                        {date.status && (
                          <span className="inline-block mt-1 bg-green-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{date.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Past Dates */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 opacity-70">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 w-1/3">Dates</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Past Exam Dates</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {exam.pastDates.map((date, idx) => (
                    <tr key={idx}>
                      <td className="py-4 px-4 text-sm text-gray-500">{date.date}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{date.event}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Explore Colleges */}
          <div className="bg-gradient-to-br from-[#f5f0ff] to-[#f0f4ff] rounded-md p-6 border border-purple-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="inline-block bg-[#b6a3de] text-white text-xs font-semibold px-2.5 py-1 rounded mb-2">Popular Colleges</span>
                <h2 className="text-xl font-bold text-gray-900">Explore colleges based on {exam.title}</h2>
                <p className="text-sm text-gray-600 mt-1">Based on {exam.courses.slice(0, 2).join(", ")}, {exam.title}</p>
              </div>
              <a href="#" className="text-brand-blue font-medium text-sm flex items-center hover:underline">View All <ChevronRight className="w-4 h-4" /></a>
            </div>

            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {/* College Card */}
              <div className="min-w-[280px] bg-white rounded-md p-5 border border-gray-100  flex flex-col justify-between hover: transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">Institute of Medicine (IOM)</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> Maharajgunj • Public</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                      <Building className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Courses Offered</p>
                      <p className="text-sm text-brand-blue font-medium mt-0.5">8 courses</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total Fees</p>
                      <p className="text-sm text-gray-900 font-medium mt-0.5">NPR 40.23 L</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50"><Bookmark className="w-5 h-5" /></button>
                  <button className="flex-1 bg-[#00a844] hover:bg-green-700 text-white py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                    <Download className="w-4 h-4" /> Brochure
                  </button>
                </div>
              </div>

              {/* Promo Card */}
              <div className="min-w-[320px] bg-white rounded-md p-5 border border-gray-100  flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3 w-[70%]">Confused about which college or exam to opt for?</h3>
                  <ul className="space-y-2 mb-4">
                    <li className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 shrink-0"></span> Chat with our counselor
                    </li>
                    <li className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 shrink-0"></span> Get your personalised list of colleges & exams matching your preferences
                    </li>
                  </ul>
                </div>
                <div className="absolute top-4 right-4 opacity-80">
                  <Headset className="w-12 h-12 text-purple-200" />
                </div>
                <button className="w-full bg-[#2a1b41] hover:bg-[#1a1028] text-white py-2.5 rounded-md font-medium text-sm transition-colors relative z-10">
                  Get Free Counselling
                </button>
              </div>

              {/* View All Card */}
              <div className="min-w-[150px] bg-white rounded-md p-5 border border-gray-100  flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mb-3 group-hover:border-brand-blue group-hover:text-brand-blue transition-colors">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <span className="font-bold text-brand-blue">View all</span>
                <span className="text-xs text-gray-500">Collections</span>
              </div>
            </div>

            <div className="text-center mt-6 border-t border-purple-100 pt-4 flex items-center justify-center gap-4">
              <span className="text-sm font-medium text-gray-700">Is this recommendation relevant?</span>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-500"><ThumbsDown className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-500"><ThumbsUp className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-md  border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <MessageCircleQuestion className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Commonly asked questions</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {exam.faqs.map((faq, idx) => (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="flex w-full justify-between items-center text-left focus:outline-none group"
                  >
                    <span className="font-semibold text-gray-800 group-hover:text-brand-blue transition-colors">Q: {faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openFaq === idx ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed pl-1">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="w-full lg:w-[32%] flex flex-col gap-6">
          {/* Quick Info Card */}
          <div className="bg-white rounded-md  border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Exam Highlights</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-blue-50 p-2.5 rounded-md text-brand-blue mt-0.5  border border-blue-100">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Exam Level</p>
                  <p className="text-sm font-semibold text-gray-900">{exam.examLevel}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-orange-50 p-2.5 rounded-md text-orange-500 mt-0.5  border border-orange-100">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Duration</p>
                  <p className="text-sm font-semibold text-gray-900">{exam.duration}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-50 p-2.5 rounded-md text-green-600 mt-0.5  border border-green-100">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Question Type</p>
                  <p className="text-sm font-semibold text-gray-900">{exam.questionType}</p>
                </div>
              </li>
            </ul>
            <button className="w-full mt-6 border-2 border-brand-blue text-brand-blue font-semibold py-2.5 rounded-md hover:bg-brand-blue hover:text-white transition-colors">
              Official Website
            </button>
          </div>

          {/* Important Dates Widget */}
          <div className="bg-white rounded-md  border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Important Dates</h3>
            <div className="relative border-l-2 border-gray-200 ml-2 space-y-6">
              <div className="relative">
                <span className="absolute -left-[9px] top-1 bg-brand-blue w-4 h-4 rounded-full border-[3px] border-white ring-1 ring-gray-200 "></span>
                <div className="pl-5">
                  <p className="text-sm font-semibold text-gray-900">Application Starts</p>
                  <p className="text-xs text-gray-500 mt-1">{exam.registrationStart}</p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute -left-[9px] top-1 bg-gray-300 w-4 h-4 rounded-full border-[3px] border-white ring-1 ring-gray-200 "></span>
                <div className="pl-5">
                  <p className="text-sm font-semibold text-gray-900">Last Date to Apply</p>
                  <p className="text-xs text-gray-500 mt-1">{exam.registrationEnd}</p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute -left-[9px] top-1 bg-gray-300 w-4 h-4 rounded-full border-[3px] border-white ring-1 ring-gray-200 "></span>
                <div className="pl-5">
                  <p className="text-sm font-semibold text-gray-900">Admit Card Release</p>
                  <p className="text-xs text-gray-500 mt-1">To be announced</p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute -left-[9px] top-1 bg-gray-300 w-4 h-4 rounded-full border-[3px] border-white ring-1 ring-gray-200 "></span>
                <div className="pl-5">
                  <p className="text-sm font-semibold text-gray-900">Exam Date</p>
                  <p className="text-xs text-gray-500 mt-1">{exam.examDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Try Mock Test Free Ad */}
          <div className="bg-gradient-to-br from-purple-600 to-gray-900 rounded-md  p-6 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Try Mock Test Free</h3>
              <p className="text-sm text-purple-100 mb-6 leading-relaxed">Assess your readiness with our full-length simulated {exam.title} exam environment.</p>
              <button className="bg-white text-purple-700 font-bold py-2.5 px-6 rounded-md w-full hover:bg-gray-50 transition-colors ">
                Start Free Test
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default EntranceDetailsPage;
