import type { Metadata } from "next";

const TITLE = "Find Colleges in Nepal";
const DESCRIPTION =
  "Search and compare colleges across Nepal by program, location, and fees. Explore courses, facilities, and reviews to find the college that fits you best.";

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

export default function FindCollegeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
