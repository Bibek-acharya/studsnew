"use client";

import { useState, useEffect, useCallback } from "react";
import CollegeLocationPicker from "@/components/map/CollegeLocationPicker";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function superadminFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("superadmin_token")
      : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  if (res.status === 401 || res.status === 403)
    throw new Error("auth_required");
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Unexpected response");
  }
  if (!res.ok)
    throw new Error(data?.message || data?.error || "Request failed");
  return data as T;
}

interface Institution {
  id: number;
  institution_name: string;
  latitude?: number;
  longitude?: number;
  district?: string;
  province?: string;
  organization_type?: string;
}

export default function MapCollegeListSection() {
  const [search, setSearch] = useState("");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Institution | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await superadminFetch<{
        data: { institutions: Institution[] };
      }>("/api/v1/superadmin/institutions");
      setInstitutions(res.data?.institutions || []);
    } catch (error) {
      console.error("Failed to load institutions:", error);
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = search
    ? institutions.filter(
        (c) =>
          c.institution_name?.toLowerCase().includes(search.toLowerCase()) ||
          c.district?.toLowerCase().includes(search.toLowerCase()) ||
          c.province?.toLowerCase().includes(search.toLowerCase()),
      )
    : institutions;

  if (selected) {
    return (
      <div className="p-6">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-blue-600 hover:underline mb-4"
        >
          ← Back to list
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {selected.institution_name}
        </h2>
        <p className="text-gray-600 mb-4">
          Click or drag the marker to set its location. Click Save when ready.
        </p>
        <CollegeLocationPicker
          editable
          selectedCollege={{
            id: selected.id,
            name: selected.institution_name,
            latitude: selected.latitude,
            longitude: selected.longitude,
          }}
          onSave={async (id, lat, lng) => {
            await superadminFetch(`/api/v1/superadmin/institutions/${id}`, {
              method: "PUT",
              body: JSON.stringify({ latitude: lat, longitude: lng }),
            });
            setSelected(null);
            load();
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Institution Map Locations
      </h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search institutions..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500 mb-2">
            {filtered.length} institutions
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 flex items-center gap-3 text-sm"
              >
                <span>{c.latitude && c.longitude ? "📍" : "○"}</span>
                <span className="font-medium text-gray-800">
                  {c.institution_name}
                </span>
                <span className="text-gray-500 ml-auto text-xs">
                  {c.district || c.province || ""}
                </span>
                {(!c.latitude || !c.longitude) && (
                  <span className="text-xs text-orange-500">No location</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
