"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Bell,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Star,
} from "lucide-react";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="-1 -1 26 26"
    aria-hidden="true"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2.5C7.03 2.5 3 6.44 3 11.3c0 1.74.53 3.41 1.53 4.82L3.5 21.5l5.53-1.04c1.26.67 2.68 1.02 4.05 1.02 4.97 0 9-3.94 9-8.78 0-4.86-4.03-8.78-9.08-8.78Zm0 16.02c-1.26 0-2.5-.32-3.57-.93l-.26-.15-3.27.62.69-3.1-.17-.27A6.67 6.67 0 0 1 5.4 11.3c0-3.69 3.37-6.69 7.6-6.69 4.28 0 7.76 2.98 7.76 6.69 0 3.69-3.48 6.69-7.76 6.69Zm4.42-4.82c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.55.12-.17.24-.63.78-.77.94-.14.16-.28.18-.52.06-.24-.12-1.02-.36-1.94-1.14-.72-.62-1.2-1.38-1.34-1.62-.14-.24-.02-.37.1-.49.1-.1.24-.27.36-.41.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.31-.75-1.8-.2-.48-.4-.41-.55-.42h-.48c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.18.87 2.32.99 2.48.12.16 1.69 2.56 4.1 3.58.57.24 1.01.38 1.36.49.57.18 1.09.15 1.5.09.46-.07 1.43-.58 1.63-1.15.2-.57.2-1.06.14-1.15-.06-.1-.22-.16-.46-.28Z"
      fill="currentColor"
    />
  </svg>
);

