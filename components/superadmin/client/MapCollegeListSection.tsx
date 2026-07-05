"use client";

import { useState, useEffect, useCallback } from "react";
import CollegeLocationPicker from "@/components/map/CollegeLocationPicker";
import { apiService } from "@/services/api";

export default function MapCollegeListSection() {
  const [search, setSearch] = useState("");
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.getColleges({ pageSize: 500 });
      setColleges(res?.data?.colleges || []);
    } catch (error) {
      console.error("Failed to load colleges:", error);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredColleges = search
    ? colleges.filter(
        (c: any) =>
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.location?.toLowerCase().includes(search.toLowerCase()) ||
          c.district?.toLowerCase().includes(search.toLowerCase()),
      )
    : colleges;

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
            load();
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
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search colleges..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500 mb-2">
            {filteredColleges.length} colleges
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredColleges.map((c: any) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 flex items-center gap-3 text-sm"
              >
                <span>{c.latitude && c.longitude ? "📍" : "○"}</span>
                <span className="font-medium text-gray-800">{c.name}</span>
                <span className="text-gray-500 ml-auto">
                  {c.location || c.district}
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
