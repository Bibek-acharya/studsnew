'use client'

import { useState } from 'react'

export default function CounsellingSection() {
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
