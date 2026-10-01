/**
 * Skeleton for the wallet, shaped like the page it replaces.
 *
 * `app/user/dashboard/loading.tsx` already covers this segment, and that file is
 * a full-screen centred spinner in the stray `bg-[#f8fafc]` / `rounded-2xl`
 * dialect that 06 §0.2 flags. A spinner here would also be the wrong shape: this
 * page is a static list of rows that will arrive in well under a second most of
 * the time, so a centred spinner for 200ms is a flash of chrome rather than a
 * loading state. The skeleton below mirrors the ledger's own skeleton
 * (`WalletSection.tsx`), which is what 06 §12 asks for — skeleton fidelity.
 *
 * No `h-screen`: the dashboard layout is already a fixed-height flex shell with
 * its own scroll container, so a full-height skeleton would overflow it.
 */
export default function CoinsLoading() {
  return (
    <div className="space-y-5">
      <div>
        <div className="h-7 w-40 animate-pulse rounded-md bg-gray-100" aria-hidden="true" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" aria-hidden="true" />
      </div>

      <div className="h-40 animate-pulse rounded-md border border-gray-200 bg-white" aria-hidden="true" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-md border border-gray-200 bg-white lg:col-span-2" aria-hidden="true" />
        <div className="h-80 animate-pulse rounded-md border border-gray-200 bg-gray-50" aria-hidden="true" />
      </div>

      <div className="h-64 animate-pulse rounded-md border border-gray-200 bg-white" aria-hidden="true" />
    </div>
  );
}