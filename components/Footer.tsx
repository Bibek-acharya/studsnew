"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const routeMap: Record<string, string> = {
  educationPage: "/",
  about: "/about-us",
  team: "/team",
  contact: "/contact-us",
  courseFinder: "/",
  scholarshipMain: "/",
  bookCounselling: "/",
  campusForum: "/",
  studyResources: "/",
  institutionZone: "/institution-zone",
  signup: "/institution-zone",
  providerZone: "/scholarship-provider",
  postScholarship: "/scholarship-provider",
  partner: "/scholarship-provider",
};

const Newsletter = dynamic(() => import("./Newsletter"), { ssr: false });

export default function Footer() {
  const [currentYear] = useState(() => new Date().getFullYear());

  return (
    <div className="bg-[#f8f9fc] rounded-md p-4 sm:p-6 lg:p-4 w-full max-w-[1400px] mx-auto flex flex-col gap-10 lg:gap-12 border border-gray-50 mb-4 mt-16">
      <Newsletter />

      {/* Footer Section */}
      <footer className="flex flex-col gap-8 lg:gap-10 px-4 sm:px-8 lg:px-10 sm:pb-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8 w-full">
          {/* Brand Info */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 w-full lg:w-1/4">
            {/* Logo */}
            <Link
              href={routeMap.educationPage}
              className="group w-fit transition-transform hover:scale-[1.02]"
            >
              <Image 
                src="/studsphere.png" 
                alt="Studsphere Logo" 
                width={180} 
                height={45} 
                className="h-auto w-auto max-w-[160px] sm:max-w-[180px]"
                style={{ height: 'auto' }}
                priority
              />
            </Link>
            
            {/* Contact Info */}
            <p className="text-gray-500 text-sm leading-relaxed mt-2 mb-2 max-w-[240px]">
              Empowering learners globally with advanced tools and career opportunities.
            </p>
            
            <div className="flex flex-col gap-2">
              <a href="tel:+9779712006861" className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors flex items-center justify-center lg:justify-start gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                +977-9712006861
              </a>
              <a href="tel:+9779712006863" className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors flex items-center justify-center lg:justify-start gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                +977-9712006863
              </a>
              <a href="mailto:support@studsphere.com" className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors flex items-center justify-center lg:justify-start gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                support@studsphere.com
              </a>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mt-4">
              {/* Facebook */}
              <a href="https://www.facebook.com/share/1CEcyRH9ZZ/" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-[#0000ff] hover:text-white transition-all transform hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/stud.sphere" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-[#0000ff] hover:text-white transition-all transform hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@stud.sphere" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-[#0000ff] hover:text-white transition-all transform hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/9779800000000" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-[#25D366] hover:text-white transition-all transform hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 w-full lg:w-3/4 lg:pl-8">
            
            {/* Company Column */}
            <div className="flex flex-col">
              <h4 className="font-semibold text-[#0000ff] mb-5 text-sm sm:text-base">Company</h4>
              <ul className="flex flex-col gap-4">
                <li><Link href={routeMap.about} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">About Us</Link></li>
                <li><Link href={routeMap.team} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Our Team</Link></li>
                <li><Link href={routeMap.contact} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Contact Us</Link></li>
              </ul>
            </div>

            {/* Students Column */}
            <div className="flex flex-col">
              <h4 className="font-semibold text-[#0000ff] mb-5 text-sm sm:text-base">Students</h4>
              <ul className="flex flex-col gap-4">
                <li><Link href={routeMap.courseFinder} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">All Courses</Link></li>
                <li><Link href={routeMap.bookCounselling} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Career Counseling</Link></li>
                <li><Link href={routeMap.campusForum} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Community Hub</Link></li>
              </ul>
            </div>

            {/* For Institutions Column */}
            <div className="flex flex-col">
              <h4 className="font-semibold text-[#0000ff] mb-5 text-sm sm:text-base">For Institutions</h4>
              <ul className="flex flex-col gap-4">
                <li><Link href={routeMap.institutionZone} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Institution Login</Link></li>
                <li><Link href={routeMap.institutionZone} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Dashboard</Link></li>
                <li><Link href={routeMap.institutionZone} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Pricing</Link></li>
                <li><Link href={routeMap.signup} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Become a Member</Link></li>
                <li><Link href={routeMap.contact} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Advertise With Us</Link></li>
              </ul>
            </div>

            {/* For Scholarship Provider Column */}
            <div className="flex flex-col">
              <h4 className="font-semibold text-[#0000ff] mb-5 text-sm sm:text-base whitespace-nowrap">For Providers</h4>
              <ul className="flex flex-col gap-4">
                <li><Link href={routeMap.partner} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Partner With Us</Link></li>
                <li><Link href={routeMap.providerZone} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Provider Login</Link></li>
                <li><Link href={routeMap.postScholarship} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Post a Scholarship</Link></li>
                <li><Link href={routeMap.providerZone} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Pricing & Plans</Link></li>
              </ul>
            </div>

            {/* Legal & Help Column */}
            <div className="flex flex-col">
              <h4 className="font-semibold text-[#0000ff] mb-5 text-sm sm:text-base">Legal & Help</h4>
              <ul className="flex flex-col gap-4">
                <li><Link href={routeMap.educationPage} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">FAQs</Link></li>
                <li><Link href={routeMap.about} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Terms of Use</Link></li>
                <li><Link href={routeMap.about} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Privacy Policy</Link></li>
                <li><Link href={routeMap.contact} className="text-gray-500 hover:text-[#0000ff] text-sm transition-colors text-left">Advertising Policy</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Copyright Line */}
        <div className="w-full border-t border-gray-200 pt-4 mt-2 flex flex-col sm:flex-row items-center justify-center">
          <p className="text-gray-500 text-sm">
            Copyright &copy; {currentYear} Studsphere. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
