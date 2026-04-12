'use client'

import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const switchTab = (tab: string) => {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  const navItems = [
    { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
    { id: 'applications', icon: 'fa-file-contract', label: 'Inquiries' },
    { id: 'chat', icon: 'fa-comment-dots', label: 'Messages' },
    { id: 'calendar', icon: 'fa-calendar-alt', label: 'My Calendar' },
    { id: 'sphereinvites', icon: 'fa-envelope-open-text', label: 'SphereInvites' },
    { id: 'counselling', icon: 'fa-user-md', label: 'Counselling' },
    { id: 'profile', icon: 'fa-user-circle', label: 'My Profile' },
    { id: 'bookmarks', icon: 'fa-bookmark', label: 'Bookmarks' },
    { id: 'notifications', icon: 'fa-bell', label: 'Notifications' },
    { id: 'resources', icon: 'fa-book-open', label: 'Study Resources' },
  ]

  return (
    <div className="bg-slate-50 text-slate-800 antialiased font-sans h-screen flex overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-white z-50 shadow-sm h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="font-bold text-lg text-slate-800">StudSphere</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-600 hover:text-blue-600">
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 flex flex-col h-full shadow-xl md:shadow-none`}>
        <div className="h-20 flex items-center px-8 border-b border-slate-100 hidden md:flex">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3 shadow-lg">S</div>
          <span className="font-bold text-xl text-slate-800">StudSphere</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 mt-16 md:mt-0 flex flex-col">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => switchTab(item.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors w-full text-left ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <i className={`fas ${item.icon} w-6`}></i>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="mt-auto"></div>

          <div className="px-2 py-4 mb-2">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl p-4 text-white text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <i className="fas fa-briefcase text-4xl"></i>
              </div>
              <h4 className="font-bold text-sm mb-1 relative z-10">Need a Job?</h4>
              <p className="text-[10px] text-blue-100 mb-3 relative z-10">Find internships & freelance gigs matched to your skills.</p>
              <button className="bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-lg w-full hover:bg-blue-50 transition-colors shadow-sm relative z-10">Search Now</button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">Settings</p>
            <button onClick={() => switchTab('settings')} className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-left">
              <i className="fas fa-cog w-6"></i>
              Settings & Privacy
            </button>
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-500 hover:bg-red-50 transition-colors text-left">
              <i className="fas fa-sign-out-alt w-6"></i>
              Logout
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="w-10 h-10 rounded-full bg-white shadow-sm" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-700 truncate">Alex Student</p>
              <p className="text-xs text-slate-500 truncate">alex@university.edu</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-full pt-16 md:pt-0 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && <DashboardSection />}
          {activeTab === 'applications' && <ApplicationsSection />}
          {activeTab === 'chat' && <ChatSection />}
          {activeTab === 'calendar' && <CalendarSection />}
          {activeTab === 'sphereinvites' && <SphereInvitesSection />}
          {activeTab === 'counselling' && <CounsellingSection />}
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'bookmarks' && <BookmarksSection />}
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'resources' && <ResourcesSection />}
          {activeTab === 'settings' && <SettingsSection />}
        </div>
      </main>
    </div>
  )
}

function CounsellingSection() {
  const [counsellingTab, setCounsellingTab] = useState('upcoming')

  const upcomingSessions = [
    { counselor: 'Dr. Emily Smith', org: 'Global Career Institute', date: 'Feb 24, 2026', time: '10:00 AM - 11:00 AM', status: 'Confirmed' },
  ]

  const colleges = [
    { name: 'KIST College', location: 'Kamalpokhari, Kathmandu', specialization: 'Science & Management', icon: 'fa-university', color: 'blue' },
    { name: 'GoldenGate College', location: 'Battisputali, Kathmandu', specialization: 'Science, Mgmt & Humanities', icon: 'fa-graduation-cap', color: 'yellow' },
    { name: "Trinity Int'l College", location: 'Dillibazar, Kathmandu', specialization: 'A Levels & +2 Science/Mgmt', icon: 'fa-book-reader', color: 'green' },
  ]

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Counselling & Mentorship</h2>
          <p className="text-slate-500 mt-1">Expert guidance for your academic and personal growth.</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
          <i className="fas fa-calendar-plus"></i> Book Session
        </button>
      </div>

      <div className="border-b border-slate-200 mb-6">
        <nav className="flex gap-6 overflow-x-auto pb-0">
          {['New Requests', 'Upcoming Sessions', 'Past Sessions', 'Explore Counselors'].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setCounsellingTab(idx === 0 ? 'booked' : idx === 1 ? 'upcoming' : idx === 2 ? 'past' : 'explore')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap text-sm font-medium ${
                counsellingTab === (idx === 0 ? 'booked' : idx === 1 ? 'upcoming' : idx === 2 ? 'past' : 'explore')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {counsellingTab === 'upcoming' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingSessions.map((session, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=DrSmith" className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200" alt="Avatar" />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{session.counselor}</h4>
                    <p className="text-xs text-slate-500">{session.org}</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">{session.status}</span>
              </div>
              <div className="mb-5 relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Session Time</p>
                <p className="text-sm font-bold text-slate-800">{session.date}</p>
                <p className="text-xs text-slate-500">{session.time}</p>
              </div>
              <button className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 relative z-10">
                <i className="fas fa-video"></i> Join Google Meet
              </button>
            </div>
          ))}
        </div>
      )}

      {counsellingTab === 'explore' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg bg-${college.color}-50 flex items-center justify-center text-${college.color}-600 font-bold border border-${college.color}-100`}>
                  {college.name.charAt(0)}
                </div>
                <button className="text-slate-300 hover:text-red-500 transition-colors"><i className="far fa-heart"></i></button>
              </div>
              <div className="mb-4 text-center">
                <div className="relative inline-block">
                  <div className={`w-20 h-20 rounded-full bg-slate-50 border-2 border-white shadow-sm mx-auto mb-2 flex items-center justify-center text-2xl font-bold text-slate-400`}>
                    <i className={`fas ${college.icon}`}></i>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"><i className="fas fa-check"></i></div>
                </div>
                <h4 className="font-bold text-slate-800 text-lg">{college.name}</h4>
                <p className={`text-sm text-${college.color}-600 font-medium`}>{college.location}</p>
                <p className="text-xs text-slate-500 mt-1">{college.specialization}</p>
              </div>
              <div className="flex justify-center gap-3 mb-5">
                <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fas fa-globe"></i></a>
              </div>
              <div className="mt-auto space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide border-t border-slate-100 pt-3 mb-2">
                  <span>Available</span>
                  <span className="text-green-600">9:00 AM - 4:00 PM</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">View Profile</button>
                  <button className="py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProfileSection() {
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

function BookmarksSection() {
  const [filterCategory, setFilterCategory] = useState('all')

  const bookmarks = [
    { id: 1, title: 'Yale University', category: 'college', location: 'New Haven, CT', action: 'View Details', img: 'https://images.unsplash.com/photo-1592280771884-477c029375e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 2, title: 'Future Leaders Award', category: 'admission', amount: '$10,000 / Year', action: 'Apply Now', img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 3, title: 'Organic Chemistry', category: 'note', desc: "Prof. Wilson's Lecture Notes", icon: 'fa-sticky-note', color: 'purple' },
    { id: 4, title: 'Python Programming', category: 'course', desc: 'Full-stack development course', icon: 'fa-code', color: 'green' },
  ]

  const filtered = filterCategory === 'all' ? bookmarks : bookmarks.filter(b => b.category === filterCategory)

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Saved Items</h2>
        <div className="flex flex-wrap gap-2">
          {[{ key: 'all', label: 'All' }, { key: 'college', label: 'Colleges' }, { key: 'admission', label: 'Admission' }, { key: 'note', label: 'Notes' }, { key: 'course', label: 'Courses' }].map(btn => (
            <button
              key={btn.key}
              onClick={() => setFilterCategory(btn.key)}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                filterCategory === btn.key
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-500'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            {item.img ? (
              <>
                <div className="h-32 rounded-lg bg-gray-200 mb-4 bg-cover bg-center" style={{ backgroundImage: `url('${item.img}')` }}></div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  item.category === 'college' ? 'text-blue-600 bg-blue-50' : 'text-orange-600 bg-orange-50'
                }`}>
                  {item.category === 'college' ? 'College' : 'Admission'}
                </span>
                <h3 className="font-bold text-slate-800 mt-2">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{item.location || item.amount}</p>
              </>
            ) : (
              <>
                <div className={`h-32 rounded-lg bg-${item.color}-100 mb-4 flex items-center justify-center text-${item.color}-500 text-4xl`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase text-${item.color}-600 bg-${item.color}-50`}>
                  {item.category === 'note' ? 'Notes' : 'Course'}
                </span>
                <h3 className="font-bold text-slate-800 mt-2">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{item.desc}</p>
              </>
            )}
            <button className="w-full py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
              {item.action || 'Download'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function NotificationsSection() {
  const notifications = [
    { id: 1, type: 'deadline', icon: 'fa-exclamation-circle', title: 'Application Deadline Approaching', message: 'Stanford University application deadline is in 3 days.', time: '2 hours ago', read: false },
    { id: 2, type: 'message', icon: 'fa-envelope', title: 'Message from Dr. Emily Smith', message: 'Reminder: Your counselling session is tomorrow at 10 AM.', time: '4 hours ago', read: false },
    { id: 3, type: 'achievement', icon: 'fa-check-circle', title: 'Profile Updated Successfully', message: 'Your profile is now 85% complete.', time: '1 day ago', read: true },
    { id: 4, type: 'opportunity', icon: 'fa-star', title: 'New Scholarship Opportunity', message: 'Harvard Merit Scholarship opens for applications.', time: '2 days ago', read: true },
  ]

  const getStyles = (type: string) => {
    const styles = {
      deadline: { bg: 'bg-orange-50', icon: 'text-orange-500' },
      message: { bg: 'bg-blue-50', icon: 'text-blue-500' },
      achievement: { bg: 'bg-green-50', icon: 'text-green-500' },
      opportunity: { bg: 'bg-purple-50', icon: 'text-purple-500' },
    }
    return styles[type as keyof typeof styles] || styles.message
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Notifications</h2>

      <div className="space-y-3">
        {notifications.map(notif => {
          const styles = getStyles(notif.type)
          return (
            <div key={notif.id} className={`p-4 rounded-xl border transition-all ${notif.read ? 'bg-white border-slate-200' : `${styles.bg} border-slate-200`}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${notif.read ? 'bg-slate-100' : styles.bg}`}>
                  <i className={`fas ${notif.icon} ${notif.read ? 'text-slate-500' : styles.icon}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800">{notif.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-2">{notif.time}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 ml-4 flex-shrink-0">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ResourcesSection() {
  const resources = [
    { id: 1, title: 'Complete SAT Preparation', category: 'Exam Prep', author: 'Dr. Academic', downloads: 3420, rating: 4.8 },
    { id: 2, title: 'College Essay Writing Guide', category: 'Writing', author: 'Prof. Johnson', downloads: 2150, rating: 4.9 },
    { id: 3, title: 'Interview Mastery Handbook', category: 'Interview', author: 'Career Coach', downloads: 1890, rating: 4.7 },
    { id: 4, title: 'Scholarship & Financial Aid', category: 'Funding', author: 'Finance Expert', downloads: 4210, rating: 4.9 },
    { id: 5, title: 'Time Management Strategies', category: 'Productivity', author: 'Life Coach', downloads: 2560, rating: 4.6 },
    { id: 6, title: 'Career Planning Workshop', category: 'Career', author: 'Career Advisor', downloads: 1450, rating: 4.8 },
  ]

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Study Resources</h2>
          <p className="text-slate-500 mt-1">Curated learning materials and guides to help you succeed.</p>
        </div>
        <input type="text" placeholder="Search resources..." className="px-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(resource => (
          <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase">{resource.category}</span>
              <div className="flex items-center gap-1 text-xs text-yellow-500">
                <i className="fas fa-star"></i> {resource.rating}
              </div>
            </div>
            <h3 className="font-bold text-slate-800 mb-2">{resource.title}</h3>
            <p className="text-xs text-slate-500 mb-4">by {resource.author}</p>
            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span><i className="fas fa-download mr-1"></i> {resource.downloads}</span>
              <button className="px-3 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors text-xs">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsSection() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newsletter: true,
    twoFactor: true,
    profileVisibility: 'friends',
  })

  const handleLogout = () => {
    window.location.href = '/'
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Settings & Privacy</h2>
          <p className="text-slate-500 mt-1">Manage your account preferences and security settings.</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-user text-blue-500"></i> Account Settings
          </h3>
          <div className="space-y-4">
            <button className="w-full p-3 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-left">
              <span>
                <i className="fas fa-envelope mr-2 text-blue-600"></i>
                <span className="font-medium text-slate-800">alex@university.edu</span>
                <p className="text-xs text-slate-500 mt-1">Email Address</p>
              </span>
              <i className="fas fa-chevron-right text-slate-400"></i>
            </button>
            <button className="w-full p-3 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-left">
              <span>
                <i className="fas fa-phone mr-2 text-blue-600"></i>
                <span className="font-medium text-slate-800">+1 (555) 123-4567</span>
                <p className="text-xs text-slate-500 mt-1">Phone Number</p>
              </span>
              <i className="fas fa-chevron-right text-slate-400"></i>
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-bell text-blue-500"></i> Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Email Notifications</p>
                <p className="text-sm text-slate-500">Updates on applications & deadlines</p>
              </div>
              <input type="checkbox" checked={settings.emailNotifications} onChange={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})} className="w-5 h-5 rounded accent-blue-600" />
            </div>
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">SMS Notifications</p>
                <p className="text-sm text-slate-500">Urgent alerts and reminders</p>
              </div>
              <input type="checkbox" checked={settings.smsNotifications} onChange={() => setSettings({...settings, smsNotifications: !settings.smsNotifications})} className="w-5 h-5 rounded accent-blue-600" />
            </div>
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Newsletter</p>
                <p className="text-sm text-slate-500">Monthly updates and opportunities</p>
              </div>
              <input type="checkbox" checked={settings.newsletter} onChange={() => setSettings({...settings, newsletter: !settings.newsletter})} className="w-5 h-5 rounded accent-blue-600" />
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-lock text-green-500"></i> Privacy & Security
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Two-Factor Authentication</p>
                <p className="text-sm text-slate-500">Add extra security to your account</p>
              </div>
              <input type="checkbox" checked={settings.twoFactor} onChange={() => setSettings({...settings, twoFactor: !settings.twoFactor})} className="w-5 h-5 rounded accent-green-600" />
            </div>
            <div className="border-t border-slate-100 pt-4">
              <label className="block font-medium text-slate-800 mb-2">Profile Visibility</label>
              <select value={settings.profileVisibility} onChange={(e) => setSettings({...settings, profileVisibility: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="public">Public - Visible to Everyone</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private - Only Me</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Account Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 border border-slate-200 rounded-lg text-slate-800 font-medium hover:bg-slate-50 transition-colors text-left">
              <i className="fas fa-key mr-2 text-blue-600"></i> Change Password
            </button>
            <button className="w-full p-3 border border-slate-200 rounded-lg text-slate-800 font-medium hover:bg-slate-50 transition-colors text-left">
              <i className="fas fa-download mr-2 text-blue-600"></i> Download My Data
            </button>
            <button className="w-full p-3 border border-red-200 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors text-left">
              <i className="fas fa-trash mr-2"></i> Delete Account
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-500/20">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  )
}

function SphereInvitesSection() {
  const [filterType, setFilterType] = useState('all')

  const invites = [
    { id: 1, type: 'scholarship', title: 'Harvard Merit Scholarship 2026', organization: 'Harvard University', deadline: 'Apr 30, 2026', priority: 'high', amount: '$50,000+', description: 'Full merit-based scholarship for international students' },
    { id: 2, type: 'admission', title: 'Stanford Admission Interview', organization: 'Stanford University', deadline: 'Apr 20, 2026', priority: 'high', amount: 'Review', description: 'You have been shortlisted for the final round' },
    { id: 3, type: 'event', title: 'MIT Campus Tour & Workshop', organization: 'MIT', deadline: 'Apr 15, 2026', priority: 'medium', amount: 'Free', description: 'Exclusive workshop for prospective students' },
    { id: 4, type: 'scholarship', title: 'Yale Global Scholarship', organization: 'Yale University', deadline: 'May 05, 2026', priority: 'medium', amount: '$30,000', description: 'Financial aid for exceptional candidates' },
    { id: 5, type: 'admission', title: 'Princeton Ivy Plus Program', organization: 'Princeton University', deadline: 'Apr 25, 2026', priority: 'high', amount: 'Opportunity', description: 'Join our summer leadership program' },
    { id: 6, type: 'event', title: 'Columbia Pre-College Program', organization: 'Columbia University', deadline: 'May 10, 2026', priority: 'low', amount: '$5,000 aid', description: 'Explore academic interests and university life' },
  ]

  const filtered = filterType === 'all' ? invites : invites.filter(i => i.type === filterType)

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200'
      default: return 'bg-slate-50 text-slate-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'scholarship': return 'fa-graduation-cap'
      case 'admission': return 'fa-file-check'
      case 'event': return 'fa-calendar-days'
      default: return 'fa-envelope'
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-envelope-open-text text-blue-600"></i> SphereInvites
          </h2>
          <p className="text-sm text-slate-500 mt-1">Exclusive opportunities matched to your profile.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
            <i className="fas fa-inbox"></i>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{invites.length}</p>
            <p className="text-xs text-slate-500 font-medium uppercase">Total Invites</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 text-xl">
            <i className="fas fa-check-circle"></i>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">3</p>
            <p className="text-xs text-slate-500 font-medium uppercase">Accepted</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 text-xl">
            <i className="fas fa-bookmark"></i>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">2</p>
            <p className="text-xs text-slate-500 font-medium uppercase">Saved</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 rounded-xl shadow-md text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-[-10px] top-[-10px] opacity-10 text-9xl">
            <i className="fas fa-bolt"></i>
          </div>
          <p className="text-sm font-medium opacity-90">Profile Match Score</p>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-2xl font-bold">Excellent</p>
            <i className="fas fa-arrow-trend-up mb-1 text-green-300"></i>
          </div>
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-3">
            <div className="bg-white h-1.5 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* Filter & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
          <button onClick={() => setFilterType('all')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${filterType === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-blue-600'}`}>All Invites</button>
          <button onClick={() => setFilterType('scholarship')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${filterType === 'scholarship' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-blue-600'}`}>Scholarships</button>
          <button onClick={() => setFilterType('admission')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${filterType === 'admission' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-blue-600'}`}>Admissions</button>
          <button onClick={() => setFilterType('event')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${filterType === 'event' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-blue-600'}`}>Events</button>
        </div>
      </div>

      {/* Invites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filtered.map(invite => (
          <div key={invite.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-lg">
                <i className={`fas ${getTypeIcon(invite.type)}`}></i>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getPriorityColor(invite.priority)}`}>
                {invite.priority.charAt(0).toUpperCase() + invite.priority.slice(1)} Priority
              </span>
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{invite.title}</h3>
            <p className="text-sm text-slate-600 mb-2">{invite.organization}</p>
            <p className="text-xs text-slate-500 mb-4 line-clamp-2">{invite.description}</p>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500"><i className="fas fa-calendar mr-1"></i> {invite.deadline}</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{invite.amount}</span>
            </div>
            <div className="mt-auto flex gap-2">
              <button className="flex-1 px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">View Details</button>
              <button className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"><i className="fas fa-bookmark"></i></button>
            </div>
          </div>
        ))}
      </div>

      {/* Sponsored Section */}
      <div className="mt-12 border-t border-slate-200 pt-8 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            Sponsored Opportunities <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded font-semibold">Ad</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-all">
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <span className="bg-white/20 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border border-white/10">Education</span>
                  <h4 className="font-bold text-xl mt-3 mb-1">Study in Australia 🇦🇺</h4>
                  <p className="text-indigo-100 text-sm mb-4 max-w-xs">Get free counseling, scholarship assessment, and visa processing assistance today.</p>
                </div>
                <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center text-xl">✈️</div>
              </div>
              <button className="bg-white text-indigo-700 text-xs font-bold px-4 py-2 rounded-lg shadow hover:bg-slate-50 transition-colors">
                Check Eligibility
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-blue-300 transition-colors group cursor-pointer flex flex-col">
            <div className="p-5 flex-1 flex items-center gap-4">
              <div className="h-16 w-16 bg-orange-50 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl border border-orange-100">
                💻
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 rounded uppercase tracking-wide">Course Deal</span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg group-hover:text-orange-600 transition-colors">Python for Beginners</h4>
                <p className="text-slate-500 text-xs mt-1">Master coding with 50% off for StudSphere students.</p>
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 line-through">$99.99</span>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                $49.99 <i className="fas fa-arrow-right text-orange-500 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardSection() {
  return (
    <div>
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Welcome back, Alex! 👋</h1>
          <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your applications today.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100 min-w-[200px]">
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset="2.51" className="text-emerald-500" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-800">98%</div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Alex Student</p>
            <p className="text-xs text-slate-500">alex@university.edu</p>
          </div>
        </div>
      </div>

      {/* Meeting Notification */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 mb-8 text-white shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
            <i className="fas fa-video"></i>
          </div>
          <div>
            <h4 className="font-bold text-sm">Upcoming Session: Dr. Emily Smith</h4>
            <p className="text-xs text-blue-100">Starts in 15 minutes • Career Guidance</p>
          </div>
        </div>
        <button className="bg-white text-blue-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">Join Now</button>
      </div>

      {/* Advertising Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
          <div className="absolute -right-6 -bottom-6 text-white opacity-10 text-9xl transform rotate-12">
            <i className="fas fa-university"></i>
          </div>
          <h3 className="text-xl font-bold relative z-10">Review Your Colleges</h3>
          <p className="text-purple-100 text-sm mt-2 relative z-10 max-w-[80%]">Share your campus experience and help juniors make better decisions.</p>
          <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-purple-50 transition-colors relative z-10">Write a Review</button>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
          <div className="absolute -right-6 -bottom-6 text-white opacity-10 text-9xl transform rotate-12">
            <i className="fas fa-question-circle"></i>
          </div>
          <h3 className="text-xl font-bold relative z-10">Ask Your Doubts</h3>
          <p className="text-orange-100 text-sm mt-2 relative z-10 max-w-[80%]">Stuck on a problem? Connect with experts and get answers instantly.</p>
          <button className="mt-4 bg-white text-orange-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-orange-50 transition-colors relative z-10">Ask Now</button>
        </div>
      </div>

      {/* Alert Panel */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <i className="fas fa-exclamation-triangle text-yellow-500 mt-1"></i>
        <div>
          <h4 className="text-sm font-bold text-yellow-800">Complete your documents</h4>
          <p className="text-sm text-yellow-700 mt-1">Your application for <span className="font-semibold">MIT Computer Science</span> is missing a recommendation letter. Upload it before Friday.</p>
        </div>
        <button className="ml-auto text-sm text-yellow-800 font-semibold hover:underline">View</button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Applications</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">4</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <i className="fas fa-paper-plane"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-400">
            <span className="text-green-500 font-medium mr-1"><i className="fas fa-arrow-up"></i> 1</span>
            <span>updated this week</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Upcoming Deadlines</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">2</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
              <i className="fas fa-clock"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-400">
            <span className="text-orange-500 font-medium mr-1">Urgent:</span>
            <span>Physics Scholarship (2 days)</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Saved Colleges</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">12</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
              <i className="fas fa-heart"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-400">
            <span className="text-purple-500 font-medium mr-1">New:</span>
            <span>Stanford opened admissions</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: 'fa-balance-scale', label: 'Compare Colleges' },
          { icon: 'fa-search-location', label: 'Course Finder' },
          { icon: 'fa-award', label: 'Scholarships' },
          { icon: 'fa-crystal-ball', label: 'College Predictor' },
        ].map((action, idx) => (
          <button key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-blue-500 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-2 mx-auto group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <i className={`fas ${action.icon}`}></i>
            </div>
            <p className="text-sm font-semibold text-slate-700">{action.label}</p>
          </button>
        ))}
      </div>

      {/* Recommended Colleges */}
      <h3 className="text-lg font-bold text-slate-800 mb-4">Recommended For You</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { name: 'Harvard University', location: 'Cambridge, MA', match: '95%', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
          { name: 'Stanford University', location: 'Stanford, CA', match: '92%', img: 'https://images.unsplash.com/photo-1621640786029-22ad59695d7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
          { name: 'Yale University', location: 'New Haven, CT', match: '88%', img: 'https://images.unsplash.com/photo-1592280771884-477c029375e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
        ].map((college, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="h-32 rounded-lg bg-gray-200 mb-3 bg-cover bg-center" style={{ backgroundImage: `url('${college.img}')` }}></div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Match: {college.match}</span>
            <h4 className="font-bold text-slate-800 mt-2">{college.name}</h4>
            <p className="text-xs text-slate-500 mb-3">{college.location}</p>
            <button className="text-sm text-blue-600 font-semibold hover:underline">View Details</button>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <i className="fas fa-quote-left text-blue-500 mr-2"></i> What Students Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Felix Brown', school: "MIT '26", seed: 'Felix', text: 'StudSphere helped me organize my entire application process. I wouldn\'t have made the deadlines without it!' },
            { name: 'Sarah Lee', school: "Stanford '25", seed: 'Sarah', text: 'The scholarship recommendations were spot on. I found funding I didn\'t even know existed.' },
            { name: 'John Doe', school: 'Applicant', seed: 'John', text: 'The resource library is a goldmine for entrance exam prep. Highly recommended notes!' },
          ].map((testimonial, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.seed}`} className="w-10 h-10 rounded-full bg-slate-100" alt="Avatar" />
                <div className="ml-3">
                  <p className="text-sm font-bold text-slate-800">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.school}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 italic">{`"${testimonial.text}"`}</p>
              <div className="mt-3 text-yellow-400 text-xs">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ApplicationsSection() {
  return (
    <div>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Inquiries & Applications</h2>
        <div className="flex flex-wrap gap-2 w-full xl:w-auto">
          <input type="date" className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500" />
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="received">Received</option>
            <option value="accepted">Accepted</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm ml-auto">
            <i className="fas fa-paper-plane mr-1"></i> New Inquiry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { init: 'M', name: 'MIT', status: 'Received', statusColor: 'blue', date: 'Feb 12, 2026', desc: 'Admission Inquiry: Computer Science Program' },
          { init: 'S', name: 'Stanford University', status: 'Pending', statusColor: 'yellow', date: 'Feb 15, 2026', desc: 'Scholarship Application Form' },
          { init: '🏛️', name: 'General Inquiry', status: 'Sent', statusColor: 'green', date: 'Feb 10, 2026', desc: 'Yale University, Princeton University' },
          { init: 'O', name: 'Oxford University', status: 'Accepted', statusColor: 'green', date: 'Jan 05, 2026', desc: 'Summer Research Program 2026' },
        ].map((app, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-full hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">{app.init}</div>
              <span className={`text-xs px-2 py-0.5 bg-${app.statusColor}-50 text-${app.statusColor}-600 rounded border border-${app.statusColor}-100 font-medium`}>{app.status}</span>
            </div>
            <div className="mb-4">
              <h3 className="font-bold text-slate-800 text-lg">{app.name}</h3>
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">{app.desc}</p>
              <span className="text-xs text-slate-400 mt-2 block"><i className="far fa-clock mr-1"></i> {app.date}</span>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <button className="w-full px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChatSection() {
  return (
    <div className="h-[calc(100vh-140px)]">
      <div className="flex h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50 hidden md:flex">
          <div className="p-4 border-b border-slate-100">
            <input type="text" placeholder="Search messages..." className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="overflow-y-auto flex-1">
            {[
              { name: 'Dr. Emily Smith', role: 'Career Counselor', active: true },
              { name: 'Prof. John Watson', role: 'Advisor', active: false },
              { name: 'College Support', role: 'General Queries', active: false },
            ].map((chat, idx) => (
              <div key={idx} className={`p-3 hover:bg-white cursor-pointer transition-colors border-l-4 ${idx === 0 ? 'border-blue-500 bg-white' : 'border-transparent'}`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name.split(' ')[0]}`} className="w-10 h-10 rounded-full bg-slate-200" alt="Avatar" />
                    {chat.active && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{chat.name}</p>
                    <p className="text-xs text-slate-500 truncate">{chat.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="border-b border-slate-100 p-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Dr. Emily Smith</h3>
            <div className="flex gap-2">
              <button className="text-slate-400 hover:text-slate-600"><i className="fas fa-phone"></i></button>
              <button className="text-slate-400 hover:text-slate-600"><i className="fas fa-video"></i></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-3">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" className="w-8 h-8 rounded-full" alt="Avatar" />
              <div className="bg-slate-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-slate-700">Hi Alex! How are you doing with your applications?</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                <p className="text-sm">Good! I&apos;ve submitted 4 applications so far.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 p-4 flex gap-2">
            <input type="text" placeholder="Type a message..." className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">My Calendar</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">April 2026</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-100 rounded"><i className="fas fa-chevron-left"></i></button>
              <button className="p-2 hover:bg-slate-100 rounded"><i className="fas fa-chevron-right"></i></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-0 border border-slate-200 rounded">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-xs font-bold text-slate-600 bg-slate-50 border-r border-b border-slate-200">
                {day}
              </div>
            ))}
            {Array.from({ length: 30 }).map((_, idx) => (
              <div key={idx} className="p-3 min-h-[100px] border-r border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <p className="text-xs font-semibold text-slate-600">{idx + 1}</p>
                {idx === 11 && <div className="mt-2 bg-blue-100 text-blue-700 text-xs p-1 rounded">MIT Deadline</div>}
                {idx === 14 && <div className="mt-2 bg-orange-100 text-orange-700 text-xs p-1 rounded">Stanford</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {[
              { name: 'MIT Application', date: 'Apr 12', color: 'blue' },
              { name: 'Stanford Review', date: 'Apr 15', color: 'orange' },
              { name: 'Interview Prep', date: 'Apr 18', color: 'green' },
            ].map((event, idx) => (
              <div key={idx} className={`p-3 rounded-lg border-l-4 border-${event.color}-500 bg-${event.color}-50`}>
                <p className="text-sm font-semibold text-slate-800">{event.name}</p>
                <p className="text-xs text-slate-500">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
