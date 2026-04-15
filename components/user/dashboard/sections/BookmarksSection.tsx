'use client'

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
    amount: '$10,000',
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
    deadline: 'May 15, 2026',
    eligibility: 'High School Seniors',
    verified: true,
    tags: [
      { text: 'Trending', icon: 'trending-up', type: 'purple' },
      { text: 'Limited Seats', icon: 'flame', type: 'alert' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
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
      `}</style>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 mb-10 pt-2">
        <div className="flex overflow-x-auto hide-scroll-x gap-8 pb-[-1px]">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-4 px-2 border-b-2 font-bold text-sm sm:text-base transition-all duration-300 ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBookmarks.map((item) => (
            <div key={item.id} className="fade-in card-stagger h-full">
              {item.type === 'Colleges' && (
                <div className="flex h-full cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20 shadow-sm hover:shadow-md">
                  <div className="group relative h-35 shrink-0 overflow-hidden rounded-xl">
                    {(item as CollegeBookmark).featured && (
                      <div className="absolute top-3 left-3 z-10 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                        Featured
                      </div>
                    )}
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=400&q=80'}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeBookmark(item.id); }}
                      className="absolute top-2 right-2 z-10 bg-white/90 p-1.5 rounded-lg text-indigo-600 shadow-sm hover:bg-white"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col pt-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <h3 className="text-[20px] font-bold text-slate-800 truncate" title={item.name}>{item.name}</h3>
                      {(item as CollegeBookmark).isVerified && (
                        <BadgeCheck className="w-5 h-5 text-white fill-blue-500 shrink-0" />
                      )}
                    </div>
                    <div className="mb-2 flex items-center text-[14px] text-gray-500">
                      <div className="flex items-center gap-1 font-bold text-slate-700">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{(item as CollegeBookmark).rating}</span>
                      </div>
                      <span className="mx-2 text-gray-300">|</span>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span>{(item as CollegeBookmark).collegeType}</span>
                      </div>
                      <span className="mx-2 text-gray-300">|</span>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700 truncate">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">{(item as CollegeBookmark).location.split(',')[0]}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-[14px] text-gray-500 mb-3">
                      <Award className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <p className="font-semibold text-slate-700 line-clamp-1">{(item as CollegeBookmark).affiliation}</p>
                    </div>
                    <div className="border-t border-dashed border-gray-200 my-4" />
                    <div className="flex flex-col gap-3 mt-auto">
                      <button className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-2.5 rounded-md transition-colors text-[14px]">
                        Get counselling
                      </button>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-slate-600 font-bold py-2 rounded-md text-[13px]">
                          <MessageSquare className="w-4 h-4" /> Inquiry
                        </button>
                        <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-md text-[13px]">
                          Compare
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'Courses' && (
                <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full transition-all hover:border-blue-500/20 shadow-sm">
                  <div className="relative h-28 w-full p-3 pb-2">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button 
                      onClick={() => removeBookmark(item.id)}
                      className="absolute top-4 right-4 z-10 bg-white/90 p-1.5 rounded-lg text-indigo-600 shadow-sm"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="px-3 pb-3 pt-0 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-1.5 text-[12px] font-bold">
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md uppercase tracking-wide">
                        {(item as CourseBookmark).level}
                      </span>
                      <div className="flex items-center text-gray-500 gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {(item as CourseBookmark).duration}
                      </div>
                    </div>
                    <h2 className="text-base font-bold text-gray-900 mb-2 truncate leading-tight">{item.name}</h2>
                    <div className="space-y-1.5 text-[12px] flex-1">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-3.5 h-3.5 text-gray-400 mt-px shrink-0" />
                        <div><span className="font-bold text-gray-700">Affiliation:</span> <span className="text-gray-600">{(item as CourseBookmark).affiliation}</span></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-gray-400 mt-px shrink-0" />
                        <div><span className="font-bold text-gray-700">Eligibility:</span> <span className="text-gray-600">As per criteria</span></div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-gray-400 mt-px shrink-0" />
                        <div><span className="font-bold text-gray-700">Est. Fee:</span> <span className="text-brand-blue font-bold">{(item as CourseBookmark).estFee}</span></div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto pt-6 border-t border-dashed border-gray-200">
                      <button className="flex-[1.5] border border-gray-200 hover:bg-gray-50 text-slate-600 font-bold py-2 rounded-md text-[12px]">Details</button>
                      <button className="flex-[2.5] bg-brand-blue hover:bg-blue-800 text-white font-bold py-2 rounded-md text-[12px]">View Colleges</button>
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'Scholarships' && (
                <div className="relative flex flex-col bg-white rounded-2xl border border-gray-200 transition-all p-3 shadow-sm h-full hover:border-blue-500/20">
                  <div className="h-32 w-full bg-gray-100 relative overflow-hidden rounded-xl mb-3">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeBookmark(item.id)}
                      className="absolute top-2 right-2 z-10 bg-white/90 p-1.5 rounded-lg text-brand-blue shadow-sm"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="flex flex-col grow px-1">
                    <div className="flex items-center gap-2 mb-2">
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
                    <h3 className="font-bold text-[16px] leading-tight text-slate-900 mb-1">{item.name}</h3>
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-3">
                      {(item as ScholarshipBookmark).org}
                      <BadgeCheck className="w-3.5 h-3.5 text-white fill-blue-600" />
                    </div>
                    <div className="bg-[#f9fafb] rounded-xl p-3 border border-gray-100 mb-4 mt-auto flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-bold">
                          <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate">{(item as ScholarshipBookmark).amount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate">Global</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-bold">
                        <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate">{(item as ScholarshipBookmark).eligibility}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-800 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-red-500" />
                        <span>Ends: {(item as ScholarshipBookmark).deadline}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex-1 py-2 text-[12px] font-bold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50">Details</button>
                      <button className="flex-[1.2] py-2 text-[12px] font-bold text-white bg-brand-blue rounded-md hover:bg-blue-800">Apply</button>
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'Events' && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm h-full hover:border-blue-500/20 transition-all">
                  <div className="h-35 w-full overflow-hidden p-3 relative">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    <button 
                      onClick={() => removeBookmark(item.id)}
                      className="absolute top-5 right-5 z-10 bg-white/90 p-1.5 rounded-lg text-brand-blue shadow-sm"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-4 flex flex-col grow">
                    <div className="flex justify-between items-center mb-3">
                      <span className={`${badgeClass((item as EventBookmark).category)} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}>
                        {(item as EventBookmark).category}
                      </span>
                      <span className="flex items-center text-[11px] text-gray-500 font-bold">
                        <Calendar className="w-3.5 h-3.5 mr-1" /> {(item as EventBookmark).date}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 leading-tight text-slate-900">{item.name}</h3>
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center text-[11px] text-gray-600 font-bold">
                        <Building2 className="w-3.5 h-3.5 mr-2 text-gray-400" /> {(item as EventBookmark).organizer}
                      </div>
                      <div className="flex items-center text-[11px] text-gray-600 font-bold">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-gray-400" /> {(item as EventBookmark).location}
                      </div>
                    </div>
                    <p className="text-[12px] text-gray-500 mb-5 line-clamp-2 font-medium">{(item as EventBookmark).excerpt}</p>
                    <div className="mt-auto flex gap-2">
                      <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-[12px] font-bold py-2 rounded-lg hover:bg-gray-50">Details</button>
                      <button className="flex-1 bg-brand-blue text-white text-[12px] font-bold py-2 rounded-lg hover:bg-blue-700">Register Now</button>
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'Entrance' && (
                <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col h-full shadow-sm hover:border-blue-500/20 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-11 h-11 rounded-xl border border-gray-100 flex items-center justify-center bg-gray-50 overflow-hidden">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-1">
                          <span className="truncate max-w-[120px]">{(item as EntranceBookmark).institution}</span>
                          {(item as EntranceBookmark).verified && <BadgeCheck className="w-3.5 h-3.5 fill-blue-500 text-white" />}
                        </h3>
                        <span className="flex items-center gap-1 text-[11px] text-gray-500 font-bold">
                          <MapPin className="w-2.5 h-2.5" /> Nepal
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeBookmark(item.id)}
                      className="bg-blue-50 p-1.5 rounded-lg text-brand-blue"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <h4 className="text-[16px] font-bold text-slate-900 mb-3 leading-tight">{item.name}</h4>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(item as EntranceBookmark).tags?.map((tag, idx) => (
                      <span key={idx} className={`px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1 ${
                        tag.type === 'alert' ? 'bg-red-50 text-red-500' : 
                        tag.type === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-600'
                      }`}>
                        {iconMap[tag.icon]} {tag.text}
                      </span>
                    ))}
                  </div>
                  <div className="bg-[#f8fafc] rounded-xl p-2.5 flex flex-col gap-2 mb-4 border border-[#f1f5f9]">
                    <div className="flex items-center gap-2 text-[12px] text-[#475569] font-bold">
                      <Clock className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-red-500">Ends: {(item as EntranceBookmark).deadline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-[#475569] font-bold">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{(item as EntranceBookmark).eligibility}</span>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-col gap-2">
                    <button className="w-full bg-brand-blue text-white font-bold py-2.5 rounded-lg text-[13px] hover:bg-blue-700 flex items-center justify-center gap-2">
                      <PlayCircle className="w-4 h-4" /> Start Mock Test
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-slate-600 font-bold text-[12px] rounded-lg hover:bg-gray-50">
                        <Bell className="w-3.5 h-3.5" /> Notify
                      </button>
                      <button className="flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-slate-600 font-bold text-[12px] rounded-lg hover:bg-gray-50">
                        <Send className="w-3.5 h-3.5" /> Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {item.type === 'Admissions' && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm h-full hover:border-blue-500/20 transition-all">
                  <div className="p-2.5 pb-0">
                    <div className="relative h-28 w-full bg-gray-200 rounded-lg overflow-hidden">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2.5 left-0 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-r-md uppercase">
                        Admission Open
                      </div>
                      <button 
                        onClick={() => removeBookmark(item.id)}
                        className="absolute top-2 right-2 z-10 bg-white/90 p-1.5 rounded-lg text-brand-blue shadow-sm"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col grow">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h2 className="text-[#0f172a] text-[18px] font-bold leading-tight truncate">{item.name}</h2>
                      <BadgeCheck className="w-5 h-5 fill-blue-600 text-white shrink-0" />
                    </div>
                    <div className="flex items-center text-[11px] text-[#64748b] mb-2 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      <span>{(item as AdmissionBookmark).rating}</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <Award className="w-3.5 h-3.5 mr-1" />
                      <span>{(item as AdmissionBookmark).collegeType}</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      <span className="truncate">{(item as AdmissionBookmark).location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-3 font-bold">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{(item as AdmissionBookmark).website}</span>
                    </div>
                    <hr className="border-gray-100 mb-3" />
                    <ul className="space-y-1.5 mb-4">
                      {(item as AdmissionBookmark).programs?.map((prog, pIdx) => (
                        <li key={pIdx} className="flex justify-between items-center text-[12px]">
                          <span className="font-bold text-slate-800">{prog.name}</span>
                          <span className={`font-bold text-[10px] ${prog.status === 'Closing Soon' ? 'text-red-500' : 'text-emerald-500'}`}>{prog.status}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-dotted border-gray-200 mt-auto mb-4 w-full" />
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button className="flex-1 py-1.5 bg-gray-50 text-slate-700 font-bold border border-gray-200 rounded-md text-[11px]">Mock Test</button>
                        <button className="flex-1 py-1.5 bg-blue-50 text-blue-700 font-bold border border-blue-100 rounded-md text-[11px]">Ask Question</button>
                      </div>
                      <button className="w-full py-2.5 bg-brand-blue hover:bg-blue-800 text-white font-bold rounded-md text-[12px]">Apply Now</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div id="empty-state" className="flex flex-col items-center justify-center py-24 px-4 text-center fade-in bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Bookmark className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">No bookmarks in this category</h3>
          <p className="text-slate-500 max-w-md mx-auto text-base">
            You haven't saved any items here yet. Keep exploring the directory to build your perfect application shortlist.
          </p>
          <button className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-200">
            Explore Directory
          </button>
        </div>
      )}
    </div>
  )
}
