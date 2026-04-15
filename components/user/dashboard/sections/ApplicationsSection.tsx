'use client'

import { useState } from 'react'
import { 
  Search,
  Filter,
  GraduationCap,
  Award,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ChevronRight,
  X,
  Users
} from 'lucide-react'

type AppType = 'all' | 'admission' | 'entrance' | 'scholarship'

interface Application {
  id: number
  institution: string
  program: string
  type: 'admission' | 'entrance' | 'scholarship'
  status: 'applied' | 'shortlisted' | 'interview' | 'accepted' | 'rejected'
  appliedDate: string
  deadline: string
  location: string
}

const STATUS_CONFIG = {
  applied: { label: 'Applied', color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', icon: Clock },
  shortlisted: { label: 'Shortlisted', color: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', icon: Users },
  interview: { label: 'Interview', color: 'orange', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertCircle },
  accepted: { label: 'Accepted', color: 'green', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'red', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle }
}

const TYPE_CONFIG = {
  admission: { label: 'Admission', icon: GraduationCap, color: 'blue' },
  entrance: { label: 'Entrance', icon: FileText, color: 'orange' },
  scholarship: { label: 'Scholarship', icon: Award, color: 'green' }
}

const initialApplications: Application[] = [
  { id: 1, institution: 'Tribhuvan University', program: 'Engineering (IOE)', type: 'entrance', status: 'applied', appliedDate: '2026-03-15', deadline: '2026-04-30', location: 'Kathmandu' },
  { id: 2, institution: 'Peking University', program: 'Computer Science', type: 'admission', status: 'shortlisted', appliedDate: '2026-02-10', deadline: '2026-04-01', location: 'Beijing, China' },
  { id: 3, institution: 'ANII Scholarship', program: ' Merit Based Scholarship', type: 'scholarship', status: 'interview', appliedDate: '2026-01-20', deadline: '2026-03-01', location: 'Nepal' },
  { id: 4, institution: 'MIT', program: 'Data Science', type: 'admission', status: 'applied', appliedDate: '2026-02-28', deadline: '2026-01-15', location: 'Boston, USA' },
  { id: 5, institution: 'KU Entrance', program: 'Medical College', type: 'entrance', status: 'accepted', appliedDate: '2026-01-05', deadline: '2026-02-28', location: 'Kathmandu' },
  { id: 6, institution: 'Fulbright Scholarship', program: 'Graduate Program', type: 'scholarship', status: 'rejected', appliedDate: '2025-12-10', deadline: '2025-12-15', location: 'USA' },
]

export default function ApplicationsSection() {
  const [activeType, setActiveType] = useState<AppType>('all')
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  const filteredApps = applications.filter(app => {
    const matchesType = activeType === 'all' || app.type === activeType
    const matchesStatus = activeStatus === 'all' || app.status === activeStatus
    const matchesSearch = app.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       app.program.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  const handleStatusChange = (appId: number, newStatus: Application['status']) => {
    setApplications(applications.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ))
    setSelectedApp(null)
  }

  const getStats = () => {
    const total = applications.length
    const accepted = applications.filter(a => a.status === 'accepted').length
    const pending = applications.filter(a => ['applied', 'shortlisted', 'interview'].includes(a.status)).length
    const rejected = applications.filter(a => a.status === 'rejected').length
    return { total, accepted, pending, rejected }
  }

  const stats = getStats()

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">My Applications</h1>
            <p className="text-sm text-slate-500 mt-1">Track your admission, entrance, and scholarship applications</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search applications.." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue w-full"
              />
            </div>
            <select 
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveType('all')}
          className={`p-4 text-center border-b-2 transition-colors ${activeType === 'all' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-slate-500">Total</p>
        </button>
        <button 
          onClick={() => setActiveType('admission')}
          className={`p-4 text-center border-b-2 transition-colors ${activeType === 'admission' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <p className="text-2xl font-bold">{applications.filter(a => a.type === 'admission').length}</p>
          <p className="text-xs text-slate-500">Admissions</p>
        </button>
        <button 
          onClick={() => setActiveType('entrance')}
          className={`p-4 text-center border-b-2 transition-colors ${activeType === 'entrance' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <p className="text-2xl font-bold">{applications.filter(a => a.type === 'entrance').length}</p>
          <p className="text-xs text-slate-500">Entrances</p>
        </button>
        <button 
          onClick={() => setActiveType('scholarship')}
          className={`p-4 text-center border-b-2 transition-colors ${activeType === 'scholarship' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <p className="text-2xl font-bold">{applications.filter(a => a.type === 'scholarship').length}</p>
          <p className="text-xs text-slate-500">Scholarships</p>
        </button>
      </div>

      <div className="p-4 md:p-6">
        {filteredApps.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No applications found</p>
            <p className="text-sm text-slate-400">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map(app => {
              const statusConfig = STATUS_CONFIG[app.status]
              const typeConfig = TYPE_CONFIG[app.type]
              const StatusIcon = statusConfig.icon
              const TypeIcon = typeConfig.icon

              return (
                <div 
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg ${typeConfig.color === 'blue' ? 'bg-blue-100 text-blue-600' : typeConfig.color === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'} flex items-center justify-center`}>
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{app.institution}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.border} border`}>
                            <StatusIcon className={`w-3 h-3 inline mr-1`} />
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{app.program}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                          <span>{app.location}</span>
                          <span>•</span>
                          <span>Applied: {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">{selectedApp.institution}</h3>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${TYPE_CONFIG[selectedApp.type].color === 'blue' ? 'bg-blue-100 text-blue-600' : TYPE_CONFIG[selectedApp.type].color === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'} flex items-center justify-center`}>
                  {(() => {
                    const Icon = TYPE_CONFIG[selectedApp.type].icon
                    return <Icon className="w-5 h-5" />
                  })()}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{selectedApp.program}</p>
                  <p className="text-sm text-slate-500">{TYPE_CONFIG[selectedApp.type].label}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm mt-1 ${STATUS_CONFIG[selectedApp.status].bg} ${STATUS_CONFIG[selectedApp.status].border} border`}>
                    {(() => {
                      const Icon = STATUS_CONFIG[selectedApp.status].icon
                      return <Icon className="w-3 h-3" />
                    })()}
                    <span>{STATUS_CONFIG[selectedApp.status].label}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Applied Date</p>
                  <p className="text-sm font-medium">{new Date(selectedApp.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Deadline</p>
                  <p className="text-sm font-medium">{new Date(selectedApp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="text-sm font-medium">{selectedApp.location}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['applied', 'shortlisted', 'interview', 'accepted', 'rejected'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedApp.id, status)}
                      className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                        selectedApp.status === status 
                          ? 'bg-brand-blue text-white border-brand-blue' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {STATUS_CONFIG[status].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}