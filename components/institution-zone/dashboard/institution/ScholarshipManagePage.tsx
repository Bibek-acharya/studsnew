"use client";
import React, { useState } from 'react';

type ScholarshipStatus = 'ongoing' | 'draft' | 'saved';

interface Tag {
  label: string;
  bg: string;
  text: string;
  dot?: boolean;
}

interface ScholarshipMock {
  id: number;
  title: string;
  org: string;
  status: ScholarshipStatus;
  tags: Tag[];
  amount: string;
  location: string;
  level: string;
  deadline: string;
  deadlineColor: string;
  image?: string;
  verified: boolean;
}

const initialScholarships: ScholarshipMock[] = [
  {
    id: 1,
    title: "Women in Research Scholarship",
    org: "Global Science Alliance",
    status: "ongoing",
    tags: [
      { label: "Need Based", bg: "bg-blue-50", text: "text-blue-600" },
      { label: "Closing Soon", bg: "bg-amber-50", text: "text-amber-600", dot: true }
    ],
    amount: "NPR 500,000",
    location: "Pokhara, Nepal",
    level: "Masters",
    deadline: "Mar 28, 2026",
    deadlineColor: "text-red-500",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400&h=200",
    verified: true
  },
  {
    id: 2,
    title: "STEM Excellence Grant",
    org: "TechForward Foundation",
    status: "ongoing",
    tags: [
      { label: "Merit Based", bg: "bg-green-50", text: "text-green-700" }
    ],
    amount: "$10,000 USD",
    location: "Remote / Global",
    level: "Bachelors / Masters",
    deadline: "May 15, 2026",
    deadlineColor: "text-gray-800",
    verified: true
  },
  {
    id: 3,
    title: "Arts & Culture Fellowship",
    org: "National Heritage Trust",
    status: "draft",
    tags: [
      { label: "Creative", bg: "bg-purple-50", text: "text-purple-700" },
      { label: "Incomplete", bg: "bg-gray-100", text: "text-gray-600" }
    ],
    amount: "NPR 150,000",
    location: "Kathmandu",
    level: "Undergraduate",
    deadline: "TBD",
    deadlineColor: "text-gray-500",
    verified: false
  },
  {
    id: 4,
    title: "Rural Education Initiative",
    org: "EduCare International",
    status: "saved",
    tags: [
      { label: "Need Based", bg: "bg-blue-50", text: "text-blue-600" }
    ],
    amount: "Fully Funded",
    location: "Multiple Districts",
    level: "High School / Bachelors",
    deadline: "Aug 10, 2026",
    deadlineColor: "text-gray-800",
    verified: true
  }
];

interface Props {
  onCreateNew?: () => void;
  onEdit?: (id: number) => void;
}

