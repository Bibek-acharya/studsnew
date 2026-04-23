import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';
import { scholarshipProviderApi } from '@/services/scholarshipProviderApi';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import DashboardOverview from './DashboardOverview';
import OrganizationProfile from './OrganizationProfile';
import CreateScholarship from './CreateScholarship';
import ManageScholarships from './ManageScholarships';
import ApplicationsDirectory from './ApplicationsDirectory';
import StudentEvaluation from './StudentEvaluation';
import Interviews from './Interviews';
import Messages from './Messages';
import Analytics from './Analytics';
import Settings from './Settings';

interface DashboardProps {
  onLogout?: () => void;
}

const ScholarshipProviderDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    loadUnreadMessages();
  }, [router, onLogout]);

  async function loadUnreadMessages() {
    try {
      const dashboard = await scholarshipProviderApi.getDashboard();
      setUnreadMessages(dashboard.unread_messages);
    } catch {
      setUnreadMessages(0);
    }
  }

  const handleLogout = () => {
    apiService.scholarshipProviderLogout();
    if (onLogout) {
      onLogout();
    } else {
      router.push('/scholarship-provider');
    }
  };

  if (!providerUser) return null;

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const navigateTo = (section: string) => {
    setActiveTab(section);
    setSelectedStudentId(null);
    setEditingScholarshipId(null);
    setIsSidebarOpen(false);
  };

  const handleEditScholarship = (id: number) => {
    setEditingScholarshipId(id);
    setActiveTab('sec-edit-scholarship');
  };

  const handleReviewStudent = (id: string) => {
    setSelectedStudentId(id);
    setActiveTab('sec-student-profile');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'sec-dashboard':
        return <DashboardOverview />;
      case 'sec-org-profile':
        return <OrganizationProfile />;
      case 'sec-create-scholarship':
        return <CreateScholarship onNavigate={navigateTo} />;
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
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 antialiased overflow-hidden font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900 w-full relative">
      <DashboardSidebar 
        isMobileOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeTab={activeTab} 
        onNavigate={navigateTo} 
        handleLogout={handleLogout}
        providerUser={providerUser}
        unreadMessages={unreadMessages}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50 w-full">
        <DashboardHeader toggleSidebar={toggleSidebar} activeTab={activeTab} onNavigate={navigateTo} onNotificationUpdate={loadUnreadMessages} />

        <main className="flex-1 overflow-y-auto relative custom-scrollbar p-0 sm:p-8 max-w-[1600px] w-full mx-auto pb-24" id="main-content">
          <div className="p-4 sm:p-0">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScholarshipProviderDashboard;
