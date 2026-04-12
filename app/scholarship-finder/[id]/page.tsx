"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Download, 
  ArrowUpRight,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

export default function ScholarshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  // Fetch Scholarship Details
  const { data: detailRes, isLoading: isDetailLoading, error: detailError } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: () => apiService.getEducationScholarshipById(id),
  });

  // Fetch Similar Scholarships
  const { data: similarRes } = useQuery({
    queryKey: ["similar-scholarships", id],
    queryFn: () => apiService.getEducationSimilarScholarships(id),
  });

  const scholarship = detailRes?.data;
  const similarScholarships = similarRes?.data?.scholarships || [];

  if (isDetailLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (detailError || !scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] p-4 text-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Scholarship Not Found</h2>
          <Link href="/scholarship-finder" className="text-blue-600 font-bold underline">Back to Finder</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#f7f7f7] min-h-screen p-4 sm:p-8 md:pl-16 lg:pl-32 pt-8 sm:pt-12 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Page Layout Wrapper (Content + Right Sidebar) */}
      <div className="flex flex-col xl:flex-row w-full gap-10 items-start max-w-[1450px]">

        {/* Main Content Wrapper */}
        <div className="w-full max-w-[950px] flex flex-col gap-6">
            
            {/* Heading */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
              {scholarship.title}
            </h1>

            {/* Gallery Container */}
            <div className="w-full flex flex-col md:flex-row gap-[10px] h-auto md:h-[420px]">
                
                {/* Left Panel (Main Image) */}
                <div className="relative w-full md:w-[66%] h-[300px] md:h-full rounded-lg overflow-hidden cursor-pointer shadow-sm group">
                    <img 
                        src={scholarship.image_url || "https://i.pinimg.com/1200x/dc/d6/08/dcd608a6e3100512a81e676442e02380.jpg"} 
                        alt={scholarship.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>

                {/* Right Panel (Secondary Image / Notice) */}
                <div className="relative w-full md:w-[34%] h-[250px] md:h-full rounded-lg overflow-hidden cursor-pointer shadow-sm bg-gray-50 border border-gray-200 group p-2">
                    
                    {/* Official Notice Badge */}
                    <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">
                        Official Notice
                    </div>
                    
                    {/* Official Notice Image (Now contained, no zoom) */}
                    <img 
                        src={scholarship.notice_image_url || "https://media.edusanjal.com/c/2026-04-01-12-10-19-2082-12-18-pdf.png"} 
                        alt="Official Notice Document" 
                        className="w-full h-full object-contain opacity-95 group-hover:opacity-100 transition-opacity"
                    />

                    {/* Website Link */}
                    <a href={scholarship.provider_website || "https://nast.gov.np"} target="_blank" className="absolute bottom-4 left-4 z-10 bg-white px-3 py-1.5 rounded shadow-md text-xs font-bold text-gray-700 hover:text-blue-600 transition-symbols border border-gray-100 uppercase tracking-tight">
                        {scholarship.provider_domain || "nast.gov.np"}
                    </a>
                    
                    {/* Download Button */}
                    <a href={scholarship.official_notice_url || "#"} className="absolute bottom-4 right-4 z-10 bg-white p-2.5 rounded-full shadow-md text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all border border-gray-100" title="Download Notice">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    </a>
                </div>

            </div>

            {/* Scholarship Details Section */}
            <div className="flex flex-col gap-8 mt-4 md:mt-8 pb-12">
                
                {/* Description */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Program Description</h2>
                    <p className="text-gray-600 leading-relaxed text-[15.5px]">
                        {scholarship.description || "The Specialized Research Center at NAST, Gandaki Province, invites applications from dynamic and motivated researchers for its annual research grant. This program aims to foster innovation in science and technology, with a special focus on utilizing local resources and sustainable development."}
                    </p>
                </section>

                {/* Research Themes & Grant Details */}
                <div className="flex flex-col md:flex-row gap-8">
                    <section className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">Priority Thematic Areas</h2>
                        <p className="text-gray-600 mb-3 text-sm">Proposals must align with the needs of the {scholarship.location?.split(', ')[0] || "specified province"} in one or more of these areas:</p>
                        <ul className="list-none space-y-3 text-gray-600">
                            {[
                              { title: "Agriculture & Food Tech", desc: "Enhancing local crop yields, organic farming, and indigenous food processing." },
                              { title: "Renewable Energy", desc: "Micro-hydro, solar optimization, and localized alternative energy solutions." },
                              { title: "Environmental Conservation", desc: "Climate change adaptation, waste management, and biodiversity protection." }
                            ].map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span className="text-[14.5px]"><strong>{item.title}:</strong> {item.desc}</span>
                              </li>
                            ))}
                        </ul>
                    </section>

                    <section className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">Grant Coverage & Financials</h2>
                        <ul className="list-none space-y-3 text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1 font-bold tracking-widest">•</span>
                                <span className="text-[14.5px]"><strong>Maximum Funding:</strong> {scholarship.value || "Up to NPR 500,000 per selected project."}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1 font-bold tracking-widest">•</span>
                                <span className="text-[14.5px]"><strong>Allowable Expenses:</strong> Specific research equipment, laboratory consumables, field travel, and data collection.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1 font-bold tracking-widest">•</span>
                                <span className="text-[14.5px]"><strong>Non-Allowable Expenses:</strong> Base salaries for principal investigators, institutional overheads, and international travel.</span>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Eligibility & Requirements */}
                <div className="flex flex-col md:flex-row gap-8">
                    <section className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">Eligibility Criteria</h2>
                        <ul className="list-none space-y-2 text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1 font-bold tracking-widest">•</span>
                                <span className="text-[14.5px]">Hold at least a {scholarship.degree_level || "Master's degree"} in a relevant field of Science or Technology.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1 font-bold tracking-widest">•</span>
                                <span className="text-[14.5px]">Currently affiliated with a recognized academic institution, university, or research organization in Nepal.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1 font-bold tracking-widest">•</span>
                                <span className="text-[14.5px]">Preference will be given to research topics directly impacting the local province.</span>
                            </li>
                        </ul>
                    </section>

                    <section className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">Required Documents</h2>
                        <ul className="list-none space-y-2 text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1 font-bold tracking-widest">•</span>
                                <span className="text-[14.5px]">Detailed Research Proposal (Max 10 pages, including budget and timeline).</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1 font-bold tracking-widest">•</span>
                                <span className="text-[14.5px]">Updated Curriculum Vitae (CV) of the principal investigator.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1 font-bold tracking-widest">•</span>
                                <span className="text-[14.5px]">Institutional recommendation/approval letter.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1 font-bold tracking-widest">•</span>
                                <span className="text-[14.5px]">Copies of highest academic transcripts.</span>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Commonly Asked Questions Section */}
                <div className="pt-2 pb-2">
                    <div className="flex items-center gap-4 mb-6">
                        {/* Q&A Bubbles Icon */}
                        <div className="relative flex-shrink-0">
                            <svg width="46" height="46" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M34 16H42C43.1046 16 44 16.8954 44 18V32C44 33.1046 43.1046 34 42 34H36V42L26 34H20C18.8954 34 18 33.1046 18 32V18C18 16.8954 18.8954 16 20 16H34Z" fill="#F3CA8C"/>
                                <path d="M28 8H10C8.89543 8 8 8.89543 8 10V24C8 25.1046 8.89543 26 10 26H16V34L26 26H28C29.1046 26 30 25.1046 30 24V10C30 8.89543 29.1046 8 28 8Z" fill="#F0A04B"/>
                                <text x="14" y="21" fill="white" font-size="12" font-family="sans-serif" font-weight="bold">Q</text>
                                <text x="27" y="29" fill="white" font-size="12" font-family="sans-serif" font-weight="bold">A</text>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-[20px] font-bold text-gray-900 leading-tight">Commonly asked questions</h2>
                            <p className="text-[14px] text-gray-500 mt-0.5">On {scholarship.scholarship_type || "Scholarship"} Eligibility & Fees</p>
                        </div>
                    </div>

                    <div className="flex flex-col border-t border-gray-200">
                        {[
                          { q: `What is the fee for application at ${scholarship.provider}?`, a: "The application fee structure varies. Please refer to the official brochure for detailed information." },
                          { q: `What is the total value of this award?`, a: `The total estimated value is ${scholarship.value || "specified in the guidelines"}, subject to institutional review.` },
                          { q: `Which cultural/academic events are hosted by ${scholarship.org || scholarship.provider}?`, a: "The organization hosts numerous symposiums, fests, and annual meets throughout the academic year." },
                          { q: `Is the scholarship available for both national and international candidates?`, a: "This specific grant focuses on candidates affiliated with Nepalese institutions, preferably in the Gandaki province." }
                        ].map((faq, idx) => (
                          <details key={idx} className="group border-b border-gray-200">
                              <summary className="flex justify-between items-center font-semibold cursor-pointer list-none py-4 text-gray-800 hover:text-blue-600 text-[15px] [&::-webkit-details-marker]:hidden">
                                  <span className="pr-6">Q: {faq.q}</span>
                                  <span className="transition group-open:rotate-180 flex-shrink-0 text-gray-500 group-hover:text-blue-600">
                                      <svg fill="none" height="20" stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                                  </span>
                              </summary>
                              <p className="text-gray-600 mt-1 mb-4 text-[14px] pr-8 leading-relaxed">
                                  {faq.a}
                              </p>
                          </details>
                        ))}
                    </div>
                </div>

                {/* Combined Important Dates & Selection Process */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Important Dates & Selection Process</h2>
                    <div className="flex flex-col md:flex-row gap-8 mt-4">
                        {/* Subtitle 1: Selection Process */}
                        <section className="flex-1">
                            <h3 className="text-lg font-bold text-gray-700 mb-3">Selection Process</h3>
                            <p className="text-gray-600 mb-3 text-sm">Proposals will undergo a double-blind peer review. Key evaluation weightings:</p>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                                        <span>Scientific merit and originality</span>
                                        <span className="font-bold text-blue-600">30%</span>
                                    </li>
                                    <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                                        <span>Relevance to local needs</span>
                                        <span className="font-bold text-blue-600">30%</span>
                                    </li>
                                    <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                                        <span>Feasibility of methodology & timeline</span>
                                        <span className="font-bold text-blue-600">20%</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>Applicant's research capacity</span>
                                        <span className="font-bold text-blue-600">20%</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Subtitle 2: Timeline */}
                        <section className="flex-1">
                            <h3 className="text-lg font-bold text-gray-700 mb-3">Timeline</h3>
                            <p className="text-gray-600 mb-3 text-sm">Please adhere to the following schedule for the grant application and award process:</p>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-gray-600 font-medium">Proposal Submission Deadline</span>
                                        <span className="font-bold text-gray-900">{scholarship.deadline}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-2 text-[13.5px]">
                                        <span className="text-gray-600">Shortlist Announcement</span>
                                        <span className="font-semibold text-gray-900">June 15, 2026</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-2 text-[13.5px]">
                                        <span className="text-gray-600">Interview / Presentation</span>
                                        <span className="font-semibold text-gray-900">June 25, 2026</span>
                                    </div>
                                    <div className="flex justify-between text-[13.5px]">
                                        <span className="text-gray-600">Final Award Notification</span>
                                        <span className="font-semibold text-gray-900">July 5, 2026</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Terms and Conditions (Numbered Paragraphs) */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Terms and Conditions</h2>
                    <div className="space-y-4 text-gray-600">
                        <div className="flex gap-3 items-start">
                            <span className="font-bold text-xl text-black leading-none mt-0.5">1.</span>
                            <span className="text-[14.5px] leading-relaxed">All research proposals must be original and not currently funded by any other organization. Any form of plagiarism will result in immediate disqualification from the grant program.</span>
                        </div>
                        <div className="flex gap-3 items-start">
                            <span className="font-bold text-xl text-black leading-none mt-0.5">2.</span>
                            <span className="text-[14.5px] leading-relaxed">The principal investigator must ensure that all necessary ethical approvals (if applicable) are obtained prior to the commencement of the project.</span>
                        </div>
                        <div className="flex gap-3 items-start">
                            <span className="font-bold text-xl text-black leading-none mt-0.5">3.</span>
                            <span className="text-[14.5px] leading-relaxed">Mid-term and final progress reports, along with audited financial statements, must be submitted to the regional office upon the completion of specific grant milestones.</span>
                        </div>
                    </div>
                </section>

                {/* Attachments & Important Links */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Attachments & Downloads</h2>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                        <a href="#" className="flex items-center justify-between gap-4 text-blue-700 hover:text-blue-900 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-lg border border-blue-200 shadow-sm sm:w-auto w-full group">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                                <span className="font-medium text-sm">Proposal_Format.docx</span>
                            </div>
                            <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        </a>
                        
                        <a href="#" className="flex items-center justify-between gap-4 text-blue-700 hover:text-blue-900 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-lg border border-blue-200 shadow-sm sm:w-auto w-full group">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
                                <span className="font-medium text-sm">Budget_Template.xlsx</span>
                            </div>
                            <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        </a>
                        
                        <a href="#" className="flex items-center justify-between gap-4 text-blue-700 hover:text-blue-900 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-lg border border-blue-200 shadow-sm sm:w-auto w-full group">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12v6"/><path d="M14 12v6"/><path d="M10 12l4 6"/><path d="M14 12l-4 6"/></svg>
                                <span className="font-medium text-sm">Guidelines.pdf</span>
                            </div>
                            <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        </a>
                    </div>
                </section>

                {/* Call to Action / Apply Button */}
                <div className="mt-4 border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-[13.5px] text-gray-500 leading-relaxed font-medium">
                        Questions? Contact provider: <a href={`mailto:${scholarship.provider_email || 'research@provider.org'}`} className="text-blue-600 font-bold hover:underline">{scholarship.provider_email || 'research.gandaki@nast.gov.np'}</a>
                        <br />
                        For details visiting: <a href="https://studsphere.com" target="_blank" className="text-blue-600 font-bold hover:underline">studsphere.com</a>
                    </div>
                    <Link 
                      href="/scholarship-apply"
                      className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/10 transition-all duration-200 text-center"
                    >
                        Apply for Scholarship
                    </Link>
                </div>

            </div>
        </div>

        {/* Right Sidebar: Contact, Form & Related Scholarships --> */}
        <aside className="w-full xl:w-[350px] 2xl:w-[380px] flex-shrink-0 flex flex-col gap-6 xl:mt-[76px] pb-12 overflow-visible">
            
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4 text-[14px] text-gray-600 font-medium tracking-tight">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span className="leading-snug">{scholarship.provider}<br/>{scholarship.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-blue-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <a href={`mailto:${scholarship.provider_email || 'info@provider.org'}`} className="hover:text-blue-600 transition-colors truncate">{scholarship.provider_email || 'research.gandaki@nast.gov.np'}</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-blue-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        <span>+977 061-532XXX</span>
                    </div>
                    <div className="flex items-center gap-3 border-t border-gray-50 pt-3 mt-1">
                        <svg className="w-5 h-5 text-blue-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                        <a href={scholarship.provider_website || "https://nast.gov.np"} target="_blank" className="hover:text-blue-600 transition-colors uppercase text-[11px] font-bold tracking-wider">{scholarship.provider_domain || "nast.gov.np"}</a>
                    </div>
                </div>
            </div>

            {/* Request Information Form */}
            <div className="bg-white p-6 sm:p-7 rounded-[20px] shadow-sm border border-gray-100">
                <h2 className="text-[22px] font-bold text-gray-900 mb-2">Request Information</h2>
                <p className="text-[15px] text-gray-500 mb-6 leading-snug font-medium">Fill the form and our admission counselor will contact you.</p>

                <form className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] text-sm placeholder-gray-400 bg-white font-medium shadow-xs" />
                    <input type="email" placeholder="Email Address" className="w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] text-sm placeholder-gray-400 bg-white font-medium shadow-xs" />
                    <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] text-sm placeholder-gray-400 bg-white font-medium shadow-xs" />
                    <div className="relative">
                        <select className="w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] text-sm text-gray-500 appearance-none bg-white font-medium shadow-xs">
                            <option value="" disabled selected>Select Course of Interest</option>
                            <option>Research Grant Inquiry</option>
                            <option>Facility Access</option>
                            <option>Other Information</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    <div className="pt-2">
                        <button type="button" className="w-full bg-[#0000ff] hover:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all text-[15px] flex items-center justify-center gap-2.5 shadow-xl shadow-blue-500/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                            </svg>
                            Keep me notified
                        </button>
                    </div>
                </form>
            </div>

            {/* Related Scholarships Section */}
            <div className="flex flex-col gap-5 mt-2">
                <h2 className="text-xl font-bold text-gray-800">Related Scholarships</h2>
                
                {similarScholarships.length > 0 ? similarScholarships.map((item: any) => (
                    <Link key={item.id} href={`/scholarship-finder/${item.id}`} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded">Grant</span>
                        </div>
                        <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight text-[14.5px]">{item.title}</h3>
                        <p className="text-[11px] text-gray-500 mt-4 flex items-center gap-1.5 font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            Deadline: {item.deadline || "Soon"}
                        </p>
                    </Link>
                )) : (
                  <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400 font-bold">No similar scholarship found.</p>
                  </div>
                )}
            </div>
        </aside>

      </div>
    </main>
  );
}
