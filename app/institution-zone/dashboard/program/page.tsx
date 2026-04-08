import ProgramPage from "@/components/institution-zone/dashboard/institution/ProgramPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs | Institution Dashboard",
  description: "Manage academic programs offered by your institution.",
};

export default function Page() {
  return <ProgramPage />;
}