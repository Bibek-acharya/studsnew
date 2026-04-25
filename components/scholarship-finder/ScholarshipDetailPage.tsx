"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  Award,
  Users,
  GraduationCap,
  Handshake,
  Trophy,
  CircleCheck,
  ArrowRight,
  Share2,
  IdCard,
  Bell,
  Phone,
  Mail,
  Globe,
  CircleAlert,
  BookOpen,
  ClipboardList,
  X,
} from "lucide-react";

const tabs = [
  { id: "about", label: "About" },
  { id: "scholarship", label: "Scholarship" },
  { id: "eligibility", label: "Eligibility & Criteria" },
  { id: "timeline", label: "Timeline" },
  { id: "centers", label: "Exam Centers" },
  { id: "news", label: "News & Notice" },
  { id: "achievements", label: "Achievements" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "FAQ" },
  { id: "partners", label: "Partners" },
  { id: "review", label: "Review" },
];

const galleryImages = [
  "https://projectshiksha.hundredgroupnepal.org/images/shiks.jpg",
  "https://sowersaction.org.np/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-02-at-14.37.52_81769f1f.jpg",
  "https://sowersaction.org.np/wp-content/uploads/2025/02/cafe.jpg",
  "https://sowersaction.org.np/wp-content/uploads/2025/01/IMG_7141-scaled.jpg",
  "https://sowersaction.org.np/wp-content/uploads/2025/01/IMG_5591-e1739791077307.jpeg",
  "https://sowersaction.org.np/wp-content/uploads/2025/02/WhatsApp-Image-2025-03-28-at-14.19.06_688006be.jpg",
];

const faqs = [
  { q: "Who is eligible to apply for Project Shiksha Scholarship?", a: 'SEE graduates of 2081/2082 from any board in Nepal with minimum 2.0 GPA, maximum 18 years of age, and must be enrolled or planning to enroll in Grade 11/+2 program in Nepal. Priority is given to students from economically disadvantaged backgrounds.' },
  { q: "What is the difference between Fully Funded and Partially Funded scholarships?", a: '<strong>Fully Funded (60 seats):</strong> Covers tuition fees, food, and accommodation for students with family annual income below NPR 150,000. <strong>Partially Funded (50 seats):</strong> Covers tuition fees only for students with family annual income below NPR 300,000.' },
  { q: "How do I apply for the scholarship?", a: "Applications are submitted online through the official Project Shiksha website. You need to fill out the application form and upload required documents including SEE mark sheet, character certificate, citizenship certificate (if available), birth certificate, family income certificate, recommendation letter, passport-sized photos, and +2 admission confirmation." },
  { q: "What is the selection process?", a: "The selection process consists of 4 stages: (1) Online application submission, (2) Written entrance examination (40% pass mark required), (3) Personal interview for shortlisted candidates, and (4) Final result publication on the official website." },
  { q: "Where will the entrance examination be held?", a: "The entrance examination is conducted simultaneously across 7 exam centers in different provinces: Kathmandu (Bagmati), Pokhara (Gandaki), Butwal (Lumbini), Biratnagar (Koshi), Kailali (Sudurpashchim), Lahan and Birgunj (Madhesh Province)." },
  { q: "Is there an age limit for applying?", a: "Yes, applicants must be maximum 18 years of age as of the application deadline date. This is a strict criteria and applications exceeding this age limit will not be considered." },
  { q: "Can I apply if I'm already enrolled in +2?", a: "Yes, students who are already enrolled in Grade 11/+2 programs can apply. However, you must provide +2 admission confirmation as part of your application documents." },
  { q: "What happens if I score below 40% in the entrance exam?", a: "Students must score at least 40% in the entrance examination to be considered for the scholarship. If you score below 40%, you will not be eligible to proceed to the interview round." },
  { q: "Are there separate quotas for boys and girls?", a: "Yes, for the Fully Funded category, there are 30 seats reserved for boys and 30 seats for girls. The Partially Funded category is open to all genders." },
];

