'use client'

import { useState, useEffect } from 'react'
import {
  GraduationCap,
  Award,
  FileText,
  X,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronDown,
  Eye,
  User,
  Mail,
  Phone,
  Globe,
  Loader2
} from 'lucide-react'
import { apiService } from "@/services/api"

type AppType = 'all' | 'admission' | 'entrance' | 'scholarship'

type Status = 'applied' | 'shortlisted' | 'interview' | 'accepted' | 'rejected'

interface Application {
  id: number
  institution: string
  program: string
  type: AppType
  status: Status
  appliedDate: string
  deadline: string
  location: string
  logo?: string
  user?: {
    name: string
    email: string
    phone: string
    avatar?: string
  }
}

const STATUS_MAP: Record<string, Status> = {
  submitted: 'applied',
  pending: 'shortlisted',
  approved: 'accepted',
  rejected: 'rejected',
}

const TYPES: AppType[] = ['all', 'admission', 'entrance', 'scholarship']

const STATUS_ORDER: Status[] = [
  'applied',
  'shortlisted',
  'interview',
  'accepted'
]

const STATUS_LABEL = {
  applied: 'Applied',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  accepted: 'Accepted',
  rejected: 'Rejected'
}

const STATUS_COLOR = {
  applied: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-amber-100 text-amber-700',
  interview: 'bg-purple-100 text-purple-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
}

const TYPE_COLOR: Record<string, string> = {
  admission: 'bg-blue-600',
  entrance: 'bg-indigo-600',
  scholarship: 'bg-amber-500',
  all: 'bg-slate-600'
}

export default function ApplicationsSection() {
  const [activeType, setActiveType] = useState<AppType>('all')
  const [selected, setSelected] = useState<Application | null>(null)
  const [sortKey, setSortKey] = useState<string>('deadline')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiService.getMyApplications({ page: 1, limit: 50 })
      .then(res => {
        const mapped = res.data.applications.map(app => ({
          id: app.id,
          institution: app.institution,
          program: app.program,
          type: app.type as AppType,
          status: STATUS_MAP[app.status] || 'applied',
          appliedDate: app.applied_date,
          deadline: app.deadline,
          location: app.location,
        }))
        setApplications(mapped)
        setError(null)
      })
      .catch(err => {
        setError(err.message)
        setApplications([])
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = applications.filter(a =>
    activeType === 'all' || a.type === activeType
  )

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey as keyof Application]
    const bVal = b[sortKey as keyof Application]
    if (aVal! < bVal!) return sortDir === 'asc' ? -1 : 1
    if (aVal! > bVal!) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="relative">

      {/* TABS */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-md mb-6 w-fit mt-6">
        {TYPES.map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              activeType === t
                ? 'bg-white text-primary'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('institution')}
                      className="flex items-center gap-1 hover:text-slate-700"
                    >
                      Institution
                      <ChevronDown className={`w-3 h-3 transition-transform ${sortKey === 'institution' && sortDir === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:text-slate-700 mx-auto"
                    >
                      Status
                      <ChevronDown className={`w-3 h-3 transition-transform ${sortKey === 'status' && sortDir === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('appliedDate')}
                      className="flex items-center gap-1 hover:text-slate-700"
                    >
                      Applied
                      <ChevronDown className={`w-3 h-3 transition-transform ${sortKey === 'appliedDate' && sortDir === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('deadline')}
                      className="flex items-center gap-1 hover:text-slate-700"
                    >
                      Deadline
                      <ChevronDown className={`w-3 h-3 transition-transform ${sortKey === 'deadline' && sortDir === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(app => (
                  <tr 
                    key={app.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-left">
                      <span className="font-semibold text-slate-800">{app.institution}</span>
                    </td>
                    <td className="px-6 py-4 text-left text-sm text-slate-600">{app.program}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                        app.type === 'admission' ? 'bg-blue-50 text-blue-600' :
                        app.type === 'entrance' ? 'bg-indigo-50 text-indigo-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {app.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLOR[app.status]} capitalize`}>
                        {STATUS_LABEL[app.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left text-sm text-slate-500">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-left text-sm text-slate-500">
                      {new Date(app.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelected(app); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sorted.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No applications yet</h3>
                <p className="text-sm text-slate-500 max-w-sm">Start by exploring colleges and scholarships.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* OVERLAY + DRAWER */}
      {selected && (
        <>
          {/* BACKDROP */}
          <div
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] animate-in fade-in duration-200"
          />

          {/* DRAWER */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-slate-200 z-[70] animate-in slide-in-from-right duration-300">
            <div className="h-full flex flex-col">
              
              {/* HEADER */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-md ${TYPE_COLOR[selected.type]} flex items-center justify-center`}>
                      <span className="text-white font-bold text-xl">
                        {getInitials(selected.institution)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        {selected.institution}
                      </h2>
                      <p className="text-sm text-slate-500">{selected.program}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-full hover:bg-slate-100 transition"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* USER INFO */}
                {selected.user && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Applicant Information</h3>
                    <div className="bg-white border border-slate-200 rounded-md p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white font-bold">
                            {selected.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{selected.user.name}</p>
                          <p className="text-xs text-slate-500">Applicant</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{selected.user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{selected.user.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STATUS BADGE */}
                <div className="mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${STATUS_COLOR[selected.status]}`}>
                    {selected.status === 'accepted' || selected.status === 'shortlisted' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : selected.status === 'rejected' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    {STATUS_LABEL[selected.status]}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="bg-slate-50 rounded-md p-4 mb-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{selected.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Applied: {new Date(selected.appliedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Deadline: {new Date(selected.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* TIMELINE */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Application Progress</h3>
                  <div className="space-y-0">
                    {STATUS_ORDER.map((s, i) => {
                      const activeIndex = STATUS_ORDER.indexOf(selected.status)
                      const isDone = i <= activeIndex
                      const isCurrent = i === activeIndex

                      return (
                        <div key={s} className="flex gap-4 items-start relative">
                          {i !== 0 && (
                            <div className={`absolute left-1.5 top-6 w-[2px] h-6 ${isDone ? 'bg-primary' : 'bg-slate-200'}`} />
                          )}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-3 h-3 rounded-full transition-all ${
                                isDone 
                                  ? isCurrent 
                                    ? 'bg-primary ring-4 ring-primary/20' 
                                    : 'bg-primary' 
                                  : 'bg-slate-200'
                              }`}
                            />
                          </div>
                          <div className="pb-4">
                            <p className={`text-sm font-semibold ${isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                              {STATUS_LABEL[s]}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-primary mt-0.5">Current status</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  )
}
