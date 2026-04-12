"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { apiService } from "../../services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ScholarshipProviderDashboard from "@/components/scholarship-provider/ScholarshipProviderDashboard";

interface ScholarshipProviderZoneProps {
  onNavigate?: (view: any, data?: any) => void;
}

type BillingCycle = "monthly" | "semiAnnually" | "annually";
type HeroTab = "advertise" | "login";
type AuthSubTab = "login" | "register";

interface ServiceCard {
  title: string;
  description: string;
  icon: string;
  blobClass: string;
  iconClass: string;
}

interface Tier {
  name: string;
  description: string;
  price: Record<BillingCycle, string>;
  period: Record<BillingCycle, string>;
  buttonText: string;
  highlighted: boolean;
  badge?: string;
  cardFeatures: string[];
}

interface CategoryFeature {
  name: string;
  free: string | boolean;
  standard: string | boolean;
  premium: string | boolean;
}

interface FeatureCategory {
  name: string;
  features: CategoryFeature[];
}

const services: ServiceCard[] = [
  {
    title: "Application Management",
    description:
      "Steamline and track all scholarship applications in one place.",
    icon: "fa-file-signature",
    blobClass: "bg-[#eef2ff]",
    iconClass: "text-blue-800",
  },
  {
    title: "Eligibility Verification",
    description:
      "Filter and verify candidates based on your specific criteria.",
    icon: "fa-user-check",
    blobClass: "bg-[#fff7ed]",
    iconClass: "text-orange-400",
  },
  {
    title: "Direct Inquiry Support",
    description:
      "Handle student questions directly through our messaging system.",
    icon: "fa-headset",
    blobClass: "bg-[#f3e8ff]",
    iconClass: "text-purple-600",
  },
  {
    title: "Featured Listings",
    description: "Get maximum visibility for your scholarship programs.",
    icon: "fa-crown",
    blobClass: "bg-[#ecfdf5]",
    iconClass: "text-emerald-400",
  },
  {
    title: "Verified Provider Badge",
    description:
      "Build trust with students through a verified scholarship badge.",
    icon: "fa-certificate",
    blobClass: "bg-[#fef2f2]",
    iconClass: "text-red-500",
  },
  {
    title: "Document Verification",
    description: "Securely review and verify academic and financial documents.",
    icon: "fa-shield-halved",
    blobClass: "bg-[#f7fee7]",
    iconClass: "text-lime-500",
  },
  {
    title: "Impact Analytics",
    description:
      "Get detailed insights into your scholarship reach and impact.",
    icon: "fa-chart-pie",
    blobClass: "bg-[#eef2ff]",
    iconClass: "text-blue-500",
  },
  {
    title: "Recipient Management",
    description:
      "Maintain a database of past and present scholarship recipients.",
    icon: "fa-users-gear",
    blobClass: "bg-[#fff7ed]",
    iconClass: "text-orange-500",
  },
  {
    title: "Automated Notifications",
    description: "Keep applicants updated with automated status notifications.",
    icon: "fa-bell",
    blobClass: "bg-[#f3e8ff]",
    iconClass: "text-purple-500",
  },
  {
    title: "Content Marketing",
    description: "Share success stories and news about your organization.",
    icon: "fa-newspaper",
    blobClass: "bg-[#ecfdf5]",
    iconClass: "text-emerald-500",
  },
  {
    title: "Global Outreach",
    description:
      "Connect with students from across the globe or specific regions.",
    icon: "fa-globe",
    blobClass: "bg-[#fef2f2]",
    iconClass: "text-red-500",
  },
  {
    title: "Success Tracking",
    description: "Follow the academic progress of your scholarship winners.",
    icon: "fa-graduation-cap",
    blobClass: "bg-[#eef2ff]",
    iconClass: "text-blue-600",
  },
];

