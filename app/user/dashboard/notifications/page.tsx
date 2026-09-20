import { redirect } from "next/navigation";

export const metadata = {
  title: "Notifications",
};

// Unified on /notifications (the shared-client inbox with the real archive
// tab). This redirect keeps dashboard deep links and bookmarks working.
export default function Page() {
  redirect("/notifications");
}
