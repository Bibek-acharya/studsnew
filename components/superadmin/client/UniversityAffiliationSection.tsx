"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Home, School, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface University { id: number; name: string; }
interface Institution { id: number; institution_name: string; university_id: number | null; is_sponsored: boolean; district: string; website_url: string; }

export default function UniversityAffiliationSection() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUni, setSelectedUni] = useState<number | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("superadmin_token");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/api/v1/admin/universities?limit=500`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        setUniversities(json?.data?.universities?.map((u: any) => ({ id: u.id, name: u.name })) || []);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!selectedUni) { setInstitutions([]); return; }
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("superadmin_token");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/api/v1/admin/institutions?limit=500`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        const all = (json?.data?.institutions || json?.institutions || []);
        const filtered = all.filter((i: any) => i.university_id === selectedUni);
        setInstitutions(filtered.map((i: any) => ({ id: i.id, institution_name: i.institution_name, university_id: i.university_id, is_sponsored: i.is_sponsored || false, district: i.district || "", website_url: i.website_url || "" })));
      } catch {}
      finally { setLoading(false); }
    })();
  }, [selectedUni]);

  const toggleSponsored = async (instId: number, current: boolean) => {
    try {
      const token = localStorage.getItem("superadmin_token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/admin/institutions/${instId}/sponsored`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_sponsored: !current }),
      });
      setInstitutions((prev) => prev.map((i) => i.id === instId ? { ...i, is_sponsored: !current } : i));
      toast.success(current ? "Removed from featured" : "Added to featured");
    } catch { toast.error("Failed to update"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">University Affiliation</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" /> <span>Dashboard</span> <span>-</span> <span className="text-gray-800 font-medium">University Affiliation</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select University</label>
          <select className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={selectedUni || ""} onChange={(e) => setSelectedUni(e.target.value ? Number(e.target.value) : null)}>
            <option value="">Choose a university</option>
            {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        {selectedUni && (
          <>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Affiliated Institutions {institutions.length > 0 && `(${institutions.length})`}
            </h3>
            {loading ? (
              <p className="text-gray-500 py-4">Loading...</p>
            ) : institutions.length === 0 ? (
              <p className="text-gray-400 py-4">No institutions are affiliated with this university.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">SN</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Institution Name</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Show on Detail Page</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {institutions.map((inst, i) => (
                      <tr key={inst.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">{inst.institution_name}</p>
                          {inst.district && <p className="text-xs text-gray-500">{inst.district}</p>}
                        </td>
                        <td className="text-center py-3 px-4">
                          <button onClick={() => toggleSponsored(inst.id, inst.is_sponsored)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${inst.is_sponsored ? "bg-blue-600" : "bg-gray-300"}`}>
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${inst.is_sponsored ? "translate-x-5" : "translate-x-0"}`} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
