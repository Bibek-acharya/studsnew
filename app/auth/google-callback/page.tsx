"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/AuthContext";
import { apiService } from "@/services/api";

export default function GoogleAuthCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    const finishLogin = async () => {
      try {
        const res = await apiService.getProfile();
        const profile = res.data;
        setUser({
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          role: profile.role,
        });
      } catch {
        // ignore — will redirect to home anyway
      }
      router.push("/");
    };
    finishLogin();
  }, [router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
