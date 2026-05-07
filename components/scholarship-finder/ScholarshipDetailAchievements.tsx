"use client";

import { ArrowRight, Trophy } from "lucide-react";

export default function AchievementsTab({ items }: { items: any[] }) {
  const data = items.length > 0 ? items : [
    { title: "Successful Scholarship Program 2081", description: "Project Shiksha successfully completed its first batch with 95% of scholarship holders achieving distinction in their +2 examinations.", badge: "Success", tags: ["95% Pass", "85% Distinction"], link: "#" },
    { title: "National Recognition", description: "Received the 'Best Educational Initiative Award 2025' from the Ministry of Education for outstanding contribution.", badge: "Award", tags: ["National Award", "2025"], link: "#" },
    { title: "Student Success Stories", description: "Scholarship recipients securing admissions in prestigious medical and engineering colleges across Nepal.", badge: "Students", tags: ["Medical", "Engineering"], link: "#" },
    { title: "Strategic Partnerships", description: "Built strong collaborations with leading educational institutions, NGOs, and corporate partners nationwide.", badge: "Partners", tags: ["5+ Partners", "Nationwide"], link: "#" },
  ];
  const gradients = ["from-yellow-500 to-yellow-600", "from-blue-500 to-blue-600", "from-green-500 to-green-600", "from-purple-500 to-purple-600"];
  const badgeColors = ["bg-green-50 text-green-600", "bg-yellow-50 text-yellow-600", "bg-green-50 text-green-600", "bg-purple-50 text-purple-600"];
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Our Achievements</h2>
        <p className="mt-1 text-[14px] text-gray-500">Milestones and success stories</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.map((item, i) => (
          <div key={i} className="overflow-hidden rounded-md border border-gray-100 bg-white">
            <div className="p-4 pb-0">
              <div className={`flex h-40 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br ${gradients[i % gradients.length]}`}>
                <Trophy size={80} className="text-white/90" />
              </div>
            </div>
            <div className="p-5">
              <div className="mb-3">
                <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${badgeColors[i % badgeColors.length]}`}>{item.badge || "Achievement"}</span>
              </div>
              <h3 className="mb-2 text-[16px] font-bold text-gray-900">{item.title}</h3>
              <p className="mb-4 text-[13px] text-gray-600 line-clamp-2">{item.description}</p>
              {Array.isArray(item.tags) && item.tags.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag: string, j: number) => (
                    <span key={j} className="rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">{tag}</span>
                  ))}
                </div>
                {item.link && <a href={item.link} className="flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-700">Read More <ArrowRight size={16} /></a>}
              </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
