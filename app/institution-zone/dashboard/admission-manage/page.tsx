import AdmissionManagePage from "@/components/institution-zone/dashboard/institution/AdmissionManagePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Program | Institution Dashboard",
  description: "Manage admission programs and their details.",
};

export default function Page() {
  return <AdmissionManagePage />;
}