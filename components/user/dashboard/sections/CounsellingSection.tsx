'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiService, CounsellingBookingItem } from '@/services/api'

export default function CounsellingSection() {
  const router = useRouter()
  const [counsellingTab, setCounsellingTab] = useState('upcoming')
  const [bookings, setBookings] = useState<CounsellingBookingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true)
      setFetchError("")
      try {
        const response = await apiService.getMyCounsellingBookings()
        setBookings(response.data.bookings || [])
      } catch (error) {
        setFetchError(error instanceof Error ? error.message : "Failed to load counselling bookings")
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
  }, [])

  const upcomingSessions = bookings.filter((booking) => {
    const status = booking.status.toLowerCase()
    return status !== 'completed' && status !== 'cancelled'
  })

  const pastSessions = bookings.filter((booking) => {
    const status = booking.status.toLowerCase()
    return status === 'completed' || status === 'cancelled'
  })

  const newRequests = bookings.filter((booking) => booking.status.toLowerCase() === 'pending')

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
        <button
          onClick={() => router.push('/counseling')}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
        >
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
          {isLoading ? (
            <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Loading counselling bookings...
            </div>
          ) : upcomingSessions.length === 0 ? (
            <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              No upcoming counselling sessions found.
            </div>
          ) : (
            upcomingSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{session.college}</h4>
                    <p className="text-xs text-slate-500">{session.program_level}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {session.status}
                  </span>
                </div>
                <div className="mb-5 relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Session</p>
                  <p className="text-sm font-bold text-slate-800">{session.interested_course}</p>
                  <p className="text-xs text-slate-500">{session.session_mode === 'online' ? 'Online' : 'In person'}</p>
                </div>
                <div className="mb-5 relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Date & Time</p>
                  <p className="text-sm font-bold text-slate-800">{session.session_date}</p>
                  <p className="text-xs text-slate-500">{session.session_time}</p>
                </div>
                <div className="truncate text-sm text-slate-500 mb-4">{session.student_notes || 'No additional notes provided.'}</div>
                <button
                  onClick={() => router.push('/counseling')}
                  className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 relative z-10"
                >
                  <i className="fas fa-calendar-day"></i> View Booking
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {counsellingTab === 'booked' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Loading new counselling requests...
            </div>
          ) : newRequests.length === 0 ? (
            <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              No new counselling requests available.
            </div>
          ) : (
            newRequests.map((session) => (
              <div key={session.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{session.college}</h4>
                    <p className="text-xs text-slate-500">{session.program_level}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {session.status}
                  </span>
                </div>
                <div className="mb-5 relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Session</p>
                  <p className="text-sm font-bold text-slate-800">{session.interested_course}</p>
                  <p className="text-xs text-slate-500">{session.session_mode === 'online' ? 'Online' : 'In person'}</p>
                </div>
                <div className="mb-5 relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Date & Time</p>
                  <p className="text-sm font-bold text-slate-800">{session.session_date}</p>
                  <p className="text-xs text-slate-500">{session.session_time}</p>
                </div>
                <div className="truncate text-sm text-slate-500 mb-4">{session.student_notes || 'No additional notes provided.'}</div>
                <button
                  onClick={() => router.push('/counseling')}
                  className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 relative z-10"
                >
                  <i className="fas fa-calendar-day"></i> View Booking
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {counsellingTab === 'past' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Loading past sessions...
            </div>
          ) : pastSessions.length === 0 ? (
            <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              No past sessions available.
            </div>
          ) : (
            pastSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{session.college}</h4>
                    <p className="text-xs text-slate-500">{session.program_level}</p>
                  </div>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {session.status}
                  </span>
                </div>
                <div className="mb-5 relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Session</p>
                  <p className="text-sm font-bold text-slate-800">{session.interested_course}</p>
                  <p className="text-xs text-slate-500">{session.session_mode === 'online' ? 'Online' : 'In person'}</p>
                </div>
                <div className="mb-5 relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Date & Time</p>
                  <p className="text-sm font-bold text-slate-800">{session.session_date}</p>
                  <p className="text-xs text-slate-500">{session.session_time}</p>
                </div>
                <div className="truncate text-sm text-slate-500 mb-4">{session.student_notes || 'No additional notes provided.'}</div>
              </div>
            ))
          )}
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
