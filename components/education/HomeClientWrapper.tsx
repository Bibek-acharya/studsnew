"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/services/AuthContext";
import { apiService } from "@/services/api";
import OnboardingModal from "@/components/auth/OnboardingModal";
import ProjectShikshaPopup from "@/components/project-shiksha/ShikshaPopup";

const ONBOARDING_KEY = "onboarding_completed";

interface HomeClientWrapperProps {
  children: React.ReactNode;
}

export default function HomeClientWrapper({ children }: HomeClientWrapperProps) {
  const { isAuthenticated, loading, token } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkedBackend, setCheckedBackend] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !token) {
      setCheckedBackend(true);
      return;
    }

    const checkOnboardingStatus = async () => {
      try {
        const response = await apiService.getProfile();
        const profileData = response.data;
        const onboardingCompleted = profileData?.preferences?.onboarding_completed || false;
        
        if (!onboardingCompleted) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        const onboardingSession = sessionStorage.getItem(ONBOARDING_KEY);
        if (!onboardingSession) {
          setShowOnboarding(true);
        }
      } finally {
        setCheckedBackend(true);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, loading, token]);

  const handleOnboardingClose = () => {
    sessionStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
  };

  if (!checkedBackend && loading) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <ProjectShikshaPopup />
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
      />
    </>
  );
}

