import type { Metadata } from "next";

const TITLE = "StudsToken coin table";
const DESCRIPTION =
  "What a StudsToken unlock costs, what every account includes, how long coins last, " +
  "and how the referral programme is structured.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "./" },
  openGraph: { title: `${TITLE} | Studsphere`, description: DESCRIPTION, type: "website" },
};

export default function CoinTableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}