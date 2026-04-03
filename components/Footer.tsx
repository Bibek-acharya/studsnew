"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface FooterProps {
  onNavigate?: (view: string) => void;
}

const routeMap: Record<string, string> = {
  educationPage: "/",
  about: "/",
  contact: "/",
  courseFinder: "/",
  scholarshipMain: "/",
  bookCounselling: "/",
  campusForum: "/",
  studyResources: "/",
  institutionZone: "/",
  signup: "/",
};

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = React.useState("");
  const [showSubscribed, setShowSubscribed] = React.useState(false);
  const router = useRouter();

  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setShowSubscribed(true);
    setEmail("");
    window.setTimeout(() => setShowSubscribed(false), 3000);
  };

  const routeLink = (
    event: React.MouseEvent<HTMLButtonElement>,
    view: string,
  ) => {
    event.preventDefault();
    onNavigate?.(view);
    router.push(routeMap[view] ?? "/");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="pointer-events-none absolute left-0 top-0 h-64 xs:h-80 sm:h-100 md:h-125 w-64 xs:w-80 sm:w-100 md:w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0000FF]/10 blur-[80px] xs:blur-[100px] md:blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 xs:h-72 sm:h-88 md:h-105 w-56 xs:w-72 sm:w-88 md:w-105 translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-500/10 blur-[70px] xs:blur-[80px] md:blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 xs:px-5 sm:px-6 lg:px-8 pb-10 xs:pb-12 sm:pb-14 md:pb-16 pt-10 xs:pt-12 sm:pt-16 md:pt-20">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-12 gap-8 xs:gap-10 sm:gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col xs:col-span-2 md:col-span-4 md:pr-6 lg:pr-8">
            <button
              onClick={(event) => routeLink(event, "educationPage")}
              className="mb-5 xs:mb-6 flex w-fit items-center space-x-2.5 xs:space-x-3"
            >
              <div className="rounded-lg xs:rounded-xl bg-[#0000FF] p-2 xs:p-2.5 shadow-lg shadow-blue-500/25">
                <i className="fa-solid fa-graduation-cap h-5 w-5 xs:h-6 xs:w-6 text-white" />
              </div>
              <span className="text-xl xs:text-2xl font-bold tracking-tight text-white">
                StudSphere
              </span>
            </button>

            <p className="mb-6 xs:mb-8 text-xs xs:text-sm leading-relaxed text-slate-400">
              Empowering learners globally with advanced tools, community
              support, and career-defining opportunities. Join our growing
              ecosystem today.
            </p>

            {/* Newsletter */}
            <div className="mb-6 xs:mb-8 w-full max-w-sm">
              <h4 className="mb-2.5 xs:mb-3 text-[10px] xs:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Stay Updated
              </h4>
              <form
                onSubmit={handleNewsletterSubmit}
                className="relative flex items-center"
              >
                <i className="fa-solid fa-envelope pointer-events-none absolute left-3 xs:left-4 h-3.5 w-3.5 xs:h-4 xs:w-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-full border border-slate-700 bg-slate-900/50 pl-9 xs:pl-10 pr-20 xs:pr-24 py-2.5 xs:py-3 text-xs xs:text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-transparent focus:ring-2 focus:ring-[#0000FF]"
                />
                <button
                  type="submit"
                  className="absolute bottom-1 xs:bottom-1.5 right-1 xs:right-1.5 top-1 xs:top-1.5 rounded-full bg-[#0000FF] px-3 xs:px-4 text-white transition-colors hover:bg-[#0000CC]"
                >
                  <span className="text-[10px] xs:text-xs font-semibold">
                    Subscribe
                  </span>
                </button>
              </form>
              <p
                className={`mt-1.5 xs:mt-2 text-[10px] xs:text-xs text-emerald-400 transition-opacity ${
                  showSubscribed
                    ? "opacity-100"
                    : "h-0 overflow-hidden opacity-0"
                }`}
              >
                Thanks for subscribing!
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-2 xs:gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 xs:h-10 xs:w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all hover:-translate-y-1 hover:bg-[#0000FF] hover:text-white"
              >
                <i className="fa-brands fa-facebook-f text-sm xs:text-base" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 xs:h-10 xs:w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all hover:-translate-y-1 hover:bg-sky-500 hover:text-white"
              >
                <i className="fa-brands fa-x-twitter text-sm xs:text-base" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 xs:h-10 xs:w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all hover:-translate-y-1 hover:bg-indigo-600 hover:text-white"
              >
                <i className="fa-brands fa-linkedin-in text-sm xs:text-base" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 xs:h-10 xs:w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all hover:-translate-y-1 hover:bg-pink-600 hover:text-white"
              >
                <i className="fa-brands fa-instagram text-sm xs:text-base" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="xs:col-span-1 md:col-span-2">
            <h3 className="mb-4 xs:mb-5 md:mb-6 text-xs xs:text-sm font-bold text-white">
              Company
            </h3>
            <ul className="space-y-3 xs:space-y-3.5 md:space-y-4 text-xs xs:text-sm text-slate-400">
              <li>
                <button
                  onClick={(event) => routeLink(event, "about")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={(event) => routeLink(event, "about")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Our Team
                </button>
              </li>
              <li>
                <button
                  onClick={(event) => routeLink(event, "about")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={(event) => routeLink(event, "contact")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Students */}
          <div className="xs:col-span-1 md:col-span-2">
            <h3 className="mb-4 xs:mb-5 md:mb-6 text-xs xs:text-sm font-bold text-white">
              Students
            </h3>
            <ul className="space-y-3 xs:space-y-3.5 md:space-y-4 text-xs xs:text-sm text-slate-400">
              <li>
                <button
                  onClick={(event) => routeLink(event, "courseFinder")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  All Courses
                </button>
              </li>
              <li>
                <button
                  onClick={(event) => routeLink(event, "scholarshipMain")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={(event) => routeLink(event, "bookCounselling")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Career Counseling
                </button>
              </li>
              <li>
                <button
                  onClick={(event) => routeLink(event, "campusForum")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Community Hub
                </button>
              </li>
              <li className="hidden xs:block">
                <button
                  onClick={(event) => routeLink(event, "studyResources")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Study Materials
                </button>
              </li>
            </ul>
          </div>

          {/* Institutions */}
          <div className="xs:col-span-1 md:col-span-2">
            <h3 className="mb-4 xs:mb-5 md:mb-6 text-xs xs:text-sm font-bold text-white">
              For Institutions
            </h3>
            <ul className="space-y-3 xs:space-y-3.5 md:space-y-4 text-xs xs:text-sm text-slate-400">
              <li>
                <button
                  onClick={(event) => routeLink(event, "institutionZone")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Institution Login
                </button>
              </li>
              <li>
                <button
                  onClick={(event) => routeLink(event, "institutionZone")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Dashboard
                </button>
              </li>
              <li className="hidden xs:block">
                <button
                  onClick={(event) => routeLink(event, "institutionZone")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={(event) => routeLink(event, "signup")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Become a Member
                </button>
              </li>
              <li className="hidden xs:block">
                <button
                  onClick={(event) => routeLink(event, "contact")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Advertise With Us
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="xs:col-span-1 md:col-span-2">
            <h3 className="mb-4 xs:mb-5 md:mb-6 text-xs xs:text-sm font-bold text-white">
              Legal &amp; Help
            </h3>
            <ul className="space-y-3 xs:space-y-3.5 md:space-y-4 text-xs xs:text-sm text-slate-400">
              <li>
                <button
                  onClick={(event) => routeLink(event, "educationPage")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={(event) => routeLink(event, "about")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Terms of Use
                </button>
              </li>
              <li>
                <button
                  onClick={(event) => routeLink(event, "about")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Privacy Policy
                </button>
              </li>
              <li className="hidden xs:block">
                <button
                  onClick={(event) => routeLink(event, "contact")}
                  className="text-left transition-colors hover:text-blue-400"
                >
                  Advertising Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-[1400px] px-4 xs:px-5 sm:px-6 lg:px-8 py-4 xs:py-5 sm:py-6">
          <div className="flex flex-col xs:flex-row items-center gap-3 xs:gap-4 text-center xs:text-left">
            <div className="flex items-center gap-1.5 xs:gap-2 text-[11px] xs:text-sm text-slate-500">
              <i className="fa-solid fa-shield-halved h-3.5 w-3.5 xs:h-4 xs:w-4 text-emerald-500" />
              <span>Secure Platform</span>
            </div>
            <span className="hidden xs:inline-block text-slate-700">|</span>
            <p className="text-[11px] xs:text-sm text-slate-500">
              &copy; {currentYear} StudSphere Global Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
