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
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studsphere.com"),
  title: {
    default: "Studsphere - Nepal's #1 College & Scholarship Finder",
    template: "%s | Studsphere",
  },
  description:
    "Find top colleges in Nepal, compare courses, apply for scholarships, and get admission guidance. Studsphere helps students discover the perfect college.",
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
    title: "Studsphere - Nepal's #1 College & Scholarship Finder",
    description:
      "Find top colleges in Nepal, compare courses, apply for scholarships, and get admission guidance.",
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
    countryName: "Nepal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studsphere - Nepal's #1 College & Scholarship Finder",
    description:
      "Find top colleges in Nepal, compare courses, apply for scholarships, and get admission guidance.",
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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.2.0/css/all.min.css"
        />
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
                  sameAs: [],
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
