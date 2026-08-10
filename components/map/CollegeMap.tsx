"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { apiService } from "@/services/api";
import MarkerCluster from "./MarkerCluster";
import CollegeMarker from "./CollegeMarker";
import MapSearchBar from "./MapSearchBar";
import MyLocationButton from "./MyLocationButton";
import FitAllButton from "./FitAllButton";

const NEPAL: [number, number] = [28.39, 84.12];
const DEFAULT_ZOOM = 8;
const MOVE_DEBOUNCE_MS = 400;

const TYPE_COLORS: Record<string, string> = {
  public: "#3B82F6",
  private: "#22C55E",
  community: "#A855F7",
};

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface College {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  type?: string;
  reviews?: number;
  logo?: string;
  district?: string;
  rating?: number;
  gallery?: any[];
  phone?: string;
}

interface SearchResult {
  id: number;
  latitude: number;
  longitude: number;
}

function roundBounds(b: Bounds): Bounds {
  return {
    north: Math.ceil(b.north * 4) / 4,
    south: Math.floor(b.south * 4) / 4,
    east: Math.ceil(b.east * 4) / 4,
    west: Math.floor(b.west * 4) / 4,
  };
}

function ViewportSync({ onMoveEnd }: { onMoveEnd: (b: Bounds) => void }) {
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      const b = map.getBounds();
      onMoveEnd({
        north: b.getNorthEast().lat,
        east: b.getNorthEast().lng,
        south: b.getSouthWest().lat,
        west: b.getSouthWest().lng,
      });
    },
  });
  return null;
}

/**
 * Tracks the user's location without ever silently failing.
 * Exposes a status so the UI can explain what happened
 * (denied / unsupported / unavailable) instead of just doing nothing.
 */
function useGeolocation() {
  const [state, setState] = useState<{
    status: "idle" | "locating" | "granted" | "denied" | "unsupported";
    position: [number, number] | null;
  }>({ status: "idle", position: null });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState({ status: "unsupported", position: null });
      return;
    }
    setState((s) => ({ ...s, status: "locating" }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: "granted",
          position: [pos.coords.latitude, pos.coords.longitude],
        });
      },
      () => {
        setState({ status: "denied", position: null });
      },
      { timeout: 8000 },
    );
  }, []);

  return state;
}

interface CollegeMapProps {
  mapRef?: React.RefObject<L.Map | null>;
}

export default function CollegeMap({
  mapRef: externalMapRef,
}: CollegeMapProps) {
  const [center, setCenter] = useState<[number, number]>(NEPAL);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [viewport, setViewport] = useState<Bounds | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const dbRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const internalMapRef = useRef<L.Map | null>(null);
  const mapRef = externalMapRef || internalMapRef;

  const geo = useGeolocation();

  // Geolocation is tracked but map doesn't auto-center - user must click "My Location"

  const cacheKey = viewport
    ? `map-${viewport.north}-${viewport.south}-${viewport.east}-${viewport.west}`
    : "map-default";

  const { data, isFetching, isLoading, isError, refetch } = useQuery<College[]>(
    {
      queryKey: [cacheKey],
      queryFn: async () => {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${API_BASE_URL}/api/v1/map/colleges`);
        const body = await res.json();
        const colleges = body?.data?.colleges || [];
        return colleges.filter(
          (c: any): c is College => c.latitude != null && c.longitude != null,
        );
      },
      staleTime: 60_000,
      retry: 1,
    },
  );

  useEffect(() => {
    return () => clearTimeout(dbRef.current);
  }, []);

  const handleMoveEnd = useCallback((b: Bounds) => {
    clearTimeout(dbRef.current);
    dbRef.current = setTimeout(
      () => setViewport(roundBounds(b)),
      MOVE_DEBOUNCE_MS,
    );
  }, []);

  const handleSearchSelect = useCallback((result: SearchResult) => {
    setHighlightedId(result.id);
    mapRef.current?.flyTo([result.latitude, result.longitude], 14, {
      duration: 1,
    });
  }, []);

  const colleges = data || [];
  const isInitialLoad = isLoading && !data;
  const showEmptyState = !isInitialLoad && !isError && colleges.length === 0;

  const legendEntries = useMemo(
    () => [...Object.entries(TYPE_COLORS), ["other", "#9CA3AF"] as const],
    [],
  );

  return (
    <div className="relative w-full h-full">
      {/* Map */}
      <div className="w-full h-full z-0">
        <MapContainer
          center={center}
          zoom={zoom}
          className="w-full h-full"
          scrollWheelZoom={true}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url={
              process.env.NEXT_PUBLIC_MAP_TILE_URL ||
              "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />
          <ViewportSync onMoveEnd={handleMoveEnd} />
          <MarkerCluster>
            {colleges.map((c) => (
              <CollegeMarker
                key={c.id}
                college={c}
                isHighlighted={c.id === highlightedId}
              />
            ))}
          </MarkerCluster>
          <MyLocationButton />
          <FitAllButton colleges={colleges} />
        </MapContainer>

        {/* Initial-load skeleton: covers the map so users aren't staring at
            a blank/empty-looking view of Nepal while the first fetch runs. */}
        {isInitialLoad && (
          <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <span className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-sm">Loading colleges…</span>
            </div>
          </div>
        )}

        {/* Empty state: tells the user *why* the map looks empty and gives
            them an obvious next action instead of leaving them guessing. */}
        {showEmptyState && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[2000] bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-md text-sm text-gray-600 flex items-center gap-2 pointer-events-none">
            No colleges in this area — try zooming out
          </div>
        )}
      </div>

      {/* Stats + legend — bottom left */}
      <div className="absolute bottom-6 left-3 sm:left-4 z-[2000] flex flex-col gap-2 max-w-[calc(100vw-1.5rem)]">
        {!isInitialLoad && colleges.length > 0 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md text-xs text-gray-700 w-fit">
            <span className="font-semibold">{colleges.length}</span> college
            {colleges.length === 1 ? "" : "s"} in view
          </div>
        )}

        {/* On small screens the legend collapses behind a toggle so it
            doesn't compete with the map for thumb-reachable space. */}
        <button
          type="button"
          onClick={() => setLegendOpen((v) => !v)}
          className="sm:hidden bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md text-xs text-gray-600 w-fit flex items-center gap-1.5"
          aria-expanded={legendOpen}
          aria-controls="map-legend"
        >
          Legend
          <span
            className={`transition-transform ${legendOpen ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </button>

        <div
          id="map-legend"
          className={`bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md text-xs flex flex-wrap gap-2 ${
            legendOpen ? "flex" : "hidden sm:flex"
          }`}
        >
          {legendEntries.map(([type, color]) => (
            <span key={type} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize text-gray-600">{type}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
