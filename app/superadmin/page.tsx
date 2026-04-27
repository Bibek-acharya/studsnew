"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperadminEntryPage() {
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || sessionStorage.getItem("token")
        : null;
    if (token) {
      router.replace("/superadmin/dashboard");
    } else {
      router.replace("/superadmin/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  );
}

