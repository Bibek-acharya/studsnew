import SettingsPage from "@/components/institution-zone/dashboard/institution/SettingsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Institution Dashboard",
  description: "Manage your account and institution settings.",
};

export default function Page() {
  return <SettingsPage />;
}
