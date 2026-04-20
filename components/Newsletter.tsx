"use client";

import React, { useState } from "react";

interface NewsletterProps {
  className?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({ className = "" }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email address is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    // Success state
    setIsSubscribed(true);
    setError(null);
    const originalEmail = email;
    setEmail("");

    setTimeout(() => {
      setIsSubscribed(false);
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  return (
    <section className={`bg-[#0000ff] rounded-md p-4 sm:p-8 lg:p-12 flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 w-full ${className}`}>
      {/* Left Text Content */}
      <div className="flex-1 max-w-lg flex flex-col justify-center">
        <h2 className="text-white text-4xl sm:text-5xl font-semibold leading-tight tracking-tight mb-5">
          Subscribe our<br/>newsletter
        </h2>
        <p className="text-[#b3b3ff] text-sm sm:text-base leading-relaxed pr-0 lg:pr-8">
          Empowering learners globally with advanced tools, community support, and career-defining opportunities. Join our growing ecosystem today.
        </p>
      </div>

      {/* Right Form Content */}
      <div className="flex-1 max-w-md flex flex-col justify-center w-full lg:ml-auto">
        <label htmlFor="email" className="text-[#b3b3ff] text-sm mb-3 block">
          Stay up to date
        </label>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full" noValidate>
          <div className="relative flex-1 w-full sm:w-auto group">
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={handleInputChange}
              placeholder="Enter your email address" 
              className={`w-full bg-transparent border-2 ${
                error 
                  ? "border-[#ff8080] bg-[#ff8080]/10" 
                  : "border-white/50 focus:border-white focus:bg-white/5"
              } text-white placeholder-white/60 px-6 py-4 rounded-full outline-none transition-all duration-300 text-sm sm:text-base`}
            />
            {/* Custom Error Message with Icon & Animation */}
            <div 
              className={`absolute -bottom-7 left-4 flex items-center gap-1.5 text-[#ff8080] text-xs font-medium transition-all duration-300 pointer-events-none ${
                error ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
          <button 
            type="submit" 
            className={`${
              isSubscribed ? "bg-green-500 text-white" : "bg-white text-[#0000ff] hover:bg-gray-100"
            } font-semibold px-8 py-4 rounded-full focus:ring-4 focus:ring-white/50 transition-all whitespace-nowrap text-sm sm:text-base active:scale-95 transform`}
          >
            {isSubscribed ? "Subscribed!" : "Subscribe"}
          </button>
        </form>

        <p className="text-[#b3b3ff]/80 text-xs mt-7 sm:mt-5">
          By subscribing you agree to our 
          <a href="#" className="underline hover:text-white transition-colors ml-1">Privacy Policy</a>
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
