"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/services/AuthContext";
import { apiService } from "@/services/api";

function GoogleAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const redirect = searchParams.get("redirect") || "/";

    if (!token) {
      // If no token, maybe we are already logged in via cookie?
      // But for Google flow we expect a token in the URL now.
      router.push("/login?error=Authentication failed");
      return;
    }

    const finishLogin = async () => {
      try {
        // We pass the token explicitly to getProfile because it's not yet in localStorage
        const res = await apiService.getProfile({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } as any);
        
        const profile = res.data;
        setSession({
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          role: profile.role,
          image_url: profile.image_url,
        }, token);
        
        // Use a small timeout to ensure state is committed before redirect
        setTimeout(() => {
          router.push(redirect);
        }, 100);
      } catch (err) {
        console.error("Failed to finish Google login:", err);
        router.push("/login?error=Failed to fetch profile");
      }
    };
    finishLogin();
  }, [router, searchParams, setSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="relative">
           <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
           <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Completing Sign In</h2>
          <p className="text-gray-500 text-sm">Please wait while we sync your account...</p>
        </div>
      </div>
    </div>
  );
}

export default function GoogleAuthCallbackPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    }>
      <GoogleAuthCallback />
    </Suspense>
  );
}
