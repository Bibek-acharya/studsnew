"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import Image from "next/image";
import {
  Plus,
  MagnifyingGlass,
  PencilSimple,
  Trash,
  Calendar,
  X,
  CircleNotch,
  Image as PhosphorImage,
  Eye,
  PaperPlaneRight,
  CaretDown,
  List as ListIcon,
  Bell,
  ArrowLeft,
  MapPin,
  Clock,
  Note,
  FilePpt
} from "@phosphor-icons/react";
import SuperadminSidebar from "@/components/superadmin/dashboard/SuperadminSidebar";
import {
  fetchAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventImage,
  EventEntry
} from "@/services/eventApi";

const CATEGORIES = ["Webinar", "Workshop", "Conference", "Seminar", "Networking", "Exam", "Fair"];

const EventManagement: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [eventsList, setEventsList] = useState<EventEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [previewData, setPreviewData] = useState<EventEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [editId, setEditId] = useState<string | number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formOrganizer, setFormOrganizer] = useState("");
  const [formRegistrationFee, setFormRegistrationFee] = useState<string>("0");
  const [formImage, setFormImage] = useState("");
  const [formPublished, setFormPublished] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 50,
        category: selectedCategory === "All" ? undefined : selectedCategory,
        search: searchQuery || undefined
      };
      const result = await fetchAdminEvents(params);
      setEventsList(result.events);
    } catch (error) {
      console.error("Error loading events:", error);
      setEventsList([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadEventImage(file);
        setFormImage(url);
        showToast("Banner uploaded successfully");
      } catch {
        showToast("Upload failed", "error");
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormTitle("");
    setFormExcerpt("");
    setFormDescription("");
    setFormCategory("");
    setFormDate("");
    setFormTime("");
    setFormLocation("");
    setFormOrganizer("");
    setFormRegistrationFee("0");
    setFormImage("");
    setFormPublished(true);
  };

  const handleEdit = (event: EventEntry) => {
    setEditId(event.id);
    setFormTitle(event.title);
    setFormExcerpt(event.excerpt);
    setFormDescription(event.description);
    setFormCategory(event.category);
    setFormDate(event.date);
    setFormTime(event.time);
    setFormLocation(event.location);
    setFormOrganizer(event.organizer);
    setFormRegistrationFee(event.registrationFee);
    setFormImage(event.image);
    setFormPublished(event.published);
    setActiveTab("create");
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEvent(String(deleteId));
      showToast("Event sequence terminated");
      loadEvents();
      setDeleteId(null);
    } catch {
      showToast("Deletion failed", "error");
    }
  };

  const handleSave = async (publishedOverride?: boolean) => {
    if (!formTitle || !formCategory || !formDate || !formLocation) {
      showToast("Essential fields missing", "error");
      return;
    }

    setSaving(true);
    try {
      const data = {
        title: formTitle,
        excerpt: formExcerpt,
        description: formDescription,
        category: formCategory,
        date: formDate,
        time: formTime,
        location: formLocation,
        organizer: formOrganizer,
        registrationFee: formRegistrationFee,
        image: formImage,
        published: publishedOverride !== undefined ? publishedOverride : formPublished,
      };

      if (editId) {
        await updateEvent(String(editId), data);
        showToast("Event updated successfully");
      } else {
        await createEvent(data);
        showToast("New event established");
      }
      resetForm();
      setActiveTab("list");
      loadEvents();
    } catch {
      showToast("Saving failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[#111827] font-sans">
      <SuperadminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F9FAFB]">
        <header className="h-18 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-50 rounded-lg">
              <ListIcon size={24} />
            </button>
            <div className="hidden md:flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 w-75 gap-3 border-none ring-1 ring-gray-100 focus-within:ring-indigo-500">
              <MagnifyingGlass size={18} className="text-[#6B7280]" />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="bg-transparent outline-none w-full text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative text-[#6B7280] p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer">
              <Bell size={22} weight="regular" />
            </div>
            <div className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 pr-3 rounded-xl border border-transparent hover:border-gray-100 transition-all">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm relative">
                <Image src="https://i.pravatar.cc/150?img=12" alt="Admin" fill className="object-cover" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-bold text-gray-900">Jane Doe</span>
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest leading-loose">Super Admin</span>
              </div>
              <CaretDown size={14} className="text-[#6B7280]" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-[26px] font-extrabold text-[#111827] tracking-tight">
                {activeTab === 'list' ? "Event Management" : "Event Configuration"}
              </h1>
              <p className="text-[#6B7280] font-medium mt-1">Coordinate, manage and track campus activities.</p>
            </div>
            <div className="flex gap-3">
              {activeTab === 'list' ? (
                <button 
                  onClick={() => { resetForm(); setActiveTab('create'); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition-all shadow-lg shadow-indigo-100"
                >
                  <Plus size={20} weight="bold" /> Create Event
                </button>
              ) : (
                <button 
                  onClick={() => setActiveTab('list')}
                  className="bg-white hover:bg-gray-50 border border-[#E5E7EB] text-[#111827] px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  <ArrowLeft size={18} weight="bold" /> Back
                </button>
              )}
            </div>
          </div>

          {activeTab === "list" ? (
            <section className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-62.5">
                  <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full bg-[#F9FAFB] rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-bold outline-none cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Formats</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {loading ? (
                <div className="flex flex-col justify-center items-center py-32 gap-4">
                  <CircleNotch className="animate-spin text-indigo-600" size={40} weight="bold" />
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading itinerary...</p>
                </div>
              ) : eventsList.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-20 text-center">
                   <Calendar size={32} className="text-gray-300 mx-auto mb-4" />
                   <p className="text-xl font-bold text-gray-900 mb-2">No events scheduled</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {eventsList.map((event) => (
                    <div key={event.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                      <div className="absolute top-6 right-6 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleEdit(event)} className="w-8 h-8 bg-white/90 backdrop-blur text-[#111827] rounded-lg flex items-center justify-center hover:bg-white border border-gray-100 transition-all"><PencilSimple size={16} weight="bold" /></button>
                         <button onClick={() => setDeleteId(event.id)} className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-all"><Trash size={16} weight="bold" /></button>
                      </div>

                      <div className="aspect-video overflow-hidden rounded-xl bg-gray-50 border border-gray-100 relative">
                        <Image 
                          src={event.image || "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=800&auto=format&fit=crop"} 
                          alt="" 
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute bottom-2 left-2">
                           <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-white ${
                             event.published ? 'bg-indigo-600' : 'bg-gray-400'
                           }`}>
                            {event.published ? 'Published' : 'Draft'}
                           </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 px-1">
                        <h3 className="font-extrabold text-[17px] text-[#111827] line-clamp-1 leading-tight group-hover:text-indigo-600 transition-colors uppercase">{event.title}</h3>
                        <div className="space-y-1.5">
                           <div className="flex items-center gap-2 text-[11px] font-bold text-[#6B7280]">
                              <Calendar size={14} className="text-indigo-500" />
                              {new Date(event.date).toLocaleDateString()}
                           </div>
                           <div className="flex items-center gap-2 text-[11px] font-bold text-[#6B7280]">
                              <MapPin size={14} className="text-rose-500" />
                              <span className="line-clamp-1 italic">{event.location}</span>
                           </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                        <div className="text-[12px] font-black text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 italic">
                           {event.registrationFee === "0" ? "FREE" : `Rs. ${event.registrationFee}`}
                        </div>
                        <button onClick={() => setPreviewData(event)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"><Eye size={20} weight="bold" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section className="animate-in fade-in duration-700 pb-20">
              <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
                <div className="space-y-6">
                  <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-2 font-black text-[#111827] border-b-2 border-indigo-600 pb-4 mb-10 w-fit text-[11px] uppercase tracking-widest leading-loose">
                       <FilePpt size={20} weight="bold" /> Event Details
                    </div>

                    <div className="space-y-8">
                      <div className="group">
                        <label className="block text-xs font-black uppercase tracking-widest mb-3 text-gray-500 italic">Event Title <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Event Title..." 
                          className="w-full bg-[#F9FAFB] border border-transparent rounded-2xl px-6 py-5 text-xl font-bold text-[#111827] outline-none focus:bg-white focus:border-indigo-600 shadow-sm transition-all italic"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2.5 text-gray-500 italic">Category</label>
                            <select 
                              className="w-full bg-[#F9FAFB] border border-transparent rounded-xl px-4 py-3 text-xs font-bold text-[#111827] outline-none cursor-pointer"
                              value={formCategory}
                              onChange={(e) => setFormCategory(e.target.value)}
                            >
                              <option value="" disabled>Select Format</option>
                              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                         </div>
                         <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2.5 text-gray-500 italic">Organizer</label>
                            <input 
                              type="text" 
                              placeholder="Host Info" 
                              className="w-full bg-[#F9FAFB] border-none rounded-xl px-4 py-3 text-xs font-bold text-[#111827] outline-none ring-1 ring-gray-100 italic"
                              value={formOrganizer}
                              onChange={(e) => setFormOrganizer(e.target.value)}
                            />
                         </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest mb-3 text-gray-500 italic">Short Excerpt</label>
                        <textarea 
                          className="w-full bg-[#F9FAFB] border-none rounded-2xl px-4 py-3 text-sm font-medium outline-none ring-1 ring-gray-100 focus:ring-indigo-600 focus:bg-white transition-all min-h-20"
                          value={formExcerpt}
                          onChange={(e) => setFormExcerpt(e.target.value)}
                        />
                      </div>

                      <div className="group">
                        <label className="block text-xs font-black uppercase tracking-widest mb-3 text-gray-500 italic">Description <span className="text-rose-500">*</span></label>
                        <div className="border border-gray-100 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                           <ReactQuill
                            theme="snow"
                            value={formDescription}
                            onChange={setFormDescription}
                            placeholder="State the purpose and details..."
                            className="bg-white min-h-80"
                            modules={{ toolbar: [ ['bold', 'italic'], [{ 'list': 'ordered'}, { 'list': 'bullet' }] ] }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border border-[#E5E7EB] rounded-3xl p-7 shadow-sm">
                    <div className="flex items-center gap-2 font-black text-[#111827] mb-8 pb-4 border-b border-gray-50 text-[10px] uppercase tracking-widest leading-loose">
                       <Clock size={18} weight="bold" className="text-indigo-600" /> Logistics
                    </div>
                    
                    <div className="space-y-6">
                       <div className="space-y-4">
                          <div>
                            <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5 text-gray-400 italic">Date</label>
                            <input 
                              type="date" 
                              className="w-full bg-[#F9FAFB] border-none rounded-xl px-4 py-3 text-xs font-bold text-[#111827] outline-none ring-1 ring-gray-100 shadow-sm"
                              value={formDate}
                              onChange={(e) => setFormDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5 text-gray-400 italic">Time</label>
                            <input 
                              type="time" 
                              className="w-full bg-[#F9FAFB] border-none rounded-xl px-4 py-3 text-xs font-bold text-[#111827] outline-none ring-1 ring-gray-100 shadow-sm"
                              value={formTime}
                              onChange={(e) => setFormTime(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5 text-gray-400 italic">Location</label>
                            <input 
                              type="text" 
                              placeholder="Hall B / Virtual" 
                              className="w-full bg-[#F9FAFB] border-none rounded-xl px-4 py-3 text-xs font-bold text-[#111827] outline-none ring-1 ring-gray-100 shadow-sm italic"
                              value={formLocation}
                              onChange={(e) => setFormLocation(e.target.value)}
                            />
                          </div>
                       </div>

                       <div className="pt-4 border-t border-gray-50">
                          <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5 text-gray-400 italic">Fee (NPR)</label>
                          <input 
                            type="text" 
                            className="w-full bg-[#F9FAFB] border-none rounded-xl px-4 py-3 text-sm font-black text-[#111827] outline-none ring-1 ring-gray-100 shadow-sm italic"
                            value={formRegistrationFee}
                            onChange={(e) => setFormRegistrationFee(e.target.value)}
                          />
                       </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-4xl p-6 text-white space-y-4 shadow-2xl">
                     <div className="flex items-center justify-between" onClick={() => setFormPublished(!formPublished)}>
                        <span className="text-[10px] font-black uppercase tracking-widest leading-loose">Status: {formPublished ? 'Live' : 'Draft'}</span>
                        <div className={`w-10 h-5 rounded-full transition-colors ${formPublished ? 'bg-indigo-600' : 'bg-white/10'} relative cursor-pointer`}>
                           <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formPublished ? 'left-6' : 'left-1'}`}></div>
                        </div>
                     </div>
                     <button onClick={() => handleSave()} disabled={saving} className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest leading-loose text-[11px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        {saving ? <CircleNotch className="animate-spin" size={20} weight="bold" /> : <PaperPlaneRight size={20} weight="fill" />}
                        {editId ? "Update" : "Publish"}
                     </button>
                  </div>

                  <div className="bg-white border border-[#E5E7EB] rounded-3xl p-7 shadow-sm">
                    <div className="flex items-center gap-2 font-black text-[#111827] mb-6 text-[10px] uppercase tracking-widest leading-loose">
                       <PhosphorImage size={18} weight="bold" className="text-indigo-600" /> Event Image
                    </div>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative h-48 bg-[#F9FAFB] border-2 border-dashed border-gray-200 rounded-4xl flex items-center justify-center transition-all hover:bg-white hover:border-indigo-400 cursor-pointer overflow-hidden shadow-inner group"
                    >
                      {formImage ? (
                        <>
                          <Image src={formImage} alt="" fill className="object-cover transition-transform group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gray-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                              <p className="text-white text-[10px] font-black uppercase tracking-widest leading-loose italic">Change Banner</p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6 text-gray-400 uppercase">
                          <Plus size={24} className="mx-auto" />
                          <p className="text-[10px] font-black uppercase tracking-widest mt-4 leading-loose italic">Upload Postcard</p>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                  </div>
                </div>
              </form>
            </section>
          )}
        </main>
      </div>

      {previewData && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl" onClick={() => setPreviewData(null)} />
          <div className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-4xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500">
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="relative h-120">
                   <div className="absolute inset-0 z-0">
                      <Image src={previewData.image || "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=800&auto=format&fit=crop"} alt="" fill className="object-cover" />
                   </div>
                   <div className="absolute inset-0 bg-linear-to-t from-white via-white/20 to-transparent z-10"></div>
                   <div className="absolute top-8 right-8 z-50">
                     <button onClick={() => setPreviewData(null)} className="p-4 bg-white/20 backdrop-blur-xl hover:bg-white text-white hover:text-gray-900 rounded-full shadow-2xl transition-all"><X size={20} weight="bold" /></button>
                   </div>
                   <div className="absolute bottom-12 left-12 right-12 z-20">
                      <h1 className="text-5xl font-black text-[#111827] tracking-tighter uppercase italic">{previewData.title}</h1>
                   </div>
                </div>

                <div className="px-12 py-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
                   <div>
                      <h2 className="text-[10px] font-black uppercase tracking-[4px] text-indigo-400 mb-8 flex items-center gap-3 italic">
                         <Note size={20} weight="bold" /> Itinerary
                      </h2>
                      <div className="prose prose-indigo prose-xl max-w-none text-gray-800 leading-loose font-semibold italic opacity-90" dangerouslySetInnerHTML={{ __html: previewData.description }} />
                   </div>

                   <div className="space-y-8">
                      <div className="bg-[#F9FAFB] rounded-4xl p-10 border border-gray-100 shadow-inner">
                         <div className="space-y-8">
                            <div className="flex items-center gap-6">
                               <Calendar size={28} weight="duotone" className="text-indigo-600" />
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase text-gray-400 italic">Date</span>
                                  <span className="text-lg font-black">{new Date(previewData.date).toLocaleDateString()}</span>
                               </div>
                            </div>
                            <div className="flex items-center gap-6">
                               <MapPin size={28} weight="duotone" className="text-rose-600" />
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase text-gray-400 italic">Venue</span>
                                  <span className="text-lg font-black italic">{previewData.location}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-3xl" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-4xl p-12 text-center animate-in zoom-in-95 duration-400 shadow-2xl">
            <Trash size={48} weight="fill" className="text-rose-500 mx-auto mb-8" />
            <h2 className="text-2xl font-black text-[#111827] mb-4 uppercase tracking-tighter italic">Abort Project?</h2>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest leading-loose text-[#6B7280] bg-gray-50 rounded-2xl shadow-sm italic">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest leading-loose text-white bg-rose-500 rounded-2xl shadow-xl active:scale-95 italic">Purge</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-10 right-10 z-200 flex items-center gap-5 px-8 py-5 rounded-4xl text-white shadow-2xl animate-in slide-in-from-right-10 duration-500 border-2 border-white/20 backdrop-blur-lg ${toast.type === 'success' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}>
          <div className="flex flex-col">
            <span className="font-black text-xs uppercase tracking-widest leading-loose italic">{toast.type === 'success' ? 'Report' : 'Alert'}</span>
            <span className="font-bold text-sm italic">{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="ml-6 p-1.5"><X size={16} weight="bold" /></button>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.01em; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .ql-container.ql-snow { border: none !important; }
        .ql-editor { padding: 40px !important; min-height: 320px !important; font-size: 1.125rem !important; line-height: 2 !important; font-family: 'Plus Jakarta Sans', sans-serif !important; }
      `}</style>
    </div>
  );
};

export default EventManagement;
