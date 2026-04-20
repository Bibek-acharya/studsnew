"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InstitutionHeader from "./InstitutionHeader";
import { Eye, EyeOff } from "lucide-react";

export default function InstitutionZone() {
  const [activeTab, setActiveTab] = useState<
    "advertise" | "login" | "register"
  >("login");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <div className="bg-white min-h-screen flex flex-col relative">
        <InstitutionHeader />

        {/* Hero Content */}
        <main className="flex-1 flex items-center justify-center w-full pb-12 lg:pb-20 pt-24">
          <div className="max-w-350 w-full mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            <div className="flex-1 text-black w-full max-w-2xl text-center lg:text-left pt-6 lg:pt-0">
              <h1 className="text-4xl lg:text-[4rem] font-bold leading-[1.15] mb-6">
                Simplify Admissions, Applications<span className="text-brand-blue"> & Student Engagement </span>
              </h1>
              <p className="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 font-semibold">
                Promote your programs, facilities, and opportunities to students
                across Nepal and beyond.
              </p>
            </div>

            {/* Form Container */}
            <div className="w-full max-w-115">
              <div className="bg-white rounded-md p-8 sm:p-10 relative text-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500 border border-gray-200">
                <div className="flex p-1.5 bg-[#F1F3F5] rounded-md mb-8 relative">
                  <button
                    onClick={() => setActiveTab("advertise")}
                    className={`flex-1 py-2.5 text-[15px] font-semibold transition-all rounded-md ${activeTab === "advertise" ? "text-white bg-brand-blue  z-10" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    Advertise with us
                  </button>
                  <button
                    onClick={() => setActiveTab("login")}
                    className={`flex-1 py-2.5 text-[15px] font-bold transition-all rounded-md ${activeTab !== "advertise" ? "text-white bg-brand-blue  z-10" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    Register/Log in
                  </button>
                </div>

                {/* Advertise Form */}
                {activeTab === "advertise" && (
                  <form className="space-y-4 animate-in fade-in duration-300">
                    <input
                      type="text"
                      placeholder="Full name"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-md focus:border-brand-blue focus:ring-0 focus:ring-brand-blue outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile number"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-md focus:border-brand-blue outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Work email"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-md focus:border-brand-blue outline-none"
                    />
                    <div className="pt-1 pb-1">
                      <label className="block text-[13px] font-medium text-gray-600 uppercase mb-3">
                        Advertise for
                      </label>
                      <div className="flex gap-3">
                        <label className="flex-1 cursor-pointer group">
                          <input
                            type="radio"
                            name="advertise_for"
                            className="peer sr-only"
                            defaultChecked
                          />
                          <div className="text-center py-2.5 border border-gray-200 rounded-md text-gray-500 peer-checked:border-brand-blue peer-checked:text-gray-800 transition-all">
                            Your college
                          </div>
                        </label>
                        <label className="flex-1 cursor-pointer group">
                          <input
                            type="radio"
                            name="advertise_for"
                            className="peer sr-only"
                          />
                          <div className="text-center py-2.5 border border-gray-200 rounded-md text-gray-500 peer-checked:border-brand-blue peer-checked:text-gray-800 transition-all">
                            Your consultancy
                          </div>
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-4 bg-brand-blue border-2 border-brand-blue text-white font-semibold py-3.5 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Request callback
                    </button>
                  </form>
                )}

                {/* Login Form */}
                {activeTab === "login" && (
                  <div className="animate-in fade-in duration-300">
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        router.push("/institution-zone/dashboard");
                      }}
                    >
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3.5 bg-white border border-[#D5DCE8] rounded-md focus:bg-white focus:border-brand-blue focus:ring-0 outline-none"
                      />
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="w-full px-4 py-3.5 pr-12 bg-white border border-[#D5DCE8] rounded-md focus:bg-white focus:border-brand-blue outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <div className="flex justify-end pt-1">
                        <Link
                          href="#"
                          className="text-[15px] text-brand-blue font-semibold hover:text-brand-hover transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-brand-blue hover:bg-brand-hover cursor-pointer text-white font-bold py-3.5 rounded-md transition-colors"
                      >
                        Log in
                      </button>

                      <div className="flex items-center my-6">
                        <div className="grow border-t border-gray-200"></div>
                        <span className="px-4 text-xs text-gray-400 font-semibold uppercase">
                          Or
                        </span>
                        <div className="grow border-t border-gray-200"></div>
                      </div>

                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-[15px] font-semibold text-gray-700 py-3.5 rounded-md cursor-pointer hover:text-brand-blue transition-all"
                      >
                        <Image
                          src="/google-icon.svg"
                          alt="Google"
                          width={18}
                          height={18}
                          className="w-4.5 h-4.5"
                        />
                        Log in with Google
                      </button>
                    </form>
                    <div className="mt-8 text-center text-[15px] text-gray-500 font-medium">
                      Don&rsquo;t have a registered email?{" "}
                      <button
                        onClick={() => setActiveTab("register")}
                        className="text-brand-blue font-semibold hover:underline hover:text-brand-hover transition-colors cursor-pointer"
                      >
                        Create account
                      </button>
                    </div>
                  </div>
                )}

                {/* Register Form */}
                {activeTab === "register" && (
                  <div className="animate-in fade-in duration-300">
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        router.push("/institution-zone/dashboard");
                      }}
                    >
                      <input
                        type="text"
                        placeholder="College name"
                        className="w-full px-4 py-3.5 bg-[#EEF2F6] border border-[#D5DCE8] rounded-md focus:bg-white focus:border-brand-blue outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Institution registration number"
                        className="w-full px-4 py-3.5 bg-[#EEF2F6] border border-[#D5DCE8] rounded-md focus:bg-white focus:border-brand-blue outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Work email"
                        className="w-full px-4 py-3.5 bg-[#EEF2F6] border border-[#D5DCE8] rounded-md focus:bg-white focus:border-brand-blue outline-none"
                      />
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create password"
                          className="w-full px-4 py-3.5 pr-12 bg-[#EEF2F6] border border-[#D5DCE8] rounded-md focus:bg-white focus:border-brand-blue outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="w-full mt-6 bg-brand-blue hover:bg-brand-hover text-white font-bold py-3.5 rounded-md transition-colors"
                      >
                        Sign up
                      </button>
                    </form>
                    <div className="mt-8 text-center text-[15px] text-gray-500 font-medium">
                      Already have an account?{" "}
                      <button
                        onClick={() => setActiveTab("login")}
                        className="text-brand-blue font-semibold hover:underline hover:text-brand-hover transition-colors cursor-pointer"
                      >
                        Log in
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
