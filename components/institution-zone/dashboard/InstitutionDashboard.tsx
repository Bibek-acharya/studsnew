"use client";

import React, { useState } from "react";
import InstitutionLayout, {
  InstitutionPage,
} from "./institution/InstitutionLayout";
import OverviewPage from "./institution/OverviewPage";
import AdmissionCreatePage from "./institution/AdmissionCreatePage";
import AdmissionApplicationsPage from "./institution/AdmissionApplicationsPage";
import AdmissionDirectoryPage from "./institution/AdmissionDirectoryPage";
import AdmissionShortlistPage from "./institution/AdmissionShortlistPage";
import AdmissionDraftPage from "./institution/AdmissionDraftPage";
import ScholarshipListPage from "./institution/ScholarshipListPage";
import ScholarshipApplicationsPage from "./institution/ScholarshipApplicationsPage";
import CounsellingRequestsPage from "./institution/CounsellingRequestsPage";
import CounsellingHistoryPage from "./institution/CounsellingHistoryPage";
import EntrancePage from "./institution/EntrancePage";
import EntranceDraftPage from "./institution/EntranceDraftPage";
import EntranceDirectoryPage from "./institution/EntranceDirectoryPage";
import EntranceCreatePage from "./institution/EntranceCreatePage";
import EntranceApplicantsPage from "./institution/EntranceApplicantsPage";
import EntranceResultsPage from "./institution/EntranceResultsPage";
import CourseCreatePage from "./institution/CourseCreatePage";
import CourseListPage from "./institution/CourseListPage";
import CreateNewsPage from "./institution/CreateNewsPage";
import NewsDirectoryPage from "./institution/NewsDirectoryPage";
import CreateEventPage from "./institution/CreateEventPage";
import EventsDirectoryPage from "./institution/EventsDirectoryPage";
import CreateBlogPage from "./institution/CreateBlogPage";
import BlogDirectoryPage from "./institution/BlogDirectoryPage";
import ProfilePage from "./institution/ProfilePage";
import AnalyticsPage from "./institution/AnalyticsPage";
import NotificationsPage from "./institution/NotificationsPage";
import SettingsPage from "./institution/SettingsPage";
import StudentsPage from "./institution/StudentsPage";
import ReviewsPage from "./institution/ReviewsPage";
import ManageAdvertisementPage from "./institution/ManageAdvertisementPage";

const InstitutionDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<InstitutionPage>("overview");

  const renderPage = () => {
    switch (activePage) {
      case "overview": return <OverviewPage />;
      case "createAdmission": return <AdmissionCreatePage />;
      case "admissionApplications": return <AdmissionApplicationsPage />;
      case "admissionDirectory": return <AdmissionDirectoryPage />;
      case "admissionShortlist": return <AdmissionShortlistPage />;
      case "admissionDraft": return <AdmissionDraftPage />;
      case "scholarshipList": return <ScholarshipListPage />;
      case "scholarshipApplications": return <ScholarshipApplicationsPage />;
      case "counsellingRequests": return <CounsellingRequestsPage />;
      case "counsellingHistory": return <CounsellingHistoryPage />;
      case "entranceDetails": return <EntrancePage />;
      case "entranceDraft": return <EntranceDraftPage />;
      case "entranceDirectory": return <EntranceDirectoryPage />;
      case "entranceCreate": return <EntranceCreatePage />;
      case "entranceApplicants": return <EntranceApplicantsPage />;
      case "entranceResults": return <EntranceResultsPage />;
      case "courseCreate": return <CourseCreatePage />;
      case "courseList": return <CourseListPage />;
      case "createNews": return <CreateNewsPage />;
      case "newsDirectory": return <NewsDirectoryPage />;
      case "createEvent": return <CreateEventPage />;
      case "eventsDirectory": return <EventsDirectoryPage />;
      case "createBlog": return <CreateBlogPage />;
      case "blogDirectory": return <BlogDirectoryPage />;
      case "profile": return <ProfilePage />;
      case "analytics": return <AnalyticsPage />;
      case "notification": return <NotificationsPage />;
      case "settings": return <SettingsPage />;
      case "students": return <StudentsPage />;
      case "reviews": return <ReviewsPage />;
      case "manageAdvertisement": return <ManageAdvertisementPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <InstitutionLayout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </InstitutionLayout>
  );
};

export default InstitutionDashboard;
