import CounsellingPage from "@/components/institution-zone/dashboard/institution/CounsellingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Counselling | Institution Dashboard",
  description: "Manage student counselling requests and time slots.",
};

export default function Page() {
  return <CounsellingPage />;
}