const examCenters = [
  { province: "Bagmati Province", color: "bg-blue-50", iconColor: "text-blue-600", city: "Kathmandu", venue: "Advance Academy, Lalitpur", contact: "Mr. Bablu Gupta", phone: "9851131074, 9861116456" },
  { province: "Gandaki Province", color: "bg-green-50", iconColor: "text-green-600", city: "Pokhara", venue: "Gandaki College, Mahendrapul", contact: "Mr. Prasanna Dhungel, Mr. Pabin Chhetri", phone: "9801127672, 9856009596" },
  { province: "Lumbini Province", color: "bg-yellow-50", iconColor: "text-yellow-600", city: "Butwal", venue: "Butwal Campus, Tankasinwa", contact: "Mr. Sushant Acharya, Er. Subodh Regmi", phone: "9749394615, 9851313120" },
  { province: "Koshi Province", color: "bg-gray-100", iconColor: "text-gray-600", city: "Biratnagar", venue: "Koshi College, Main Road", contact: "Mr. Dhiraj Shah", phone: "9827329145" },
  { province: "Sudurpashchim Province", color: "bg-red-50", iconColor: "text-red-600", city: "Kailali", venue: "Seti College, Dhangadhi", contact: "Mr. Jay Dhami", phone: "9868742691" },
  { province: "Madhesh Province", color: "bg-blue-50", iconColor: "text-blue-600", city: "Lahan", venue: "Janak Education Center", contact: "Mr. Aashish Chaudhary, Mr. Shiv Yadav", phone: "9818378642, 9861969297" },
  { province: "Madhesh Province", color: "bg-blue-50", iconColor: "text-blue-600", city: "Birgunj", venue: "Narayani Academy, Ghantaghar", contact: "Mr. Anurag Gupta, Mr. Prabhat Kumar", phone: "9844000111, 9801230707" },
];

const partners = [
  { name: "100 Group", logo: "https://hundredgroupnepal.org/wp-content/uploads/2023/01/hundredlogo.svg" },
  { name: "Sowers Action Nepal", logo: "https://sowersaction.org.np/wp-content/uploads/2025/04/logo.png" },
  { name: "RONB", logo: "" },
  { name: "Ncell Foundation", logo: "" },
  { name: "Dari Club USA", logo: "" },
  { name: "Creating Opportunities", logo: "" },
];

interface ScholarshipDetailPageProps {
  scholarship: any;
  similarScholarships: any[];
}

