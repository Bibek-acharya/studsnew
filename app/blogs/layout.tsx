import type { Metadata } from "next";

const TITLE = "Blogs";
const DESCRIPTION =
  "Read student stories, exam preparation guides, and education tips from the Studsphere blog. Stay informed with articles written for Nepali students.";

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

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
