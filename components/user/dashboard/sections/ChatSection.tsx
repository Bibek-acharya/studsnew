'use client'

export default function ChatSection() {
  return (
    <div className="h-[calc(100vh-140px)]">
      <div className="flex h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50 hidden md:flex">
          <div className="p-4 border-b border-slate-100">
            <input type="text" placeholder="Search messages..." className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="overflow-y-auto flex-1">
            {[
              { name: 'Dr. Emily Smith', role: 'Career Counselor', active: true },
              { name: 'Prof. John Watson', role: 'Advisor', active: false },
              { name: 'College Support', role: 'General Queries', active: false },
            ].map((chat, idx) => (
              <div key={idx} className={`p-3 hover:bg-white cursor-pointer transition-colors border-l-4 ${idx === 0 ? 'border-blue-500 bg-white' : 'border-transparent'}`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name.split(' ')[0]}`} className="w-10 h-10 rounded-full bg-slate-200" alt="Avatar" />
                    {chat.active && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{chat.name}</p>
                    <p className="text-xs text-slate-500 truncate">{chat.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="border-b border-slate-100 p-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Dr. Emily Smith</h3>
            <div className="flex gap-2">
              <button className="text-slate-400 hover:text-slate-600"><i className="fas fa-phone"></i></button>
              <button className="text-slate-400 hover:text-slate-600"><i className="fas fa-video"></i></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-3">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" className="w-8 h-8 rounded-full" alt="Avatar" />
              <div className="bg-slate-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-slate-700">Hi Alex! How are you doing with your applications?</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                <p className="text-sm">Good! I&apos;ve submitted 4 applications so far.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 p-4 flex gap-2">
            <input type="text" placeholder="Type a message..." className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
