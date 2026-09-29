/**
 * The route-level skeleton for the study-resource collections.
 *
 * Realigned to the page dialect the catalogue actually renders: `bg-gray-50`
 * ground, `rounded-md` tiles, `border-gray-200`, at the same
 * `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3` the real grid uses. The previous
 * version carried a `bg-[#f6f8fc]` / `rounded-2xl` / `rounded-3xl` / slate
 * treatment that exists nowhere else in the feature, so the page visibly
 * changed shape on every navigation and this route was the last trace of that
 * second language (06 §12). The video player's dark stage is the documented
 * exception and is untouched.
 *
 * `data-testid="resource-skeleton"` is preserved on the tiles: the in-page cold
 * load skeleton carries the same hook and the layout test asserts on it.
 */
export default function StudyResourcesLoading() {
  return (
    <div className="min-h-[70vh] bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-350 px-4 pb-14 sm:px-0">
        <div className="mb-7">
          <div className="mb-2 h-8 w-64 animate-pulse rounded-md bg-gray-200" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-gray-100" />
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              data-testid="resource-skeleton"
              className="flex animate-pulse flex-col rounded-md border border-gray-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="h-10 w-10 rounded-md bg-gray-200" />
                <div className="h-5 w-20 rounded bg-gray-100" />
              </div>
              <div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />
              <div className="mt-2.5 space-y-2">
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
              </div>
              <div className="mt-4 border-b border-gray-200 pb-4">
                <div className="h-3 w-1/2 rounded bg-gray-100" />
              </div>
              <div className="flex items-center justify-between gap-3 pt-4">
                <div className="h-3 w-20 rounded bg-gray-100" />
                <div className="h-8 w-24 rounded-md bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
