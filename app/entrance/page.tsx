"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import EntranceFilters from "@/components/entrance/EntranceFilters";
import EntranceGrid from "@/components/entrance/EntranceGrid";
import { EntranceFilterState, DEFAULT_ENTRANCE_FILTERS } from "@/app/entrance/types";

const EntrancePage: React.FC = () => {
  const [filters, setFilters] = useState<EntranceFilterState>(DEFAULT_ENTRANCE_FILTERS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="min-h-screen p-4 text-gray-800 md:p-6 lg:p-8">
      <div className="mx-auto flex max-w-350 flex-col gap-6 lg:flex-row lg:flex-nowrap lg:gap-8">
        <aside className="hidden w-full shrink-0 lg:block lg:w-80">
          <EntranceFilters filters={filters} setFilters={setFilters} />
        </aside>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <EntranceFilters filters={filters} setFilters={setFilters} onClose={() => setShowMobileFilters(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <EntranceGrid filters={filters} setFilters={setFilters} onMobileFilterClick={() => setShowMobileFilters(true)} />
        </main>
      </div>
    </div>
  );
};

export default EntrancePage;
