"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronDown, 
  Mail, 
  Phone, 
  X, 
  Check, 
  Eye, 
  EyeOff, 
  Star, 
  ListCheck,
  ClipboardList,
  Building2,
  Megaphone,
  UserPlus,
  Rocket,
  Globe,
  LineChart,
  MessageSquare,
  Newspaper
} from "lucide-react";

// --- Types ---
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

// --- Data ---
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
    price: { monthly: "NPR 5,000", semiAnnually: "NPR 25,000", annually: "NPR 45,000" },
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
    price: { monthly: "NPR 10,000", semiAnnually: "NPR 50,000", annually: "NPR 90,000" },
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
      { name: "Home Page: Featured College", free: false, standard: false, premium: "Featured with website link" },
      { name: "Home Page: Course-Based Logo", free: false, standard: false, premium: "Displayed in relevant searches" },
      { name: "Profile Visibility & Search", free: "Listed at the bottom", standard: "Normal visibility", premium: "Top priority placement" },
      { name: "Website Link (SEO)", free: false, standard: "Shown (No-follow)", premium: "Do-follow SEO link" },
    ],
  },
  {
    name: "College Profile & Control",
    features: [
      { name: "Profile Control", free: "Basic info only", standard: "Full profile control", premium: "Priority updates & managed profile" },
      { name: "College Profile Page", free: "Basic (logo, name, location)", standard: "Full detailed profile page", premium: "Featured detailed profile with Verified Badge" },
      { name: "Cover Images & Banners", free: false, standard: "1 Cover Banner", premium: "Up to 3 Cover Images / Banners" },
      { name: "College Videos", free: false, standard: "1 video (Chairman or Campus)", premium: "2 videos (Chairman & Campus Tour)" },
      { name: "Brochure Download", free: false, standard: true, premium: true },
      { name: "Courses & Fees Listing", free: "Limited courses", standard: "Full courses listing", premium: "Featured courses" },
      { name: "Facilities Section", free: false, standard: true, premium: "Highlighted facilities" },
    ],
  },
  {
    name: "Admissions & Lead Generation",
    features: [
      { name: "Application Tracking", free: false, standard: "Basic application tracking", premium: "Advanced application management" },
      { name: "Programs & Admission Status", free: "Limited programs", standard: "Full listing + Admission Status", premium: "Priority display + Highlighted Status" },
      { name: "Admission Notice Posting", free: false, standard: "Can publish notices", premium: "Notices + 'Apply Now' lead collection" },
      { name: "Admission Page: Detailed Cards", free: false, standard: "Basic text listing", premium: "Featured Admission Card with College Photo" },
      { name: "Direct Admission Form", free: false, standard: "Basic admission form", premium: "Advanced admission lead dashboard" },
      { name: "Entrance Exam Posting", free: false, standard: "Can post entrance exams", premium: "Priority entrance exam promotion" },
      { name: "Scholarship Listing", free: false, standard: "Scholarship listing", premium: "Featured scholarship promotion" },
    ],
  },
  {
    name: "Content & Media Publishing",
    features: [
      { name: "News Page: Hero Section", free: false, standard: false, premium: "News featured in Hero Section" },
      { name: "News & Notices Publishing", free: false, standard: "Limited publishing", premium: "Unlimited publishing" },
      { name: "Events Page: Hero Section", free: false, standard: false, premium: "Event featured in Hero Section" },
      { name: "Events & Activities Page", free: false, standard: "Limited event posts", premium: "Unlimited events & activities" },
      { name: "Gallery & Alumni Section", free: false, standard: true, premium: "Featured alumni profiles" },
      { name: "Student Reviews", free: "Basic reviews", standard: "Full reviews", premium: "Featured reviews" },
    ],
  },
  {
    name: "Dashboards, Insights & Support",
    features: [
      { name: "User Insights", free: false, standard: "Basic page views", premium: "Advanced engagement & interest tracking" },
      { name: "Query Management", free: false, standard: "Limited student queries", premium: "Full QMS dashboard & unlimited replies" },
      { name: "Online Counselling Booking", free: false, standard: true, premium: "Priority booking with lead tracking" },
      { name: "Analytics Dashboard", free: false, standard: "Basic analytics", premium: "Advanced analytics & insights" },
      { name: "Customer Support", free: "Email support", standard: "Priority support", premium: "Dedicated account manager" },
    ],
  },
];

