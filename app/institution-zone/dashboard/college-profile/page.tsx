import CollegeProfilePage from "@/components/institution-zone/dashboard/institution/CollegeProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "College Profile | Institution Dashboard",
  description: "Manage your institution's profile and details.",
};

export default function Page() {
  return <CollegeProfilePage />;
}