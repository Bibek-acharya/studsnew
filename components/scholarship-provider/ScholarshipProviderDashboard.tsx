import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/api";

const ScholarshipProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [providerUser, setProviderUser] = useState<any>(null);

  useEffect(() => {
    const token = apiService.getScholarshipProviderToken();
    const user = apiService.getScholarshipProviderUser();

    if (!token || !user) {
      navigate("/scholarshipProviderZone");
      return;
    }

    setProviderUser(user);
  }, [navigate]);

  const handleLogout = () => {
    apiService.scholarshipProviderLogout();
    navigate("/scholarshipProviderZone");
  };

  if (!providerUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center fixed w-full top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-graduation-cap text-white"></i>
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">
            Provider Portal
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">
                {providerUser.provider_name}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                {providerUser.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition-colors bg-slate-50 px-4 py-2 rounded-lg"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 mt-[72px] p-6 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {providerUser.provider_name}
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your scholarships and applicants here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Active Scholarships
              </h3>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <i className="fa-solid fa-list-check"></i>
              </div>
            </div>
            <div className="mt-auto">
              <span className="text-4xl font-black text-gray-900">0</span>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Published listings
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Total Applicants
              </h3>
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <i className="fa-solid fa-users"></i>
              </div>
            </div>
            <div className="mt-auto">
              <span className="text-4xl font-black text-gray-900">0</span>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Across all scholarships
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">New Queries</h3>
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i className="fa-regular fa-comment-dots"></i>
              </div>
            </div>
            <div className="mt-auto">
              <span className="text-4xl font-black text-gray-900">0</span>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Unread messages
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center py-20">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <i className="fa-solid fa-folder-open text-3xl text-gray-300"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Scholarships Yet
          </h3>
          <p className="text-gray-500 max-w-sm mb-6">
            You haven't added any scholarships to the platform yet. Set up your
            first scholarship to start receiving applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <i className="fa-solid fa-plus"></i>
              Create Scholarship
            </button>
            <a 
              href="/scholarship-apply" 
              target="_blank" 
              className="bg-white text-indigo-600 border border-indigo-100 font-bold py-3 px-8 rounded-xl shadow-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-eye"></i>
              Preview Entrance Form
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScholarshipProviderDashboard;
