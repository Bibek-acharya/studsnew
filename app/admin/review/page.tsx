import PendingResourcesSection from "@/components/superadmin/client/PendingResourcesSection";

/**
 * The study-resource approval queue — 04 §6's "approval queue with bulk actions and
 * reject reasons".
 *
 * A thin Server Component that mounts the client section. It fetches nothing: the
 * queue is behind the superadmin gate and authenticates from a token in
 * localStorage, so the data can only be read after hydration.
 */
export default function AdminReviewPage() {
  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Review queue</h1>
      <p className="mt-1 text-sm text-gray-600">
        Uploads wait here before they appear in the public catalogue. Nothing is paid
        until you approve.
      </p>
      <div className="mt-6">
        <PendingResourcesSection />
      </div>
    </main>
  );
}
