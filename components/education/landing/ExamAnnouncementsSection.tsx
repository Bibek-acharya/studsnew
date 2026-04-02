"use client";

import { BadgeCheck, MapPin, Award, ExternalLink, Heart, Clock, GraduationCap, Users, Bell, Send, PlayCircle, Flame, Monitor, Globe, TrendingUp, Building, BadgeCheckIcon } from "lucide-react";

interface ExamAnnouncementsSectionProps {
  onNavigate: (view: string, data?: any) => void;
}

const exams = [
  {
    id: 1,
    institution: "Kist College",
    verified: true,
    location: "Kathmandu",
    affiliation: "NEB Affiliated",
    website: "kist.edu.np",
    logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    title: "+2 Science Entrance Exam",
    tags: [
      { text: "Limited Seats", icon: <Flame className="w-3 h-3" />, type: "alert" },
      { text: "Online", icon: <Monitor className="w-3 h-3" />, type: "default" },
      { text: "National", icon: <Globe className="w-3 h-3" />, type: "default" }
    ],
    deadline: "04 Jan 2026",
    eligibility: "SEE Passed (Min 2.0 GPA)",
    whatsapp: "#",
    viber: "#"
  },
  {
    id: 2,
    institution: "St. Xavier's College",
    verified: true,
    location: "Maitighar",
    affiliation: "NEB Affiliated",
    website: "sxc.edu.np",
    logo: "https://placehold.co/64x64/1e3a8a/ffffff?text=SXC",
    title: "+2 Science Entrance Exam",
    tags: [
      { text: "High Demand", icon: <TrendingUp className="w-3 h-3" />, type: "warning" },
      { text: "In-Person", icon: <Building className="w-3 h-3" />, type: "default" }
    ],
    deadline: "10 Jul 2026",
    eligibility: "SEE Passed (Min 3.6 GPA)",
    whatsapp: "#",
    viber: "#"
  },
  {
    id: 3,
    institution: "Trinity Int'l College",
    verified: true,
    location: "Dillibazar",
    affiliation: "NEB Affiliated",
    website: "trinity.edu.np",
    logo: "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg",
    title: "A-Level Entrance 2026",
    tags: [
      { text: "Scholarships", icon: <Award className="w-3 h-3" />, type: "success" },
      { text: "Hybrid", icon: <Monitor className="w-3 h-3" />, type: "default" }
    ],
    deadline: "25 Aug 2026",
    eligibility: "SEE Passed (Min 2.8 GPA)",
    whatsapp: "#",
    viber: "#"
  },
  {
    id: 4,
    institution: "Little Angels' College",
    verified: true,
    location: "Hattiban",
    affiliation: "NEB Affiliated",
    website: "lac.edu.np",
    logo: "https://placehold.co/64x64/dc2626/ffffff?text=LAC",
    title: "+2 Management Entrance",
    tags: [
      { text: "Applications Open", icon: <BadgeCheck className="w-3 h-3" />, type: "purple" }
    ],
    deadline: "15 Sep 2026",
    eligibility: "SEE Passed (Min 2.4 GPA)",
    whatsapp: "#",
    viber: "#"
  }
];

const ExamAnnouncementsSection: React.FC<ExamAnnouncementsSectionProps> = ({ onNavigate }) => {
  return (
    <section className="mt-24 w-full">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* New Heading and Subheading */}
        <div className="text-center mb-12">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#111827] mb-3 tracking-tight">
            Find All Exam Announcements Easily.
          </h2>
          <p className="text-[17px] text-[#6b7280] max-w-3xl mx-auto leading-relaxed">
            Discover institutions that match your academic profile and preferences.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exams.map((exam) => (
            <article key={exam.id} className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all duration-300">
              <header className="flex justify-between items-start mb-5">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center p-1 bg-white shadow-sm shrink-0">
                    <img src={exam.logo} alt={exam.institution} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-[15px] font-bold text-[#111827] flex items-center gap-1.5 truncate">
                      {exam.institution}
                      {exam.verified && <BadgeCheckIcon className="w-[15px] h-[15px] text-white fill-blue-500 ml-1" />}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-[#6b7280] mt-0.5">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exam.location}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {exam.affiliation}</span>
                    </div>
                    <a href="#" className="text-[#2563eb] text-[11px] font-medium mt-1 flex items-center gap-1 hover:underline">
                      <ExternalLink className="w-3 h-3" /> {exam.website}
                    </a>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-all">
                  <Heart className="w-5 h-5" />
                </button>
              </header>

              <main className="flex-grow">
                <h4 className="text-[17px] font-bold text-[#111827] mb-3 leading-tight">{exam.title}</h4>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {exam.tags.map((tag, tIdx) => (
                    <span key={tIdx} className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 ${
                      tag.type === 'alert' ? 'bg-red-50 text-red-500' :
                      tag.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                      tag.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                      tag.type === 'purple' ? 'bg-purple-50 text-purple-600' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {tag.icon} {tag.text}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-3 mb-5">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-500">Application Deadline</span>
                      <span className="text-[13px] font-bold text-red-500">{exam.deadline}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-500">Eligibility</span>
                      <span className="text-[13px] font-semibold text-[#111827]">{exam.eligibility}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-500">Join Community</span>
                      <div className="flex gap-2 mt-1">
                        <a href={exam.whatsapp} className="bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-[#d1fae5] transition-colors">
                          <i className="fa-brands fa-whatsapp"></i> WhatsApp
                        </a>
                        <a href={exam.viber} className="bg-[#f5f3ff] text-[#6d28d9] border border-[#ddd6fe] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-[#ede9fe] transition-colors">
                          <i className="fa-brands fa-viber"></i> Viber
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </main>

              <footer className="grid grid-cols-2 gap-2 pt-4 border-t border-dashed border-gray-100">
                <button className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 text-gray-600 font-bold text-[12px] rounded-lg hover:bg-gray-50 transition-colors">
                  <Bell className="w-3.5 h-3.5" /> Notify
                </button>
                <button className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 text-gray-600 font-bold text-[12px] rounded-lg hover:bg-gray-50 transition-colors">
                  <Send className="w-3.5 h-3.5" /> Apply
                </button>
                <button className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#2563eb] text-white font-bold text-[13px] rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  <PlayCircle className="w-4 h-4" /> Start Mock Test
                </button>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExamAnnouncementsSection;
