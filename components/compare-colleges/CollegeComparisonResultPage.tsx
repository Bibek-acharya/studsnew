import React, { useMemo, useState, useCallback } from "react";
import type { College } from "@/services/api";

interface CollegeComparisonResultPageProps {
  onNavigate: (view: string, data?: { college1: Partial<College> | string; college2: Partial<College> | string }) => void;
  college1?: Partial<College> | string;
  college2?: Partial<College> | string;
  loading?: boolean;
}

type TabKey =
  | "overview"
  | "academics"
  | "facilities"
  | "financial"
  | "career"
  | "reviews"
  | "photos";

interface CompareRow {
  label: string;
  left: string;
  right: string;
}

interface CompareSection {
  title: string;
  rows: CompareRow[];
}

interface CollegeReview {
  rating?: number;
  likes?: string;
  dislikes?: string;
  program?: string;
  created_at?: string;
}

interface GalleryImage {
  url?: string;
  src?: string;
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "academics", label: "Academics" },
  { key: "facilities", label: "Facilities" },
  { key: "financial", label: "Financial & Scholarship" },
  { key: "career", label: "Career & Placement" },
  { key: "reviews", label: "Reviews & Reputation" },
  { key: "photos", label: "Photos & Video" },
];

const safeStr = (val: unknown, fallback = "N/A"): string => {
  if (val === null || val === undefined || val === "") return fallback;
  return String(val);
};

const safeJsonParse = <T,>(val: unknown, fallback: T): T => {
  if (!val) return fallback;
  if (typeof val === "string") {
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  }
  return val as T;
};

