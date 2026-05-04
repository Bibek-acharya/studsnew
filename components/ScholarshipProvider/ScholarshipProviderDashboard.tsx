import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { apiService } from '@/services/api';
import { scholarshipProviderApi } from '@/services/scholarshipProviderApi';
import { getStoredPermissions, PERMISSIONS_LIST } from "@/services/providerRbac";
import PageLayout from './layout/PageLayout';
import Unauthorized from './layout/Unauthorized';
import { Toaster } from 'sonner';

const DashboardOverview = dynamic(() => import('./DashboardOverview'));
const OrganizationProfile = dynamic(() => import('./OrganizationProfile'));
const CreateScholarship = dynamic(() => import('./CreateScholarship'));
const ManageScholarships = dynamic(() => import('./ManageScholarships'));
const ScholarshipDirectory = dynamic(() => import('./ScholarshipDirectory'));
const ApplicationsDirectory = dynamic(() => import('./ApplicationsDirectory'));
const ApplicationDetails = dynamic(() => import('./ApplicationDetails'));
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
const CustomizeForm = dynamic(() => import('./CustomizeForm'));
const DraftScholarship = dynamic(() => import('./DraftScholarship'));
const WrittenExam = dynamic(() => import('./WrittenExam'));
const Notifications = dynamic(() => import('./Notifications'));


interface DashboardProps {
  onLogout?: () => void;
}

const ScholarshipProviderDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('sec-dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [editingScholarshipId, setEditingScholarshipId] = useState<number | null>(null);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [providerUser, setProviderUser] = useState<any>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [rbacPermissions, setRbacPermissions] = useState<string[]>([]);

  useEffect(() => {
    async function loadProviderData() {
      try {
        const [profile, dashboard] = await Promise.all([
          scholarshipProviderApi.getProfile(),
          scholarshipProviderApi.getDashboard(),
        ]);
        setProviderUser(profile);
        setUnreadMessages(dashboard.unread_messages);
        
        if (profile.is_sub_user) {
          setRbacPermissions(profile.permissions || []);
        } else {
          // Main provider has all permissions
          const allPerms = PERMISSIONS_LIST.map(p => p.id);
          setRbacPermissions(allPerms);
        }
      } catch (err) {
        console.error("Failed to load provider data:", err);
        setProviderUser({ provider_name: "Provider", email: "" });
        setUnreadMessages(0);
        setRbacPermissions([]);
      }
    }

    loadProviderData();
  }, [router, onLogout]);


  const PERMISSION_MAP: Record<string, string> = {
    "sec-create-scholarship": "scholarships",
    "sec-scholarship-directory": "scholarships",
    "sec-manage-scholarships": "scholarships",
    "sec-applications": "applications",
    "sec-student-profile": "applications",
    "sec-interviews": "evaluation",
    "sec-messages": "messages",
    "sec-reports": "analytics",
    "sec-settings": "settings",
    "sec-assign-access": "access",
    "sec-create-news": "news",
    "sec-news-directory": "news",
    "sec-create-event": "events",
    "sec-events-directory": "events",
    "sec-create-blog": "blogs",
    "sec-blog-directory": "blogs",
    "sec-org-profile": "profile",
    "sec-shortlist": "shortlists",
    "sec-written-exam": "evaluation",
    "sec-results": "evaluation",
    "sec-customize-form": "scholarships",
    "sec-draft-scholarship": "scholarships",
  };

  const canAccess = (section: string): boolean => {
    const required = PERMISSION_MAP[section];
    if (!required) return true;
    return rbacPermissions.includes(required);
  };

  const handleLogout = useCallback(() => {
    apiService.logout();
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
    if (!canAccess(activeTab)) {
      return <Unauthorized />;
    }

    switch (activeTab) {
      case 'sec-dashboard':
        return <DashboardOverview onNavigate={navigateTo} />;
      case 'sec-org-profile':
        return <OrganizationProfile />;
      case 'sec-create-scholarship':
        return <CreateScholarship onNavigate={navigateTo} />;
      case 'sec-scholarship-directory':
        return <ScholarshipDirectory onEdit={handleEditScholarship} />;
      case 'sec-edit-scholarship':
        return <CreateScholarship scholarshipId={editingScholarshipId} onNavigate={navigateTo} />;
      case 'sec-manage-scholarships':
        return <ManageScholarships onNavigate={navigateTo} onEdit={handleEditScholarship} />;
      case 'sec-applications':
        return <ApplicationsDirectory onReviewStudent={handleReviewStudent} />;
      case 'sec-student-profile':
        return <ApplicationDetails applicationId={selectedStudentId || ''} onBack={() => setActiveTab('sec-applications')} />;
      case 'sec-interviews':
        return <Interviews />;
      case 'sec-messages':
        return <Messages />;
      case 'sec-reports':
        return <Analytics />;
      case 'sec-settings':
        return <Settings profile={providerUser} onLogout={handleLogout} />;
      case 'sec-assign-access':
        return <AssignAccess />;
      case 'sec-create-news':
        return <CreateNews newsId={editingNewsId || undefined} onNavigate={navigateTo} onEditComplete={() => setEditingNewsId(null)} />;
      case 'sec-news-directory':
        return <NewsDirectory onView={(id) => {}} onEdit={(id) => { setEditingNewsId(id); navigateTo('sec-create-news'); }} />;
      case 'sec-create-event':
        return <CreateEvent eventId={editingEventId || undefined} onNavigate={navigateTo} onEditComplete={() => setEditingEventId(null)} />;
      case 'sec-events-directory':
        return <EventsDirectory onView={(id) => {}} onEdit={(id) => { setEditingEventId(id); navigateTo('sec-create-event'); }} />;
      case 'sec-create-blog':
        return <CreateBlog blogId={editingBlogId || undefined} onNavigate={navigateTo} onEditComplete={() => setEditingBlogId(null)} />;
      case 'sec-blog-directory':
        return <BlogDirectory onView={(id) => {}} onEdit={(id) => { setEditingBlogId(id); navigateTo('sec-create-blog'); }} />;
      case 'sec-calendar':
        return <Calendar />;
      case 'sec-messages':
        return <Messages />;
      case 'sec-results':
        return <ResultPublish />;
      case 'sec-shortlist':
        return <ShortlistManagement onReviewStudent={handleReviewStudent} />;
      case 'sec-written-exam':
        return <WrittenExam />;
      case 'sec-customize-form':
        return <CustomizeForm />;
      case 'sec-draft-scholarship':
        return <DraftScholarship onEdit={handleEditScholarship} onNavigate={navigateTo} />;
      case 'sec-notifications':
        return <Notifications />;
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
      permissions={rbacPermissions}
    >
      {renderContent()}
      <Toaster position="bottom-left" closeButton={false} />
    </PageLayout>
  );
};

export default ScholarshipProviderDashboard;
