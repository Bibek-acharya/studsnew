"use client";

import { useState } from "react";
import { ScholarshipCardItem } from "./types";
import ConfirmDialog from "./ConfirmDialog";

interface ResultsGridProps {
  items: ScholarshipCardItem[];
  selectedIds: number[];
  onToggleOne: (id: number) => void;
  onToggleAll: (checked: boolean) => void;
  onNavigateToStep?: (step: number) => void;
}

export default function ResultsGrid({
  items,
  selectedIds,
  onToggleOne,
  onToggleAll,
  onNavigateToStep,
}: ResultsGridProps) {
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const allSelected = selectedIds.length === items.length;
  const selectedCount = selectedIds.length;

  const toggleSave = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRefineAnswers = () => {
    setShowDialog(true);
  };

  return (
    <div className="min-h-screen text-gray-900 antialiased pb-32 bg-[#fafaf9]">
      <div className="max-w-350 mx-auto mt-8">
        <div className="mb-8">
    
          <h1 className="text-[2rem] md:text-[2.5rem] leading-tight font-bold text-gray-900 mb-3">
            Scholarships that fit you best
          </h1>
          <p className="text-gray-600 max-w-4xl text-[1.05rem] leading-relaxed">
            These scholarships were handpicked based on your background, interests, and academic profile. You meet the
            key eligibility criteria, now it&apos;s time to explore and apply with confidence. You&apos;re eligible for
            <span className="font-bold text-brand-blue"> $62,000+ </span>
            in scholarships. Let&apos;s help you apply!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <button onClick={handleRefineAnswers} className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2.5 px-5 rounded-lg transition-colors w-full sm:w-auto">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Refine your answers
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <select className="w-full appearance-none border border-gray-300 bg-white text-gray-700 py-2.5 pl-4 pr-10 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer">
                <option>Deadline (Nearest)</option>
                <option>Deadline (Furthest)</option>
                <option>Amount (Highest)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative w-full sm:w-40">
              <select className="w-full appearance-none border border-gray-300 bg-white text-gray-700 py-2.5 pl-4 pr-10 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer">
                <option>Sort By</option>
                <option>Relevance</option>
                <option>Newest</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => {
            const selected = selectedIds.includes(item.id);

            return (
              <article
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-5 transition-all flex flex-col h-full relative group"
              >
                <div className="flex justify-between items-start mb-3 gap-3">
                  <h3 className="font-bold text-gray-900 text-[1.05rem] leading-snug group-hover:text-brand-hover transition-colors truncate" title={item.title}>
                    {item.title}
                  </h3>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleOne(item.id)}
                    className="card-checkbox shrink-0 mt-0.5"
                  />
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`${item.tagColorClass} text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                    {item.providerType}
                  </span>
                  <span className="bg-blue-50 text-brand-blue border border-blue-100 text-[0.65rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.coverage}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-5 grow line-clamp-3">{item.description}</p>

                <div className="pt-4 border-t border-gray-100 flex items-end justify-between mt-auto">
                  <div>
                    <span className="block text-[0.7rem] text-gray-400 font-bold uppercase tracking-wider mb-1">Deadline</span>
                    <span className="text-brand-blue font-bold text-[0.95rem]">{item.deadline}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSave(item.id)}
                      className={`p-2 rounded-lg transition-colors border ${
                        savedIds.includes(item.id)
                          ? "bg-blue-100 text-brand-blue border-blue-200"
                          : "bg-gray-50 text-gray-400 hover:text-brand-blue hover:bg-blue-100 border-gray-200"
                      }`}
                      title="Save"
                    >
                      <svg
                        className="w-4 h-4"
                        fill={savedIds.includes(item.id) ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                    <button className="bg-brand-blue hover:bg-brand-hover text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                      Apply
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-4xl bg-white border border-gray-200 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <span className="text-[0.95rem] font-bold text-gray-800">Select all</span>

          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              id="toggle-all"
              type="checkbox"
              checked={allSelected}
              onChange={(event) => onToggleAll(event.target.checked)}
              className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer z-10 transition-transform duration-200"
              style={{ top: 2, left: 2 }}
            />
            <label htmlFor="toggle-all" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200" />
          </div>

          <span className="text-sm font-semibold text-gray-500 hidden sm:inline">({selectedCount}/{items.length} Selected)</span>
        </div>

        <button
          className={`px-6 py-3 rounded-lg font-bold transition-colors shadow-sm text-white ${
            selectedCount > 0 ? "bg-brand-blue hover:bg-brand-hover" : "bg-gray-400 hover:bg-brand-blue"
          }`}
        >
          Add to shortlist
        </button>
      </div>

      <ConfirmDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={() => {
          if (onNavigateToStep) {
            onNavigateToStep(5);
          }
        }}
        onLeavePage={() => {
          if (onNavigateToStep) {
            onNavigateToStep(1);
          }
        }}
      />

      <style jsx global>{`
        .card-checkbox {
          appearance: none;
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid #cbd5e1;
          border-radius: 0.25rem;
          outline: none;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .card-checkbox:checked {
          background-color: #0000FF;
          border-color: #0000FF;
        }

        .card-checkbox:checked::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 6px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .toggle-checkbox {
          right: 18px;
        }

        .toggle-checkbox:checked {
          right: 0;
          border-color: #0000FF;
        }

        .toggle-checkbox:checked + .toggle-label {
          background-color: #0000FF;
        }
      `}</style>
    </div>
  );
}
