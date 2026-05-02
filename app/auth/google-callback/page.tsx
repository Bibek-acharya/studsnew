"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/AuthContext";
import { apiService } from "@/services/api";

export default function GoogleAuthCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [message, setMessage] = useState("Signing you in...");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const hydrateSession = async () => {
      try {
        const response = await apiService.getProfile();
        const profile = response?.data;

        if (!profile) {
          throw new Error("Profile not found after Google sign-in.");
        }

        const user = {
          id: profile.id,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          role: profile.role,
        };

        if (!active) return;

        setUser(user);
        setMessage("Login successful. Redirecting...");
        window.setTimeout(() => {
          if (active) router.replace("/");
        }, 400);
      } catch (err) {
        if (!active) return;
        console.error("Google auth callback failed:", err);
        setError("Google sign-in completed, but we could not load your session. Please log in again.");
        window.setTimeout(() => {
          if (active) router.replace("/login");
        }, 1600);
      }
    };

    hydrateSession();

    return () => {
      active = false;
    };
  }, [router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Google Sign-In</h1>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
