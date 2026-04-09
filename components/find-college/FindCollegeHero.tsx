import React from "react";

interface FindCollegeHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: "all" | "plustwo" | "bachelor" | "master";
  onTabChange: (tab: "all" | "plustwo" | "bachelor" | "master") => void;
}

const FindCollegeHero: React.FC<FindCollegeHeroProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
}) => {
  const tabs: Array<{
    key: "all" | "plustwo" | "bachelor" | "master";
    label: string;
  }> = [
    { key: "all", label: "All" },
    { key: "plustwo", label: "Plus Two (+2)" },
    { key: "bachelor", label: "Bachelor" },
    { key: "master", label: "Master" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="border-b border-gray-200 bg-white px-1 pt-10 pb-6 md:px-2 mb-8">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Explore Programs</h1>
        <p className="mb-6 max-w-2xl text-base text-gray-500">
          Discover the perfect course to advance your career and academic journey.
        </p>

        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-[#3b82f6] bg-[#3b82f6] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:hidden">
            <svg
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search courses, colleges..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default FindCollegeHero;
