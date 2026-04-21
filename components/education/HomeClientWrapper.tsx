"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/services/AuthContext";
import OnboardingModal from "@/components/auth/OnboardingModal";
import PreferenceModal from "@/components/user/dashboard/PreferenceModal";
import ProjectShikshaPopup from "@/components/project-shiksha/ShikshaPopup";

const ONBOARDING_KEY = "onboarding_completed";

interface HomeClientWrapperProps {
  children: React.ReactNode;
}

export default function HomeClientWrapper({ children }: HomeClientWrapperProps) {
  const { isAuthenticated, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPreference, setShowPreference] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) return;

    const onboardingCompleted = sessionStorage.getItem(ONBOARDING_KEY);
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    } else {
      setShowPreference(true);
    }
  }, [isAuthenticated, loading]);

  const handleOnboardingClose = () => {
    sessionStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
  };

  return (
    <>
      {children}
      <ProjectShikshaPopup />
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
      />
      <PreferenceModal
        isOpen={showPreference && !showOnboarding}
        onClose={() => setShowPreference(false)}
      />
    </>
  );
}