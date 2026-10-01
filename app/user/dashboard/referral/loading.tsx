/**
 * Skeleton for the referral page, shaped like the page it replaces.
 *
 * The same reasoning as `app/user/dashboard/coins/loading.tsx`, including the
 * reason it is not a centred spinner: this is a short static-shaped page that
 * will usually be ready in under a second, so a full-page spinner is a flash of
 * chrome rather than a loading state. The three blocks below are the three
 * regions the page actually has — the code and share card, the cap meter, the
 * groups — so the layout does not jump when the numbers arrive.
 *
 * No `h-screen`: the dashboard layout is a fixed-height flex shell with its own
 * scroll container, and a full-height skeleton would overflow it.
 */
export default function ReferralLoading() {
  return (
    <div className="space-y-5" data-testid="referral-skeleton">
      <div>
        <div className="h-7 w-44 animate-pulse rounded-md bg-gray-100" aria-hidden="true" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" aria-hidden="true" />
      </div>

      <div className="h-56 animate-pulse rounded-md border border-gray-200 bg-white" aria-hidden="true" />
      <div className="h-20 animate-pulse rounded-md border border-gray-200 bg-white" aria-hidden="true" />
      <div className="h-48 animate-pulse rounded-md border border-gray-200 bg-white" aria-hidden="true" />
    </div>
  );
}
