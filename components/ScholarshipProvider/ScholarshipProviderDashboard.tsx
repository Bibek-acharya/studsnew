import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { apiService } from '@/services/api';
import { scholarshipProviderApi } from '@/services/scholarshipProviderApi';
import PageLayout from './layout/PageLayout';

const DashboardOverview = dynamic(() => import('./DashboardOverview'));
const OrganizationProfile = dynamic(() => import('./OrganizationProfile'));
const CreateScholarship = dynamic(() => import('./CreateScholarship'));
const ManageScholarships = dynamic(() => import('./ManageScholarships'));
const ScholarshipDirectory = dynamic(() => import('./ScholarshipDirectory'));
const ApplicationsDirectory = dynamic(() => import('./ApplicationsDirectory'));
const StudentEvaluation = dynamic(() => import('./StudentEvaluation'));
const Interviews = dynamic(() => import('./Interviews'));
const Messages = dynamic(() => import('./Messages'));
const Analytics = dynamic(() => import('./Analytics'));
const Settings = dynamic(() => import('./Settings'));
const AssignAccess = dynamic(() => import('./AssignAccess'));
const CreateNews = dynamic(() => import('./CreateNews'));
const NewsDirectory = dynamic(() => import('./NewsDirectory'));
const CreateEvent = dynamic(() => import('./CreateEvent'));
const EventsDirectory = dynamic(() => import('./EventsDirectory'));
const CreateBlog = dynamic(() => import('./CreateBlog'));
const BlogDirectory = dynamic(() => import('./BlogDirectory'));
const Calendar = dynamic(() => import('./Calendar'));
const ResultPublish = dynamic(() => import('./ResultPublish'));
const ShortlistManagement = dynamic(() => import('./ShortlistManagement'));

interface DashboardProps {
  onLogout?: () => void;
}

const ScholarshipProviderDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('sec-dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [editingScholarshipId, setEditingScholarshipId] = useState<number | null>(null);
  const [providerUser, setProviderUser] = useState<any>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const token = apiService.getScholarshipProviderToken();
    const user = apiService.getScholarshipProviderUser();

    if (!token || !user) {
      if (onLogout) {
        onLogout();
      } else {
        router.push('/scholarship-provider');
      }
      return;
    }

    setProviderUser(user);

    async function loadUnreadMessages() {
      try {
        const dashboard = await scholarshipProviderApi.getDashboard();
        setUnreadMessages(dashboard.unread_messages);
      } catch {
        setUnreadMessages(0);
      }
    }

    loadUnreadMessages();
  }, [router, onLogout]);

  const handleLogout = useCallback(() => {
    apiService.scholarshipProviderLogout();
    if (onLogout) {
      onLogout();
    } else {
      router.push('/scholarship-provider');
    }
  }, [onLogout, router]);

  const navigateTo = useCallback((section: string) => {
    setActiveTab(section);
    setSelectedStudentId(null);
    setEditingScholarshipId(null);
  }, []);

  const handleEditScholarship = useCallback((id: number) => {
    setEditingScholarshipId(id);
    setActiveTab('sec-edit-scholarship');
  }, []);

  const handleReviewStudent = useCallback((id: string) => {
    setSelectedStudentId(id);
    setActiveTab('sec-student-profile');
  }, []);

  if (!providerUser) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'sec-dashboard':
        return <DashboardOverview onNavigate={navigateTo} />;
      case 'sec-org-profile':
        return <OrganizationProfile />;
      case 'sec-create-scholarship':
        return <CreateScholarship onNavigate={navigateTo} />;
      case 'sec-scholarship-directory':
        return <ScholarshipDirectory />;
      case 'sec-edit-scholarship':
        return <CreateScholarship scholarshipId={editingScholarshipId} onNavigate={navigateTo} />;
      case 'sec-manage-scholarships':
        return <ManageScholarships onNavigate={navigateTo} onEdit={handleEditScholarship} />;
      case 'sec-applications':
        return <ApplicationsDirectory onReviewStudent={handleReviewStudent} />;
      case 'sec-student-profile':
        return <StudentEvaluation applicationId={selectedStudentId || ''} onBack={() => setActiveTab('sec-applications')} />;
      case 'sec-interviews':
        return <Interviews />;
      case 'sec-messages':
        return <Messages />;
      case 'sec-reports':
        return <Analytics />;
      case 'sec-settings':
        return <Settings />;
      case 'sec-assign-access':
        return <AssignAccess />;
      case 'sec-create-news':
        return <CreateNews />;
      case 'sec-news-directory':
        return <NewsDirectory />;
      case 'sec-create-event':
        return <CreateEvent />;
      case 'sec-events-directory':
        return <EventsDirectory />;
      case 'sec-create-blog':
        return <CreateBlog />;
      case 'sec-blog-directory':
        return <BlogDirectory />;
      case 'sec-calendar':
        return <Calendar />;
      case 'sec-messages':
        return <Messages />;
      case 'sec-results':
        return <ResultPublish />;
      case 'sec-shortlist':
        return <ShortlistManagement />;
      default:
        return <DashboardOverview onNavigate={navigateTo} />;
    }
  };

  return (
    <PageLayout
      activeTab={activeTab}
      onNavigate={navigateTo}
      onLogout={handleLogout}
      providerUser={providerUser}
      unreadMessages={unreadMessages}
    >
      {renderContent()}
    </PageLayout>
  );
};

export default ScholarshipProviderDashboard;
