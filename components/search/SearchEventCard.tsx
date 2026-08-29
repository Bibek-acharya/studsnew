"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { SearchResult } from "./types";

const categoryColors: Record<string, string> = {
  workshop: "bg-orange-500",
  seminar: "bg-blue-500",
  webinar: "bg-purple-500",
  conference: "bg-green-500",
  competition: "bg-pink-500",
  default: "bg-gray-500",
};

function mapCategory(cat?: string): string {
  if (!cat) return "default";
  const c = cat.toLowerCase();
  if (c.includes("workshop")) return "workshop";
  if (c.includes("seminar")) return "seminar";
  if (c.includes("webinar")) return "webinar";
  if (c.includes("conference")) return "conference";
  if (c.includes("competition") || c.includes("hackathon")) return "competition";
  return "default";
}

export default function SearchEventCard({ item }: { item: SearchResult }) {
  const slug = item.slug || String(item.id);
  const mapped = mapCategory(item.institutionType);

  return (
    <article className="bg-white rounded-md border border-gray-200 hover:border-blue-500/20 overflow-hidden flex flex-col duration-300 h-full">
      <div className="h-35 w-full overflow-hidden p-4">
        <img src={item.image || "/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover rounded-md" />
      </div>
      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-center mb-3">
          <span className={`${categoryColors[mapped] || categoryColors.default} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}>
            {item.institutionType || "Event"}
          </span>
        </div>
        <Link href={`/events/${slug}`} className="font-bold text-lg mb-3 leading-tight text-left text-black hover:text-blue-600">
          {item.title}
        </Link>
        {item.location && (
          <div className="flex items-center text-xs text-gray-600 mb-3 font-semibold">
            <MapPin className="w-3.5 h-3.5 mr-2 text-gray-500" />
            {item.location}
          </div>
        )}
        {item.description && (
          <p className="text-xs text-gray-500 mb-5 line-clamp-3 leading-relaxed font-medium">
            {item.description.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()}
          </p>
        )}
        <div className="mt-auto flex gap-2">
          <Link href={`/events/${slug}`} className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2 rounded-md hover:bg-gray-50 transition text-center">
            Details
          </Link>
          <button className="flex-1 text-white text-sm font-bold py-2 rounded-md transition bg-[#0000ff] hover:bg-[#0000cc]">
            Register
          </button>
        </div>
      </div>
    </article>
  );
}
