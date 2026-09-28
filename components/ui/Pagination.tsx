"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sliding window: first page, last page and a run of pages around the current
  // one, with gaps marked. The previous fixed [1, 2, 3] window left every page
  // between 4 and the last one reachable only through Next.
  const WINDOW = 1;
  const windowStart = Math.max(2, currentPage - WINDOW);
  const windowEnd = Math.min(totalPages - 1, currentPage + WINDOW);
  const pages: Array<number | "gap"> = [1];
  if (windowStart > 2) pages.push("gap");
  for (let page = windowStart; page <= windowEnd; page += 1) pages.push(page);
  if (windowEnd < totalPages - 1) pages.push("gap");
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="mb-2 mt-10 flex items-center justify-center gap-1 sm:gap-2">
      <button
        className="flex items-center gap-1 rounded-[8px] border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-400 transition-colors disabled:cursor-not-allowed"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
      >
        <i className="fa-solid fa-chevron-left text-xs"></i>
        <span className="hidden sm:inline">Prev</span>
      </button>

      {pages.map((page, index) =>
        page === "gap" ? (
          <span
            key={`gap-${index}`}
            className="flex h-9 w-9 select-none items-center justify-center text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-[8px] text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-brand-blue text-white  hover:bg-[#0000CC]"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        className="flex items-center gap-1 rounded-[8px] border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
      >
        <span className="hidden sm:inline">Next</span>
        <i className="fa-solid fa-chevron-right text-xs"></i>
      </button>
    </div>
  );
};

export default Pagination;
