"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Crosshair } from "lucide-react";
import {
  SearchItem,
  searchDatabase,
  searchIcons,
  trendingSearches,
} from "@/utils/searchDatabase";

export const SearchBar: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const [locationText, setLocationText] = useState(() => {
    if (typeof window === "undefined") return "Detect Location";
    return sessionStorage.getItem("navLocation") || "Detect Location";
  });
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);

  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const locContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        locContainerRef.current &&
        !locContainerRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      locationText &&
      locationText !== "Detect Location" &&
      locationText !== "Detecting..." &&
      locationText !== "Location Found"
    ) {
      sessionStorage.setItem("navLocation", locationText);
    }
  }, [locationText]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchOpen(true);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const keywords = query
      .toLowerCase()
      .split(" ")
      .filter((k) => k.length > 0);
    const filtered = searchDatabase.filter((item) => {
      const searchableText = `${item.title} ${item.type}`.toLowerCase();
      return keywords.every((keyword) => searchableText.includes(keyword));
    });

    const locMatchStr =
      locationText !== "Detect Location" ? locationText.toLowerCase() : "";
    if (locMatchStr) {
      const locParts = locMatchStr
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      filtered.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        let aScore = 0;
        let bScore = 0;

        locParts.forEach((part) => {
          if (aTitle.includes(part)) aScore += 1;
          if (bTitle.includes(part)) bScore += 1;
        });

        return bScore - aScore;
      });
    }

    setSearchResults(filtered.slice(0, 10));
  };

  const handleSearchExecute = (query: string) => {
    if (!query || query.trim() === "") return;
    setIsSearchOpen(false);
    router.push(
      `/search?q=${encodeURIComponent(query)}&loc=${encodeURIComponent(locationText)}`,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchExecute(searchQuery);
    }
  };

  const autoDetectLocation = async () => {
    setLocationText("Detecting...");
    const fallback = "Kathmandu, Bagmati";

    const fetchLocation = async (lat?: number, lon?: number) => {
      try {
        if (lat && lon) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=16&addressdetails=1`,
          );

          if (response.ok) {
            const data = await response.json();
            const addr = data?.address;
            if (addr) {
              const precise =
                addr.neighbourhood ||
                addr.suburb ||
                addr.quarter ||
                addr.village ||
                addr.road ||
                addr.town;
              const city =
                addr.city ||
                addr.municipality ||
                addr.county ||
                addr.state_district;

              if (precise && city && precise !== city) {
                setLocationText(`${precise}, ${city}`);
              } else if (precise) {
                setLocationText(precise);
              } else if (city) {
                setLocationText(city);
              } else {
                setLocationText(data?.name || "Location Found");
              }
              setIsLocationOpen(false);
              return;
            }
          }
        }

        const ipResponse = await fetch(
          "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en",
        );
        const ipData = await ipResponse.json();
        const locality = ipData?.locality || ipData?.city;
        const city = ipData?.city || ipData?.principalSubdivision;

        if (locality && city && locality !== city) {
          setLocationText(`${locality}, ${city}`);
        } else if (city) {
          setLocationText(city);
        } else if (ipData?.countryName) {
          setLocationText(ipData.countryName);
        } else {
          setLocationText(fallback);
        }
      } catch {
        setLocationText(fallback);
      }
      setIsLocationOpen(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          fetchLocation(position.coords.latitude, position.coords.longitude),
        () => fetchLocation(),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      await fetchLocation();
    }
  };

  return (
    <div
      className={
        isMobile ? "w-full" : "mx-4 hidden max-w-160 flex-1 md:mx-10 md:block"
      }
    >
      <div className="group relative flex h-10 w-full items-center overflow-visible rounded-md border border-gray-300 bg-white transition-all focus-within:border-[#4461f2] focus-within:ring-1 focus-within:ring-[#4461f2] sm:h-11.5">
        <div className="relative h-full shrink-0" ref={locContainerRef}>
          <button
            onClick={() => {
              setIsLocationOpen(!isLocationOpen);
              setIsSearchOpen(false);
            }}
            className="flex h-full items-center gap-2 rounded-l-md bg-transparent pl-4 pr-3 font-medium text-[#334155] outline-none transition-colors hover:bg-gray-50"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#64748b]"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {!isMobile && (
              <span
                className={`max-w-35 truncate whitespace-nowrap text-[15px] ${
                  locationText !== "Detect Location" ? "text-gray-900" : ""
                }`}
              >
                {locationText}
              </span>
            )}
            {isMobile && locationText !== "Detect Location" && (
              <span className="max-w-20 truncate whitespace-nowrap text-[14px] text-gray-900 ml-1">
                {locationText}
              </span>
            )}
          </button>

          {isLocationOpen && (
            <div className="custom-scrollbar absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] z-200 max-h-80 w-75 overflow-y-auto rounded-lg border border-gray-100 bg-white py-2 shadow-xl">
              <button
                onClick={autoDetectLocation}
                className="flex w-full items-center gap-3 px-5 py-3 text-left text-[15px] font-medium text-brand-blue transition-colors hover:bg-gray-50"
              >
                <Crosshair className="h-4 w-4" />
                {isMobile ? "Location" : "Detect Location"}
              </button>
              {[
                "Thamel, Kathmandu",
                "Putalisadak, Kathmandu",
                "Lakeside, Pokhara",
              ].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocationText(loc);
                    setIsLocationOpen(false);
                  }}
                  className="w-full px-5 py-2.5 text-left text-[15px] text-gray-800 transition-colors hover:bg-gray-50"
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-200"></div>

        <div
          className="relative flex h-full flex-1 items-center pl-3 pr-4 sm:pl-3"
          ref={searchContainerRef}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            onKeyDown={handleKeyDown}
            onClick={() => {
              setIsSearchOpen(true);
              setIsLocationOpen(false);
            }}
            placeholder=" "
            className="peer z-10 h-full w-full bg-transparent text-[15px] text-gray-800 focus:outline-none"
            autoComplete="off"
          />

          {!searchQuery && (
            <div className="pointer-events-none absolute inset-y-0 left-9.5 flex items-center text-[15px] text-gray-400 peer-focus:hidden">
              <span className="mr-1 whitespace-nowrap">Search</span>
              {!isMobile && (
                <div className="relative inline-block h-5 overflow-hidden align-bottom">
                  <div className="sliding-text flex flex-col leading-5">
                    <span className="block h-5 whitespace-nowrap">
                      +2 science colleges...
                    </span>
                    <span className="block h-5 whitespace-nowrap">
                      BIT colleges in nepal...
                    </span>
                    <span className="block h-5 whitespace-nowrap">
                      CMAT entrance preparation...
                    </span>
                    <span className="block h-5 whitespace-nowrap">
                      MoE scholarships...
                    </span>
                    <span className="block h-5 whitespace-nowrap">
                      +2 science colleges...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {isSearchOpen && (
            <div className="custom-scrollbar absolute left-0 top-[calc(100%+8px)] z-200 max-h-105 w-full overflow-y-auto rounded-lg border border-gray-100 bg-white py-2 shadow-xl">
              {searchQuery.trim() === "" ? (
                <>
                  <div className="px-5 pb-2 pt-3">
                    <span className="text-[12px] font-semibold uppercase tracking-wide text-gray-500">
                      Trending Searches
                    </span>
                  </div>
                  {trendingSearches.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchExecute(item.title)}
                      className="group flex w-full items-center gap-4 px-5 py-2.5 text-left transition-colors hover:bg-gray-50"
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-400 text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
                        dangerouslySetInnerHTML={{
                          __html: searchIcons["Trending"],
                        }}
                      ></div>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-medium text-gray-900">
                          {item.title}
                        </span>
                        <span className="text-[13px] text-gray-500">
                          {item.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </>
              ) : searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearchExecute(item.title)}
                    className="group flex w-full items-center gap-4 px-5 py-2.5 text-left transition-colors hover:bg-gray-50"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
                      dangerouslySetInnerHTML={{
                        __html: searchIcons[item.type] || searchIcons["Course"],
                      }}
                    ></div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium text-gray-900">
                        {item.title}
                      </span>
                      <span className="text-[13px] text-gray-500">
                        {item.type}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-5 py-6 text-center text-[14px] text-gray-500">
                  No matches found for your query.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
