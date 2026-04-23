import React from 'react';

interface SidebarProps {
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  onNavigate: (section: string) => void;
  handleLogout: () => void;
  providerUser: any;
  unreadMessages: number;
}

const DashboardSidebar = ({ isMobileOpen, toggleSidebar, activeTab, onNavigate, handleLogout, providerUser, unreadMessages }: SidebarProps) => {
  const menuItems = [
    { menu: 'main', id: 'sec-dashboard', icon: 'fa-chart-pie', label: 'Overview' },
    { menu: 'main', id: 'sec-applications', icon: 'fa-users', label: 'Applications Directory' },
    { menu: 'main', id: 'sec-messages', icon: 'fa-comments', label: 'Messages / Chat' },
    
    { menu: 'management', id: 'sec-manage-scholarships', icon: 'fa-list-check', label: 'Manage Scholarships' },
    { menu: 'management', id: 'sec-create-scholarship', icon: 'fa-plus-circle', label: 'Create Opportunity' },
    { menu: 'management', id: 'sec-interviews', icon: 'fa-video', label: 'Interviews' },
    
    { menu: 'system', id: 'sec-reports', icon: 'fa-chart-line', label: 'Analytics & Reports' },
    { menu: 'system', id: 'sec-org-profile', icon: 'fa-building', label: 'Organization Profile' },
    { menu: 'system', id: 'sec-settings', icon: 'fa-gear', label: 'Settings' }
  ];

  const renderNavGroup = (groupName: string, menuKey: string) => (
    <div className="px-6 mb-6">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{groupName}</p>
      <nav className="space-y-1">
        {menuItems
          .filter(item => item.menu === menuKey)
          .map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-3 border-l-[3px] ${
                activeTab === item.id 
                  ? 'bg-primary-50 text-primary-600 border-primary-600 font-bold' 
                  : 'text-slate-600 border-transparent hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <div className="w-6 text-center">
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              {item.label}
              {item.id === 'sec-messages' && unreadMessages > 0 && (
                 <span className="ml-auto bg-danger text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadMessages}</span>
              )}
            </button>
          ))}
      </nav>
    </div>
  );

  return (
    <aside
      id="sidebar"
      className={`w-72 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-40 h-full absolute md:relative shadow-xl md:shadow-none ${
        isMobileOpen ? 'flex' : 'hidden md:flex'
      }`}
    >
      <div className="h-20 flex items-center px-6 border-b border-slate-100 justify-between bg-white shrink-0">
        <div className="flex items-center gap-3 text-primary-600 font-bold text-2xl tracking-tight">
          <div className="w-10 h-10 rounded-md bg-primary-50 flex items-center justify-center">
            <i className="fa-solid fa-graduation-cap text-xl"></i>
          </div>
          StudSphere
        </div>
        <button className="md:hidden text-slate-400 hover:text-slate-700 text-xl" onClick={toggleSidebar}>
          <i className="fa-solid fa-times"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        {renderNavGroup('Main Menu', 'main')}
        {renderNavGroup('Management', 'management')}
        {renderNavGroup('System', 'system')}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto shrink-0 space-y-2">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-2 rounded-md transition"
          onClick={() => onNavigate('sec-org-profile')}
        >
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(providerUser?.provider_name || 'Provider')}&background=2563eb&color=fff&rounded=true&bold=true`}
            className="w-11 h-11 rounded-full "
            alt="Org Logo"
          />
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold truncate text-slate-800 uppercase tracking-tighter">{providerUser?.provider_name || 'Global Foundation'}</p>
            <p className="text-[10px] text-primary-600 font-bold truncate uppercase">Premium Provider</p>
          </div>
          <i className="fa-solid fa-gear text-slate-400 text-xs"></i>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-slate-500 hover:text-danger hover:bg-red-50 transition-colors font-bold text-sm"
        >
          <i className="fa-solid fa-arrow-right-from-bracket w-5"></i>
          Logout System
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
