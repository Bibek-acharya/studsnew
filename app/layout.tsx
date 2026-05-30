import type { Metadata } from "next";
import Script from "next/script";

import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import FooterWrapper from "./footer-wrapper";
import Providers from "./providers";
import NavbarWrapper from "./navbar-wrapper";
import LayoutPaddingWrapper from "./layout-padding-wrapper";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studsphere.com"),
  title: {
    default: "Studsphere - Connecting Students with Colleges & Opportunities",
    template: "%s | Studsphere",
  },
  description:
    "Discover top colleges in Nepal, compare courses, find scholarships, and get expert admission guidance — all in one place.",
  keywords: [
    "colleges in Nepal",
    "scholarships in Nepal",
    "college finder Nepal",
    "study in Nepal",
    "admission Nepal",
    "course finder",
    "Nepal education",
    "college comparison Nepal",
  ],
  icons: {
    icon: [{ url: "/icon.png", sizes: "199x199", type: "image/png" }],
    apple: [{ url: "/icon.png", sizes: "199x199", type: "image/png" }],
  },
  openGraph: {
    title: "Studsphere - Connecting Students with Colleges & Opportunities",
    description:
      "Discover top colleges in Nepal, compare courses, find scholarships, and get expert admission guidance.",
    url: "https://studsphere.com",
    siteName: "Studsphere",
    images: [
      {
        url: "/icon.png",
        width: 199,
        height: 199,
        alt: "Studsphere",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studsphere - Connecting Students with Colleges & Opportunities",
    description:
      "Discover top colleges in Nepal, compare courses, find scholarships, and get expert admission guidance.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "Studsphere",
                  url: "https://studsphere.com",
                  logo: "https://studsphere.com/icon.png",
                  description:
                    "Nepal's leading college discovery and scholarship platform.",
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer support",
                    url: "https://studsphere.com/contact-us",
                  },
                  sameAs: [
                    "https://www.facebook.com/share/1CEcyRH9ZZ/",
                    "https://www.instagram.com/stud.sphere",
                    "https://www.tiktok.com/@stud.sphere",
                  ],
                },
                {
                  "@type": "WebSite",
                  url: "https://studsphere.com",
                  name: "Studsphere",
                  description:
                    "Find top colleges in Nepal, compare courses, and apply for scholarships.",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate:
                        "https://studsphere.com/search?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <NavbarWrapper />
          <LayoutPaddingWrapper>
            <main className="flex-1">{children}</main>
            <FooterWrapper />
          </LayoutPaddingWrapper>
        </Providers>
      </body>
    </html>
  );
}
