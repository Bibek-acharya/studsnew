'use client'

import { useState } from 'react'

export default function ProfileSection() {
  const [profileTab, setProfileTab] = useState('personal')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="relative inline-block">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-24 h-24 rounded-full mx-auto border-4 border-slate-50 shadow-sm" alt="Profile" />
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full text-xs border-2 border-white"><i className="fas fa-camera"></i></button>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-4">Alex Student</h2>
          <p className="text-sm text-slate-500">Aspiring Computer Scientist</p>
          
          <div className="mt-6 text-left">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Profile Strength</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mt-6">
          <h4 className="font-bold text-slate-800 mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">Python</span>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">Leadership</span>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">Public Speaking</span>
            <button className="px-2 py-1 border border-dashed border-slate-300 text-slate-400 text-xs rounded-md hover:border-blue-500 hover:text-blue-600">+ Add</button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
          <div className="border-b border-slate-100 overflow-x-auto">
            <nav className="flex px-6 gap-6 min-w-max">
              {[{ id: 'personal', label: 'Personal Details' }, { id: 'education', label: 'Education History' }, { id: 'preferred', label: 'Preferred Study' }, { id: 'documents', label: 'Documents' }].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setProfileTab(tab.id)}
                  className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    profileTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {profileTab === 'personal' && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input type="text" defaultValue="Alex Student" className="w-full rounded-lg border-slate-200 border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" defaultValue="alex@university.edu" className="w-full rounded-lg border-slate-200 border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full rounded-lg border-slate-200 border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                    <input type="date" defaultValue="2002-05-15" className="w-full rounded-lg border-slate-200 border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                    <textarea rows={4} defaultValue="Passionate about technology and physics. Looking for opportunities to research in quantum computing." className="w-full rounded-lg border-slate-200 border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button>
                </div>
              </div>
            )}

            {profileTab === 'education' && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Education History</h3>
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4 relative">
                    <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                    <h4 className="font-bold text-slate-800">Springfield High School</h4>
                    <p className="text-sm text-slate-500">High School Diploma</p>
                    <div className="flex gap-4 mt-2 text-sm text-slate-600">
                      <span><i className="fas fa-calendar mr-1"></i> 2018 - 2022</span>
                      <span><i className="fas fa-star mr-1"></i> GPA: 3.8/4.0</span>
                    </div>
                  </div>
                  <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors">
                    + Add New Education
                  </button>
                </div>
              </div>
            )}

            {profileTab === 'documents' && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">My Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded flex items-center justify-center text-lg">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-sm font-bold text-slate-800 truncate">Resume_2024.pdf</h4>
                      <p className="text-xs text-slate-500">Uploaded 2 days ago</p>
                    </div>
                    <button className="text-slate-400 hover:text-blue-600"><i className="fas fa-download"></i></button>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded flex items-center justify-center text-lg">
                      <i className="fas fa-file-word"></i>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-sm font-bold text-slate-800 truncate">SOP_Draft.docx</h4>
                      <p className="text-xs text-slate-500">Uploaded 1 week ago</p>
                    </div>
                    <button className="text-slate-400 hover:text-blue-600"><i className="fas fa-download"></i></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
