'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { apiService, InviteItem } from '@/services/api'

export default function SphereInvitesSection() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState('all')
  const [invites, setInvites] = useState<InviteItem[]>([])
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null)

  const fetchInvites = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiService.getInvites()
      setInvites(res.data?.invites || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load invites')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvites()
  }, [])

  const filtered = filterType === 'all' ? invites : invites.filter(i => i.type === filterType)

  const handleAccept = async (id: number) => {
    try {
      await apiService.acceptInvite(id)
      fetchInvites()
      setToast({ message: 'Invite accepted', type: 'success' })
      setTimeout(() => setToast(null), 3000)
    } catch { /* ignore */ }
  }

  const handleSave = async (id: number) => {
    try {
      await apiService.saveInvite(id)
      fetchInvites()
      setToast({ message: 'Invite saved', type: 'success' })
      setTimeout(() => setToast(null), 3000)
    } catch { /* ignore */ }
  }

  const handleDecline = async (id: number) => {
    try {
      await apiService.declineInvite(id)
      fetchInvites()
      setToast({ message: 'Invite declined', type: 'success' })
      setTimeout(() => setToast(null), 3000)
    } catch { /* ignore */ }
  }

  const totalCount = invites.length
  const acceptedCount = invites.filter(i => i.status === 'accepted').length
  const savedCount = invites.filter(i => i.status === 'saved').length

  const getPriorityColor = (_status: string) => {
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'scholarship': return 'fa-graduation-cap'
      case 'admission': return 'fa-file-check'
      case 'event': return 'fa-calendar-days'
      default: return 'fa-envelope'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-slate-500">Loading invites...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => window.location.reload()} className="text-sm text-primary hover:underline">Retry</button>
        </div>
      </div>
    )
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
        <div className="bg-white p-5 rounded-md  border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
            <i className="fas fa-inbox"></i>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{totalCount}</p>
            <p className="text-xs text-slate-500 font-medium uppercase">Total Invites</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-md  border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-md bg-green-50 flex items-center justify-center text-green-600 text-xl">
            <i className="fas fa-check-circle"></i>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{acceptedCount}</p>
            <p className="text-xs text-slate-500 font-medium uppercase">Accepted</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-md  border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-md bg-purple-50 flex items-center justify-center text-purple-600 text-xl">
            <i className="fas fa-bookmark"></i>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{savedCount}</p>
            <p className="text-xs text-slate-500 font-medium uppercase">Saved</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 rounded-md  text-white flex flex-col justify-center relative overflow-hidden">
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
        <div className="flex bg-white p-1 rounded-md border border-slate-200  overflow-x-auto">
          <button onClick={() => setFilterType('all')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${filterType === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-blue-600'}`}>All Invites</button>
          <button onClick={() => setFilterType('scholarship')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${filterType === 'scholarship' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-blue-600'}`}>Scholarships</button>
          <button onClick={() => setFilterType('admission')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${filterType === 'admission' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-blue-600'}`}>Admissions</button>
          <button onClick={() => setFilterType('event')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${filterType === 'event' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-blue-600'}`}>Events</button>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-envelope-open-text text-3xl text-slate-300"></i>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No invites yet</h3>
          <p className="text-sm text-slate-500 max-w-sm">We&apos;ll notify you when opportunities match your profile.</p>
        </div>
      )}

      {/* Invites Grid */}
      {filtered.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filtered.map(invite => (
          <div key={invite.id} className="bg-white rounded-md  border border-slate-200 p-6 hover: transition-all flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 text-lg">
                <i className={`fas ${getTypeIcon(invite.type)}`}></i>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getPriorityColor(invite.status)}`}>
                {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
              </span>
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{invite.title}</h3>
            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{invite.message}</p>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500"><i className="fas fa-calendar mr-1"></i> {invite.created_at ? new Date(invite.created_at).toLocaleDateString() : 'N/A'}</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{invite.type}</span>
            </div>
            <div className="mt-auto flex gap-2">
              {invite.status === 'pending' && (
                <>
                  <button onClick={() => handleAccept(invite.id)} className="flex-1 px-3 py-2 text-xs font-bold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">Accept</button>
                  <button onClick={() => handleSave(invite.id)} className="px-3 py-2 text-xs font-bold text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"><i className="fas fa-bookmark"></i></button>
                  <button onClick={() => handleDecline(invite.id)} className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"><i className="fas fa-times"></i></button>
                </>
              )}
              {invite.status === 'accepted' && (
                <span className="flex-1 text-center px-3 py-2 text-xs font-bold text-green-600 bg-green-50 rounded-md">Accepted</span>
              )}
              {invite.status === 'saved' && (
                <span className="flex-1 text-center px-3 py-2 text-xs font-bold text-purple-600 bg-purple-50 rounded-md">Saved</span>
              )}
              {invite.status === 'declined' && (
                <span className="flex-1 text-center px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-md">Declined</span>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Sponsored Section */}
      <div className="mt-12 border-t border-slate-200 pt-8 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            Sponsored Opportunities <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded font-semibold">Ad</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-md p-6 text-white relative overflow-hidden group cursor-pointer  hover:shadow-lg transition-all">
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <span className="bg-white/20 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border border-white/10">Education</span>
                  <h4 className="font-bold text-xl mt-3 mb-1">Study in Australia 🇦🇺</h4>
                  <p className="text-indigo-100 text-sm mb-4 max-w-xs">Get free counseling, scholarship assessment, and visa processing assistance today.</p>
                </div>
                <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center text-xl">✈️</div>
              </div>
              <button className="bg-white text-indigo-700 text-xs font-bold px-4 py-2 rounded-md shadow hover:bg-slate-50 transition-colors">
                Check Eligibility
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
          </div>
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden  hover:border-blue-300 transition-colors group cursor-pointer flex flex-col">
            <div className="p-5 flex-1 flex items-center gap-4">
              <div className="h-16 w-16 bg-orange-50 rounded-md flex-shrink-0 flex items-center justify-center text-3xl border border-orange-100">
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
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast.message}
        </div>
      )}
    </div>
  )
}
