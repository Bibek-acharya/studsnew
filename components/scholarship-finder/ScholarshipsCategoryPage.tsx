"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api";
import ScholarshipListCard, { ScholarshipCardItem } from "./ScholarshipListCard";
import ScholarshipApplicationPage from "./ScholarshipApplicationPage";

interface ScholarshipCategoryPageProps {
  onNavigate: (view: any, data?: any) => void;
  initialCategory?: string;
}

type ApplicationSelection = {
  id: string;
  scholarshipName: string;
  scholarshipType: string;
};

type CategoryItem = {
  id: string;
  name: string;
  count: number;
};

const defaultCategories: CategoryItem[] = [
  { id: "college", name: "College Based", count: 150 },
  { id: "school", name: "School Based", count: 85 },
  { id: "institutional", name: "Institutional", count: 210 },
  { id: "entrance", name: "Entrance", count: 45 },
  { id: "ngo", name: "NGO / INGO", count: 60 },
  { id: "merit", name: "Merit Based", count: 340 },
  { id: "need", name: "Need Based", count: 190 },
  { id: "research", name: "Research", count: 55 },
];

const fallbackScholarships: ScholarshipCardItem[] = [
  {
    id: 1,
    title: "National IT Excellence Scholarship (BSc. CSIT)",
    provider: "Tribhuvan University, Nepal",
    type: "Merit-Based",
    status: "OPEN",
    amount: "100% Tuition",
    location: "Bagmati",
    eligibility: "Bachelor (+2 Sci: 2.8+ GPA)",
    deadline: "Aug 15, 2026",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    verified: true,
  }
];

const ScholarshipsCategoryPage: React.FC<ScholarshipCategoryPageProps> = ({ onNavigate, initialCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "college");
  const [bookmarkedScholarships, setBookmarkedScholarships] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Closing Soonest");

  const [selectedEducationLevels, setSelectedEducationLevels] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedFundingTypes, setSelectedFundingTypes] = useState<string[]>([]);
  const [selectedProviderTypes, setSelectedProviderTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDeadlines, setSelectedDeadlines] = useState<string[]>([]);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationSelection, setApplicationSelection] = useState<ApplicationSelection | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const { data: scholarshipsResponse } = useQuery({
    queryKey: [
      "education-scholarships",
      selectedCategory,
      sortBy,
      selectedEducationLevels,
      selectedFields,
      selectedFundingTypes,
      selectedProviderTypes,
      selectedLocations,
      selectedDeadlines,
    ],
    queryFn: () =>
      apiService.getEducationScholarships({
        category: selectedCategory,
        sort: sortBy === "Closing Soonest" ? "deadline" : "amount",
      }),
  });

  const categories = useMemo(() => {
    const apiCats = scholarshipsResponse?.data?.categories;
    return apiCats?.length ? apiCats.map((c: any) => ({
      id: String(c.id || c.name).toLowerCase().replace(/\s+/g, "-"),
      name: c.name || "General",
      count: c.count || 0
    })) : defaultCategories;
  }, [scholarshipsResponse]);

  const mappedScholarships = useMemo<ScholarshipCardItem[]>(() => {
    const list = scholarshipsResponse?.data?.scholarships;
    if (!list?.length) return fallbackScholarships;
    return list.map((item: any) => ({
      id: item.id || Math.random(),
      title: item.title,
      provider: item.provider,
      type: item.type,
      status: item.status,
      amount: item.amount,
      location: item.location,
      eligibility: item.eligibility,
      deadline: item.deadline,
      image: item.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
      verified: item.verified !== false,
    }));
  }, [scholarshipsResponse]);

  const filteredScholarships = useMemo(() => {
    let list = [...mappedScholarships];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.title.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q));
    }
    if (verifiedOnly) list = list.filter(s => s.verified);
    return list;
  }, [mappedScholarships, searchQuery, verifiedOnly]);

  const toggleMultiSelect = (val: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const toggleBookmark = (id: number) => {
    setBookmarkedScholarships(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-12">
      <div className="mx-auto w-full max-w-[90rem] px-4 pt-8 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Scholarships actively opening</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat: CategoryItem) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-none w-48 p-4 rounded-2xl border-2 transition-all ${
                selectedCategory === cat.id ? "border-blue-600 bg-white shadow-lg" : "border-slate-200 bg-white hover:border-blue-200"
              }`}
            >
              <h3 className="font-bold text-slate-900">{cat.name}</h3>
              <p className="text-sm text-blue-600 mt-1">{cat.count} Openings</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-[90rem] gap-8 px-4 mt-8 lg:px-8">
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Filters</h3>
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border rounded-lg mb-4"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <label className="flex items-center gap-2 mb-4">
              <input type="checkbox" onChange={(e) => setVerifiedOnly(e.target.checked)} />
              <span className="text-sm">Verified Only</span>
            </label>
            {/* Add more filter sections as needed */}
          </div>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredScholarships.map(s => (
              <ScholarshipListCard
                key={s.id}
                item={s}
                isBookmarked={bookmarkedScholarships.includes(s.id)}
                onToggleBookmark={toggleBookmark}
                onDetails={(id) => onNavigate("scholarshipHubDetails", { id: id.toString() })}
                onApply={(id, title, type) => {
                  setApplicationSelection({ id: id.toString(), scholarshipName: title, scholarshipType: type });
                  setIsApplicationModalOpen(true);
                }}
              />
            ))}
          </div>
        </main>
      </div>

      {isApplicationModalOpen && applicationSelection && (
        <ScholarshipApplicationPage
          onClose={() => setIsApplicationModalOpen(false)}
          scholarshipId={applicationSelection.id}
          scholarshipName={applicationSelection.scholarshipName}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default ScholarshipsCategoryPage;
