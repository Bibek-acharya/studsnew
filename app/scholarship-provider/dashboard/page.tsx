"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ScholarshipProviderDashboard from "@/components/ScholarshipProvider/ScholarshipProviderDashboard";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";

export default function DashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem("scholarshipProviderToken");
        const userStr = localStorage.getItem("scholarshipProviderUser");
        
        if (!token || !userStr) {
          setAuthenticated(false);
          router.push("/scholarship-provider");
          return;
        }

        // Optional: verify token validity with a lightweight API call
        await scholarshipProviderApi.getProfile();
        setAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("scholarshipProviderToken");
        localStorage.removeItem("scholarshipProviderUser");
        setAuthenticated(false);
        router.push("/scholarship-provider");
      }
    }

    checkAuth();
  }, [router]);

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (authenticated === false) {
    return null; // Will redirect in useEffect
  }

  return <ScholarshipProviderDashboard />;
}
