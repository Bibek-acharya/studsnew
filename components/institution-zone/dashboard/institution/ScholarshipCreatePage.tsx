"use client";
import React, { useState } from 'react';

interface Props {
  onBack: () => void;
  scholarshipId?: number | null;
}

const ScholarshipCreatePage: React.FC<Props> = ({ onBack, scholarshipId }) => {
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [status, setStatus] = useState("open");
  const [type, setType] = useState("merit");
  const [location, setLocation] = useState("");
  const [targetAudiences, setTargetAudiences] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [link, setLink] = useState("");
  const [field, setField] = useState("");
  const [amount, setAmount] = useState("");
  const [features, setFeatures] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Dynamic Array States
  const [eligibility, setEligibility] = useState<{ id: number; heading: string; desc: string }[]>([
    { id: 1, heading: '', desc: '' }
  ]);
  const [regions, setRegions] = useState<{ id: number; heading: string; note: string }[]>([
    { id: 1, heading: '', note: '' }
  ]);
  const [documents, setDocuments] = useState<{ id: number; name: string }[]>([
    { id: 1, name: '' }
  ]);
  const [timeline, setTimeline] = useState<{ id: number; date: string; heading: string; desc: string }[]>([
    { id: 1, date: '', heading: '', desc: '' }
  ]);
  const [processes, setProcesses] = useState<{ id: number; step: string; desc: string }[]>([
    { id: 1, step: '', desc: '' }
  ]);
  const [benefits, setBenefits] = useState<{ id: number; icon: string; heading: string; sub: string }[]>([
    { id: 1, icon: '', heading: '', sub: '' }
  ]);
  const [videoUrl, setVideoUrl] = useState("");
  const [applySteps, setApplySteps] = useState<{ id: number; instruction: string }[]>([
    { id: 1, instruction: '' }
  ]);
  const [faqs, setFaqs] = useState<{ id: number; q: string; a: string }[]>([
    { id: 1, q: '', a: '' }
  ]);

  const handleAudienceChange = (aud: string) => {
    setTargetAudiences(prev => 
      prev.includes(aud) ? prev.filter(x => x !== aud) : [...prev, aud]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Changes Saved Successfully!');
    onBack();
  };

  const addItem = <T extends { id: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>, defaultItem: Omit<T, 'id'>) => {
    setter(prev => [...prev, { ...defaultItem, id: Date.now() } as unknown as T]);
  };
  const removeItem = <T extends { id: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: number) => {
    setter(prev => prev.filter(x => x.id !== id));
  };
  const updateItem = (setter: any, id: number, field: string, value: string) => {
    setter((prev: any[]) => prev.map(x => x.id === id ? { ...x, [field]: value } : x));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={onBack}
            className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            {scholarshipId ? "Edit Scholarship" : "Create New Scholarship"}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Block 1: Basic Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 border-b pb-3">
              <i className="fa-solid fa-info-circle text-blue-500 mr-2"></i>Basic Details
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Scholarship Banner / Image Placeholder</label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden" 
                onClick={() => document.getElementById('imageInput')?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="space-y-1 text-center">
                    <i className="fa-regular fa-image text-4xl text-gray-400"></i>
                    <div className="flex text-sm text-gray-600 justify-center mt-3">
                      <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                      </span>
                    </div>
                  </div>
                )}
                <input id="imageInput" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scholarship Heading</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="Enter scholarship title" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provider Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. ABC Foundation" value={provider} onChange={e => setProvider(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (Status)</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="open">Open</option>
                  <option value="closing_soon">Closing Soon</option>
                  <option value="opening_soon">Opening Soon</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Types of Scholarship</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" value={type} onChange={e => setType(e.target.value)}>
                  <option value="merit">Merit Based</option>
                  <option value="need">Need Based</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other Options</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. New York, USA" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">For (Target Audience)</label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {['+2', 'Bachelor', 'Master', 'Other'].map(aud => (
                    <label key={aud} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600 w-4 h-4 cursor-pointer" checked={targetAudiences.includes(aud)} onChange={() => handleAudienceChange(aud)} /> 
                      <span className="text-sm">{aud}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Block 2: Detailed Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 border-b pb-3">
              <i className="fa-solid fa-align-left text-blue-500 mr-2"></i>Detailed Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apply Now Link</label>
                <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="External link or leave blank for internal" value={link} onChange={e => setLink(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. Computer Science, Medicine" value={field} onChange={e => setField(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Funding Amount</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. $5,000 or Full Tuition" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Scholarship Features</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors h-20" placeholder="Short features highlights..." value={features} onChange={e => setFeatures(e.target.value)}></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">About the Scholarship (Description)</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors h-32" placeholder="Full description..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brief Eligibility Summary</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors h-20" placeholder="Summary of who can apply..." value={summary} onChange={e => setSummary(e.target.value)}></textarea>
            </div>
          </div>

          {/* Block 3: Criteria & Documents */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 border-b pb-3">
              <i className="fa-solid fa-list-check text-blue-500 mr-2"></i>Criteria & Requirements
            </h3>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">Eligibility Criteria</label>
                <button type="button" onClick={() => addItem(setEligibility, { heading: '', desc: '' })} className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                  <i className="fa-solid fa-plus mr-1"></i> Add Criteria
                </button>
              </div>
              <div className="space-y-3">
                {eligibility.map(item => (
                  <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative group">
                    <button type="button" onClick={() => removeItem(setEligibility, item.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="flex items-center mb-3 pr-10">
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold mr-3">#</span>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="Heading (e.g. Academic Requirement)" value={item.heading} onChange={e => updateItem(setEligibility, item.id, 'heading', e.target.value)} />
                    </div>
                    <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors h-16" placeholder="Subheading / Description" value={item.desc} onChange={e => updateItem(setEligibility, item.id, 'desc', e.target.value)}></textarea>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">Excluded Regions</label>
                <button type="button" onClick={() => addItem(setRegions, { heading: '', note: '' })} className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                  <i className="fa-solid fa-plus mr-1"></i> Add Region
                </button>
              </div>
              <div className="space-y-3">
                {regions.map(item => (
                  <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative group">
                    <button type="button" onClick={() => removeItem(setRegions, item.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors mb-3 pr-10" placeholder="Subheading (e.g. EU Citizens excluded)" value={item.heading} onChange={e => updateItem(setRegions, item.id, 'heading', e.target.value)} />
                    <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors h-16" placeholder="Note (Add reasons or specific details)" value={item.note} onChange={e => updateItem(setRegions, item.id, 'note', e.target.value)}></textarea>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">Documents Required</label>
                <button type="button" onClick={() => addItem(setDocuments, { name: '' })} className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                  <i className="fa-solid fa-plus mr-1"></i> Add Document
                </button>
              </div>
              <div className="space-y-2">
                {documents.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <input type="text" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="Document Name (e.g. Identity Proof)" value={item.name} onChange={e => updateItem(setDocuments, item.id, 'name', e.target.value)} />
                    <button type="button" onClick={() => removeItem(setDocuments, item.id)} className="text-red-400 hover:text-red-600 p-2.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg shrink-0">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Block 4: Timeline & Process */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 border-b pb-3">
              <i className="fa-solid fa-calendar-alt text-blue-500 mr-2"></i>Process & Timeline
            </h3>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">Scholarship Timeline</label>
                <button type="button" onClick={() => addItem(setTimeline, { date: '', heading: '', desc: '' })} className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                  <i className="fa-solid fa-plus mr-1"></i> Add Date
                </button>
              </div>
              <div className="space-y-3">
                {timeline.map(item => (
                  <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative group">
                    <button type="button" onClick={() => removeItem(setTimeline, item.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 pr-10">
                      <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors md:col-span-1" value={item.date} onChange={e => updateItem(setTimeline, item.id, 'date', e.target.value)} />
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors md:col-span-2" placeholder="Date Heading (e.g. Interview Phase)" value={item.heading} onChange={e => updateItem(setTimeline, item.id, 'heading', e.target.value)} />
                    </div>
                    <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors h-16" placeholder="Subheading / Detailed information about this phase" value={item.desc} onChange={e => updateItem(setTimeline, item.id, 'desc', e.target.value)}></textarea>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">Selection Process (Steps)</label>
                <button type="button" onClick={() => addItem(setProcesses, { step: '', desc: '' })} className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                  <i className="fa-solid fa-plus mr-1"></i> Add Step
                </button>
              </div>
              <div className="space-y-3">
                {processes.map(item => (
                  <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative group">
                    <button type="button" onClick={() => removeItem(setProcesses, item.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors mb-3 pr-10" placeholder="Step Name (e.g. Initial Screening)" value={item.step} onChange={e => updateItem(setProcesses, item.id, 'step', e.target.value)} />
                    <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors h-16" placeholder="Step Description" value={item.desc} onChange={e => updateItem(setProcesses, item.id, 'desc', e.target.value)}></textarea>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Block 5: Benefits & Application Guide */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 border-b pb-3">
              <i className="fa-solid fa-gift text-blue-500 mr-2"></i>Benefits & How to Apply
            </h3>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">Scholarship Benefits (with icons)</label>
                <button type="button" onClick={() => addItem(setBenefits, { icon: '', heading: '', sub: '' })} className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                  <i className="fa-solid fa-plus mr-1"></i> Add Benefit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map(item => (
                  <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative group">
                    <button type="button" onClick={() => removeItem(setBenefits, item.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="flex gap-2 mb-3 pr-10">
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors flex-1" placeholder="Icon (fa-book)" value={item.icon} onChange={e => updateItem(setBenefits, item.id, 'icon', e.target.value)} />
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors flex-[2]" placeholder="Benefit Heading" value={item.heading} onChange={e => updateItem(setBenefits, item.id, 'heading', e.target.value)} />
                    </div>
                    <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors h-16" placeholder="Benefit Subheading" value={item.sub} onChange={e => updateItem(setBenefits, item.id, 'sub', e.target.value)}></textarea>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">How to Apply Video Section (URL)</label>
              <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="e.g. YouTube URL" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">How to Apply (Steps)</label>
                <button type="button" onClick={() => addItem(setApplySteps, { instruction: '' })} className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                  <i className="fa-solid fa-plus mr-1"></i> Add Step
                </button>
              </div>
              <div className="space-y-2">
                {applySteps.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <input type="text" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="Instruction Step (e.g. Register on the portal)" value={item.instruction} onChange={e => updateItem(setApplySteps, item.id, 'instruction', e.target.value)} />
                    <button type="button" onClick={() => removeItem(setApplySteps, item.id)} className="text-red-400 hover:text-red-600 p-2.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg shrink-0">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">FAQ Section</label>
                <button type="button" onClick={() => addItem(setFaqs, { q: '', a: '' })} className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                  <i className="fa-solid fa-plus mr-1"></i> Add FAQ
                </button>
              </div>
              <div className="space-y-3">
                {faqs.map(item => (
                  <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative group">
                    <button type="button" onClick={() => removeItem(setFaqs, item.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-medium text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors mb-3 pr-10" placeholder="Question?" value={item.q} onChange={e => updateItem(setFaqs, item.id, 'q', e.target.value)} />
                    <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors h-16" placeholder="Answer..." value={item.a} onChange={e => updateItem(setFaqs, item.id, 'a', e.target.value)}></textarea>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 mt-8 border-t border-gray-200 pb-10">
            <button type="button" onClick={onBack} className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition shadow-sm">
              Cancel
            </button>
            <button type="button" className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition shadow-sm">
              Save Draft
            </button>
            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md flex items-center">
              <i className="fa-solid fa-paper-plane mr-2"></i> Publish Scholarship
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ScholarshipCreatePage;
