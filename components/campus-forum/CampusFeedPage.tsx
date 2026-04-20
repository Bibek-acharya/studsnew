"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Image,
  BarChart2,
  Video,
  MoreVertical,
  Share,
  EyeOff,
  Flag,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Repeat,
  Share2,
  BadgeCheck,
  ChevronDown,
  Calendar,
  MapPin,
} from "lucide-react";

interface CommentProps {
  avatar: string;
  username: string;
  role?: string;
  isAuthor?: boolean;
  time: string;
  content: string;
  upvotes: number;
  replies?: CommentProps[];
}

const CommentItem: React.FC<{ comment: CommentProps; depth?: number }> = ({ comment, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="relative">
      <div className={`flex gap-3 relative z-10 bg-white ${depth > 0 ? "" : ""}`}>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm">
          {comment.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between group/btn">
            <div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold text-[#1B1F3B]">{comment.username}</span>
                {comment.isAuthor && (
                  <span className="bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Author</span>
                )}
                {comment.role && (
                  <span className="text-xs text-gray-400 font-medium">{comment.role}</span>
                )}
                <span className="text-gray-400 text-xs font-medium">{comment.time}</span>
              </div>
            </div>
            <button className="text-gray-400 opacity-0 group-hover/btn:opacity-100 transition">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[15px] text-[#1B1F3B] mt-1.5 leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-[#5C607A] font-semibold">
            <div className="flex items-center gap-1">
              <button className="hover:bg-gray-100 p-1 rounded transition">
                <ArrowUp className="w-4 h-4" />
              </button>
              <span className="w-4 text-center text-[13px]">{comment.upvotes}</span>
              <button className="hover:bg-gray-100 p-1 rounded transition">
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
            <button className="hover:text-gray-800 transition">Reply</button>
            <button className="hover:text-gray-800 transition">Share</button>
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <>
          <div className="absolute left-4 top-8 bottom-0 w-[2px] bg-gray-100 z-0" />
          <div className="pl-11 pt-4 relative z-10">
            {comment.replies.map((reply, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-7 top-4 w-6 h-[2px] bg-gray-100" />
                <CommentItem comment={reply} depth={depth + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PostCard: React.FC<{
  communityAvatar: string;
  communityName: string;
  username: string;
  userTag: string;
  time: string;
  title: string;
  content: string;
  showMore?: boolean;
  imageUrl?: string;
  upvotes: number;
  comments: number;
  initialComments?: CommentProps[];
}> = ({ communityAvatar, communityName, username, userTag, time, title, content, showMore, imageUrl, upvotes, comments, initialComments }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-md  border border-gray-100 p-4 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${communityAvatar} rounded-md flex items-center justify-center text-white font-bold shrink-0`}>
            {communityName.substring(0, 3).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm hover:underline cursor-pointer">{communityName}</h3>
              <span className="text-xs text-gray-400 font-medium">• {time}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{username} • {userTag}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-blue-600 border border-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full text-xs font-semibold transition">
            Join
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-full transition"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-100 z-50 py-2">
                <button className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition">
                  <Share className="w-5 h-5 text-gray-400" /> Share via...
                </button>
                <button className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition">
                  <EyeOff className="w-5 h-5 text-gray-400" /> Not interested
                </button>
                <button className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition">
                  <Flag className="w-5 h-5 text-red-500" /> Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 className="font-bold text-gray-900 text-base mb-2">{title}</h2>
      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
        {content}
        {showMore && <span className="text-gray-400 cursor-pointer hover:underline"> more</span>}
      </p>

      {imageUrl && (
        <div className="rounded-md overflow-hidden border border-gray-100 bg-gray-50 h-48 md:h-64 relative">
          <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center flex-wrap gap-2 mt-4">
        <div className="flex items-center bg-[#F2F4F7] rounded-full">
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-[#5C607A] hover:bg-gray-200 rounded-l-full font-semibold text-[13px] transition">
            <ArrowUp className="w-4 h-4 text-indigo-500" /> {upvotes}
          </button>
          <div className="w-px h-4 bg-gray-300" />
          <button className="px-3.5 py-1.5 text-[#5C607A] hover:bg-gray-200 rounded-r-full transition">
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#F2F4F7] hover:bg-gray-200 rounded-full text-[#5C607A] font-semibold text-[13px] transition"
        >
          <MessageSquare className="w-4 h-4 text-[#7A809D]" /> {comments} Comment
        </button>

        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#F2F4F7] hover:bg-gray-200 rounded-full text-[#5C607A] font-semibold text-[13px] transition">
          <Repeat className="w-4 h-4 text-[#7A809D]" /> Repost
        </button>

        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#F2F4F7] hover:bg-gray-200 rounded-full text-[#5C607A] font-semibold text-[13px] transition">
          <Share2 className="w-4 h-4 text-[#7A809D]" /> Share
        </button>
      </div>

      {isCommentsOpen && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl shrink-0">✍️</span>
            <div className="flex-1 flex items-center justify-between border border-gray-300 rounded-full px-4 py-2 bg-white">
              <input
                type="text"
                placeholder="Add a comment anonymously"
                className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400 font-medium"
              />
              <div className="flex items-center gap-3 text-gray-400 shrink-0">
                <button className="font-bold text-[11px] hover:text-gray-600 uppercase tracking-wider">GIF</button>
                <button className="hover:text-gray-600">
                  <Image className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-5 text-sm">
            <h3 className="font-semibold text-gray-800">Comments</h3>
            <button className="flex items-center gap-1 font-semibold text-gray-600 hover:text-gray-900 transition">
              Popularity <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {initialComments?.map((comment, idx) => (
              <CommentItem key={idx} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PollPost: React.FC<{
  communityAvatar: string;
  communityName: string;
  username: string;
  userTag: string;
  time: string;
  title: string;
  content: string;
  options: { label: string; percentage: number }[];
  totalVotes: string;
  timeLeft: string;
  upvotes: number;
  comments: number;
}> = ({ communityAvatar, communityName, username, userTag, time, title, content, options, totalVotes, timeLeft, upvotes, comments }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-md  border border-gray-100 p-4 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${communityAvatar} rounded-md flex items-center justify-center text-white font-bold shrink-0`}>
            {communityName.substring(0, 3).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm hover:underline cursor-pointer">{communityName}</h3>
              <span className="text-xs text-gray-400 font-medium">• {time}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{username} • {userTag}</p>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-full transition"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-100 z-50 py-2">
              <button className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition">
                <Share className="w-5 h-5 text-gray-400" /> Share via...
              </button>
              <button className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition">
                <EyeOff className="w-5 h-5 text-gray-400" /> Not interested
              </button>
              <button className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition">
                <Flag className="w-5 h-5 text-red-500" /> Report
              </button>
            </div>
          )}
        </div>
      </div>

      <h2 className="font-bold text-gray-900 text-base mb-2">{title}</h2>
      <p className="text-sm text-gray-700 mb-4">{content}</p>

      <div className="space-y-2">
        {options.map((option, idx) => (
          <div
            key={idx}
            className="relative bg-gray-50 border border-gray-200 rounded-md p-3 overflow-hidden cursor-pointer hover:bg-gray-100 transition"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-blue-100 z-0 rounded-l-lg"
              style={{ width: `${option.percentage}%` }}
            />
            <div className="relative z-10 flex justify-between text-sm font-medium text-gray-700">
              <span>{option.label}</span>
              <span>{option.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-3 font-medium">{totalVotes} votes · {timeLeft}</div>

      <div className="flex items-center flex-wrap gap-2 mt-4">
        <div className="flex items-center bg-[#F2F4F7] rounded-full">
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-[#5C607A] hover:bg-gray-200 rounded-l-full font-semibold text-[13px] transition">
            <ArrowUp className="w-4 h-4" /> {upvotes}
          </button>
          <div className="w-px h-4 bg-gray-300" />
          <button className="px-3.5 py-1.5 text-[#5C607A] hover:bg-gray-200 rounded-r-full transition">
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#F2F4F7] hover:bg-gray-200 rounded-full text-[#5C607A] font-semibold text-[13px] transition">
          <MessageSquare className="w-4 h-4 text-[#7A809D]" /> {comments} Comment
        </button>

        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#F2F4F7] hover:bg-gray-200 rounded-full text-[#5C607A] font-semibold text-[13px] transition">
          <Repeat className="w-4 h-4 text-[#7A809D]" /> Repost
        </button>

        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#F2F4F7] hover:bg-gray-200 rounded-full text-[#5C607A] font-semibold text-[13px] transition">
          <Share2 className="w-4 h-4 text-[#7A809D]" /> Share
        </button>
      </div>
    </div>
  );
};

const CampusFeedPage: React.FC = () => {
  const comments1: CommentProps[] = [
    {
      avatar: "🍇",
      username: "senior_dai",
      role: "BCT 3rd Year, Pulchowk",
      time: "1d",
      content: "I took a drop year. Unless you are extremely disciplined and okay with studying 8+ hours a day while your friends are enjoying their first semesters, do not do it. The syllabus is the same everywhere, skills matter more.",
      upvotes: 45,
      replies: [
        {
          avatar: "🎳",
          username: "ioe_dreamer",
          isAuthor: true,
          time: "12h",
          content: "@senior_dai Thanks for the honest reply. Did the drop year affect your placements or internship opportunities later on?",
          upvotes: 12,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 justify-center w-full">
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="hidden lg:block w-[280px] shrink-0 space-y-6 sticky top-6 h-fit">
          {/* Profile Card */}
          <div className="bg-white rounded-md  border border-gray-100 p-5 flex flex-col items-center text-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 border-4 border-white ">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-bold text-gray-900 text-lg">Jagdish Dhami</h2>
            <a href="#" className="text-blue-600 text-sm font-medium mt-1 hover:underline">
              Complete Your Profile
            </a>
          </div>

          {/* Discover Communities */}
          <div className="bg-white rounded-md  border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Student Communities</h3>
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-md bg-orange-100 flex items-center justify-center overflow-hidden shrink-0">
                  <span className="text-xl">📐</span>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">IOE Engineering Prep</span>
              </a>
              <a href="#" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                  <span className="text-xl">💻</span>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">IT (CSIT/BCA/BIT)</span>
              </a>
              <a href="#" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center overflow-hidden shrink-0">
                  <span className="text-xl">🩺</span>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">CEE Medical Prep</span>
              </a>
              <a href="#" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-md bg-purple-100 flex items-center justify-center overflow-hidden shrink-0 text-xl">
                  🏛️
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">Kathmandu University</span>
              </a>
              <a href="#" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-md bg-yellow-100 flex items-center justify-center overflow-hidden shrink-0 text-xl">
                  🎒
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">Tribhuvan University</span>
              </a>
            </div>
        
          </div>
        </div>

        {/* ================= MAIN FEED ================= */}
        <div className="w-full max-w-[600px] space-y-4">
          {/* Create Post Box */}
          <div className="bg-white rounded-md  border border-gray-100 p-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl shrink-0">🎓</span>
              <input
                type="text"
                placeholder="Ask anonymously about courses, colleges, or entrance exams..."
                className="bg-transparent border-none w-full text-sm outline-none text-gray-700 placeholder-gray-400 font-medium"
              />
            </div>
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                <Image className="w-4 h-4 text-blue-500" /> Image
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition">
                <BarChart2 className="w-4 h-4 text-purple-500" /> Poll
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition">
                <Video className="w-4 h-4 text-red-500" /> Video
              </button>
            </div>
          </div>



          {/* Feed Post 1 */}
          <PostCard
            communityAvatar="bg-teal-600"
            communityName="Engineering & IOE"
            username="ioe_dreamer"
            userTag="Class 12 Graduate"
            time="1d"
            title="Private college vs Drop Year for Computer Engineering?"
            content="I scored decent in my +2 but my IOE entrance rank is around 3200. I really want to study at Pulchowk or Thapathali, but my family is suggesting I just enroll in a private affiliated college and not waste a year. Has anyone here taken a drop year for IOE? Is the mental pressure worth it? Need genuine advice."
            showMore
            imageUrl="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"
            upvotes={214}
            comments={89}
            initialComments={comments1}
          />

          {/* Feed Post 2 (Poll) */}
          <PollPost
            communityAvatar="bg-indigo-600"
            communityName="Academics"
            username="confused_fresher"
            userTag="High School Student"
            time="3h"
            title="Which IT course is currently the best in Nepal?"
            content="Considering job prospects, syllabus freshness, and overall value. Pls vote based on your actual experience studying in Nepal!"
            options={[
              { label: "BSc. CSIT (TU / PU)", percentage: 45 },
              { label: "BCA (TU / PoU)", percentage: 30 },
              { label: "BIT (TU / Foreign Affiliated)", percentage: 15 },
              { label: "BIM / BBA-IT", percentage: 10 },
            ]}
            totalVotes="1,248"
            timeLeft="2 days left"
            upvotes={89}
            comments={124}
          />
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="hidden xl:block w-[300px] shrink-0 space-y-6 sticky top-6 h-fit">
          {/* Trending Discussions */}
          <div className="bg-white rounded-md  border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-orange-500 text-xl">🔥</span>
              <h3 className="font-bold text-gray-900 text-sm">Trending Discussions</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 text-sm leading-snug cursor-pointer hover:text-blue-600 transition">
                  When are the TU BSc.CSIT 4th sem results coming out?
                </h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">TU UPDATES</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MessageSquare className="w-3 h-3" /> 62 Replies
                  </div>
                </div>
              </div>
              <div className="h-px bg-gray-100" />
              <div>
                <h4 className="font-bold text-gray-800 text-sm leading-snug cursor-pointer hover:text-blue-600 transition">
                  Best YouTube channels or resources for CEE Physics prep?
                </h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">MEDICAL PREP</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MessageSquare className="w-3 h-3" /> 34 Replies
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 text-center text-blue-600 font-bold text-xs tracking-wider hover:bg-blue-50 rounded-md transition uppercase">
              VIEW ALL DISCUSSIONS
            </button>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-md  border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900 text-sm">Upcoming Events</h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <div className="bg-blue-50 border border-blue-100 rounded-md p-2 text-center min-w-[3rem]">
                  <div className="text-blue-600 text-[10px] font-bold uppercase">MAY</div>
                  <div className="text-blue-900 font-bold text-lg leading-none mt-0.5">15</div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">KU IT Meet 2024</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" /> Kathmandu University, Dhulikhel
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="bg-orange-50 border border-orange-100 rounded-md p-2 text-center min-w-[3rem]">
                  <div className="text-orange-600 text-[10px] font-bold uppercase">JUN</div>
                  <div className="text-orange-900 font-bold text-lg leading-none mt-0.5">10</div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">Locust Hackathon</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" /> Pulchowk Campus, Lalitpur
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusFeedPage;
