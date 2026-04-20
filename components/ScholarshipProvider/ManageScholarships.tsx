import React, { useEffect, useState } from 'react';
import { scholarshipProviderApi, ProviderScholarship } from '@/services/scholarshipProviderApi';

interface ManageScholarshipsProps {
  onNavigate: (section: string) => void;
  onEdit?: (id: number) => void;
}

export default function ManageScholarships({ onNavigate, onEdit }: ManageScholarshipsProps) {
  const [scholarships, setScholarships] = useState<ProviderScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const limit = 10;

  useEffect(() => {
    loadScholarships();
  }, [page]);

  async function loadScholarships() {
    setLoading(true);
    setError('');
    try {
      const res = await scholarshipProviderApi.getScholarships(page, limit);
      setScholarships(res.scholarships);
      setTotal(res.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this scholarship?')) return;
    try {
      await scholarshipProviderApi.deleteScholarship(id);
      setScholarships(prev => prev.filter(s => s.id !== id));
      setTotal(prev => Math.max(0, prev - 1));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete scholarship');
    }
  }

  async function handleToggleStatus(s: ProviderScholarship) {
    const newStatus = s.status === 'active' ? 'draft' : 'active';
    setTogglingId(s.id);
    try {
      await scholarshipProviderApi.updateScholarship(s.id, {
        title: s.title,
        provider: s.title,
        location: s.location,
        value: s.value,
        deadline: s.deadline,
        degree_level: s.degree_level,
        funding_type: s.funding_type,
        scholarship_type: s.scholarship_type,
        description: s.description,
        image_url: s.image_url || '',
        field_of_study: Array.isArray(s.field_of_study) ? s.field_of_study : [],
        status: newStatus,
      });
      setScholarships(prev => prev.map(item => item.id === s.id ? { ...item, status: newStatus } : item));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setTogglingId(null);
    }
  }

  function handleEdit(id: number) {
    if (onEdit) {
      onEdit(id);
    } else {
      onNavigate('sec-edit-scholarship');
    }
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return 'No deadline';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-500/90 text-white';
      case 'draft': return 'bg-slate-500/90 text-white';
      case 'closed': return 'bg-red-500/90 text-white';
      default: return 'bg-slate-500/90 text-white';
    }
  }

  function getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  const filtered = scholarships.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <section className="fade-in max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Scholarship Portfolio</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage active, closed, and drafted programs.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 rounded-md p-1 hidden md:flex ">
            <button className="px-3 py-1.5 rounded bg-slate-100 text-slate-800  text-xs font-black uppercase tracking-widest"><i className="fa-solid fa-grip mr-1"></i> Grid</button>
            <button className="px-3 py-1.5 rounded text-slate-400 hover:text-slate-800 text-xs font-black uppercase tracking-widest transition-colors"><i className="fa-solid fa-list mr-1"></i> List</button>
          </div>
          <button
            onClick={() => onNavigate('sec-create-scholarship')}
            className="px-5 py-2.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 transition flex items-center border border-primary-500"
          >
            <i className="fa-solid fa-plus mr-2"></i> Create New
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md border border-slate-200  mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Search portfolio..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-primary-500 focus:bg-white transition shadow-inner placeholder:font-medium"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-slate-200 bg-white rounded-md px-4 py-2.5 text-sm outline-none focus:border-primary-500 font-bold  cursor-pointer"
        >
          <option>All Statuses</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>
        <select className="border border-slate-200 bg-white rounded-md px-4 py-2.5 text-sm outline-none focus:border-primary-500 font-bold  cursor-pointer">
          <option>Sort: Newest First</option>
          <option>Sort: Closing Soon</option>
          <option>Sort: Most Applicants</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-primary-600"></i>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-md border border-slate-200">
          <i className="fa-solid fa-graduation-cap text-5xl text-slate-300 mb-4"></i>
          <p className="text-lg font-bold text-slate-500">No scholarships found</p>
          <button
            onClick={() => onNavigate('sec-create-scholarship')}
            className="mt-4 px-6 py-2.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-bold text-sm transition"
          >
            Create your first scholarship
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-md border border-slate-200  overflow-hidden group hover:shadow-xl hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-40 relative overflow-hidden">
                {s.image_url ? (
                  <img src={s.image_url} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/90 backdrop-blur text-primary-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter  border border-white">
                    {s.funding_type || 'N/A'}
                  </span>
                  <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter  border border-white ${getStatusClass(s.status)}`}>
                    {getStatusLabel(s.status)}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-black leading-tight drop-">{s.title}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-md border border-slate-100 shadow-inner">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Deadline</p>
                    <p className="text-xs font-bold text-slate-700">{formatDate(s.deadline)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Value</p>
                    <p className="text-xs font-black text-primary-600">{s.value || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                    <span>Applications received</span>
                    <span className="text-slate-800 font-black">{s.applications_count}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(s.id)}
                    className="flex-1 py-2.5 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors font-black text-[10px] uppercase tracking-widest shadow-lg"
                  >
                    <i className="fa-solid fa-pen mr-1"></i> Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(s)}
                    disabled={togglingId === s.id}
                    className={`px-3 py-2.5 rounded-md transition-colors  text-[10px] font-black uppercase tracking-widest disabled:opacity-50 ${
                      s.status === 'active'
                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700'
                        : 'bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700'
                    }`}
                  >
                    {togglingId === s.id ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : s.status === 'active' ? (
                      <><i className="fa-solid fa-pause mr-1"></i>Deactivate</>
                    ) : (
                      <><i className="fa-solid fa-check mr-1"></i>Activate</>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="px-3 py-2.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 hover:text-red-700 transition-colors "
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="w-10 h-10 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-md font-bold text-sm ${
                p === page
                  ? 'bg-primary-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="w-10 h-10 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </section>
  );
}
