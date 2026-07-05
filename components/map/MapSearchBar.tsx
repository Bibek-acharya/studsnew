"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { apiService } from "@/services/api";
import { MapPinOff } from "lucide-react";

interface CollegeResult {
  resultType: "college";
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  district?: string;
  province?: string;
}

interface LocationResult {
  resultType: "location";
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  boundingBox?: [number, number, number, number];
}

type SearchResult = CollegeResult | LocationResult;

interface MapSearchBarProps {
  onSelect: (result: {
    latitude: number;
    longitude: number;
    zoom?: number;
    boundingBox?: [number, number, number, number];
  }) => void;
}

export default function MapSearchBar({ onSelect }: MapSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    setActiveIndex(-1);
    if (timer.current) clearTimeout(timer.current);
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    timer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const [collegeRes, locationRes] = await Promise.allSettled([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/map/colleges`,
          ).then((r) => r.json()),
          apiService.geocodeLocation(q),
        ]);

        const items: SearchResult[] = [];

        if (
          collegeRes.status === "fulfilled" &&
          Array.isArray(collegeRes.value?.data?.colleges)
        ) {
          const colleges: CollegeResult[] = collegeRes.value.data.colleges
            .filter((c: any) => c.latitude && c.longitude)
            .map((c: any) => ({
              resultType: "college" as const,
              id: c.id,
              name: c.name,
              latitude: c.latitude,
              longitude: c.longitude,
              district: c.district || c.location,
              province: c.province,
            }));
          items.push(...colleges);
        }

        if (locationRes.status === "fulfilled" && locationRes.value?.data) {
          const locations: LocationResult[] = locationRes.value.data.map(
            (l: any) => ({
              resultType: "location" as const,
              name: l.name.split(",")[0],
              displayName: l.displayName,
              latitude: l.latitude,
              longitude: l.longitude,
              boundingBox: l.boundingBox,
            }),
          );
          items.push(...locations);
        }

        setResults(items);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  const handleSelect = (r: SearchResult) => {
    setOpen(false);
    setQuery(r.resultType === "college" ? r.name : r.name);
    setActiveIndex(-1);

    let zoom = 14;
    if (r.resultType === "location") {
      const displayName = r.displayName.toLowerCase();
      if (
        displayName.includes("street") ||
        displayName.includes("road") ||
        displayName.includes("tol") ||
        displayName.includes("marga") ||
        displayName.includes("ward") ||
        displayName.includes("chowk") ||
        displayName.includes("bazar")
      ) {
        zoom = 17;
      } else if (
        displayName.includes("sub-metropolitan") ||
        displayName.includes("municipality") ||
        displayName.includes("rural municipality") ||
        displayName.includes("gaunpalika") ||
        displayName.includes("nagarpalika")
      ) {
        zoom = 13;
      } else if (
        displayName.includes("district") ||
        displayName.includes("province") ||
        displayName.includes("region") ||
        displayName.includes("zone")
      ) {
        zoom = 10;
      } else {
        zoom = 12;
      }
    }

    const boundingBox = r.resultType === "location" ? r.boundingBox : undefined;
    onSelect({
      latitude: r.latitude,
      longitude: r.longitude,
      zoom,
      boundingBox,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-[3001]" ref={resultsRef}>
      <div className="relative">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            query.length >= 2 && results.length > 0 && setOpen(true)
          }
          placeholder="Search colleges, districts, or locations..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
          >
            <HiX className="w-4 h-4 text-gray-400" />
          </button>
        )}
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="w-4 h-4 block rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
          </div>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 w-full bg-white rounded-lg border border-gray-200 max-h-72 overflow-y-auto z-[3002]">
          {results.map((r, index) => (
            <button
              key={
                r.resultType === "college"
                  ? `college-${r.id}`
                  : `location-${r.latitude}-${r.longitude}`
              }
              onClick={() => handleSelect(r)}
              className={`w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-0 text-sm flex items-center gap-3 transition-colors ${
                index === activeIndex ? "bg-blue-50" : ""
              }`}
            >
              {r.resultType === "college" ? (
                <>
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {r.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-gray-800 block truncate">
                      {r.name}
                    </span>
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      {[r.district, r.province].filter(Boolean).join(", ")}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-green-200 text-green-600 flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="w-4 h-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-gray-800 block truncate">
                      {r.name.split(",")[0]}
                    </span>
                    <span className="text-gray-500 text-xs truncate block">
                      {r.displayName}
                    </span>
                  </div>
                </>
              )}
              {index === activeIndex && (
                <span className="text-xs text-blue-600 font-medium shrink-0">
                  Press Enter
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {open && query.length >= 2 && results.length === 0 && !searching && (
        <div className="absolute left-0 right-0 top-full mt-2 w-full bg-white rounded-lg border border-gray-200 p-6 text-sm text-gray-500 text-center z-[3002]">
          <MapPinOff className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <span>No colleges or locations found for &ldquo;{query}&rdquo;</span>
        </div>
      )}
    </div>
  );
}
