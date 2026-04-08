import EntrancePage from "@/components/institution-zone/dashboard/institution/EntrancePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrance Exam | Institution Dashboard",
  description: "Add and manage entrance exams.",
};

export default function Page() {
  return <EntrancePage />;
}