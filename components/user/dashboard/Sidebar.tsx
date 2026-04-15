'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Target, 
  FileText, 
  Users, 
  User, 
  Bookmark, 
  List, 
  Edit3, 
  Star, 
  Bell, 
  Settings,
  LogOut,
  X
} from 'lucide-react'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/user/dashboard' },
    { id: 'messages', label: 'Message/Inquiry', icon: MessageSquare, href: '/user/dashboard/chat', badge: '3' },
    { id: 'calendar', label: 'My Calendar', icon: Calendar, href: '/user/dashboard/calendar' },
    { id: 'match', label: 'Match (Colleges)', icon: Target, href: '/user/dashboard/match' },
    { id: 'applications', label: 'My Applications', icon: FileText, href: '/user/dashboard/applications' },
    { id: 'counselling', label: 'Counselling', icon: Users, href: '/user/dashboard/counselling' },
    { id: 'profile', label: 'My Profile', icon: User, href: '/user/dashboard/profile' },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, href: '/user/dashboard/bookmarks' },
    { id: 'shortlist', label: 'Shortlist', icon: List, href: '/user/dashboard/shortlist' },
    { id: 'posts', label: 'My Posts', icon: Edit3, href: '/user/dashboard/posts' },
    { id: 'reviews', label: 'My Reviews', icon: Star, href: '/user/dashboard/reviews' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/user/dashboard/notifications', badge: '16' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/user/dashboard/settings' },
  ]

  const isActive = (href: string) => {
    if (href === '/user/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          id="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden cursor-pointer transition-opacity duration-300"
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        id="sidebar" 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 h-full`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2 text-[#0000ff] font-bold text-xl">
            <div className="w-8 h-8 bg-[#0000ff] rounded-md flex items-center justify-center text-white">
              S
            </div>
            StudentPortal
          </div>
          <button 
            id="close-sidebar" 
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 no-scrollbar">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-3 mb-1 rounded-md transition-colors duration-200 ${
                  active 
                    ? 'bg-[#0000ff] text-white' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-[#0000ff]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    active ? 'bg-white text-[#0000ff]' : 'bg-[#0000ff] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 shrink-0">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-md transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
