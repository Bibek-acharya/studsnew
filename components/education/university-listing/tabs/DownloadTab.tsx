"use client";

import React from "react";
import EmptyTabState from "@/app/find-college/[id]/components/EmptyTabState";

interface DownloadTabProps {
  downloadsList: any[];
}

export default function DownloadTab({ downloadsList }: DownloadTabProps) {
  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Downloads</h2>
        <p className="mt-1 text-[14px] text-gray-500">Access brochures, forms, and study materials.</p>
      </div>
      {downloadsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {downloadsList.map((dl: any, i: number) => (
            <div key={dl.title || dl.name || i} className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-5 transition">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-blue/5 text-brand-blue">
                  <i className="fa-regular fa-file-lines text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{dl.title || dl.name}</h4>
                  <p className="text-[12.5px] text-gray-500">{dl.size || dl.type || ""}</p>
                </div>
              </div>
              {dl.url || dl.link ? (
                <a
                  href={dl.url || dl.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-md bg-brand-blue hover:bg-brand-hover px-5 py-2.5 text-sm font-bold text-white"
                >
                  <i className="fa-solid fa-download"></i>Download
                </a>
              ) : (
                <button className="flex items-center gap-2 rounded-md bg-brand-blue hover:bg-brand-hover px-5 py-2.5 text-sm font-bold text-white">
                  <i className="fa-solid fa-download"></i>Download
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyTabState tabName="downloads" />
      )}
    </div>
  );
}
