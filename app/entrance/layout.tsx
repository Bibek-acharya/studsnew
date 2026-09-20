import type { Metadata } from "next";

const TITLE = "Entrance Exams";
const DESCRIPTION =
  "Find entrance exam information for colleges in Nepal, including syllabus, exam dates, eligibility, and preparation tips for management, science, and more.";

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

export default function EntranceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
