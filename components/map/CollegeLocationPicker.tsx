"use client";

import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createMarkerIcon } from "@/utils/mapIcons";

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
      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapContainer
          center={currentPos || [28.39, 84.12]}
          zoom={currentPos ? 15 : 7}
          className="w-full h-full"
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
      </div>

      {editable && !position && (
        <p className="text-sm text-gray-500">
          Click on the map to place a marker.
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
