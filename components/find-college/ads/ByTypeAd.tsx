import React from 'react';
import { useCollegeTypeCounts } from '@/services/collegeAdApi';

const titleCase = (value: string) =>
  value
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

const labelForType = (raw: string): string => {
  const v = (raw || '').toLowerCase();
  if (v.includes('private')) return 'Private';
  if (v.includes('community')) return 'Community';
  if (v.includes('constituent')) return 'Constituent';
  if (v.includes('foreign')) return 'Foreign Affiliated';
  if (v.includes('public') || v.includes('gov')) return 'Public / Govt';
  return titleCase(raw);
};

const ByTypeAd: React.FC = () => {
  const { data, isLoading, isError } = useCollegeTypeCounts();

  if (isLoading || isError) return null;
  if (!data || data.length === 0) return null;

  const collegeTypes = data.map((entry) => ({
    label: labelForType(entry.type),
    count: Number(entry.count) || 0,
  }));

  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-md p-8 w-full border border-blue-100 shadow-xl shadow-blue-900/5 my-2 lg:my-4">
      <h2 className="text-indigo-950 text-2xl font-bold mb-8 tracking-tight text-center md:text-left">
        View colleges by the types
      </h2>
      <div className="flex flex-wrap justify-center md:justify-start gap-3.5">
        {collegeTypes.map((type, idx) => (
          <button key={idx} className="group bg-white border border-blue-200 rounded-full px-5 py-2.5  hover: hover:border-blue-600 hover:bg-blue-600 transition-all duration-300 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer">
            <span className="text-indigo-900 font-semibold text-[15px] group-hover:text-white transition-colors">
              {type.label}
            </span>
            {type.count > 0 && (
              <span className="text-blue-500 font-medium text-[15px] group-hover:text-blue-100 transition-colors">
                ({type.count})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ByTypeAd;
