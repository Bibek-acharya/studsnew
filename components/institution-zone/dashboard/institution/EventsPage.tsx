"use client";
import React, { useState } from "react";
import { Plus, Trash2, CheckCircle, BookOpen, CalendarDays, FileText, Image, Users, Mic } from "lucide-react";

interface HighlightRow { id: number; value: string; }
interface AudienceRow { id: number; value: string; }
interface ScheduleRow { id: number; time: string; activity: string; }

const mkHighlight = (id: number): HighlightRow => ({ id, value: "" });
const mkAudience = (id: number): AudienceRow => ({ id, value: "" });
const mkSchedule = (id: number): ScheduleRow => ({ id, time: "", activity: "" });
const nextId = (arr: { id: number }[]) => Math.max(0, ...arr.map(a => a.id)) + 1;

const SectionCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
      <span className="text-blue-600">{icon}</span>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const EventsPage: React.FC = () => {
  /* Section 1 */
  const [title, setTitle] = useState("");
  const [subheading, setSubheading] = useState("");
  const [eventType, setEventType] = useState("Workshop");
  const [college, setCollege] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [ticketPrice, setTicketPrice] = useState("");

  /* Section 2 */
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState("");

  /* Section 3 */
  const [shortDesc, setShortDesc] = useState("");
  const [detailedDesc, setDetailedDesc] = useState("");

  /* Section 4 */
  const [registerLink, setRegisterLink] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  /* Section 5 */
  const [highlights, setHighlights] = useState<HighlightRow[]>([mkHighlight(1)]);
  const [audience, setAudience] = useState<AudienceRow[]>([mkAudience(1)]);
  const [schedule, setSchedule] = useState<ScheduleRow[]>([mkSchedule(1)]);

  /* Section 6 */
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");

  const [saved, setSaved] = useState(false);
  const handlePublish = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const EVENT_TYPES = ["Workshop", "Seminar", "Conference", "Webinar", "Career Fair", "Open Day", "Cultural Event", "Sports Event", "Other"];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[900px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create Event</h1>
        <p className="text-slate-500 text-sm mt-1">Publish an event to engage students and the campus community.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium">
          <CheckCircle className="w-5 h-5 text-green-600" /> Event published successfully!
        </div>
      )}

      {/* Section 1: Basic Info */}
      <SectionCard icon={<BookOpen className="w-5 h-5" />} title="Basic Information">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Title <span className="text-red-500">*</span></label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Annual Tech Summit 2024" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subheading / Tagline</label>
            <input value={subheading} onChange={e => setSubheading(e.target.value)} placeholder="e.g. Explore, Innovate, Inspire" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
              <select value={eventType} onChange={e => setEventType(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organizing College</label>
              <input value={college} onChange={e => setCollege(e.target.value)} placeholder="College name" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ticket / Registration</label>
            <div className="flex gap-3">
              <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${isFree ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                <input type="radio" checked={isFree} onChange={() => setIsFree(true)} className="hidden" /> Free
              </label>
              <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${!isFree ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                <input type="radio" checked={!isFree} onChange={() => setIsFree(false)} className="hidden" /> Paid
              </label>
              {!isFree && (
                <input value={ticketPrice} onChange={e => setTicketPrice(e.target.value)} placeholder="Price (NPR)" className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-36" />
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 2: Date / Time / Venue */}
      <SectionCard icon={<CalendarDays className="w-5 h-5" />} title="Date, Time & Venue">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Venue / Location</label>
            <input value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. Main Auditorium, Block A" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Expected Capacity</label>
            <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="e.g. 500" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </SectionCard>

      {/* Section 3: Descriptions */}
      <SectionCard icon={<FileText className="w-5 h-5" />} title="Event Description">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
            <textarea rows={2} value={shortDesc} onChange={e => setShortDesc(e.target.value)} placeholder="A brief summary for listing cards (max 200 chars)" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
            <textarea rows={5} value={detailedDesc} onChange={e => setDetailedDesc(e.target.value)} placeholder="Full event description with all details..." className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
          </div>
        </div>
      </SectionCard>

      {/* Section 4: Media & Links */}
      <SectionCard icon={<Image className="w-5 h-5" />} title="Media & Links">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Registration Link</label>
            <input value={registerLink} onChange={e => setRegisterLink(e.target.value)} placeholder="https://forms.google.com/..." className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Cover Image</label>
              <label className="block w-full h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer overflow-hidden flex items-center justify-center transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setImagePreview(URL.createObjectURL(f)); }} />
                {imagePreview ? <img src={imagePreview} alt="Event" className="w-full h-full object-cover" /> : (
                  <div className="text-center text-slate-400 text-xs"><Image className="w-7 h-7 mx-auto mb-1" />Upload Image</div>
                )}
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Poster</label>
              <label className="block w-full h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer overflow-hidden flex items-center justify-center transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setPosterPreview(URL.createObjectURL(f)); }} />
                {posterPreview ? <img src={posterPreview} alt="Poster" className="w-full h-full object-cover" /> : (
                  <div className="text-center text-slate-400 text-xs"><Image className="w-7 h-7 mx-auto mb-1" />Upload Poster</div>
                )}
              </label>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 5: Structure */}
      <SectionCard icon={<Mic className="w-5 h-5" />} title="Event Structure">
        <div className="space-y-8">
          {/* Key Highlights */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-slate-800">Key Highlights</h4>
              <button onClick={() => setHighlights(prev => [...prev, mkHighlight(nextId(prev))])} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"><Plus className="w-3.5 h-3.5" /> Add</button>
            </div>
            <div className="space-y-2">
              {highlights.map(h => (
                <div key={h.id} className="flex gap-2 items-center">
                  <input value={h.value} onChange={e => setHighlights(prev => prev.map(x => x.id === h.id ? { ...x, value: e.target.value } : x))} placeholder="e.g. Live Q&A with Industry Experts" className="flex-1 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  <button onClick={() => setHighlights(prev => prev.filter(x => x.id !== h.id))} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Who Should Attend */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-slate-800">Who Should Attend</h4>
              <button onClick={() => setAudience(prev => [...prev, mkAudience(nextId(prev))])} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"><Plus className="w-3.5 h-3.5" /> Add</button>
            </div>
            <div className="space-y-2">
              {audience.map(a => (
                <div key={a.id} className="flex gap-2 items-center">
                  <input value={a.value} onChange={e => setAudience(prev => prev.map(x => x.id === a.id ? { ...x, value: e.target.value } : x))} placeholder="e.g. Final year engineering students" className="flex-1 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  <button onClick={() => setAudience(prev => prev.filter(x => x.id !== a.id))} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-slate-800">Event Schedule</h4>
              <button onClick={() => setSchedule(prev => [...prev, mkSchedule(nextId(prev))])} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"><Plus className="w-3.5 h-3.5" /> Add</button>
            </div>
            <div className="space-y-2">
              {schedule.map(s => (
                <div key={s.id} className="flex gap-2 items-center">
                  <input type="time" value={s.time} onChange={e => setSchedule(prev => prev.map(x => x.id === s.id ? { ...x, time: e.target.value } : x))} className="w-32 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  <input value={s.activity} onChange={e => setSchedule(prev => prev.map(x => x.id === s.id ? { ...x, activity: e.target.value } : x))} placeholder="e.g. Opening Ceremony" className="flex-1 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  <button onClick={() => setSchedule(prev => prev.filter(x => x.id !== s.id))} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 6: Organizer */}
      <SectionCard icon={<Users className="w-5 h-5" />} title="Organizer Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Organizer Name</label>
            <input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="e.g. KIST College of Technology" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
            <input type="email" value={orgEmail} onChange={e => setOrgEmail(e.target.value)} placeholder="events@college.edu.np" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input type="tel" value={orgPhone} onChange={e => setOrgPhone(e.target.value)} placeholder="+977-01-XXXXXXX" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
            <input value={orgWebsite} onChange={e => setOrgWebsite(e.target.value)} placeholder="https://college.edu.np/events" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </SectionCard>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 -mx-4 lg:-mx-8 px-4 lg:px-8 py-4 flex justify-end gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <button className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">Cancel</button>
        <button className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">Save as Draft</button>
        <button
          onClick={handlePublish}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Save & Publish
        </button>
      </div>
    </div>
  );
};

export default EventsPage;
