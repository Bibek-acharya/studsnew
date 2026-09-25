import React from 'react';
import { useCollegeTypeCounts } from '@/services/collegeAdApi';

export type CollegeTypeFilterId =
  | 'ct_private'
  | 'ct_public'
  | 'ct_community'
  | 'ct_constituent'
  | 'ct_foreign';

interface ByTypeAdProps {
  onSelectType: (type: CollegeTypeFilterId) => void;
}

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

const typeIdForLabel = (raw: string): CollegeTypeFilterId | null => {
  const normalized = (raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  if (!normalized) return null;
  if (normalized.includes('private')) return 'ct_private';
  if (normalized.includes('community')) return 'ct_community';
  if (normalized.includes('constituent')) return 'ct_constituent';
  if (normalized.includes('foreign')) return 'ct_foreign';
  if (
    normalized.includes('public') ||
    normalized.includes('government') ||
    /\bgovt?\b/.test(normalized)
  ) {
    return 'ct_public';
  }

  return null;
};

const ByTypeAd: React.FC<ByTypeAdProps> = ({ onSelectType }) => {
  const { data, isLoading, isError } = useCollegeTypeCounts();

  if (isLoading || isError) return null;
  if (!data || data.length === 0) return null;

  const collegeTypes = data.flatMap((entry) => {
    const id = typeIdForLabel(entry.type);
    return id
      ? [
          {
            label: labelForType(entry.type),
            count: Number(entry.count) || 0,
            id,
          },
        ]
      : [];
  });

  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-md p-8 w-full border border-blue-100 shadow-xl shadow-blue-900/5 my-2 lg:my-4">
      <h2 className="text-indigo-950 text-2xl font-bold mb-8 tracking-tight text-center md:text-left">
        View colleges by the types
      </h2>
      <div className="flex flex-wrap justify-center md:justify-start gap-3.5">
        {collegeTypes.map((type, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => onSelectType(type.id)}
            className="group bg-white border border-blue-200 rounded-full px-5 py-2.5  hover: hover:border-blue-600 hover:bg-blue-600 transition-all duration-300 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
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
