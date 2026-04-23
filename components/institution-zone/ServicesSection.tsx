"use client";

import React from "react";
import {
  ListCheck,
  ClipboardList,
  Building2,
  Megaphone,
  UserPlus,
  Rocket,
  Globe,
  LineChart,
  MessageSquare,
  Newspaper,
  Star,
} from "lucide-react";

interface Service {
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  blob: string;
}

const SERVICES: Service[] = [
  {
    title: "Application Tracking",
    desc: "Streamline and monitor student applications.",
    icon: ListCheck,
    color: "bg-blue-50 text-blue-800",
    blob: "bg-blue-100/50",
  },
  {
    title: "Query Management",
    desc: "Efficiently handle student inquiries.",
    icon: ClipboardList,
    color: "bg-orange-50 text-orange-400",
    blob: "bg-orange-100/50",
  },
  {
    title: "Profile & Listing Control",
    desc: "Showcase key information.",
    icon: Building2,
    color: "bg-purple-50 text-purple-600",
    blob: "bg-purple-100/50",
  },
  {
    title: "Featured Promotions",
    desc: "Highlight your best programs.",
    icon: Megaphone,
    color: "bg-emerald-50 text-emerald-400",
    blob: "bg-emerald-100/50",
  },
  {
    title: "Student Lead Generation",
    desc: "Attract high-quality leads.",
    icon: UserPlus,
    color: "bg-red-50 text-red-500",
    blob: "bg-red-100/50",
  },
  {
    title: "Admission Campaigns",
    desc: "Launch targeted campaigns.",
    icon: Rocket,
    color: "bg-lime-50 text-lime-500",
    blob: "bg-lime-100/50",
  },
  {
    title: "Virtual Admission Fair",
    desc: "Connect globally.",
    icon: Globe,
    color: "bg-blue-50 text-blue-500",
    blob: "bg-blue-100/50",
  },
  {
    title: "Analytics Dashboard",
    desc: "Insights into profile views.",
    icon: LineChart,
    color: "bg-orange-50 text-orange-500",
    blob: "bg-orange-100/50",
  },
  {
    title: "Reviews & Ratings",
    desc: "Authentic feedback.",
    icon: Star,
    color: "bg-purple-50 text-purple-500",
    blob: "bg-purple-100/50",
  },
  {
    title: "Direct Chat",
    desc: "Engage in real time.",
    icon: MessageSquare,
    color: "bg-emerald-50 text-emerald-500",
    blob: "bg-emerald-100/50",
  },
  {
    title: "Content Marketing",
    desc: "Publish news and updates.",
    icon: Newspaper,
    color: "bg-red-50 text-red-500",
    blob: "bg-red-100/50",
  },
];

interface ServicesSectionProps {
  className?: string;
}

export default function ServicesSection({ className }: ServicesSectionProps) {
  return (
    <section id="services" className={`py-24 px-6 lg:px-8 max-w-350 mx-auto ${className || ""}`}>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          Our Service Area
        </h2>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto font-medium">
          Discover our comprehensive suite of services designed to streamline
          admissions, elevate your institution&apos;s profile, and boost
          student engagement.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {SERVICES.map((s, i) => (
          <div
            key={i}
            className="group bg-white rounded-md p-8 border border-gray-200"
          >
            <div className="relative w-16 h-16 mb-6">
              <div
                className={`absolute top-0 right-2 w-10 h-10 ${s.blob} rounded-full transition-transform group-hover:scale-110`}
              ></div>
              <div
                className={`relative z-10 flex items-center justify-center w-full h-full text-3xl ${s.color.split(" ")[1]}`}
              >
                <s.icon strokeWidth={2.5} className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-3 text-slate-900">
              {s.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}