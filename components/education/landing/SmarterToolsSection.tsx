"use client";

interface SmarterToolsSectionProps {
  onNavigate: (view: string, data?: any) => void;
}

const SmarterToolsSection: React.FC<SmarterToolsSectionProps> = ({ onNavigate }) => (
<section className="w-full py-8 sm:py-10 md:py-12 lg:py-16">
  <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
  <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
    <h2 className="text-[24px] xs:text-[28px] sm:text-3xl md:text-[36px] lg:text-[40px] font-bold text-[#0f172a] mb-3 sm:mb-4 tracking-tight">
      Smarter Tools, Greater Success
    </h2>
    <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] text-gray-600 max-w-2xl mx-auto px-2">
      Make better decisions with the right resources at your fingertips.
    </p>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 xl:gap-8">
    <div
      className="bg-white rounded-2xl p-5 sm:p-6 md:p-7 flex flex-col h-full hover:-translate-y-1 hover:border hover:border-gray-200 transition-all duration-300 cursor-pointer"
      onClick={() => onNavigate("collegeRecommenderTool")}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#e6f7ec] flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#1dc05c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mb-2 sm:mb-3">College Recommender</h3>
      <p className="text-gray-500 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed mb-6 sm:mb-8 flex-grow">
        Filter thousands of institutions by location, major, tuition, and ranking to find your perfect match.
      </p>
      <button className="w-full bg-[#24c75e] hover:bg-[#1fb354] text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-colors duration-200 text-[13px] sm:text-[14px] md:text-[15px]">
        Find My Match
      </button>
    </div>

    <div
      className="bg-white rounded-2xl p-5 sm:p-6 md:p-7 shadow-[0_2px_15px_rgba(0,0,0,0.06)] flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
      onClick={() => onNavigate("compareColleges")}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#e7f0ff] flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#0000FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mb-2 sm:mb-3">Compare College</h3>
      <p className="text-gray-500 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed mb-6 sm:mb-8 flex-grow">
        Filter thousands of institutions by location, major, tuition, and ranking to find your perfect match.
      </p>
      <button className="w-full bg-[#0000FF] hover:bg-[#0000CC] text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-colors duration-200 text-[13px] sm:text-[14px] md:text-[15px]">
        Start Comparison
      </button>
    </div>

    <div
      className="bg-white rounded-2xl p-5 sm:p-6 md:p-7 shadow-[0_2px_15px_rgba(0,0,0,0.06)] flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
      onClick={() => onNavigate("scholarshipFinderTool")}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#fdf6e3] flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#dfac1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mb-2 sm:mb-3">Scholarship Finder</h3>
      <p className="text-gray-500 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed mb-6 sm:mb-8 flex-grow">
        Filter thousands of institutions by location, major, tuition, and ranking to find your perfect match.
      </p>
      <button className="w-full bg-[#ebb316] hover:bg-[#d9a512] text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-colors duration-200 text-[13px] sm:text-[14px] md:text-[15px]">
        Search Funding
      </button>
    </div>

    <div
      className="bg-white rounded-2xl p-5 sm:p-6 md:p-7 shadow-[0_2px_15px_rgba(0,0,0,0.06)] flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
      onClick={() => onNavigate("courseFinder")}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#fceced] flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#ef5e61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mb-2 sm:mb-3">Courses Finder</h3>
      <p className="text-gray-500 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed mb-6 sm:mb-8 flex-grow">
        Filter thousands of institutions by location, major, tuition, and ranking to find your perfect match.
      </p>
      <button className="w-full bg-[#f04f53] hover:bg-[#e04044] text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-colors duration-200 text-[13px] sm:text-[14px] md:text-[15px]">
        Explore Courses
      </button>
    </div>
  </div>
  </div>
</section>
);

export default SmarterToolsSection;
