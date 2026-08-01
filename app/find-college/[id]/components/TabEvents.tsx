"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RichText from "@/components/RichText";
import EmptyTabState from "./EmptyTabState";

interface TabEventsProps {
  events: any[];
  page: number;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 9;

const TabEvents: React.FC<TabEventsProps> = ({
  events,
  page,
  onPageChange,
}) => {
  const router = useRouter();

  if (events.length === 0) return <EmptyTabState tabName="events" />;

  const paginated = events.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">
          Events &amp; Activities
        </h2>
        <p className="mt-1 text-[14px] text-gray-500">
          Happening around the campus – join the vibe.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.map((event) => (
          <article
            key={event.id || event.title}
            className="bg-white rounded-md border border-gray-200 hover:border-blue-500/20 overflow-hidden flex flex-col duration-300 cursor-pointer"
          >
            <div className="h-35 w-full overflow-hidden p-4 bg-brand-blue rounded-md">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : null}
            </div>
            <div className="p-5 flex flex-col grow">
              <div className="flex justify-between items-center mb-3">
                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Event
                </span>
                <span className="flex items-center text-xs text-gray-500 font-semibold">
                  <i className="fa-regular fa-calendar mr-1.5"></i>{" "}
                  {event.date.split(" | ")[0]}
                </span>
              </div>
              <h4 className="font-bold text-lg mb-3 leading-tight text-gray-900">
                {event.title}
              </h4>
              <div className="flex items-center text-xs text-gray-600 mb-2 font-semibold">
                <i className="fa-solid fa-location-dot mr-2 text-gray-500"></i>{" "}
                {event.date.split(" | ")[1] || "TBD"}
              </div>
              <RichText
                html={event.desc}
                variant="sm"
                className="text-xs text-gray-500 mb-5 line-clamp-3 leading-relaxed font-medium"
              />
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => router.push(`/events/inst-${event.id}`)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2 rounded-md hover:bg-gray-50 transition text-center"
                >
                  Details
                </button>
                <button className="flex-1 text-white text-sm font-bold py-2 rounded-md transition bg-brand-blue cursor-pointer hover:bg-blue-600">
                  Register
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`h-10 w-10 rounded-md text-sm font-bold transition ${page === idx + 1 ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              onClick={() => onPageChange(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabEvents;
