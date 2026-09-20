import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";

const TITLE = "About Us";
const DESCRIPTION =
  "Learn about Studsphere — Nepal's AI-powered education platform connecting students with colleges, scholarships, courses, and career opportunities.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "./" },
  openGraph: {
    title: `${TITLE} | Studsphere`,
    description: DESCRIPTION,
    type: "website",
  },
};

export default function AboutUsRoutePage() {
  return <AboutPage />;
}
