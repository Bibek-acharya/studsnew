'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  Bookmark, 
  MapPin, 
  Star, 
  BookOpen, 
  DollarSign, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  ChevronRight,
  Trash2,
  BadgeCheck,
  Award,
  MessageSquare,
  LockIcon,
  GraduationCap,
  ClipboardCheck,
  CreditCard,
  Briefcase,
  PlayCircle,
  Bell,
  Send,
  ExternalLink,
  Users,
  Building,
  Globe,
  Monitor,
  TrendingUp,
  Flame,
  Image as ImageIcon
} from 'lucide-react'

type BookmarkType = 'Colleges' | 'Courses' | 'Scholarships' | 'Events' | 'Entrance' | 'Admissions'

interface BaseBookmark {
  id: number
  type: BookmarkType
  name: string
  imageUrl?: string
}

interface CollegeBookmark extends BaseBookmark {
  type: 'Colleges'
  location: string
  rating: string
  affiliation: string
  collegeType: string
  isVerified: boolean
  featured: boolean
}

interface ScholarshipBookmark extends BaseBookmark {
  type: 'Scholarships'
  eligibility: string
  deadline: string
  amount: string
  org: string
  status: 'OPEN' | 'CLOSING SOON' | 'CLOSED'
  badgeType: string
}

interface CourseBookmark extends BaseBookmark {
  type: 'Courses'
  duration: string
  offeredBy: string
  affiliation: string
  level: string
  estFee: string
}

interface EventBookmark extends BaseBookmark {
  type: 'Events'
  date: string
  time: string
  organizer: string
  location: string
  category: string
  excerpt: string
}

interface EntranceBookmark extends BaseBookmark {
  type: 'Entrance'
  date: string
  format: string
  institution: string
  affiliation?: string
  location?: string
  website?: string
  whatsapp?: string
  viber?: string
  deadline: string
  eligibility: string
  verified: boolean
  tags: { text: string; icon: string; type: string }[]
}

interface AdmissionBookmark extends BaseBookmark {
  type: 'Admissions'
  program: string
  deadline: string
  location: string
  rating: number
  collegeType: string
  website: string
  programs: { name: string; status: "Closing Soon" | "Opening Soon" | "Seats Available" }[]
}

type BookmarkItem = 
  | CollegeBookmark 
  | ScholarshipBookmark 
  | CourseBookmark 
  | EventBookmark 
  | EntranceBookmark 
  | AdmissionBookmark

