import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const levelLabel = level
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const title =
    levelLabel && levelLabel.length <= 30
      ? `${levelLabel} Admissions`
      : "Admissions";
  return {
    title,
    description: `Explore ${levelLabel || "college"} admissions in Nepal — open deadlines, eligibility, and application details for your next program.`,
    alternates: { canonical: "./" },
    openGraph: {
      title: `${title} | Studsphere`,
      description: `Explore ${levelLabel || "college"} admissions in Nepal — open deadlines, eligibility, and application details for your next program.`,
      type: "website",
    },
  };
}

export default function AdmissionsLevelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
