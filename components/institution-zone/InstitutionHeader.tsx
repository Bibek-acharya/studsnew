"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Mail, Phone } from "lucide-react";

export default function InstitutionHeader() {
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-white py-6 lg:py-8">
      <div className="max-w-350 mx-auto px-6 flex items-center justify-between text-black">
        <Link href="/" className="lg:flex-1 text-2xl font-bold tracking-tight">
          <Image
            src="/studsphere.png"
            alt="Studsphere Logo"
            width={140}
            height={40}
            className="object-contain"
          />
        </Link>

        <nav className="hidden lg:flex lg:flex-1 justify-center items-center gap-8 text-[15px] font-medium relative">
          <Link
            href="/institution-zone#services"
            className="hover:text-brand-blue transition-colors"
          >
            Services
          </Link>
          <Link
            href="/institution-zone#testimonials"
            className="hover:text-brand-blue transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="/institution-zone/pricing"
            className="hover:text-brand-blue transition-colors"
          >
            Pricing
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowContactDropdown(!showContactDropdown)}
              className="hover:text-brand-blue cursor-pointer transition-colors focus:outline-none flex items-center gap-1"
            >
              Contact us
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showContactDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showContactDropdown && (
              <>
                <div
                  className="fixed inset-0 z-[-1] "
                  onClick={() => setShowContactDropdown(false)}
                ></div>
                <div className="absolute left-1/2 -translate-x-1/2 top-10 z-50 w-120 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 rounded-tl-[3px] border-l border-t border-gray-100"></div>
                  <div className="relative bg-white rounded-md p-2 border border-gray-100 shadow-2xl">
                    <div className="flex items-start gap-4 p-4 rounded-md hover:bg-[#f8f9fa] transition-colors group mb-1">
                      <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200  relative">
                        <Image
                          src="https://i.pravatar.cc/150?img=47"
                          alt="Sarah Jenkins"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col grow pt-0.5">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-[16px] font-semibold text-[#202124]">
                              Sarah Jenkins
                            </h3>
                            <p className="text-[13px] text-brand-blue font-medium mt-1">
                              Senior Recruitment Lead
                            </p>
                          </div>
                          <a
                            href="#"
                            className="w-9 h-9 rounded-full bg-[#f0dfdf] text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors border border-green-100"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.183-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.765-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.369.846.144.072.228.058.315-.043.087-.101.376-.433.477-.582.101-.144.202-.12.356-.063.153.057.964.453 1.126.535.162.083.27.125.309.194.039.069.039.403-.105.808z" />
                            </svg>
                          </a>
                        </div>
                        <div className="space-y-1.5">
                          <a
                            href="mailto:sarah.jenkins@studsphere.edu"
                            className="flex items-center gap-2 text-[13px] text-[#5f6368] hover:text-brand-blue"
                          >
                            <Mail className="w-4 h-4" />
                            <span>sarah.jenkins@studsphere.edu</span>
                          </a>
                          <a
                            href="tel:+9779800000000"
                            className="flex items-center gap-2 text-[13px] text-[#5f6368] hover:text-brand-blue"
                          >
                            <Phone className="w-4 h-4" />
                            <span>+977-9800000000</span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-gray-100 mx-3 my-1"></div>
                    <div className="flex items-start gap-4 p-4 rounded-md hover:bg-[#f8f9fa] transition-colors group mt-1">
                      <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200  relative">
                        <Image
                          src="https://i.pravatar.cc/150?img=11"
                          alt="Michael Chen"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col grow pt-0.5">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-[16px] font-semibold text-[#202124]">
                              Michael Chen
                            </h3>
                            <p className="text-[13px] text-brand-blue font-medium mt-1">
                              Technical HR Specialist
                            </p>
                          </div>
                          <a
                            href="#"
                            className="w-9 h-9 rounded-full bg-[#f0dfdf] text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors border border-green-100"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.183-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.765-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.369.846.144.072.228.058.315-.043.087-.101.376-.433.477-.582.101-.144.202-.12.356-.063.153.057.964.453 1.126.535.162.083.27.125.309.194.039.069.039.403-.105.808z" />
                            </svg>
                          </a>
                        </div>
                        <div className="space-y-1.5">
                          <a
                            href="mailto:michael.chen@studsphere.edu"
                            className="flex items-center gap-2 text-[13px] text-[#5f6368] hover:text-brand-blue"
                          >
                            <Mail className="w-4 h-4" />
                            <span>michael.chen@studsphere.edu</span>
                          </a>
                          <a
                            href="tel:+9779800000001"
                            className="flex items-center gap-2 text-[13px] text-[#5f6368] hover:text-brand-blue"
                          >
                            <Phone className="w-4 h-4" />
                            <span>+977-9800000001</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="lg:flex-1 flex justify-end">
          <button className="lg:hidden text-white hover:text-white/80">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}