import React from 'react';

const collegeTypes = [
    { label: 'Private', count: 250 },
    { label: 'Public / Govt', count: 50 },
    { label: 'Community', count: 20 },
    { label: 'Constituent', count: 15 },
    { label: 'Foreign Affiliated' }
];

const ByTypeAd: React.FC = () => {
  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 w-full border border-blue-100 shadow-xl shadow-blue-900/5 my-2 lg:my-4">
      <h2 className="text-indigo-950 text-2xl font-bold mb-8 tracking-tight text-center md:text-left">
        View colleges by the types
      </h2>
      <div className="flex flex-wrap justify-center md:justify-start gap-3.5">
        {collegeTypes.map((type, idx) => (
          <button key={idx} className="group bg-white border border-blue-200 rounded-full px-5 py-2.5 shadow-sm hover:shadow-md hover:border-blue-600 hover:bg-blue-600 transition-all duration-300 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer">
            <span className="text-indigo-900 font-semibold text-[15px] group-hover:text-white transition-colors">
              {type.label}
            </span>
            {type.count !== undefined && (
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
