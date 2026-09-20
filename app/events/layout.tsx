import type { Metadata } from "next";

const TITLE = "Education Events";
const DESCRIPTION =
  "Discover education events in Nepal — college fairs, seminars, entrance prep workshops, and career counseling sessions happening near you.";

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

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
