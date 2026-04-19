"use client";

import React from "react";
import Link from "next/link";

interface AuthPageLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerHref?: string;
}

const patternBackground = {
  backgroundColor: "#0000ff",
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg width=\'520\' height=\'150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'0\' y=\'70\' font-family=\'system-ui, sans-serif\' font-weight=\'200\' font-size=\'85\' fill=\'none\' stroke=\'%233333FF\' stroke-width=\'1.5\' letter-spacing=\'-6\'%3Eostudssphere%3C/text%3E%3Ctext x=\'-200\' y=\'145\' font-family=\'system-ui, sans-serif\' font-weight=\'200\' font-size=\'85\' fill=\'none\' stroke=\'%233333FF\' stroke-width=\'1.5\' letter-spacing=\'-6\'%3Eostudssphere%3C/text%3E%3C/svg%3E")',
  backgroundSize: "520px 150px",
  backgroundRepeat: "repeat",
};

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerHref,
}) => {
  const showFooter = footerText && footerLinkText && footerHref;
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-gray-900">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-4 bg-white">
        <div className="bg-white h-full w-full mx-4 my-4 rounded-md overflow-hidden shadow-lg" style={patternBackground} />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-105">
          <div className="mb-6 flex items-center gap-4">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="/studsphere.png" 
                alt="StudsSphere" 
                className="h-12 w-auto"
              />
            </a>
          </div>
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-[#111827] mb-2 tracking-tight">{title}</h1>
            <p className="text-[15px] text-gray-500">{subtitle}</p>
          </div>

          <div className="w-full space-y-6">{children}</div>

          {showFooter && (
            <div className="mt-6 text-center text-sm text-gray-600">
              {footerText}{" "}
              <Link href={footerHref} className="text-[#0000ff] font-semibold hover:text-blue-800">
                {footerLinkText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPageLayout;
