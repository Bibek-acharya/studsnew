import AdminCoinsConsole from "@/components/coins/admin/AdminCoinsConsole";

/**
 * The admin coin console — 04 §6's "admin console and monitoring".
 *
 * A thin Server Component that mounts the console. It fetches nothing itself: every
 * endpoint on this page is behind the superadmin gate and authenticates from a token
 * in `localStorage`, which does not exist on the server. So the data has to be read
 * after mount, which makes this the one genuinely client-side surface in the coin
 * feature — and the reason the split below is server-then-client rather than the other
 * way round.
 */
export default function AdminCoinsPage() {
  return <AdminCoinsConsole />;
}