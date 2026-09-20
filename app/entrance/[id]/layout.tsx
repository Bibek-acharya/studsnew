import type { Metadata } from "next";

const TITLE = "Entrance Exam Details";
const DESCRIPTION =
  "View entrance exam details including syllabus, dates, eligibility, and preparation resources. Prepare for entrance exams in Nepal with Studsphere.";

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

export default function EntranceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
