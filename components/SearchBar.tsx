"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  SearchItem,
  searchDatabase,
  searchData,
  trendingSearches,
  suggestionCategoryMap,
  categoryMap,
} from "@/utils/searchDatabase";

interface RecentSearch {
  text: string;
}

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
  onQueryStateChange?: (query: string, suggestions: SearchItem[]) => void;
}> = ({
  isMobile,
  defaultSearchOpen = false,
  showSuggestionDropdown = true,
  onQueryStateChange,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(defaultSearchOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
    { text: "shortlist universities" },
    { text: "education dashboard" },
  ]);

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

  const getFilteredSuggestions = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const allSuggestions: string[] = [];

    Object.entries(searchData).forEach(([, data]) => {
      data.suggestions.forEach((suggestion: string) => {
        if (
          suggestion.toLowerCase().includes(lowerQuery) &&
          !allSuggestions.includes(suggestion)
        ) {
          allSuggestions.push(suggestion);
        }
      });
    });

    return allSuggestions.slice(0, 7);
  };

  const addToRecentSearch = (text: string) => {
    setRecentSearches((prev) => {
      if (prev.find((s) => s.text.toLowerCase() === text.toLowerCase()))
        return prev;
      const updated = [{ text }, ...prev];
      return updated.slice(0, 5);
    });
  };

  const removeRecentSearch = (text: string) => {
    setRecentSearches((prev) => prev.filter((s) => s.text !== text));
  };

  const buildSuggestions = (query: string) => {
    if (query.trim() === "") return trendingSearches;

    const keywords = query
      .toLowerCase()
      .split(" ")
      .filter((k) => k.length > 0);

    return searchDatabase
      .filter((item) => {
        const searchableText = `${item.title} ${item.type}`.toLowerCase();
        return keywords.every((keyword) => searchableText.includes(keyword));
      })
      .slice(0, 10);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchOpen(true);
    const suggestions = buildSuggestions(query);
    onQueryStateChange?.(query, suggestions);
  };

  const handleSearchExecute = (query: string) => {
    if (!query || query.trim() === "") return;
    setIsSearchOpen(false);
    addToRecentSearch(query);
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
    addToRecentSearch(text);

    const category = suggestionCategoryMap[text] || categoryMap[text.toLowerCase()] || null;
    if (category && searchData[category]) {
      router.push(`/search?q=${encodeURIComponent(text)}&cat=${category}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(text)}`);
    }
  };

  const renderDropdown = () => {
    const query = searchQuery.trim();

    if (query.length === 0) {
      return (
        <>
          {recentSearches.length > 0 && (
            <>
              {recentSearches.map((item, idx) => (
                <div
                  key={idx}
                  className="search-item flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors group"
                  onClick={() => handleDropdownItemClick(item.text)}
                >
                  <div className="flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span className="text-[15px] text-gray-700">{item.text}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(item.text);
                    }}
                    className="delete-btn text-[#b0b8c4] hover:text-red-500 transition-colors p-1"
                    aria-label="Delete history"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              ))}
              <div className="h-2"></div>
            </>
          )}
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

    const filtered = getFilteredSuggestions(query);
    if (filtered.length > 0) {
      return filtered.map((text, idx) => (
        <div
          key={idx}
          className="search-item flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => handleDropdownItemClick(text)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span className="text-[15px] text-gray-700">{text}</span>
        </div>
      ));
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
                const itemText = target.closest(".search-item")?.querySelector("span:last-child")?.textContent;
                if (itemText) {
                  handleDropdownItemClick(itemText);
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
