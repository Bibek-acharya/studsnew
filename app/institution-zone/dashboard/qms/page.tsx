import QMSPage from "@/components/institution-zone/dashboard/institution/QMSPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QMS (Query Management) | Institution Dashboard",
  description: "Manage student queries and support tickets.",
};

export default function Page() {
  return <QMSPage />;
}