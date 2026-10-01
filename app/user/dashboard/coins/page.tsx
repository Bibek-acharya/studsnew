import type { Metadata } from "next";
import WalletSection from "@/components/user/dashboard/sections/WalletSection";

/**
 * `/user/dashboard/coins` — the wallet.
 *
 * A server shell around a client section, which is the shape every other
 * dashboard route here uses (see `bookmarks/page.tsx`). The data read happens in
 * the section because the balance is per-user and the bearer token lives in
 * localStorage, which no server component in this app can reach; `apiRequest`
 * attaches it client-side and there is no server-side session helper to
 * substitute. One read, on the page that exists to show it.
 *
 * Not indexed: the page is entirely per-student, and every figure on it is
 * different for every reader.
 */
export const metadata: Metadata = {
  title: "StudsTokens",
  robots: { index: false, follow: false },
};

export default function CoinsPage() {
  return <WalletSection />;
}