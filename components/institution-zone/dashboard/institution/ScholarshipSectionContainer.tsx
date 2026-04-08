import React from "react";

const ScholarshipSectionContainer: React.FC = () => {
  return (
    <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-100 min-h-125 flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-slate-800">
        Scholarship Management
      </h2>
      <p className="mt-2 text-slate-500 max-w-sm">
        Manage internal scholarship allocations and institutional programs.
      </p>
    </div>
  );
};

export default ScholarshipSectionContainer;
