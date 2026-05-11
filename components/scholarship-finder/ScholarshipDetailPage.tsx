"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ExternalLink, FileText, Share2 } from "lucide-react";
import { EligibilityTab } from "./ScholarshipDetailEligibility";
import TimelineTab from "./ScholarshipDetailTimeline";
import ExamCentersTab from "./ScholarshipDetailExamCenters";
import NewsTab from "./ScholarshipDetailNews";
import AchievementsTab from "./ScholarshipDetailAchievements";
import GalleryTab from "./ScholarshipDetailGallery";
import FaqTab from "./ScholarshipDetailFaq";
import PartnersTab from "./ScholarshipDetailPartners";
import ReviewTab from "./ScholarshipDetailReviews";
import DownloadsTab from "./ScholarshipDetailDownloads";
import ScholarshipDetailTypesTable from "./ScholarshipDetailTypesTable";
import { ContactSidebar, PartnerMessageCarousel, RequestInfoForm } from "./ScholarshipDetailSidebar";

interface ScholarshipDetailPageProps {
  scholarship: any;
  similarScholarships: any[];
}

export default function ScholarshipDetailPage({ scholarship, similarScholarships }: ScholarshipDetailPageProps) {
  const router = useRouter();
  useEffect(() => {
    window.scrollTo(0, 0);
    history.scrollRestoration = "manual";
    const id = setTimeout(() => window.scrollTo(0, 0), 300);
    return () => { clearTimeout(id); history.scrollRestoration = "auto"; };
  }, []);
  const [activeTab, setActiveTab] = useState("");
  const [faqOpen, setFaqOpen] = useState<number[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
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

  const dynamicFaqs = (Array.isArray(scholarship.faqs_new) && scholarship.faqs_new.length > 0)
    ? scholarship.faqs_new.map((f: any) => ({ q: f.question || f.title || "", a: f.answer || f.description || "" }))
    : (Array.isArray(scholarship.faqs) && scholarship.faqs.length > 0)
    ? scholarship.faqs.map((f: any) => ({ q: f.question || f.title || "", a: f.answer || f.description || "" }))
    : [];

  const dynamicTimeline = (Array.isArray(scholarship.timeline) && scholarship.timeline.length > 0)
    ? scholarship.timeline.map((t: any) => ({ title: t.title || t.event || t.heading || "", date: t.date || "", desc: t.description || "", icon: t.icon || "" }))
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

  const dynamicJourneyTimeline = (Array.isArray(scholarship.journey_timeline) && scholarship.journey_timeline.length > 0)
    ? scholarship.journey_timeline.map((item: any) => ({
        year: item.year || item.timeline_year || item.date || "",
        title: item.title || item.heading || "",
        description: item.description || item.desc || "",
      }))
    : [];

  const scrollTabs = (dir: number) => {
    if (tabContainerRef.current) {
      tabContainerRef.current.scrollBy({ left: dir * 200, behavior: "smooth" });
    }
  };

  const updateScrollState = useCallback(() => {
    const el = tabContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }
  }, []);

  useEffect(() => {
    const el = tabContainerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const toggleFaq = (idx: number) => {
    setFaqOpen((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const galleryImages: { url: string; title: string; folder: string }[] = (Array.isArray(scholarship.gallery_images_new) && scholarship.gallery_images_new.length > 0)
    ? scholarship.gallery_images_new.map((img: any) => ({ url: getImageUrl(img.url || img), title: img.title || "", folder: img.folder || "" }))
    : (Array.isArray(scholarship.gallery_images) && scholarship.gallery_images.length > 0)
    ? scholarship.gallery_images.map((img: any) => ({ url: getImageUrl(img.url || img), title: img.title || "", folder: img.folder || "" }))
    : [];

  const bannerImage = getImageUrl(scholarship.banner_background_image_url || scholarship.image || scholarship.image_url || galleryImages[0]?.url || "");

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

  const availableTabs: { id: string; label: string }[] = [
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
    { id: "downloads", label: "Downloads" },
    { id: "review", label: "Review" },
  ];

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(t => t.id === activeTab)) {
      setActiveTab(availableTabs[0].id);
    }
  }, [availableTabs, activeTab]);

  if (availableTabs.length === 0) {
    return (
      <div className="mx-auto max-w-350 py-20 text-center">
        <p className="text-lg font-bold text-gray-500">No scholarship details available</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-350 pt-12 pb-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-bold text-gray-900 md:text-4xl">{scholarship.title}</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(`/scholarship-finder/apply/${scholarship.slug}`)}
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
        {bannerImage && (
          <div
            className="relative h-[200px] xs:h-[250px] sm:h-[300px] md:h-[380px] w-full overflow-hidden rounded-md bg-cover bg-center"
            style={{ backgroundImage: `url('${bannerImage}')`, backgroundPosition: "center 20%" }}
          >
            <div className="absolute inset-0 bg-black/10" />
          </div>
        )}
      </div>

      <div className="sticky top-0 z-40 overflow-hidden border-b border-gray-100 bg-white mx-auto max-w-350">
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollTabs(-1)}
            className={`absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white md:hidden ${!canScrollLeft ? "hidden" : ""}`}
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <div ref={tabContainerRef} className="hide-scrollbar overflow-x-auto">
            <nav className="flex whitespace-nowrap border-b border-gray-100 pr-10 md:pr-0">
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
            className={`absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white md:hidden ${!canScrollRight ? "hidden" : ""}`}
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-350 grid grid-cols-1 gap-6 md:gap-10 bg-white py-8 md:py-12 lg:grid-cols-3">
        <div className="min-h-[300px] md:min-h-[500px] lg:col-span-2">
          {activeTab === "about" && (
            (desc || scholarship.about_paragraph_2 || (Array.isArray(scholarship.video_tutorials) && scholarship.video_tutorials.length > 0) || dynamicJourneyTimeline.length > 0) ? (
            <div className="space-y-10">
              {desc && (
                <div className="rich-text text-[15px] leading-[1.8] text-gray-600 hyphens-none break-words" dangerouslySetInnerHTML={{ __html: desc }} />
              )}
              {scholarship.about_paragraph_2 && (
                <div className="rich-text mt-4 text-[15px] leading-[1.8] text-gray-600 hyphens-none break-words" dangerouslySetInnerHTML={{ __html: scholarship.about_paragraph_2 }} />
              )}
              {(Array.isArray(scholarship.video_tutorials) && scholarship.video_tutorials.length > 0) && (
                <div>
                  <h3 className="mb-4 text-[17px] font-bold text-gray-900">Video Tutorials</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {scholarship.video_tutorials.map((video: any, vi: number) => {
                      const videoId = video.url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] || video.url;
                      return (
                        <div key={vi} className="overflow-hidden rounded-md border border-gray-100">
                          <div className="aspect-video">
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={video.title || "Video Tutorial"}
                              className="h-full w-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                          {video.title && (
                            <div className="p-3">
                              <p className="text-[13px] font-semibold text-gray-900">{video.title}</p>
                              {video.description && <p className="mt-1 text-[12px] text-gray-500">{video.description}</p>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {dynamicJourneyTimeline.length > 0 && (
                <div className="mt-6">
                  <div className="space-y-0">
                    {dynamicJourneyTimeline.map((item: any, i: number) => {
                      const yearCircleBg = [
                        "bg-blue-600 ring-blue-100",
                        "bg-emerald-600 ring-emerald-100",
                        "bg-violet-600 ring-violet-100",
                        "bg-amber-600 ring-amber-100",
                        "bg-rose-600 ring-rose-100",
                      ];
                      const isLast = i === dynamicJourneyTimeline.length - 1;
                      return (
                        <div key={i} className="flex gap-6">
                          <div className="flex flex-col items-center">
                            <div className={`shrink-0 flex items-center justify-center h-12 w-12 rounded-full ring-4 ${yearCircleBg[i % yearCircleBg.length]} z-10 shadow-sm transition-transform hover:scale-110 duration-300`}>
                              <span className="text-[12px] font-black text-white">{item.year}</span>
                            </div>
                            {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-200 to-gray-100 my-1" />}
                          </div>
                          <div className={`flex-1 ${!isLast ? "pb-10" : "pb-4"}`}>
                            <h4 className="text-[16px] font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                            <p className="text-[14px] leading-relaxed text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            ) : (
              <div className="py-16 text-center text-gray-400"><p className="text-[15px] font-medium">No information available</p></div>
            )
          )}

          {activeTab === "scholarship" && (
            (Array.isArray(scholarship.scholarship_types_new || scholarship.scholarship_types) && ((scholarship.scholarship_types_new || []).length > 0 || (scholarship.scholarship_types || []).length > 0)) ||
            (Array.isArray(scholarship.selection_rubric_new || scholarship.selection_rubric) && ((scholarship.selection_rubric_new || []).length > 0 || (scholarship.selection_rubric || []).length > 0)) ? (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">{scholarship.scholarship_section_title || scholarship.title || "Scholarship Program"}</h2>
                <p className="mt-1 text-[14px] text-gray-500">{scholarship.scholarship_subtitle || "Scholarship program details and requirements"}</p>
              </div>
              <div className="mb-6 overflow-hidden rounded-md border border-gray-100 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                    <p className="text-[14px] font-semibold text-blue-600">Filter by education level</p>
                    <div className="flex gap-2 text-[13px] font-medium">
                      <span className="rounded-full bg-blue-600 px-4 py-1.5 text-white transition">All</span>
                      <span className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-gray-700 transition">Fully Funded</span>
                      <span className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-gray-700 transition">Partially Funded</span>
                    </div>
                  </div>
                  <ScholarshipDetailTypesTable
                    types={(scholarship.scholarship_types_new || scholarship.scholarship_types || []).map((t: any) => ({
                      type: t.scholarship_type || t.type || t.name || "",
                      seats: t.number_of_seats || t.seats || t.total_seats || "",
                      coverage: t.coverage_type || t.coverage || "",
                      eligibility: t.eligibility_criteria || t.eligibility || "",
                    }))}
                    applyLink={scholarship.apply_link}
                  />
                </div>
              <div className="mb-6">
                  <h3 className="mb-4 text-[17px] font-bold text-gray-900">Selection Process & Rubric</h3>
                  <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-5 py-3 text-left text-[13px] font-bold text-gray-700">Criteria</th>
                            <th className="px-5 py-3 text-left text-[13px] font-bold text-gray-700">Description</th>
                            <th className="px-5 py-3 text-left text-[13px] font-bold text-gray-700">Weight</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(scholarship.selection_rubric_new || scholarship.selection_rubric || []).map((r: any) => ({
                            criteria: r.criteria || r.title || "",
                            description: r.description || "",
                            weight: r.weight || r.percentage || "",
                          })).map((row: any, i: number) => (
                            <tr key={i} className="transition hover:bg-gray-50">
                              <td className="px-5 py-4 text-[14px] font-semibold text-gray-900">{row.criteria}</td>
                              <td className="px-5 py-4 text-[14px] text-gray-600">{row.description}</td>
                              <td className="px-5 py-4 text-[14px] font-semibold text-gray-900">{row.weight}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
            </div>
            ) : (
              <div className="py-16 text-center text-gray-400"><p className="text-[15px] font-medium">No scholarship details available</p></div>
            )
          )}

          {activeTab === "eligibility" && (
            dynamicEligibility.length > 0 || dynamicDocs.length > 0 || dynamicSelectionSteps !== null ? (
            <EligibilityTab
              criteria={dynamicEligibility}
              docs={dynamicDocs}
              selectionSteps={dynamicSelectionSteps}
              sectionTitle={scholarship.eligibility_section_title}
              sectionSubtitle={scholarship.eligibility_subtitle}
            />
            ) : (
              <div className="py-16 text-center text-gray-400"><p className="text-[15px] font-medium">No eligibility information available</p></div>
            )
          )}

          {activeTab === "timeline" && (
            dynamicTimeline && dynamicTimeline.length > 0 ? (
            <TimelineTab events={dynamicTimeline} />
            ) : (
              <div className="py-16 text-center text-gray-400"><p className="text-[15px] font-medium">No timeline information available</p></div>
            )
          )}

          {activeTab === "centers" && (
            (Array.isArray(scholarship.exam_centers_new) && scholarship.exam_centers_new.length > 0) || (Array.isArray(scholarship.exam_centers) && scholarship.exam_centers.length > 0) ? (
            <ExamCentersTab centers={(scholarship.exam_centers_new || scholarship.exam_centers || [])} />
            ) : (
              <div className="py-16 text-center text-gray-400"><p className="text-[15px] font-medium">No exam centers information available</p></div>
            )
          )}

          {activeTab === "news" && <NewsTab scholarship={scholarship} />}

          {activeTab === "achievements" && (
            Array.isArray(scholarship.achievements) && scholarship.achievements.length > 0 ? (
            <AchievementsTab items={scholarship.achievements} />
            ) : (
              <div className="py-16 text-center text-gray-400"><p className="text-[15px] font-medium">No achievements information available</p></div>
            )
          )}

          {activeTab === "gallery" && (
            galleryImages.length > 0 ? (
            <GalleryTab images={galleryImages} lightboxIndex={lightboxIndex} setLightboxIndex={setLightboxIndex} closeLightbox={closeLightbox} changeImage={changeImage} />
            ) : (
              <div className="py-16 text-center text-gray-400"><p className="text-[15px] font-medium">No gallery images available</p></div>
            )
          )}

          {activeTab === "faq" && (
            dynamicFaqs.length > 0 ? (
            <FaqTab faqs={dynamicFaqs} faqOpen={faqOpen} toggleFaq={toggleFaq} />
            ) : (
              <div className="py-16 text-center text-gray-400"><p className="text-[15px] font-medium">No FAQs available</p></div>
            )
          )}

          {activeTab === "partners" && (
            (Array.isArray(scholarship.partners) && scholarship.partners.length > 0) || (Array.isArray(scholarship.partner_groups) && scholarship.partner_groups.length > 0) ? (
            <PartnersTab items={scholarship.partners || []} partnerGroups={scholarship.partner_groups || null} getImageUrl={getImageUrl} />
            ) : (
              <div className="py-16 text-center text-gray-400"><p className="text-[15px] font-medium">No partners information available</p></div>
            )
          )}

          {activeTab === "review" && <ReviewTab scholarship={scholarship} />}

          {activeTab === "downloads" && (
            hasDownloads ? (
            <DownloadsTab items={scholarship.downloads} getImageUrl={getImageUrl} />
            ) : (
              <div className="py-16 text-center text-gray-400"><p className="text-[15px] font-medium">No downloads available</p></div>
            )
          )}
        </div>

        <aside className="space-y-6 lg:col-span-1">
          <PartnerMessageCarousel messages={scholarship.partner_messages} getImageUrl={getImageUrl} />
          <ContactSidebar scholarship={scholarship} />
          <RequestInfoForm scholarship={scholarship} />
        </aside>
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95" onClick={closeLightbox}>
          <button type="button" onClick={closeLightbox} className="absolute right-8 top-5 cursor-pointer text-[40px] text-white z-[1001] hover:text-gray-300">&times;</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); changeImage(-1); }} className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 cursor-pointer px-3 py-3 md:px-5 md:py-5 text-[30px] md:text-[50px] text-white select-none hover:text-gray-300 z-[1001]">&#10094;</button>
          <img src={galleryImages[lightboxIndex]?.url} alt={galleryImages[lightboxIndex]?.title || "Gallery"} className="max-h-[85vh] max-w-[90%] rounded-md object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" onClick={(e) => { e.stopPropagation(); changeImage(1); }} className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 cursor-pointer px-3 py-3 md:px-5 md:py-5 text-[30px] md:text-[50px] text-white select-none hover:text-gray-300 z-[1001]">&#10095;</button>
        </div>
      )}
    </div>
  );
}
