"use client";

import { useState } from "react";

interface Filters {
  stream: string[];
  location: { province: string; district: string; city: string };
  fee: number;
  collegeType: string[];
  scholarship: string[];
  facilities: string[];
  sortBy: string;
  directAdmission: boolean;
}

interface AdmissionFiltersProps {
  onFilterChange?: (filters: Filters) => void;
}

const rawLocationData: Record<string, Record<string, string[]>> = {
  Bagmati: {
    Kathmandu: ["Kathmandu Metropolitan", "Kirtipur", "Gokarneshwor", "Budhanilkantha", "Tarakeshwar", "Nagarjun", "Chandragiri"],
    Lalitpur: ["Lalitpur Metropolitan", "Godawari", "Mahalaxmi"],
    Bhaktapur: ["Bhaktapur Municipality", "Madhyapur Thimi", "Suryabinayak", "Changunarayan"],
    Chitwan: ["Bharatpur", "Ratnanagar", "Rapti", "Khairahani"],
  },
  Koshi: {
    Morang: ["Biratnagar", "Urlabari", "Belbari", "Pathari"],
    Sunsari: ["Dharan", "Itahari", "Inaruwa", "Duhabi"],
    Jhapa: ["Birtamod", "Damak", "Bhadrapur", "Mechinagar"],
  },
  Gandaki: {
    Kaski: ["Pokhara", "Annapurna", "Machhapuchchhre"],
    Tanahun: ["Vyas", "Bhanu", "Shuklagandaki"],
    Gorkha: ["Gorkha Municipality", "Palungtar"],
  },
  Lumbini: {
    Rupandehi: ["Butwal", "Siddharthanagar", "Tillotama"],
    Dang: ["Ghorahi", "Tulsipur"],
    Banke: ["Nepalgunj", "Kohalpur"],
  },
  Madhesh: {
    Dhanusha: ["Janakpur", "Mithila"],
    Parsa: ["Birgunj", "Pokhariya"],
  },
  Karnali: {
    Surkhet: ["Birendranagar", "Bheriganga"],
    Jumla: ["Chandannath"],
  },
  Sudurpashchim: {
    Kailali: ["Dhangadhi", "Tikapur"],
    Kanchanpur: ["Bhimdatta", "Punarwas"],
  },
};

const streamOptions = ["Science", "Management", "Humanities", "Education", "Law"];

const filtersConfig = [
  { id: "stream", label: "Stream", options: streamOptions },
  { id: "location", label: "Location", custom: true },
  { id: "fee", label: "Fee Range", custom: true },
  { id: "type", label: "College Type", options: ["Private College", "Community College", "Government College"] },
  { id: "scholarship", label: "Scholarship", options: ["Entrance Scholarship", "Merit Scholarship", "Need-based Scholarship"] },
  { id: "facilities", label: "Facilities", options: ["AC Classrooms", "Digital Library", "Sports Complex", "Wi-Fi Campus", "Hostel Available", "Cafeteria"] },
  { id: "sort", label: "Sort By", type: "radio", options: ["Popularity", "Rating: High to Low", "Fee: Low to High", "Fee: High to Low"] },
];