const LandingPopups = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    isError?: boolean;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const showToastMsg = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDismissNotification = (isSubscribe = false) => {
    setShowNotification(false);

    if (!isSubscribe) {
      // Toast message removed as per user request
    }

    setTimeout(() => {
      setShowCommunity(true);
    }, 500);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

    if (!email || !isValidEmail(email)) {
      setEmailError(true);
      return;
    }

    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      showToastMsg("Successfully subscribed to Studsphere!");
      handleDismissNotification(true);
      setEmail("");
    }, 1200);
  };

  return (
    <>
      {/* Subscription Card */}
      {showNotification && (
        <div
          id="notificationCard"
          className="fixed inset-0 z-120 flex items-center justify-center rounded-none border-0 bg-white/95 p-4 shadow-2xl animate-[slideDownFade_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] sm:inset-auto sm:top-24 sm:right-4 sm:w-[calc(100%-2rem)] sm:max-w-152 sm:rounded-lg sm:bg-white sm:p-5 md:right-6 md:w-auto"
        >
          <button
            onClick={() => handleDismissNotification()}
            className="absolute -top-1 right-3 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 z-10 sm:top-3"
          >
            <X size={16} />
          </button>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch max-w-md sm:max-w-none mx-auto sm:mx-0 w-full">
            <div className="relative h-25 w-full overflow-hidden rounded-md bg-white xs:h-30 sm:h-auto sm:w-5/12">
              <img
                src="https://i.pinimg.com/1200x/3a/fb/b4/3afbb44483a17d2066cd941fd8cfe571.jpg"
                alt="Students studying"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="w-full sm:w-7/12 flex flex-col justify-between pt-0 sm:pt-1 pb-1">
              <div>
                <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 leading-snug pr-6 sm:pr-0">
                  Subscribe to Studsphere for advice and tips on your uni
                  search.
                </h2>
                <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-500 mt-1 sm:mt-1.5">
                  You can disable anytime.
                </p>
                <form
                  onSubmit={handleSubscribe}
                  className="mt-3 sm:mt-4 w-full"
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#4f46e5] transition-colors">
                      <Mail size={14} className="sm:w-4 sm:h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(false);
                      }}
                      placeholder="name@example.com"
                      className={`w-full pl-8 sm:pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-900 bg-gray-50/50 border ${emailError ? "border-red-300 ring-red-200" : "border-gray-200 focus:border-brand-blue"} rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 transition-all duration-200 placeholder-gray-400 shadow-sm hover:border-gray-300 ${emailError ? "animate-[shake_0.2s_ease-in-out_infinite]" : ""}`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-red-500 text-[10px] xs:text-xs mt-1 sm:mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                      Please enter a valid email address.
                    </p>
                  )}
                  <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row justify-end items-center gap-2">
                    <button
                      type="submit"
                      disabled={isSubscribing}
                      className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] active:transform active:scale-95 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center"
                    >
                      {isSubscribing ? (
                        <>
                          <Loader2
                            size={14}
                            className="animate-spin mr-2 sm:w-4 sm:h-4"
                          />
                          Subscribing...
                        </>
                      ) : (
                        "Subscribe"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Card */}
      {showCommunity && (
        <div
          id="community-card"
          className="fixed bottom-4 left-3 z-50 w-full max-w-75 rounded-lg bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-all duration-300 animate-[slideUpLeft_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] xs:max-w-80 sm:bottom-6 sm:left-4 sm:max-w-85 md:left-6"
        >
          <div className="absolute -top-2.5 sm:-top-3 -left-1.5 sm:-left-2 z-20">
            <span className="relative overflow-hidden bg-[#2563EB] text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-bold text-[11px] xs:text-[12px] sm:text-[13px] shadow-sm block tracking-wider">
              Join the Community!
              <span className="absolute top-0 left-0 w-1/2 h-1/2 bg-white/40 blur-xl animate-[shimmer_2s_infinite]"></span>
            </span>
          </div>
          <button
            onClick={() => setShowCommunity(false)}
            className="absolute -top-1 right-1.5 sm:top-2 sm:right-2 text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-1.5 z-10"
          >
            <X size={14} className="sm:w-4 sm:h-4" />
          </button>
          <div className="flex p-3 sm:p-4 pt-5 sm:pt-6">
            <div className="min-w-20 flex flex-col items-center justify-center border-r border-gray-100 pr-3 xs:min-w-22.5 sm:min-w-25 sm:pr-4">
              <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 mb-1.5 sm:mb-2 bg-gray-50 flex items-center justify-center border-3 sm:border-4 border-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-md">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://chat.whatsapp.com/studsphere"
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[#475569] text-[10px] xs:text-[11px] sm:text-[12px] font-medium">
                Scan the QR
              </span>
            </div>
            <div className="flex flex-col flex-1 pl-3 sm:pl-4 justify-center">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-0.5 sm:gap-1 font-bold text-gray-800 text-[13px] xs:text-[14px] sm:text-[15px]">
                    4.9{" "}
                    <Star
                      size={10}
                      className="sm:w-3 sm:h-3 text-[#FBBF24] fill-current mb-0.5"
                    />
                  </div>
                  <span className="text-[#94A3B8] text-[9px] xs:text-[10px] sm:text-[11px] font-medium mt-0.5">
                    10K+ Students
                  </span>
                </div>
                <div className="w-px h-5 sm:h-7 bg-gray-100 mx-0.5 sm:mx-1"></div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-0.5 sm:gap-1 font-bold text-gray-800 text-[13px] xs:text-[14px] sm:text-[15px]">
                    Daily{" "}
                    <Bell
                      size={10}
                      className="sm:w-3 sm:h-3 text-[#94A3B8] mb-0.5"
                    />
                  </div>
                  <span className="text-[#94A3B8] text-[9px] xs:text-[10px] sm:text-[11px] font-medium mt-0.5">
                    Updates & Info
                  </span>
                </div>
              </div>
              <div className="w-full h-px bg-gray-100 mb-1.5 sm:mb-2.5"></div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[#94A3B8] text-[10px] xs:text-[11px] sm:text-[12px] font-medium">
                  Available on
                </span>
                <div className="flex gap-1.5 sm:gap-2">
                  <WhatsAppIcon className="h-3.5 w-3.5 cursor-pointer text-[#25D366] transition-transform hover:scale-110 xs:h-4 xs:w-4 sm:h-4.5 sm:w-4.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-110 flex max-w-[90vw] -translate-x-1/2 transform items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-800 px-4 py-2 text-xs font-medium text-white shadow-lg animate-[slideUp_0.3s_ease-out] sm:bottom-10 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm">
          {toast.isError ? (
            <AlertCircle
              size={14}
              className="h-4.5 w-4.5 shrink-0 text-red-400"
            />
          ) : (
            <CheckCircle2
              size={14}
              className="h-4.5 w-4.5 shrink-0 text-green-400"
            />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideDownFade {
          0% { opacity: 0; transform: translateY(-50px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideUpLeft {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
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
