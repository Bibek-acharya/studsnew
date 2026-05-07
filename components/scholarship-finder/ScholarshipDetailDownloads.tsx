"use client";

import { FileText } from "lucide-react";

export default function DownloadsTab({ items, getImageUrl }: { items: any[]; getImageUrl: (url: string) => string }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Downloads</h2>
        <p className="mt-1 text-[14px] text-gray-500">Downloadable documents and resources</p>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between rounded-md border border-gray-100 bg-white p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">{item.title || `Document ${i + 1}`}</h3>
                {item.description && <p className="mt-0.5 text-[13px] text-gray-500">{item.description}</p>}
              </div>
            </div>
            <a
              href={getImageUrl(item.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-[13px] font-bold text-white transition hover:bg-blue-700"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
