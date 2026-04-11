import React, { useEffect, useState } from 'react';
import { scholarshipProviderApi, ProviderInterview } from '@/services/scholarshipProviderApi';

export default function Interviews() {
  const [interviews, setInterviews] = useState<ProviderInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    application_id: '',
    scheduled_at: '',
    duration: 30,
    type: 'video',
    location: '',
    link: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInterviews();
  }, []);

  async function loadInterviews() {
    setLoading(true);
    setError('');
    try {
      const data = await scholarshipProviderApi.getInterviews();
      setInterviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.application_id || !formData.scheduled_at) {
      alert('Application ID and scheduled date/time are required.');
      return;
    }
    setSubmitting(true);
    try {
      await scholarshipProviderApi.createInterview({
        application_id: parseInt(formData.application_id, 10),
        scheduled_at: formData.scheduled_at,
        duration: formData.duration,
        type: formData.type,
        location: formData.location,
        link: formData.link,
        notes: formData.notes,
      });
      setShowModal(false);
      setFormData({ application_id: '', scheduled_at: '', duration: 30, type: 'video', location: '', link: '', notes: '' });
      loadInterviews();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to schedule interview');
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function formatTime(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function getStatusClass(status: string): string {
    switch (status) {
      case 'scheduled': return 'bg-blue-50 text-blue-600';
      case 'completed': return 'bg-green-50 text-green-600';
      case 'cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  }

  return (
    <section className="fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Interview Command Center</h2>
          <p className="text-sm text-slate-500 mt-1">Schedule, conduct, and review applicant interviews.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold text-sm shadow-lg shadow-primary-500/20 transition flex items-center"
        >
          <i className="fa-solid fa-calendar-plus mr-2"></i> Schedule New Interview
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Filter Schedule</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block tracking-wider">Status</label>
                <div className="space-y-2">
                  {['scheduled', 'completed', 'cancelled'].map(status => (
                    <label key={status} className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                      <input type="checkbox" defaultChecked={status !== 'cancelled'} className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500" />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-black text-slate-800 uppercase tracking-tighter text-sm">All Scheduled Interviews</h3>
            <div className="relative w-full md:w-64">
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="text" placeholder="Search applicant..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none shadow-sm font-medium" />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-primary-600"></i>
            </div>
          ) : interviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <i className="fa-solid fa-calendar text-4xl mb-3"></i>
              <p className="font-bold">No interviews scheduled</p>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-white text-[10px] uppercase text-slate-400 font-black sticky top-0 border-b border-slate-100 shadow-sm tracking-widest">
                  <tr>
                    <th className="py-4 px-6 border-b border-slate-200">Date & Time</th>
                    <th className="py-4 px-6 border-b border-slate-200">Application ID</th>
                    <th className="py-4 px-6 border-b border-slate-200">Type</th>
                    <th className="py-4 px-6 border-b border-slate-200">Duration</th>
                    <th className="py-4 px-6 border-b border-slate-200">Status</th>
                    <th className="py-4 px-6 border-b border-slate-200 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium bg-white">
                  {interviews.map(iv => (
                    <tr key={iv.id} className="hover:bg-slate-50 transition border-b border-slate-100 group">
                      <td className="py-4 px-6">
                        <p className="font-black text-slate-800">{formatDate(iv.scheduled_at)}</p>
                        <p className="text-xs text-primary-600 font-bold lowercase">{formatTime(iv.scheduled_at)}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-extrabold text-slate-700">APP-{iv.application_id}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-bold italic capitalize">{iv.type}</td>
                      <td className="py-4 px-6 text-slate-600 font-bold">{iv.duration} min</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${getStatusClass(iv.status)}`}>
                          {iv.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-primary-600 hover:text-white transition-all font-black text-[10px] uppercase shadow-sm border border-slate-200">
                          {iv.status === 'scheduled' ? 'Join Call' : 'View Details'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">Schedule New Interview</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center">
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Application ID <span className="text-danger">*</span></label>
                <input
                  type="number"
                  required
                  value={formData.application_id}
                  onChange={e => setFormData(prev => ({ ...prev, application_id: e.target.value }))}
                  placeholder="e.g. 123"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Date & Time <span className="text-danger">*</span></label>
                <input
                  type="datetime-local"
                  required
                  value={formData.scheduled_at}
                  onChange={e => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    min="15"
                    value={formData.duration}
                    onChange={e => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none font-medium cursor-pointer"
                  >
                    <option value="video">Video Call</option>
                    <option value="phone">Phone</option>
                    <option value="in-person">In Person</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Meeting Link / Location</label>
                <input
                  type="text"
                  value={formData.type === 'in-person' ? formData.location : formData.link}
                  onChange={e => {
                    if (formData.type === 'in-person') {
                      setFormData(prev => ({ ...prev, location: e.target.value }));
                    } else {
                      setFormData(prev => ({ ...prev, link: e.target.value }));
                    }
                  }}
                  placeholder={formData.type === 'in-person' ? 'Office address' : 'Zoom/Meet link'}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any preparation notes..."
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none font-medium"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Scheduling...</> : 'Schedule Interview'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
