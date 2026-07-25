"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";

interface EventData {
  id: number;
  slug?: string;
  title: string;
  image?: string;
  category?: string;
  organizer?: string;
  location?: string;
  excerpt?: string;
  date?: string;
}

interface EventCardProps {
  event: EventData;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: number) => void;
}

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
  if (c.includes("conference") || c.includes("conf")) return "conference";
  if (
    c.includes("competition") ||
    c.includes("contest") ||
    c.includes("hackathon")
  )
    return "competition";
  return "default";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

export function EventCard({
  event,
  isBookmarked = false,
  onToggleBookmark,
}: EventCardProps) {
  const mapped = mapCategory(event.category);

  return (
    <article className="bg-white rounded-md border border-gray-200 hover:border-blue-500/20 overflow-hidden flex flex-col duration-300 cursor-pointer h-full">
      <div className="h-35 w-full overflow-hidden p-4">
        <img
          src={event.image || "/placeholder.jpg"}
          alt={event.title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-center mb-3">
          <span
            className={`${categoryColors[mapped] || categoryColors.default} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}
          >
            {mapped}
          </span>
          <span className="flex items-center text-xs text-gray-500 font-semibold">
            <i className="fa-regular fa-calendar mr-1.5"></i>{" "}
            {event.date || "TBD"}
          </span>
        </div>

        <Link
          href={`/events/${event.slug || event.id}`}
          className="font-bold text-lg mb-3 leading-tight text-left text-black hover:text-brand-blue"
        >
          {event.title}
        </Link>

        <div className="flex items-center text-xs text-gray-600 mb-2 font-semibold">
          <i className="fa-regular fa-building mr-2 text-gray-500"></i>{" "}
          {event.organizer}
        </div>
        <div className="flex items-center text-xs text-gray-600 mb-3 font-semibold">
          <i className="fa-solid fa-location-dot mr-2 text-gray-500"></i>{" "}
          {event.location || "Online"}
        </div>

        <p className="text-xs text-gray-500 mb-5 line-clamp-3 leading-relaxed font-medium">
          {stripHtml(event.excerpt || "")}
        </p>

        <div className="mt-auto flex gap-2">
          <Link
            href={`/events/${event.slug || event.id}`}
            className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2 rounded-md hover:bg-gray-50 transition text-center"
          >
            Details
          </Link>
          <button className="flex-1 text-white text-sm font-bold py-2 rounded-md transition bg-brand-blue cursor-pointer hover:bg-brand-hover">
            Register Now
          </button>
          <button
            className={`w-10 flex items-center justify-center border rounded-md transition-colors shrink-0 ${isBookmarked ? "border-blue-200 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
            onClick={() => onToggleBookmark?.(event.id)}
          >
            <Bookmark
              className={`w-4 h-4 transition-all ${isBookmarked ? "text-brand-blue fill-brand-blue" : "text-gray-400"}`}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
