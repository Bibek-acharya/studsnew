"use client";

import React, { useEffect, useState } from "react";
import { X, Bell, Star } from "lucide-react";
import { RiWhatsappFill } from "react-icons/ri";

const LandingPopups = () => {
  const [showCommunity, setShowCommunity] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 0) {
        setShowCommunity(true);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {showCommunity && (
        <div
          id="community-card"
          className="fixed bottom-2 left-2 z-50 max-w-[calc(100vw-1rem)] rounded-md bg-white border border-gray-200 transition-all duration-300 animate-[slideUpLeft_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] xs:bottom-3 xs:left-3 xs:max-w-[calc(100vw-1.5rem)] sm:bottom-6 sm:left-4 sm:max-w-85 md:left-6"
        >
          <div className="absolute -top-2.5 sm:-top-3 -left-1.5 sm:-left-2 z-20">
            <span className="relative block overflow-hidden rounded-md bg-[#2563EB] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white xs:px-2.5 xs:py-1 xs:text-[11px] sm:px-3.5 sm:py-1.5 sm:text-[13px]">
              Join the Community!
              <span className="absolute top-0 left-0 h-1/2 w-1/2 animate-[shimmer_2s_infinite] bg-white/40 blur-xl"></span>
            </span>
          </div>

          <button
            onClick={() => setShowCommunity(false)}
            className="absolute top-0.5 right-1 z-10 p-0.5 text-gray-400 transition-colors hover:text-gray-600 xs:top-1 xs:right-1.5 xs:p-1 sm:top-2 sm:right-2 sm:p-1.5"
          >
            <X size={12} className="xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
          </button>

          <div className="flex p-2 pt-4 xs:p-3 xs:pt-5 sm:p-4 sm:pt-6">
            <div className="min-w-16 border-r border-gray-100 pr-2 xs:min-w-20 xs:pr-3 sm:min-w-25 sm:pr-4">
              <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-md border-2 border-white bg-gray-50 shadow-[0_2px_8px_rgba(0,0,0,0.08)] xs:h-12 xs:w-12 xs:border-3 sm:mb-2 sm:h-16 sm:w-16 sm:border-4">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://chat.whatsapp.com/HJOpX67y6eSKfKXWUaf1FB"
                  alt="QR Code"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-[9px] font-medium text-[#475569] xs:text-[10px] sm:text-[12px]">
                Scan QR
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-center pl-2 xs:pl-3 sm:pl-4">
              <div className="mb-1.5 flex items-center justify-between sm:mb-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-0.5 text-[11px] font-bold text-gray-800 xs:text-[13px] sm:gap-1 sm:text-[15px]">
                    4.9
                    <Star
                      size={8}
                      className="mb-0.5 text-[#FBBF24] fill-current xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3"
                    />
                  </div>
                  <span className="mt-0.5 text-[8px] font-medium text-[#94A3B8] xs:text-[9px] sm:text-[11px]">
                    10K+ Students
                  </span>
                </div>

                <div className="mx-0.5 h-5 w-px bg-gray-100 sm:mx-1 sm:h-7"></div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-0.5 text-[11px] font-bold text-gray-800 xs:text-[13px] sm:gap-1 sm:text-[15px]">
                    Daily
                    <Bell
                      size={8}
                      className="mb-0.5 text-[#94A3B8] xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3"
                    />
                  </div>
                  <span className="mt-0.5 text-[8px] font-medium text-[#94A3B8] xs:text-[9px] sm:text-[11px]">
                    Updates
                  </span>
                </div>
              </div>

              <div className="mb-1 h-px w-full bg-gray-100 xs:mb-1.5 sm:mb-2.5"></div>

              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[9px] font-medium text-[#94A3B8] xs:text-[10px] sm:text-[12px]">
                  Available on
                </span>
                <div className="flex gap-1 sm:gap-2">
                  <RiWhatsappFill className="h-3 w-3 cursor-pointer text-[#25D366] transition-transform hover:scale-110 xs:h-3.5 xs:w-3.5 sm:h-4.5 sm:w-4.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideUpLeft {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          50%, 100% { transform: translateX(200%) skewX(-20deg); }
        }
      `,
        }}
      />
    </>
  );
};

export default LandingPopups;
