'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Send, 
  Bookmark, 
  Award, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Check, 
  X, 
  SkipForward, 
  PieChart 
} from 'lucide-react'

export default function DashboardSection() {
  return (
    <div id="view-dashboard" className="max-w-350 mx-auto mt-6">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column (Main Content) */}
        <div className="flex-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-md p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-widest">Profile completion</p>
                <h2 className="text-xl font-bold text-slate-900 mt-2">85% complete</h2>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/user/dashboard/profile" className="rounded-full bg-[#0000ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0000e6] transition-colors">
                  Complete your profile
                </Link>
                <span className="text-sm text-slate-500">Add missing details to unlock personalized recommendations.</span>
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-full bg-slate-100 h-3">
              <div className="h-3 rounded-full bg-[#0000ff]" style={{ width: '85%' }} />
            </div>
          </div>

          {/* Banner Section */}
          <div className="bg-[#4444ff] rounded-md overflow-hidden relative border border-[#0000ff]">
            <div className="p-8 md:p-10 lg:w-2/3 relative z-10">
              <h1 className="text-3xl font-bold text-white mb-4">Hello Katie!</h1>
              <p className="text-white/90 text-lg leading-relaxed mb-6 max-w-md">
                You have 16 new applications. It is a lot of work for today! So let's start. 🤯
              </p>
              <a href="#" className="inline-block text-white border-b border-white hover:text-white/80 hover:border-white/80 transition-colors pb-0.5 font-medium">
                review it!
              </a>
            </div>

            {/* SVG Illustration */}
            <div className="hidden lg:block absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none">
              <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-8 bottom-0 h-[110%] object-contain origin-bottom object-bottom-right">
                {/* Girl's Body / Shirt */}
                <path d="M120 200 C120 120 160 80 220 80 C260 80 290 110 300 200 Z" fill="#FFE5EC" />
                {/* Neck */}
                <rect x="200" y="60" width="20" height="30" fill="#FFD1BA" />
                {/* Head */}
                <circle cx="210" cy="45" r="30" fill="#FFD1BA" />
                {/* Hair Back */}
                <path d="M180 45 C180 10 240 10 240 45 L250 80 C250 90 230 90 220 80 Z" fill="#2D3748" />
                {/* Hair Front/Bangs */}
                <path d="M175 40 Q210 10 245 40 Q210 25 175 40 Z" fill="#1A202C" />
                <circle cx="200" cy="40" r="2" fill="#1A202C" /> {/* Eye */}
                <path d="M215 50 Q220 55 225 50" stroke="#E2A082" strokeWidth="2" strokeLinecap="round" /> {/* Smile */}
                
                {/* Skirt */}
                <path d="M140 200 L280 200 L280 170 C280 170 210 160 140 170 Z" fill="#FF8FA3" />
                
                {/* Laptop Back (Screen) */}
                <rect x="30" y="50" width="110" height="75" rx="6" fill="#F8FAFC" transform="rotate(-15 30 50)" />
                {/* Laptop Screen Inner */}
                <rect x="38" y="58" width="94" height="59" rx="2" fill="#E2E8F0" transform="rotate(-15 30 50)" />
                {/* Laptop Logo */}
                <circle cx="95" cy="80" r="6" fill="white" />
                
                {/* Laptop Base */}
                <path d="M25 125 L145 93 L165 98 L45 130 Z" fill="#FFFFFF" />
                
                {/* Arm holding laptop */}
                <path d="M210 95 C180 120 150 140 120 130" stroke="#FFE5EC" strokeWidth="22" strokeLinecap="round" />
                <path d="M210 95 C180 120 150 140 120 130" stroke="#FFD1BA" strokeWidth="22" strokeLinecap="round" strokeDasharray="0 100" strokeDashoffset="-80" />
                
                {/* Hand on laptop base */}
                <circle cx="110" cy="125" r="12" fill="#FFD1BA" />
                
                {/* Other Arm (resting) */}
                <path d="M240 100 C260 140 250 170 210 160" stroke="#FFE5EC" strokeWidth="20" strokeLinecap="round" />
                <path d="M215 159 L210 160" stroke="#FFD1BA" strokeWidth="20" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-md flex items-center justify-center">
                  <Send className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Completed</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">5</h3>
              <p className="text-gray-500 text-sm">Applications Submitted</p>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#0000ff]/10 text-[#0000ff] rounded-md flex items-center justify-center">
                  <Bookmark className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-[#0000ff] bg-[#0000ff]/10 px-2 py-1 rounded-md">Shortlisted</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">12</h3>
              <p className="text-gray-500 text-sm">Saved Colleges</p>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-md flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">Active</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">3</h3>
              <p className="text-gray-500 text-sm">Scholarships Applied</p>
            </div>
          </div>

          {/* Recent Activity & Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Applications */}
            <div className="bg-white border border-gray-200 rounded-md flex flex-col">
              <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Recent Applications</h3>
                <button className="text-sm text-[#0000ff] hover:underline font-medium">View All</button>
              </div>
              <div className="p-0 flex-1">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-bold text-gray-800">Stanford University</p>
                    <p className="text-xs text-gray-500 mt-1">Undergraduate</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-green-50 text-green-600">Submitted</span>
                </div>
                <div className="flex items-center justify-between p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-bold text-gray-800">MIT</p>
                    <p className="text-xs text-gray-500 mt-1">Engineering Scholarship</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-orange-50 text-orange-600">Draft</span>
                </div>
                <div className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-bold text-gray-800">Harvard University</p>
                    <p className="text-xs text-gray-500 mt-1">Undergraduate</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-600">In Review</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column (Calendar Component) */}
        <div className="w-full xl:w-90 shrink-0 space-y-4">
          {/* Main Calendar Card */}
          <div className="bg-white border border-gray-200 rounded-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                <CalendarIcon className="w-5 h-5" />
                August 2023
              </div>
              <button className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Days Row */}
            <div className="grid grid-cols-7 text-center mb-4">
              <span className="text-xs font-medium text-gray-400">Mon</span>
              <span className="text-xs font-medium text-gray-400">Tues</span>
              <span className="text-xs font-medium text-gray-400">Wed</span>
              <span className="text-xs font-medium text-gray-400">Thurs</span>
              <span className="text-xs font-medium text-gray-400">Fri</span>
              <span className="text-xs font-medium text-gray-400">Sat</span>
              <span className="text-xs font-medium text-gray-400">Sun</span>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-y-3 text-sm">
              {/* Week 1 */}
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-300">30</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">1</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">2</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">3</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-500 font-bold">4</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 font-bold">5</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">6</span></div>
              
              {/* Week 2 */}
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 font-bold">7</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">8</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-500 font-bold">9</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">10</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">11</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">12</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-400 font-bold">13</span></div>

              {/* Week 3 */}
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">14</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">15</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-400 font-bold">16</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-400 font-bold">17</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0000ff] text-white font-bold  shadow-blue-500/30">18</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">19</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">20</span></div>

              {/* Week 4 */}
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">21</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">22</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">23</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">24</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">25</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">26</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">27</span></div>

              {/* Week 5 */}
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">28</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">29</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">30</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-700">31</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-300">1</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-300">2</span></div>
              <div className="flex justify-center"><span className="w-8 h-8 flex items-center justify-center text-gray-300">3</span></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
