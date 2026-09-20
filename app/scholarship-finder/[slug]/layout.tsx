import type { Metadata } from "next";

const TITLE = "Scholarship Details";
const DESCRIPTION =
  "View scholarship details including eligibility, benefits, deadlines, and application steps. Apply for scholarships in Nepal with Studsphere.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
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

export default function ScholarshipDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
