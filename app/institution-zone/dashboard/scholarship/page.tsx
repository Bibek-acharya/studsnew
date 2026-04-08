import ScholarshipSectionContainer from "@/components/institution-zone/dashboard/institution/ScholarshipSectionContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholarship | Institution Dashboard",
  description: "Manage scholarship applications and programs.",
};

export default function Page() {
  return <ScholarshipSectionContainer />;
}