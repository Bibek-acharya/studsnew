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

  const routeLink = (event: React.MouseEvent<HTMLButtonElement>, view: string) => {
    event.preventDefault();
    onNavigate?.(view);
    router.push(routeMap[view] ?? "/");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="pointer-events-none absolute left-0 top-0 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-105 w-105 translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-350 px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col lg:col-span-4 lg:pr-8">
            <button
              onClick={(event) => routeLink(event, "educationPage")}
              className="mb-6 flex w-fit items-center space-x-3"
            >
              <div className="rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 p-2.5 shadow-lg shadow-blue-500/25">
                <i className="fa-solid fa-graduation-cap h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">StudSphere</span>
            </button>

            <p className="mb-8 text-sm leading-relaxed text-slate-400">
              Empowering learners globally with advanced tools, community support, and
              career-defining opportunities. Join our growing ecosystem today.
            </p>

            <div className="mb-8 w-full max-w-sm">
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Stay Updated
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="relative flex items-center">
                <i className="fa-solid fa-envelope pointer-events-none absolute left-4 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-full border border-slate-700 bg-slate-900/50 px-10 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="absolute bottom-1.5 right-1.5 top-1.5 rounded-full bg-blue-600 px-4 text-white transition-colors hover:bg-blue-500"
                >
                  <span className="text-xs font-semibold">Subscribe</span>
                </button>
              </form>
              <p
                className={`mt-2 text-xs text-emerald-400 transition-opacity ${
                  showSubscribed ? "opacity-100" : "h-0 overflow-hidden opacity-0"
                }`}
              >
                Thanks for subscribing!
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all hover:-translate-y-1 hover:bg-blue-600 hover:text-white"
              >
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all hover:-translate-y-1 hover:bg-sky-500 hover:text-white"
              >
                <i className="fa-brands fa-x-twitter" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all hover:-translate-y-1 hover:bg-indigo-600 hover:text-white"
              >
                <i className="fa-brands fa-linkedin-in" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all hover:-translate-y-1 hover:bg-pink-600 hover:text-white"
              >
                <i className="fa-brands fa-instagram" />
              </a>
            </div>
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold text-white">Company</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={(event) => routeLink(event, "about")} className="text-left transition-colors hover:text-blue-400">About Us</button></li>
              <li><button onClick={(event) => routeLink(event, "about")} className="text-left transition-colors hover:text-blue-400">Our Team</button></li>
              <li><button onClick={(event) => routeLink(event, "about")} className="text-left transition-colors hover:text-blue-400">Careers</button></li>
              <li><button onClick={(event) => routeLink(event, "contact")} className="text-left transition-colors hover:text-blue-400">Contact Us</button></li>
            </ul>
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold text-white">Students</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={(event) => routeLink(event, "courseFinder")} className="text-left transition-colors hover:text-blue-400">All Courses</button></li>
              <li><button onClick={(event) => routeLink(event, "scholarshipMain")} className="text-left transition-colors hover:text-blue-400">Scholarships</button></li>
              <li><button onClick={(event) => routeLink(event, "bookCounselling")} className="text-left transition-colors hover:text-blue-400">Career Counseling</button></li>
              <li><button onClick={(event) => routeLink(event, "campusForum")} className="text-left transition-colors hover:text-blue-400">Community Hub</button></li>
              <li><button onClick={(event) => routeLink(event, "studyResources")} className="text-left transition-colors hover:text-blue-400">Study Materials</button></li>
            </ul>
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold text-white">For Institutions</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={(event) => routeLink(event, "institutionZone")} className="text-left transition-colors hover:text-blue-400">Institution Login</button></li>
              <li><button onClick={(event) => routeLink(event, "institutionZone")} className="text-left transition-colors hover:text-blue-400">Dashboard</button></li>
              <li><button onClick={(event) => routeLink(event, "institutionZone")} className="text-left transition-colors hover:text-blue-400">Pricing</button></li>
              <li><button onClick={(event) => routeLink(event, "signup")} className="text-left transition-colors hover:text-blue-400">Become a Member</button></li>
              <li><button onClick={(event) => routeLink(event, "contact")} className="text-left transition-colors hover:text-blue-400">Advertise With Us</button></li>
            </ul>
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold text-white">Legal &amp; Help</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={(event) => routeLink(event, "educationPage")} className="text-left transition-colors hover:text-blue-400">FAQs</button></li>
              <li><button onClick={(event) => routeLink(event, "about")} className="text-left transition-colors hover:text-blue-400">Terms of Use</button></li>
              <li><button onClick={(event) => routeLink(event, "about")} className="text-left transition-colors hover:text-blue-400">Privacy Policy</button></li>
              <li><button onClick={(event) => routeLink(event, "contact")} className="text-left transition-colors hover:text-blue-400">Advertising Policy</button></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-350 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <i className="fa-solid fa-shield-halved h-4 w-4 text-emerald-500" />
              <span>Secure Platform</span>
            </div>
            <span className="hidden text-slate-700 sm:inline-block">|</span>
            <p className="text-sm text-slate-500">
              &copy; {currentYear} StudSphere Global Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
