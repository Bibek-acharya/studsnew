"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { fetchCourseDetailsById } from "@/services/course-api";
import EmptyTabState from "@/components/course-finder/EmptyTabState";

type TabKey =
  | "overview"
  | "eligibility"
  | "admission"
  | "courses"
  | "fees"
  | "scholarships"
  | "news"
  | "blogs"
  | "faq";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "eligibility", label: "Eligibility" },
  { key: "admission", label: "Admission" },
  { key: "courses", label: "Courses" },
  { key: "fees", label: "Program Fee" },
  { key: "scholarships", label: "Scholarships" },
  { key: "news", label: "News" },
  { key: "blogs", label: "Blogs" },
  { key: "faq", label: "FAQ" },
];

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const tabsNavRef = useRef<HTMLElement | null>(null);
  const [isTabsOverflowing, setIsTabsOverflowing] = useState(false);
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false);
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(false);

  const { data: details, isLoading } = useQuery({
    queryKey: ["course-details", id],
    queryFn: () => fetchCourseDetailsById(id),
  });

  const updateTabScrollState = useCallback(() => {
    const container = tabsScrollRef.current;
    const nav = tabsNavRef.current;
    const firstTab = nav?.firstElementChild as HTMLElement | null;
    const lastTab = nav?.lastElementChild as HTMLElement | null;
    if (!container || !nav || !firstTab || !lastTab) {
      setIsTabsOverflowing(false);
      setCanScrollTabsLeft(false);
      setCanScrollTabsRight(false);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const firstTabRect = firstTab.getBoundingClientRect();
    const lastTabRect = lastTab.getBoundingClientRect();
    const leftOverflow = firstTabRect.left < containerRect.left - 4;
    const rightOverflow = lastTabRect.right > containerRect.right + 4;
    setIsTabsOverflowing(leftOverflow || rightOverflow);
    setCanScrollTabsLeft(leftOverflow);
    setCanScrollTabsRight(rightOverflow);
  }, []);

  const scrollTabs = (direction: "left" | "right") => {
    const container = tabsScrollRef.current;
    if (!container) return;
    const step = Math.max(180, Math.floor(container.clientWidth * 0.5));
    container.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  useEffect(() => {
    const container = tabsScrollRef.current;
    if (!container) return;
    updateTabScrollState();
    const handleScroll = () => updateTabScrollState();
    const handleResize = () => updateTabScrollState();
    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => updateTabScrollState());
      observer.observe(container);
      if (tabsNavRef.current) observer.observe(tabsNavRef.current);
    }
    requestAnimationFrame(() => updateTabScrollState());
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      observer?.disconnect();
    };
  }, [updateTabScrollState]);

  useEffect(() => {
    updateTabScrollState();
  }, [activeTab, updateTabScrollState]);

  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);
    window.scrollTo({ top: 520, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="mx-auto max-w-350 pt-12 pb-8 px-4">
          <div className="h-4 w-64 rounded bg-gray-200 mb-6" />
          <div className="h-9 w-80 rounded bg-gray-200 mb-2" />
          <div className="h-4 w-48 rounded bg-gray-200 mb-6" />
          <div className="h-[280px] md:h-[380px] rounded-md bg-gray-200" />
        </div>
        <div className="mx-auto max-w-350 flex gap-8 px-4 border-b border-gray-100">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="h-10 w-20 rounded bg-gray-200 mb-0" />
          ))}
        </div>
        <div className="mx-auto max-w-350 py-8 md:py-12 px-4">
          <div className="space-y-4">
            <div className="h-6 w-48 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  const course = details?.course;
  const courseTitle = stripHtml(course?.title || "");
  const courseDescription = stripHtml(course?.description || "");
  const courseDuration = stripHtml(course?.duration || "");
  const courseLevel = stripHtml(course?.level || "");
  const courseField = stripHtml(course?.field || "");
  const courseAffiliation = stripHtml(course?.affiliation || "");
  const courseEstFee = stripHtml(course?.estFee || "");
  const courseGovtFee = stripHtml(course?.govtFee || "");
  const coursePrivateFee = stripHtml(course?.privateFee || "");
  const courseImage = course?.image;
  const highlights = course?.highlights || [];
  const about = details?.about || [];
  const admissionRequirements = details?.admissionRequirements || [];
  const curriculum = details?.curriculum || [];
  const careerOpportunities = details?.careerOpportunities || [];

  const hasAdmissionData = admissionRequirements.length > 0;
  const hasCurriculumData = curriculum.length > 0;
  const hasFeeData = !!(courseEstFee || courseGovtFee || coursePrivateFee);

  const bannerImage =
    courseImage ||
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop";

  const metadataParts = [courseDuration, courseLevel, courseAffiliation].filter(Boolean);
  const metadataText = metadataParts.length > 0 ? metadataParts.join(" | ") : "";

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .tab-content { animation: fadeIn 0.4s ease-in-out; }
      `}</style>

      <div className="w-full bg-white text-gray-800">
        <div className="mx-auto max-w-350 pt-12 pb-8 px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-6 gap-1 overflow-x-auto whitespace-nowrap">
            <a href="/" className="hover:text-gray-900 transition-colors shrink-0">Home</a>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            <a href="/course-finder" className="hover:text-gray-900 transition-colors shrink-0">Course Finder</a>
            {courseLevel && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                <a
                  href={`/course-finder?level=${encodeURIComponent(courseLevel)}`}
                  className="hover:text-gray-900 transition-colors shrink-0"
                >
                  {courseLevel}
                </a>
              </>
            )}
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-gray-900 font-semibold truncate">{courseTitle}</span>
          </nav>

          <div className="mb-6">
            <h1 className="text-[28px] md:text-4xl font-bold text-gray-900">{courseTitle}</h1>
            {metadataText && (
              <p className="text-sm text-gray-400 font-medium mt-2">{metadataText}</p>
            )}
          </div>

          {/* Banner Image */}
          <div
            className="relative w-full h-[280px] md:h-[380px] bg-cover bg-center rounded-md overflow-hidden"
            style={{
              backgroundImage: `url('${bannerImage}')`,
              backgroundPosition: "center 20%",
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>

        {/* Sticky Tab Nav */}
        <div className="mx-auto max-w-350 sticky top-0 z-40 bg-white border-b border-gray-100">
          <div className="relative overflow-hidden px-4">
            {isTabsOverflowing && canScrollTabsLeft && (
              <button
                type="button"
                onClick={() => scrollTabs("left")}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-700 transition hover:bg-gray-50"
                aria-label="Scroll tabs left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            {isTabsOverflowing && canScrollTabsRight && (
              <button
                type="button"
                onClick={() => scrollTabs("right")}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-700 transition hover:bg-gray-50"
                aria-label="Scroll tabs right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            <div
              ref={tabsScrollRef}
              className="overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <nav
                ref={tabsNavRef}
                className="flex w-max space-x-8 whitespace-nowrap"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={`shrink-0 py-4 text-[14px] transition-colors cursor-pointer bg-transparent border-b-2 appearance-none outline-none ${
                      activeTab === tab.key
                        ? "border-[#0000ff] text-[#0000ff] font-bold"
                        : "border-transparent text-gray-500 font-semibold hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-350 py-8 md:py-12 bg-white px-4">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="tab-content">
              {courseDescription ? (
                <div className="space-y-6 text-gray-600 text-[15px] md:text-[15.5px] leading-[1.8]">
                  <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                  {courseDescription.split("\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : !about.length && !highlights.length && !careerOpportunities.length ? (
                <EmptyTabState tabName="overview" />
              ) : null}

              {about.length > 0 && (
                <div className={courseDescription ? "pt-6" : ""}>
                  {!courseDescription && <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>}
                  <div className="space-y-4">
                    {about.map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#0000ff] flex items-center justify-center text-white shrink-0 mt-0.5">
                          <span className="text-sm font-bold">{i + 1}</span>
                        </div>
                        <p className="text-sm text-gray-600 pt-1">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {highlights.length > 0 && (
                <div className="pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
                  <div className="space-y-4">
                    {highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#0000ff] flex items-center justify-center text-white shrink-0 mt-0.5">
                          <span className="text-sm font-bold">{i + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {careerOpportunities.length > 0 && (
                <div className="pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Opportunities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {careerOpportunities.map((career, i) => (
                      <div key={i} className="border border-gray-200 rounded-md p-4 bg-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#0000ff] flex items-center justify-center text-white flex-shrink-0">
                          <span className="text-sm font-bold">{i + 1}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{career.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Eligibility Tab */}
          {activeTab === "eligibility" && (
            <div className="tab-content">
              {hasAdmissionData ? (
                <div className="mb-6">
                  <h2 className="text-[22px] font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
                  <div className="overflow-x-auto rounded border border-gray-200">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-[#eff4fc] border-b border-gray-200">
                          <th className="p-4 font-bold text-gray-900 w-[8%] border-r border-gray-200">S.N.</th>
                          <th className="p-4 font-bold text-gray-900">Requirement</th>
                        </tr>
                      </thead>
                      <tbody className="text-[15px]">
                        {admissionRequirements.map((req, i) => (
                          <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-4 align-top border-r border-gray-200 text-gray-700">{i + 1}</td>
                            <td className="p-4 align-top text-gray-700">{req}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="eligibility" />
              )}
            </div>
          )}

          {/* Admission Tab */}
          {activeTab === "admission" && (
            <div className="tab-content">
              <EmptyTabState tabName="admission process" />
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="tab-content">
              {hasCurriculumData ? (
                <div className="mb-6">
                  <h2 className="text-[22px] font-bold text-gray-900 mb-4">Course Curriculum</h2>
                  <div className="space-y-6">
                    {curriculum.map((sem: any, i: number) => (
                      <div key={i} className="border border-gray-200 rounded-md p-6 bg-white">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-md bg-[#0000ff] flex items-center justify-center text-white flex-shrink-0">
                            <span className="text-sm font-bold">{sem.semester || i + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {sem.title || `Semester ${sem.semester || i + 1}`}
                            </h3>
                            {sem.subtitle && (
                              <p className="text-sm text-gray-500">{sem.subtitle}</p>
                            )}
                          </div>
                        </div>
                        {sem.subjects && sem.subjects.length > 0 && (
                          <div className="bg-gray-50 rounded-md p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Subjects:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                              {sem.subjects.map((sub: string, j: number) => (
                                <li key={j} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>
                                  {sub}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="courses" />
              )}
            </div>
          )}

          {/* Program Fee Tab */}
          {activeTab === "fees" && (
            <div className="tab-content">
              {hasFeeData ? (
                <div className="mb-6">
                  <h2 className="text-[22px] font-bold text-gray-900 mb-4">Fee Structure</h2>

                  <div className="overflow-x-auto rounded border border-gray-200">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-[#eff4fc] border-b border-gray-200">
                          <th className="p-4 font-bold text-gray-900 w-[35%] border-r border-gray-200">Particulars</th>
                          <th className="p-4 font-bold text-gray-900">Amount (NPR)</th>
                        </tr>
                      </thead>
                      <tbody className="text-[15px]">
                        {courseEstFee && (
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-4 align-top border-r border-gray-200 font-semibold text-gray-900">
                              Estimated Fee
                            </td>
                            <td className="p-4 align-top text-gray-700">{courseEstFee}</td>
                          </tr>
                        )}
                        {courseGovtFee && (
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-4 align-top border-r border-gray-200 font-semibold text-gray-900">
                              Government Fee
                            </td>
                            <td className="p-4 align-top text-gray-700">{courseGovtFee}</td>
                          </tr>
                        )}
                        {coursePrivateFee && (
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-4 align-top border-r border-gray-200 font-semibold text-gray-900">
                              Private Fee
                            </td>
                            <td className="p-4 align-top text-gray-700">{coursePrivateFee}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="fee" />
              )}
            </div>
          )}

          {/* Scholarships Tab */}
          {activeTab === "scholarships" && (
            <div className="tab-content">
              <EmptyTabState tabName="scholarships" />
            </div>
          )}

          {/* News Tab */}
          {activeTab === "news" && (
            <div className="tab-content">
              <EmptyTabState tabName="news" />
            </div>
          )}

          {/* Blogs Tab */}
          {activeTab === "blogs" && (
            <div className="tab-content">
              <EmptyTabState tabName="blogs" />
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="tab-content">
              <EmptyTabState tabName="FAQ" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