const SERVICES = [
  { title: "Application Tracking", desc: "Streamline and monitor student applications.", icon: ListCheck, color: "bg-blue-50 text-blue-800", blob: "bg-blue-100/50" },
  { title: "Query Management", desc: "Efficiently handle student inquiries.", icon: ClipboardList, color: "bg-orange-50 text-orange-400", blob: "bg-orange-100/50" },
  { title: "Profile & Listing Control", desc: "Showcase key information.", icon: Building2, color: "bg-purple-50 text-purple-600", blob: "bg-purple-100/50" },
  { title: "Featured Promotions", desc: "Highlight your best programs.", icon: Megaphone, color: "bg-emerald-50 text-emerald-400", blob: "bg-emerald-100/50" },
  { title: "Student Lead Generation", desc: "Attract high-quality leads.", icon: UserPlus, color: "bg-red-50 text-red-500", blob: "bg-red-100/50" },
  { title: "Admission Campaigns", desc: "Launch targeted campaigns.", icon: Rocket, color: "bg-lime-50 text-lime-500", blob: "bg-lime-100/50" },
  { title: "Virtual Admission Fair", desc: "Connect globally.", icon: Globe, color: "bg-blue-50 text-blue-500", blob: "bg-blue-100/50" },
  { title: "Analytics Dashboard", desc: "Insights into profile views.", icon: LineChart, color: "bg-orange-50 text-orange-500", blob: "bg-orange-100/50" },
  { title: "Reviews & Ratings", desc: "Authentic feedback.", icon: Star, color: "bg-purple-50 text-purple-500", blob: "bg-purple-100/50" },
  { title: "Direct Chat", desc: "Engage in real time.", icon: MessageSquare, color: "bg-emerald-50 text-emerald-500", blob: "bg-emerald-100/50" },
  { title: "Content Marketing", desc: "Publish news and updates.", icon: Newspaper, color: "bg-red-50 text-red-500", blob: "bg-red-100/50" },
];

