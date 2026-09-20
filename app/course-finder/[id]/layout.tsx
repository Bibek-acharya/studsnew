import type { Metadata } from "next";

const TITLE = "Course Details";
const DESCRIPTION =
  "Explore course details including curriculum, eligibility, admission process, fees, scholarships, and FAQs. Find the right program for your career goals.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "./" },
    openGraph: {
      title: `${TITLE} | Studsphere`,
      description: DESCRIPTION,
      type: "website",
    },
  };
}

export default function CourseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
