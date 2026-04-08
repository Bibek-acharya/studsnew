"use client";

import React, { useState, useMemo } from "react";
import InstitutionLayout from "./institution/InstitutionLayout";
import OverviewPage from "./institution/OverviewPage";
import ProgramPage from "./institution/ProgramPage";
import AdmissionPage from "./institution/AdmissionPage";
import AdmissionManagePage from "./institution/AdmissionManagePage";
import QMSPage from "./institution/QMSPage";
import CounsellingPage from "./institution/CounsellingPage";
import EntrancePage from "./institution/EntrancePage";
import NewsNoticePage from "./institution/NewsNoticePage";
import EventsPage from "./institution/EventsPage";
import CollegeProfilePage from "./institution/CollegeProfilePage";
import PlacementPage from "./institution/PlacementPage";
import StaffManagementPage from "./institution/StaffManagementPage";
import ScholarshipPage from "./institution/ScholarshipPage";
import SocialMediaPage from "./institution/SocialMediaPage";
import FAQPage from "./institution/FAQPage";
import InquiryPage from "./institution/InquiryPage";
import ExportReportPage from "./institution/ExportReportPage";
import SettingPage from "./institution/SettingPage";

const InstitutionDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  // Sub-navigation state for Program Edit view
  const [isEditingProgram, setIsEditingProgram] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);

  const handleEditProgram = (id: string) => {
    setEditingProgramId(id);
    setIsEditingProgram(true);
  };

  const handleBackToPrograms = () => {
    setIsEditingProgram(false);
    setEditingProgramId(null);
  };

  const renderContent = useMemo(() => {
    if (isEditingProgram) {
      return (
        <AdmissionManagePage
          onBack={handleBackToPrograms}
          programId={editingProgramId}
        />
      );
    }

    switch (activeTab) {
      case "Overview":
        return <OverviewPage />;
      case "Program List":
        return <ProgramPage onEdit={handleEditProgram} />;
      case "Admission Details":
        return <AdmissionPage />;
      case "QMS (Query System)":
        return <QMSPage />;
      case "Booked Counselling":
        return <CounsellingPage />;
      case "Entrance Portal":
        return <EntrancePage />;
      case "News & Notices":
        return <NewsNoticePage />;
      case "Events Management":
        return <EventsPage />;
      case "Institutional Profile":
        return <CollegeProfilePage />;
      case "Placement & Careers":
        return <PlacementPage />;
      case "Faculty & Staff":
        return <StaffManagementPage />;
      case "Scholarship":
        return <ScholarshipPage />;
      case "Social Media & Links":
        return <SocialMediaPage />;
      case "FAQ Management":
        return <FAQPage />;
      case "General Inquiries":
        return <InquiryPage />;
      case "Analytics & Reports":
        return <ExportReportPage />;
      case "Account Settings":
        return <SettingPage />;
      default:
        return <OverviewPage />;
    }
  }, [activeTab, isEditingProgram, editingProgramId]);

  return (
    <InstitutionLayout
      activeTab={activeTab}
      setActiveTab={(tab) => {
        setActiveTab(tab);
        setIsEditingProgram(false); // Reset editing state when switching main tabs
      }}
    >
      {renderContent}
    </InstitutionLayout>
  );
};

export default InstitutionDashboard;