const tiers: Tier[] = [
  {
    name: "Starter Provider",
    description: "Basic tools for small organizations and individuals.",
    price: { monthly: "Free", semiAnnually: "Free", annually: "Free" },
    period: { monthly: "/month", semiAnnually: "/6 months", annually: "/year" },
    buttonText: "Start for Free",
    highlighted: false,
    cardFeatures: [
      "Up to 2 scholarship listings",
      "Basic applicant dashboard",
      "Email notifications",
      "Standard search placement",
    ],
  },
  {
    name: "Professional Provider",
    description: "Advanced features for established scholarship bodies.",
    price: {
      monthly: "NPR 3,500",
      semiAnnually: "NPR 18,000",
      annually: "NPR 32,000",
    },
    period: { monthly: "/month", semiAnnually: "/6 months", annually: "/year" },
    buttonText: "Get Professional",
    highlighted: true,
    badge: "Recommended",
    cardFeatures: [
      "Unlimited scholarship listings",
      "Advanced filtering & ELV",
      "Bulk application management",
      "Priority search placement",
      "Verified Provider Badge",
    ],
  },
  {
    name: "Enterprise Partner",
    description: "Full-scale solution with managed support and analytics.",
    price: {
      monthly: "NPR 7,500",
      semiAnnually: "NPR 38,000",
      annually: "NPR 68,000",
    },
    period: { monthly: "/month", semiAnnually: "/6 months", annually: "/year" },
    buttonText: "Get Enterprise",
    highlighted: false,
    cardFeatures: [
      "Managed application portal",
      "Document verification service",
      "Detailed impact reporting",
      "Dedicated account manager",
      "Custom marketing campaigns",
    ],
  },
];

const categories: FeatureCategory[] = [
  {
    name: "Visibility & Branding",
    features: [
      {
        name: "Scholarship Indexing",
        free: "Standard Listing",
        standard: "Priority Listing",
        premium: "Top Placement & Featured",
      },
      {
        name: "Verified Provider Badge",
        free: false,
        standard: true,
        premium: true,
      },
      {
        name: "Brand Page",
        free: "Basic Information",
        standard: "Detailed Portfolio",
        premium: "Premium Media-rich Page",
      },
      {
        name: "SEO Optimization",
        free: false,
        standard: "Standard SEO",
        premium: "Advanced SEO & Link-building",
      },
    ],
  },
  {
    name: "Application & Management",
    features: [
      {
        name: "Applicant Filtering",
        free: "Basic (GPA, Region)",
        standard: "Advanced (Skills, Need)",
        premium: "AI-based Matching",
      },
      {
        name: "Document Collection",
        free: "Up to 3 docs/applicant",
        standard: "Unlimited docs",
        premium: "Managed Verification",
      },
      {
        name: "In-Portal Messaging",
        free: false,
        standard: "Standard Chat",
        premium: "Priority Chat & Notifications",
      },
      {
        name: "Workflow Management",
        free: "Basic status update",
        standard: "Custom workflows",
        premium: "Automated Workflows",
      },
    ],
  },
  {
    name: "Analytics & Reporting",
    features: [
      {
        name: "Applicant Demographics",
        free: "Basic stats",
        standard: "Detailed reports",
        premium: "Advanced BI Dashboards",
      },
      {
        name: "Financial Tracking",
        free: false,
        standard: "Disbursement log",
        premium: "Full financial management",
      },
      {
        name: "Impact Assessment",
        free: false,
        standard: "Annual report",
        premium: "Real-time impact tracking",
      },
    ],
  },
];

const checkIconPurple = (
  <div className="flex justify-center">
    <div className="bg-[#f0edff] rounded-full p-1 shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-[#5f61eb]"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>
  </div>
);

const checkIconWhite = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3 h-3 text-white"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const crossIconGrey = (
  <div className="flex justify-center">
    <div className="rounded-full p-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-slate-300"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </div>
  </div>
);

