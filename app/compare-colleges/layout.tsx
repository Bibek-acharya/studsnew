import type { Metadata } from "next";

const TITLE = "Compare Colleges";
const DESCRIPTION =
  "Compare colleges in Nepal side by side — courses, fees, facilities, and reviews. Make an informed decision with Studsphere's college comparison tool.";

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

export default function CompareCollegesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