const INITIAL_BOOKMARKS: BookmarkItem[] = [
  { 
    id: 1, 
    type: 'Colleges', 
    name: 'Stanford University', 
    location: 'Stanford, California', 
    rating: '4.9', 
    affiliation: 'WASC, Ivy League', 
    collegeType: 'Private Research',
    isVerified: true,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 2, 
    type: 'Scholarships', 
    name: 'Global Tech Innovators Grant', 
    eligibility: 'Undergraduate STEM students', 
    deadline: 'May 30, 2026', 
    amount: 'NPR. 10,000',
    org: 'Silicon Valley Foundation',
    status: 'OPEN',
    badgeType: 'MERIT BASED',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 3, 
    type: 'Courses', 
    name: 'B.S. Artificial Intelligence', 
    duration: '4 Years', 
    offeredBy: 'Mass. Institute of Technology',
    affiliation: 'MIT',
    level: 'Bachelor',
    estFee: '$55,000/yr',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 4, 
    type: 'Events', 
    name: 'Ivy League Virtual Campus Tour', 
    date: 'April 20, 2026', 
    time: '10:00 AM EST',
    organizer: 'Ivy League Consortium',
    location: 'Online / Zoom',
    category: 'Seminar & Workshop',
    excerpt: 'Join us for an exclusive virtual tour of the most prestigious universities in the world.',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 5, 
    type: 'Entrance', 
    name: 'SAT Subject Test - Math Level 2', 
    date: 'June 5, 2026', 
    format: 'In-person / Online',
    institution: 'College Board',
    affiliation: 'College Board',
    location: 'Kathmandu',
    website: 'collegeboard.org',
    whatsapp: 'https://wa.me/1234567890',
    viber: 'viber://chat?number=1234567890',
    deadline: 'May 15, 2026',
    eligibility: 'High School Seniors',
    verified: true,
    tags: [
      { text: 'Trending', icon: 'trending-up', type: 'purple' },
      { text: 'Limited Seats', icon: 'flame', type: 'alert' }
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/97/College_Board_logo.png'
  },
  { 
    id: 6, 
    type: 'Admissions', 
    name: 'Harvard Business School', 
    program: 'MBA Fall 2026', 
    deadline: 'Round 1: Sep 4, 2026',
    location: 'Boston, MA',
    rating: 4.9,
    collegeType: 'Private',
    website: 'www.hbs.edu',
    programs: [
      { name: 'MBA', status: 'Opening Soon' },
      { name: 'Doctoral Programs', status: 'Seats Available' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 7, 
    type: 'Colleges', 
    name: 'University of Oxford', 
    location: 'Oxford, UK', 
    rating: '4.8',
    affiliation: 'Oxford University',
    collegeType: 'Public Research',
    isVerified: true,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1544144433-d50aff500b91?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 8, 
    type: 'Courses', 
    name: 'M.Sc. Data Science', 
    duration: '2 Years', 
    offeredBy: 'Imperial College London',
    affiliation: 'Imperial College',
    level: 'Master',
    estFee: '£35,000/yr',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 9, 
    type: 'Scholarships', 
    name: 'Women in Engineering Scholarship', 
    eligibility: 'Female High School Seniors', 
    deadline: 'June 15, 2026', 
    amount: '$5,000',
    org: 'Global Engineering Society',
    status: 'OPEN',
    badgeType: 'NEED BASED',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=400&q=80'
  },
]

const TABS: BookmarkType[] = ['Colleges', 'Courses', 'Scholarships', 'Events', 'Entrance', 'Admissions']

const iconMap: Record<string, React.ReactNode> = {
  flame: <Flame className="w-3 h-3" />,
  monitor: <Monitor className="w-3 h-3" />,
  globe: <Globe className="w-3 h-3" />,
  "trending-up": <TrendingUp className="w-3 h-3" />,
  building: <Building className="w-3 h-3" />,
  award: <Award className="w-3 h-3" />,
  "badge-check": <BadgeCheck className="w-3 h-3" />,
};

export default function BookmarksSection() {
  const [activeTab, setActiveTab] = useState<BookmarkType>('Colleges')
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(INITIAL_BOOKMARKS)

  const filteredBookmarks = bookmarks.filter(b => b.type === activeTab)

  const removeBookmark = (id: number) => {
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "OPEN":
        return { statusDot: "bg-[#22c55e]", statusText: "text-[#22c55e]", statusBg: "bg-green-50" };
      case "CLOSING SOON":
        return { statusDot: "bg-[#eab308]", statusText: "text-[#eab308]", statusBg: "bg-yellow-50" };
      case "CLOSED":
        return { statusDot: "bg-gray-400", statusText: "text-gray-500", statusBg: "bg-gray-100" };
      default:
        return { statusDot: "bg-gray-400", statusText: "text-gray-500", statusBg: "bg-gray-100" };
    }
  };

  const badgeClass = (category: string) => {
    if (category === "Seminar & Workshop") return "bg-[#00c2a8]";
    if (category === "Career Fairs") return "bg-orange-500";
    if (category === "Hackthons") return "bg-blue-500";
    return "bg-blue-500";
  };

  return (
    <div className="flex flex-col w-full">
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
          transform: translateY(15px);
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-stagger:nth-child(1) { animation-delay: 0.05s; }
        .card-stagger:nth-child(2) { animation-delay: 0.1s; }
        .card-stagger:nth-child(3) { animation-delay: 0.15s; }
        .card-stagger:nth-child(4) { animation-delay: 0.2s; }

        .hide-scroll-x::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll-x {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-tooltip {
          position: absolute;
          bottom: 100%;
          left: 0;
          margin-bottom: 8px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
          z-index: 20;
          width: auto;
          max-width: 200px;
          background-color: #111827;
          color: white;
          font-size: 11px;
          font-weight: 500;
          padding: 6px 10px;
          border-radius: 6px;
          pointer-events: none;
          transform: translateY(4px);
        }
        .group:hover .custom-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(-4px);
        }
        .tooltip-arrow {
          position: absolute;
          top: 100%;
          left: 16px;
          border-width: 5px;
          border-style: solid;
          border-color: #111827 transparent transparent transparent;
        }
      `}</style>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-md mb-6 w-fit mt-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === tab
                ? 'bg-white text-primary'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredBookmarks.map((item) => (
            <div key={item.id} className="fade-in card-stagger h-full">
              {item.type === 'Colleges' && (
                <div className="flex h-full cursor-pointer flex-col rounded-md border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20 overflow-visible">
                  <div
                    className="group relative h-35 shrink-0 overflow-hidden rounded-md"
                  >
                    
                    {(item as CollegeBookmark).isVerified && item.imageUrl ? (
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=400&q=80'}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-brand-blue">
                        
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col px-0 pt-3 overflow-visible">
                    <div className="flex items-center gap-1.5 mb-2">
                      <button
                        type="button"
                        className="group/title relative truncate text-left text-[20px] font-bold text-slate-800 tracking-tight transition-colors hover:text-blue-600 line-clamp-2"
                      >
                        <span className="truncate block" title={item.name}>{item.name}</span>
                        <span className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/title:visible group-hover/title:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded  whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
                          {item.name}
                          <span className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></span>
                        </span>
                      </button>
                      {(item as CollegeBookmark).isVerified && (
                        <BadgeCheck className="w-5 h-5 text-white fill-blue-500 shrink-0" />
                      )}
                    </div>

                    <div className="mb-2 flex min-w-0 items-center text-[14px] text-gray-500">
                      <div className="flex items-center gap-1 font-bold text-slate-700">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{(item as CollegeBookmark).rating}</span>
                      </div>
                      <span className="mx-3 text-gray-300 font-light">|</span>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4.5 h-4.5 text-gray-400" />
                        <span className="font-semibold text-slate-700">
                          {(item as CollegeBookmark).collegeType}
                        </span>
                      </div>
                      <span className="mx-3 text-gray-300 font-light">|</span>
                      <div className="flex min-w-0 flex-1 items-center gap-1.5">
                        <MapPin className="w-4.5 h-4.5 text-gray-400" />
                        <span className="group/location block min-w-0 truncate font-semibold text-slate-700 line-clamp-1" title={(item as CollegeBookmark).location}>
                          <span className="truncate block">{(item as CollegeBookmark).location.split(',')[0]}</span>
                          <span className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/location:visible group-hover/location:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded  whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
                            {(item as CollegeBookmark).location}
                            <span className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></span>
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-[14px] text-gray-500 mb-2">
                      <Award className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.75" />
                      <p className="group/affil leading-snug pr-4 font-semibold text-slate-700 line-clamp-1" title={(item as CollegeBookmark).affiliation}>
                        <span className="truncate block">
                          {(item as CollegeBookmark).affiliation}
                        </span>
                        <span className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/affil:visible group-hover/affil:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded  whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
                          {(item as CollegeBookmark).affiliation}
                          <span className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></span>
                        </span>
                      </p>
                    </div>

                    <div className="mb-4 pr-2 h-14">
                      <p className="text-[14px] leading-relaxed text-gray-500 line-clamp-2">
                        Explore academics, facilities, and counselling support for this college.
                      </p>
                      <button
                        type="button"
                        className="text-[14px] font-semibold text-brand-blue hover:underline"
                      >
                        Read more
                      </button>
                    </div>

                    <div className="mt-2 flex items-center gap-4">
                      <a
                        href="#"
                        className="interaction-btn text-[12px] font-medium text-brand-blue hover:text-blue-800 flex items-center transition-colors"
                      >
                        Admission
                        <svg
                          className="w-3 h-3 ml-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 17L17 7M7 7h10v10"
                          />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="interaction-btn text-[12px] font-medium text-brand-blue hover:text-blue-800 flex items-center transition-colors"
                      >
                        Courses & Fees
                        <svg
                          className="w-3 h-3 ml-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 17L17 7M7 7h10v10"
                          />
                        </svg>
                      </a>
                    </div>

                    <div className="border-t border-dashed border-gray-200 mb-4" />

                    <div className="flex flex-col gap-3 mt-auto">
                      <button
                        type="button"
                        disabled={!(item as CollegeBookmark).isVerified}
                        className={`w-full text-white font-medium text-[14px] py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                          (item as CollegeBookmark).isVerified
                            ? "bg-brand-blue hover:bg-blue-700"
                            : "bg-brand-blue cursor-not-allowed"
                        }`}
                      >
                        {!(item as CollegeBookmark).isVerified && <LockIcon size={14} />}
                        Get counselling
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-slate-600 font-medium py-2 px-2 rounded-md transition-colors text-[13px]"
                        >
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          Inquiry
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="flex-1 bg-[#EAB308] hover:bg-yellow-500 text-white font-semibold py-2 px-2 rounded-md transition-colors text-[13px]"
                        >
                          Compare now
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBookmark(item.id);
                          }}
                          className={`w-10 flex items-center justify-center border rounded-md transition-colors shrink-0 ${
                            true
                              ? "border-blue-200 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                          title="Remove Bookmark"
                        >
                          <Bookmark
                            className={`w-4 h-4 transition-all text-[#0000ff] fill-[#0000ff]`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'Courses' && (
                <div className="bg-white rounded-md border border-gray-200 flex flex-col h-full transition-all hover:border-blue-500/20 duration-300">
                  <div className="relative h-28 w-full p-3 pb-2">
                    <img
                      src={
                        item.imageUrl ||
                        `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=200`
                      }
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  <div className="px-3 pb-3 pt-0 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-1.5 text-[12px] font-bold">
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md tracking-wide uppercase">
                        {(item as CourseBookmark).level}
                      </span>
                      <div className="flex items-center text-gray-500 gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {(item as CourseBookmark).duration}
                      </div>
                    </div>

                    <div className="relative group mb-1.5">
                      <h2 className="text-base font-bold text-gray-900 group-hover:text-[#0000ff] cursor-pointer transition-colors truncate leading-tight">
                        {item.name}
                      </h2>
                      <div className="custom-tooltip">
                        {item.name}
                        <div className="tooltip-arrow"></div>
                      </div>
                    </div>

                    <div className="space-y-1 text-[12px] flex-1">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                        <div>
                          <span className="font-bold text-gray-700">
                            Affiliation:
                          </span>{" "}
                          <span className="text-gray-600">
                            {(item as CourseBookmark).affiliation}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                        <div>
                          <span className="font-bold text-gray-700">
                            Eligibility:
                          </span>{" "}
                          <span className="text-gray-600">
                            As per institution criteria
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <ClipboardCheck className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                        <div>
                          <span className="font-bold text-gray-700">Entrance:</span>{" "}
                          <span className="text-gray-600">
                            Entrance exam required
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CreditCard className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                        <div>
                          <span className="font-bold text-gray-700">Est. Fee:</span>{" "}
                          <span className="text-[#0000ff] font-bold">
                            {(item as CourseBookmark).estFee}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 mb-4">
                        <Briefcase className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                        <div>
                          <span className="font-bold text-gray-700">Career:</span>{" "}
                          <span className="text-gray-600 truncate inline-block max-w-37.5 align-bottom">
                            {(item as CourseBookmark).offeredBy}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto pt-6 border-t border-dashed border-gray-200">
                      <button
                        className="flex-[1.5] flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-slate-600 font-medium py-2 rounded-md transition-colors text-[12px] whitespace-nowrap"
                      >
                        Details
                      </button>

                      <button
                        className="flex-[2.5] bg-[#0014f4] hover:bg-blue-800 text-white font-semibold py-2 rounded-md  text-[12px] flex items-center justify-center transition-colors whitespace-nowrap"
                      >
                        View Colleges
                      </button>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(item.id);
                        }}
                        className={`shrink-0 w-10 flex items-center justify-center border rounded-md transition-colors ${
                          true
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Bookmark
                          className={`w-4 h-4 transition-all ${
                            true
                              ? "text-[#0000ff] fill-[#0000ff]"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'Scholarships' && (
                <div className="relative flex flex-col bg-white rounded-md border border-gray-200/80 transition-all duration-300 p-3">
                  <div className="h-31.25 w-full bg-gray-100 relative overflow-hidden rounded-md mb-3">
                    {(item as ScholarshipBookmark).imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full p-3 flex items-start bg-linear-to-br from-gray-200 to-gray-50">
                        <span className="text-gray-600 text-[13px] font-medium flex items-start gap-1.5 leading-snug">
                          <ImageIcon className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                          {item.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col grow px-1">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-blue-600 bg-blue-50 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                        {(item as ScholarshipBookmark).badgeType}
                      </span>
                      {(() => {
                        const style = getStatusStyle((item as ScholarshipBookmark).status);
                        return (
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${style.statusBg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${style.statusDot}`}></span>
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${style.statusText}`}>
                              {(item as ScholarshipBookmark).status}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    <h3 className="font-bold text-[16px] leading-tight text-slate-900 mb-1 hover:text-brand-blue">{item.name}</h3>
                    <div className="flex items-center gap-1.5 text-[12.5px] text-gray-500 mb-3.5">
                      {(item as ScholarshipBookmark).org}
                      <BadgeCheck className="w-3.5 h-3.5 text-white fill-[#2563eb]" />
                    </div>

                    <div className="bg-[#f9fafb] rounded-md p-3.5 border border-gray-100 mb-4 mt-auto flex flex-col gap-2.5">
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
                          <DollarSign className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{(item as ScholarshipBookmark).amount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">Global</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{(item as ScholarshipBookmark).eligibility}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[12px] text-gray-800 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#f43f5e] shrink-0" />
                        <span>Ends: {(item as ScholarshipBookmark).deadline}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="flex-1 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                        Details
                      </button>
                      <button className="flex-[1.2] py-2 text-[13px] font-semibold text-white bg-brand-blue rounded-md hover:bg-[#0000cc] transition-colors">
                        Apply
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(item.id);
                        }}
                        className="p-2 border rounded-md transition-colors flex items-center justify-center border-blue-200 bg-blue-50"
                        title="Remove Bookmark"
                      >
                        <Bookmark className="w-4.5 h-4.5 text-brand-blue fill-brand-blue" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'Events' && (
                <div className="bg-white rounded-md border border-gray-200 hover:border-blue-500/20 overflow-hidden flex flex-col duration-300 cursor-pointer">
                  <div className="h-35 w-full overflow-hidden p-4">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-md" />
                  </div>
                  <div className="p-5 flex flex-col grow">
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`${badgeClass((item as EventBookmark).category)} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}
                      >
                        {(item as EventBookmark).category}
                      </span>
                      <span className="flex items-center text-xs text-gray-500 font-semibold">
                        <i className="fa-regular fa-calendar mr-1.5"></i> {(item as EventBookmark).date}
                      </span>
                    </div>

                    <Link
                      href="#"
                      className={`font-bold text-lg mb-3 leading-tight text-left text-black hover:text-[#0000ff]`}
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-center text-xs text-gray-600 mb-2 font-semibold">
                      <i className="fa-regular fa-building mr-2 text-gray-500"></i> {(item as EventBookmark).organizer}
                    </div>
                    <div className="flex items-center text-xs text-gray-600 mb-3 font-semibold">
                      <i className="fa-solid fa-location-dot mr-2 text-gray-500"></i> {(item as EventBookmark).location}
                    </div>

                    <p className="text-xs text-gray-500 mb-5 line-clamp-3 leading-relaxed font-medium">{(item as EventBookmark).excerpt}</p>

                    <div className="mt-auto flex gap-2">
                      <Link
                        href="#"
                        className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2 rounded-md hover:bg-gray-50 transition text-center"
                      >
                        Details
                      </Link>
                      <button className={`flex-1 text-white text-sm font-bold py-2 rounded-md transition bg-brand-blue cursor-pointer hover:bg-blue-600`}>
                        Register Now
                      </button>
                      <button
                        className={`w-10 flex items-center justify-center border rounded-md transition-colors shrink-0 ${
                          true
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        title="Remove Bookmark"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(item.id);
                        }}
                      >
                        <Bookmark
                          className={`w-4 h-4 transition-all ${
                            true ? "text-[#0000ff] fill-[#0000ff]" : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'Entrance' && (
                <div className="bg-white rounded-md p-4 sm:p-5 border border-gray-200 flex flex-col h-full hover:border-blue-500/20 transition-all duration-300 overflow-visible">
                  <header className="flex justify-between items-start mb-4 sm:mb-5">
                    <div className="flex gap-2.5 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md border border-gray-100 flex items-center justify-center bg-white shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full rounded-md object-contain"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h3 className="group relative text-[13px] xs:text-[14px] sm:text-[15px] font-bold text-[#111827] flex items-center gap-1 sm:gap-1.5 min-w-0">
                          <span className="truncate">{(item as EntranceBookmark).institution}</span>
                          {(item as EntranceBookmark).verified && (
                            <BadgeCheck className="w-3.25 h-3.25 sm:w-3.75 sm:h-3.75 text-white fill-blue-500 ml-0.5 sm:ml-1 shrink-0" />
                          )}
                          <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded  whitespace-nowrap transition-all duration-200 z-100 pointer-events-none">
                            {(item as EntranceBookmark).institution}
                            <div className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></div>
                          </div>
                        </h3>
                        <div className="flex flex-col gap-1 text-[10px] xs:text-[11px] sm:text-[11px] text-[#6b7280] mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                            <span className="truncate" title={(item as EntranceBookmark).location || 'Nepal'}>{(item as EntranceBookmark).location || 'Nepal'}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                            <span className="truncate" title={(item as EntranceBookmark).affiliation || 'NEB'}>{(item as EntranceBookmark).affiliation || 'NEB'}</span>
                          </span>
                        </div>
                        <a
                          href="#"
                          className="text-[#2563eb] text-[10px] xs:text-[11px] sm:text-[11px] font-medium mt-0.5 sm:mt-1 flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
                          {(item as EntranceBookmark).website || 'exam.org'}
                        </a>
                      </div>
                    </div>
                    <div className="w-8 h-8 opacity-0"></div>
                  </header>

                  <main className="grow overflow-visible">
                    <h4
                      className="group relative text-[15px] xs:text-[16px] sm:text-[17px] font-bold text-[#111827] mb-2.5 sm:mb-3 leading-tight cursor-pointer hover:text-brand-blue transition-colors"
                    >
                      <span className="truncate block">{item.name}</span>
                      <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded  whitespace-nowrap transition-all duration-200 z-100 pointer-events-none">
                        {item.name}
                        <div className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></div>
                      </div>
                    </h4>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      {(item as EntranceBookmark).tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[9px] xs:text-[10px] sm:text-[10px] font-bold flex items-center gap-1 sm:gap-1.5 ${
                            tag.type === "alert"
                              ? "bg-red-50 text-red-500"
                              : tag.type === "warning"
                                ? "bg-amber-50 text-amber-600"
                                : tag.type === "success"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : tag.type === "purple"
                                    ? "bg-purple-50 text-purple-600"
                                    : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {iconMap[tag.icon]} {tag.text}
                        </span>
                      ))}
                    </div>

                    <div className="bg-[#f8fafc] rounded-md sm:rounded-md p-2 sm:p-2.5 flex flex-col gap-1.5 sm:gap-2 mt-auto border border-[#f1f5f9]">
                      <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8] shrink-0" />
                        <span className="truncate font-medium text-red-500 text-[11px] sm:text-[12px]">
                          Ends: {(item as EntranceBookmark).deadline}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
                        <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8] shrink-0" />
                        <span className="truncate text-[11px] sm:text-[12px]">
                          {(item as EntranceBookmark).eligibility}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8] shrink-0" />
                        <div className="flex gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]">
                          <a
                            href={(item as EntranceBookmark).whatsapp || '#'}
                            className="text-[#059669] hover:underline font-bold"
                          >
                            WhatsApp
                          </a>
                          <span className="text-gray-300">|</span>
                          <a
                            href={(item as EntranceBookmark).viber || '#'}
                            className="text-[#6d28d9] hover:underline font-bold"
                          >
                            Viber
                          </a>
                        </div>
                      </div>
                    </div>
                  </main>

                  <div className="mt-3 sm:mt-4 pt-1 flex flex-col gap-2 sm:gap-2.5">
                    <button
                      className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 bg-brand-blue text-white font-bold text-[12px] sm:text-[13px] rounded-md hover:bg-brand-hover transition-colors "
                    >
                      <PlayCircle className="w-4 h-4" /> Start Mock Test
                    </button>
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-2 sm:gap-2.5">
                      <button className="flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 border border-[#e2e8f0] text-[#475569] font-bold text-[11px] xs:text-[12px] rounded-md hover:bg-gray-50 transition-colors">
                        <Bell className="w-3.5 h-3.5" /> <span>Notify</span>
                      </button>
                      <button
                        className="flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 border border-[#e2e8f0] text-[#475569] font-bold text-[11px] xs:text-[12px] rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" /> Apply
                      </button>
                      <button
                        className={`w-9 sm:w-10 shrink-0 rounded-md flex items-center justify-center transition-all duration-200 ${
                          true
                            ? "border-blue-200 bg-blue-50"
                            : "bg-white border border-[#e2e8f0] text-[#94a3b8] hover:bg-[#f8fafc] hover:text-[#64748b]"
                        }`}
                        title="Remove Bookmark"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(item.id);
                        }}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${true ? "text-[#0000ff] fill-[#0000ff]" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'Admissions' && (
                <div className="bg-white rounded-md border border-gray-200 hover:border-blue-200 overflow-hidden w-full max-w-85 flex flex-col h-full transition-transform cursor-pointer">
                  <div className="p-2.5 pb-0 shrink-0">
                    <div className="relative h-28 w-full bg-gray-200 rounded-md overflow-hidden">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      <div className={`absolute top-2.5 left-0 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 tracking-wide rounded-r-md z-10 uppercase`}>
                        Admission Open
                      </div>
                    </div>
                  </div>

                  <div className="p-3 pb-3 flex flex-col grow">
                    <div className="flex items-center gap-1.5 mb-1 group/name relative">
                      <h2 
                        title={item.name}
                        className="text-[#0f172a] text-[18px] font-bold leading-tight truncate transition-colors group-hover/name:text-brand-blue"
                      >
                        {item.name}
                      </h2>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d6efd" className="w-5 h-5 shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </div>

                    <div className="flex items-center text-[12px] text-[#64748b] mb-1.5 whitespace-nowrap overflow-hidden">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.75 h-3.75 fill-[#f59e0b]" />
                        <span className="font-bold text-[#334155]">{(item as AdmissionBookmark).rating}</span>
                      </div>
                      <span className="mx-2 text-gray-300">|</span>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span>{(item as AdmissionBookmark).collegeType}</span>
                      </div>
                      <span className="mx-2 text-gray-300">|</span>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate" title={(item as AdmissionBookmark).location}>{(item as AdmissionBookmark).location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[12.5px] text-[#64748b] mb-2 hover:text-[#0d6efd] transition-colors cursor-pointer w-fit">
                      <Globe className="w-4 h-4" />
                      <span>{(item as AdmissionBookmark).website}</span>
                    </div>

                    <hr className="border-gray-100 mb-2" />

                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[12.5px] font-medium text-[#64748b]">Programs Offered</span>
                      <span className="text-[12.5px] font-semibold text-[#2563eb]">Admission Open</span>
                    </div>

                    <ul className="space-y-1 mb-2">
                      {(item as AdmissionBookmark).programs?.map((prog, pIdx) => (
                        <li key={pIdx} className="flex justify-between items-center text-[12.5px]">
                          <span className="font-semibold text-[#1e293b]">{prog.name}</span>
                          <div className={`flex items-center gap-1.5 font-medium text-[11px] ${prog.status === 'Closing Soon' ? 'text-red-500' : 'text-emerald-500'}`}>
                            <span className="relative flex h-2 w-2 justify-center items-center">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${prog.status === 'Closing Soon' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${prog.status === 'Closing Soon' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                            </span>
                            {prog.status}
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="border-b border-dotted border-gray-200 mt-auto mb-3 w-full pt-2" style={{ borderBottomWidth: "1.5px", borderBottomStyle: "dotted" }}></div>

                    <div className="flex items-center gap-1.5 mb-2">
                      <button className="flex-1 py-1.5 px-2 bg-gray-50 text-[#334155] hover:bg-gray-100 border border-gray-200 rounded-md text-[11px] font-semibold transition-colors flex justify-center items-center gap-1 whitespace-nowrap">
                        <PlayCircle className="w-3.5 h-3.5" />
                        Mock Test
                      </button>
                      <button className="flex-1 py-1.5 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 rounded-md text-[11px] font-semibold transition-colors flex justify-center items-center gap-1 whitespace-nowrap">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Ask Question
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button className="flex-1 py-2 px-2 bg-brand-blue hover:bg-brand-hover text-white rounded-md text-[12px] font-bold transition-colors">
                        Apply Now
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(item.id);
                        }}
                        className={`flex-none w-9 h-9 flex items-center justify-center border rounded-md transition-colors ${
                          true
                            ? "border-blue-100 bg-blue-50 text-blue-600"
                            : "border-gray-200 text-[#64748b] hover:bg-gray-50"
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${true ? "text-[#0000ff] fill-[#0000ff]" : ""}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div id="empty-state" className="flex flex-col items-center justify-center py-24 px-4 text-center fade-in bg-white rounded-md border border-slate-200 ">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Bookmark className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">No bookmarks in this category</h3>
          <p className="text-slate-500 max-w-md mx-auto text-base">
            You haven't saved any items here yet. Keep exploring the directory to build your perfect application shortlist.
          </p>
          <button className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-200">
            Explore Directory
          </button>
        </div>
      )}
    </div>
  )
}
