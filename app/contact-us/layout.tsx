import type { Metadata } from "next";

const TITLE = "Contact Us";
const DESCRIPTION =
  "Get in touch with the Studsphere team for questions about colleges, scholarships, admissions, or partnerships. We're here to help Nepali students.";

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

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
