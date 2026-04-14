import React, { useState, useEffect, useRef } from "react";

const CoursesHero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ratings = [
    { emoji: "😊", label: "Love", color: "bg-emerald-400" },
    { emoji: "🙂", label: "Good", color: "bg-lime-400" },
    { emoji: "😐", label: "Neutral", color: "bg-yellow-400" },
    { emoji: "🙁", label: "Poor", color: "bg-orange-400" },
    { emoji: "😠", label: "Hate", color: "bg-rose-400" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for courses: ${searchQuery}`);
    }
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(
      () => setIsFeedbackExpanded(false),
      3000,
    );
  };

  const toggleFeedback = () => {
    setIsFeedbackExpanded(!isFeedbackExpanded);
    if (!isFeedbackExpanded) resetInactivityTimer();
  };

  const handleInteraction = () => {
    if (isFeedbackExpanded) resetInactivityTimer();
  };

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden min-h-150 flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1523050335392-495619989da1?q=80&w=2000&auto=format&fit=crop"
          alt="Library Study"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Curved Blue Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(37, 99, 235, 0.78)"
            d="M0,0 L0,600 L1200,1300 Q1100,1200 1200,800 Q1000,0 500,0 Z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 w-full animate-fadeInUp">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
            Discover the <br />
            <span className="text-white">Right Course</span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-medium leading-relaxed">
            Personalize your career path with 2,000+ academic programs. Filter
            by level, field, and eligibility to find your perfect match.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="relative max-w-2xl mb-8 group"
          >
            <div className="flex items-center bg-white rounded-full shadow-2xl overflow-hidden p-1.5 border border-white/20">
              <div className="pl-6 text-slate-400">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search programs e.g. B.Sc CSIT, MBA..."
                className="flex-1 py-4 px-4 text-slate-800 text-lg border-0 outline-none placeholder-slate-400 font-bold"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 font-black rounded-full transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Stats/Links */}
          <div className="flex flex-wrap items-center gap-6 text-white/80">
            <span className="text-xs font-black uppercase tracking-widest opacity-60">
              Popular Searches:
            </span>
            <button className="text-sm font-bold border-b border-white/20 hover:border-white transition-colors">
              Computer Science
            </button>
            <button className="text-sm font-bold border-b border-white/20 hover:border-white transition-colors">
              Business Mgmt
            </button>
            <button className="text-sm font-bold border-b border-white/20 hover:border-white transition-colors">
              Medical Science
            </button>
          </div>
        </div>
      </div>

      {/* Floating Feedback Tab (Right Side) */}
      <div
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-100 transition-all duration-500 ease-in-out transform ${isFeedbackExpanded ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex relative items-center">
          {/* Vertical Label Tab */}
          <button
            onClick={toggleFeedback}
            className="absolute left-0 -translate-x-full bg-blue-600 text-white px-3 py-10 flex flex-col items-center justify-center rounded-l-2xl shadow-2xl hover:bg-blue-700 transition-colors"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] [writing-mode:vertical-lr] rotate-180 mb-2">
              Feedback
            </span>
            <i
              className={`fa-solid fa-chevron-${isFeedbackExpanded ? "right" : "left"} text-xs`}
            ></i>
          </button>

          {/* Expanded Panel */}
          <div
            onMouseMove={handleInteraction}
            className="bg-white p-8 w-80 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-slate-100"
          >
            <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-6 text-center">
              Rate your experience
            </h3>
            <div className="flex justify-between gap-2 mb-8">
              {ratings.map((rating, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedRating(idx);
                    handleInteraction();
                  }}
                  className={`w-12 h-12 rounded-full ${rating.color} flex items-center justify-center text-2xl transition-all hover:scale-110 shadow-sm ${selectedRating === idx ? "ring-4 ring-blue-500 ring-offset-2 scale-110" : ""}`}
                >
                  {rating.emoji}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-300 px-1 mb-8">
              <span>Love</span>
              <span>Hate</span>
            </div>
            <button
              onClick={() => setIsFeedbackExpanded(false)}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>

      {/* Website Link Chip */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full shadow-2xl border border-white/50 flex items-center gap-3 animate-fadeIn">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
            course-finder.ss
          </span>
        </div>
      </div>
    </section>
  );
};

export default CoursesHero;
