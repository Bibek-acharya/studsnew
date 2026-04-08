import AdmissionPage from "@/components/institution-zone/dashboard/institution/AdmissionPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admission Overview | Institution Dashboard",
  description: "Manage admission overview and applicant tracking.",
};

export default function Page() {
  return <AdmissionPage />;
}