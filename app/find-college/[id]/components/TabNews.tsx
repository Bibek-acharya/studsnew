"use client";

import React from "react";
import EmptyTabState from "./EmptyTabState";

interface TabNewsProps {
  news: any[];
  page: number;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 9;

const TabNews: React.FC<TabNewsProps> = ({ news, page, onPageChange }) => {
  if (news.length === 0) return <EmptyTabState tabName="news" />;

  const paginated = news.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginated.map((news) => (
          <div key={news.title} className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white transition">
            <div className="flex-1 p-5">
              <div className="mb-4">
                <span className={`inline-block rounded-full px-3.5 py-1 text-[12px] font-bold ${news.badgeClass}`}>{news.badge}</span>
              </div>
              <div className="mb-4 h-[140px] w-full overflow-hidden rounded-md bg-brand-blue">
                {news.image ? <img src={news.image} className="h-full w-full object-cover transition hover:scale-105" alt={news.title} /> : null}
              </div>
              <h3 className="mb-2 text-[17px] font-bold text-gray-900">{news.title}</h3>
              <p className="line-clamp-2 text-[13.5px] text-gray-500">{news.desc}</p>
            </div>
            <div className="flex items-center justify-between border-t border-gray-50 bg-white px-5 py-4">
              <div className="flex items-center gap-1.5 text-gray-400">
                <i className="fa-regular fa-clock"></i>
                <span className="text-[12.5px] font-medium">{news.time}</span>
              </div>
              <button className="flex items-center text-[13px] font-bold text-brand-blue hover:text-brand-hover">View Details <i className="fa-solid fa-chevron-right ml-1 text-[11px]"></i></button>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button key={idx} className={`h-10 w-10 rounded-md text-sm font-bold transition ${page === idx + 1 ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={() => onPageChange(idx + 1)}>{idx + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabNews;
