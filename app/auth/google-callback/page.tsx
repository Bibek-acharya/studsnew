"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/services/AuthContext";

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.user_id,
      email: payload.email,
      role: payload.role || "student",
      first_name: payload.first_name || payload.email?.split("@")[0] || "",
      last_name: payload.last_name || "",
      image_url: payload.image_url || "",
    };
  } catch {
    return null;
  }
}

function GoogleAuthCallback() {
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const token = searchParams.get("token");
    const redirect = searchParams.get("redirect") || "/";

    if (!token) {
      window.location.href = "/login?error=Authentication failed";
      return;
    }

    const user = decodeToken(token);
    if (user) {
      setSession(user, token);
      window.location.href = redirect;
    } else {
      window.location.href = "/login?error=Failed to process login";
    }
  }, []);

  return null;
}

export default function GoogleAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-gray-500">Processing login...</p></div>}>
      <GoogleAuthCallback />
    </Suspense>
  );
}
