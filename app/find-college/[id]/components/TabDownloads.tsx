"use client";

import React from "react";
import EmptyTabState from "./EmptyTabState";

interface TabDownloadsProps {
  downloads: any[];
}

const TabDownloads: React.FC<TabDownloadsProps> = ({ downloads }) => {
  if (downloads.length === 0) return <EmptyTabState tabName="downloads" />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Downloads</h2>
        <p className="mt-1 text-[14px] text-gray-500">Access brochures, forms, and study materials.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {downloads.map((download: any, i: number) => (
          <div key={download.title || download.name || i} className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-5 transition">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-blue/5 text-brand-blue"><i className="fa-regular fa-file-lines text-xl"></i></div>
              <div>
                <h4 className="font-bold text-gray-900">{download.title || download.name}</h4>
                <p className="text-[12.5px] text-gray-500">{download.size || "Download file"}</p>
              </div>
            </div>
            {download.file ? (
              <a href={download.file} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md bg-brand-blue hover:bg-brand-hover px-5 py-2.5 text-sm font-bold text-white"><i className="fa-solid fa-download"></i>Download</a>
            ) : (
              <button className="flex items-center gap-2 rounded-md bg-brand-blue hover:bg-brand-hover px-5 py-2.5 text-sm font-bold text-white"><i className="fa-solid fa-download"></i>Download</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabDownloads;
