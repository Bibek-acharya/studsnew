'use client'

export default function NotificationsSection() {
  const notifications = [
    { id: 1, type: 'deadline', icon: 'fa-exclamation-circle', title: 'Application Deadline Approaching', message: 'Stanford University application deadline is in 3 days.', time: '2 hours ago', read: false },
    { id: 2, type: 'message', icon: 'fa-envelope', title: 'Message from Dr. Emily Smith', message: 'Reminder: Your counselling session is tomorrow at 10 AM.', time: '4 hours ago', read: false },
    { id: 3, type: 'achievement', icon: 'fa-check-circle', title: 'Profile Updated Successfully', message: 'Your profile is now 85% complete.', time: '1 day ago', read: true },
    { id: 4, type: 'opportunity', icon: 'fa-star', title: 'New Scholarship Opportunity', message: 'Harvard Merit Scholarship opens for applications.', time: '2 days ago', read: true },
  ]

  const getStyles = (type: string) => {
    const styles = {
      deadline: { bg: 'bg-orange-50', icon: 'text-orange-500' },
      message: { bg: 'bg-blue-50', icon: 'text-blue-500' },
      achievement: { bg: 'bg-green-50', icon: 'text-green-500' },
      opportunity: { bg: 'bg-purple-50', icon: 'text-purple-500' },
    }
    return styles[type as keyof typeof styles] || styles.message
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Notifications</h2>

      <div className="space-y-3">
        {notifications.map(notif => {
          const styles = getStyles(notif.type)
          return (
            <div key={notif.id} className={`p-4 rounded-xl border transition-all ${notif.read ? 'bg-white border-slate-200' : `${styles.bg} border-slate-200`}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${notif.read ? 'bg-slate-100' : styles.bg}`}>
                  <i className={`fas ${notif.icon} ${notif.read ? 'text-slate-500' : styles.icon}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800">{notif.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-2">{notif.time}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 ml-4 flex-shrink-0">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
