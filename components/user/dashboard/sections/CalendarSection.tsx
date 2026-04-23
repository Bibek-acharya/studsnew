'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search,
  Filter,
  X,
  Trash2,
  GraduationCap,
  Award,
  CalendarDays,
  CheckSquare
} from 'lucide-react'

interface CalendarEvent {
  id: number
  title: string
  start: Date
  end: Date
  type: 'admission' | 'entrance' | 'counselling' | 'scholarship' | 'events' | 'tasks'
}

const HOUR_HEIGHT = 80

const EVENT_THEMES = {
  admission: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', label: 'text-blue-700' },
  entrance: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800', label: 'text-orange-700' },
  counselling: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800', label: 'text-purple-700' },
  scholarship: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800', label: 'text-green-700' },
  events: { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800', label: 'text-pink-700' },
  tasks: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-800', label: 'text-slate-700' }
}

const TABS = [
  { id: 'All', icon: CalendarDays, label: 'All' },
  { id: 'admission', icon: GraduationCap, label: 'Admission' },
  { id: 'entrance', icon: Award, label: 'Entrance' },
  { id: 'counselling', icon: CalendarDays, label: 'Counselling' },
  { id: 'scholarship', icon: Award, label: 'Scholarship' },
  { id: 'events', icon: CalendarDays, label: 'Events' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks' }
]

export default function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'Day' | 'Week' | 'Month'>('Week')
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'meeting',
    date: '',
    start: '',
    end: ''
  })

  useEffect(() => {
    generateInitialEvents()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const generateInitialEvents = () => {
    const today = new Date()
    const start = getStartOfWeek(today)
    
    const createEvent = (id: number, dayOffset: number, startH: number, startM: number, endH: number, endM: number, title: string, type: 'admission' | 'entrance' | 'counselling' | 'scholarship' | 'events' | 'tasks') => {
      const d = new Date(start)
      d.setDate(d.getDate() + dayOffset)
      const startObj = new Date(d); startObj.setHours(startH, startM, 0, 0)
      const endObj = new Date(d); endObj.setHours(endH, endM, 0, 0)
      return { id, title, start: startObj, end: endObj, type }
    }

    setEvents([
      createEvent(1, 0, 8, 0, 9, 0, 'MIT Application Deadline', 'admission'),
      createEvent(2, 0, 9, 0, 10, 30, 'IOE Entrance Form', 'entrance'),
      createEvent(3, 0, 11, 0, 12, 0, 'Career Counselling', 'counselling'),
      createEvent(4, 1, 9, 0, 10, 0, 'Scholarship Interview', 'scholarship'),
      createEvent(5, 1, 11, 0, 12, 30, 'Open House Event', 'events'),
      createEvent(6, 2, 8, 0, 9, 0, 'Submit Documents', 'tasks'),
      createEvent(7, 2, 10, 0, 11, 0, 'Entrance Prep', 'tasks'),
      createEvent(8, 3, 9, 0, 10, 0, 'Campus Tour', 'events'),
      createEvent(9, 3, 12, 0, 13, 30, 'Visa Appointment', 'admission'),
      createEvent(10, 4, 8, 30, 10, 0, 'Application Review', 'tasks'),
    ])
  }

  const getStartOfWeek = (date: Date) => {
    const result = new Date(date)
    const day = result.getDay()
    const diff = result.getDate() - day + (day === 0 ? -6 : 1)
    result.setDate(diff)
    result.setHours(0, 0, 0, 0)
    return result
  }

  const addDays = (date: Date, days: number) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate()
  }

  const getFilteredEvents = () => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTab = activeTab === 'All' || activeTab === e.type
      return matchesSearch && matchesTab
    })
  }

  const handleSetActiveTab = (tabId: string) => { setActiveTab(tabId) }
  const handleSetView = (v: 'Day' | 'Week' | 'Month') => { setView(v) }
  const setToday = () => { setCurrentDate(new Date()) }
  
  const navigateDate = (dir: number) => {
    if (view === 'Day') setCurrentDate(addDays(currentDate, dir))
    else if (view === 'Week') setCurrentDate(addDays(currentDate, dir * 7))
    else {
      const d = new Date(currentDate)
      d.setMonth(d.getMonth() + dir)
      setCurrentDate(d)
    }
  }

  const openModal = (dateStr?: string, hour?: number) => {
    const now = new Date()
    const startObj = dateStr ? new Date(dateStr) : now
    if (hour !== undefined) startObj.setHours(hour, 0, 0, 0)
    const endObj = new Date(startObj)
    endObj.setHours(endObj.getHours() + 1)
    
    setEditingEvent(null)
    setFormData({
      title: '',
      type: 'meeting',
      date: startObj.toISOString().split('T')[0],
      start: startObj.toTimeString().slice(0, 5),
      end: endObj.toTimeString().slice(0, 5)
    })
    setShowModal(true)
  }

  const editEvent = (event: CalendarEvent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setEditingEvent(event)
    setFormData({
      title: event.title,
      type: event.type,
      date: event.start.toISOString().split('T')[0],
      start: event.start.toTimeString().slice(0, 5),
      end: event.end.toTimeString().slice(0, 5)
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingEvent(null)
    setFormData({ title: '', type: 'admission', date: '', start: '', end: '' })
  }

  const deleteEvent = () => {
    if (editingEvent) {
      setEvents(events.filter(ev => ev.id !== editingEvent.id))
      closeModal()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const startDate = new Date(`${formData.date}T${formData.start}`)
    const endDate = new Date(`${formData.date}T${formData.end}`)

    if (editingEvent) {
      setEvents(events.map(ev => 
        ev.id === editingEvent.id ? { ...ev, title: formData.title, type: formData.type as CalendarEvent['type'], start: startDate, end: endDate } : ev
      ))
    } else {
      setEvents([...events, {
        id: Date.now(),
        title: formData.title,
        type: formData.type as CalendarEvent['type'],
        start: startDate,
        end: endDate
      }])
    }
    closeModal()
  }

  const navigateFromMonthToDay = (dateStr: string) => {
    setCurrentDate(new Date(dateStr))
    setView('Day')
  }

  const renderWeekDayView = () => {
    const startOfWeek = getStartOfWeek(currentDate)
    const displayDays = view === 'Day' 
      ? [currentDate] 
      : Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek, i))
    
    const filteredEvents = getFilteredEvents()
    
    const headersHtml = displayDays.map((day, i) => {
      const isToday = isSameDay(day, new Date())
      return (
        <div key={i} className={`text-center py-3 border-slate-200 relative ${i !== displayDays.length - 1 ? 'border-r' : ''} ${isToday ? 'bg-slate-50' : ''}`}>
          {isToday && <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue"></div>}
          <div className={`text-[10px] md:text-xs font-bold uppercase ${isToday ? 'text-brand-blue' : 'text-slate-400'}`}>
            {day.toLocaleDateString('en-US', { weekday: 'short' })} {day.getDate()}
          </div>
        </div>
      )
    })

    const bgLines = Array.from({ length: 24 }).map((_, i) => 
      <div key={i} className="border-b border-slate-100" style={{ height: HOUR_HEIGHT }}></div>
    )

    const yAxis = Array.from({ length: 24 }).map((_, i) => (
      <div key={i} className="text-right pr-2 text-[10px] md:text-xs font-medium text-slate-400 relative" style={{ height: HOUR_HEIGHT, top: -8 }}>
        {i === 0 ? '' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
      </div>
    ))

    const isTodayInView = displayDays.some(d => isSameDay(d, currentTime))
    const timeLineHtml = isTodayInView ? (
      <div className="absolute left-0 right-0 z-30 pointer-events-none flex" style={{ top: (currentTime.getHours() + currentTime.getMinutes() / 60) * HOUR_HEIGHT }}>
        <div className="w-[60px] text-[10px] font-medium text-red-500 text-right pr-2 -mt-[7px] bg-white">
          {formatTime(currentTime)}
        </div>
        <div className="flex-grow border-t border-red-500 relative">
          <div className="absolute -left-[5px] top-[-4.5px] w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></div>
        </div>
      </div>
    ) : null

    const columnsHtml = displayDays.map((day, dayIdx) => {
      const isToday = isSameDay(day, new Date())
      const dayStr = day.toISOString()
      
      const slotsHtml = Array.from({ length: 24 }).map((_, h) => (
        <div 
          key={h} 
          className="absolute w-full left-0 opacity-0 group-hover:opacity-100 hover:bg-slate-100/50 cursor-pointer transition-colors"
          style={{ top: h * HOUR_HEIGHT, height: HOUR_HEIGHT }}
          onClick={() => openModal(dayStr, h)}
        />
      ))

      const dayEventsHtml = filteredEvents.filter(e => isSameDay(e.start, day)).map(event => {
        const startMins = event.start.getHours() * 60 + event.start.getMinutes()
        const durationMins = (event.end.getTime() - event.start.getTime()) / 60000
        const top = (startMins / 60) * HOUR_HEIGHT
        const height = (durationMins / 60) * HOUR_HEIGHT
        const theme = EVENT_THEMES[event.type]

        return (
          <div 
            key={event.id}
            onClick={(e) => editEvent(event, e)}
            className={`absolute left-1 right-1 ${theme.bg} border-t-2 ${theme.border} rounded-md px-2 py-1.5 overflow-hidden transition-all hover:scale-[1.02] hover:z-30 cursor-pointer  hover:shadow`}
            style={{ top: top, height: height - 2 }}
          >
            <div className={`text-[9px] md:text-[10px] font-medium ${theme.label} mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis`}>
              {formatTime(event.start)} - {formatTime(event.end)}
            </div>
            <div className={`text-[10px] md:text-xs font-semibold ${theme.text} leading-tight`}>
              {event.title}
            </div>
          </div>
        )
      })

      return (
        <div key={dayIdx} className={`flex-1 border-slate-100 relative z-10 p-1 group ${dayIdx !== displayDays.length - 1 ? 'border-r' : ''} ${isToday ? 'bg-slate-50/30' : ''}`}>
          {slotsHtml}
          {dayEventsHtml}
        </div>
      )
    })

    return (
      <>
        <div className="grid border-b border-slate-200 bg-white shrink-0" style={{ gridTemplateColumns: `60px repeat(${displayDays.length}, minmax(0, 1fr))` }}>
          <div className="border-r border-slate-200 flex items-center justify-center bg-slate-50/30"></div>
          {headersHtml}
        </div>
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
          <div className="absolute inset-0 z-0 ml-[60px] pointer-events-none">{bgLines}</div>
          {timeLineHtml}
          <div className="flex absolute inset-0 min-h-[1920px]">
            <div className="w-[60px] flex-shrink-0 border-r border-slate-200 z-20 bg-white">{yAxis}</div>
            {columnsHtml}
          </div>
        </div>
      </>
    )
  }

  const renderMonthView = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startDate = getStartOfWeek(monthStart)
    const days: Date[] = []
    let current = new Date(startDate)
    
    while (current <= monthEnd || current.getDay() !== 1) {
      days.push(new Date(current))
      current = addDays(current, 1)
      if (days.length > 42) break
    }

    const filteredEvents = getFilteredEvents()

    const headerHtml = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
      <div key={day} className="text-center py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-r-0">
        {day}
      </div>
    ))

    const gridHtml = days.map((day, i) => {
      const isCurrentMonth = day.getMonth() === currentDate.getMonth()
      const isToday = isSameDay(day, new Date())
      const dayEvents = filteredEvents.filter(e => isSameDay(e.start, day))
      
      const eventsHtml = dayEvents.slice(0, 3).map(ev => (
        <div key={ev.id} className={`text-[10px] truncate px-1.5 py-0.5 rounded ${EVENT_THEMES[ev.type].bg} ${EVENT_THEMES[ev.type].text}`}>
          {ev.title}
        </div>
      ))

      return (
        <div 
          key={i}
          onClick={() => navigateFromMonthToDay(day.toISOString())}
          className={`min-h-[100px] border-r border-b border-slate-100 p-1 cursor-pointer hover:bg-slate-50 transition-colors ${!isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'} ${(i + 1) % 7 === 0 ? 'border-r-0' : ''}`}
        >
          <div className={`text-xs font-medium text-right p-1 ${isToday ? 'text-white bg-brand-blue rounded-full w-6 h-6 flex items-center justify-center ml-auto' : isCurrentMonth ? 'text-slate-700' : 'text-slate-400'}`}>
            {day.getDate()}
          </div>
          <div className="mt-1 space-y-1">
            {eventsHtml}
          </div>
          {dayEvents.length > 3 && <div className="text-[10px] text-slate-500 px-1">+ {dayEvents.length - 3} more</div>}
        </div>
      )
    })

    return (
      <>
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">{headerHtml}</div>
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">{gridHtml}</div>
      </>
    )
  }

  return (
    <div className="bg-white rounded-md  border border-slate-200 overflow-hidden flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="p-4 md:p-6 md:pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Calendar</h1>
          <p className="text-sm text-slate-500 mt-1 hidden sm:block">Stay Organized and On Track with Your Personalized Calendar</p>
        </div>
      </div>

      <div className="px-4 md:px-6 border-b border-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-0 shrink-0">
        <div className="flex overflow-x-auto w-full lg:w-auto gap-4 md:gap-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleSetActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'border-brand-blue text-brand-blue font-semibold' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3 pb-4 w-full lg:w-auto justify-between lg:justify-end overflow-x-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search.." 
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue w-32 md:w-48 transition-all"
            />
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 bg-brand-blue text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors  whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 flex-1 flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6 gap-4 shrink-0">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 w-48">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={setToday} className="px-3 py-1 border border-slate-200 rounded-md text-sm font-medium hover:bg-slate-50">Today</button>
              <div className="flex items-center border border-slate-200 rounded-md">
                <button onClick={() => navigateDate(-1)} className="p-1 border-r border-slate-200 hover:bg-slate-50 text-slate-600">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => navigateDate(1)} className="p-1 hover:bg-slate-50 text-slate-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto">
            <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
              {(['Day', 'Week', 'Month'] as const).map(v => (
                <button 
                  key={v}
                  onClick={() => handleSetView(v)} 
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    view === v ? 'bg-white text-slate-900 ' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            
          </div>
        </div>

        <div className="border border-slate-200 rounded-md overflow-hidden bg-white  flex-1 flex flex-col min-h-0">
          {view === 'Month' ? renderMonthView() : renderWeekDayView()}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  required 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm" 
                  placeholder="Event title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  >
                    <option value="admission">Admission</option>
                    <option value="entrance">Entrance</option>
                    <option value="counselling">Counselling</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="events">Events</option>
                    <option value="tasks">Tasks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input 
                    required 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input 
                    required 
                    type="time" 
                    value={formData.start}
                    onChange={(e) => setFormData({...formData, start: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                  <input 
                    required 
                    type="time" 
                    value={formData.end}
                    onChange={(e) => setFormData({...formData, end: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                {editingEvent && (
                  <button 
                    type="button" 
                    onClick={deleteEvent}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <div></div>
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-blue-700 transition-colors "
                  >
                    Save Event
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}