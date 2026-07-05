"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createMarkerIcon } from "@/utils/mapIcons";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { MapPinOff } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface LocationResult {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  boundingBox?: [number, number, number, number];
}

interface CollegeLocationPickerProps {
  editable: boolean;
  selectedCollege?: {
    id: number;
    name: string;
    latitude?: number;
    longitude?: number;
  };
  onSave: (collegeId: number, lat: number, lng: number) => Promise<void>;
}

function ClickMarker({ onMove }: { onMove: (pos: [number, number]) => void }) {
  useMapEvents({
    click: (e: L.LeafletMouseEvent) => {
      onMove([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function CollegeLocationPicker({
  editable,
  selectedCollege,
  onSave,
}: CollegeLocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    selectedCollege?.latitude && selectedCollege?.longitude
      ? [selectedCollege.latitude, selectedCollege.longitude]
      : null,
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const searchRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const handleSearch = useCallback(async (q: string) => {
    setSearchQuery(q);
    setActiveIndex(-1);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (q.trim().length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/geocode?q=${encodeURIComponent(q)}`,
        );
        const data = await res.json();
        const locations: LocationResult[] = (data?.data || []).map(
          (l: any) => ({
            name: l.name.split(",")[0],
            displayName: l.displayName,
            latitude: l.latitude,
            longitude: l.longitude,
            boundingBox: l.boundingBox,
          }),
        );
        setSearchResults(locations);
        setSearchOpen(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  const handleSelectLocation = useCallback((r: LocationResult) => {
    setSearchOpen(false);
    setSearchQuery(r.name);
    setActiveIndex(-1);
    const newPos: [number, number] = [r.latitude, r.longitude];
    setPosition(newPos);
    mapRef.current?.flyTo(newPos, 16, { duration: 1 });
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!searchOpen || searchResults.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && searchResults[activeIndex]) {
          handleSelectLocation(searchResults[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setSearchOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchOpen(false);
    setActiveIndex(-1);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = useCallback((pos: [number, number]) => {
    setPosition(pos);
    setToast(null);
  }, []);

  const handleDrag = useCallback((pos: [number, number]) => {
    setPosition(pos);
    setToast(null);
  }, []);

  const handleSave = async () => {
    if (!position || !selectedCollege) return;
    const prev = position;
    setSaving(true);
    setToast(null);
    try {
      await onSave(selectedCollege.id, position[0], position[1]);
      setToast({ type: "success", msg: "✓ Location saved" });
    } catch {
      setPosition(prev);
      setToast({ type: "error", msg: "✗ Failed to save location" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = () => {
    setPosition(null);
    setToast(null);
  };

  const currentPos =
    position ||
    (selectedCollege?.latitude && selectedCollege?.longitude
      ? ([selectedCollege.latitude, selectedCollege.longitude] as [
          number,
          number,
        ])
      : null);

  return (
    <div className="space-y-3">
      {/* Search bar */}
      {editable && (
        <div className="relative z-[3001]" ref={searchRef}>
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() =>
                searchQuery.length >= 2 &&
                searchResults.length > 0 &&
                setSearchOpen(true)
              }
              placeholder="Search location..."
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
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
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg border border-gray-200 max-h-60 overflow-y-auto shadow-lg">
              {searchResults.map((r, index) => (
                <button
                  key={`location-${r.latitude}-${r.longitude}`}
                  onClick={() => handleSelectLocation(r)}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-0 text-sm flex items-center gap-3 transition-colors ${
                    index === activeIndex ? "bg-blue-50" : ""
                  }`}
                >
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-green-200 text-green-600 flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="w-4 h-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-gray-800 block truncate">
                      {r.name}
                    </span>
                    <span className="text-gray-500 text-xs truncate block">
                      {r.displayName}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
          {searchOpen &&
            searchQuery.length >= 2 &&
            searchResults.length === 0 &&
            !searching && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-500 text-center shadow-lg">
                <MapPinOff className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                <span>No locations found for &ldquo;{searchQuery}&rdquo;</span>
              </div>
            )}
        </div>
      )}

      <div className="h-[400px] rounded-lg overflow-hidden relative">
        <MapContainer
          center={currentPos || [28.39, 84.12]}
          zoom={currentPos ? 15 : 7}
          className="w-full h-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url={
              process.env.NEXT_PUBLIC_MAP_TILE_URL ||
              "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />
          {editable && <ClickMarker onMove={handleClick} />}
          {currentPos && (
            <Marker
              position={currentPos}
              icon={createMarkerIcon()}
              draggable={editable}
              eventHandlers={
                editable
                  ? {
                      dragend: (e) => {
                        const m = e.target;
                        const p = m.getLatLng();
                        handleDrag([p.lat, p.lng]);
                      },
                    }
                  : undefined
              }
            />
          )}
        </MapContainer>
        {!currentPos && editable && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow text-sm text-gray-600 pointer-events-none">
            Search a location or click the map to place a marker
          </div>
        )}
      </div>

      {editable && !position && (
        <p className="text-sm text-gray-500">
          Search for a location above, or click on the map to place a marker.
        </p>
      )}
      {editable && position && (
        <p className="text-sm text-gray-500">
          Drag the marker to adjust. Click Save when ready.
        </p>
      )}

      {position && (
        <div className="text-sm font-mono text-gray-600">
          {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </div>
      )}

      {toast && (
        <div
          className={`text-sm px-3 py-2 rounded-md ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {editable && (
        <div className="flex gap-3">
          {position && (
            <button
              onClick={handleRemove}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 text-sm"
            >
              Remove
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!position || saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {saving ? "Saving..." : "Save Location"}
          </button>
        </div>
      )}
    </div>
  );
}
