"use client";

import { useState, useEffect, useCallback } from "react";
import CollegeLocationPicker from "@/components/map/CollegeLocationPicker";
import { apiService } from "@/services/api";

export default function MapCollegeListSection() {
  const [search, setSearch] = useState("");
  const [colleges, setColleges] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<any>(null);

  const load = useCallback(async (q: string, p: number) => {
    const res = await apiService.getAdminColleges({
      search: q || undefined,
      page: p,
      pageSize: 20,
    });
    setColleges(res?.data?.colleges || []);
    setTotalPages(res?.data?.pagination?.totalPages || 1);
  }, []);

  useEffect(() => {
    load(search, page);
  }, [search, page, load]);

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
          {selected.name}
        </h2>
        <p className="text-gray-600 mb-4">
          Click or drag the marker to set its location. Click Save when ready.
        </p>
        <CollegeLocationPicker
          editable
          selectedCollege={selected}
          onSave={async (id, lat, lng) => {
            await apiService.updateCollegeLocation(id, lat, lng);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        College Map Locations
      </h2>
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search colleges..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {colleges.map((c: any) => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 flex items-center gap-3 text-sm"
          >
            <span>{c.latitude && c.longitude ? "📍" : "○"}</span>
            <span className="font-medium text-gray-800">{c.name}</span>
            <span className="text-gray-500 ml-auto">{c.location}</span>
            {(!c.latitude || !c.longitude) && (
              <span className="text-xs text-orange-500">No location</span>
            )}
          </button>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
