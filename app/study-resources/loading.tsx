export default function StudyResourcesLoading() {
  return (
    <div className="min-h-screen bg-[#f6f8fc] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-350">
        <div className="min-h-[420px] animate-pulse rounded-3xl bg-slate-900/90" />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          Loading study resources...
        </p>
      </div>
    </div>
  );
}
