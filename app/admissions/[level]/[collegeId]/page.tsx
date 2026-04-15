"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Download,
  CheckCircle,
  Bell,
  Sparkles,
  ChevronUp,
  Search,
  MessageCircle,
  ArrowRight,
  Clock,
  Calendar,
  User,
  Share2,
  Bookmark,
} from "lucide-react";
import Image from "next/image";

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#eaf2fd] text-[#2563eb] flex items-center justify-center font-bold text-sm">
      {number}
    </div>
    <div>
      <h3 className="text-[17px] font-semibold text-gray-900 mt-2">{title}</h3>
      <p className="text-[14px] text-gray-600 mt-1.5 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  return (
    <details className="group border-b border-gray-100 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex justify-between items-center font-medium cursor-pointer list-none py-4 text-gray-800 text-[15px]">
        <span>Q: {question}</span>
        <span className="transition duration-300 group-open:rotate-180">
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </span>
      </summary>
      <div className="text-gray-600 mt-1 pb-5 text-[14px]">
        <p>{answer}</p>
      </div>
    </details>
  );
};

export default function AdmissionDetailPage() {
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#111827] antialiased pb-20">
      {/* Main Container */}
      <div className="max-w-350 mx-auto py-8 sm:py-12">
        {/* Banner Section */}
        <div className="relative w-full h-[50vh] bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden mb-8 sm:mb-12 shadow-sm">
          <img
            src="https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/c0374b68ef663e539f7e6aea4b84625b2a207a981656053172.jpg"
            alt="Cover Image"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header Information */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-gray-900 leading-tight">
            KIST College opens college visits and registration for top-25 merit
            scholarships
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
            <span>Created 17 days ago</span>
            <span>&middot;</span>
            <span>Last modified 17 hours ago</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10 sm:mb-12">
          <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700">
            Admission Open
          </span>
          <span className="px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
            NEB
          </span>
          <span className="px-3 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">
            2 YRS
          </span>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16">
          {/* Left Column: Main Content */}
          <article className="space-y-12">
            {/* What's New Section */}
            <div className="border border-gray-200 bg-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-start justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f0f4ff] flex items-center justify-center relative flex-shrink-0">
                    <Bell className="w-6 h-6 text-[#226ee7]" />
                    <span className="absolute -top-1 -left-1 text-[#60a5fa] text-[16px]">
                      ✨
                    </span>
                  </div>
                  <div>
                    <span className="text-[13px] text-gray-500 font-medium tracking-wide uppercase">
                      KIST College Admissions
                    </span>
                    <h2 className="text-xl sm:text-[22px] font-bold text-[#111827] mt-0.5">
                      What&apos;s new?
                    </h2>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <ChevronUp className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 text-gray-700 text-[15px] leading-relaxed">
                <p className="mb-4 text-[16px]">
                  All the latest updates regarding{" "}
                  <span className="font-semibold text-gray-900">
                    KIST College admissions 2026
                  </span>{" "}
                  are as follows:
                </p>
                <ul className="list-disc pl-5 space-y-3 mb-8 text-gray-600">
                  <li>
                    The Registration for Grade 11 is expected to start in Aug,
                    2026 for admission to the Science, Management, and
                    Humanities courses.
                  </li>
                  <li>
                    The Pre-Registration portal is active. Students need to log
                    in to the official college portal to reserve their seats
                    early and access their dashboard.
                  </li>
                  <li>
                    The KIST Entrance Examination registration link is active
                    for admission to the +2 programmes. The round 1 window to
                    view offers and make a decision will be opened on{" "}
                    <span className="font-semibold text-gray-900">
                      May 11, 2026
                    </span>{" "}
                    (10 AM).
                  </li>
                </ul>

                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setShowNotificationModal(true)}
                    className="bg-brand-blue hover:bg-brand-hover text-white font-semibold py-3 px-8 rounded-md flex items-center transition-all text-[15px]"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Keep Me Notified
                  </button>
                </div>
              </div>
            </div>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Admissions Now Open for New Session
              </h2>
              <p className="text-[17px] leading-relaxed text-gray-700">
                KIST College announces the official opening of admissions for
                the upcoming academic session. We invite prospective students to
                explore our comprehensive programs in Science, Management, and
                Humanities. Our institution is dedicated to fostering an
                environment of academic excellence, critical thinking, and
                holistic development. With state-of-the-art facilities, highly
                qualified faculty, and a robust curriculum, KIST prepares
                students to meet global challenges and excel in their chosen
                career paths.
              </p>
            </section>

            {/* FAQ Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <div className="absolute top-0 left-0 w-7 h-7 bg-[#fbd38d] rounded-lg flex items-center justify-center font-bold text-[#dd6b20] text-sm">
                    Q
                  </div>
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#fca5a5] rounded-lg flex items-center justify-center font-bold text-[#b91c1c] text-sm shadow-sm">
                    A
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Commonly asked questions
                </h2>
              </div>

              <div className="divide-y divide-gray-100 border-t border-gray-100">
                <FAQItem
                  question="How can I get admission in KIST College?"
                  answer="You can apply online through our portal or visit the college administration office directly. Admission is based on your SEE GPA and performance in the entrance test."
                />
                <FAQItem
                  question="Is it difficult to get admission in KIST College?"
                  answer="Admission is competitive but straightforward. Meeting the minimum GPA requirements and performing well in the entrance examination greatly improves your chances."
                />
                <FAQItem
                  question="Can I get admission in KIST College with 2.5 GPA in SEE?"
                  answer="Yes, a minimum of 2.5 GPA in SEE meets the basic eligibility criteria for Science, Management, and Humanities courses. However, final admission also depends on the entrance test results."
                />
                <FAQItem
                  question="What is the fees for the Science (+2) course at KIST College?"
                  answer="The total fee structure varies based on the course and merit scholarships. Please contact the college administration directly or download the brochure for a detailed fee breakdown."
                />
              </div>
            </section>

            {/* Fees and Eligibility Table Section */}
            <section className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                KIST College of Science Fees & Eligibility
              </h2>
              <p className="text-gray-500 mb-6 text-[15px]">
                Updated for 2026 Academic Session
              </p>

              <h3 className="text-lg font-bold text-gray-800 mb-4 inline-flex items-center gap-2">
                Full time Courses
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-gray-200  bg-white">
                <table className="w-full text-left border-collapse min-w-200">
                  <thead>
                    <tr className="bg-[#eff4fc] text-[15px]">
                      <th className="p-5 font-bold text-[#111827] w-[28%] border-r border-gray-100">
                        Course
                      </th>
                      <th className="p-5 font-bold text-[#111827] w-[22%] border-r border-gray-100">
                        Total Fees
                      </th>
                      <th className="p-5 font-bold text-[#111827] w-[20%] border-r border-gray-100">
                        Eligibility
                      </th>
                      <th className="p-5 font-bold text-[#111827] w-[15%] border-r border-gray-100">
                        Application Date
                      </th>
                      <th className="p-5 font-bold text-[#111827] w-[15%]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] text-gray-700">
                    {[
                      {
                        name: "Science (+2)",
                        eligibility: "SEE passed with minimum 2.5 GPA",
                        date: "Aug 2026",
                      },
                      {
                        name: "Management (+2)",
                        eligibility: "SEE passed with minimum 2.5 GPA",
                        date: "Aug 2026",
                      },
                      {
                        name: "Humanities (+2)",
                        eligibility: "SEE passed with minimum 2.5 GPA",
                        date: "Aug 2026",
                      },
                    ].map((course, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0"
                      >
                        <td className="p-5 align-top border-r border-gray-50">
                          <div className="text-gray-900 font-bold mb-1.5">
                            {course.name}
                          </div>
                          <button className="text-[#2563eb] text-[13px] hover:underline flex items-center font-medium">
                            View Curriculum{" "}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </button>
                        </td>
                        <td className="p-5 align-top border-r border-gray-50">
                          <div className="text-emerald-600 font-semibold mb-1.5">
                            Contact College for Details
                          </div>
                          <button className="text-[#2563eb] text-[13px] hover:underline flex items-center font-medium">
                            Check Details{" "}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </button>
                        </td>
                        <td className="p-5 align-top border-r border-gray-50 leading-relaxed">
                          {course.eligibility}
                        </td>
                        <td className="p-5 align-top border-r border-gray-50 font-medium">
                          {course.date}
                        </td>
                        <td className="p-5 align-top">
                          <button className="text-[#2563eb] hover:underline flex items-center font-bold">
                            Apply Now 
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Admission Process Section */}
            <section className="bg-[#f8fafc] rounded-md p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-[#111827] mb-6">
                KIST College Admission Process 2026
              </h2>
              <div className="text-gray-700 text-[16px] leading-relaxed space-y-6">
                <p>
                  As per the{" "}
                  <span className="font-semibold text-gray-900">
                    KIST College admission criteria
                  </span>{" "}
                  for +2 (or Bachelor&apos;s), students with a valid SEE/NEB
                  score that matches the{" "}
                  <button className="text-[#2563eb] hover:underline font-medium">
                    KIST College cutoff
                  </button>{" "}
                  are selected and given a seat. Students have to complete the{" "}
                  <button className="text-[#2563eb] hover:underline font-medium">
                    college application process
                  </button>{" "}
                  and take the test.
                </p>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />{" "}
                    Registration Process 2026
                  </h3>
                  <p className="text-gray-600">
                    Fill an online application form at the KIST College site
                    with all the relevant details around the personal and
                    educational details. Students must appear and qualify for
                    the accepted entrance exam before applying.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" /> Selection Process
                  </h3>
                  <p className="text-gray-600">
                    KIST College selects students mainly on an entrance basis
                    for all courses. The selection rounds include application
                    screening, entrance test, and personal interview.
                  </p>

                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {[
                      {
                        title: "Science (+2)",
                        steps: "SEE + Entrance + Interview",
                      },
                      {
                        title: "Management (+2)",
                        steps: "Screening + Entrance + Interview",
                      },
                    ].map((item, idx) => (
                      <li
                        key={idx}
                        className="bg-white p-4 rounded-xl border border-gray-200"
                      >
                        <span className="font-bold text-gray-900 block mb-1">
                          {item.title}
                        </span>
                        <span className="text-[13px] text-gray-500">
                          {item.steps}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Scholarships Overview Table Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Scholarships Overview
              </h2>

              <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
                <table className="w-full text-left border-collapse min-w-200">
                  <thead>
                    <tr className="bg-[#eff4fc]">
                      <th className="p-5 font-bold text-gray-900 w-[20%] border-r border-gray-100">
                        Scholarship
                      </th>
                      <th className="p-5 font-bold text-gray-900 w-[12%] border-r border-gray-100">
                        Level
                      </th>
                      <th className="p-5 font-bold text-gray-900 w-[15%] border-r border-gray-100">
                        Stream
                      </th>
                      <th className="p-5 font-bold text-gray-900 w-[12%] border-r border-gray-100">
                        Coverage
                      </th>
                      <th className="p-5 font-bold text-gray-900 w-[20%] border-r border-gray-100">
                        Eligibility
                      </th>
                      <th className="p-5 font-bold text-gray-900 w-[10%] border-r border-gray-100">
                        Seats
                      </th>
                      <th className="p-5 font-bold text-gray-900 w-[12%]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px]">
                    {[
                      {
                        name: "Merit Scholarship",
                        level: "+2",
                        stream: "Science",
                        coverage: "100%",
                        eligibility: "GPA 3.8+",
                        seats: "2",
                      },
                      {
                        name: "Entrance Topper",
                        level: "+2",
                        stream: "All",
                        coverage: "50%",
                        eligibility: "Top 5 rank",
                        seats: "5",
                      },
                    ].map((s, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="p-5 align-top border-r border-gray-50">
                          <div className="text-gray-900 font-bold mb-1">
                            {s.name}
                          </div>
                          <button className="text-[#2563eb] text-[12px] hover:underline font-medium">
                            View Scholarship
                          </button>
                        </td>
                        <td className="p-5 align-top border-r border-gray-50 text-gray-600">
                          {s.level}
                        </td>
                        <td className="p-5 align-top border-r border-gray-50 text-gray-600">
                          {s.stream}
                        </td>
                        <td className="p-5 align-top border-r border-gray-50 font-bold text-emerald-600">
                          {s.coverage}
                        </td>
                        <td className="p-5 align-top border-r border-gray-50 text-gray-600">
                          {s.eligibility}
                        </td>
                        <td className="p-5 align-top border-r border-gray-50 font-medium text-gray-900">
                          {s.seats}
                        </td>
                        <td className="p-5 align-top">
                          <button className="p-2 rounded-lg border hover:bg-gray-50 transition-colors tooltip flex items-center gap-2 text-blue-600 font-bold">
                            <Download className="w-4 h-4" />
                            File
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Application Process Vertical Steps */}
            <section>
              <h2 className="text-2xl font-bold text-[#111827] mb-8">
                Application Flow
              </h2>
              <div className="space-y-8 pl-4 relative">
                {/* Vertical Line */}
                <div className="absolute left-8.25 top-6 bottom-6 w-0.5 bg-gray-100" />

                <Step
                  number={1}
                  title="Online Registration"
                  description="Visit the official admission portal and register using your email ID and phone number. Make sure to use an active email."
                />
                <Step
                  number={2}
                  title="Fill Application Form"
                  description="Log in with your credentials and fill in your personal, academic, and contact details completely."
                />
                <Step
                  number={3}
                  title="Upload Documents"
                  description="Upload scanned copies of your SEE/NEB mark sheets, passport-size photographs, and character certificates as per the guidelines."
                />
                <Step
                  number={4}
                  title="Pay Application Fee"
                  description="Pay the required application fee securely via eSewa, Khalti, or bank transfer and submit the form for processing."
                />
              </div>
            </section>

            {/* Student Forum Section */}
            <section className="bg-[#fffbeb] border border-[#fef3c7] rounded-md p-8 sm:p-10 mt-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-md bg-white flex items-center justify-center relative shrink-0 border border-amber-200">
                  <div className="absolute top-2 left-2 text-amber-400">
                    <MessageCircle className="w-6 h-6 fill-current" />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white -mt-1">
                      Q
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 text-rose-300">
                    <MessageCircle className="w-6 h-6 fill-current" />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white -mt-1">
                      A
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[13px] text-amber-700 font-bold tracking-widest uppercase">
                    Community
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-1">
                    Student Forum
                  </h2>
                </div>
              </div>

              {/* Input Card */}
              <div className="bg-white rounded-md p-6 sm:p-8 border border-amber-200">
                <div className="flex items-center gap-3 mb-6">
                  <Search className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Have any questions for our experts?
                  </h3>
                </div>
                <div className="flex items-center gap-4 border-b-2 border-amber-50 pb-4 focus-within:border-amber-400 transition-colors">
                  <input
                    type="text"
                    placeholder="Ask about admissions, fees, environment..."
                    className="flex-1 text-[16px] text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                  <button className="bg-brand-blue hover:bg-[#0000cc] text-white text-sm font-bold py-2.5 px-6 rounded-md transition-all ">
                    Submit
                  </button>
                </div>
              </div>

              {/* Forum Questions */}
              <div className="mt-10 space-y-6">
                {[
                  {
                    q: "How Much GPA Is Required For Science (+2) Admission At KIST College?",
                    time: "2 months ago",
                    ans: "KIST College Science (+2) admission requires every candidate to have a minimum SEE GPA of 2.5. However, KIST will prioritize entrance test scores...",
                    author: "Saurabh Khanduri",
                    role: "Contributor-Level 10",
                    init: "S",
                  },
                  {
                    q: "Are there extracurricular activities available for students?",
                    time: "5 months ago",
                    ans: "Yes, KIST strongly emphasizes holistic development with several active clubs, annual sports weeks, and cultural programs to ensure student growth.",
                    author: "Aisha Thapa",
                    role: "Alumni-Batch 2022",
                    init: "A",
                  },
                ].map((post, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-md p-6 sm:p-8 border border-gray-200 transition-shadow"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight uppercase tracking-tight">
                      {post.q}
                    </h3>
                    <p className="text-[12px] text-gray-400 font-medium mb-4 flex items-center gap-1.5 italic">
                      <Clock className="w-3 h-3" /> Answered {post.time}
                    </p>

                    <div className="text-[15px] text-gray-600 leading-relaxed mb-6">
                      {post.ans}
                      <button className="text-[#2563eb] hover:underline font-bold ml-1">
                        ...Read more
                      </button>
                    </div>

                    <div className="border-t border-gray-50 pt-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                          {post.init}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-gray-900">
                            {post.author}
                          </div>
                          <div className="text-[12px] text-gray-500 font-medium">
                            {post.role}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </article>

          {/* Right Column: Sidebar */}
          <aside className="space-y-10 mt-8 lg:mt-0 sticky top-24">
            {/* Interest Card */}
            <div className="bg-white rounded-md border border-gray-200 p-8 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                Are You Interested in this College?
              </h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center bg-brand-blue hover:bg-brand-hover  text-white font-bold py-4 px-6 rounded-md transition-all shadow-emerald-100 group">
                  Apply Now
                </button>
                <button className="w-full flex items-center justify-center bg-brand-blue hover:bg-[#0000cc] text-white font-bold py-4 px-6 rounded-md transition-all shadow-blue-100 group">
                  Download Brochure
                  <Download className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Latest Updates Section */}
            <div className="bg-white rounded-md border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">
                  Latest Updates
                </h3>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700">
                  View All
                </button>
              </div>

              <div className="space-y-8">
                {[
                  {
                    tag: "Admission",
                    tagColor: "bg-blue-50 text-blue-600",
                    title: "MBBS Classes Begin at Purbanchal University",
                    time: "2 days ago",
                    img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
                  },
                  {
                    tag: "Notice",
                    tagColor: "bg-rose-50 text-rose-600",
                    title: "NEB Registration Form Fill-up Notice for Grade 11",
                    time: "5 days ago",
                    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
                  },
                ].map((update, idx) => (
                  <div
                    key={idx}
                    className="group cursor-pointer flex gap-4 items-start"
                  >
                    <div className="relative shrink-0 overflow-hidden rounded-2xl w-20 h-20 shadow-sm">
                      <img
                        src={update.img}
                        alt={update.tag}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`inline-block ${update.tagColor} text-[10px] font-black px-2 py-0.5 rounded-md uppercase mb-2 tracking-widest`}
                      >
                        {update.tag}
                      </span>
                      <h4 className="text-[14px] font-bold text-gray-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {update.title}
                      </h4>
                      <div className="text-gray-400 text-[11px] font-bold uppercase tracking-tight flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {update.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div className="bg-white rounded-md border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">
                  Upcoming Events
                </h3>
                <button className="text-sm font-bold text-blue-600">
                  View All
                </button>
              </div>

              <div className="space-y-6">
                {[
                  {
                    month: "May",
                    day: "15",
                    title: "Science & Tech Exhibition 2026",
                    loc: "Academy Hall",
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    month: "Jun",
                    day: "02",
                    title: "Orientation for New Batch",
                    loc: "Main Auditorium",
                    color: "bg-rose-50 text-rose-600",
                  },
                ].map((ev, idx) => (
                  <div
                    key={idx}
                    className="group cursor-pointer flex gap-5 items-center"
                  >
                    <div
                      className={`flex flex-col items-center justify-center rounded-2xl w-16 h-16 shrink-0 ${ev.color} shadow-sm border border-white`}
                    >
                      <span className="text-[11px] font-black uppercase leading-none mb-1 tracking-widest">
                        {ev.month}
                      </span>
                      <span className="text-2xl font-black leading-none">
                        {ev.day}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[15px] font-bold text-gray-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                        {ev.title}
                      </h4>
                      <div className="flex items-center text-gray-400 text-[12px] font-medium font-serif italic">
                        <MapPin className="w-3 h-3 mr-1" /> {ev.loc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white rounded-md border border-gray-200 p-5 sm:p-6">
              <div className="mb-5">
                <span className="text-[12px] text-gray-500 font-medium">KIST College</span>
                <h3 className="text-[20px] font-bold text-[#1e1b4b] mt-0.5 leading-tight">
                  Contact Information
                </h3>
              </div>

              <div className="relative w-full h-[100px] rounded-lg overflow-hidden mb-6 border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                  alt="Map Preview"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                  <button className="bg-[#6b5b7b]/95 hover:bg-[#5c4b6a] text-white text-[15px] font-semibold py-2.5 px-10 rounded-lg transition-colors shadow-sm">
                    View On Map
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-[14px]">
                <div className="flex gap-4">
                  <div className="w-[60px] text-gray-500 shrink-0 mt-0.5">
                    Address
                  </div>
                  <div className="text-[#1e1b4b] font-semibold leading-relaxed">
                    KIST College Campus
                    <br />
                    Kamalpokhari, Kathmandu
                    <br />
                    Bagmati Province, Nepal
                    <button className="inline-flex items-center mt-1.5 text-[#2563eb] hover:underline font-medium text-[13px]">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      View on Map
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                <div className="flex gap-4">
                  <div className="w-[60px] text-gray-500 shrink-0 mt-0.5">Phone</div>
                  <div className="text-[#1e1b4b] font-semibold space-y-4">
                    <div>
                      01-4112222, 4112233
                      <div className="text-gray-600 font-medium mt-0.5">
                        (For general query)
                      </div>
                    </div>
                    <div>
                      +977-9841000000
                      <div className="text-gray-600 font-medium mt-0.5">
                        (For admission query)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                <div className="flex gap-4">
                  <div className="w-[60px] text-gray-500 shrink-0 mt-0.5">Email</div>
                  <div className="text-[#1e1b4b] font-semibold">
                    <a
                      href="mailto:admission@kist.edu.np"
                      className="hover:text-[#2563eb] transition-colors"
                    >
                      admission@kist.edu.np
                    </a>
                  </div>
                </div>
              </div>

              <button className="mt-6 flex items-center justify-center w-full border cursor-pointer text-white font-bold py-3 rounded-md bg-brand-blue hover:bg-brand-hover transition-colors text-[15px]">
                Visit Website
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal Backdrop Container */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center -mb-20">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowNotificationModal(false)}
          />
          <div className="relative bg-white rounded-md w-full max-w-sm mx-4 p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowNotificationModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Sparkles className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-8">
              Stay updated with KIST! Join our notification list.
            </h3>

            <div className="space-y-5">
              <div className="relative">
                <select className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[15px] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium">
                  <option value="" disabled selected hidden>
                    Choose your field of interest
                  </option>
                  <option>Science (+2)</option>
                  <option>Management (+2)</option>
                  <option>Humanities (+2)</option>
                  <option>BBA / BIM / BBS</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <input
                type="email"
                placeholder="Your Gmail address"
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />

              <input
                type="tel"
                placeholder="Contact Number (WhatsApp)"
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
            </div>

            <button
              onClick={() => setShowNotificationModal(false)}
              className="w-full mt-8 bg-brand-blue text-white font-bold py-4 rounded-2xl shadow-blue-200 shadow-xl hover:bg-[#0000cc] transition-all"
            >
              Notify Me
            </button>

            <p className="text-[11px] text-gray-400 text-center mt-4">
              We value your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
