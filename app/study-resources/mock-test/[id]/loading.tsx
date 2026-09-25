export default function MockTestLoading() {
  return (
    <div className="min-h-[60vh] bg-gray-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="h-8 w-64 animate-pulse rounded-md bg-slate-200" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        <div className="mt-4 h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          Loading mock test...
        </p>
      </div>
    </div>
  );
}
