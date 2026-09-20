import type { Metadata } from "next";

const TITLE = "Foreign Universities";
const DESCRIPTION =
  "Explore foreign universities for studying abroad — programs, admission requirements, and intakes. Compare international universities on Studsphere.";

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

export default function ForeignUniversitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
