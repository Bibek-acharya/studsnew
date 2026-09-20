import type { Metadata } from "next";

const TITLE = "Universities in Nepal";
const DESCRIPTION =
  "Browse universities in Nepal with programs, admission criteria, and campus details. Compare Nepali universities and choose the right one for you.";

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

export default function NepaliUniversitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
