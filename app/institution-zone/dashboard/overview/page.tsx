import OverviewPage from "@/components/institution-zone/dashboard/institution/OverviewPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview | Institution Dashboard",
  description: "Comprehensive dashboard overview for institution management.",
};

export default function Page() {
  return <OverviewPage />;
}