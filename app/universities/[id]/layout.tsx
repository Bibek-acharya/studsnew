import type { Metadata } from "next";

const TITLE = "University Details";
const DESCRIPTION =
  "View university details including programs, admission criteria, campuses, and contact information. Compare universities in Nepal and abroad.";

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

export default function UniversityDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