export default function InstitutionZone() {
  const [activeTab, setActiveTab] = useState<"advertise" | "login" | "register">("login");
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [showPricingOverlay, setShowPricingOverlay] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annually");
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderTableCell = (value: string | boolean) => {
    if (value === false) return (
      <div className="flex justify-center">
        <X className="w-5 h-5 text-slate-300" strokeWidth={3} />
      </div>
    );
    if (value === true) return (
      <div className="flex justify-center">
        <div className="bg-[#f0edff] rounded-full p-1">
          <Check className="w-4 h-4 text-[#5f61eb]" strokeWidth={3} />
        </div>
      </div>
    );
    return <span className="text-[14px] text-slate-600 font-medium">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-[#2D68FE] min-h-screen flex flex-col relative">
        {/* Header */}
        <header className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${isScrolled ? 'bg-[#2D68FE]/95 backdrop-blur-md py-4 shadow-lg' : 'bg-[#2D68FE] py-6 lg:py-8'}`}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-white">
            <Link href={'/'} className="lg:flex-1 text-2xl font-bold tracking-tight">StudSphere</Link>
            
            {/* Desktop Nav */}
            <nav className="hidden lg:flex lg:flex-1 justify-center items-center gap-8 text-[15px] font-medium relative">
              <Link href="#services" className="hover:text-white/80 transition-colors">Services</Link>
              <button 
                onClick={() => { setShowPricingOverlay(true); document.body.style.overflow = 'hidden'; }}
                className="hover:text-white/80 transition-colors focus:outline-none"
              >
                Pricing
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowContactDropdown(!showContactDropdown)}
                  className="hover:text-white/80 transition-colors focus:outline-none flex items-center gap-1"
                >
                  Contact us
                  <ChevronDown className={`h-4 w-4 transition-transform ${showContactDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Contact Dropdown */}
                {showContactDropdown && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setShowContactDropdown(false)}></div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-10 z-50 w-120 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 rounded-tl-[3px] border-l border-t border-gray-100"></div>
                      <div className="relative bg-white rounded-2xl p-2 border border-gray-100 shadow-2xl">
                        {/* Contact 1 */}
                        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f8f9fa] transition-colors group mb-1">
                          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200 shadow-sm relative">
                            <Image src="https://i.pravatar.cc/150?img=47" alt="Sarah Jenkins" fill className="object-cover" />
                          </div>
                          <div className="flex flex-col grow pt-0.5">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-[16px] font-semibold text-[#202124]">Sarah Jenkins</h3>
                                <p className="text-[13px] text-[#2D68FE] font-medium mt-1">Senior Recruitment Lead</p>
                              </div>
                              <a href="#" className="w-9 h-9 rounded-full bg-[#f0dfdf] text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors border border-green-100">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.183-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.765-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.369.846.144.072.228.058.315-.043.087-.101.376-.433.477-.582.101-.144.202-.12.356-.063.153.057.964.453 1.126.535.162.083.27.125.309.194.039.069.039.403-.105.808z"/></svg>
                              </a>
                            </div>
                            <div className="space-y-1.5">
                              <a href="mailto:sarah.jenkins@studsphere.edu" className="flex items-center gap-2 text-[13px] text-[#5f6368] hover:text-[#2D68FE]">
                                <Mail className="w-4 h-4" />
                                <span>sarah.jenkins@studsphere.edu</span>
                              </a>
                              <a href="tel:+9779800000000" className="flex items-center gap-2 text-[13px] text-[#5f6368] hover:text-[#2D68FE]">
                                <Phone className="w-4 h-4" />
                                <span>+977-9800000000</span>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="h-px bg-gray-100 mx-3 my-1"></div>
                        {/* Contact 2 */}
                        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#f8f9fa] transition-colors group mt-1">
                          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200 shadow-sm relative">
                            <Image src="https://i.pravatar.cc/150?img=11" alt="Michael Chen" fill className="object-cover" />
                          </div>
                          <div className="flex flex-col grow pt-0.5">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-[16px] font-semibold text-[#202124]">Michael Chen</h3>
                                <p className="text-[13px] text-[#2D68FE] font-medium mt-1">Technical HR Specialist</p>
                              </div>
                              <a href="#" className="w-9 h-9 rounded-full bg-[#f0dfdf] text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors border border-green-100">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.183-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.765-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.369.846.144.072.228.058.315-.043.087-.101.376-.433.477-.582.101-.144.202-.12.356-.063.153.057.964.453 1.126.535.162.083.27.125.309.194.039.069.039.403-.105.808z"/></svg>
                              </a>
                            </div>
                            <div className="space-y-1.5">
                              <a href="mailto:michael.chen@studsphere.edu" className="flex items-center gap-2 text-[13px] text-[#5f6368] hover:text-[#2D68FE]">
                                <Mail className="w-4 h-4" />
                                <span>michael.chen@studsphere.edu</span>
                              </a>
                              <a href="tel:+9779800000001" className="flex items-center gap-2 text-[13px] text-[#5f6368] hover:text-[#2D68FE]">
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
              <button className="hidden lg:block bg-white text-[#2D68FE] px-5 py-2.5 rounded-full font-bold hover:bg-blue-50 transition-colors">
                Become a Member
              </button>
              <button className="lg:hidden text-white hover:text-white/80">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <main className="flex-1 flex items-center justify-center w-full pb-12 lg:pb-20 pt-24">
          <div className="max-w-7xl w-full mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            <div className="flex-1 text-white w-full max-w-2xl text-center lg:text-left pt-6 lg:pt-0">
              <h1 className="text-4xl lg:text-[3.5rem] font-bold leading-[1.15] mb-6">
                Join StudSphere &ndash; Connect Your Institution with Students
              </h1>
              <p className="text-white/90 text-lg lg:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                Promote your programs, facilities, and opportunities to students across Nepal and beyond.
              </p>
            </div>

            {/* Form Container */}
            <div className="w-full max-w-115">
              <div className="bg-white rounded-4xl p-8 sm:p-10 relative shadow-2xl shadow-black/10 text-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex p-1.5 bg-[#F1F3F5] rounded-full mb-8 relative">
                  <button 
                    onClick={() => setActiveTab("advertise")}
                    className={`flex-1 py-2.5 text-[15px] font-semibold transition-all rounded-full ${activeTab === 'advertise' ? 'text-gray-900 bg-white shadow-sm z-10' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Advertise with us
                  </button>
                  <button 
                    onClick={() => setActiveTab("login")}
                    className={`flex-1 py-2.5 text-[15px] font-bold transition-all rounded-full ${activeTab !== 'advertise' ? 'text-gray-900 bg-white shadow-sm z-10' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Register/Log in
                  </button>
                </div>

                {/* Advertise Form */}
                {activeTab === "advertise" && (
                  <form className="space-y-4 animate-in fade-in duration-300">
                    <input type="text" placeholder="Full name" className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-[#2D68FE] focus:ring-1 focus:ring-[#2D68FE] outline-none" />
                    <input type="tel" placeholder="Mobile number" className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-[#2D68FE] outline-none" />
                    <input type="email" placeholder="Work email" className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-[#2D68FE] outline-none" />
                    <div className="pt-1 pb-1">
                      <label className="block text-[13px] font-medium text-gray-600 uppercase mb-3">Advertise for</label>
                      <div className="flex gap-3">
                        <label className="flex-1 cursor-pointer group">
                          <input type="radio" name="advertise_for" className="peer sr-only" defaultChecked />
                          <div className="text-center py-2.5 border border-gray-200 rounded-4xl text-gray-500 peer-checked:border-[#2D68FE] peer-checked:text-gray-800 transition-all">Your college</div>
                        </label>
                        <label className="flex-1 cursor-pointer group">
                          <input type="radio" name="advertise_for" className="peer sr-only" />
                          <div className="text-center py-2.5 border border-gray-200 rounded-4xl text-gray-500 peer-checked:border-[#2D68FE] peer-checked:text-gray-800 transition-all">Your consultancy</div>
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="w-full mt-4 bg-white border-2 border-[#2D68FE] text-[#2D68FE] font-semibold py-3.5 rounded-[1.25rem] hover:bg-blue-50 transition-colors">Request callback</button>
                  </form>
                )}

                {/* Login Form */}
                {activeTab === "login" && (
                  <div className="animate-in fade-in duration-300">
                    <form className="space-y-4">
                      <input type="email" placeholder="Enter your email" className="w-full px-4 py-3.5 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] focus:ring-2 focus:ring-[#2D68FE]/20 outline-none" />
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          className="w-full px-4 py-3.5 pr-12 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="flex justify-end pt-1">
                        <Link href="#" className="text-[15px] text-[#2D68FE] font-semibold hover:text-blue-800">Forgot password?</Link>
                      </div>
                      <button type="submit" className="w-full bg-[#2D68FE] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors">Log in</button>
                      
                      <div className="flex items-center my-6">
                        <div className="grow border-t border-gray-200"></div>
                        <span className="px-4 text-xs text-gray-400 font-semibold uppercase">Or</span>
                        <div className="grow border-t border-gray-200"></div>
                      </div>
                      
                      <button type="button" className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-[15px] font-semibold text-gray-700 py-3.5 rounded-xl shadow-sm transition-all">
                        <Image src="/google-icon.svg" alt="Google" width={18} height={18} className="w-4.5 h-4.5" />
                        Log in with Google
                      </button>
                    </form>
                    <div className="mt-8 text-center text-[15px] text-gray-500 font-medium">
                      Don&rsquo;t have a registered email?{" "}
                      <button onClick={() => setActiveTab("register")} className="text-[#2D68FE] font-semibold hover:underline">Create account</button>
                    </div>
                  </div>
                )}

                {/* Register Form */}
                {activeTab === "register" && (
                  <div className="animate-in fade-in duration-300">
                    <form className="space-y-4">
                      <input type="text" placeholder="College name" className="w-full px-4 py-3.5 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none" />
                      <input type="text" placeholder="Institution registration number" className="w-full px-4 py-3.5 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none" />
                      <input type="email" placeholder="Work email" className="w-full px-4 py-3.5 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none" />
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Create password" 
                          className="w-full px-4 py-3.5 pr-12 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <button type="submit" className="w-full mt-6 bg-[#2D68FE] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors">Sign up</button>
                    </form>
                    <div className="mt-8 text-center text-[15px] text-gray-500 font-medium">
                      Already have an account?{" "}
                      <button onClick={() => setActiveTab("login")} className="text-[#2D68FE] font-semibold hover:underline">Log in</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Our Service Area</h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Discover our comprehensive suite of services designed to streamline admissions, elevate your institution&rsquo;s profile, and boost student engagement.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((s, i) => (
            <div 
              key={i} 
              className="group bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 border border-slate-50"
            >
              <div className="relative w-16 h-16 mb-6">
                <div className={`absolute top-0 right-2 w-10 h-10 ${s.blob} rounded-full transition-transform group-hover:scale-110`}></div>
                <div className={`relative z-10 flex items-center justify-center w-full h-full text-3xl ${s.color.split(' ')[1]}`}>
                  <s.icon strokeWidth={2.5} className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-900">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- PRICING OVERLAY --- */}
      {showPricingOverlay && (
        <div className="fixed inset-0 z-200 overflow-y-auto bg-white/98 backdrop-blur-md animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto px-6 py-10 lg:py-20 relative">
            <button 
              onClick={() => { setShowPricingOverlay(false); document.body.style.overflow = 'auto'; }}
              className="absolute top-10 right-6 lg:right-10 p-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Header */}
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 bg-[#f0edff] text-[#5f61eb] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <Star className="w-3.5 h-3.5 fill-current" />
                Pricing Plan
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight text-slate-900">
                Select a Plan That Powers Your Success
              </h2>
              <p className="mt-4 text-slate-500 font-medium text-[15px]">
                Unlimited leads and workflows, no credit card required.
              </p>

              {/* Billing Toggle */}
              <div className="flex justify-center mt-12">
                <div className="bg-slate-100 p-1.5 rounded-xl inline-flex border border-slate-200">
                  {(["monthly", "semiAnnually", "annually"] as BillingCycle[]).map((cycle) => (
                    <button
                      key={cycle}
                      onClick={() => setBillingCycle(cycle)}
                      className={`w-28 sm:w-32 py-2.5 text-sm font-bold rounded-lg transition-all ${
                        billingCycle === cycle
                          ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {cycle === "monthly" ? "1 Month" : cycle === "semiAnnually" ? "6 Months" : "1 Year"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
              {TIERS.map((tier, idx) => (
                <div 
                  key={idx}
                  className={`relative p-8 rounded-4xl bg-white transition-all duration-300 ${
                    tier.highlighted 
                      ? 'border-2 border-[#5f61eb] ring-8 ring-[#5f61eb]/5 scale-105 z-10' 
                      : 'border border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {tier.badge && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5f61eb] text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/25">
                      {tier.badge}
                    </span>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                    <p className="text-sm text-slate-500 mt-2 font-medium">{tier.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                      {tier.price[billingCycle]}
                    </span>
                    {tier.price[billingCycle] !== "Free" && (
                      <span className="text-slate-400 font-bold text-sm">{tier.period[billingCycle]}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedPlanModal(tier.name)}
                    className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${
                      tier.highlighted 
                        ? 'bg-[#5f61eb] text-white shadow-xl shadow-blue-500/20 hover:bg-[#4b4dd6]' 
                        : 'bg-slate-50 text-[#5f61eb] hover:bg-slate-100'
                    }`}
                  >
                    {tier.buttonText}
                  </button>
                  <div className="mt-10 pt-10 border-t border-slate-50">
                    <p className="font-bold text-slate-900 text-sm mb-6 flex items-center gap-1">
                       Features:
                    </p>
                    <ul className="space-y-4">
                      {tier.cardFeatures.map((f, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1 bg-emerald-100 text-emerald-600 rounded-full p-0.5">
                            <Check className="w-3 h-3" strokeWidth={4} />
                          </div>
                          <span className="text-sm font-medium text-slate-600">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="max-w-300 mx-auto border-t border-slate-100 pt-32">
              <div className="text-center mb-16">
                <span className="text-[#5f61eb] font-bold text-[13px] uppercase tracking-wider mb-2 block">Comprehensive Comparison</span>
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900">See All Features Included</h2>
              </div>
              
              <div className="bg-white rounded-4xl border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-225">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="py-8 px-10 text-slate-400 font-black text-[10px] uppercase tracking-widest border-b border-slate-100">Plan Features</th>
                        {TIERS.map((t, idx) => (
                          <th key={idx} className="py-8 px-6 text-center font-black text-slate-900 text-sm uppercase tracking-tight border-b border-slate-100">
                            {t.name.split(' ')[0]} Plan
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {FEATURE_CATEGORIES.map((cat, idx) => (
                        <React.Fragment key={idx}>
                          <tr>
                            <td colSpan={4} className="py-6 px-10 text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] bg-slate-50/20">
                              {cat.name}
                            </td>
                          </tr>
                          {cat.features.map((f, fIdx) => (
                            <tr key={fIdx} className="hover:bg-slate-50/40 transition-colors group">
                              <td className="py-5 px-10 text-[14px] font-bold text-slate-700 group-hover:text-slate-900">
                                {f.name}
                              </td>
                              <td className="py-5 px-6">{renderTableCell(f.free)}</td>
                              <td className="py-5 px-6 border-l border-slate-50/50">{renderTableCell(f.standard)}</td>
                              <td className="py-5 px-6 border-l border-slate-50/50">{renderTableCell(f.premium)}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <p className="text-center text-sm text-slate-400 mt-20 font-medium">Click outside or press ESC to close</p>
          </div>
        </div>
      )}

      {/* --- REGISTRATION MODAL --- */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-300 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Register College</h3>
                <p className="text-sm text-slate-500 font-bold mt-1">
                  Plan: <span className="text-[#5f61eb]">{selectedPlanModal}</span>
                </p>
              </div>
              <button onClick={() => setSelectedPlanModal(null)} className="text-slate-300 hover:text-slate-600 transition-colors">
                <X className="w-7 h-7" />
              </button>
            </div>
            <form className="p-10 space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Success!"); setSelectedPlanModal(null); }}>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">College Name</label>
                <input required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#5f61eb]/20 outline-none font-bold placeholder:text-slate-300" placeholder="Enter college name" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Registration Number</label>
                <input required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#5f61eb]/20 outline-none font-bold placeholder:text-slate-300" placeholder="XXXX-XXXX" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Contact</label>
                  <input required type="tel" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#5f61eb]/20 outline-none font-bold placeholder:text-slate-300" placeholder="+977" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Work Email</label>
                  <input required type="email" className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#5f61eb]/20 outline-none font-bold placeholder:text-slate-300" placeholder="email@college.edu" />
                </div>
              </div>
              <button type="submit" className="w-full mt-4 bg-[#5f61eb] hover:bg-[#4b4dd6] text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
