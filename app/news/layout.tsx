import type { Metadata } from "next";

const TITLE = "Education News";
const DESCRIPTION =
  "Stay updated with the latest education news in Nepal — admissions, entrance exams, scholarships, university announcements, and policy changes.";

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

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
