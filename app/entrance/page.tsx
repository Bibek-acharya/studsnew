"use client";

import React from "react";
import EntranceFilters from "@/components/entrance/EntranceFilters";
import EntranceGrid from "@/components/entrance/EntranceGrid";
import { EntranceFilterState, DEFAULT_ENTRANCE_FILTERS } from "@/app/entrance/types";

const EntrancePage: React.FC = () => {
  const [filters, setFilters] = React.useState<EntranceFilterState>(DEFAULT_ENTRANCE_FILTERS);

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-[Inter,sans-serif] text-gray-800 md:p-6 lg:p-8">
      <div className="mx-auto flex max-w-350 flex-col gap-6 lg:flex-row lg:flex-nowrap lg:gap-8">
        <aside className="w-full shrink-0 lg:w-[300px]">
          <EntranceFilters filters={filters} setFilters={setFilters} />
        </aside>
        <main className="min-w-0 flex-1">
          <EntranceGrid filters={filters} setFilters={setFilters} />
        </main>
      </div>
    </div>
  );
};

export default EntrancePage;
