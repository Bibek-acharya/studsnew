export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
        <p className="font-semibold text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
