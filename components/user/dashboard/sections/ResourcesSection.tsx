'use client'

export default function ResourcesSection() {
  const resources = [
    { id: 1, title: 'Complete SAT Preparation', category: 'Exam Prep', author: 'Dr. Academic', downloads: 3420, rating: 4.8 },
    { id: 2, title: 'College Essay Writing Guide', category: 'Writing', author: 'Prof. Johnson', downloads: 2150, rating: 4.9 },
    { id: 3, title: 'Interview Mastery Handbook', category: 'Interview', author: 'Career Coach', downloads: 1890, rating: 4.7 },
    { id: 4, title: 'Scholarship & Financial Aid', category: 'Funding', author: 'Finance Expert', downloads: 4210, rating: 4.9 },
    { id: 5, title: 'Time Management Strategies', category: 'Productivity', author: 'Life Coach', downloads: 2560, rating: 4.6 },
    { id: 6, title: 'Career Planning Workshop', category: 'Career', author: 'Career Advisor', downloads: 1450, rating: 4.8 },
  ]

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Study Resources</h2>
          <p className="text-slate-500 mt-1">Curated learning materials and guides to help you succeed.</p>
        </div>
        <input type="text" placeholder="Search resources..." className="px-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(resource => (
          <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase">{resource.category}</span>
              <div className="flex items-center gap-1 text-xs text-yellow-500">
                <i className="fas fa-star"></i> {resource.rating}
              </div>
            </div>
            <h3 className="font-bold text-slate-800 mb-2">{resource.title}</h3>
            <p className="text-xs text-slate-500 mb-4">by {resource.author}</p>
            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span><i className="fas fa-download mr-1"></i> {resource.downloads}</span>
              <button className="px-3 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors text-xs">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
