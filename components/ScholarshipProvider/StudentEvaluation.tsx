import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { scholarshipProviderApi, ProviderApplication } from '@/services/scholarshipProviderApi';

interface StudentEvaluationProps {
  applicationId: string;
  onBack: () => void;
  onStatusUpdate?: () => void;
}

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
};

const quillFormats = [
  'bold', 'italic', 'underline',
  'list', 'bullet',
];

export default function StudentEvaluation({ applicationId, onBack, onStatusUpdate }: StudentEvaluationProps) {
  const [activeTab, setActiveTab] = useState('personal');
  const [score, setScore] = useState(75);
  const [notes, setNotes] = useState<{ id: number; author: string; text: string; date: string }[]>([]);
  const [newNote, setNewNote] = useState('');
  const [application, setApplication] = useState<ProviderApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('pending');
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  async function loadApplication() {
    setLoading(true);
    setError('');
    try {
      const id = parseInt(applicationId, 10);
      const res = await scholarshipProviderApi.getApplicationById(id);
      setApplication(res);
      setStatus(res.status);
      if (res.evaluation_notes) {
        try {
          const parsed = JSON.parse(res.evaluation_notes);
          if (Array.isArray(parsed)) {
            setNotes(parsed);
          } else {
            setNotes([{ id: 1, author: 'System', text: res.evaluation_notes, date: 'Imported' }]);
          }
        } catch {
          setNotes([{ id: 1, author: 'System', text: res.evaluation_notes, date: 'Imported' }]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load application');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddNote() {
    if (!newNote.trim() || !application) return;
    setSaving(true);
    try {
      const updatedNotes = [
        { id: Date.now(), author: 'You', text: newNote.trim(), date: 'Just now' },
        ...notes,
      ];
      await scholarshipProviderApi.evaluateApplication(application.id, {
        score,
        notes: JSON.stringify(updatedNotes),
        passing: score >= 50,
      });
      setNotes(updatedNotes);
      setNewNote('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!application) return;
    setSavingStatus(true);
    try {
      await scholarshipProviderApi.updateApplicationStatus(application.id, newStatus);
      setStatus(newStatus);
      setApplication(prev => prev ? { ...prev, status: newStatus } : null);
      onStatusUpdate?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="fade-in max-w-7xl mx-auto flex items-center justify-center py-20">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-primary-600"></i>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="fade-in max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p className="font-bold">{error || 'Application not found'}</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-sm">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${application.first_name} ${application.last_name}`;
  const initials = `${application.first_name?.[0] || ''}${application.last_name?.[0] || ''}`;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-10 fade-in">
            <div>
              <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-5 flex items-center gap-4">
                Demographics & Contact <div className="h-px bg-slate-100 flex-1"></div>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 mb-1">Email Address</p>
                  <p className="font-semibold text-slate-800 break-all">{application.email}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 mb-1">Phone Number</p>
                  <p className="font-semibold text-slate-800">{application.phone_number || 'Not provided'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 mb-1">Applied On</p>
                  <p className="font-semibold text-slate-800">{new Date(application.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {application.scholarship && (
              <div>
                <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-5 flex items-center gap-4">
                  Scholarship Details <div className="h-px bg-slate-100 flex-1"></div>
                </h4>
                <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100">
                  <h5 className="font-black text-slate-800 text-lg">{application.scholarship.title}</h5>
                  <p className="text-sm text-slate-600 mt-1">{application.scholarship.funding_type} • {application.scholarship.value || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        );
      case 'documents':
        return (
          <div className="space-y-6 fade-in">
            <h4 className="text-lg font-black text-slate-800">Supporting Documents</h4>
            {application.documents ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Array.isArray(application.documents) ? application.documents : []).map((doc: any, i: number) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition text-center group cursor-pointer">
                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-50 group-hover:text-primary-600 transition">
                      <i className="fa-solid fa-file-lines text-2xl"></i>
                    </div>
                    <p className="text-xs font-bold text-slate-700 truncate mb-2">{doc.name || `Document ${i + 1}`}</p>
                    <div className="flex gap-2 justify-center">
                      <button className="px-3 py-1 text-[10px] font-black uppercase bg-primary-50 text-primary-600 rounded-lg">View</button>
                      <button className="px-3 py-1 text-[10px] font-black uppercase bg-slate-50 text-slate-500 rounded-lg"><i className="fa-solid fa-download"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 font-medium">No documents uploaded.</p>
            )}
          </div>
        );
      case 'essay':
        return (
          <div className="space-y-6 fade-in">
            <h4 className="text-lg font-black text-slate-800">Personal Statement</h4>
            {application.personal_statement ? (
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 italic text-slate-700 leading-relaxed font-serif shadow-inner">
                "{application.personal_statement}"
                <p className="mt-6 text-sm font-sans font-bold text-slate-400 uppercase tracking-widest">— Written by {fullName}</p>
              </div>
            ) : (
              <p className="text-slate-500 font-medium">No personal statement provided.</p>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fade-in max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition text-slate-600"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              Applicant File: <span className="text-slate-500 font-mono font-medium text-lg">APP-{application.id}</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] md:max-w-none">
              {application.scholarship ? `Applied for: ${application.scholarship.title}` : fullName}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 font-bold text-sm shadow-sm flex items-center justify-center gap-2">
            <i className="fa-regular fa-comment-dots text-primary-500"></i> Message
          </button>
          <div className="h-8 w-px bg-slate-300 mx-1 hidden md:block self-center"></div>
          <select
            value={status}
            onChange={e => handleStatusChange(e.target.value)}
            disabled={savingStatus}
            className="flex-1 md:flex-none border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold bg-white shadow-sm outline-none cursor-pointer focus:border-primary-500 disabled:opacity-50"
          >
            <option value="pending">Pending Review</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="approved">Approved (Final)</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        <div className="space-y-6 xl:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-600 to-blue-400"></div>
            <div className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white shadow-lg relative z-10 bg-primary-100 text-primary-600 flex items-center justify-center text-3xl font-black">
              {initials}
            </div>
            <h3 className="text-2xl font-black text-slate-800">{fullName}</h3>
            <p className="text-sm font-bold text-primary-600 mb-2">{application.email}</p>
            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter mb-6 border bg-slate-100 text-slate-600">
              {status.replace('_', ' ')}
            </div>

            <div className="grid grid-cols-2 gap-3 text-left mb-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Applied</p>
                <p className="font-bold text-slate-800 text-xs mt-1 uppercase tracking-tighter">
                  {new Date(application.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <button className="w-full py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl hover:bg-indigo-100 text-sm font-extrabold transition flex items-center justify-center gap-2 shadow-sm">
              <i className="fa-solid fa-video text-xs"></i> Schedule Interview
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
              <h4 className="font-bold text-sm flex items-center gap-2"><i className="fa-solid fa-clipboard-user text-primary-400"></i> Reviewer Panel</h4>
              <i className="fa-solid fa-lock text-slate-400 text-xs"></i>
            </div>
            <div className="p-5 bg-slate-50 space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Evaluation Score</label>
                  <span className="text-xs font-black text-primary-600">{score}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={score}
                  onChange={e => setScore(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {notes.map(note => (
                  <div key={note.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-primary-600 uppercase">{note.author}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{note.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>

              <div className="relative">
                <ReactQuill
                  theme="snow"
                  value={newNote}
                  onChange={setNewNote}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Add an internal evaluation note..."
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden [&_.ql-container]:min-h-[120px] [&_.ql-editor]:min-h-[120px]"
                />
                <button
                  onClick={handleAddNote}
                  disabled={saving || !newNote.trim()}
                  className="mt-2 w-full py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-sm transition font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
                  ) : (
                    <><i className="fa-solid fa-paper-plane"></i> Add Note</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[700px]">
          <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/80 backdrop-blur sticky top-0 z-10 no-scrollbar">
            {[
              { id: 'personal', label: 'Personal & Academic', icon: 'fa-id-card' },
              { id: 'documents', label: 'Documents & Uploads', icon: 'fa-folder-open' },
              { id: 'essay', label: 'Personal Essay', icon: 'fa-pen-nib' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-primary-600'
                }`}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 flex-1 bg-white">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
