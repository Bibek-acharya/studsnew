"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import InstitutionHeader from "@/components/institution-zone/InstitutionHeader";

type BillingCycle = "monthly" | "semiAnnually" | "annually";

interface PricingTier {
  name: string;
  description: string;
  price: Record<BillingCycle, string>;
  period: Record<BillingCycle, string>;
  buttonText: string;
  highlighted: boolean;
  badge?: string;
  cardFeatures: string[];
}

interface FeatureComparison {
  name: string;
  free: string | boolean;
  standard: string | boolean;
  premium: string | boolean;
}

interface FeatureCategory {
  name: string;
  features: FeatureComparison[];
}

const TIERS: PricingTier[] = [
  {
    name: "Free Listing",
    description: "Basic directory presence for visibility.",
    price: { monthly: "Free", semiAnnually: "Free", annually: "Free" },
    period: { monthly: "/month", semiAnnually: "/6 months", annually: "/year" },
    buttonText: "Claim Free Listing",
    highlighted: false,
    cardFeatures: [
      "Basic profile presence",
      "Standard search visibility",
      "Basic directory listing",
      "Email customer support",
    ],
  },
  {
    name: "Standard Membership",
    description: "Perfect for growing colleges needing branding.",
    price: {
      monthly: "NPR 5,000",
      semiAnnually: "NPR 25,000",
      annually: "NPR 45,000",
    },
    period: { monthly: "/month", semiAnnually: "/6 months", annually: "/year" },
    buttonText: "Get Standard",
    highlighted: true,
    badge: "Most Popular",
    cardFeatures: [
      "Full profile control",
      "1 Cover Banner & Video",
      "Courses & fees listing",
      "Standard lead collection",
      "Priority customer support",
    ],
  },
  {
    name: "Premium Membership",
    description: "Comprehensive solution for maximum leads.",
    price: {
      monthly: "NPR 10,000",
      semiAnnually: "NPR 50,000",
      annually: "NPR 90,000",
    },
    period: { monthly: "/month", semiAnnually: "/6 months", annually: "/year" },
    buttonText: "Get Premium",
    highlighted: false,
    cardFeatures: [
      "Top priority placement",
      "Up to 3 Cover Images & Videos",
      "Advanced lead dashboard",
      "Unlimited content publishing",
      "Dedicated account manager",
    ],
  },
];

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    name: "Homepage & Platform Visibility",
    features: [
      {
        name: "Home Page: Featured College",
        free: false,
        standard: false,
        premium: "Featured with website link",
      },
      {
        name: "Home Page: Course-Based Logo",
        free: false,
        standard: false,
        premium: "Displayed in relevant searches",
      },
      {
        name: "Profile Visibility & Search",
        free: "Listed at the bottom",
        standard: "Normal visibility",
        premium: "Top priority placement",
      },
      {
        name: "Website Link (SEO)",
        free: false,
        standard: "Shown (No-follow)",
        premium: "Do-follow SEO link",
      },
    ],
  },
  {
    name: "College Profile & Control",
    features: [
      {
        name: "Profile Control",
        free: "Basic info only",
        standard: "Full profile control",
        premium: "Priority updates & managed profile",
      },
      {
        name: "College Profile Page",
        free: "Basic (logo, name, location)",
        standard: "Full detailed profile page",
        premium: "Featured detailed profile with Verified Badge",
      },
      {
        name: "Cover Images & Banners",
        free: false,
        standard: "1 Cover Banner",
        premium: "Up to 3 Cover Images / Banners",
      },
      {
        name: "College Videos",
        free: false,
        standard: "1 video (Chairman or Campus)",
        premium: "2 videos (Chairman & Campus Tour)",
      },
      { name: "Brochure Download", free: false, standard: true, premium: true },
      {
        name: "Courses & Fees Listing",
        free: "Limited courses",
        standard: "Full courses listing",
        premium: "Featured courses",
      },
      {
        name: "Facilities Section",
        free: false,
        standard: true,
        premium: "Highlighted facilities",
      },
    ],
  },
  {
    name: "Admissions & Lead Generation",
    features: [
      {
        name: "Application Tracking",
        free: false,
        standard: "Basic application tracking",
        premium: "Advanced application management",
      },
      {
        name: "Programs & Admission Status",
        free: "Limited programs",
        standard: "Full listing + Admission Status",
        premium: "Priority display + Highlighted Status",
      },
      {
        name: "Admission Notice Posting",
        free: false,
        standard: "Can publish notices",
        premium: "Notices + 'Apply Now' lead collection",
      },
      {
        name: "Admission Page: Detailed Cards",
        free: false,
        standard: "Basic text listing",
        premium: "Featured Admission Card with College Photo",
      },
      {
        name: "Direct Admission Form",
        free: false,
        standard: "Basic admission form",
        premium: "Advanced admission lead dashboard",
      },
      {
        name: "Entrance Exam Posting",
        free: false,
        standard: "Can post entrance exams",
        premium: "Priority entrance exam promotion",
      },
      {
        name: "Scholarship Listing",
        free: false,
        standard: "Scholarship listing",
        premium: "Featured scholarship promotion",
      },
    ],
  },
  {
    name: "Content & Media Publishing",
    features: [
      {
        name: "News Page: Hero Section",
        free: false,
        standard: false,
        premium: "News featured in Hero Section",
      },
      {
        name: "News & Notices Publishing",
        free: false,
        standard: "Limited publishing",
        premium: "Unlimited publishing",
      },
      {
        name: "Events Page: Hero Section",
        free: false,
        standard: false,
        premium: "Event featured in Hero Section",
      },
      {
        name: "Events & Activities Page",
        free: false,
        standard: "Limited event posts",
        premium: "Unlimited events & activities",
      },
      {
        name: "Gallery & Alumni Section",
        free: false,
        standard: true,
        premium: "Featured alumni profiles",
      },
      {
        name: "Student Reviews",
        free: "Basic reviews",
        standard: "Full reviews",
        premium: "Featured reviews",
      },
    ],
  },
  {
    name: "Dashboards, Insights & Support",
    features: [
      {
        name: "User Insights",
        free: false,
        standard: "Basic page views",
        premium: "Advanced engagement & interest tracking",
      },
      {
        name: "Query Management",
        free: false,
        standard: "Limited student queries",
        premium: "Full QMS dashboard & unlimited replies",
      },
      {
        name: "Online Counselling Booking",
        free: false,
        standard: true,
        premium: "Priority booking with lead tracking",
      },
      {
        name: "Analytics Dashboard",
        free: false,
        standard: "Basic analytics",
        premium: "Advanced analytics & insights",
      },
      {
        name: "Customer Support",
        free: "Email support",
        standard: "Priority support",
        premium: "Dedicated account manager",
      },
    ],
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annually");
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(
    null
  );

  const renderTableCell = (value: string | boolean) => {
    if (value === false)
      return (
        <div className="flex justify-center">
          <X className="w-5 h-5 text-slate-300" strokeWidth={3} />
        </div>
      );
    if (value === true)
      return (
        <div className="flex justify-center">
          <div className="bg-[#f0edff] rounded-full p-1">
            <Check className="w-4 h-4 text-brand-blue" strokeWidth={3} />
          </div>
        </div>
      );
    return (
      <span className="text-[14px] text-slate-600 font-medium">{value}</span>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <InstitutionHeader />

      <main className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-blue-200 text-brand-blue px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Check className="w-3.5 h-3.5" />
              Pricing Plan
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight text-slate-900">
              Select a Plan That Powers Your Success
            </h1>
            <p className="mt-4 text-slate-500 font-medium text-[15px]">
              Unlimited leads and workflows, no credit card required.
            </p>

            <div className="flex justify-center mt-10">
              <div className="bg-slate-100 p-1.5 rounded-xl inline-flex border border-slate-200">
                {(["monthly", "semiAnnually", "annually"] as BillingCycle[]).map(
                  (cycle) => (
                    <button
                      key={cycle}
                      onClick={() => setBillingCycle(cycle)}
                      className={`w-28 sm:w-32 py-2.5 text-sm font-bold rounded-lg transition-all ${
                        billingCycle === cycle
                          ? "bg-white text-slate-900 border border-slate-200/50"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {cycle === "monthly"
                        ? "1 Month"
                        : cycle === "semiAnnually"
                          ? "6 Months"
                          : "1 Year"}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded-md bg-white transition-all duration-300 ${
                  tier.highlighted
                    ? "border-2 border-brand-blue ring-8 ring-brand-blue/5 md:scale-105 z-10"
                    : "border border-slate-100"
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-blue text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    {tier.badge}
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium">
                    {tier.description}
                  </p>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                    {tier.price[billingCycle]}
                  </span>
                  {tier.price[billingCycle] !== "Free" && (
                    <span className="text-slate-400 font-bold text-sm">
                      {tier.period[billingCycle]}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPlanModal(tier.name)}
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${
                    tier.highlighted
                      ? "bg-brand-blue text-white hover:bg-[#4b4dd6]"
                      : "bg-brand-blue/8 text-brand-blue hover:bg-[#dadaff]"
                  }`}
                >
                  {tier.buttonText}
                </button>
                <div className="mt-10 pt-10 border-t border-slate-50">
                  <p className="font-bold text-slate-900 text-sm mb-6">
                    Features:
                  </p>
                  <ul className="space-y-4">
                    {tier.cardFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 bg-emerald-100 text-emerald-600 rounded-full p-0.5">
                          <Check className="w-3 h-3" strokeWidth={4} />
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-5xl mx-auto bg-[#222222] rounded-md px-8 py-7 sm:px-12 sm:py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-20">
            <div className="flex flex-col gap-1 text-left">
              <p className="text-[#e0e0e0] text-lg sm:text-[22px] font-medium tracking-wide">
                All is according your enterprise needs.
              </p>
              <p className="text-white text-lg sm:text-[22px] font-medium tracking-wide">
                Contact us to{" "}
                <span className="text-brand-blue">talk</span>
              </p>
            </div>
            <button className="bg-white text-[#111111] text-sm sm:text-[15px] font-semibold px-8 py-3.5 rounded-full hover:bg-gray-200 active:scale-95 transition-all duration-200 ease-out whitespace-nowrap">
              Contact Us
            </button>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-brand-blue font-bold text-[13px] uppercase tracking-wider mb-2 block">
                Compare options
              </span>
              <h2 className="text-[32px] font-extrabold text-slate-900">
                See Features Included
              </h2>
            </div>

            <div className="bg-white rounded-md border border-slate-100 overflow-hidden ">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-225">
                  <thead>
                    <tr className="bg-[#f5f5ff]">
                      <th className="w-[30%] py-5 px-6 font-semibold text-slate-600 text-sm">
                        Plan Features
                      </th>
                      {TIERS.map((t, idx) => (
                        <th
                          key={idx}
                          className="py-5 px-6 text-center font-bold text-slate-800 text-[15px]"
                        >
                          {t.name.split(" ")[0]} Plan
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {FEATURE_CATEGORIES.map((cat, idx) => (
                      <React.Fragment key={idx}>
                        <tr>
                          <td
                            colSpan={4}
                            className="py-4 px-6 text-[12px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50"
                          >
                            {cat.name}
                          </td>
                        </tr>
                        {cat.features.map((f, fIdx) => (
                          <tr
                            key={fIdx}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="py-4 px-6 text-[14px] font-medium text-slate-700">
                              {f.name}
                            </td>
                            <td className="py-4 px-6 text-center">
                              {renderTableCell(f.free)}
                            </td>
                            <td className="py-4 px-6 text-center border-l border-slate-50">
                              {renderTableCell(f.standard)}
                            </td>
                            <td className="py-4 px-6 text-center border-l border-slate-50">
                              {renderTableCell(f.premium)}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setSelectedPlanModal(null)} />
          <div className="relative bg-white w-full max-w-md rounded-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-[#f5f5ff]">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Register Your College
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Selected Plan: {selectedPlanModal}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              className="p-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSelectedPlanModal(null);
              }}
            >
              <div>
                <label
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                  htmlFor="collegeName"
                >
                  College Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="collegeName"
                  required
                  placeholder="e.g. Oxford University"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-1 focus:ring-brand-blue transition-all"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                  htmlFor="registrationNumber"
                >
                  College Registration Number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  required
                  placeholder="Registration ID / Code"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-1 focus:ring-brand-blue transition-all"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                  htmlFor="contactNumber"
                >
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  required
                  placeholder="+977- 98XXXXXXXX"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-1 focus:ring-brand-blue transition-all"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                  htmlFor="emailAddress"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  required
                  placeholder="admissions@college.edu"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-1 focus:ring-brand-blue transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-4 bg-brand-blue hover:bg-[#4b4dd6] text-white py-3 rounded-xl font-bold transition-colors flex justify-center items-center"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}