'use client'

export default function CalendarSection() {
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