const ScholarshipProviderZone: React.FC<ScholarshipProviderZoneProps> = ({
  onNavigate,
}) => {
  const [heroTab, setHeroTab] = useState<HeroTab>("login");
  const [authSubTab, setAuthSubTab] = useState<AuthSubTab>("login");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annually");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showPricingOverlay, setShowPricingOverlay] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
    useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerProviderName, setRegisterProviderName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const contactDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => {
      if (!contactDropdownRef.current) return;
      if (!contactDropdownRef.current.contains(event.target as Node)) {
        setIsContactOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      showPricingOverlay || Boolean(selectedPlan) ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPricingOverlay, selectedPlan]);

  const processedTiers = useMemo(
    () =>
      tiers.map((tier) => {
        const price = tier.price[billingCycle];
        const period = tier.period[billingCycle];
        const priceSize =
          price === "Free"
            ? "text-5xl"
            : price.length > 8
              ? "text-3xl"
              : "text-[32px]";
        return { ...tier, price, period, priceSize };
      }),
    [billingCycle],
  );

  const handleHeroTab = (tab: HeroTab) => {
    setHeroTab(tab);
    if (tab === "advertise") {
      setAuthSubTab("login");
    }
  };

  const clearAuthMessages = () => {
    setAuthError(null);
    setAuthSuccess(null);
  };

  const handleProviderLogin = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    clearAuthMessages();

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError("Email and password are required.");
      return;
    }

    setAuthLoading(true);
    try {
      const response = await apiService.scholarshipProviderLogin(
        loginEmail.trim(),
        loginPassword,
      );

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || !user)
        throw new Error("Invalid login response from server");

      apiService.setScholarshipProviderToken(token);
      apiService.setScholarshipProviderUser(user);
      setAuthSuccess("Login successful. Connecting to your dashboard...");
      setLoginPassword("");
      onNavigate?.("scholarshipProviderDashboard");
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleProviderRegister = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    clearAuthMessages();

    if (
      !registerProviderName.trim() ||
      !registerNumber.trim() ||
      !registerEmail.trim() ||
      !registerPassword.trim() ||
      !registerConfirmPassword.trim()
    ) {
      setAuthError("Please fill all required fields.");
      return;
    }

    if (registerPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    setAuthLoading(true);
    try {
      const response = await apiService.scholarshipProviderRegister({
        provider_name: registerProviderName.trim(),
        registration_number: registerNumber.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || !user)
        throw new Error("Invalid registration response from server");

      apiService.setScholarshipProviderToken(token);
      apiService.setScholarshipProviderUser(user);
      setAuthSuccess("Registration successful. Setting up your account...");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setAuthSubTab("login");
      setLoginEmail(user.email);
      onNavigate?.("scholarshipProviderDashboard");
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginClick = () => {
    onNavigate?.("scholarshipProviderDashboard");
  };

  return (
    <div className="text-gray-800 antialiased overflow-x-hidden bg-[#fcfcfc] min-h-screen font-sans">
      <style>{`
        input[type="password"] { letter-spacing: 0.2em; }
        input[type="password"]::placeholder { letter-spacing: normal; font-size: 15px; font-weight: 500; }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="bg-[#6366F1] min-h-screen flex flex-col selection:bg-white selection:text-[#6366F1]">
        <header className="w-full max-w-7xl mx-auto px-6 py-6 lg:py-8 flex items-center justify-between text-white relative">
          <div className="lg:flex-1 text-2xl font-bold tracking-tight">
            StudSphere
          </div>
          <nav className="hidden lg:flex lg:flex-1 justify-center items-center gap-8 text-[15px] font-medium relative">
            <button
              type="button"
              className="hover:text-white/80 transition-colors"
            >
              Services
            </button>
            <div className="relative" ref={contactDropdownRef}>
              <button
                type="button"
                onClick={() => setIsContactOpen((prev) => !prev)}
                className="hover:text-white/80 transition-colors focus:outline-none flex items-center gap-1"
              >
                Contact us
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isContactOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-[2.2rem] z-50 w-120">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 rounded-tl-[3px] border-l border-t border-gray-100"></div>
                  <div className="relative bg-white rounded-2xl p-2 border border-gray-100 shadow-xl">
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f8f9fa] transition-colors group mb-1">
                      <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                        <img
                          src="https://i.pravatar.cc/150?img=33"
                          alt="Advisor"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col grow pt-0.5">
                        <h3 className="text-[16px] font-semibold text-[#202124]">
                          Emma Wilson
                        </h3>
                        <p className="text-[13px] text-[#6366F1] font-medium mt-1">
                          Partnerships Manager
                        </p>
                        <div className="mt-2 space-y-1.5">
                          <a
                            href="mailto:emma.wilson@studsphere.com"
                            className="flex items-center gap-2 text-[13px] text-[#5f6368] hover:text-[#6366F1]"
                          >
                            <i className="fa-regular fa-envelope"></i>{" "}
                            emma.wilson@studsphere.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
          <div className="lg:flex-1 flex justify-end"></div>
        </header>

        <main className="flex-1 flex items-center justify-center w-full pb-12 lg:pb-20 pt-4">
          <div className="max-w-7xl w-full mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            <div className="flex-1 text-white w-full max-w-2xl text-center lg:text-left pt-6 lg:pt-0">
              <h1 className="text-4xl lg:text-[3.5rem] font-bold leading-[1.15] mb-6">
                Empower the Next Generation – List Your Scholarships
              </h1>
              <p className="text-white/90 text-lg lg:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                Join Nepal's largest scholarship network and connect with
                deserving students nationwide.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link 
                  href="/scholarship-apply"
                  className="bg-white text-[#6366F1] font-bold px-8 py-4 rounded-2xl shadow-xl shadow-black/10 hover:bg-indigo-50 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-file-signature"></i>
                  Preview Entrance Form
                </Link>
                <button className="bg-indigo-500/30 text-white border border-white/20 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-500/50 transition-all flex items-center gap-2">
                  <i className="fa-solid fa-play"></i>
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="w-full max-w-115">
              <div className="bg-white rounded-4xl p-8 sm:p-10 relative shadow-2xl shadow-black/10 text-gray-800">
                <div className="flex p-1.5 bg-[#F1F3F5] rounded-full mb-8 relative">
                  <button
                    type="button"
                    onClick={() => handleHeroTab("advertise")}
                    className={`flex-1 py-2.5 text-[15px] rounded-full transition-all ${heroTab === "advertise" ? "font-bold text-gray-900 bg-white shadow-sm z-10" : "font-semibold text-gray-500 hover:text-gray-700"}`}
                  >
                    Partner with us
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHeroTab("login")}
                    className={`flex-1 py-2.5 text-[15px] rounded-full transition-all ${heroTab === "login" ? "font-bold text-gray-900 bg-white shadow-sm z-10" : "font-semibold text-gray-500 hover:text-gray-700"}`}
                  >
                    Register/Log in
                  </button>
                </div>

                {heroTab === "advertise" ? (
                  <div className="fade-in">
                    <form
                      className="space-y-4"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <input
                        type="text"
                        placeholder="Full name"
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-[#6366F1] outline-none"
                      />
                      <input
                        type="tel"
                        placeholder="Contact number"
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-[#6366F1] outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Organization email"
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-[#6366F1] outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full mt-4 bg-white border-2 border-[#6366F1] text-[#6366F1] font-semibold py-3.5 rounded-xl hover:bg-indigo-50"
                      >
                        Request callback
                      </button>
                    </form>
                  </div>
                ) : authSubTab === "login" ? (
                  <div className="fade-in">
                    <form onSubmit={handleProviderLogin} className="space-y-4">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full px-4 py-3.5 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#6366F1] outline-none"
                      />
                      <div className="relative">
                        <input
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full px-4 py-3.5 pr-12 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#6366F1] outline-none"
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                          onClick={() => setShowLoginPassword((p) => !p)}
                        >
                          <i
                            className={`fa-solid ${showLoginPassword ? "fa-eye-slash" : "fa-eye"}`}
                          ></i>
                        </button>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          className="text-[14px] text-[#6366F1] font-semibold hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      {authError && (
                        <p className="text-sm text-red-500">{authError}</p>
                      )}
                      {authSuccess && (
                        <p className="text-sm text-emerald-600">
                          {authSuccess}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-[#6366F1] text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {authLoading ? "Logging in..." : "Log in"}
                      </button>
                    </form>
                    <div className="mt-8 text-center text-[15px] text-gray-500">
                      New provider?{" "}
                      <button
                        type="button"
                        onClick={() => setAuthSubTab("register")}
                        className="text-[#6366F1] font-semibold hover:underline"
                      >
                        Create account
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="fade-in">
                    <form
                      onSubmit={handleProviderRegister}
                      className="space-y-4"
                    >
                      <input
                        type="text"
                        placeholder="Organization name"
                        value={registerProviderName}
                        onChange={(e) =>
                          setRegisterProviderName(e.target.value)
                        }
                        className="w-full px-4 py-3.5 bg-[#EEF2F6] rounded-xl outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Tax/Registration number"
                        value={registerNumber}
                        onChange={(e) => setRegisterNumber(e.target.value)}
                        className="w-full px-4 py-3.5 bg-[#EEF2F6] rounded-xl"
                      />
                      <input
                        type="email"
                        placeholder="Official email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="w-full px-4 py-3.5 bg-[#EEF2F6] rounded-xl"
                      />
                      <div className="relative">
                        <input
                          type={showRegisterPassword ? "text" : "password"}
                          placeholder="Create password"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="w-full px-4 py-3.5 pr-12 bg-[#EEF2F6] rounded-xl"
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                          onClick={() => setShowRegisterPassword((p) => !p)}
                        >
                          <i
                            className={`fa-solid ${showRegisterPassword ? "fa-eye-slash" : "fa-eye"}`}
                          ></i>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={
                            showRegisterConfirmPassword ? "text" : "password"
                          }
                          placeholder="Re-enter password"
                          value={registerConfirmPassword}
                          onChange={(e) =>
                            setRegisterConfirmPassword(e.target.value)
                          }
                          className="w-full px-4 py-3.5 pr-12 bg-[#EEF2F6] rounded-xl"
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                          onClick={() =>
                            setShowRegisterConfirmPassword((p) => !p)
                          }
                        >
                          <i
                            className={`fa-solid ${showRegisterConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                          ></i>
                        </button>
                      </div>
                      {authError && (
                        <p className="text-sm text-red-500">{authError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full mt-4 bg-[#6366F1] text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700"
                      >
                        {authLoading ? "Creating account..." : "Sign up"}
                      </button>
                    </form>
                    <div className="mt-8 text-center text-[15px] text-gray-500">
                      Already registered?{" "}
                      <button
                        type="button"
                        onClick={() => setAuthSubTab("login")}
                        className="text-[#6366F1] font-semibold hover:underline"
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

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Comprehensive Solutions for Providers
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Tools built to help you reach the right candidates and manage your
            scholarship programs efficiently.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-xl p-8 shadow-sm hover:-translate-y-1.25 transition-all border border-gray-50"
            >
              <div className="relative w-16 h-16 mb-6">
                <div
                  className={`absolute top-0 right-2 w-10 h-10 rounded-full ${service.blobClass}`}
                ></div>
                <div
                  className={`relative z-10 flex items-center justify-center w-full h-full text-3xl ${service.iconClass}`}
                >
                  <i className={`fa-solid ${service.icon}`}></i>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-3">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center items-center h-screen">
        <button
          onClick={handleLoginClick}
          className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default ScholarshipProviderZone;
