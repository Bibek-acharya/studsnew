import type { Metadata } from "next";

const TITLE = "College Details";
const DESCRIPTION =
  "View detailed college information including courses, fees, facilities, scholarships, and admission requirements. Compare and shortlist colleges on Studsphere.";

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

export default function FindCollegeDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
