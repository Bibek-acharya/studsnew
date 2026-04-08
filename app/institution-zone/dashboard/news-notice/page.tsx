import NewsNoticePage from "@/components/institution-zone/dashboard/institution/NewsNoticePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Notice | Institution Dashboard",
  description: "Create and publish news and notices for students.",
};

export default function Page() {
  return <NewsNoticePage />;
}