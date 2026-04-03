import React from "react";

export const CourseCarouselAd: React.FC = () => (
  <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl">
      <i className="fa-solid fa-graduation-cap"></i>
    </div>
    <div className="flex-1 text-center md:text-left">
      <h3 className="text-lg font-bold text-blue-900 mb-1 tracking-tight">Discover Top-Rated Courses</h3>
      <p className="text-sm text-blue-700 font-medium">Explore over 2,000 academic programs tailored to your career goals.</p>
    </div>
    <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
      View All
    </button>
  </div>
);
