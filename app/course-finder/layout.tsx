import type { Metadata } from "next";

const TITLE = "Course Finder";
const DESCRIPTION =
  "Find courses offered by top colleges in Nepal. Compare programs by curriculum, eligibility, fees, and career outcomes to choose the right course.";

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

export default function CourseFinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
