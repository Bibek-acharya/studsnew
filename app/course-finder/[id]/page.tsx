"use client";

import React, { useState, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Lightbulb,
  Brain,
  Target,
  FlaskConical,
  TrendingUp,
  Users,
  HeartPulse,
  Calendar,
  ArrowRight,
  MapPin,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

type TabKey =
  | "overview"
  | "eligibility"
  | "admission"
  | "courses"
  | "fees"
  | "scholarships"
  | "news"
  | "blogs"
  | "faq";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "eligibility", label: "Eligibility" },
  { key: "admission", label: "Admission" },
  { key: "courses", label: "Courses" },
  { key: "fees", label: "Program Fee" },
  { key: "scholarships", label: "Scholarships" },
  { key: "news", label: "News" },
  { key: "blogs", label: "Blogs" },
  { key: "faq", label: "FAQ" },
];

export default function CourseDetailPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);
    window.scrollTo({ top: 520, behavior: "smooth" });
  };

  const scrollTabs = (direction: number) => {
    if (tabContainerRef.current) {
      tabContainerRef.current.scrollBy({ left: direction * 200, behavior: "smooth" });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const sponsoredColleges = [
    {
      name: "Advance Foundation",
      location: "Kumaripati, Lalitpur",
      website: "advancefoundation.edu.np",
      logo: <div className="w-full h-full bg-[#fdf2f2] text-red-600 text-[10px] font-bold flex items-center justify-center rounded uppercase text-center leading-tight border border-red-100">Advance Academy</div>,
    },
    {
      name: "Trinity Int'l College",
      location: "Dillibazar, Kathmandu",
      website: "trinity.edu.np",
      verified: true,
      logo: (
        <div className="w-full h-full bg-[#fffcf2] text-orange-600 text-[10px] font-bold flex flex-col items-center justify-center rounded text-center leading-[1.1] border border-orange-100">
          <svg className="w-4 h-4 mb-0.5 text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 21h22L12 3zm0 3.83L19.17 19H4.83L12 6.83z"></path></svg>
          TRINITY
        </div>
      ),
    },
    {
      name: "KIST College",
      location: "Kamalpokhari, Kathmandu",
      website: "kist.edu.np",
      verified: true,
      logo: <div className="w-full h-full bg-[#f0f4fd] text-[#1e3a8a] text-[13px] font-black flex items-center justify-center rounded border border-blue-100">KIST</div>,
    },
    {
      name: "KMC Network",
      location: "Bagbazar, Kathmandu",
      website: "kmc.edu.np",
      verified: true,
      logo: <span className="text-[#15803d] font-bold text-[14px]">KMC</span>,
      logoBg: "bg-[#f0fdf4]",
    },
    {
      name: "Peace College",
      location: "New Baneshwor, Kathmandu",
      website: "peacecollege.edu.np",
      logo: <span className="text-[#92400e] font-bold text-[12px]">PEACE</span>,
      logoBg: "bg-[#fef3c7]",
    },
    {
      name: "Xavier's College",
      location: "Lazimpat, Kathmandu",
      website: "xaviers.edu.np",
      verified: true,
      logo: <span className="text-[#9d174d] font-bold text-[12px]">XAVIER'S</span>,
      logoBg: "bg-[#fce7f3]",
    },
    {
      name: "Global College",
      location: "Pulchowk, Lalitpur",
      website: "globalcollege.edu.np",
      logo: <span className="text-[#3730a3] font-bold text-[12px]">GLOBAL</span>,
      logoBg: "bg-[#e0e7ff]",
    },
    {
      name: "Brighton College",
      location: "Satdobato, Lalitpur",
      website: "brighton.edu.np",
      logo: <span className="text-[#115e59] font-bold text-[12px]">BRIGHTON</span>,
      logoBg: "bg-[#ccfbf1]",
    },
    {
      name: "Orchid College",
      location: "Thapathali, Kathmandu",
      website: "orchid.edu.np",
      logo: <span className="text-[#9a3412] font-bold text-[12px]">ORCHID</span>,
      logoBg: "bg-[#fed7aa]",
    },
    {
      name: "Prabodh College",
      location: "Chabahil, Kathmandu",
      website: "prabodh.edu.np",
      logo: <span className="text-[#44403c] font-bold text-[12px]">PRABODH</span>,
      logoBg: "bg-[#e7e5e4]",
    },
  ];

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .tab-content { animation: fadeIn 0.4s ease-in-out; }
      `}</style>

      <div className="w-full bg-white text-gray-800">
        <div className="mx-auto max-w-350 pt-12 pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-6 gap-1">
            <a href="#" className="hover:text-gray-900 transition-colors">Home</a>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <a href="#" className="hover:text-gray-900 transition-colors">Courses</a>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <a href="#" className="hover:text-gray-900 transition-colors">+2 Courses</a>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-semibold">10+2 Science</span>
          </nav>

          <div className="mb-6">
            <h1 className="text-[28px] md:text-4xl font-bold text-gray-900">10+2 Science</h1>
            <p className="text-sm text-gray-400 font-medium mt-2">2 Years Program | Higher Secondary (NEB) | On-Campus</p>
          </div>

          <div
            className="relative w-full h-[280px] md:h-[380px] bg-cover bg-center rounded-md overflow-hidden"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop')",
              backgroundPosition: "center 20%",
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>

        {/* Sticky Tab Nav */}
        <div className="mx-auto max-w-350 overflow-hidden bg-white sticky top-0 z-40">
          <div className="relative">
            <button
              onClick={() => scrollTabs(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center md:hidden"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="overflow-x-auto no-scrollbar" ref={tabContainerRef}>
              <nav className="flex space-x-8 whitespace-nowrap border-b border-gray-100">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={`py-4 text-[14px] transition-colors cursor-pointer bg-transparent border-b-2 appearance-none outline-none ${
                      activeTab === tab.key
                        ? "border-[#0000ff] text-[#0000ff] font-bold"
                        : "border-transparent text-gray-500 font-semibold hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <button
              onClick={() => scrollTabs(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center md:hidden"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-350 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-10 bg-white">
          <div className="lg:col-span-2 min-h-[500px]">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="tab-content">
                <div className="space-y-6 text-gray-600 text-[15px] md:text-[15.5px] leading-[1.8]">
                  <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                  <p>
                    The <strong className="text-gray-900 font-semibold">10+2 Science program</strong> is meticulously designed to bridge the gap between secondary education and advanced university studies. Students will dive deep into fundamental scientific principles, mathematical logic, biology, and chemistry.
                  </p>
                  <p>
                    This program is highly suitable for curious and analytical thinkers who want to shape the future of healthcare, engineering, and technology. By the end of this course, you will be proficient in theoretical concepts and practical laboratory skills, preparing you for competitive medical and engineering entrance examinations.
                  </p>
                  <p>
                    The NEB curriculum emphasizes hands-on learning, encouraging students to apply theoretical knowledge to real-world problems. By enrolling in top colleges with state-of-the-art laboratories and expert faculty members, students receive an immersive educational experience that lays a robust foundation for a successful career in the sciences.
                  </p>
                </div>

                {/* Who Should Choose Science */}
                <div className="pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Who Should Choose Science?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { icon: Lightbulb, title: "Curious Minds", desc: "Students who are naturally curious about how things work, enjoy asking questions, and seek to understand the world around them through scientific inquiry." },
                      { icon: Brain, title: "Analytical Thinkers", desc: "Students who excel at problem-solving, logical reasoning, and breaking down complex problems into manageable parts." },
                      { icon: Target, title: "Career-Focused", desc: "Students aspiring to pursue careers in medicine, engineering, technology, research, or any science-related professional field." },
                      { icon: FlaskConical, title: "Hands-On Learners", desc: "Students who enjoy laboratory work, experiments, and learning through practical application of theoretical concepts." },
                      { icon: TrendingUp, title: "High Achievers", desc: "Students with strong academic performance in SEE, particularly in Science, Mathematics, and English subjects." },
                      { icon: Users, title: "Future Innovators", desc: "Students who want to make a difference in society through scientific discoveries, technological innovations, or healthcare improvements." },
                    ].map((item) => (
                      <div key={item.title} className="border border-gray-200 rounded-md p-6 bg-white">
                        <div className="w-12 h-12 rounded-md bg-[#0000ff] flex items-center justify-center text-white mb-4">
                          <item.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 text-[17px]">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Features of 10+2 Science</h2>
                  <div className="space-y-4">
                    {[
                      { num: "1", title: "Comprehensive Curriculum", desc: "NEB-approved curriculum covering Physics, Chemistry, Biology/Mathematics with balanced theoretical and practical components. Regular assessments and laboratory sessions ensure thorough understanding." },
                      { num: "2", title: "State-of-the-Art Laboratories", desc: "Fully equipped Physics, Chemistry, and Biology laboratories with modern instruments. Hands-on practical sessions account for 25% of total marks in science subjects." },
                      { num: "3", title: "Expert Faculty", desc: "Experienced and qualified teachers specializing in their respective subjects. Regular faculty development programs ensure updated teaching methodologies." },
                      { num: "4", title: "Entrance Preparation", desc: "Dedicated coaching for IOE, CEE, BSc. CSIT, and other competitive entrance examinations. Model tests, practice sessions, and doubt-clearing classes included." },
                      { num: "5", title: "Scholarship Opportunities", desc: "Merit-based scholarships up to 100% for top performers. Entrance topper scholarships and need-based financial aid available for deserving students." },
                      { num: "6", title: "Career Guidance", desc: "Regular career counseling sessions, college visits, and interaction with professionals. Guidance on choosing the right stream and future career path." },
                    ].map((item) => (
                      <div key={item.num} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#0000ff] flex items-center justify-center text-white shrink-0 mt-0.5">
                          <span className="text-sm font-bold">{item.num}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1 text-[16px]">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Eligibility Tab */}
            {activeTab === "eligibility" && (
              <div className="tab-content">
                <div className="mb-6">
                  <h2 className="text-[22px] font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
                  <h3 className="text-[17px] font-bold text-gray-900 mb-4">Full time Courses</h3>

                  <div className="overflow-x-auto rounded border border-gray-200">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-[#eff4fc] border-b border-gray-200">
                          <th className="p-4 font-bold text-gray-900 w-[8%] border-r border-gray-200">S.N.</th>
                          <th className="p-4 font-bold text-gray-900 w-[18%] border-r border-gray-200">Level</th>
                          <th className="p-4 font-bold text-gray-900 w-[24%] border-r border-gray-200">Stream/Faculty</th>
                          <th className="p-4 font-bold text-gray-900 w-[25%] border-r border-gray-200">Eligibility</th>
                          <th className="p-4 font-bold text-gray-900 w-[25%]">Required Documents</th>
                        </tr>
                      </thead>
                      <tbody className="text-[15px]">
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">1</td>
                          <td className="p-4 align-top border-r border-gray-200 font-semibold text-gray-900">+2 Science</td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">PCB, PCM, Computer Science</td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">Minimum 2.0 GPA in SEE with C+ in Science and Mathematics</td>
                          <td className="p-4 align-top text-gray-700">
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>SEE Mark Sheet</li>
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>Character Certificate</li>
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>8 Photos</li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Admission Tab */}
            {activeTab === "admission" && (
              <div className="tab-content">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Admission Process</h2>
                  <p className="text-gray-600">Step-by-step guide for +2 Science admission</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-3">Application Form</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Many colleges from different districts open online admission forms, while many others still require you to open/submit the form physically at the college. For more detailed insights, you can visit the <a href="#" className="text-[#0000ff] font-medium hover:underline">online admission open form here</a>.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-3">Entrance Examination</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Colleges can have different admission times and schedules for their entrance exams. You can find detailed entrance notices and dates from this page <a href="#" className="text-[#0000ff] font-medium hover:underline">entrance here</a> or you can find it directly from the specific college page via <a href="#" className="text-[#0000ff] font-medium hover:underline">Find College</a>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === "courses" && (
              <div className="tab-content">
                <div className="mb-6">
                  <h2 className="text-[22px] font-bold text-gray-900 mb-4">10+2 Science Courses & Fees</h2>
                  <h3 className="text-[17px] font-bold text-gray-900 mb-4">Full time Courses</h3>

                  <div className="overflow-x-auto rounded border border-gray-200">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-[#eff4fc] border-b border-gray-200">
                          <th className="p-4 font-bold text-gray-900 w-[28%] border-r border-gray-200">Course</th>
                          <th className="p-4 font-bold text-gray-900 w-[30%] border-r border-gray-200">Total Fees</th>
                          <th className="p-4 font-bold text-gray-900 w-[27%] border-r border-gray-200">Admission Duration</th>
                          <th className="p-4 font-bold text-gray-900 w-[15%]">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-[15px]">
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-gray-900 font-semibold mb-1">Science (+2) - Physical Group</div>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-[#059669] mb-1">90,000 - 150,000 NPR</div>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">Aug - Sep 2026</td>
                          <td className="p-4 align-top">
                            <a href="#" className="text-[#2563eb] hover:underline flex items-center">View College <ArrowRight className="w-4 h-4 ml-1" /></a>
                          </td>
                        </tr>

                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-gray-900 font-semibold mb-1">Science (+2) - Biology Group</div>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-[#059669] mb-1">90,000 - 150,000 NPR</div>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">Aug - Sep 2026</td>
                          <td className="p-4 align-top">
                            <a href="#" className="text-[#2563eb] hover:underline flex items-center">View College <ArrowRight className="w-4 h-4 ml-1" /></a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Details</h2>

                  <div className="space-y-6">
                    {/* Physical Group */}
                    <div className="border border-gray-200 rounded-md p-6 bg-white">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-md bg-[#0000ff] flex items-center justify-center text-white flex-shrink-0">
                            <FlaskConical className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Physical Group</h3>
                            <p className="text-sm text-gray-500">Physics, Chemistry, Mathematics</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Admissions Open</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">Our Physical Group program is designed for students who aspire to pursue careers in engineering, technology, and pure sciences. The curriculum combines theoretical knowledge with practical laboratory experience.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-md p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Available Streams:</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>Physics, Chemistry, Mathematics (PCM)</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>Computer Science & IT</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>Statistics & Mathematics</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 rounded-md p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Career Opportunities:</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>Engineering (BE, BTech)</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>B.Sc. CSIT / BIT</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>Architecture</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Biology Group */}
                    <div className="border border-gray-200 rounded-md p-6 bg-white">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-md bg-[#0000ff] flex items-center justify-center text-white flex-shrink-0">
                            <HeartPulse className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Biology Group</h3>
                            <p className="text-sm text-gray-500">Physics, Chemistry, Biology</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Ongoing</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">Our Biology Group program prepares students for careers in medicine, healthcare, and life sciences. The curriculum focuses on developing analytical skills and practical laboratory expertise.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-md p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Available Streams:</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>Physics, Chemistry, Biology (PCB)</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>Mathematics (Optional)</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>Computer Science (Optional)</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 rounded-md p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Career Opportunities:</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>Medicine (MBBS, BDS)</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>Nursing / Pharmacy</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>Agriculture / Forestry</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Program Fee Tab */}
            {activeTab === "fees" && (
              <div className="tab-content">
                <div className="mb-6">
                  <h2 className="text-[22px] font-bold text-gray-900 mb-4">Fee Structure</h2>
                  <h3 className="text-[17px] font-bold text-gray-900 mb-4">Full time Courses</h3>

                  <div className="overflow-x-auto rounded border border-gray-200">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-[#eff4fc] border-b border-gray-200">
                          <th className="p-4 font-bold text-gray-900 w-[28%] border-r border-gray-200">Particulars</th>
                          <th className="p-4 font-bold text-gray-900 w-[30%] border-r border-gray-200">Amount (NPR)</th>
                          <th className="p-4 font-bold text-gray-900 w-[27%] border-r border-gray-200">Frequency</th>
                          <th className="p-4 font-bold text-gray-900 w-[15%]">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="text-[15px]">
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-gray-900 font-semibold mb-1">Admission Fee</div>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-gray-700">25,000</div>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">One-time</td>
                          <td className="p-4 align-top text-gray-700">Non-refundable</td>
                        </tr>

                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-gray-900 font-semibold mb-1">Monthly Tuition Fee</div>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-gray-700">6,500</div>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">Monthly (x12)</td>
                          <td className="p-4 align-top text-gray-700">Per month</td>
                        </tr>

                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-gray-900 font-semibold mb-1">Laboratory Fee</div>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-gray-700">10,000</div>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">Annual</td>
                          <td className="p-4 align-top text-gray-700">Per year</td>
                        </tr>

                        <tr className="hover:bg-gray-50">
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-gray-900 font-semibold mb-1">Library & Extra-curricular</div>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-gray-700">5,000</div>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">Annual</td>
                          <td className="p-4 align-top text-gray-700">Per year</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#eff4fc]">
                          <td className="p-4 font-bold text-gray-900 border-r border-gray-200">Total Estimated First Year Fee</td>
                          <td className="p-4 font-bold text-gray-900 border-r border-gray-200">90,000 - 150,000+</td>
                          <td className="p-4 text-gray-700 border-r border-gray-200">First Year</td>
                          <td className="p-4 text-gray-700">Varies by college</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Scholarships Tab */}
            {activeTab === "scholarships" && (
              <div className="tab-content">
                <div className="pt-8">
                  <h2 className="text-[22px] font-bold text-gray-900 mb-4">Scholarships Overview</h2>
                  <p className="text-[15px] text-gray-600 mb-6 leading-relaxed">
                    Many colleges offer various scholarships based on SEE GPA, entrance examination performance, and financial need. The scholarship types, coverage, and eligibility criteria vary from college to college. Below are the common scholarship categories available across most institutions:
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      {
                        num: "1",
                        title: "Merit-Based (SEE GPA)",
                        desc: "Students securing exceptionally high GPAs (typically above 3.6 or A+ aggregate) in their SEE examinations receive direct waivers on their admission and tuition fees.",
                        badges: [
                          { label: "50-100% Coverage", color: "bg-green-100 text-green-700" },
                          { label: "GPA 3.6+", color: "bg-blue-100 text-blue-700" },
                        ],
                      },
                      {
                        num: "2",
                        title: "Entrance Toppers",
                        desc: "Top performers in the college's internal entrance examinations are often rewarded with up to 100% scholarships for the first academic year. Renewal depends on maintaining academic performance.",
                        badges: [
                          { label: "Up to 100%", color: "bg-green-100 text-green-700" },
                          { label: "Top 10 Ranks", color: "bg-blue-100 text-blue-700" },
                        ],
                      },
                      {
                        num: "3",
                        title: "Need-Based Scholarships",
                        desc: "Financial aid scholarships for students from economically disadvantaged backgrounds. Requires documentation of family income and may include interview process.",
                        badges: [
                          { label: "25-50% Coverage", color: "bg-green-100 text-green-700" },
                          { label: "Income Based", color: "bg-blue-100 text-blue-700" },
                        ],
                      },
                      {
                        num: "4",
                        title: "Sports & Cultural Excellence",
                        desc: "Special scholarships for students who have excelled in sports, arts, music, or other cultural activities at district, national, or international levels.",
                        badges: [
                          { label: "30-70% Coverage", color: "bg-green-100 text-green-700" },
                          { label: "Certificate Required", color: "bg-blue-100 text-blue-700" },
                        ],
                      },
                      {
                        num: "5",
                        title: "Sibling Discount",
                        desc: "Many colleges offer additional discounts when multiple siblings are enrolled in the same institution. This can be combined with other scholarship types.",
                        badges: [
                          { label: "10-20% Extra", color: "bg-green-100 text-green-700" },
                          { label: "Same College", color: "bg-blue-100 text-blue-700" },
                        ],
                      },
                      {
                        num: "6",
                        title: "Differently-Abled Students",
                        desc: "Special scholarships and support for students with disabilities. Includes fee waivers and accessibility accommodations throughout the program.",
                        badges: [
                          { label: "50-100% Coverage", color: "bg-green-100 text-green-700" },
                          { label: "Disability Certificate", color: "bg-blue-100 text-blue-700" },
                        ],
                      },
                    ].map((item) => (
                      <div key={item.num} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#0000ff] flex items-center justify-center text-white shrink-0 mt-0.5">
                          <span className="text-sm font-bold">{item.num}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1 text-[16px]">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
                          <div className="flex items-center gap-2">
                            {item.badges.map((badge) => (
                              <span key={badge.label} className={`px-3 py-1 rounded-full font-semibold text-xs ${badge.color}`}>{badge.label}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#f8fafc] border border-gray-200 rounded-md p-5">
                    <h4 className="font-bold text-gray-900 mb-3 text-[16px]">Important Notes:</h4>
                    <ul className="space-y-2 text-[14px] text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-[#0000ff] mt-0.5">•</span>
                        <span>Scholarship availability, coverage percentage, and eligibility criteria vary by college. Contact individual colleges directly for specific details.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0000ff] mt-0.5">•</span>
                        <span>Most scholarships are renewable annually based on maintaining minimum GPA requirements (typically 3.0 or above).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0000ff] mt-0.5">•</span>
                        <span>Some colleges allow combining multiple scholarship types (e.g., merit + sibling discount), while others do not.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0000ff] mt-0.5">•</span>
                        <span>Application deadlines for scholarships often differ from regular admission deadlines. Check with colleges early.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* News Tab */}
            {activeTab === "news" && (
              <div className="tab-content">
                <div className="mb-6">
                  <h2 className="text-[20px] font-bold text-gray-900">News & Notices</h2>
                  <p className="text-[14px] text-gray-500 mt-1">Stay updated with our latest announcements.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
                      badge: "Admission",
                      badgeClass: "bg-blue-50 text-blue-600",
                      title: "Class 11 Science Admission Open for 2081 Batch",
                      desc: "Top colleges across the country have started accepting online and physical applications for the upcoming academic session following the SEE results.",
                      date: "20 Aug 2025",
                    },
                    {
                      img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
                      badge: "Examination",
                      badgeClass: "bg-green-50 text-green-600",
                      title: "NEB Grade 12 Board Examination Routine Published",
                      desc: "The National Examinations Board (NEB) has officially released the schedule for the Grade 12 annual examinations.",
                      date: "05 May 2025",
                    },
                    {
                      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
                      badge: "Update",
                      badgeClass: "bg-purple-50 text-purple-600",
                      title: "Updates to the Grade 11 Science Curriculum",
                      desc: "The curriculum development center has announced minor tweaks to the practical grading system for Physics and Chemistry.",
                      date: "12 Feb 2025",
                    },
                    {
                      img: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&h=400&fit=crop",
                      badge: "Scholarship",
                      badgeClass: "bg-green-50 text-green-600",
                      title: "Merit Scholarship Applications Now Open",
                      desc: "Applications are now being accepted for merit-based scholarships. Students with GPA 3.8+ in SEE are eligible.",
                      date: "08 Jan 2025",
                    },
                  ].map((item) => (
                    <div key={item.title} className="bg-white border border-gray-100 rounded-md overflow-hidden">
                      <div className="p-4 pb-0">
                        <img src={item.img} className="w-full h-40 object-cover rounded-md" alt={item.badge} />
                      </div>
                      <div className="p-5">
                        <div className="mb-3"><span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${item.badgeClass}`}>{item.badge}</span></div>
                        <h3 className="font-bold text-gray-900 text-[16px] mb-2">{item.title}</h3>
                        <p className="text-[13px] text-gray-600 mb-4 line-clamp-2">{item.desc}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[12px] text-gray-500"><Calendar className="w-4 h-4" /><span>{item.date}</span></div>
                          <a href="#" className="text-blue-600 hover:text-blue-700 text-[13px] font-bold flex items-center gap-1">Read More<ArrowRight className="w-4 h-4" /></a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blogs Tab */}
            {activeTab === "blogs" && (
              <div className="tab-content">
                <div className="mb-6">
                  <h2 className="text-[20px] font-bold text-gray-900">Blogs & Articles</h2>
                  <p className="text-[14px] text-gray-500 mt-1">Insights, tips, and stories from the science community.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
                      badge: "Blog",
                      badgeClass: "bg-orange-50 text-orange-600",
                      title: "How to Excel in 10+2 Science: Tips from Toppers",
                      desc: "Success stories and study tips from students who achieved top grades in their NEB examinations. Learn their strategies for balancing studies and extracurriculars.",
                      date: "28 Jan 2025",
                    },
                    {
                      img: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=400&fit=crop",
                      badge: "Blog",
                      badgeClass: "bg-blue-50 text-blue-600",
                      title: "Career Paths After 10+2 Science: Complete Guide",
                      desc: "Exploring various career opportunities available after completing 10+2 Science. From engineering to medicine, discover which path suits your interests.",
                      date: "15 Jan 2025",
                    },
                    {
                      img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop",
                      badge: "Blog",
                      badgeClass: "bg-green-50 text-green-600",
                      title: "Effective Study Techniques for Science Students",
                      desc: "Proven study methods including active recall, spaced repetition, and concept mapping. Learn how to retain complex scientific concepts effectively.",
                      date: "05 Jan 2025",
                    },
                    {
                      img: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&h=400&fit=crop",
                      badge: "Blog",
                      badgeClass: "bg-purple-50 text-purple-600",
                      title: "Laboratory Safety: Essential Guidelines for Students",
                      desc: "Important safety protocols and best practices for working in science laboratories. Protect yourself and others while conducting experiments.",
                      date: "22 Dec 2024",
                    },
                    {
                      img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=400&fit=crop",
                      badge: "Blog",
                      badgeClass: "bg-red-50 text-red-600",
                      title: "Time Management for Science Students",
                      desc: "Balance your studies, laboratory work, and personal life with these time management strategies. Create a study schedule that works for you.",
                      date: "10 Dec 2024",
                    },
                    {
                      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop",
                      badge: "Blog",
                      badgeClass: "bg-indigo-50 text-indigo-600",
                      title: "Life Beyond Books: Extracurriculars for Science Students",
                      desc: "Why participating in clubs, sports, and community service matters. Develop soft skills that complement your academic achievements.",
                      date: "01 Dec 2024",
                    },
                  ].map((item) => (
                    <div key={item.title} className="bg-white border border-gray-100 rounded-md overflow-hidden">
                      <div className="p-4 pb-0">
                        <img src={item.img} className="w-full h-40 object-cover rounded-md" alt={item.badge} />
                      </div>
                      <div className="p-5">
                        <div className="mb-3"><span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${item.badgeClass}`}>{item.badge}</span></div>
                        <h3 className="font-bold text-gray-900 text-[16px] mb-2">{item.title}</h3>
                        <p className="text-[13px] text-gray-600 mb-4 line-clamp-2">{item.desc}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[12px] text-gray-500"><Calendar className="w-4 h-4" /><span>{item.date}</span></div>
                          <a href="#" className="text-blue-600 hover:text-blue-700 text-[13px] font-bold flex items-center gap-1">Read More<ArrowRight className="w-4 h-4" /></a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
              <div className="tab-content">
                <div className="mb-6">
                  <h2 className="text-[20px] font-bold text-gray-900">Frequently Asked Questions</h2>
                  <p className="text-[14px] text-gray-500 mt-1">Find answers to common questions</p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      q: "Q: Is it mandatory to take Extra Mathematics if I choose the Biology group?",
                      a: "No, extra mathematics is an optional subject for Biology students. However, it is highly recommended if you are unsure whether you want to pursue medical or engineering fields later.",
                    },
                    {
                      q: "Q: Can I change my stream from Science to Management in Grade 12?",
                      a: "Once you are registered for the Science stream in Grade 11 with NEB, switching faculties for Grade 12 is generally not permitted. You would typically have to restart Grade 11 in the new faculty.",
                    },
                    {
                      q: "Q: What is the minimum GPA required to get admitted to a top college?",
                      a: "While the NEB baseline is a 2.0 GPA, most top-tier colleges in urban areas typically look for a minimum of 3.2 to 3.6 GPA in the SEE examinations.",
                    },
                    {
                      q: "Q: Are practical classes graded separately?",
                      a: "Yes, subjects like Physics, Chemistry, and Biology have a distinct practical grading component. It usually accounts for 25% of the total marks in the subject.",
                    },
                  ].map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-md overflow-hidden border border-gray-100">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left transition cursor-pointer bg-transparent border-none"
                      >
                        <span className="font-semibold text-gray-900 text-[15px] pr-4">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === idx ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openFaq === idx && (
                        <div className="px-5 pb-4">
                          <p className="text-[14px] text-gray-600 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[20px] font-bold text-gray-900">Sponsored Colleges</h3>
                <span className="text-[11px] font-bold text-gray-400 tracking-wider">AD</span>
              </div>

              <div className="space-y-4">
                {sponsoredColleges.map((college) => (
                  <div key={college.name} className="bg-white border border-gray-200 rounded-md p-5 flex items-center gap-4 cursor-pointer">
                    <div className={`w-[60px] h-[60px] rounded-md bg-white border border-gray-100 flex items-center justify-center shrink-0 p-1 ${college.logoBg || ""}`}>
                      {college.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <h4 className="text-[17px] font-bold text-gray-900">{college.name}</h4>
                        {college.verified && (
                          <CheckCircle2 className="w-4 h-4 text-[#1678e3]" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-[13px] mb-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{college.location}</span>
                      </div>
                      <a href="#" className="flex items-center gap-1 text-[#1678e3] text-[13px] font-medium hover:underline">
                        <ExternalLink className="w-3.5 h-3.5" />
                        {college.website}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
