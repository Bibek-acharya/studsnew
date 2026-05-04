"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Trophy,
  ArrowRight,
  Share2,
  Bell,
  Phone,
  Mail,
  Globe,
  CircleAlert,
  ClipboardList,
} from "lucide-react";

interface ScholarshipDetailPageProps {
  scholarship: any;
  similarScholarships: any[];
}

export default function ScholarshipDetailPage({ scholarship, similarScholarships }: ScholarshipDetailPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");
  const [faqOpen, setFaqOpen] = useState<number[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const getImageUrl = useCallback((url: any) => {
    if (!url || typeof url !== "string") return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return `${backendUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  }, []);

  const desc = scholarship.about_paragraph_1 || scholarship.description || "";

  const hasDownloads = Array.isArray(scholarship.downloads) && scholarship.downloads.length > 0;

  const availableTabs = useMemo(() => {
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
    if (hasDownloads) {
      tabs.push({ id: "downloads", label: "Downloads" });
    }
    return tabs;
  }, [hasDownloads]);

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(t => t.id === activeTab)) {
      setActiveTab(availableTabs[0].id);
    }
  }, [availableTabs, activeTab]);

  const dynamicFaqs = (Array.isArray(scholarship.faqs_new) && scholarship.faqs_new.length > 0)
    ? scholarship.faqs_new.map((f: any) => ({ q: f.question || f.title || "", a: f.answer || f.description || "" }))
    : (Array.isArray(scholarship.faqs) && scholarship.faqs.length > 0)
    ? scholarship.faqs.map((f: any) => ({ q: f.question || f.title || "", a: f.answer || f.description || "" }))
    : [];

  const dynamicTimeline = (Array.isArray(scholarship.timeline) && scholarship.timeline.length > 0)
    ? scholarship.timeline.map((t: any) => ({ title: t.title || t.event || t.heading || "", date: t.date || "", desc: t.description || "" }))
    : null;

  const dynamicEligibility = (Array.isArray(scholarship.basic_eligibility_criteria) && scholarship.basic_eligibility_criteria.length > 0)
    ? scholarship.basic_eligibility_criteria.map((e: any) => typeof e === 'string' ? e : (e.title || e.criterion || e.description || ""))
    : (Array.isArray(scholarship.eligibility_criteria) && scholarship.eligibility_criteria.length > 0)
    ? scholarship.eligibility_criteria.map((e: any) => typeof e === 'string' ? e : (e.title || e.criterion || e.description || ""))
    : [];

  const dynamicDocs = (Array.isArray(scholarship.required_documents) && scholarship.required_documents.length > 0)
    ? scholarship.required_documents.map((d: any) => typeof d === 'string' ? d : (d.title || d.name || d.description || ""))
    : [];

  const dynamicSelectionSteps = (Array.isArray(scholarship.selection_process_steps) && scholarship.selection_process_steps.length > 0)
    ? scholarship.selection_process_steps.map((s: any, i: number) => ({
        num: String(s.step || i + 1),
        title: s.title || s.stage || "",
        desc: s.description || "",
      }))
    : (Array.isArray(scholarship.selection_process) && scholarship.selection_process.length > 0)
    ? scholarship.selection_process.map((s: any, i: number) => ({
        num: String(i + 1),
        title: s.title || s.stage || "",
        desc: s.description || "",
      }))
    : null;

  const scrollTabs = (dir: number) => {
    if (tabContainerRef.current) {
      tabContainerRef.current.scrollBy({ left: dir * 200, behavior: "smooth" });
    }
  };

  const toggleFaq = (idx: number) => {
    setFaqOpen((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const galleryImages = (Array.isArray(scholarship.gallery_images_new) && scholarship.gallery_images_new.length > 0)
    ? scholarship.gallery_images_new.map((img: any) => getImageUrl(img.url || img))
    : (Array.isArray(scholarship.gallery_images) && scholarship.gallery_images.length > 0)
    ? scholarship.gallery_images.map((img: any) => getImageUrl(img.url || img))
    : [];
  
  const bannerImage = getImageUrl(scholarship.banner_background_image_url || scholarship.image || scholarship.image_url || galleryImages[0] || "");

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
              onClick={() => router.push(`/scholarship-finder/apply/${scholarship.id}`)}
              className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <FileText size={16} /> Apply Now
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
          style={{ backgroundImage: `url('${bannerImage}')`, backgroundPosition: "center 20%" }}
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
              {availableTabs.map((tab) => (
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
              <div className="text-[15px] leading-[1.8] text-gray-600" style={{ overflowWrap: "break-word", wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: desc || "<p>Project Shiksha is a transformative full scholarship program designed to provide exceptional SEE graduates from across Nepal with access to higher secondary education, along with complete support for tuition, fooding, and accommodation.</p><p>This nationwide program is proudly co-led by <strong>100 Group, Sowers Action Nepal & Hong Kong, and Routine of Nepal Banda (RONB)</strong>, with academic partnership from <strong>Ncell Foundation, Dari Club USA</strong> and technical support from <strong>Creating Opportunities</strong>.</p>" }} />
              {(Array.isArray(scholarship.journey_timeline) && scholarship.journey_timeline.length > 0 ? scholarship.journey_timeline : [
                { year: "2022", title: "Project Shiksha Launched", description: "Project Shiksha was founded by 100 Group, Sowers Action Nepal & Hong Kong, and RONB with a vision to provide quality education to underprivileged students across Nepal." },
                { year: "2023", title: "First Batch of Scholars", description: "Successfully enrolled the first batch of 50 scholarship recipients. Established partnerships with leading colleges and set up exam centers across 5 provinces." },
                { year: "2024", title: "Expanded Reach & Partnerships", description: "Partnered with Ncell Foundation and Dari Club USA. Expanded to 7 exam centers nationwide. Increased scholarship seats to 100 (60 Fully + 40 Partially Funded)." },
                { year: "2025", title: "National Recognition", description: "Received 'Best Educational Initiative Award 2025' from Ministry of Education. First batch graduates achieved 95% pass rate with 85% distinction." },
                { year: "2026", title: "Current Year - Growing Impact", description: "Expanded to 110 total seats (60 Fully + 50 Partially Funded). Launched online application system. Continuing to transform lives through education across all 7 provinces of Nepal." },
              ]).map((item: any, i: number) => {
                const yearColors = ["bg-blue-600", "bg-green-600", "bg-purple-600", "bg-orange-600", "bg-red-600"];
                const color = yearColors[i % yearColors.length];
                const isLast = i === (Array.isArray(scholarship.journey_timeline) && scholarship.journey_timeline.length > 0 ? scholarship.journey_timeline.length - 1 : 4);
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color} text-white text-[13px] font-bold`}>{item.year}</div>
                      {!isLast && <div className="mt-2 w-0.5 flex-1 bg-gray-200" />}
                    </div>
                    <div className={`flex-1 ${!isLast ? "pb-6" : ""}`}>
                      <h4 className="text-[15px] font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-[13px] text-gray-600">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab: Scholarship */}
          {activeTab === "scholarship" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">{scholarship.scholarship_section_title || scholarship.title || "Scholarship Program"}</h2>
                <p className="mt-1 text-[14px] text-gray-500">{scholarship.scholarship_subtitle || "Scholarship program details and requirements"}</p>
              </div>
              <div className="mb-6 text-[14px] leading-relaxed text-gray-600" style={{ overflowWrap: "break-word", wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: desc || "<p>Project Shiksha is a transformative scholarship program designed to provide exceptional SEE graduates from across Nepal with access to higher secondary education, along with complete support for tuition, fooding, and accommodation.</p><p>This scholarship is based on financial need and academic performance of candidates.</p>" }} />
              <div className="mb-6 overflow-hidden rounded-md border border-gray-100 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                  <p className="text-[14px] font-semibold text-blue-600">Filter by education level</p>
                  <div className="flex gap-2 text-[13px] font-medium">
                    <span className="rounded-full bg-blue-600 px-4 py-1.5 text-white transition">All</span>
                    <span className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-gray-700 transition">Fully Funded</span>
                    <span className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-gray-700 transition">Partially Funded</span>
                  </div>
                </div>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-4 items-center">
                      <div className="col-span-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">TYPE</div>
                      <div className="col-span-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">SEATS</div>
                      <div className="col-span-2 text-[12px] font-bold uppercase tracking-wider text-gray-500">COVERAGE</div>
                      <div className="col-span-2 text-[12px] font-bold uppercase tracking-wider text-gray-500">ELIGIBILITY</div>
                      <div className="col-span-2 text-right text-[12px] font-bold uppercase tracking-wider text-gray-500">ACTION</div>
                    </div>
                    {(Array.isArray(scholarship.scholarship_types_new) && scholarship.scholarship_types_new.length > 0 ? scholarship.scholarship_types_new : [
                      { type: "Fully Funded", seats: "60 Seats (30 Boys & 30 Girls)", coverage: "Full Support", eligibility: "Financial Need + Merit" },
                      { type: "Partially Funded", seats: "50 Seats", coverage: "Tuition Only", eligibility: "Merit Based" },
                    ]).map((row: any, i: number) => (
                      <div key={i} className="grid grid-cols-12 gap-4 border-b border-gray-100 px-6 py-4 items-center hover:bg-gray-50 transition">
                        <div className="col-span-3"><h4 className="text-[14px] font-bold text-gray-900">{row.type}</h4></div>
                        <div className="col-span-3 text-[14px] text-gray-700">{row.seats}</div>
                        <div className="col-span-2"><span className={`rounded-md px-2.5 py-1 text-[13px] font-bold ${row.coverage === "Full Support" ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"}`}>{row.coverage}</span></div>
                        <div className="col-span-2 text-[13px] text-gray-600">{row.eligibility}</div>
                        <div className="col-span-2 text-right">
                          <a href={scholarship.apply_link || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm">
                            <ExternalLink size={12} /> Apply
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-6">
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
                        {(Array.isArray(scholarship.selection_rubric_new) && scholarship.selection_rubric_new.length > 0 ? scholarship.selection_rubric_new : [
                          { criteria: "Written Examination", description: "English, Math, Science, Social Studies", weight: "60%", marks: "60 Marks", pass_mark: "24 Marks" },
                          { criteria: "Personal Interview", description: "Communication, Confidence, Goals", weight: "25%", marks: "25 Marks", pass_mark: "10 Marks" },
                          { criteria: "Academic Record", description: "SEE GPA & Previous Performance", weight: "10%", marks: "10 Marks", pass_mark: "4 Marks" },
                          { criteria: "Financial Need Assessment", description: "Family Income, Economic Background", weight: "5%", marks: "5 Marks", pass_mark: "2 Marks" },
                        ]).map((row: any, i: number) => (
                          <tr key={i} className="transition hover:bg-gray-50">
                            <td className="px-5 py-4 text-[14px] text-gray-700">
                              <div className="font-semibold text-gray-900">{row.criteria}</div>
                              <div className="text-[12px] text-gray-500">{row.description}</div>
                            </td>
                            <td className="px-5 py-4 text-[14px] text-gray-600">{row.weight}</td>
                            <td className="px-5 py-4 text-[14px] font-semibold text-gray-900">{row.marks}</td>
                            <td className="px-5 py-4 text-[14px] font-semibold text-green-600">{row.pass_mark}</td>
                          </tr>
                        ))}
                        {(!scholarship.selection_rubric_new || scholarship.selection_rubric_new.length === 0) && (
                        <tr className="bg-blue-50">
                          <td className="px-5 py-4 text-[14px] font-bold text-gray-900">Total</td>
                          <td className="px-5 py-4 text-[14px] font-bold text-gray-900">100%</td>
                          <td className="px-5 py-4 text-[14px] font-bold text-gray-900">100 Marks</td>
                          <td className="px-5 py-4 text-[14px] font-bold text-green-600">40 Marks</td>
                        </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Eligibility */}
          {activeTab === "eligibility" && (
            <EligibilityTab criteria={dynamicEligibility} docs={dynamicDocs} selectionSteps={dynamicSelectionSteps} />
          )}

          {/* Tab: Timeline */}
          {activeTab === "timeline" && <TimelineTab events={dynamicTimeline || []} />}

          {/* Tab: Exam Centers */}
          {activeTab === "centers" && (
            <ExamCentersTab centers={(Array.isArray(scholarship.exam_centers_new) && scholarship.exam_centers_new.length > 0) ? scholarship.exam_centers_new : (scholarship.exam_centers || [])} />
          )}

          {/* Tab: News */}
          {activeTab === "news" && (
            <NewsTab items={scholarship.news_items || []} />
          )}

          {/* Tab: Achievements */}
          {activeTab === "achievements" && (
            <AchievementsTab items={scholarship.achievements || []} />
          )}

          {/* Tab: Gallery */}
          {activeTab === "gallery" && (
            <GalleryTab images={galleryImages} lightboxIndex={lightboxIndex} setLightboxIndex={setLightboxIndex} closeLightbox={closeLightbox} changeImage={changeImage} />
          )}

          {/* Tab: FAQ */}
          {activeTab === "faq" && <FaqTab faqs={dynamicFaqs} faqOpen={faqOpen} toggleFaq={toggleFaq} />}

          {/* Tab: Partners */}
          {activeTab === "partners" && (
            <PartnersTab items={scholarship.partner_groups || scholarship.partners || []} getImageUrl={getImageUrl} />
          )}

          {/* Tab: Review */}
          {activeTab === "review" && (
            <div className="flex h-60 items-center justify-center text-gray-400">
              <p className="text-sm font-medium">Reviews coming soon</p>
            </div>
          )}

          {/* Tab: Downloads */}
          {activeTab === "downloads" && hasDownloads && (
            <DownloadsTab items={scholarship.downloads} getImageUrl={getImageUrl} />
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:col-span-1">
          <PartnerMessageCarousel />
          <ContactSidebar scholarship={scholarship} />
          <RequestInfoForm />
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

function EligibilityTab({ criteria, docs, selectionSteps }: { criteria: string[]; docs: string[]; selectionSteps: { num: string; title: string; desc: string }[] | null }) {
  const hasData = criteria.length > 0 || docs.length > 0;
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Eligibility & Selection Criteria</h2>
        <p className="mt-1 text-[14px] text-gray-500">Requirements and selection process</p>
      </div>
      <div className="space-y-6">
        {criteria.length > 0 && (
        <div className="rounded-md border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-[17px] font-bold text-gray-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white"><CheckCircle size={16} /></div>
            Eligibility Criteria
          </h3>
          <ul className="space-y-3">
            {criteria.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-gray-700">
                <ChevronRight size={20} className="mt-0.5 shrink-0 text-blue-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        )}
        {!hasData && (
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
        )}
        {selectionSteps && (
          <SelectionProcessSteps steps={selectionSteps} />
        )}
        {!selectionSteps && <SelectionProcessSteps steps={null} />}
        <div className="rounded-md border border-amber-200 bg-amber-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-[16px] font-bold text-amber-900">
            <CircleAlert size={20} className="text-amber-600" /> Required Documents
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {(docs.length > 0 ? docs : ["SEE Mark Sheet (Original & Copy)", "SEE Character Certificate", "Citizenship Certificate (if available)", "Birth Certificate", "Family Income Certificate", "Recommendation Letter", "Passport-sized Photos (4 copies)", "+2 Admission Confirmation"]).map((doc, i) => (
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

function SelectionProcessSteps({ steps }: { steps: { num: string; title: string; desc: string }[] | null }) {
  const items = steps || [
    { num: "1", title: "Application", desc: "Online application submission" },
    { num: "2", title: "Entrance Exam", desc: "Written test (40% pass mark)" },
    { num: "3", title: "Interview", desc: "Personal interview round" },
    { num: "4", title: "Final Selection", desc: "Result publication" },
  ];
  const colors = ["bg-purple-600", "bg-blue-600", "bg-green-600", "bg-orange-600"];
  const bgs = ["bg-purple-50", "bg-blue-50", "bg-green-50", "bg-orange-50"];
  return (
    <div className="rounded-md border border-gray-100 bg-white p-6">
      <h3 className="mb-4 flex items-center gap-2 text-[17px] font-bold text-gray-900">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 text-purple-600"><ClipboardList size={16} /></div>
        Selection Process
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {items.map((s, i) => (
          <div key={s.num} className={`rounded-md p-4 text-center ${bgs[i % bgs.length]}`}>
            <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${colors[i % colors.length]} font-bold text-white`}>{s.num}</div>
            <h4 className="mb-1 text-[14px] font-bold text-gray-900">{s.title}</h4>
            <p className="text-[12px] text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineTab({ events }: { events: { title: string; date: string; desc: string }[] }) {
  const items = events.length > 0 ? events : [
    { title: "Application Opens", date: "Ashad 21, 2082 (Saturday)", desc: "Online application portal becomes available for all eligible students" },
    { title: "Application Deadline", date: "Ashad 30, 2082 (Monday) - 11:59 PM", desc: "Last date to submit complete scholarship applications" },
    { title: "Entrance Examination", date: "Shrawan 1, 2082 (Thursday) - 9:00 AM", desc: "Exam conducted simultaneously across all provinces" },
    { title: "Entrance Exam Result", date: "Shrawan 1, 2082 (Thursday Evening)", desc: "Entrance exam result will be published on official website" },
    { title: "Interviews", date: "Shrawan 2 and 3, 2082 (Friday, Saturday)", desc: "Interview of shortlisted candidates will be conducted" },
    { title: "Final Result Publication", date: "Shrawan 4, 2082 (Sunday Evening)", desc: "Final result will be published on official website" },
  ];
  const eventColors = ["bg-blue-600", "bg-blue-600", "bg-green-600", "bg-orange-600", "bg-purple-600", "bg-red-600"];
  const icons = [<Calendar size={16} />, <Clock size={16} />, <FileText size={16} />, <CheckCircle size={16} />, <Users size={16} />, <Award size={16} />];
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Key Dates & Timeline</h2>
        <p className="mt-1 text-[14px] text-gray-500">Important dates for this scholarship</p>
      </div>
      <div className="space-y-4">
        {items.map((ev, i) => {
          const color = eventColors[i % eventColors.length];
          const icon = icons[i % icons.length];
          const isLast = i === items.length - 1;
          return (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${color} text-white`}>{icon}</div>
              {!isLast && <div className="mt-2 w-0.5 flex-1 bg-gray-200" />}
            </div>
            <div className={`${!isLast ? "pb-6" : ""}`}>
              <h3 className="text-[15px] font-bold text-gray-900">{ev.title}</h3>
              <p className={`text-[13px] font-semibold ${color.replace("bg-", "text-")}`}>{ev.date}</p>
              <p className="mt-1 text-[13px] text-gray-600">{ev.desc}</p>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

function ExamCentersTab({ centers }: { centers: any[] }) {
  const items = centers.length > 0 ? centers : [
    { province: "Bagmati Province", city: "Kathmandu", venue: "Advance Academy, Lalitpur", contact: "Mr. Bablu Gupta", phone: "9851131074, 9861116456" },
    { province: "Gandaki Province", city: "Pokhara", venue: "Gandaki College, Mahendrapul", contact: "Mr. Prasanna Dhungel, Mr. Pabin Chhetri", phone: "9801127672, 9856009596" },
    { province: "Lumbini Province", city: "Butwal", venue: "Butwal Campus, Tankasinwa", contact: "Mr. Sushant Acharya, Er. Subodh Regmi", phone: "9749394615, 9851313120" },
    { province: "Koshi Province", city: "Biratnagar", venue: "Koshi College, Main Road", contact: "Mr. Dhiraj Shah", phone: "9827329145" },
    { province: "Sudurpashchim Province", city: "Kailali", venue: "Seti College, Dhangadhi", contact: "Mr. Jay Dhami", phone: "9868742691" },
    { province: "Madhesh Province", city: "Lahan", venue: "Janak Education Center", contact: "Mr. Aashish Chaudhary, Mr. Shiv Yadav", phone: "9818378642, 9861969297" },
    { province: "Madhesh Province", city: "Birgunj", venue: "Narayani Academy, Ghantaghar", contact: "Mr. Anurag Gupta, Mr. Prabhat Kumar", phone: "9844000111, 9801230707" },
  ];
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Exam Centers by Province</h2>
        <p className="mt-1 text-[14px] text-gray-500">Entrance examination will be conducted simultaneously across Nepal</p>
      </div>
      <div className="space-y-6">
        {items.map((center, i) => (
          <div key={i} className="overflow-hidden rounded-md border border-gray-100">
            <div className="border-b border-gray-100 px-5 py-4 bg-blue-50">
              <h3 className="text-[16px] font-bold text-gray-900">{center.province || center.city}</h3>
            </div>
            <div className="p-5">
              <div className="mb-3 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[15px] font-bold text-gray-900">{center.city || center.venue}</h4>
                  {center.venue && <p className="text-[13px] font-medium text-gray-600">{center.venue}</p>}
                </div>
              </div>
              {(center.contact || center.phone) && (
              <div className="mb-3">
                {center.contact && <p className="text-[13px] text-gray-700"><span className="font-semibold">Contact:</span> {center.contact}</p>}
                {center.phone && <a href={`tel:${center.phone.split(",")[0].trim()}`} className="text-[12px] text-blue-600 hover:underline">{center.phone}</a>}
              </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsTab({ items }: { items: any[] }) {
  const data = items.length > 0 ? items : [
    { title: "Entrance Examination Schedule Published", description: "The entrance examination for Project Shiksha Scholarship 2082 will be held on Shrawan 1, 2082 at all exam centers across Nepal.", category: "Notice", date: "22 Apr 2026", link: "#" },
    { title: "Final Scholarship Result Published", description: "The final result for Project Shiksha Scholarship 2082 has been published. 110 students selected.", category: "Result", date: "15 Apr 2026", link: "https://projectshiksha.hundredgroupnepal.org/final-result" },
    { title: "Leadership Training Workshop 2026", description: "Successful 3-day leadership training workshop for scholarship recipients conducted in April 2026.", category: "Event", date: "10 Apr 2026", link: "#" },
    { title: "Application Deadline Extended", description: "Due to overwhelming response, the application deadline has been extended until Ashad 30, 2082.", category: "Update", date: "28 Jun 2025", link: "#" },
  ];
  const gradients = ["from-blue-500 to-blue-600", "from-green-500 to-green-600", "from-purple-500 to-purple-600", "from-orange-500 to-orange-600"];
  const badgeColors = ["bg-blue-50 text-blue-600", "bg-green-50 text-green-600", "bg-purple-50 text-purple-600", "bg-orange-50 text-orange-600"];
  const icons = [<FileText size={80} className="text-white/90" />, <CheckCircle size={80} className="text-white/90" />, <Users size={80} className="text-white/90" />, <Calendar size={80} className="text-white/90" />];
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">News & Notice</h2>
        <p className="mt-1 text-[14px] text-gray-500">Stay updated with our latest announcements and stories</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.map((item, i) => (
          <div key={i} className="overflow-hidden rounded-md border border-gray-100 bg-white">
            <div className="p-4 pb-0">
              <div className={`flex h-40 items-center justify-center rounded-md bg-gradient-to-br ${gradients[i % gradients.length]} overflow-hidden`}>
                {icons[i % icons.length]}
              </div>
            </div>
            <div className="p-5">
              <div className="mb-3">
                <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${badgeColors[i % badgeColors.length]}`}>{item.category || "Notice"}</span>
              </div>
              <h3 className="mb-2 text-[16px] font-bold text-gray-900">{item.title}</h3>
              <p className="mb-4 text-[13px] text-gray-600 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                  <Calendar size={16} /><span>{item.date}</span>
                </div>
                {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-700">
                  Read More <ExternalLink size={16} />
                </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsTab({ items }: { items: any[] }) {
  const data = items.length > 0 ? items : [
    { title: "Successful Scholarship Program 2081", description: "Project Shiksha successfully completed its first batch with 95% of scholarship holders achieving distinction in their +2 examinations.", badge: "Success", tags: ["95% Pass", "85% Distinction"], link: "#" },
    { title: "National Recognition", description: "Received the 'Best Educational Initiative Award 2025' from the Ministry of Education for outstanding contribution.", badge: "Award", tags: ["National Award", "2025"], link: "#" },
    { title: "Student Success Stories", description: "Scholarship recipients securing admissions in prestigious medical and engineering colleges across Nepal.", badge: "Students", tags: ["Medical", "Engineering"], link: "#" },
    { title: "Strategic Partnerships", description: "Built strong collaborations with leading educational institutions, NGOs, and corporate partners nationwide.", badge: "Partners", tags: ["5+ Partners", "Nationwide"], link: "#" },
  ];
  const gradients = ["from-yellow-500 to-yellow-600", "from-blue-500 to-blue-600", "from-green-500 to-green-600", "from-purple-500 to-purple-600"];
  const badgeColors = ["bg-green-50 text-green-600", "bg-yellow-50 text-yellow-600", "bg-green-50 text-green-600", "bg-purple-50 text-purple-600"];
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Our Achievements</h2>
        <p className="mt-1 text-[14px] text-gray-500">Milestones and success stories</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.map((item, i) => (
          <div key={i} className="overflow-hidden rounded-md border border-gray-100 bg-white">
            <div className="p-4 pb-0">
              <div className={`flex h-40 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br ${gradients[i % gradients.length]}`}>
                <Trophy size={80} className="text-white/90" />
              </div>
            </div>
            <div className="p-5">
              <div className="mb-3">
                <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${badgeColors[i % badgeColors.length]}`}>{item.badge || "Achievement"}</span>
              </div>
              <h3 className="mb-2 text-[16px] font-bold text-gray-900">{item.title}</h3>
              <p className="mb-4 text-[13px] text-gray-600 line-clamp-2">{item.description}</p>
              {Array.isArray(item.tags) && item.tags.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag: string, j: number) => (
                    <span key={j} className="rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">{tag}</span>
                  ))}
                </div>
                {item.link && <a href={item.link} className="flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-700">Read More <ArrowRight size={16} /></a>}
              </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCK_GALLERY_IMAGES = [
  "https://projectshiksha.hundredgroupnepal.org/images/shiks.jpg",
  "https://sowersaction.org.np/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-02-at-14.37.52_81769f1f.jpg",
  "https://sowersaction.org.np/wp-content/uploads/2025/02/cafe.jpg",
  "https://sowersaction.org.np/wp-content/uploads/2025/01/IMG_7141-scaled.jpg",
  "https://sowersaction.org.np/wp-content/uploads/2025/01/IMG_5591-e1739791077307.jpeg",
  "https://sowersaction.org.np/wp-content/uploads/2025/02/WhatsApp-Image-2025-03-28-at-14.19.06_688006be.jpg",
];

function GalleryTab({ images, lightboxIndex, setLightboxIndex, closeLightbox, changeImage }: {
  images: string[];
  lightboxIndex: number | null;
  setLightboxIndex: (i: number | null) => void;
  closeLightbox: () => void;
  changeImage: (dir: number) => void;
}) {
  const urls = images.length > 0 ? images : MOCK_GALLERY_IMAGES;
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
        {urls.map((url, i) => (
          <div key={i} className="aspect-[16/10] cursor-pointer overflow-hidden rounded-md border border-gray-100 bg-white p-2" onClick={() => setLightboxIndex(i)}>
            <img src={url} alt={`Gallery ${i + 1}`} className="h-full w-full rounded-sm object-cover transition-transform duration-300 hover:scale-105" />
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCK_FAQS = [
  { q: "Who is eligible to apply for Project Shiksha Scholarship?", a: "SEE graduates of 2081/2082 from any board in Nepal with minimum 2.0 GPA, maximum 18 years of age, and must be enrolled or planning to enroll in Grade 11/+2 program in Nepal. Priority is given to students from economically disadvantaged backgrounds." },
  { q: "What is the difference between Fully Funded and Partially Funded scholarships?", a: "<strong>Fully Funded (60 seats):</strong> Covers tuition fees, food, and accommodation for students with family annual income below NPR 150,000. <strong>Partially Funded (50 seats):</strong> Covers tuition fees only for students with family annual income below NPR 300,000." },
  { q: "How do I apply for the scholarship?", a: "Applications are submitted online through the official Project Shiksha website. You need to fill out the application form and upload required documents including SEE mark sheet, character certificate, citizenship certificate (if available), birth certificate, family income certificate, recommendation letter, passport-sized photos, and +2 admission confirmation." },
  { q: "What is the selection process?", a: "The selection process consists of 4 stages: (1) Online application submission, (2) Written entrance examination (40% pass mark required), (3) Personal interview for shortlisted candidates, and (4) Final result publication on the official website." },
  { q: "Where will the entrance examination be held?", a: "The entrance examination is conducted simultaneously across 7 exam centers in different provinces: Kathmandu (Bagmati), Pokhara (Gandaki), Butwal (Lumbini), Biratnagar (Koshi), Kailali (Sudurpashchim), Lahan and Birgunj (Madhesh Province)." },
  { q: "Is there an age limit for applying?", a: "Yes, applicants must be maximum 18 years of age as of the application deadline date. This is a strict criteria and applications exceeding this age limit will not be considered." },
  { q: "Can I apply if I'm already enrolled in +2?", a: "Yes, students who are already enrolled in Grade 11/+2 programs can apply. However, you must provide +2 admission confirmation as part of your application documents." },
  { q: "What happens if I score below 40% in the entrance exam?", a: "Students must score at least 40% in the entrance examination to be considered for the scholarship. If you score below 40%, you will not be eligible to proceed to the interview round." },
  { q: "Are there separate quotas for boys and girls?", a: "Yes, for the Fully Funded scholarship (60 seats), there are 30 seats reserved for boys and 30 seats for girls. The Partially Funded scholarship (50 seats) is open to all genders without specific quotas." },
  { q: "How can I contact for more information?", a: "You can contact us at <strong>9851131074</strong> or email at <strong>info@projectshiksha.hundredgroupnepal.org</strong>. You can also visit our official website at <strong>projectshiksha.hundredgroupnepal.org</strong> for more information." },
];

function FaqTab({ faqs, faqOpen, toggleFaq }: { faqs: { q: string; a: string }[]; faqOpen: number[]; toggleFaq: (i: number) => void }) {
  const items = faqs.length > 0 ? faqs : MOCK_FAQS;
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Frequently Asked Questions</h2>
        <p className="mt-1 text-[14px] text-gray-500">Find answers to common questions about Project Shiksha Scholarship</p>
      </div>
      <div className="space-y-3">
        {items.map((faq, i) => (
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

const MOCK_PARTNERS = [
  { name: "Sowers Action Nepal", logo_url: "https://projectshiksha.hundredgroupnepal.org/images/sa_new.jpeg" },
  { name: "Sowers Hong Kong", logo_url: "https://projectshiksha.hundredgroupnepal.org/images/sower-hk.jpeg" },
  { name: "RONB", logo_url: "https://projectshiksha.hundredgroupnepal.org/images/ronb.jpg" },
  { name: "Ncell Foundation", logo_url: "https://projectshiksha.hundredgroupnepal.org/images/ncell.png" },
  { name: "Creating Opportunities", logo_url: "https://projectshiksha.hundredgroupnepal.org/images/creating.png" },
  { name: "Dari Club USA", logo_url: "https://projectshiksha.hundredgroupnepal.org/images/dari-club.jpeg" },
];

function PartnersTab({ items, getImageUrl }: { items: any[]; getImageUrl: (url: string) => string }) {
  const data = (items && items.length > 0) ? items : MOCK_PARTNERS;
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Our Partners</h2>
        <p className="mt-1 text-[14px] text-gray-500">Organizations supporting this scholarship</p>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {data.map((p, i) => (
          <div key={i} className="flex flex-col items-center justify-center rounded-md border border-gray-100 bg-white p-8 text-center">
            {p.logo_url || p.logo ? (
              <img src={getImageUrl(p.logo_url || p.logo)} alt={p.name} className="mb-3 h-16 w-auto object-contain" />
            ) : (
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-600">
                {p.name?.charAt(0) || "?"}
              </div>
            )}
            <p className="text-[13px] font-semibold text-gray-700">{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DownloadsTab({ items, getImageUrl }: { items: any[]; getImageUrl: (url: string) => string }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Downloads</h2>
        <p className="mt-1 text-[14px] text-gray-500">Downloadable documents and resources</p>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between rounded-md border border-gray-100 bg-white p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">{item.title || `Document ${i + 1}`}</h3>
                {item.description && <p className="mt-0.5 text-[13px] text-gray-500">{item.description}</p>}
              </div>
            </div>
            <a
              href={getImageUrl(item.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-[13px] font-bold text-white transition hover:bg-blue-700"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSidebar({ scholarship }: { scholarship: any }) {
  const provider = scholarship.provider || "";
  const location = scholarship.location || "Nationwide Scholarship Program";
  const phone = scholarship.provider_phone || scholarship.phone || "";
  const email = scholarship.provider_email || scholarship.email || "";
  const website = scholarship.provider_website || scholarship.provider_domain || "";
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-[18px] font-bold text-gray-900">Contact Information</h3>
      {provider && (
        <p className="mb-4 text-[13px] font-semibold text-gray-700">{provider}</p>
      )}
      <ul className="space-y-4">
        <li className="flex items-start gap-3 text-[13px]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <MapPin size={16} />
          </div>
          <div>
            <span className="block text-[13px] font-bold text-gray-900">Coverage</span>
            <span className="text-[12px] font-medium text-gray-500">{location}</span>
          </div>
        </li>
        <li className="flex items-center gap-3 text-[13px]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Phone size={16} />
          </div>
          <div>
            <span className="block text-[13px] font-bold text-gray-900">Phone</span>
            <a href={`tel:${phone || '9851131074'}`} className="text-[12px] font-medium text-gray-500 transition hover:text-emerald-600">{phone || '9851131074'}</a>
          </div>
        </li>
        <li className="flex items-center gap-3 text-[13px]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Mail size={16} />
          </div>
          <div>
            <span className="block text-[13px] font-bold text-gray-900">Email</span>
            <a href={`mailto:${email || 'info@projectshiksha.hundredgroupnepal.org'}`} className="text-[12px] font-medium text-gray-500 transition hover:text-red-500">{email || 'info@projectshiksha.hundredgroupnepal.org'}</a>
          </div>
        </li>
        <li className="flex items-center gap-3 text-[13px]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
            <Globe size={16} />
          </div>
          <div>
            <span className="block text-[13px] font-bold text-gray-900">Website</span>
            <a href={website.startsWith("http") ? website : `https://${website}` || "https://projectshiksha.hundredgroupnepal.org"} target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium text-blue-500 transition hover:underline">{website || "projectshiksha.hundredgroupnepal.org"}</a>
          </div>
        </li>
      </ul>

      <div className="mt-5">
        <h4 className="mb-3 text-[13px] font-bold text-gray-900">Follow Us</h4>
        <div className="flex items-center gap-3 text-xl">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-[#1877F2] transition hover:opacity-80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-[#E4405F] transition hover:opacity-80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-[#FF0000] transition hover:opacity-80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-5">
        <h4 className="mb-3 text-[13px] font-bold text-gray-900">Location</h4>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.4762842059996!2d85.3897!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190c0b8c5e01%3A0x1234567890abcdef!2sGokarneshwor%2008%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1234567890" width="100%" height="150" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  );
}

function PartnerMessageCarousel() {
  const messages = [
    { logo: "https://projectshiksha.hundredgroupnepal.org/images/shiks.jpg", message: "\"Empower minds, transform futures: Free education for all! We believe every talented student deserves access to quality education regardless of their financial background.\"", author: "Project Shiksha Team", subtitle: "100 Group, Sowers Action Nepal & Hong Kong, RONB" },
    { logo: "https://projectshiksha.hundredgroupnepal.org/images/hundred.jpg", message: "\"At 100 Group, we are committed to creating opportunities for underprivileged students. Education is the foundation of a prosperous society, and we are proud to lead this initiative.\"", author: "100 Group", subtitle: "Lead Organizer" },
    { logo: "https://projectshiksha.hundredgroupnepal.org/images/sa_new.jpeg", message: "\"Sowers Action Nepal believes in serving communities through education, healthcare, and sustainable development. This scholarship program embodies our mission to uplift those in need.\"", author: "Sowers Action Nepal", subtitle: "Lead Organizer" },
    { logo: "https://projectshiksha.hundredgroupnepal.org/images/ronb.jpg", message: "\"RONB is dedicated to connecting Nepalis worldwide for social causes. Project Shiksha is a testament to what we can achieve when we come together for a common goal.\"", author: "Routine of Nepal Banda (RONB)", subtitle: "Lead Organizer" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % messages.length), 4000);
    return () => clearInterval(timer);
  }, [messages.length]);

  const goTo = (i: number) => setCurrent(i);
  const prev = () => setCurrent((p) => (p - 1 + messages.length) % messages.length);
  const next = () => setCurrent((p) => (p + 1) % messages.length);

  const m = messages[current];

  return (
    <div>
      <div className="min-h-[280px] rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-white/30 bg-white">
              <img src={m.logo} alt={m.author} className="h-full w-full object-contain p-1" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-[15px] font-bold text-white">Partner Message</h3>
              <p className="mb-3 text-[13px] font-medium leading-relaxed text-white">{m.message}</p>
            </div>
          </div>
          <div className="border-t border-blue-500/50 pt-4">
            <p className="text-[13px] font-bold text-white">{m.author}</p>
            <p className="text-[11px] text-blue-200">{m.subtitle}</p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-3">
        <button type="button" onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full text-blue-600 transition hover:bg-blue-50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="flex items-center gap-2">
          {messages.map((_, i) => (
            <button key={i} type="button" onClick={() => goTo(i)} className={`h-2.5 w-2.5 rounded-full transition ${i === current ? "bg-blue-600" : "bg-gray-300 hover:bg-blue-400"}`} />
          ))}
        </div>
        <button type="button" onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full text-blue-600 transition hover:bg-blue-50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
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
          <select defaultValue="" className="w-full appearance-none rounded-md border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-gray-500 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600">
            <option value="" disabled>Select Course of Interest</option>
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
