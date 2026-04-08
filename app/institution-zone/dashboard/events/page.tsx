import EventsPage from "@/components/institution-zone/dashboard/institution/EventsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Institution Dashboard",
  description: "Create and manage campus events.",
};

export default function Page() {
  return <EventsPage />;
}