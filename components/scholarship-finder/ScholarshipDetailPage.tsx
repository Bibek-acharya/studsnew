"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  FileX,
  SearchX,
  Share2,
} from "lucide-react";
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
import {
  ContactSidebar,
  PartnerMessageCarousel,
  RequestInfoForm,
} from "./ScholarshipDetailSidebar";
import { safeHtml } from "@/lib/html";

interface ScholarshipDetailPageProps {
  scholarship: any;
  similarScholarships: any[];
}

export default function ScholarshipDetailPage({
  scholarship,
  similarScholarships,
}: ScholarshipDetailPageProps) {
  const router = useRouter();
  useEffect(() => {
    window.scrollTo(0, 0);
    history.scrollRestoration = "manual";
    const id = setTimeout(() => window.scrollTo(0, 0), 300);
    return () => {
      clearTimeout(id);
      history.scrollRestoration = "auto";
    };
  }, []);
  const [activeTab, setActiveTab] = useState("");
  const [faqOpen, setFaqOpen] = useState<number[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = scholarship?.title
    ? `Check out ${scholarship.title} on Studsphere`
    : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    });
  };

  const getShareUrl = () => encodeURIComponent(shareUrl);

  const getImageUrl = useCallback((url: any) => {
    if (!url || typeof url !== "string") return "";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:")
    ) {
      return url;
    }
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return `${backendUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  }, []);

  const desc = scholarship.about_paragraph_1 || scholarship.description || "";

  const hasDownloads =
    Array.isArray(scholarship.downloads) && scholarship.downloads.length > 0;

  const dynamicFaqs =
    Array.isArray(scholarship.faqs_new) && scholarship.faqs_new.length > 0
      ? scholarship.faqs_new.map((f: any) => ({
          q: f.question || f.title || "",
          a: f.answer || f.description || "",
        }))
      : Array.isArray(scholarship.faqs) && scholarship.faqs.length > 0
        ? scholarship.faqs.map((f: any) => ({
            q: f.question || f.title || "",
            a: f.answer || f.description || "",
          }))
        : [];

  const dynamicTimeline =
    Array.isArray(scholarship.timeline) && scholarship.timeline.length > 0
      ? scholarship.timeline.map((t: any) => ({
          title: t.title || t.event || t.heading || "",
          date: t.date || "",
          desc: t.description || "",
          icon: t.icon || "",
        }))
      : null;

  const dynamicEligibility =
    Array.isArray(scholarship.basic_eligibility_criteria) &&
    scholarship.basic_eligibility_criteria.length > 0
      ? scholarship.basic_eligibility_criteria.map((e: any) =>
          typeof e === "string"
            ? e
            : e.title || e.criterion || e.description || "",
        )
      : Array.isArray(scholarship.eligibility_criteria) &&
          scholarship.eligibility_criteria.length > 0
        ? scholarship.eligibility_criteria.map((e: any) =>
            typeof e === "string"
              ? e
              : e.title || e.criterion || e.description || "",
          )
        : [];

  const dynamicDocs =
    Array.isArray(scholarship.required_documents) &&
    scholarship.required_documents.length > 0
      ? scholarship.required_documents.map((d: any) =>
          typeof d === "string" ? d : d.title || d.name || d.description || "",
        )
      : [];

  const dynamicSelectionSteps =
    Array.isArray(scholarship.selection_process_steps) &&
    scholarship.selection_process_steps.length > 0
      ? scholarship.selection_process_steps.map((s: any, i: number) => ({
          num: String(s.step || i + 1),
          title: s.title || s.stage || "",
          desc: s.description || "",
        }))
      : Array.isArray(scholarship.selection_process) &&
          scholarship.selection_process.length > 0
        ? scholarship.selection_process.map((s: any, i: number) => ({
            num: String(i + 1),
            title: s.title || s.stage || "",
            desc: s.description || "",
          }))
        : null;

  const dynamicJourneyTimeline =
    Array.isArray(scholarship.journey_timeline) &&
    scholarship.journey_timeline.length > 0
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
    setFaqOpen((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const galleryImages: { url: string; title: string; folder: string }[] =
    Array.isArray(scholarship.gallery_images_new) &&
    scholarship.gallery_images_new.length > 0
      ? scholarship.gallery_images_new.map((img: any) => ({
          url: getImageUrl(img.url || img),
          title: img.title || "",
          folder: img.folder || "",
        }))
      : Array.isArray(scholarship.gallery_images) &&
          scholarship.gallery_images.length > 0
        ? scholarship.gallery_images.map((img: any) => ({
            url: getImageUrl(img.url || img),
            title: img.title || "",
            folder: img.folder || "",
          }))
        : [];

  const bannerImage = getImageUrl(
    scholarship.banner_background_image_url ||
      scholarship.image ||
      scholarship.image_url ||
      galleryImages[0]?.url ||
      "",
  );

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
    if (
      availableTabs.length > 0 &&
      !availableTabs.find((t) => t.id === activeTab)
    ) {
      setActiveTab(availableTabs[0].id);
    }
  }, [availableTabs, activeTab]);

  if (availableTabs.length === 0) {
    return (
      <div className="mx-auto max-w-350 py-20 text-center">
        <SearchX size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-bold text-gray-500">
          No scholarship details available
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-350 px-4 md:px-0 pt-12 pb-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-bold text-gray-900 md:text-4xl">
            {scholarship.title}
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(`/scholarship-finder/apply/${scholarship.slug}`)
              }
              className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <FileText size={16} /> Apply Now
            </button>
            <button
              type="button"
              onClick={() => {
                setShowShareModal(true);
                setCopySuccess(false);
              }}
              className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-2.5 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
        {bannerImage && (
          <div
            className="relative h-[200px] xs:h-[250px] sm:h-[300px] md:h-[380px] w-full overflow-hidden rounded-md bg-cover bg-center"
            style={{
              backgroundImage: `url('${bannerImage}')`,
              backgroundPosition: "center 20%",
            }}
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

      <div className="mx-auto max-w-350 grid grid-cols-1 gap-6 md:gap-10 bg-white px-4 md:px-0 py-8 md:py-12 lg:grid-cols-3">
        <div className="min-h-[300px] md:min-h-[500px] lg:col-span-2">
          {activeTab === "about" &&
            (desc ||
            scholarship.about_paragraph_2 ||
            (Array.isArray(scholarship.video_tutorials) &&
              scholarship.video_tutorials.length > 0) ||
            dynamicJourneyTimeline.length > 0 ? (
              <div className="space-y-10">
                {desc && (
                  <div
                    className="rich-text text-[15px] leading-[1.8] text-gray-600 hyphens-none break-words"
                    dangerouslySetInnerHTML={{ __html: safeHtml(desc) }}
                  />
                )}
                {scholarship.about_paragraph_2 && (
                  <div
                    className="rich-text mt-4 text-[15px] leading-[1.8] text-gray-600 hyphens-none break-words"
                    dangerouslySetInnerHTML={{
                      __html: safeHtml(scholarship.about_paragraph_2),
                    }}
                  />
                )}
                {Array.isArray(scholarship.video_tutorials) &&
                  scholarship.video_tutorials.length > 0 && (
                    <div>
                      <h3 className="mb-4 text-[17px] font-bold text-gray-900">
                        Video Tutorials
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {scholarship.video_tutorials.map(
                          (video: any, vi: number) => {
                            const videoId =
                              video.url?.match(
                                /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/,
                              )?.[1] || video.url;
                            return (
                              <div
                                key={vi}
                                className="overflow-hidden rounded-md border border-gray-100"
                              >
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
                                    <p className="text-[13px] font-semibold text-gray-900">
                                      {video.title}
                                    </p>
                                    {video.description && (
                                      <p className="mt-1 text-[12px] text-gray-500">
                                        {video.description}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          },
                        )}
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
                              <div
                                className={`shrink-0 flex items-center justify-center h-12 w-12 rounded-full ring-4 ${yearCircleBg[i % yearCircleBg.length]} z-10 shadow-sm transition-transform hover:scale-110 duration-300`}
                              >
                                <span className="text-[12px] font-black text-white">
                                  {item.year}
                                </span>
                              </div>
                              {!isLast && (
                                <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-200 to-gray-100 my-1" />
                              )}
                            </div>
                            <div
                              className={`flex-1 ${!isLast ? "pb-10" : "pb-4"}`}
                            >
                              <h4 className="text-[16px] font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-[14px] leading-relaxed text-gray-600">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-gray-400">
                <FileX size={56} className="mx-auto mb-3" />
                <p className="text-[15px] font-medium">
                  No information available
                </p>
              </div>
            ))}

          {activeTab === "scholarship" &&
            (scholarship.scholarship_section_title ||
            scholarship.scholarship_subtitle ||
            (Array.isArray(
              scholarship.scholarship_types_new ||
                scholarship.scholarship_types,
            ) &&
              ((scholarship.scholarship_types_new || []).length > 0 ||
                (scholarship.scholarship_types || []).length > 0)) ||
            (Array.isArray(
              scholarship.selection_rubric_new || scholarship.selection_rubric,
            ) &&
              ((scholarship.selection_rubric_new || []).length > 0 ||
                (scholarship.selection_rubric || []).length > 0)) ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-[20px] font-bold text-gray-900">
                    {scholarship.scholarship_section_title ||
                      scholarship.title ||
                      "Scholarship Program"}
                  </h2>
                  <p className="mt-1 text-[14px] text-gray-500">
                    {scholarship.scholarship_subtitle ||
                      "Scholarship program details and requirements"}
                  </p>
                </div>
                <div className="mb-6 overflow-hidden rounded-md border border-gray-100 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                    <p className="text-[14px] font-semibold text-blue-600">
                      Filter by education level
                    </p>
                    <div className="flex gap-2 text-[13px] font-medium">
                      <span className="rounded-full bg-blue-600 px-4 py-1.5 text-white transition">
                        All
                      </span>
                      <span className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-gray-700 transition">
                        Fully Funded
                      </span>
                      <span className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-gray-700 transition">
                        Partially Funded
                      </span>
                    </div>
                  </div>
                  <ScholarshipDetailTypesTable
                    types={(
                      scholarship.scholarship_types_new ||
                      scholarship.scholarship_types ||
                      []
                    ).map((t: any) => ({
                      type: t.scholarship_type || t.type || t.name || "",
                      seats:
                        t.number_of_seats || t.seats || t.total_seats || "",
                      coverage: t.coverage_type || t.coverage || "",
                      eligibility:
                        t.eligibility_criteria || t.eligibility || "",
                    }))}
                    applyLink={scholarship.apply_link}
                  />
                </div>
                <div className="mb-6">
                  <h3 className="mb-4 text-[17px] font-bold text-gray-900">
                    Selection Process & Rubric
                  </h3>
                  <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-5 py-3 text-left text-[13px] font-bold text-gray-700">
                              Criteria
                            </th>
                            <th className="px-5 py-3 text-left text-[13px] font-bold text-gray-700">
                              Description
                            </th>
                            <th className="px-5 py-3 text-left text-[13px] font-bold text-gray-700">
                              Weight
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(
                            scholarship.selection_rubric_new ||
                            scholarship.selection_rubric ||
                            []
                          )
                            .map((r: any) => ({
                              criteria: r.criteria || r.title || "",
                              description: r.description || "",
                              weight: r.weight || r.percentage || "",
                            }))
                            .map((row: any, i: number) => (
                              <tr
                                key={i}
                                className="transition hover:bg-gray-50"
                              >
                                <td className="px-5 py-4 text-[14px] font-semibold text-gray-900">
                                  {row.criteria}
                                </td>
                                <td className="px-5 py-4 text-[14px] text-gray-600">
                                  {row.description}
                                </td>
                                <td className="px-5 py-4 text-[14px] font-semibold text-gray-900">
                                  {row.weight}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-gray-400">
                <FileX size={56} className="mx-auto mb-3" />
                <p className="text-[15px] font-medium">
                  No scholarship details available
                </p>
              </div>
            ))}

          {activeTab === "eligibility" &&
            (dynamicEligibility.length > 0 ||
            dynamicDocs.length > 0 ||
            dynamicSelectionSteps !== null ||
            scholarship.eligibility_section_title ||
            scholarship.eligibility_subtitle ? (
              <EligibilityTab
                criteria={dynamicEligibility}
                docs={dynamicDocs}
                selectionSteps={dynamicSelectionSteps}
                sectionTitle={scholarship.eligibility_section_title}
                sectionSubtitle={scholarship.eligibility_subtitle}
              />
            ) : (
              <div className="py-16 text-center text-gray-400">
                <FileX size={56} className="mx-auto mb-3" />
                <p className="text-[15px] font-medium">
                  No eligibility information available
                </p>
              </div>
            ))}

          {activeTab === "timeline" &&
            (dynamicTimeline && dynamicTimeline.length > 0 ? (
              <TimelineTab events={dynamicTimeline} />
            ) : (
              <div className="py-16 text-center text-gray-400">
                <FileX size={56} className="mx-auto mb-3" />
                <p className="text-[15px] font-medium">
                  No timeline information available
                </p>
              </div>
            ))}

          {activeTab === "centers" &&
            ((Array.isArray(scholarship.exam_centers_new) &&
              scholarship.exam_centers_new.length > 0) ||
            (Array.isArray(scholarship.exam_centers) &&
              scholarship.exam_centers.length > 0) ? (
              <ExamCentersTab
                centers={
                  scholarship.exam_centers_new || scholarship.exam_centers || []
                }
              />
            ) : (
              <div className="py-16 text-center text-gray-400">
                <FileX size={56} className="mx-auto mb-3" />
                <p className="text-[15px] font-medium">
                  No exam centers information available
                </p>
              </div>
            ))}

          {activeTab === "news" && <NewsTab scholarship={scholarship} />}

          {activeTab === "achievements" && (
            <AchievementsTab scholarship={scholarship} />
          )}

          {activeTab === "gallery" &&
            (galleryImages.length > 0 ? (
              <GalleryTab
                images={galleryImages}
                lightboxIndex={lightboxIndex}
                setLightboxIndex={setLightboxIndex}
                closeLightbox={closeLightbox}
                changeImage={changeImage}
              />
            ) : (
              <div className="py-16 text-center text-gray-400">
                <FileX size={56} className="mx-auto mb-3" />
                <p className="text-[15px] font-medium">
                  No gallery images available
                </p>
              </div>
            ))}

          {activeTab === "faq" &&
            (dynamicFaqs.length > 0 ? (
              <FaqTab
                faqs={dynamicFaqs}
                faqOpen={faqOpen}
                toggleFaq={toggleFaq}
              />
            ) : (
              <div className="py-16 text-center text-gray-400">
                <FileX size={56} className="mx-auto mb-3" />
                <p className="text-[15px] font-medium">No FAQs available</p>
              </div>
            ))}

          {activeTab === "partners" &&
            ((Array.isArray(scholarship.partners) &&
              scholarship.partners.length > 0) ||
            (Array.isArray(scholarship.partner_groups) &&
              scholarship.partner_groups.length > 0) ? (
              <PartnersTab
                items={scholarship.partners || []}
                partnerGroups={scholarship.partner_groups || null}
                getImageUrl={getImageUrl}
              />
            ) : (
              <div className="py-16 text-center text-gray-400">
                <FileX size={56} className="mx-auto mb-3" />
                <p className="text-[15px] font-medium">
                  No partners information available
                </p>
              </div>
            ))}

          {activeTab === "review" && <ReviewTab scholarship={scholarship} />}

          {activeTab === "downloads" &&
            (hasDownloads ? (
              <DownloadsTab
                items={scholarship.downloads}
                getImageUrl={getImageUrl}
              />
            ) : (
              <div className="py-16 text-center text-gray-400">
                <FileX size={56} className="mx-auto mb-3" />
                <p className="text-[15px] font-medium">
                  No downloads available
                </p>
              </div>
            ))}
        </div>

        <aside className="space-y-6 lg:col-span-1">
          <PartnerMessageCarousel
            messages={scholarship.partner_messages}
            getImageUrl={getImageUrl}
          />
          <ContactSidebar scholarship={scholarship} />
          <RequestInfoForm scholarship={scholarship} />
        </aside>
      </div>

      {showShareModal && (
        <div
          className="fixed inset-0 z-110 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-md bg-white overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900">Share</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="rounded-full p-1.5 hover:bg-gray-100 transition"
              >
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">
                Link
              </p>
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5">
                <span className="flex-1 truncate text-xs font-medium text-gray-600">
                  {shareUrl}
                </span>
                <button
                  onClick={handleCopyLink}
                  className={`shrink-0 rounded-md px-3 py-1.5 text-[11px] font-black uppercase tracking-widest transition ${
                    copySuccess
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {copySuccess ? "✓ Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="px-6 pb-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">
                Share On
              </p>
              <div className="grid grid-cols-5 gap-3">
                {[
                  {
                    name: "WhatsApp",
                    color: "bg-green-50",
                    iconColor: "text-green-600",
                    href: `https://api.whatsapp.com/send?text=${getShareUrl()}`,
                    icon: (cls: string) => (
                      <svg
                        className={cls}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Twitter",
                    color: "bg-gray-50",
                    iconColor: "text-gray-900",
                    href: `https://twitter.com/intent/tweet?url=${getShareUrl()}`,
                    icon: (cls: string) => (
                      <svg
                        className={cls}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Facebook",
                    color: "bg-blue-50",
                    iconColor: "text-blue-700",
                    href: `https://www.facebook.com/sharer/sharer.php?u=${getShareUrl()}`,
                    icon: (cls: string) => (
                      <svg
                        className={cls}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Telegram",
                    color: "bg-sky-50",
                    iconColor: "text-sky-600",
                    href: `https://t.me/share/url?url=${getShareUrl()}`,
                    icon: (cls: string) => (
                      <svg
                        className={cls}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Messenger",
                    color: "bg-blue-50",
                    iconColor: "text-blue-600",
                    href: `https://www.messenger.com/share?link=${getShareUrl()}`,
                    icon: (cls: string) => (
                      <svg
                        className={cls}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.732 8.2l3.131 3.259L19.752 8.2l-6.559 6.763z" />
                      </svg>
                    ),
                  },
                ].map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowShareModal(false)}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-md ${p.color} transition-all group-hover:scale-110`}
                    >
                      {p.icon("w-7 h-7 " + p.iconColor)}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-700">
                      {p.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-8 top-5 cursor-pointer text-[40px] text-white z-[1001] hover:text-gray-300"
          >
            &times;
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              changeImage(-1);
            }}
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 cursor-pointer px-3 py-3 md:px-5 md:py-5 text-[30px] md:text-[50px] text-white select-none hover:text-gray-300 z-[1001]"
          >
            &#10094;
          </button>
          <img
            src={galleryImages[lightboxIndex]?.url}
            alt={galleryImages[lightboxIndex]?.title || "Gallery"}
            className="max-h-[85vh] max-w-[90%] rounded-md object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              changeImage(1);
            }}
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 cursor-pointer px-3 py-3 md:px-5 md:py-5 text-[30px] md:text-[50px] text-white select-none hover:text-gray-300 z-[1001]"
          >
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
}
