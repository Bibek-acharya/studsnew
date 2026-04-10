"use client";
import React, { useState, useRef, useCallback } from "react";
import { Upload, Plus, Trash2, Building2, BookOpen, Users, Phone, GraduationCap, Image, Download, CheckCircle, X, Pencil } from "lucide-react";

/* ─── Shared Types ───────────────────────────────────────────────── */
interface CourseRow { id: number; name: string; duration: string; fees: string; eligibility: string; seats: string; }
interface AlumniItem { id: number; name: string; position: string; company: string; batch: string; }
interface FacilityItem { id: number; heading: string; desc: string; }
interface DocItem { id: number; title: string; size: string; type: string; }
interface GalleryItem { id: number; url: string; }

const mkId = (arr: { id: number }[]) => Math.max(0, ...arr.map(i => i.id)) + 1;

/* ─── Section Wrapper ────────────────────────────────────────────── */
const Section = ({ icon, title, children, action }: { icon: React.ReactNode; title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
      <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
        <span className="text-blue-600">{icon}</span> {title}
      </h3>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const CollegeProfilePage: React.FC = () => {
  /* ─── General Info ─── */
  const coverRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");

  /* ─── About ─── */
  const [chairmanVideo, setChairmanVideo] = useState("");
  const [tourVideo, setTourVideo] = useState("");
  const [about, setAbout] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");

  /* ─── Overview ─── */
  const [estYear, setEstYear] = useState("");
  const [location, setLocation] = useState("");
  const [campusSize, setCampusSize] = useState("");
  const [instType, setInstType] = useState("");
  const [instStatus, setInstStatus] = useState("");
  const [ranking, setRanking] = useState("");
  const [director, setDirector] = useState("");
  const [principal, setPrincipal] = useState("");
  const [admHead, setAdmHead] = useState("");

  /* ─── Contact ─── */
  const [fullAddress, setFullAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [officialSite, setOfficialSite] = useState("");
  const [mapsLink, setMapsLink] = useState("");

  /* ─── Courses tabs ─── */
  const [courseTab, setCourseTab] = useState<"+2" | "Bachelor" | "Master">("+2");
  const defaultCourses: Record<string, CourseRow[]> = {
    "+2": [{ id: 1, name: "Science (+2)", duration: "2 Years", fees: "NPR 2,000/yr", eligibility: "Min 60% Grade 10", seats: "120" }],
    "Bachelor": [], "Master": [],
  };
  const [courses, setCourses] = useState(defaultCourses);

  /* ─── Facilities ─── */
  const [facilities, setFacilities] = useState<FacilityItem[]>([
    { id: 1, heading: "State-of-the-art Laboratories", desc: "Equipped with the latest technology for practical learning." },
    { id: 2, heading: "Sports Complex", desc: "Includes an indoor stadium, swimming pool, and athletic track." },
  ]);
  const [facilityHeading, setFacilityHeading] = useState("");
  const [facilityDesc, setFacilityDesc] = useState("");

  /* ─── Alumni ─── */
  const [alumni, setAlumni] = useState<AlumniItem[]>([
    { id: 1, name: "Jane Smith", position: "Data Scientist", company: "Meta", batch: "2019" },
  ]);
  const [alumniForm, setAlumniForm] = useState({ name: "", position: "", company: "", batch: "" });

  /* ─── Gallery ─── */
  const [gallery, setGallery] = useState<GalleryItem[]>([
    { id: 1, url: "https://images.unsplash.com/photo-1562774053-701939374585?w=300&q=80" },
    { id: 2, url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&q=80" },
  ]);

  /* ─── Documents ─── */
  const [docs, setDocs] = useState<DocItem[]>([
    { id: 1, title: "College Prospectus 2024", size: "2.4 MB", type: "PDF" },
    { id: 2, title: "Admission Form", size: "840 KB", type: "DOCX" },
  ]);
  const [docTitle, setDocTitle] = useState("");

  /* ─── Saved ─── */
  const [saved, setSaved] = useState(false);

  /* ─── Progress calculation ─── */
  const fields = [collegeName, address, website, about, mission, vision, estYear, location, campusSize, instType, instStatus, ranking, director, principal, admHead, fullAddress, phone, email, officialSite, mapsLink, chairmanVideo, tourVideo];
  const filled = fields.filter(f => f.trim() !== "").length;
  const progress = Math.round((filled / fields.length) * 100);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const addAlumni = () => {
    if (!alumniForm.name.trim()) return;
    setAlumni(prev => [...prev, { ...alumniForm, id: mkId(prev) }]);
    setAlumniForm({ name: "", position: "", company: "", batch: "" });
  };

  const addFacility = () => {
    if (!facilityHeading.trim()) return;
    setFacilities(prev => [...prev, { id: mkId(prev), heading: facilityHeading, desc: facilityDesc }]);
    setFacilityHeading(""); setFacilityDesc("");
  };

  const addCourseRow = () => {
    const empty: CourseRow = { id: mkId(courses[courseTab]), name: "", duration: "", fees: "", eligibility: "", seats: "" };
    setCourses(prev => ({ ...prev, [courseTab]: [...prev[courseTab], empty] }));
  };

  const updateCourse = (id: number, key: keyof CourseRow, val: string) => {
    setCourses(prev => ({ ...prev, [courseTab]: prev[courseTab].map(c => c.id === id ? { ...c, [key]: val } : c) }));
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.map((f, i) => ({ id: Date.now() + i, url: URL.createObjectURL(f) }));
    setGallery(prev => [...prev, ...newItems]);
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Complete College Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Fill out all sections to maximize visibility on Studsphere.</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-slate-700">Profile Completion</span>
            <span className={`font-bold ${progress === 100 ? "text-green-600" : "text-blue-600"}`}>{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${progress === 100 ? "bg-green-500" : "bg-blue-600"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {progress === 100 && (
          <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold whitespace-nowrap">
            <CheckCircle className="w-4 h-4" /> Complete!
          </div>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium mb-6">
          <CheckCircle className="w-5 h-5 text-green-600" /> Profile saved successfully!
        </div>
      )}

      {/* Section 1: General Info */}
      <Section icon={<Building2 className="w-5 h-5" />} title="General Information">
        <div className="space-y-5">
          {/* Cover + Logo */}
          <div className="relative">
            <div
              onClick={() => coverRef.current?.click()}
              className="w-full h-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center justify-center overflow-hidden transition-colors"
            >
              {coverUrl ? <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" /> : (
                <div className="text-center text-slate-400">
                  <Upload className="w-8 h-8 mx-auto mb-1" />
                  <span className="text-sm">Upload Cover Photo</span>
                </div>
              )}
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageChange(e, setCoverUrl)} />
            <div
              onClick={() => logoRef.current?.click()}
              className="absolute bottom-0 translate-y-1/2 left-6 w-20 h-20 rounded-xl border-4 border-white shadow-md bg-white cursor-pointer overflow-hidden flex items-center justify-center"
            >
              {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" /> : (
                <div className="text-center text-slate-400">
                  <Image className="w-7 h-7 mx-auto" />
                  <span className="text-xs">Logo</span>
                </div>
              )}
            </div>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageChange(e, setLogoUrl)} />
          </div>
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">College Name <span className="text-red-500">*</span></label>
              <input value={collegeName} onChange={e => setCollegeName(e.target.value)} placeholder="e.g. KIST College of Technology" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="City, District" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://www.college.edu.np" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>
      </Section>

      {/* Section 2: About */}
      <Section icon={<BookOpen className="w-5 h-5" />} title="About Section">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chairman's Message Video Link</label>
              <input value={chairmanVideo} onChange={e => setChairmanVideo(e.target.value)} placeholder="https://youtube.com/..." className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">College Tour Video Link</label>
              <input value={tourVideo} onChange={e => setTourVideo(e.target.value)} placeholder="https://youtube.com/..." className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">About the College</label>
            <textarea rows={4} value={about} onChange={e => setAbout(e.target.value)} placeholder="Write a detailed description of your college..." className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mission</label>
              <textarea rows={3} value={mission} onChange={e => setMission(e.target.value)} placeholder="Our mission is..." className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vision</label>
              <textarea rows={3} value={vision} onChange={e => setVision(e.target.value)} placeholder="Our vision is..." className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>
          </div>
        </div>
      </Section>

      {/* Section 3: Overview & Leadership */}
      <Section icon={<Building2 className="w-5 h-5" />} title="College Overview & Leadership">
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Overview Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Established Year", value: estYear, setter: setEstYear, placeholder: "e.g. 1995" },
                { label: "Location", value: location, setter: setLocation, placeholder: "City, State" },
                { label: "Campus Size", value: campusSize, setter: setCampusSize, placeholder: "e.g. 50 Acres" },
                { label: "Ranking / Grade", value: ranking, setter: setRanking, placeholder: "e.g. NAAC A++, NIRF 50" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                  <input value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Institution Type</label>
                <select value={instType} onChange={e => setInstType(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">Select type</option>
                  <option>Public</option><option>Private</option><option>Autonomous</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={instStatus} onChange={e => setInstStatus(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">Select status</option>
                  <option>Affiliated</option><option>Deemed University</option><option>Autonomous</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Leadership & Administration</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "College Director", value: director, setter: setDirector, placeholder: "Name of Director" },
                { label: "Principal", value: principal, setter: setPrincipal, placeholder: "Name of Principal" },
                { label: "Admission Head", value: admHead, setter: setAdmHead, placeholder: "Name of Admission Head" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                  <input value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 4: Contact */}
      <Section icon={<Phone className="w-5 h-5" />} title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Communication Address</label>
            <input value={fullAddress} onChange={e => setFullAddress(e.target.value)} placeholder="Street, Building, Landmark, City, State, ZIP" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+977-01-XXXXXXX" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admissions@college.edu.np" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Official Website</label>
            <div className="flex rounded-lg overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500">
              <span className="px-3 bg-slate-50 text-slate-500 text-sm flex items-center border-r border-slate-200">https://</span>
              <input value={officialSite} onChange={e => setOfficialSite(e.target.value)} placeholder="www.college.edu.np" className="flex-1 p-2.5 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Google Maps Link</label>
            <input value={mapsLink} onChange={e => setMapsLink(e.target.value)} placeholder="https://maps.google.com/..." className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </Section>

      {/* Section 5: Courses & Fees */}
      <Section icon={<BookOpen className="w-5 h-5" />} title="Courses & Fees" action={
        <button onClick={addCourseRow} className="text-xs bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Course
        </button>
      }>
        <div className="flex gap-1 border-b border-slate-200 mb-5 overflow-x-auto">
          {(["+2", "Bachelor", "Master"] as const).map(tab => (
            <button key={tab} onClick={() => setCourseTab(tab)} className={`px-4 py-2.5 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${courseTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>{tab === "+2" ? "+2 (High School)" : tab + "'s Degree"}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          {courses[courseTab].length === 0 ? (
            <p className="text-center text-slate-400 py-8 text-sm">No courses added for this level yet. Click "Add Course" to begin.</p>
          ) : (
            <table className="w-full text-left min-w-[700px] border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>{["Course Name","Duration","Fees","Eligibility","Seats",""].map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses[courseTab].map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    {(["name","duration","fees","eligibility","seats"] as (keyof CourseRow)[]).map(k => (
                      <td key={k} className="px-4 py-2">
                        <input value={c[k]} onChange={e => updateCourse(c.id, k, e.target.value)} className="w-full border-0 border-b border-slate-200 focus:border-blue-400 p-1 text-sm outline-none bg-transparent" />
                      </td>
                    ))}
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => setCourses(prev => ({ ...prev, [courseTab]: prev[courseTab].filter(r => r.id !== c.id) }))} className="text-red-400 hover:text-red-600 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Section>

      {/* Section 6: Facilities */}
      <Section icon={<Building2 className="w-5 h-5" />} title="College Facilities">
        <div className="flex flex-col sm:flex-row gap-3 mb-5 pb-5 border-b border-slate-100">
          <input value={facilityHeading} onChange={e => setFacilityHeading(e.target.value)} placeholder="Facility Heading (e.g. Modern Library)" className="flex-1 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          <input value={facilityDesc} onChange={e => setFacilityDesc(e.target.value)} placeholder="Short Description" className="flex-1 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          <button onClick={addFacility} className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium whitespace-nowrap">Add Facility</button>
        </div>
        <div className="space-y-3">
          {facilities.map(f => (
            <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{f.heading}</h4>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
              <button onClick={() => setFacilities(prev => prev.filter(x => x.id !== f.id))} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 7: Notable Alumni */}
      <Section icon={<Users className="w-5 h-5" />} title="Notable Alumni">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5 pb-5 border-b border-slate-100 items-end">
          {[
            { label: "Name", value: alumniForm.name, key: "name" as const, placeholder: "Full Name" },
            { label: "Position", value: alumniForm.position, key: "position" as const, placeholder: "Software Engineer" },
            { label: "Company", value: alumniForm.company, key: "company" as const, placeholder: "Google" },
            { label: "Batch", value: alumniForm.batch, key: "batch" as const, placeholder: "2019" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
              <input value={f.value} onChange={e => setAlumniForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          ))}
          <button onClick={addAlumni} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium">Add Alumni</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {alumni.map(a => (
            <div key={a.id} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
              <button onClick={() => setAlumni(prev => prev.filter(x => x.id !== a.id))} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                {a.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{a.name}</h4>
                <p className="text-xs text-slate-500">{a.position} at {a.company}</p>
                <p className="text-xs text-blue-600 font-medium mt-0.5">Batch of {a.batch}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 8: Gallery */}
      <Section icon={<Image className="w-5 h-5" />} title="Campus Gallery">
        <label className="block w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 cursor-pointer mb-5 transition-colors">
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} />
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-600 font-medium">Click to upload or drag & drop images</p>
          <p className="text-sm text-slate-400 mt-1">PNG, JPG, up to 5MB each</p>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {gallery.map(g => (
            <div key={g.id} className="relative group rounded-xl overflow-hidden aspect-square bg-slate-200">
              <img src={g.url} alt="Gallery" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => setGallery(prev => prev.filter(x => x.id !== g.id))} className="text-white hover:text-red-400">
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 9: Downloads */}
      <Section icon={<Download className="w-5 h-5" />} title="Downloads / Resources">
        <div className="flex flex-col sm:flex-row gap-3 mb-5 pb-5 border-b border-slate-100 items-center">
          <input value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="Document Title (e.g. Academic Calendar 2024)" className="flex-1 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          <label className="flex-1 w-full border border-slate-200 rounded-lg p-2.5 text-sm text-slate-500 cursor-pointer hover:bg-slate-50 text-center">
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
            Choose file (PDF, DOC)
          </label>
          <button
            onClick={() => { if (docTitle.trim()) { setDocs(prev => [...prev, { id: mkId(prev), title: docTitle, size: "—", type: "PDF" }]); setDocTitle(""); } }}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium whitespace-nowrap"
          >Upload</button>
        </div>
        <ul className="divide-y divide-slate-100">
          {docs.map(d => (
            <li key={d.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded flex items-center justify-center text-sm font-bold ${d.type === "PDF" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}>
                  {d.type}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{d.title}</p>
                  <p className="text-xs text-slate-400">{d.size} • {d.type}</p>
                </div>
              </div>
              <button onClick={() => setDocs(prev => prev.filter(x => x.id !== d.id))} className="text-slate-400 hover:text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
            </li>
          ))}
        </ul>
      </Section>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pb-8">
        <button className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">Cancel</button>
        <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Save Profile
        </button>
      </div>
    </div>
  );
};

export default CollegeProfilePage;
