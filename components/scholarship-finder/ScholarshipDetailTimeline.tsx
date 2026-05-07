"use client";

import * as LucideIcons from "lucide-react";
import { Calendar } from "lucide-react";

export default function TimelineTab({ events }: { events: { title: string; date: string; desc: string; icon: string }[] }) {
  const items = events.length > 0 ? events : [
    { title: "Application Opens", date: "Ashad 21, 2082 (Saturday)", desc: "Online application portal becomes available for all eligible students", icon: "Calendar" },
    { title: "Application Deadline", date: "Ashad 30, 2082 (Monday) - 11:59 PM", desc: "Last date to submit complete scholarship applications", icon: "Clock" },
    { title: "Entrance Examination", date: "Shrawan 1, 2082 (Thursday) - 9:00 AM", desc: "Exam conducted simultaneously across all provinces", icon: "FileText" },
    { title: "Entrance Exam Result", date: "Shrawan 1, 2082 (Thursday Evening)", desc: "Entrance exam result will be published on official website", icon: "CheckCircle" },
    { title: "Interviews", date: "Shrawan 2 and 3, 2082 (Friday, Saturday)", desc: "Interview of shortlisted candidates will be conducted", icon: "Users" },
    { title: "Final Result Publication", date: "Shrawan 4, 2082 (Sunday Evening)", desc: "Final result will be published on official website", icon: "Award" },
  ];

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
        {items.map((ev, i) => {
          const color = eventColors[i % eventColors.length];
          const Icon = resolveIcon(ev.icon);
          const isLast = i === items.length - 1;
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
