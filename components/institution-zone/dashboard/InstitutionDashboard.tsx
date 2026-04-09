"use client";

import React, { useState } from "react";
import InstitutionLayout, {
  InstitutionPage,
} from "./institution/InstitutionLayout";
import OverviewPage from "./institution/OverviewPage";
import AdmissionPage from "./institution/AdmissionPage";
import AdmissionManagePage from "./institution/AdmissionManagePage";
import ProgramPage from "./institution/ProgramPage";
import CollegeProfilePage from "./institution/CollegeProfilePage";
import CounsellingPage from "./institution/CounsellingPage";
import EntrancePage from "./institution/EntrancePage";
import EventsPage from "./institution/EventsPage";
import NewsNoticePage from "./institution/NewsNoticePage";
// import QMSPage from "./institution/QMSPage";
// import ScholarshipSectionContainer from "./institution/ScholarshipSectionContainer";

const Placeholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-center h-full text-slate-400 text-lg font-medium">
    {title} — Coming Soon
  </div>
);

const InstitutionDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<InstitutionPage>("overview");

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <OverviewPage />;
      case "admission":
        return <AdmissionPage />;
      case "admissionManage":
        return <AdmissionManagePage />;
      case "program":
        return <ProgramPage />;
      case "collegeProfile":
        return <CollegeProfilePage />;
      case "counselling":
        return <CounsellingPage />;
      case "entrance":
        return <EntrancePage />;
      case "events":
        return <EventsPage />;
      case "newsNotice":
        return <NewsNoticePage />;
      // case "qms":
      //   return <QMSPage />;
      case "scholarship":
        return <Placeholder title="Scholarship Applications" />;
      // case "scholarshipManage":
      //   return <ScholarshipSectionContainer />;
      case "message":
        return <Placeholder title="Messages" />;
      case "settings":
        return <Placeholder title="Settings" />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <InstitutionLayout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </InstitutionLayout>
  );
};

export default InstitutionDashboard;
