"use client";

import React, { useState, useEffect } from "react";
import { X, Mail, Bell, CheckCircle2, AlertCircle, Loader2, Star } from "lucide-react";

const LandingPopups = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  useEffect(() => {
    // Show notification popup after a short delay
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
      showToastMsg("We'll remind you later!");
    }

    // Show community card after a short delay when notification is dismissed
    setTimeout(() => {
      setShowCommunity(true);
    }, 500);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

    if (!email || !isValidEmail(email)) {
      setEmailError(true);
      return;
    }

    setIsSubscribing(true);
    // Simulate API call
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
          className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 lg:translate-y-0 lg:translate-x-0 lg:left-auto lg:top-24 lg:right-6 z-[120] bg-white rounded-lg border border-gray-100 max-w-[38rem] w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] p-4 sm:p-5 shadow-2xl animate-[slideDownFade_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]"
        >
          <button 
            onClick={() => handleDismissNotification()}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 z-10"
          >
            <X size={16} />
          </button>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch">
            <div className="w-full sm:w-5/12 relative rounded-md overflow-hidden h-[120px] sm:h-auto bg-white">
              <img 
                src="https://i.pinimg.com/1200x/3a/fb/b4/3afbb44483a17d2066cd941fd8cfe571.jpg" 
                alt="Students studying" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="w-full sm:w-7/12 flex flex-col justify-between pt-1 pb-1">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug pr-6 sm:pr-0">
                  Subscribe to Studsphere for advice and tips on your uni search.
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1.5">You can disable anytime.</p>
                <form onSubmit={handleSubscribe} className="mt-4 w-full">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#4f46e5] transition-colors">
                      <Mail size={16} />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(false);
                      }}
                      placeholder="name@example.com" 
                      className={`w-full pl-9 pr-3 py-2 text-sm text-gray-900 bg-gray-50/50 border ${emailError ? 'border-red-300 ring-red-200' : 'border-gray-200 focus:border-brand-blue'} rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 transition-all duration-200 placeholder-gray-400 shadow-sm hover:border-gray-300 ${emailError ? 'animate-[shake_0.2s_ease-in-out_infinite]' : ''}`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle size={14} />
                      Please enter a valid email address.
                    </p>
                  )}
                  <div className="mt-4 sm:mt-6 flex flex-col-reverse sm:flex-row justify-end items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => handleDismissNotification()}
                      className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-600 bg-transparent hover:bg-gray-100 rounded-md transition-all duration-200 border border-gray-200 sm:border-transparent"
                    >
                      Remind me later
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubscribing}
                      className="w-full sm:w-auto px-5 py-2.5 sm:py-2 text-sm font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] active:transform active:scale-95 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center"
                    >
                      {isSubscribing ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Subscribing...
                        </>
                      ) : "Subscribe"}
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
          className="fixed bottom-6 left-4 sm:left-6 z-50 bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] max-w-[340px] w-full border border-gray-100 transition-all duration-300 animate-[slideUpLeft_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]"
        >
          <div className="absolute -top-3 -left-2 z-20">
            <span className="relative overflow-hidden bg-[#2563EB] text-white px-3.5 py-1.5 rounded-lg font-bold text-[13px] shadow-sm block tracking-wider">
              Join the Community!
              <span className="absolute top-0 left-0 w-1/2 h-1/2 bg-white/40 blur-xl animate-[shimmer_2s_infinite]"></span>
            </span>
          </div>
          <button 
            onClick={() => setShowCommunity(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1.5 z-10"
          >
            <X size={16} />
          </button>
          <div className="flex p-4 pt-6">
            <div className="flex flex-col items-center justify-center pr-4 border-r border-gray-100 min-w-[100px]">
              <div className="w-16 h-16 mb-2 bg-gray-50 flex items-center justify-center border-4 border-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-md">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://chat.whatsapp.com/studsphere" 
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[#475569] text-[12px] font-medium">Scan the QR</span>
            </div>
            <div className="flex flex-col flex-1 pl-4 justify-center">
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 font-bold text-gray-800 text-[15px]">
                    4.9 <Star size={12} className="text-[#FBBF24] fill-current mb-0.5" />
                  </div>
                  <span className="text-[#94A3B8] text-[11px] font-medium mt-0.5">10K+ Students</span>
                </div>
                <div className="w-px h-7 bg-gray-100 mx-1"></div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 font-bold text-gray-800 text-[15px]">
                    Daily <Bell size={12} className="text-[#94A3B8] mb-0.5" />
                  </div>
                  <span className="text-[#94A3B8] text-[11px] font-medium mt-0.5">Updates & Info</span>
                </div>
              </div>
              <div className="w-full h-px bg-gray-100 mb-2.5"></div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#94A3B8] text-[12px] font-medium">Available on</span>
                <div className="flex gap-2">
                  <i className="fa-brands fa-whatsapp text-[#25D366] text-[18px] cursor-pointer hover:scale-110 transition-transform"></i>
                  <i className="fa-brands fa-viber text-[#6d28d9] text-[18px] cursor-pointer hover:scale-110 transition-transform"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg z-[110] flex items-center gap-2 whitespace-nowrap animate-[slideUp_0.3s_ease-out]">
          {toast.isError ? <AlertCircle size={18} className="text-red-400" /> : <CheckCircle2 size={18} className="text-green-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />
    </>
  );
};

export default LandingPopups;