export default function AdmissionFilters({ onFilterChange }: AdmissionFiltersProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ stream: true });
  const [filters, setFilters] = useState<Filters>({
    stream: [],
    location: { province: "", district: "", city: "" },
    fee: 500000,
    collegeType: [],
    scholarship: [],
    facilities: [],
    sortBy: "Popularity",
    directAdmission: false,
  });
  const [showModal, setShowModal] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCheckbox = (filterId: keyof Filters, value: string) => {
    setFilters((prev) => {
      const current = prev[filterId] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const newFilters = { ...prev, [filterId]: updated };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const setRadio = (filterId: keyof Filters, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [filterId]: value };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const updateLocation = (key: "province" | "district" | "city", value: string) => {
    setFilters((prev) => {
      const newLocation = { ...prev.location, [key]: value };
      if (key === "province") {
        newLocation.district = "";
        newLocation.city = "";
      } else if (key === "district") {
        newLocation.city = "";
      }
      const newFilters = { ...prev, location: newLocation };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const updateFee = (value: number) => {
    setFilters((prev) => {
      const newFilters = { ...prev, fee: value };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      stream: [],
      location: { province: "", district: "", city: "" },
      fee: 500000,
      collegeType: [],
      scholarship: [],
      facilities: [],
      sortBy: "Popularity",
      directAdmission: false,
    });
    onFilterChange?.({
      stream: [],
      location: { province: "", district: "", city: "" },
      fee: 500000,
      collegeType: [],
      scholarship: [],
      facilities: [],
      sortBy: "Popularity",
      directAdmission: false,
    });
  };

  const formatFee = (val: number) => {
    if (val >= 1000000) return "NPR 10,00,000+";
    if (val === 0) return "Free / No Fee";
    return "NPR " + val.toLocaleString("en-IN");
  };

  return (
    <>
      <aside className="w-full md:w-[320px] lg:w-[340px] flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-24">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Filters</h2>
          </div>
          <button onClick={resetFilters} className="text-[#2563eb] font-bold text-sm hover:text-[#1d4ed8] transition-colors">
            Reset
          </button>
        </div>

        {/* Detect Location Button */}
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe] hover:text-[#1d4ed8] rounded-lg transition-colors font-semibold text-sm mb-2 border border-[#dbeafe] shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Detect Location
        </button>

        {/* Filter Categories */}
        <div className="flex flex-col">
          {filtersConfig.map((filter, index) => {
            const isLastItem = index === filtersConfig.length - 1;
            const isOpen = openSections[filter.id] || false;

            return (
              <div key={filter.id} className={`${isLastItem ? "" : "border-b border-gray-100"}`}>
                <div
                  onClick={() => toggleSection(filter.id)}
                  className="filter-header flex justify-between items-center py-4 cursor-pointer transition-colors"
                >
                  <span className={`text-[15px] font-semibold transition-colors select-none ${isOpen ? "text-[#2563eb]" : "text-slate-700"}`}>
                    {filter.label}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${isOpen ? "rotate-180 text-[#2563eb]" : "text-slate-400"}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[400px] opacity-100 pb-4 pt-2" : "max-h-0 opacity-0"}`}
                >
                  {/* Location Filter */}
                  {filter.custom && filter.id === "location" && (
                    <div className="flex flex-col gap-3 px-1">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Province</label>
                        <select
                          value={filters.location.province}
                          onChange={(e) => updateLocation("province", e.target.value)}
                          className="w-full text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] p-2.5 bg-white text-slate-700 outline-none transition-all cursor-pointer hover:border-gray-300"
                        >
                          <option value="">Select Province</option>
                          {Object.keys(rawLocationData).map((prov) => (
                            <option key={prov} value={prov}>{prov}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">District</label>
                        <select
                          value={filters.location.district}
                          onChange={(e) => updateLocation("district", e.target.value)}
                          disabled={!filters.location.province}
                          className="w-full text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] p-2.5 bg-slate-50 text-slate-700 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <option value="">Select District</option>
                          {filters.location.province &&
                            rawLocationData[filters.location.province] &&
                            Object.keys(rawLocationData[filters.location.province]).map((dist) => (
                              <option key={dist} value={dist}>{dist}</option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">City</label>
                        <select
                          value={filters.location.city}
                          onChange={(e) => updateLocation("city", e.target.value)}
                          disabled={!filters.location.district}
                          className="w-full text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] p-2.5 bg-slate-50 text-slate-700 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <option value="">Select City</option>
                          {filters.location.province &&
                            filters.location.district &&
                            rawLocationData[filters.location.province]?.[filters.location.district]?.map((city) => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Fee Range Filter */}
                  {filter.custom && filter.id === "fee" && (
                    <div className="px-1 py-2">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-slate-500 font-medium">Max Fee:</span>
                        <span className="text-sm font-bold text-[#2563eb]">{formatFee(filters.fee)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000000"
                        step="50000"
                        value={filters.fee}
                        onChange={(e) => updateFee(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
                        <span>0</span>
                        <span>10L+</span>
                      </div>
                    </div>
                  )}

                  {/* Radio (Sort By) */}
                  {filter.type === "radio" && (
                    <div className="flex flex-col gap-2.5 px-1 pb-1">
                      {filter.options?.map((opt, i) => (
                        <label key={opt} className="flex items-start gap-3 cursor-pointer group">
                          <div className="relative flex items-center pt-0.5">
                            <input
                              type="radio"
                              name={filter.id}
                              value={opt}
                              checked={filters.sortBy === opt}
                              onChange={() => setRadio("sortBy", opt)}
                              className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 bg-white transition-all checked:border-[#2563eb] checked:border-[5px] hover:border-[#2563eb] focus:outline-none"
                            />
                          </div>
                          <span className="text-slate-600 group-hover:text-[#1d4ed8] transition-colors leading-tight">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Checkboxes */}
                  {!filter.custom && filter.type !== "radio" && filter.options && (
                    <div className="flex flex-col gap-2.5 px-1">
                      {filter.options.map((opt) => {
                        const key = filter.id === "stream" ? "stream" : filter.id === "type" ? "collegeType" : filter.id === "scholarship" ? "scholarship" : "facilities";
                        const current = filters[key] as string[];
                        const isChecked = current.includes(opt);
                        return (
                          <label key={opt} className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-center pt-0.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleCheckbox(key, opt)}
                                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 bg-white transition-all checked:border-[#2563eb] checked:bg-[#2563eb] hover:border-[#2563eb] focus:outline-none"
                              />
                              <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-[2px] h-3 w-3 pointer-events-none opacity-0 text-white peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <span className="text-slate-600 group-hover:text-[#1d4ed8] transition-colors leading-tight">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct Admission Toggle */}
        <div className="mt-2 pt-5 border-t border-gray-100">
          <div className="flex flex-col gap-2 w-full">
            <div className="bg-[#f2f2f2] py-2 px-3 rounded-lg flex items-center justify-between transition-colors duration-300 w-full">
              <span className="text-sm font-semibold text-[#1f304a] whitespace-nowrap">
                Get college direct admission
              </span>
              <label className="relative inline-block w-11 h-6 flex-shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.directAdmission}
                  onChange={(e) => {
                    setFilters((prev) => {
                      const newFilters = { ...prev, directAdmission: e.target.checked };
                      onFilterChange?.(newFilters);
                      return newFilters;
                    });
                  }}
                  className="opacity-0 w-0 h-0"
                />
                <span className={`absolute inset-0 rounded-[34px] transition-all duration-300 ${filters.directAdmission ? "bg-[#0f7b1c]" : "bg-[#8a949b]"}`}>
                  <span className={`absolute h-[18px] w-[18px] left-[3px] bottom-[3px] bg-white rounded-full shadow transition-all duration-300 ${filters.directAdmission ? "translate-x-[20px]" : ""}`} />
                </span>
              </label>
            </div>
            <div className="flex justify-end w-full px-1">
              <button
                onClick={() => setShowModal(true)}
                className="text-[#4a5dc9] text-xs hover:underline flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                How it works?
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden relative flex flex-col p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-900 transition-colors bg-white rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6 mt-2 md:mt-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">How does College Direct Admission work?</h2>
            </div>

            {/* Steps */}
            <div className="relative flex flex-col md:flex-row justify-between w-full mx-auto mb-6 gap-y-6 md:gap-y-0 md:gap-x-3">
              <div className="absolute top-[48px] left-[10%] right-[10%] h-[2px] bg-gray-200 z-0 hidden md:block" />
              <div className="absolute left-[40px] top-[40px] bottom-[40px] w-[2px] bg-gray-200 z-0 md:hidden" />

              {[
                { step: "1", title: "Create Profile", desc: "Build your academic profile in minutes by entering your SEE/+2 results, preferred faculty, and location. No complex paperwork required.", img: "https://i.pinimg.com/1200x/8d/94/a9/8d94a9ab7d4cae915dcecd7cfe10484d.jpg" },
                { step: "2", title: "Get Matched", desc: "Our smart system instantly connects you with colleges and programs where you are eligible for direct admission based on your marks, stream, and preferences.", img: "https://i.pinimg.com/1200x/77/26/ec/7726ecf44da329c20c215fca1982a5f9.jpg" },
                { step: "3", title: "Compare & Choose", desc: "Explore matched colleges, compare fees, facilities, scholarships, and locations — then choose the program that fits you best.", img: "https://i.pinimg.com/1200x/6b/14/ee/6b14ee22b8589497cd6cfcba2420af7f.jpg" },
                { step: "4", title: "Apply Instantly", desc: "Send your application directly to the college with one click. No need to visit multiple campuses.", img: "https://i.pinimg.com/1200x/f9/90/34/f99034c1ff77e20f8b97347bf96171df.jpg" },
                { step: "5", title: "Confirm Admission", desc: "Get quick confirmation from the college and secure your seat before it fills.", img: "https://i.pinimg.com/736x/61/9f/b2/619fb264043785065fc11519f5897cbb.jpg" },
              ].map((item, i) => (
                <div key={i} className="flex flex-row md:flex-col items-center flex-1 relative z-10 px-1 gap-4 md:gap-2">
                  <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0 z-10 hover:-translate-y-0.5 transition-transform overflow-hidden bg-white">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="text-left md:text-center flex-1">
                    <h4 className="font-bold text-gray-900 text-[13px] md:text-sm mb-1">{item.step}. {item.title}</h4>
                    <p className="text-gray-500 text-[11px] md:text-xs leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-2 bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 w-full mx-auto shadow-sm">
              <div className="flex-1 w-full order-2 md:order-1">
                <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-1">Complete your profile now</h3>
                <p className="text-gray-500 text-xs md:text-sm mb-4">You are just a few steps away from unlocking direct admission matches.</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                  <div className="flex items-center gap-3 w-full sm:max-w-[180px]">
                    <div className="w-full bg-indigo-100/80 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "40%" }} />
                    </div>
                    <span className="text-xs font-bold text-indigo-700">40%</span>
                  </div>
                  <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-5 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap">
                    Get direct admission
                  </button>
                </div>
              </div>
              <div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 order-1 md:order-2 flex items-center justify-center">
                <img src="https://i.pinimg.com/1200x/c0/a7/68/c0a7688c3212fe6d63227c3f23ce060a.jpg" alt="Profile Illustration" className="w-full h-full object-cover mix-blend-multiply" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
