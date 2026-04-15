'use client'

export default function ApplicationsSection() {
  return (
    <div>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Inquiries & Applications</h2>
        <div className="flex flex-wrap gap-2 w-full xl:w-auto">
          <input type="date" className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500" />
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="received">Received</option>
            <option value="accepted">Accepted</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm ml-auto">
            <i className="fas fa-paper-plane mr-1"></i> New Inquiry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { init: 'M', name: 'MIT', status: 'Received', statusColor: 'blue', date: 'Feb 12, 2026', desc: 'Admission Inquiry: Computer Science Program' },
          { init: 'S', name: 'Stanford University', status: 'Pending', statusColor: 'yellow', date: 'Feb 15, 2026', desc: 'Scholarship Application Form' },
          { init: '🏛️', name: 'General Inquiry', status: 'Sent', statusColor: 'green', date: 'Feb 10, 2026', desc: 'Yale University, Princeton University' },
          { init: 'O', name: 'Oxford University', status: 'Accepted', statusColor: 'green', date: 'Jan 05, 2026', desc: 'Summer Research Program 2026' },
        ].map((app, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-full hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">{app.init}</div>
              <span className={`text-xs px-2 py-0.5 bg-${app.statusColor}-50 text-${app.statusColor}-600 rounded border border-${app.statusColor}-100 font-medium`}>{app.status}</span>
            </div>
            <div className="mb-4">
              <h3 className="font-bold text-slate-800 text-lg">{app.name}</h3>
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">{app.desc}</p>
              <span className="text-xs text-slate-400 mt-2 block"><i className="far fa-clock mr-1"></i> {app.date}</span>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <button className="w-full px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
