'use client'

import { useState, ReactNode } from 'react'
import Sidebar from './Sidebar'
import { Menu, Search, Bell, User } from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden text-gray-800">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              id="menu-toggle" 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-[#0000ff]"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="relative hidden md:block w-64 lg:w-96">
              <input
                type="text"
                placeholder="Search colleges, courses, scholarships..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] text-sm transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative text-gray-500 hover:text-[#0000ff] transition-colors p-2 rounded-md hover:bg-gray-50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 group-hover:text-[#0000ff] transition-colors">Katie Smith</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
                <User className="text-indigo-400 w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
