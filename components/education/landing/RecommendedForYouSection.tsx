"use client";

import React from "react";

interface RecommendedForYouSectionProps {
  onNavigate: (view: string, data?: any) => void;
}

const RecommendedForYouSection: React.FC<RecommendedForYouSectionProps> = ({ onNavigate }) => {
  return (
    <section className="mt-16 sm:mt-20 md:mt-24 w-full mb-8 sm:mb-10 md:mb-12">
      <div className="max-w-350 mx-auto w-full ">
        {/* Banner Container */}
        <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl shadow-sm p-5 xs:p-6 sm:p-7 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {/* Left Column: Illustration */}
          <div className="w-full md:w-1/2 flex justify-center items-center order-2 md:order-1">
            <img
              src="https://i.pinimg.com/736x/b7/50/a5/b750a5280219942bd8d163bc262ec95e.jpg"
              alt="Student with bags"
              className="w-full max-w-[220px] xs:max-w-[250px] sm:max-w-[280px] lg:max-w-[380px] h-auto object-contain rounded-2xl"
              onError={(e: any) => {
                e.target.src = "https://placehold.co/400x400/f1f5f9/94a3b8?text=Illustration";
              }}
            />
          </div>

          {/* Right Column: Content and Actions */}
          <div className="w-full md:w-1/2 flex flex-col items-center text-center order-1 md:order-2">
            {/* Heading */}
            <h2 className="text-[26px] xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-[#0f3b21] tracking-tight mb-2 sm:mb-3">
              Not sure where to start?
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm xs:text-base sm:text-lg md:text-xl mb-5 sm:mb-6 max-w-lg leading-relaxed px-2">
              Tell us what matters most to you and we'll create a custom list of schools tailored to fit your needs.
            </p>

            {/* Buttons */}
            <div className="flex flex-col w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] gap-2.5 sm:gap-3">
              <button
                onClick={() => onNavigate("collegeQuiz")}
                className="bg-brand-blue hover:bg-[#0000CC] text-white font-medium py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl w-full text-sm xs:text-base sm:text-base md:text-lg shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
              >
                Take our College Quiz
              </button>

              <button
                onClick={() => onNavigate("collegeRecommenderTool")}
                className="bg-brand-blue hover:bg-[#0000CC] text-white font-medium py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl w-full text-sm xs:text-base sm:text-base md:text-lg shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
              >
                Try College Recommender
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedForYouSection;
