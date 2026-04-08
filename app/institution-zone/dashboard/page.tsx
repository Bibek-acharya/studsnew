import InstitutionDashboard from "@/components/institution-zone/dashboard/InstitutionDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institution Dashboard | Studsphere",
  description: "Comprehensive dashboard for institution management.",
};

export default function Page() {
  return <InstitutionDashboard />;
}
