"use client";

interface Program {
  name: string;
  status: "Upcoming" | "Ongoing" | "Closed";
}

interface CollegeCardProps {
  images: string[];
  cardImage?: string;
  collegeName: string;
  rating: number;
  type: string;
  location: string;
  website: string;
  programs: Program[];
  moreProgramsCount?: number;
  onApply?: () => void;
  onCollegeNameClick?: () => void;
  onCourseClick?: (courseName: string) => void;
  onMockTest?: () => void;
  onAskQuestion?: () => void;
  onNavigate?: () => void;
  collegeId?: number;
  isSaved?: boolean;
  isBookmarkPending?: boolean;
  onToggleSaved?: () => void;
}

export default function CollegeCard({
  images,
  cardImage,
  collegeName,
  rating,
  type,
  location,
  website,
  programs,
  moreProgramsCount = 0,
  onApply,
  onCollegeNameClick,
  onCourseClick,
  onAskQuestion,
  onNavigate,
  isSaved = false,
  isBookmarkPending = false,
  onToggleSaved,
}: CollegeCardProps) {
  const displayUrl =
    website?.replace(/^https?:\/\//, "").replace(/\/+$/, "") || "";

  return (
    <div
      className="bg-white rounded-md border border-gray-200 hover:border-blue-200 overflow-hidden w-full max-w-85 flex flex-col h-full transition-transform"
    >
      {/* Image Section */}
      <div className="p-2.5 pb-0 shrink-0">
        <div className="relative w-full aspect-[21/9] bg-gray-200 rounded-md overflow-hidden">
          {cardImage ? (
            <img
              src={cardImage}
              alt={collegeName}
              className="w-full h-full object-cover"
            />
          ) : images.length > 0 ? (
            <img
              src={images[0]}
              alt={collegeName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          )}
          {/* Tiny Integrated Text Links */}
          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10">
            <span className="text-white text-[8px] font-medium tracking-tight opacity-90">
              Required Counselling?
            </span>
            <span className="w-px h-2 bg-white/20"></span>
            <span className="text-emerald-300 text-[8px] font-bold tracking-tight cursor-pointer hover:text-emerald-100 transition-colors">
              Reserve Seat
            </span>
          </div>

        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 pb-3 flex flex-col grow">
        {/* College Name + Verified */}
        <div className="flex items-center gap-1.5 mb-1 group/name relative">
          <h2
            title={collegeName}
            className="text-[#0f172a] text-[18px] font-bold leading-tight truncate transition-colors group-hover/name:text-brand-blue cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onCollegeNameClick?.();
            }}
          >
            {collegeName}
          </h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#0d6efd"
            className="w-5 h-5 shrink-0 mt-0.5"
          >
            <path
              fillRule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Stats Row */}
        <div className="flex items-center text-[12px] text-[#64748b] mb-1.5 whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-1">
            <svg className="w-3.75 h-3.75 fill-[#f59e0b]" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-bold text-[#334155]">{rating}</span>
          </div>
          <span className="mx-2 text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>{type}</span>
          </div>
          <span className="mx-2 text-gray-300">|</span>
          <div className="flex items-center gap-1.5 truncate">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate" title={location}>
              {location}
            </span>
          </div>
        </div>

        {/* Website */}
        <div className="flex items-center gap-1.5 text-[12.5px] text-[#64748b] mb-2 hover:text-[#0d6efd] transition-colors cursor-pointer w-fit">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          <span>{displayUrl}</span>
        </div>

        <hr className="border-gray-100 mb-2" />

        {/* Programs Offered Header */}
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[12.5px] font-medium text-[#64748b]">
            Programs Offered
          </span>
          <span className="text-[12.5px] font-semibold text-[#2563eb]">
            Admission Open
          </span>
        </div>

        {/* Programs List */}
        <ul className="space-y-1 mb-2">
          {programs.slice(0, 3).map((program, index) => {
            const statusColor =
              program.status === "Closed"
                ? "text-red-600 bg-red-50"
                : program.status === "Upcoming"
                  ? "text-amber-600 bg-amber-50"
                  : "text-green-600 bg-green-50";
            const displayName =
              program.name.length > 28
                ? program.name.slice(0, 28) + "..."
                : program.name;
            return (
              <li
                key={index}
                className="flex items-center justify-between text-[12.5px] font-semibold text-[#1e293b]"
              >
                <span
                  className="hover:text-brand-blue cursor-pointer truncate max-w-[180px]"
                  title={program.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCourseClick?.(program.name);
                  }}
                >
                  {displayName}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${statusColor}`}
                >
                  {program.status}
                </span>
              </li>
            );
          })}
        </ul>

        {programs.length > 3 && (
          <p className="text-[12.5px] font-semibold text-[#2563eb] mb-2">
            +{programs.length - 3} more
          </p>
        )}

        <div
          className="border-b border-dotted border-gray-200 mt-auto mb-3 w-full pt-2"
          style={{ borderBottomWidth: "1.5px", borderBottomStyle: "dotted" }}
        ></div>

        {/* Actions: Ask Question, Apply Now, Bookmark */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAskQuestion?.();
            }}
            className="flex-1 py-2 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 rounded-md text-[13px] font-semibold transition-colors flex justify-center items-center gap-1 whitespace-nowrap"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Ask Question
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply?.();
            }}
            className="flex-1 py-2 px-2 bg-brand-blue hover:bg-brand-hover text-white rounded-md text-[13px] font-bold transition-colors flex justify-center items-center gap-1 whitespace-nowrap"
          >
            View Detail
          </button>
          <button
            disabled={isBookmarkPending}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSaved?.();
            }}
            className={`flex-none w-9 h-9 flex items-center justify-center border rounded-md transition-colors ${
              isBookmarkPending
                ? "border-gray-100 bg-gray-50 cursor-not-allowed"
                : isSaved
                  ? "border-blue-100 bg-blue-50 text-blue-600"
                  : "border-gray-200 text-[#64748b] hover:bg-gray-50"
            }`}
          >
            {isBookmarkPending ? (
              <svg
                className="w-4 h-4 animate-spin text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <i
                className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark text-[16px]`}
              ></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
