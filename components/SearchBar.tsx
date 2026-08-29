"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const defaultSuggestions = [
  { text: "Colleges in Kathmandu" },
  { text: "CSIT colleges" },
  { text: "Scholarships 2026" },
  { text: "Entrance exams" },
  { text: "Upcoming events" },
  { text: "Engineering courses" },
];

export const SearchBar: React.FC<{
  isMobile?: boolean;
  defaultSearchOpen?: boolean;
  showSuggestionDropdown?: boolean;
  onQueryStateChange?: (
    query: string,
    suggestions: { title: string; type: string }[],
  ) => void;
}> = ({
  isMobile,
  defaultSearchOpen = false,
  showSuggestionDropdown = true,
  onQueryStateChange,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(defaultSearchOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { title: string; type: string }[]
  >([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const [hoverAngle, setHoverAngle] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const query = searchQuery.trim();
    if (!query) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }
    setIsLoadingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/search/suggest?q=${encodeURIComponent(query)}&limit=5`,
          { credentials: "include" },
        );
        const json = await res.json();
        if (json.suggestions) {
          setSuggestions(
            json.suggestions.map((item: any) => ({
              title: item.label || item.title,
              type: item.type,
            })),
          );
        }
      } catch {
        // ignore
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 200);
  }, [searchQuery]);

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
    router.push(`/search?q=${encodeURIComponent(query)}`);
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
    router.push(`/search?q=${encodeURIComponent(text)}`);
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="text-[15px] text-gray-600">{item.text}</span>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="text-[15px] text-gray-700">{item.title}</span>
              <span className="ml-auto text-[12px] text-gray-400 capitalize">
                {item.type}
              </span>
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
      <div
        className={`group relative flex h-10 w-full items-center overflow-visible rounded-full border border-gray-300 bg-white transition-all focus-within:border-gray-400 sm:h-11.5 ${isMobile ? "" : "focus-within:shadow-sm"}`}
        ref={searchContainerRef}
      >
        {isMobile && (
          <Search size={16} className="text-gray-400 ml-3 shrink-0" />
        )}
        {!isMobile && (
          <button
            type="button"
            onClick={() => router.push("/sphere-ai")}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - r.left - r.width / 2;
              const y = e.clientY - r.top - r.height / 2;
              const a = Math.atan2(y, x) * (180 / Math.PI) + 90;
              setHoverAngle(a);
            }}
            onMouseEnter={() => setShowBorder(true)}
            onMouseLeave={() => setShowBorder(false)}
            className="relative flex items-center gap-2 bg-gray-100 hover:bg-blue-100 rounded-full px-3 py-1.5 shrink-0 ml-2 cursor-pointer transition-colors overflow-hidden"
            aria-label="Open Sphere AI"
          >
            <span
              className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
              style={{
                border: "1.5px solid #0000FF",
                opacity: showBorder ? 1 : 0,
                maskImage: showBorder
                  ? `conic-gradient(from ${hoverAngle - 60}deg, transparent 0deg, black 30deg, black 150deg, transparent 180deg)`
                  : "none",
                WebkitMaskImage: showBorder
                  ? `conic-gradient(from ${hoverAngle - 60}deg, transparent 0deg, black 30deg, black 150deg, transparent 180deg)`
                  : "none",
              }}
            />
            <Search size={14} className="text-gray-700 relative z-10" />
            <span className="text-sm font-medium text-gray-800 relative z-10">
              Sphere AI
            </span>
          </button>
        )}
        {!isMobile && (
          <div
            className="w-px h-6 bg-gray-300 shrink-0 mx-3"
            aria-hidden="true"
          ></div>
        )}
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          onKeyDown={handleKeyDown}
          onClick={() => {
            setIsSearchOpen(true);
          }}
          placeholder={
            isMobile
              ? "Search colleges, courses..."
              : "Search for colleges, courses, events..."
          }
          className={`flex-1 bg-transparent border-none py-3.5 pr-2 text-[15px] text-gray-800 placeholder-[#6b7280] focus:outline-none focus:ring-0 ${isMobile ? "pl-2" : "pl-3"}`}
          autoComplete="off"
        />

        <div className="flex items-center shrink-0 pr-[6px]">
          {!isMobile && (
            <button
              onClick={() => handleSearchExecute(searchQuery)}
              className="flex items-center justify-center w-9 h-9 rounded-full text-white bg-brand-blue hover:bg-brand-hover transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          )}
        </div>

        {isSearchOpen && showSuggestionDropdown && (
          <div
            id="search-dropdown"
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-gray-100 bg-white py-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50 max-h-[60vh] overflow-y-auto"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.closest(".delete-btn")) return;
              if (target.closest(".search-item")) {
                const titleEl = target
                  .closest(".search-item")
                  ?.querySelector("span:first-of-type");
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