const renderComparisonRows = (rows: CompareRow[]) => (
  <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
    {rows.map((row, index) => {
      const isLast = index === rows.length - 1;
      return (
        <div key={row.label}>
          <div
            className={`bg-[#f8fafe] px-4 md:px-6 py-2.5 text-[14px] font-medium text-slate-600 ${
              isLast ? "" : "border-b border-gray-200"
            }`}
          >
            {row.label}
          </div>
          <div
            className={`grid grid-cols-2 bg-white ${
              isLast ? "" : "border-b border-gray-200"
            }`}
          >
            <div className="p-4 md:px-6 border-r border-gray-200 min-w-0">
              <span className="text-gray-900 font-semibold text-[15px] break-words">{row.left}</span>
            </div>
            <div className="p-4 md:px-6 min-w-0">
              <span className="text-gray-900 font-semibold text-[15px] break-words">{row.right}</span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const renderGroupedSections = (sections: CompareSection[]) => (
  <>
    {sections.map((section) => (
      <div key={section.title} className="mt-8 first:mt-0">
        <h3 className="text-[17px] font-bold text-gray-800 mb-3 pl-1">{section.title}</h3>
        {renderComparisonRows(section.rows)}
      </div>
    ))}
  </>
);

const CollegeComparisonResultPage: React.FC<CollegeComparisonResultPageProps> = ({
  onNavigate,
  college1,
  college2,
  loading = false,
}) => {
  const c1: Partial<College> | null =
    typeof college1 === "string" ? null : college1 || null;
  const c2: Partial<College> | null =
    typeof college2 === "string" ? null : college2 || null;

  const c1Name = c1?.name || "College A";
  const c2Name = c2?.name || "College B";

  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const overviewRows: CompareRow[] = useMemo(() => {
    if (!c1 && !c2) return [];
    return [
      { label: "Year Established", left: safeStr(c1?.established), right: safeStr(c2?.established) },
      { label: "Type", left: safeStr(c1?.type), right: safeStr(c2?.type) },
      { label: "Affiliated University", left: safeStr(c1?.affiliation), right: safeStr(c2?.affiliation) },
      { label: "Total Students", left: safeStr(c1?.students), right: safeStr(c2?.students) },
      { label: "Location", left: safeStr(c1?.location), right: safeStr(c2?.location) },
      { label: "Total Programs", left: safeStr(c1?.programs), right: safeStr(c2?.programs) },
      { label: "Verified", left: c1?.verified ? "Yes" : "No", right: c2?.verified ? "Yes" : "No" },
    ];
  }, [c1, c2]);

  const academicsSections: CompareSection[] = useMemo(() => {
    if (!c1 && !c2) return [];

    const getPrograms = (c: Partial<College> | null): string => {
      if (!c) return "N/A";
      const featured = safeJsonParse<string[]>(c.featured_programs, []);
      if (featured.length > 0) return featured.join(", ");
      return safeStr(c.description, "N/A");
    };

    return [
      {
        title: "Programs Offered",
        rows: [{ label: "Featured Programs", left: getPrograms(c1), right: getPrograms(c2) }],
      },
      {
        title: "Fit Scores",
        rows: [
          { label: "Academic Fit", left: safeStr(c1?.academic_fit_score), right: safeStr(c2?.academic_fit_score) },
          { label: "Campus Life", left: safeStr(c1?.campus_life_score), right: safeStr(c2?.campus_life_score) },
          { label: "Career Fit", left: safeStr(c1?.career_fit_score), right: safeStr(c2?.career_fit_score) },
          { label: "Balanced Fit", left: safeStr(c1?.balanced_fit_score), right: safeStr(c2?.balanced_fit_score) },
        ],
      },
    ];
  }, [c1, c2]);

  const facilitiesSections: CompareSection[] = useMemo(() => {
    if (!c1 && !c2) return [];

    const getAmenities = (c: Partial<College> | null): string => {
      if (!c) return "N/A";
      const items = safeJsonParse<string[]>(c.amenities, []);
      if (Array.isArray(items) && items.length > 0) return items.join(", ");
      return "N/A";
    };

    return [
      {
        title: "Facilities Provided",
        rows: [{ label: "Facilities", left: getAmenities(c1), right: getAmenities(c2) }],
      },
    ];
  }, [c1, c2]);

  const financialSections: CompareSection[] = useMemo(() => {
    if (!c1 && !c2) return [];

    const getScholarships = (c: Partial<College> | null): string => {
      if (!c) return "N/A";
      const items = safeJsonParse<Array<{ name?: string; title?: string } | string>>(c.scholarships, []);
      if (Array.isArray(items) && items.length > 0) {
        return items.map((s) => (typeof s === "string" ? s : s.name || s.title || "")).filter(Boolean).join(", ");
      }
      return "N/A";
    };

    return [
      {
        title: "Scholarships",
        rows: [{ label: "Available Scholarships", left: getScholarships(c1), right: getScholarships(c2) }],
      },
    ];
  }, [c1, c2]);

  const careerSections: CompareSection[] = useMemo(() => {
    if (!c1 && !c2) return [];

    return [
      {
        title: "Career Scores",
        rows: [
          { label: "Career Fit Score", left: safeStr(c1?.career_fit_score), right: safeStr(c2?.career_fit_score) },
          { label: "Campus Life Score", left: safeStr(c1?.campus_life_score), right: safeStr(c2?.campus_life_score) },
        ],
      },
    ];
  }, [c1, c2]);

  const reviewRows: CompareRow[] = useMemo(() => {
    if (!c1 && !c2) return [];
    return [
      { label: "Overall Rating", left: c1?.rating ? `${c1.rating} ★` : "N/A", right: c2?.rating ? `${c2.rating} ★` : "N/A" },
      { label: "Total Reviews", left: safeStr(c1?.reviews), right: safeStr(c2?.reviews) },
      { label: "Academic Fit", left: safeStr(c1?.academic_fit_score), right: safeStr(c2?.academic_fit_score) },
      { label: "Campus Life", left: safeStr(c1?.campus_life_score), right: safeStr(c2?.campus_life_score) },
      { label: "Career Fit", left: safeStr(c1?.career_fit_score), right: safeStr(c2?.career_fit_score) },
      { label: "Balanced Fit", left: safeStr(c1?.balanced_fit_score), right: safeStr(c2?.balanced_fit_score) },
    ];
  }, [c1, c2]);

  const getReviews = (c: Partial<College> | null): CollegeReview[] => {
    if (!c) return [];
    return safeJsonParse<CollegeReview[]>(c.college_reviews, []);
  };

  const c1Reviews = useMemo(() => getReviews(c1), [c1]);
  const c2Reviews = useMemo(() => getReviews(c2), [c2]);

  const [showAllReviews1, setShowAllReviews1] = useState(false);
  const [showAllReviews2, setShowAllReviews2] = useState(false);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Compare ${c1Name} vs ${c2Name}`,
        text: `Compare ${c1Name} vs ${c2Name} on StudSphere`,
        url: window.location.href,
      }).catch((err) => console.error("Failed to share:", err));
    } else {
      navigator.clipboard.writeText(window.location.href).catch((err) => {
        console.error("Failed to copy URL:", err);
      });
    }
  }, [c1Name, c2Name]);

  const getGallery = (c: Partial<College> | null): GalleryImage[] => {
    if (!c) return [];
    return safeJsonParse<GalleryImage[]>(c.gallery, []);
  };

  const c1Gallery = useMemo(() => getGallery(c1), [c1]);
  const c2Gallery = useMemo(() => getGallery(c2), [c2]);

  const initials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  if (loading) {
    return (
      <div className="bg-white min-h-screen py-4 md:py-8 px-4 md:px-0">
        <div className="max-w-[1000px] mx-auto animate-pulse">
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 max-w-[620px]" />
            <div className="h-5 bg-gray-200 rounded w-16" />
          </div>

          <div className="border border-gray-200 rounded-md bg-white flex flex-col md:flex-row overflow-hidden">
            {[1, 2].map((item) => (
              <div key={item} className="flex-1 p-5 md:p-6 flex gap-4 md:border-r last:border-r-0 border-gray-200">
                <div className="w-[72px] h-[72px] bg-gray-200 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-3 pt-1">
                  <div className="h-6 bg-gray-200 rounded w-4/5" />
                  <div className="h-5 bg-gray-200 rounded w-28" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-b border-gray-200 flex gap-6 pb-3">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-5 bg-gray-200 rounded w-20" />)}
          </div>

          <div className="mt-8 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-44" />
            <div className="h-20 bg-gray-100 rounded" />
            <div className="h-20 bg-gray-100 rounded" />
            <div className="h-20 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!c1 && !c2) {
    return (
      <div className="bg-white min-h-screen py-4 md:py-8 px-4 md:px-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-medium mb-4">No colleges selected for comparison.</p>
          <button
            onClick={() => onNavigate("search")}
            className="text-[#2c51c6] font-semibold hover:underline"
          >
            Go back to search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 min-h-screen py-4 md:py-8 px-4 md:px-0">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Compare {c1Name} vs {c2Name}
          </h1>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm"
          >
            <i className="fa-solid fa-share-nodes text-[13px]"></i>
            Share
          </button>
        </div>

        <div className="relative border border-gray-200 rounded-md bg-white flex flex-col md:flex-row overflow-visible">
          <div className="absolute left-1/2 top-[100px] md:top-24 transform -translate-x-1/2 -translate-y-1/2 bg-[#1b254b] text-white rounded-full w-8 h-8 items-center justify-center text-[10px] font-bold z-10 border-[3px] border-white hidden md:flex">
            VS
          </div>

          <div className="flex-1 flex flex-col md:border-r border-gray-200">
            <div className="p-5 md:p-6 relative flex gap-4 rounded-tl-xl md:rounded-bl-none">
              <button
                onClick={() => onNavigate("search")}
                className="absolute top-4 right-4 p-1.5 border border-gray-200 rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
              >
                <i className="fa-solid fa-pen text-[11px]"></i>
              </button>

              <div className="w-[72px] h-[72px] border border-gray-200 rounded-md flex items-center justify-center p-1 flex-shrink-0 bg-[#2c51c6] overflow-hidden">
                {c1?.image_url ? (
                  <img src={c1.image_url} alt={c1Name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-sm font-bold text-white">{initials(c1Name)}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {c1?.id ? (
                  <a 
                    href={`/find-college/${c1.id}`}
                    className="text-xl font-semibold text-[#2c51c6] hover:underline block mb-1 text-left truncate"
                  >
                    {c1Name}
                  </a>
                ) : (
                  <span className="text-xl font-semibold text-gray-900 block mb-1 text-left truncate">
                    {c1Name}
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#10b981] text-white px-1.5 py-0.5 rounded flex items-center gap-1 text-sm font-bold">
                    <i className="fa-solid fa-star text-[11px]"></i>
                    {c1?.rating?.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-[#64748b] text-sm">({safeStr(c1?.reviews, "0")} Reviews)</span>
                </div>
                <p className="text-gray-500 text-sm truncate">{safeStr(c1?.location)}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative border-t md:border-t-0 border-gray-200">
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-[#1b254b] text-white rounded-full w-8 h-8 flex items-center justify-center text-[10px] font-bold z-10 border-[3px] border-white md:hidden">
              VS
            </div>

            <div className="p-5 md:p-6 relative flex gap-4">
              <button
                onClick={() => onNavigate("search")}
                className="absolute top-4 right-4 p-1.5 border border-gray-200 rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
              >
                <i className="fa-solid fa-pen text-[11px]"></i>
              </button>

              <div className="w-[72px] h-[72px] border border-gray-200 rounded-md flex items-center justify-center p-1 flex-shrink-0 bg-[#2c51c6] overflow-hidden">
                {c2?.image_url ? (
                  <img src={c2.image_url} alt={c2Name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-sm font-bold text-white">{initials(c2Name)}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {c2?.id ? (
                  <a 
                    href={`/find-college/${c2.id}`}
                    className="text-xl font-semibold text-[#2c51c6] hover:underline block mb-1 text-left truncate"
                  >
                    {c2Name}
                  </a>
                ) : (
                  <span className="text-xl font-semibold text-gray-900 block mb-1 text-left truncate">
                    {c2Name}
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#f59e0b] text-white px-1.5 py-0.5 rounded flex items-center gap-1 text-sm font-bold">
                    <i className="fa-solid fa-star text-[11px]"></i>
                    {c2?.rating?.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-[#64748b] text-sm">({safeStr(c2?.reviews, "0")} Reviews)</span>
                </div>
                <p className="text-gray-500 text-sm truncate">{safeStr(c2?.location)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-b border-gray-200">
          <ul className="flex overflow-x-auto text-sm font-medium text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <li className="mr-2" key={tab.key}>
                <button
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-block px-4 py-3 border-b-2 rounded-t-lg whitespace-nowrap ${
                    activeTab === tab.key
                      ? "text-[#2c51c6] border-[#2c51c6] font-semibold"
                      : "text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 mb-16">
          {activeTab === "overview" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-table-columns text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Overview</h2>
              </div>
              {renderComparisonRows(overviewRows)}
            </div>
          )}

          {activeTab === "academics" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-graduation-cap text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Academics</h2>
              </div>
              {renderGroupedSections(academicsSections)}
            </div>
          )}

          {activeTab === "facilities" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-building text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Facilities</h2>
              </div>
              {renderGroupedSections(facilitiesSections)}
            </div>
          )}

          {activeTab === "financial" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-wallet text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Financial & Scholarship</h2>
              </div>
              {renderGroupedSections(financialSections)}
            </div>
          )}

          {activeTab === "career" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-briefcase text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Career & Placement</h2>
              </div>
              {renderGroupedSections(careerSections)}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-star text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Reviews & Reputation</h2>
              </div>

              <h3 className="text-[17px] font-bold text-gray-800 mb-3 mt-6 pl-1">Ratings Comparison</h3>
              {renderComparisonRows(reviewRows)}

              <div className="flex items-center gap-2 mb-4 mt-10 pl-1">
                <i className="fa-regular fa-message text-[#1b254b]"></i>
                <h3 className="text-[19px] font-bold text-[#1b254b]">Recent Reviews</h3>
              </div>

              <div className="border border-gray-200 rounded-md overflow-hidden bg-white flex flex-col md:flex-row">
                <div className="flex-1 flex flex-col md:border-r border-gray-200">
                  <div className="p-5 flex-1">
                    {c1Reviews.length > 0 ? (
                      <>
                        {(showAllReviews1 ? c1Reviews : c1Reviews.slice(0, 2)).map((review, idx) => (
                          <div key={idx} className={idx > 0 ? "mt-6 pt-6 border-t border-gray-100" : ""}>
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex items-center">
                                <div className="w-1 h-6 bg-[#2e7d32] rounded-sm mr-2"></div>
                                <span className="flex items-center gap-1 bg-[#2e7d32] text-white px-2 py-0.5 rounded text-[15px] font-bold">
                                  <i className="fa-solid fa-star text-[11px]"></i> {review.rating || "N/A"}
                                </span>
                              </div>
                              {review.created_at && (
                                <span className="text-[13px] text-gray-500 mt-1">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <div className="mt-3 text-[13px]">
                              {review.program && (
                                <>
                                  <span className="text-gray-500">rated by a {review.program} Student</span>
                                  <div className="text-gray-900 font-semibold mt-0.5">{c1Name}</div>
                                </>
                              )}
                            </div>
                            {review.likes && (
                              <div className="mt-5">
                                <h4 className="font-bold text-gray-900 text-[15px] mb-1">Likes</h4>
                                <p className="text-[14.5px] text-gray-700 leading-relaxed">{review.likes}</p>
                              </div>
                            )}
                            {review.dislikes && (
                              <div className="mt-4 mb-2">
                                <h4 className="font-bold text-gray-900 text-[15px] mb-1">Dislikes</h4>
                                <p className="text-[14.5px] text-gray-700 leading-relaxed">{review.dislikes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                        {c1Reviews.length > 2 && (
                          <button
                            onClick={() => setShowAllReviews1(!showAllReviews1)}
                            className="mt-4 text-[#2c51c6] font-semibold text-sm hover:underline"
                          >
                            {showAllReviews1 ? "Show less" : `Show all ${c1Reviews.length} reviews`}
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm italic">No reviews yet</p>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="p-5 flex-1">
                    {c2Reviews.length > 0 ? (
                      <>
                        {(showAllReviews2 ? c2Reviews : c2Reviews.slice(0, 2)).map((review, idx) => (
                          <div key={idx} className={idx > 0 ? "mt-6 pt-6 border-t border-gray-100" : ""}>
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex items-center">
                                <div className="w-1 h-6 bg-[#2e7d32] rounded-sm mr-2"></div>
                                <span className="flex items-center gap-1 bg-[#2e7d32] text-white px-2 py-0.5 rounded text-[15px] font-bold">
                                  <i className="fa-solid fa-star text-[11px]"></i> {review.rating || "N/A"}
                                </span>
                              </div>
                              {review.created_at && (
                                <span className="text-[13px] text-gray-500 mt-1">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <div className="mt-3 text-[13px]">
                              {review.program && (
                                <>
                                  <span className="text-gray-500">rated by a {review.program} Student</span>
                                  <div className="text-gray-900 font-semibold mt-0.5">{c2Name}</div>
                                </>
                              )}
                            </div>
                            {review.likes && (
                              <div className="mt-5">
                                <h4 className="font-bold text-gray-900 text-[15px] mb-1">Likes</h4>
                                <p className="text-[14.5px] text-gray-700 leading-relaxed">{review.likes}</p>
                              </div>
                            )}
                            {review.dislikes && (
                              <div className="mt-4 mb-2">
                                <h4 className="font-bold text-gray-900 text-[15px] mb-1">Dislikes</h4>
                                <p className="text-[14.5px] text-gray-700 leading-relaxed">{review.dislikes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                        {c2Reviews.length > 2 && (
                          <button
                            onClick={() => setShowAllReviews2(!showAllReviews2)}
                            className="mt-4 text-[#2c51c6] font-semibold text-sm hover:underline"
                          >
                            {showAllReviews2 ? "Show less" : `Show all ${c2Reviews.length} reviews`}
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm italic">No reviews yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "photos" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-images text-[#1b254b]"></i>
                <h2 className="text-xl font-bold text-[#1b254b]">Photos & Video</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                  <h3 className="font-bold text-gray-800 px-4 pt-4 pb-2">{c1Name}</h3>
                  {c1Gallery.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 p-4">
                      {c1Gallery.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="aspect-video bg-gray-100 rounded overflow-hidden">
                          <img
                            src={img.url || img.src || ""}
                            alt={`${c1Name} gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic px-4 pb-4">No photos available</p>
                  )}
                </div>
                <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                  <h3 className="font-bold text-gray-800 px-4 pt-4 pb-2">{c2Name}</h3>
                  {c2Gallery.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 p-4">
                      {c2Gallery.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="aspect-video bg-gray-100 rounded overflow-hidden">
                          <img
                            src={img.url || img.src || ""}
                            alt={`${c2Name} gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic px-4 pb-4">No photos available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeComparisonResultPage;
