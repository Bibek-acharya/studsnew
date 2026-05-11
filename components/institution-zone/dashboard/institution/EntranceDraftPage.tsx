"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Pencil, Trash, CaretLeft, CaretRight } from "@phosphor-icons/react";

interface DraftEntrance {
  id: number;
  title: string;
  program: string;
  level: string;
  lastEdited: string;
}

const DRAFT_ENTRANCES: DraftEntrance[] = [
  { id: 1, title: "IOE Entrance 2081", program: "BE/B.Arch", level: "Bachelor", lastEdited: "2026-05-11" },
  { id: 2, title: "CEE Medical 2081", program: "MBBS/BDS", level: "Bachelor", lastEdited: "2026-05-10" },
  { id: 3, title: "CMAT Management 2081", program: "BBA/BBM", level: "Bachelor", lastEdited: "2026-05-09" },
  { id: 4, title: "KUUMAT 2081", program: "BBA/BBA-Finance", level: "Bachelor", lastEdited: "2026-05-08" },
];

const ITEMS_PER_PAGE = 5;

const EntranceDraftPage: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(DRAFT_ENTRANCES.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = DRAFT_ENTRANCES.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleEdit = (id: number) => {
    router.push(`/institution-zone/dashboard/entrance?id=${id}`);
  };

  const handleDelete = (id: number) => {
    console.log("Delete draft", id);
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-amber-600" size={20} /> Saved Drafts
          </h2>
        </div>

        {paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No draft entrance exams found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginated.map((draft) => (
              <div key={draft.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <FileText className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{draft.title}</h3>
                    <p className="text-sm text-gray-500">{draft.level} - {draft.program} &middot; Last edited: {draft.lastEdited}</p>
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

        {DRAFT_ENTRANCES.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, DRAFT_ENTRANCES.length)}</span> of <span className="font-medium">{DRAFT_ENTRANCES.length}</span>
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} className={`w-8 h-8 flex items-center justify-center rounded-lg border ${safePage === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                <CaretLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${safePage === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className={`w-8 h-8 flex items-center justify-center rounded-lg border ${safePage === totalPages ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                <CaretRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntranceDraftPage;
