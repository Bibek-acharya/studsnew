import React from "react";

export interface ScholarshipCardItem {
  id: number;
  title: string;
  provider: string;
  type: string;
  status: string;
  amount: string;
  location: string;
  eligibility: string;
  deadline: string;
  image: string;
  verified: boolean;
}

interface ScholarshipCardProps {
  item: ScholarshipCardItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  onDetails: (id: number) => void;
  onApply: (id: number, title: string, type: string) => void;
}

const ScholarshipListCard: React.FC<ScholarshipCardProps> = ({
  item,
  isBookmarked,
  onToggleBookmark,
  onDetails,
  onApply,
}) => {
  return (
    <div className="scholarship-card flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative h-48 w-full group">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(item.id);
          }}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full transition-all shadow-md ${
            isBookmarked ? "bg-red-500 text-white" : "bg-white/90 text-slate-400 hover:text-red-500"
          }`}
        >
          <i className={`${isBookmarked ? "fa-solid" : "fa-regular"} fa-heart`}></i>
        </button>
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
          <span className="rounded-lg bg-blue-600/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {item.type}
          </span>
          {item.verified && (
            <span className="flex items-center gap-1 rounded-lg bg-emerald-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              <i className="fa-solid fa-circle-check"></i>
              Verified
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-grow flex-col p-5">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#64748b]">
            {item.provider}
          </p>
          <span className={`text-[10px] font-black uppercase tracking-widest ${
            item.status === "OPEN" ? "text-emerald-600" : "text-rose-600"
          }`}>
            {item.status}
          </span>
        </div>
        <h3 className="mb-3 text-[17px] font-bold leading-tight text-slate-900 line-clamp-2">
          {item.title}
        </h3>

        <div className="mb-6 grid grid-cols-2 gap-y-4 gap-x-2 border-y border-slate-50 py-4">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <i className="fa-solid fa-coins text-[10px]"></i>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Value</p>
              <p className="text-[12px] font-bold text-slate-700">{item.amount}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-slate-50 text-slate-600">
              <i className="fa-solid fa-location-dot text-[10px]"></i>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Location</p>
              <p className="text-[12px] font-bold text-slate-700">{item.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 col-span-2">
            <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <i className="fa-solid fa-graduation-cap text-[10px]"></i>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Eligibility</p>
              <p className="text-[12px] font-bold text-slate-700">{item.eligibility}</p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="text-left">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Deadline</p>
            <p className="text-[12px] font-bold text-rose-600 flex items-center gap-1.5">
              <i className="fa-regular fa-clock"></i>
              {item.deadline}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onDetails(item.id)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm"
            >
              Details
            </button>
            <button
              onClick={() => onApply(item.id, item.title, item.type)}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-black active:scale-95 shadow-md shadow-slate-900/10 flex items-center gap-2"
            >
              Apply
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipListCard;
