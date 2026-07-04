"use client";

import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useCallback } from "react";
import { X, MapIcon, SearchX } from "lucide-react";
import Image from "next/image";
import MapSearchBar from "@/components/map/MapSearchBar";
import L from "leaflet";

const CollegeMap = dynamic(() => import("@/components/map/CollegeMap"), {
  ssr: false,
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

interface SearchResult {
  latitude: number;
  longitude: number;
  zoom?: number;
  boundingBox?: [number, number, number, number];
}

export default function MapPage() {
  const router = useRouter();
  const mapRef = useRef<L.Map | null>(null);

  const handleSearchSelect = useCallback((result: SearchResult) => {
    if (result.boundingBox && mapRef.current) {
      const [south, north, west, east] = result.boundingBox;
      mapRef.current.fitBounds(
        [
          [south, west],
          [north, east],
        ],
        { padding: [50, 50], maxZoom: 15, duration: 1 },
      );
    } else {
      mapRef.current?.flyTo(
        [result.latitude, result.longitude],
        result.zoom || 14,
        {
          duration: 1,
        },
      );
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-gray-900 flex flex-col">
      <div className="relative z-[3000] flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <button
          onClick={() => router.push("/find-college")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close map"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <div className="relative w-8 h-8 shrink-0">
          <Image
            src="/icon.png"
            alt="Studsphere"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0 max-w-xs sm:max-w-sm md:max-w-md">
          <MapSearchBar onSelect={handleSearchSelect} />
        </div>
      </div>
      <div className="flex-1 relative">
        <QueryClientProvider client={queryClient}>
          <CollegeMap mapRef={mapRef} />
        </QueryClientProvider>
      </div>
    </div>
  );
}
