"use client";

import * as LucideIcons from "lucide-react";
import { Calendar } from "lucide-react";

export default function TimelineTab({ events }: { events: { title: string; date: string; desc: string; icon: string }[] }) {
  if (events.length === 0) return null;

  const resolveIcon = (name: string) => {
    if (!name) return Calendar;
    const Icon = (LucideIcons as any)[name];
    return Icon || Calendar;
  };

  const eventColors = ["bg-blue-600", "bg-blue-600", "bg-green-600", "bg-orange-600", "bg-purple-600", "bg-red-600"];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Key Dates & Timeline</h2>
        <p className="mt-1 text-[14px] text-gray-500">Important dates for this scholarship</p>
      </div>
      <div className="space-y-4">
        {events.map((ev, i) => {
          const color = eventColors[i % eventColors.length];
          const Icon = resolveIcon(ev.icon);
          const isLast = i === events.length - 1;
          return (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${color} text-white`}><Icon size={16} /></div>
              {!isLast && <div className="mt-2 w-0.5 flex-1 bg-gray-200" />}
            </div>
            <div className={`${!isLast ? "pb-6" : ""}`}>
              <h3 className="text-[15px] font-bold text-gray-900">{ev.title}</h3>
              <p className={`text-[13px] font-semibold ${color.replace("bg-", "text-")}`}>{ev.date}</p>
              <p className="mt-1 text-[13px] text-gray-600">{ev.desc}</p>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
