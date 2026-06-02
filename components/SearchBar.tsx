"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { suggestionCategoryMap, categoryMap } from "@/utils/searchDatabase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const defaultSuggestions = [
  { text: "College" },
  { text: "Entrance" },
  { text: "Scholarship" },
  { text: "Events" },
  { text: "News" },
  { text: "Blogs" },
  { text: "Reviews" },
];

export const SearchBar: React.FC<{
  isMobile?: boolean;
  defaultSearchOpen?: boolean;
  showSuggestionDropdown?: boolean;
  onQueryStateChange?: (query: string, suggestions: { title: string; type: string }[]) => void;
}> = ({
  isMobile,
  defaultSearchOpen = false,
  showSuggestionDropdown = true,
  onQueryStateChange,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(defaultSearchOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("colleges");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{ title: string; type: string }[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categoryOptions = [
    { value: "colleges", label: "Colleges" },
    { value: "courses", label: "Courses" },
    { value: "admission", label: "Admission" },
    { value: "events", label: "Events" },
    { value: "news", label: "News" },
    { value: "blogs", label: "Blogs" },
    { value: "entrance", label: "Entrance" },
  ];

  const selectedLabel = categoryOptions.find((o) => o.value === searchCategory)?.label || "Colleges";

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const query = searchQuery.trim();
    if (!query) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }
    const local = defaultSuggestions.filter((s) => s.text.toLowerCase().includes(query.toLowerCase()));
    if (local.length > 0) {
      setSuggestions(local.map((s) => ({ title: s.text, type: "suggestion" })));
    }
    setIsLoadingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/search?q=${encodeURIComponent(query)}&cat=${searchCategory}&limit=5`, { credentials: "include" });
        const json = await res.json();
        if (json.success && json.data?.items) {
          setSuggestions(json.data.items.map((item: any) => ({ title: item.title, type: item.type })));
        }
      } catch {
        // ignore, keep local results
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 200);
  }, [searchQuery, searchCategory]);

  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!defaultSearchOpen) return;
    requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [defaultSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }

    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchOpen(true);
    onQueryStateChange?.(query, []);
  };

  const handleSearchExecute = (query: string) => {
    if (!query || query.trim() === "") return;
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}&cat=${searchCategory}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchExecute(searchQuery);
    }
  };

  const handleDropdownItemClick = (text: string) => {
    setSearchQuery(text);
    setIsSearchOpen(false);

    const category = suggestionCategoryMap[text] || categoryMap[text.toLowerCase()] || null;
    const cat = category ? `&cat=${category}` : "";
    const query = `/search?q=${encodeURIComponent(text)}${cat}`;
    router.push(query);
  };

  const renderDropdown = () => {
    const query = searchQuery.trim();

    if (query.length === 0) {
      return (
        <>
          {defaultSuggestions.map((item, idx) => (
            <div
              key={idx}
              className="search-item flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleDropdownItemClick(item.text)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="text-[15px] text-gray-700">{item.text}</span>
            </div>
          ))}
        </>
      );
    }

    if (suggestions.length > 0) {
      return (
        <>
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className={`search-item flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors ${isLoadingSuggestions ? "opacity-60" : ""}`}
              onClick={() => handleDropdownItemClick(item.title)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="text-[15px] text-gray-700">{item.title}</span>
              <span className="ml-auto text-[12px] text-gray-400 capitalize">{item.type}</span>
            </div>
          ))}
        </>
      );
    }

    return (
      <div className="px-6 py-4 text-[14px] text-gray-500 text-center">
        No suggestions found for &quot;{query}&quot;
      </div>
    );
  };

  return (
    <div className={isMobile ? "w-full" : "hidden max-w-480 flex-1 md:block"}>
      <div className="group relative flex h-10 w-full items-center overflow-visible rounded-full border border-gray-300 bg-white transition-all focus-within:border-gray-400 focus-within:shadow-sm sm:h-11.5" ref={searchContainerRef}>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          onKeyDown={handleKeyDown}
          onClick={() => {
            setIsSearchOpen(true);
          }}
          placeholder={isMobile ? "Search for courses, exams, scholarships..." : "Search for courses, exams, scholarships..."}
          className="flex-1 bg-transparent border-none py-3.5 pl-5 pr-2 text-[15px] text-gray-800 placeholder-[#6b7280] focus:outline-none focus:ring-0"
          autoComplete="off"
        />

        <div className="flex items-center shrink-0 pr-[6px]">
          <div className="relative hidden sm:block pr-4" ref={categoryRef}>
            <button
              onClick={() => setCategoryOpen((prev) => !prev)}
              className="flex items-center gap-1 pl-2 pr-1 py-1 text-[14px] font-medium text-gray-800 hover:text-gray-900 transition-colors"
            >
              {selectedLabel}
              <ChevronDown size={14} className={`text-gray-500 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
            </button>
            {categoryOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-50">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSearchCategory(opt.value); setCategoryOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-[14px] transition-colors ${
                      searchCategory === opt.value
                        ? "text-brand-blue font-bold bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleSearchExecute(searchQuery)}
            className="flex items-center justify-center w-9 h-9 rounded-full text-white bg-brand-blue hover:bg-brand-hover transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>

        {isSearchOpen && showSuggestionDropdown && (
          <div
            id="search-dropdown"
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-gray-100 bg-white py-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50 max-h-[60vh] overflow-y-auto"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.closest(".delete-btn")) return;
              if (target.closest(".search-item")) {
                const titleEl = target.closest(".search-item")?.querySelector("span:first-of-type");
                if (titleEl?.textContent) {
                  handleDropdownItemClick(titleEl.textContent);
                }
              }
            }}
          >
            {renderDropdown()}
          </div>
        )}
      </div>
    </div>
  );
};
