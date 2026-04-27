"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    window.location.href = "/";
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
