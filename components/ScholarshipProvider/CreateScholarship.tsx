import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { scholarshipProviderApi, CreateScholarshipPayload } from '@/services/scholarshipProviderApi';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'blockquote', 'code-block',
  'link',
];

interface CreateScholarshipProps {
  scholarshipId?: number | null;
  onNavigate?: (section: string) => void;
}

export default function CreateScholarship({ scholarshipId, onNavigate }: CreateScholarshipProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Full Ride');
  const [educationLevel, setEducationLevel] = useState("Bachelor's Degree (Undergrad)");
  const [programs, setPrograms] = useState('');
  const [value, setValue] = useState('');
  const [deadline, setDeadline] = useState('');
  const [coveredExpenses, setCoveredExpenses] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [requiredDocs, setRequiredDocs] = useState<string[]>(['Academic Transcripts', 'Govt. ID / Citizenship']);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!scholarshipId;

  const expenseOptions = ['Tuition Fees', 'Hostel / Accommodation', 'Food / Living Stipend', 'Books & Laptop', 'Travel Allowance'];
  const docOptions = ['Academic Transcripts', 'Govt. ID / Citizenship', 'Recommendation Letters', 'Personal Essay / SOP', 'Income Certificate', 'Portfolio Link'];

  useEffect(() => {
    if (isEditMode && scholarshipId) {
      loadScholarship(scholarshipId);
    }
  }, [scholarshipId]);

  async function loadScholarship(id: number) {
    setLoading(true);
    try {
      const s = await scholarshipProviderApi.getScholarshipById(id);
      setTitle(s.title);
      setCategory(s.funding_type || 'Full Ride');
      setEducationLevel(s.degree_level || "Bachelor's Degree (Undergrad)");
      setValue(s.value || '');
      setDeadline(s.deadline ? new Date(s.deadline).toISOString().split('T')[0] : '');
      setDescription(s.description || '');

      try {
        if (s.field_of_study) {
          const parsed = typeof s.field_of_study === 'string' ? JSON.parse(s.field_of_study) : s.field_of_study;
          setPrograms(Array.isArray(parsed) ? parsed.join(', ') : '');
        }
      } catch {
        setPrograms('');
      }

      try {
        if (s.eligibility_criteria) {
          const parsed = typeof s.eligibility_criteria === 'string' ? JSON.parse(s.eligibility_criteria) : s.eligibility_criteria;
          setEligibility(Array.isArray(parsed) ? parsed.join('\n') : JSON.stringify(parsed));
        }
      } catch {
        setEligibility('');
      }

      try {
        if (s.required_documents) {
          const parsed = typeof s.required_documents === 'string' ? JSON.parse(s.required_documents) : s.required_documents;
          if (Array.isArray(parsed)) setRequiredDocs(parsed);
        }
      } catch {
        setRequiredDocs(['Academic Transcripts', 'Govt. ID / Citizenship']);
      }

      if (s.image_url) {
        setBannerPreview(s.image_url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scholarship');
    } finally {
      setLoading(false);
    }
  }

  const toggleExpense = (item: string) => {
    setCoveredExpenses(prev => prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]);
  };

  const toggleDoc = (item: string) => {
    if (item === 'Academic Transcripts' || item === 'Govt. ID / Citizenship') return;
    setRequiredDocs(prev => prev.includes(item) ? prev.filter(d => d !== item) : [...prev, item]);
  };

  const MAX_BANNER_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

  function validateBanner(file: File): boolean {
    setBannerError('');
    if (!ALLOWED_TYPES.includes(file.type)) {
      setBannerError('Only image files are allowed (PNG, JPG, JPEG, WebP, GIF).');
      return false;
    }
    if (file.size > MAX_BANNER_SIZE) {
      setBannerError('Image size must be less than 5MB.');
      return false;
    }
    return true;
  }

  function handleBannerSelect(file: File | null) {
    if (!file) return;
    if (!validateBanner(file)) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  }

  function handleBannerDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleBannerSelect(file);
  }

  function handleBannerDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleBannerDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function removeBanner() {
    setBannerFile(null);
    if (bannerPreview && !bannerPreview.startsWith('http')) URL.revokeObjectURL(bannerPreview);
    setBannerPreview(null);
    setBannerError('');
  }

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  async function handleSubmit(e: React.FormEvent, status: 'draft' | 'active') {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !deadline) {
      setError('Title and deadline are required.');
      return;
    }

    setSubmitting(true);
    try {
      const provider = localStorage.getItem('scholarshipProviderUser');
      const providerName = provider ? JSON.parse(provider).provider_name : '';

      let imageUrl = bannerPreview || '';
      if (bannerFile) {
        imageUrl = await fileToBase64(bannerFile);
      }

      const payload: CreateScholarshipPayload = {
        title: title.trim(),
        provider: providerName,
        location: '',
        value: value.trim(),
        deadline: deadline,
        degree_level: educationLevel,
        funding_type: category,
        scholarship_type: category,
        description: description,
        image_url: imageUrl,
        field_of_study: programs.trim() ? programs.split(',').map(p => p.trim()).filter(Boolean) : [],
        status,
      };

      if (isEditMode && scholarshipId) {
        await scholarshipProviderApi.updateScholarship(scholarshipId, payload);
        setSuccess(`Scholarship ${status === 'active' ? 'published' : 'saved'} successfully!`);
        setTimeout(() => onNavigate?.('sec-manage-scholarships'), 1200);
      } else {
        await scholarshipProviderApi.createScholarship(payload);
        setSuccess(`Scholarship ${status === 'active' ? 'published' : 'saved'} successfully!`);
        if (status === 'active') {
          setTimeout(() => onNavigate?.('sec-manage-scholarships'), 1200);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save scholarship');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="fade-in max-w-5xl mx-auto flex items-center justify-center py-20">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-primary-600"></i>
      </section>
    );
  }

  return (
    <section className="fade-in max-w-5xl mx-auto pb-20">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 p-8 text-white flex justify-between items-end">
          <div>
            <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block border border-white/10">
              {isEditMode ? 'Edit Mode' : 'Scholarship Builder'}
            </span>
            <h2 className="text-3xl font-black mb-1">
              {isEditMode ? 'Edit Scholarship' : 'Launch New Opportunity'}
            </h2>
            <p className="text-primary-100 font-medium opacity-90">
              {isEditMode ? 'Update your scholarship criteria, funding, and requirements.' : 'Design your scholarship criteria, funding, and application requirements.'}
            </p>
          </div>
          <div className="hidden md:block">
            <i className={`fa-solid ${isEditMode ? 'fa-pen-to-square' : 'fa-rocket'} text-6xl text-white/20`}></i>
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-bold">
            {error}
          </div>
        )}
        {success && (
          <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-bold">
            {success}
            {success.includes('published') && !isEditMode && (
              <button
                onClick={() => onNavigate?.('sec-manage-scholarships')}
                className="ml-3 underline font-black"
              >
                Go to Manage Scholarships
              </button>
            )}
          </div>
        )}

        <form onSubmit={e => handleSubmit(e, 'active')} className="p-8 space-y-10">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-5 pb-2 border-b border-slate-200 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-black"><i className="fa-solid fa-1"></i></div> General Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-10">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Official Scholarship Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. NextGen Innovators Tech Scholarship 2026"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-0 outline-none text-lg font-bold transition placeholder:font-normal placeholder:text-slate-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Scholarship Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 transition bg-white appearance-none cursor-pointer font-bold text-slate-800 shadow-sm"
                >
                  <option value="Full Ride">Full Ride (100% Covered)</option>
                  <option value="Partial">Partial Scholarship (Fixed Amount)</option>
                  <option value="Merit-Based">Merit-Based Award</option>
                  <option value="Need-Based">Financial Need-Based</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Target Education Level</label>
                <select
                  value={educationLevel}
                  onChange={e => setEducationLevel(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 transition bg-white appearance-none cursor-pointer font-bold text-slate-800 shadow-sm"
                >
                  <option>+2 / High School / A-Levels</option>
                  <option>Bachelor's Degree (Undergrad)</option>
                  <option>Master's Degree (Postgrad)</option>
                  <option>Ph.D. / Research</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Eligible Academic Programs <span className="text-slate-400 font-normal lowercase">(Comma separated, leave blank for 'Any')</span></label>
                <input
                  type="text"
                  value={programs}
                  onChange={e => setPrograms(e.target.value)}
                  placeholder="e.g. Computer Science, Software Engineering, IT, AI"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-primary-500 outline-none transition font-medium shadow-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-5 pb-2 border-b border-slate-200 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm font-black"><i className="fa-solid fa-2"></i></div> Funding & Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-0 md:pl-10">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Financial Value</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">NPR</span>
                  <input
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="e.g. 50,000 / yr"
                    className="w-full border-2 border-slate-200 rounded-xl pl-14 pr-4 py-3 outline-none focus:border-green-500 transition font-bold shadow-sm"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Application Deadline <span className="text-danger">*</span></label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-danger transition font-bold shadow-sm"
                />
              </div>

              <div className="md:col-span-3 bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-2 shadow-inner">
                <label className="block text-sm font-black text-slate-800 mb-4 uppercase tracking-wider">What expenses are covered?</label>
                <div className="flex flex-wrap gap-6">
                  {expenseOptions.map(item => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={coveredExpenses.includes(item)}
                        onChange={() => toggleExpense(item)}
                        className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="font-bold text-slate-600 group-hover:text-primary-600 transition text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-5 pb-2 border-b border-slate-200 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-black"><i className="fa-solid fa-3"></i></div> Requirements & Content
            </h3>
            <div className="space-y-6 pl-0 md:pl-10">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Comprehensive Description</label>
                <div className="border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm [&_.ql-container]:min-h-[200px] [&_.ql-editor]:min-h-[200px]">
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write a compelling description explaining the purpose, benefits, and exact expectations of the scholars..."
                    className="bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Eligibility & Criteria</label>
                <div className="border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm [&_.ql-container]:min-h-[150px] [&_.ql-editor]:min-h-[150px]">
                  <ReactQuill
                    theme="snow"
                    value={eligibility}
                    onChange={setEligibility}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="- Minimum 3.5 GPA out of 4.0&#10;- Must be a citizen of a developing nation&#10;- Demonstrated financial need..."
                    className="bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-tight">Mandatory Documents from Applicant</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner">
                  {docOptions.map(doc => {
                    const isRequired = doc === 'Academic Transcripts' || doc === 'Govt. ID / Citizenship';
                    return (
                      <label key={doc} className="flex items-center gap-2 cursor-pointer group bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                        <input
                          type="checkbox"
                          checked={requiredDocs.includes(doc)}
                          disabled={isRequired}
                          onChange={() => toggleDoc(doc)}
                          className={`w-4 h-4 rounded text-primary-600 ${isRequired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                        <span className={`font-bold text-xs uppercase tracking-tighter ${isRequired ? 'text-slate-400' : 'text-slate-700 group-hover:text-primary-600 transition'}`}>
                          {doc} {isRequired && '(Req)'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Promotional Banner Image</label>
                <div
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer group bg-white shadow-sm ${
                    isDragging
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-300 hover:bg-slate-50 hover:border-primary-400'
                  }`}
                  onClick={() => document.getElementById('banner-upload')?.click()}
                  onDrop={handleBannerDrop}
                  onDragOver={handleBannerDragOver}
                  onDragLeave={handleBannerDragLeave}
                >
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      handleBannerSelect(file);
                      e.target.value = '';
                    }}
                  />
                  {bannerPreview ? (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <img
                          src={bannerPreview}
                          alt="Banner preview"
                          className="max-h-48 mx-auto rounded-xl object-cover shadow-md"
                        />
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); removeBanner(); }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg transition"
                        >
                          <i className="fa-solid fa-times text-sm"></i>
                        </button>
                      </div>
                      {bannerFile && (
                        <div>
                          <p className="text-sm font-bold text-slate-700">{bannerFile.name}</p>
                          <p className="text-xs text-slate-400 mt-1">{(bannerFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      )}
                      <p className="text-xs text-primary-600 font-bold">Click or drop to replace</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-50 group-hover:text-primary-500 transition group-hover:scale-110">
                        <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                      </div>
                      <p className="text-lg font-black text-slate-800">Drag and drop your banner image here</p>
                      <p className="text-sm text-slate-500 mt-1 mb-4">or <span className="text-primary-600 hover:underline font-bold">browse your files</span></p>
                      <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase bg-slate-100 inline-block px-4 py-1.5 rounded-full">PNG, JPG, WebP, GIF • Max 5MB</p>
                    </>
                  )}
                </div>
                {bannerError && (
                  <p className="mt-2 text-xs font-bold text-red-600 flex items-center gap-1">
                    <i className="fa-solid fa-exclamation-circle"></i> {bannerError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-4 bg-slate-50/50 -mx-8 -mb-8 p-8">
            <button
              type="button"
              onClick={() => onNavigate?.('sec-manage-scholarships')}
              className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold transition shadow-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={e => handleSubmit(e, 'draft')}
              disabled={submitting}
              className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Saving...</>
              ) : (
                'Save as Draft'
              )}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-black shadow-lg shadow-primary-500/30 transition transform hover:-translate-y-0.5 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> {isEditMode ? 'Updating...' : 'Publishing...'}
                </>
              ) : (
                <>
                  <i className={`fa-solid ${isEditMode ? 'fa-check' : 'fa-paper-plane'}`}></i> {isEditMode ? 'Update Scholarship' : 'Publish Scholarship'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
