import type { Metadata } from "next";

const TITLE = "Scholarship Finder";
const DESCRIPTION =
  "Discover scholarships for students in Nepal. Filter by level, provider, and deadline to find funding opportunities for your studies.";

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

export default function ScholarshipFinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
