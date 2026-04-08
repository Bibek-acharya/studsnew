import type { Metadata } from "next";

import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Footer from "@/components/Footer";
import Providers from "./providers";
import NavbarWrapper from "./navbar-wrapper";
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
  title: "Studsphere - Find Your Perfect College",
  description:
    "Discover and compare colleges, courses, and scholarships in Nepal.",
  icons: {
    icon: "/globe.svg",
  },
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
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <Providers>
          <NavbarWrapper />
          <div className="flex min-h-screen flex-col bg-white">
            <main className="flex-1 bg-white">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
