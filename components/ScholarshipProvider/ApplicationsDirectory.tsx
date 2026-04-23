import React, { useEffect, useState } from 'react';
import { scholarshipProviderApi, ProviderApplication } from '@/services/scholarshipProviderApi';

interface ApplicationsDirectoryProps {
  onReviewStudent: (id: string) => void;
}

export default function ApplicationsDirectory({ onReviewStudent }: ApplicationsDirectoryProps) {
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    loadApplications();
  }, [page, statusFilter]);

  async function loadApplications() {
    setLoading(true);
    setError('');
    try {
      const params: { page: number; limit: number; status?: string } = { page, limit };
      if (statusFilter !== 'All') {
        params.status = statusFilter.toLowerCase().replace(' ', '_');
      }
      const res = await scholarshipProviderApi.getApplications(params);
      setApplications(res.applications);
      setTotal(res.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: number, newStatus: string) {
    try {
      await scholarshipProviderApi.updateApplicationStatus(id, newStatus);
      setApplications(prev =>
        prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  function getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-slate-100 text-slate-600';
      case 'under_review': return 'bg-blue-100 text-blue-700';
      case 'shortlisted': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  function getStatusLabel(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
  }

  const filtered = applications.filter(app => {
    const fullName = `${app.first_name} ${app.last_name}`.toLowerCase();
    const email = app.email.toLowerCase();
    const id = `APP-${app.id}`;
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <section className="fade-in h-full flex flex-col">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Applications Directory</h2>
          <p className="text-sm text-slate-500 mt-1">Review, filter, and manage all student submissions in one place.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 font-bold text-sm  transition">
            <i className="fa-solid fa-filter mr-2"></i> Advanced Filters
          </button>
          <button className="px-4 py-2 bg-success text-white rounded-md hover:bg-green-600 font-bold text-sm  shadow-green-500/20 transition">
            <i className="fa-solid fa-download mr-2"></i> Export Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-md  border border-slate-200 flex flex-col flex-1 overflow-hidden min-h-[500px]">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <div className="relative w-full lg:w-64">
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Search by name, ID, email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent "
              />
            </div>
            <select className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500  flex-1 lg:flex-none">
              <option value="All">All Programs</option>
              <option value="CS">Computer Science</option>
              <option value="SE">Software Engineering</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500  flex-1 lg:flex-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm font-bold">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-auto relative">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-primary-600"></i>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <i className="fa-solid fa-inbox text-4xl mb-3"></i>
              <p className="font-bold">No applications found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-slate-100 text-slate-500 text-xs uppercase font-extrabold sticky top-0 z-10 tracking-wider">
                <tr>
                  <th className="py-4 px-5 w-10 border-b border-slate-200">
                    <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer" />
                  </th>
                  <th className="py-4 px-5 border-b border-slate-200">Applicant ID & Name</th>
                  <th className="py-4 px-5 border-b border-slate-200">Email</th>
                  <th className="py-4 px-5 border-b border-slate-200">Phone</th>
                  <th className="py-4 px-5 border-b border-slate-200">Applied On</th>
                  <th className="py-4 px-5 border-b border-slate-200">Current Status</th>
                  <th className="py-4 px-5 border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm bg-white">
                {filtered.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50 transition border-b border-slate-100 group">
                    <td className="py-4 px-5"><input type="checkbox" className="rounded border-slate-300 w-4 h-4 cursor-pointer" /></td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-black text-sm ">
                          {app.first_name?.[0]}{app.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 leading-tight">{app.first_name} {app.last_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">APP-{app.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-600 font-medium">{app.email}</td>
                    <td className="py-4 px-5 text-slate-600 font-medium">{app.phone_number}</td>
                    <td className="py-4 px-5 text-slate-600 font-bold">{formatDate(app.created_at)}</td>
                    <td className="py-4 px-5">
                      <span className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${getStatusClass(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => onReviewStudent(String(app.id))}
                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-primary-600 hover:text-white transition-all font-bold text-xs  border border-slate-200"
                        >
                          Review File
                        </button>
                        <select
                          value={app.status}
                          onChange={e => handleStatusChange(app.id, e.target.value)}
                          className="border border-slate-200 rounded-md px-2 py-2 text-xs font-bold bg-white  cursor-pointer focus:border-primary-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="under_review">Under Review</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
            <div className="text-slate-500 font-medium">
              Showing <span className="text-slate-800 font-bold">{(page - 1) * limit + 1}</span> to <span className="text-slate-800 font-bold">{Math.min(page * limit, total)}</span> of <span className="text-slate-800 font-bold">{total}</span> entries
            </div>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-xs ${
                    p === page ? 'bg-primary-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
