"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api";

const Picker = dynamic(() => import("@/components/map/CollegeLocationPicker"), {
  ssr: false,
});

export default function CollegeLocationPage() {
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService
      .getInstitutionProfile()
      .then((r) => setCollege(r?.data || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!college)
    return (
      <div className="p-6 text-red-500">
        No college associated with your account.
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        College Location
      </h1>
      <p className="text-gray-600 mb-6">
        Set the map location for{" "}
        <strong>{college.institution_name || college.name}</strong>
      </p>
      <Picker
        editable={true}
        selectedCollege={{
          id: college.college_id || college.id,
          name: college.institution_name || college.name,
          latitude: college.latitude,
          longitude: college.longitude,
        }}
        onSave={async (_id, lat, lng) => {
          await apiService.updateInstitutionCollegeLocation(lat, lng);
        }}
      />
    </div>
  );
}