export default function ScholarshipDetailPage({ scholarship, similarScholarships }: ScholarshipDetailPageProps) {
  const [activeTab, setActiveTab] = useState("about");
  const [faqOpen, setFaqOpen] = useState<number[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [scholarshipFilter, setScholarshipFilter] = useState("all");
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (dir: number) => {
    if (tabContainerRef.current) {
      tabContainerRef.current.scrollBy({ left: dir * 200, behavior: "smooth" });
    }
  };

  const toggleFaq = (idx: number) => {
    setFaqOpen((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const changeImage = (dir: number) => {
    if (lightboxIndex === null) return;
    const newIdx = lightboxIndex + dir;
    if (newIdx >= 0 && newIdx < galleryImages.length) {
      setLightboxIndex(newIdx);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") changeImage(-1);
      if (e.key === "ArrowRight") changeImage(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, changeImage]);

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <div className="mx-auto max-w-350 pt-12 pb-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-bold text-gray-900 md:text-4xl">{scholarship.title}</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <IdCard size={16} /> Find My Admin Card
            </button>
            <button
              type="button"
              className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-2.5 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
        <div
          className="relative h-[280px] w-full overflow-hidden rounded-md bg-cover bg-center md:h-[380px]"
          style={{ backgroundImage: `url('https://sowersaction.org.np/wp-content/uploads/2025/02/WhatsApp-Image-2025-04-02-at-12.30.05_e9d62468.jpg')`, backgroundPosition: "center 20%" }}
        >
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-0 z-40 overflow-hidden border-b border-gray-100 bg-white mx-auto max-w-350">
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollTabs(-1)}
            className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white md:hidden"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <div ref={tabContainerRef} className="hide-scrollbar overflow-x-auto">
            <nav className="flex whitespace-nowrap border-b border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`border-b-2 px-4 py-4 text-[14px] transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 font-bold text-gray-900"
                      : "border-transparent font-semibold text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <button
            type="button"
            onClick={() => scrollTabs(1)}
            className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white md:hidden"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content + Sidebar */}
      <div className="mx-auto max-w-350 grid grid-cols-1 gap-10 bg-white py-8 md:py-12 lg:grid-cols-3">
        <div className="min-h-[500px] lg:col-span-2">
          {/* Tab: About */}
          {activeTab === "about" && (
            <div className="space-y-10">
              <div className="space-y-6 text-[15px] leading-[1.8] text-gray-600 md:text-[15.5px]">
                <p>Project Shiksha is a transformative <strong className="font-bold text-gray-900">full scholarship program</strong> designed to provide exceptional SEE graduates from across Nepal with access to higher secondary education, along with complete support for tuition, fooding, and accommodation.</p>
                <p>This nationwide program is proudly co-led by <strong className="font-bold text-gray-900">100 Group, Sowers Action Nepal & Hong Kong, and Routine of Nepal Banda (RONB)</strong>, with academic partnership from <strong className="font-bold text-gray-900">Ncell Foundation, Dari Club USA</strong> and technical support from <strong className="font-bold text-gray-900">Creating Opportunities</strong>.</p>
              </div>

              <div>
                <h3 className="mb-6 text-[22px] font-bold text-gray-900">Our Journey Timeline</h3>
                <TimelineVertical />
              </div>
            </div>
          )}

          {/* Tab: Scholarship */}
          {activeTab === "scholarship" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">Scholarship Program 2082</h2>
                <p className="mt-1 text-[14px] text-gray-500">Fully funded higher secondary education for SEE graduates across Nepal</p>
              </div>
              <div className="mb-6 text-[14px] leading-relaxed text-gray-600">
                <p className="mb-4">Project Shiksha is a transformative scholarship program designed to provide exceptional SEE graduates from across Nepal with access to higher secondary education, along with complete support for tuition, fooding, and accommodation.</p>
                <p>This scholarship is based on financial need and academic performance of candidates.</p>
              </div>

              {/* Scholarship Table */}
              <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                  <p className="text-[14px] font-semibold text-blue-600">Filter by education level</p>
                  <div className="flex gap-2 text-[13px] font-medium">
                    <button type="button" onClick={() => setScholarshipFilter("all")} className={`rounded-full px-4 py-1.5 transition ${scholarshipFilter === "all" ? "bg-blue-600 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>All</button>
                    <button type="button" onClick={() => setScholarshipFilter("fully")} className={`rounded-full px-4 py-1.5 transition ${scholarshipFilter === "fully" ? "bg-blue-600 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>Fully Funded</button>
                    <button type="button" onClick={() => setScholarshipFilter("partially")} className={`rounded-full px-4 py-1.5 transition ${scholarshipFilter === "partially" ? "bg-blue-600 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>Partially Funded</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-4">
                      <div className="col-span-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">TYPE</div>
                      <div className="col-span-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">SEATS</div>
                      <div className="col-span-2 text-[12px] font-bold uppercase tracking-wider text-gray-500">COVERAGE</div>
                      <div className="col-span-2 text-[12px] font-bold uppercase tracking-wider text-gray-500">ELIGIBILITY</div>
                      <div className="col-span-2 text-right text-[12px] font-bold uppercase tracking-wider text-gray-500">ACTION</div>
                    </div>
                    <ScholarshipRow type="Fully Funded" seats="60 Seats (30 Boys & 30 Girls)" coverage="Full Support" coverageClass="text-green-600 bg-green-50" eligibility="Financial Need + Merit" show={scholarshipFilter === "all" || scholarshipFilter === "fully"} />
                    <ScholarshipRow type="Partially Funded" seats="50 Seats" coverage="Tuition Only" coverageClass="text-blue-600 bg-blue-50" eligibility="Merit Based" show={scholarshipFilter === "all" || scholarshipFilter === "partially"} />
                  </div>
                </div>
              </div>

              {/* Selection Rubric Table */}
              <div className="mt-6">
                <h3 className="mb-4 text-[17px] font-bold text-gray-900">Selection Process & Rubric</h3>
                <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-5 py-3 text-left text-[13px] font-bold text-gray-700">Criteria</th>
                          <th className="px-5 py-3 text-left text-[13px] font-bold text-gray-700">Weight</th>
                          <th className="px-5 py-3 text-left text-[13px] font-bold text-gray-700">Marks</th>
                          <th className="px-5 py-3 text-left text-[13px] font-bold text-gray-700">Pass Mark</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <RubricRow criteria="Written Examination" desc="English, Math, Science, Social Studies" weight="60%" marks="60 Marks" pass="24 Marks" />
                        <RubricRow criteria="Personal Interview" desc="Communication, Confidence, Goals" weight="25%" marks="25 Marks" pass="10 Marks" />
                        <RubricRow criteria="Academic Record" desc="SEE GPA & Previous Performance" weight="10%" marks="10 Marks" pass="4 Marks" />
                        <RubricRow criteria="Financial Need Assessment" desc="Family Income, Economic Background" weight="5%" marks="5 Marks" pass="2 Marks" />
                        <tr className="bg-blue-50">
                          <td className="px-5 py-4 text-[14px] font-bold text-gray-900">Total</td>
                          <td className="px-5 py-4 text-[14px] font-bold text-gray-900">100%</td>
                          <td className="px-5 py-4 text-[14px] font-bold text-gray-900">100 Marks</td>
                          <td className="px-5 py-4 text-[14px] font-bold text-green-600">40 Marks</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Eligibility */}
          {activeTab === "eligibility" && <EligibilityTab />}

          {/* Tab: Timeline */}
          {activeTab === "timeline" && <TimelineTab />}

          {/* Tab: Exam Centers */}
          {activeTab === "centers" && <ExamCentersTab />}

          {/* Tab: News */}
          {activeTab === "news" && <NewsTab />}

          {/* Tab: Achievements */}
          {activeTab === "achievements" && <AchievementsTab />}

          {/* Tab: Gallery */}
          {activeTab === "gallery" && (
            <GalleryTab images={galleryImages} lightboxIndex={lightboxIndex} setLightboxIndex={setLightboxIndex} closeLightbox={closeLightbox} changeImage={changeImage} />
          )}

          {/* Tab: FAQ */}
          {activeTab === "faq" && <FaqTab faqs={faqs} faqOpen={faqOpen} toggleFaq={toggleFaq} />}

          {/* Tab: Partners */}
          {activeTab === "partners" && <PartnersTab />}

          {/* Tab: Review */}
          {activeTab === "review" && (
            <div className="flex h-60 items-center justify-center text-gray-400">
              <p className="text-sm font-medium">Reviews coming soon</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 overflow-visible pb-12 lg:col-span-1">
          <ContactSidebar scholarship={scholarship} />
          <RequestInfoForm />
          <RelatedScholarships scholarships={similarScholarships} />
        </aside>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95" onClick={closeLightbox}>
          <button type="button" onClick={closeLightbox} className="absolute right-8 top-5 cursor-pointer text-[40px] text-white z-[1001] hover:text-gray-300">&times;</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); changeImage(-1); }} className="absolute left-5 top-1/2 -translate-y-1/2 cursor-pointer px-5 py-5 text-[50px] text-white select-none hover:text-gray-300 z-[1001]">&#10094;</button>
          <img src={galleryImages[lightboxIndex]} alt="Gallery" className="max-h-[85vh] max-w-[90%] rounded-md object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" onClick={(e) => { e.stopPropagation(); changeImage(1); }} className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer px-5 py-5 text-[50px] text-white select-none hover:text-gray-300 z-[1001]">&#10095;</button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-Components                                                     */
/* ------------------------------------------------------------------ */

function TimelineVertical() {
  const items = [
    { year: "2022", color: "bg-blue-600", title: "Project Shiksha Launched", desc: "Project Shiksha was founded by 100 Group, Sowers Action Nepal & Hong Kong, and RONB with a vision to provide quality education to underprivileged students across Nepal." },
    { year: "2023", color: "bg-green-600", title: "First Batch of Scholars", desc: "Successfully enrolled the first batch of 50 scholarship recipients. Established partnerships with leading colleges and set up exam centers across 5 provinces." },
    { year: "2024", color: "bg-purple-600", title: "Expanded Reach & Partnerships", desc: "Partnered with Ncell Foundation and Dari Club USA. Expanded to 7 exam centers nationwide. Increased scholarship seats to 100 (60 Fully + 40 Partially Funded)." },
    { year: "2025", color: "bg-orange-600", title: "National Recognition", desc: 'Received "Best Educational Initiative Award 2025" from Ministry of Education. First batch graduates achieved 95% pass rate with 85% distinction. Added Creating Opportunities as technical partner.' },
    { year: "2026", color: "bg-red-600", title: "Current Year - Growing Impact", desc: "Expanded to 110 total seats (60 Fully + 50 Partially Funded). Launched online application system. Continuing to transform lives through education across all 7 provinces of Nepal.", last: true },
  ];
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.year} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.color} text-[13px] font-bold text-white`}>{item.year}</div>
            {!item.last && <div className="mt-2 w-0.5 flex-1 bg-blue-200" />}
          </div>
          <div className={`flex-1 ${!item.last ? "pb-6" : ""}`}>
            <h4 className="mb-1 text-[15px] font-bold text-gray-900">{item.title}</h4>
            <p className="text-[13px] text-gray-600">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScholarshipRow({ type, seats, coverage, coverageClass, eligibility, show }: { type: string; seats: string; coverage: string; coverageClass: string; eligibility: string; show: boolean }) {
  if (!show) return null;
  return (
    <div className="grid grid-cols-12 gap-4 border-b border-gray-100 px-6 py-4 transition-all hover:bg-gray-50">
      <div className="col-span-3"><h4 className="text-[14px] font-bold text-gray-900">{type}</h4></div>
      <div className="col-span-3 text-[14px] text-gray-700">{seats}</div>
      <div className="col-span-2"><span className={`rounded-md px-2.5 py-1 text-[13px] font-bold ${coverageClass}`}>{coverage}</span></div>
      <div className="col-span-2 text-[13px] text-gray-600">{eligibility}</div>
      <div className="col-span-2 text-right">
        <a href="https://projectshiksha.hundredgroupnepal.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700">
          <ExternalLink size={12} /> Apply
        </a>
      </div>
    </div>
  );
}

function RubricRow({ criteria, desc, weight, marks, pass }: { criteria: string; desc: string; weight: string; marks: string; pass: string }) {
  return (
    <tr className="transition hover:bg-gray-50">
      <td className="px-5 py-4 text-[14px] text-gray-700">
        <div className="font-semibold text-gray-900">{criteria}</div>
        <div className="text-[12px] text-gray-500">{desc}</div>
      </td>
      <td className="px-5 py-4 text-[14px] text-gray-600">{weight}</td>
      <td className="px-5 py-4 text-[14px] font-semibold text-gray-900">{marks}</td>
      <td className="px-5 py-4 text-[14px] font-semibold text-green-600">{pass}</td>
    </tr>
  );
}

function EligibilityTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Eligibility & Selection Criteria</h2>
        <p className="mt-1 text-[14px] text-gray-500">Requirements and selection process for Project Shiksha Scholarship 2082</p>
      </div>
      <div className="space-y-6">
        <div className="rounded-md border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-[17px] font-bold text-gray-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white"><CheckCircle size={16} /></div>
            Basic Eligibility Criteria
          </h3>
          <ul className="space-y-3">
            {["Must be a <strong>SEE graduate of 2081/2082</strong> from any board in Nepal", "Must have scored <strong>minimum 2.0 GPA</strong> in SEE examination", "Age limit: <strong>Maximum 18 years</strong> as of application date", "Must be enrolled or planning to enroll in <strong>Grade 11/+2 program</strong> in Nepal", "Priority given to students from <strong>economically disadvantaged backgrounds</strong>"].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-gray-700">
                <ChevronRight size={20} className="mt-0.5 shrink-0 text-blue-600" />
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-md border border-gray-100 bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 text-[16px] font-bold text-gray-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 text-green-600"><Award size={16} /></div>
              For Fully Funded (60 Seats)
            </h3>
            <ul className="space-y-3">
              {["Family annual income below <strong>NPR 150,000</strong>", "Strong academic record in SEE", "Must demonstrate financial need", "30 seats for boys, 30 seats for girls", "Covers tuition, food & accommodation"].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[14px] text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-gray-100 bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 text-[16px] font-bold text-gray-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-600"><BookOpen size={16} /></div>
              For Partially Funded (50 Seats)
            </h3>
            <ul className="space-y-3">
              {["Family annual income below <strong>NPR 300,000</strong>", "Good academic performance in SEE", "Merit-based selection", "Open to all genders", "Covers tuition fees only"].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[14px] text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <SelectionProcessSteps />

        <div className="rounded-md border border-amber-200 bg-amber-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-[16px] font-bold text-amber-900">
            <CircleAlert size={20} className="text-amber-600" /> Required Documents
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {["SEE Mark Sheet (Original & Copy)", "SEE Character Certificate", "Citizenship Certificate (if available)", "Birth Certificate", "Family Income Certificate", "Recommendation Letter", "Passport-sized Photos (4 copies)", "+2 Admission Confirmation"].map((doc, i) => (
              <div key={i} className="flex items-center gap-2 text-[14px] text-amber-800">
                <FileText size={16} className="shrink-0 text-amber-600" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectionProcessSteps() {
  const steps = [
    { num: "1", color: "bg-purple-600", bg: "bg-purple-50", title: "Application", desc: "Online application submission" },
    { num: "2", color: "bg-blue-600", bg: "bg-blue-50", title: "Entrance Exam", desc: "Written test (40% pass mark)" },
    { num: "3", color: "bg-green-600", bg: "bg-green-50", title: "Interview", desc: "Personal interview round" },
    { num: "4", color: "bg-orange-600", bg: "bg-orange-50", title: "Final Selection", desc: "Result publication" },
  ];
  return (
    <div className="rounded-md border border-gray-100 bg-white p-6">
      <h3 className="mb-4 flex items-center gap-2 text-[17px] font-bold text-gray-900">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 text-purple-600"><ClipboardList size={16} /></div>
        Selection Process
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {steps.map((s) => (
          <div key={s.num} className={`rounded-md p-4 text-center ${s.bg}`}>
            <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${s.color} font-bold text-white`}>{s.num}</div>
            <h4 className="mb-1 text-[14px] font-bold text-gray-900">{s.title}</h4>
            <p className="text-[12px] text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineTab() {
  const events = [
    { icon: <Calendar size={16} />, color: "bg-blue-600", title: "Application Opens", date: "Ashad 21, 2082 (Saturday)", desc: "Online application portal becomes available for all eligible students" },
    { icon: <Clock size={16} />, color: "bg-blue-600", title: "Application Deadline", date: "Ashad 30, 2082 (Monday) - 11:59 PM", desc: "Last date to submit complete scholarship applications" },
    { icon: <FileText size={16} />, color: "bg-green-600", title: "Entrance Examination", date: "Shrawan 1, 2082 (Thursday) - 9:00 AM", desc: "Exam conducted simultaneously across all provinces" },
    { icon: <CheckCircle size={16} />, color: "bg-orange-600", title: "Entrance Exam Result", date: "Shrawan 1, 2082 (Thursday Evening)", desc: "Entrance exam result will be published on official website" },
    { icon: <Users size={16} />, color: "bg-purple-600", title: "Interviews", date: "Shrawan 2 and 3, 2082 (Friday, Saturday)", desc: "Interview of shortlisted candidates will be conducted" },
    { icon: <Award size={16} />, color: "bg-red-600", title: "Final Result Publication", date: "Shrawan 4, 2082 (Sunday Evening)", desc: "Final result will be published on official website", last: true },
  ];
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Key Dates & Timeline</h2>
        <p className="mt-1 text-[14px] text-gray-500">Important dates for Project Shiksha Scholarship 2082</p>
      </div>
      <div className="space-y-4">
        {events.map((ev, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${ev.color} text-white`}>{ev.icon}</div>
              {!ev.last && <div className="mt-2 w-0.5 flex-1 bg-gray-200" />}
            </div>
            <div className={`${!ev.last ? "pb-6" : ""}`}>
              <h3 className="text-[15px] font-bold text-gray-900">{ev.title}</h3>
              <p className={`text-[13px] font-semibold ${ev.color.replace("bg-", "text-")}`}>{ev.date}</p>
              <p className="mt-1 text-[13px] text-gray-600">{ev.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExamCentersTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Exam Centers by Province</h2>
        <p className="mt-1 text-[14px] text-gray-500">Entrance examination will be conducted simultaneously across Nepal</p>
      </div>
      <div className="space-y-6">
        {examCenters.map((center, i) => (
          <div key={i} className="overflow-hidden rounded-md border border-gray-100">
            <div className={`border-b border-gray-100 px-5 py-4 ${center.color}`}>
              <h3 className="text-[16px] font-bold text-gray-900">{center.province}</h3>
            </div>
            <div className="p-5">
              <div className="mb-3 flex items-center gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${center.color} ${center.iconColor}`}>
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[15px] font-bold text-gray-900">{center.city}</h4>
                  <p className="text-[13px] font-medium text-gray-600">{center.venue}</p>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-[13px] text-gray-700"><span className="font-semibold">Contact:</span> {center.contact}</p>
                <a href={`tel:${center.phone.split(",")[0].trim()}`} className="text-[12px] text-blue-600 hover:underline">{center.phone}</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsTab() {
  const items = [
    { gradient: "from-blue-500 to-blue-600", icon: <FileText size={80} className="text-white/90" />, badge: "Notice", badgeClass: "bg-blue-50 text-blue-600", title: "Entrance Examination Schedule Published", desc: "The entrance examination for Project Shiksha Scholarship 2082 will be held on Shrawan 1, 2082 at all exam centers across Nepal.", date: "22 Apr 2026" },
    { gradient: "from-green-500 to-green-600", icon: <CheckCircle size={80} className="text-white/90" />, badge: "Result", badgeClass: "bg-green-50 text-green-600", title: "Final Scholarship Result Published", desc: "The final result for Project Shiksha Scholarship 2082 has been published. 110 students selected.", date: "15 Apr 2026", link: true },
    { gradient: "from-purple-500 to-purple-600", icon: <Users size={80} className="text-white/90" />, badge: "Event", badgeClass: "bg-purple-50 text-purple-600", title: "Leadership Training Workshop 2026", desc: "Successful 3-day leadership training workshop for scholarship recipients conducted in April 2026.", date: "10 Apr 2026" },
    { gradient: "from-orange-500 to-orange-600", icon: <Calendar size={80} className="text-white/90" />, badge: "Update", badgeClass: "bg-orange-50 text-orange-600", title: "Application Deadline Extended", desc: "Due to overwhelming response, the application deadline has been extended until Ashad 30, 2082.", date: "28 Jun 2025" },
  ];
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">News & Notice</h2>
        <p className="mt-1 text-[14px] text-gray-500">Stay updated with our latest announcements and stories</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="overflow-hidden rounded-md border border-gray-100 bg-white">
            <div className="p-4 pb-0">
              <div className={`flex h-40 items-center justify-center rounded-md bg-gradient-to-br ${item.gradient} overflow-hidden`}>
                {item.icon}
              </div>
            </div>
            <div className="p-5">
              <div className="mb-3">
                <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${item.badgeClass}`}>{item.badge}</span>
              </div>
              <h3 className="mb-2 text-[16px] font-bold text-gray-900">{item.title}</h3>
              <p className="mb-4 text-[13px] text-gray-600 line-clamp-2">{item.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                  <Calendar size={16} /><span>{item.date}</span>
                </div>
                <a href={item.link ? "https://projectshiksha.hundredgroupnepal.org/final-result" : "#"} target={item.link ? "_blank" : undefined} className="flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-700">
                  {item.link ? "Check Result" : "Read More"} {item.link ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsTab() {
  const items = [
    { gradient: "from-yellow-500 to-yellow-600", icon: <Trophy size={80} className="text-white/90" />, badge: "Success", badgeClass: "bg-green-50 text-green-600", title: "Successful Scholarship Program 2081", desc: "Project Shiksha successfully completed its first batch with 95% of scholarship holders achieving distinction in their +2 examinations.", tags: ["95% Pass", "85% Distinction"] },
    { gradient: "from-blue-500 to-blue-600", icon: <Award size={80} className="text-white/90" />, badge: "Award", badgeClass: "bg-yellow-50 text-yellow-600", title: "National Recognition", desc: 'Received the "Best Educational Initiative Award 2025" from the Ministry of Education for outstanding contribution.', tags: ["National Award", "2025"] },
    { gradient: "from-green-500 to-green-600", icon: <GraduationCap size={80} className="text-white/90" />, badge: "Students", badgeClass: "bg-green-50 text-green-600", title: "Student Success Stories", desc: "Scholarship recipients securing admissions in prestigious medical and engineering colleges across Nepal.", tags: ["Medical", "Engineering"] },
    { gradient: "from-purple-500 to-purple-600", icon: <Handshake size={80} className="text-white/90" />, badge: "Partners", badgeClass: "bg-purple-50 text-purple-600", title: "Strategic Partnerships", desc: "Built strong collaborations with leading educational institutions, NGOs, and corporate partners nationwide.", tags: ["5+ Partners", "Nationwide"] },
  ];
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Our Achievements</h2>
        <p className="mt-1 text-[14px] text-gray-500">Milestones and success stories of Project Shiksha</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="overflow-hidden rounded-md border border-gray-100 bg-white">
            <div className="p-4 pb-0">
              <div className={`flex h-40 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br ${item.gradient}`}>
                {item.icon}
              </div>
            </div>
            <div className="p-5">
              <div className="mb-3">
                <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${item.badgeClass}`}>{item.badge}</span>
              </div>
              <h3 className="mb-2 text-[16px] font-bold text-gray-900">{item.title}</h3>
              <p className="mb-4 text-[13px] text-gray-600 line-clamp-2">{item.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, j) => (
                    <span key={j} className="rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">{tag}</span>
                  ))}
                </div>
                <a href="#" className="flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-700">Read More <ArrowRight size={16} /></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab({ images, lightboxIndex, setLightboxIndex, closeLightbox, changeImage }: {
  images: string[];
  lightboxIndex: number | null;
  setLightboxIndex: (i: number | null) => void;
  closeLightbox: () => void;
  changeImage: (dir: number) => void;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900">Photo Gallery</h2>
          <p className="mt-1 text-[14px] text-gray-500">Glimpses of our programs and events</p>
        </div>
        <button type="button" className="text-[13.5px] font-bold text-blue-600 hover:underline">View All</button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((url, i) => (
          <div key={i} className="aspect-[16/10] cursor-pointer overflow-hidden rounded-md border border-gray-100 bg-white p-2" onClick={() => setLightboxIndex(i)}>
            <img src={url} alt={`Gallery ${i + 1}`} className="h-full w-full rounded-sm object-cover transition-transform duration-300 hover:scale-105" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqTab({ faqs, faqOpen, toggleFaq }: { faqs: { q: string; a: string }[]; faqOpen: number[]; toggleFaq: (i: number) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Frequently Asked Questions</h2>
        <p className="mt-1 text-[14px] text-gray-500">Find answers to common questions about Project Shiksha Scholarship</p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="overflow-hidden rounded-md bg-white">
            <button type="button" onClick={() => toggleFaq(i)} className="flex w-full items-center justify-between px-5 py-4 text-left transition-all">
              <span className="pr-4 text-[15px] font-semibold text-gray-900">
                <span className="mr-2 font-bold text-blue-600">Q{i + 1}.</span>{faq.q}
              </span>
              <ChevronDown size={20} className={`shrink-0 text-gray-400 transition-transform duration-200 ${faqOpen.includes(i) ? "rotate-180" : ""}`} />
            </button>
            {faqOpen.includes(i) && (
              <div className="px-5 pb-4">
                <p className="text-[14px] leading-relaxed text-gray-600" dangerouslySetInnerHTML={{ __html: faq.a }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnersTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Our Partners</h2>
        <p className="mt-1 text-[14px] text-gray-500">Organizations and institutions supporting Project Shiksha</p>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {partners.map((p, i) => (
          <div key={i} className="flex flex-col items-center justify-center rounded-md border border-gray-100 bg-white p-8 text-center">
            {p.logo ? (
              <img src={p.logo} alt={p.name} className="mb-3 h-16 w-auto object-contain" />
            ) : (
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-600">
                {p.name.charAt(0)}
              </div>
            )}
            <p className="text-[13px] font-semibold text-gray-700">{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSidebar({ scholarship }: { scholarship: any }) {
  return (
    <div className="rounded-md border border-gray-100 bg-white p-6">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Contact Information</h2>
      <div className="space-y-4 text-[14px] font-medium tracking-tight text-gray-600">
        <div className="flex items-start gap-3">
          <MapPin size={20} className="mt-0.5 shrink-0 text-blue-600" />
          <span className="leading-snug">{scholarship.provider}<br />{scholarship.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail size={20} className="shrink-0 text-blue-600" />
          <a href={`mailto:${scholarship.provider_email || 'info@provider.org'}`} className="truncate transition-colors hover:text-blue-600">{scholarship.provider_email || 'research.gandaki@nast.gov.np'}</a>
        </div>
        <div className="flex items-center gap-3">
          <Phone size={20} className="shrink-0 text-blue-600" />
          <span>+977 061-532XXX</span>
        </div>
        <div className="flex items-center gap-3 border-t border-gray-50 pt-3">
          <Globe size={20} className="shrink-0 text-blue-600" />
          <a href={scholarship.provider_website || "https://nast.gov.np"} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold uppercase tracking-wider text-blue-600 transition-colors hover:text-blue-700">{scholarship.provider_domain || "nast.gov.np"}</a>
        </div>
      </div>
    </div>
  );
}

function RequestInfoForm() {
  return (
    <div className="rounded-md border border-gray-100 bg-white p-6 sm:p-7">
      <h2 className="mb-2 text-[22px] font-bold text-gray-900">Request Information</h2>
      <p className="mb-6 text-[15px] font-medium leading-snug text-gray-500">Fill the form and our admission counselor will contact you.</p>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Full Name" className="w-full rounded-md border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" />
        <input type="email" placeholder="Email Address" className="w-full rounded-md border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" />
        <input type="tel" placeholder="Phone Number" className="w-full rounded-md border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" />
        <div className="relative">
          <select className="w-full appearance-none rounded-md border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-gray-500 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600">
            <option value="" disabled selected>Select Course of Interest</option>
            <option>Research Grant Inquiry</option>
            <option>Facility Access</option>
            <option>Other Information</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
            <ChevronDown size={16} />
          </div>
        </div>
        <div className="pt-2">
          <button type="submit" className="flex w-full items-center justify-center gap-2.5 rounded-md bg-blue-600 py-4 text-[15px] font-bold text-white transition-all hover:bg-blue-700">
            <Bell size={18} /> Keep me notified
          </button>
        </div>
      </form>
    </div>
  );
}

function RelatedScholarships({ scholarships }: { scholarships: any[] }) {
  return (
    <div className="mt-2 flex flex-col gap-5">
      <h2 className="text-xl font-bold text-gray-800">Related Scholarships</h2>
      {scholarships.length > 0 ? scholarships.map((item: any) => (
        <Link key={item.id} href={`/scholarship-finder/${item.id}`} className="group rounded-md border border-gray-100 bg-white p-5 transition-all hover:border-blue-200">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">Grant</span>
          </div>
          <h3 className="text-[14.5px] font-bold leading-tight text-gray-800 transition-colors group-hover:text-blue-600">{item.title}</h3>
          <p className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
            <Clock size={14} className="text-gray-400" /> Deadline: {item.deadline || "Soon"}
          </p>
        </Link>
      )) : (
        <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
          <p className="text-xs font-bold text-gray-400">No similar scholarship found.</p>
        </div>
      )}
    </div>
  );
}
