export default function DashboardLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm font-semibold text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );
}
