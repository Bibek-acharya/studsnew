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

  const visiblePages = [1, 2, 3].filter((page) => page <= totalPages);

  return (
    <div className="mb-2 mt-10 flex items-center justify-center gap-1 sm:gap-2">
      <button
        className="flex items-center gap-1 rounded-[8px] border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-400 transition-colors disabled:cursor-not-allowed"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        <i className="fa-solid fa-chevron-left text-xs"></i>
        <span className="hidden sm:inline">Prev</span>
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-9 w-9 items-center justify-center rounded-[8px] text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-[#0000FF] text-white shadow-sm hover:bg-[#0000CC]"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      {totalPages > 4 && (
        <span className="flex h-9 w-9 select-none items-center justify-center text-gray-400">
          ...
        </span>
      )}

      {totalPages > 4 && (
        <button
          onClick={() => onPageChange(totalPages)}
          className={`flex h-9 w-9 items-center justify-center rounded-[8px] text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? "bg-[#0000FF] text-white shadow-sm hover:bg-[#0000CC]"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {totalPages}
        </button>
      )}

      <button
        className="flex items-center gap-1 rounded-[8px] border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        <span className="hidden sm:inline">Next</span>
        <i className="fa-solid fa-chevron-right text-xs"></i>
      </button>
    </div>
  );
};

export default Pagination;
