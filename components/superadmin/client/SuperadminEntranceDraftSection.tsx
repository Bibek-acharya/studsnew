"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Pencil,
  Trash,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { superadminEntranceApi } from "@/services/superadminRecordsApi";
import CollegeFilterDropdown from "./CollegeFilterDropdown";

const ITEMS_PER_PAGE = 5;

interface Institution {
  id: number;
  institution_name: string;
}

export default function SuperadminEntranceDraftSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [page, setPage] = useState(1);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [collegeFilter, setCollegeFilter] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      superadminEntranceApi.list(1, 50, "draft"),
      fetch("/api/v1/superadmin/institutions")
        .then((r) => r.json())
        .then((d) => d.data?.institutions || [])
        .catch(() => []),
    ])
      .then(([res, insts]) => {
        setDrafts(res.entrances || []);
        setInstitutions(insts);
      })
      .catch(() => setDrafts([]))
      .finally(() => setLoading(false));
  }, []);

  const institutionMap = new Map(
    institutions.map((i) => [i.id, i.institution_name]),
  );
  const enriched = drafts.map((d) => ({
    ...d,
    institution_name:
      d.institution_name || institutionMap.get(d.institution_id) || "-",
  }));

  const filtered =
    collegeFilter === null
      ? enriched
      : enriched.filter((d) => d.institution_id === collegeFilter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const handleEdit = (id: number) => {
    localStorage.setItem("superadmin_edit_entrance_id", String(id));
    setActiveSection("superadmin-create-entrance");
  };

  const handleDelete = async (id: number) => {
    try {
      await superadminEntranceApi.delete(id);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Draft Entrance</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <FileText size={16} />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Draft Entrance</span>
        </div>
      </div>

      <div className="mb-4">
        <CollegeFilterDropdown
          institutions={institutions}
          value={collegeFilter}
          onChange={setCollegeFilter}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-amber-600" size={20} /> Saved Drafts
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Loading...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">
              {collegeFilter
                ? "No drafts for this institution."
                : "No draft entrance exams found."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginated.map((draft) => (
              <div
                key={draft.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <FileText className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {draft.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {draft.institution_name} &middot; {draft.status} &middot;{" "}
                      {new Date(draft.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(draft.id)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                  >
                    <Pencil size={14} weight="fill" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1.5"
                  >
                    <Trash size={14} weight="fill" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {drafts.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">
                {(safePage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(safePage * ITEMS_PER_PAGE, drafts.length)}
              </span>{" "}
              of <span className="font-medium">{drafts.length}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50"
              >
                <CaretLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50"
              >
                <CaretRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