const ScholarshipManagePage: React.FC<Props> = ({ onCreateNew, onEdit }) => {
  const [scholarships, setScholarships] = useState<ScholarshipMock[]>(initialScholarships);
  const [currentTab, setCurrentTab] = useState<ScholarshipStatus>('ongoing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const archiveScholarship = (id: number) => {
    setScholarships(prev => prev.map(s => s.id === id ? { ...s, status: 'saved' } : s));
    showToast("Scholarship archived to Saved tab.");
  };

  const restoreScholarship = (id: number) => {
    setScholarships(prev => prev.map(s => s.id === id ? { ...s, status: 'ongoing' } : s));
    showToast("Scholarship restored to Ongoing.");
  };

  const deleteScholarship = (id: number) => {
    if (window.confirm("Are you sure you want to delete this scholarship?")) {
      setScholarships(prev => prev.filter(s => s.id !== id));
      showToast("Scholarship deleted successfully.");
    }
  };

  const counts = {
    ongoing: scholarships.filter(s => s.status === 'ongoing').length,
    draft: scholarships.filter(s => s.status === 'draft').length,
    saved: scholarships.filter(s => s.status === 'saved').length,
  };

  const filteredScholarships = scholarships.filter(s => s.status === currentTab);

  return (
    <div className="p-4 lg:p-8 w-full max-w-350 mx-auto min-h-full font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-gray-200 shadow-lg rounded-lg p-4 flex items-center gap-3 min-w-[250px] animate-in slide-in-from-bottom-5">
          <i className="fa-solid fa-check-circle text-green-500 text-xl"></i>
          <span className="text-sm font-medium text-gray-800">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Scholarships</h1>
          <p className="text-sm text-gray-500 mt-1">Create, edit, and manage your institution's scholarship programs.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onCreateNew} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            <i className="fa-solid fa-plus-circle text-lg"></i>
            Create Scholarship
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50">
            <i className="fa-solid fa-filter text-base"></i> Filter
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
        {(['ongoing', 'draft', 'saved'] as const).map(tab => {
          const isActive = currentTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-6 py-3 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
                isActive
                  ? "text-blue-600 border-blue-600 bg-blue-50/50"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="capitalize">{tab}</span>
              <span className={`ml-2 py-0.5 px-2 rounded-full text-xs box-content ${
                isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
              }`}>
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scholarships Grid */}
      {filteredScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          {filteredScholarships.map(item => (
            <div key={item.id} className="bg-white rounded-[20px] border border-gray-200/80 shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow">
              
              {/* Image Area */}
              <div className="h-[140px] bg-gradient-to-b from-gray-200 to-gray-300 rounded-xl mb-4 relative flex items-center justify-center overflow-hidden">
                {item.image && (
                  <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
                )}
                <span className="text-gray-700 font-semibold text-lg relative z-10 px-4 text-center">{item.title}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className={`${tag.bg} ${tag.text} text-[10px] font-bold px-2.5 py-1 rounded-[6px] tracking-wide uppercase flex items-center gap-1.5`}>
                    {tag.dot && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>}
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* Title & Org */}
              <h3 className="text-[19px] font-bold text-gray-900 mb-1 leading-snug">{item.title}</h3>
              <div className="flex items-center gap-1.5 mb-4 text-gray-500 text-[13px] font-medium">
                <span>{item.org}</span>
                {item.verified && <i className="fa-solid fa-circle-check text-blue-600 text-[15px]"></i>}
              </div>

              {/* Details Box */}
              <div className="bg-slate-50 rounded-xl p-3.5 mb-5 space-y-3 text-[13px] text-gray-700 font-medium">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2 w-1/2">
                    <i className="fa-solid fa-money-bill text-gray-400 text-[16px]"></i>
                    <span className="truncate" title={item.amount}>{item.amount}</span>
                  </div>
                  <div className="flex items-center gap-2 w-1/2">
                    <i className="fa-solid fa-location-dot text-gray-400 text-[16px]"></i>
                    <span className="truncate" title={item.location}>{item.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-graduation-cap text-gray-400 text-[16px]"></i>
                  <span className="truncate">{item.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className={`fa-regular fa-calendar ${item.deadlineColor === 'text-red-500' ? 'text-red-500' : 'text-gray-400'} text-[16px]`}></i>
                  <span className={item.deadlineColor}>Ends: {item.deadline}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-auto">
                {currentTab !== 'saved' ? (
                  <button 
                    onClick={() => archiveScholarship(item.id)} 
                    className="flex-1 py-2.5 px-3 border border-gray-300 rounded-[10px] text-gray-700 font-semibold text-[14px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-solid fa-box-archive text-[16px]"></i> Archive
                  </button>
                ) : (
                  <button 
                    onClick={() => restoreScholarship(item.id)} 
                    className="flex-1 py-2.5 px-3 border border-gray-300 rounded-[10px] text-gray-700 font-semibold text-[14px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-solid fa-arrow-rotate-left text-[16px]"></i> Restore
                  </button>
                )}
                <button 
                  onClick={() => onEdit(item.id)} 
                  className="flex-1 py-2.5 px-3 bg-blue-600 rounded-[10px] text-white font-semibold text-[14px] hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-pen text-[16px]"></i> Edit
                </button>
                <button 
                  onClick={() => deleteScholarship(item.id)} 
                  className="p-2.5 border border-red-200 bg-red-50 rounded-[10px] text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors" 
                  title="Delete"
                >
                  <i className="fa-solid fa-trash text-[18px]"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <i className="fa-solid fa-folder-open text-3xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No scholarships found</h3>
          <p className="text-sm text-gray-500 max-w-sm">There are no scholarships in this section right now.</p>
        </div>
      )}
    </div>
  );
};

export default ScholarshipManagePage;
