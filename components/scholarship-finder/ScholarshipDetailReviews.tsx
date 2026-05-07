"use client";

import { useState } from "react";

const MOCK_REVIEWS = [
  {
    author_name: "Sunil Kumar Mandal",
    role: "Project Shiksha Scholarship Holder-2081",
    rating: "5.0",
    date: "updated on 22 Apr 2026",
    likes: "Full financial support, accommodation, meals, and mentoring. The program gave me hope for a better future and the support system is amazing.",
    dislikes: "Competitive selection process makes it difficult for many deserving students to get selected.",
    like_count: 32,
    dislike_count: 3,
  },
  {
    author_name: "Rita Pariyar",
    role: "Project Shiksha Scholarship Holder-2081",
    rating: "5.0",
    date: "updated on 20 Apr 2026",
    likes: "Safe accommodation, supportive environment, quality education. As a girl from a remote village, this scholarship opened doors I never thought possible.",
    dislikes: "Limited seats available. Many deserving students miss out due to the limited capacity.",
    like_count: 28,
    dislike_count: 1,
  },
  {
    author_name: "Aman Thapa",
    role: "Partially Funded Recipient-2081",
    rating: "4.0",
    date: "updated on 18 Apr 2026",
    likes: "Tuition support, guidance, networking opportunities. The program is well-organized and the team is very supportive throughout the journey.",
    dislikes: "Need more partial scholarship options. The current coverage is limited and doesn't cover accommodation and meals.",
    like_count: 19,
    dislike_count: 5,
  },
];

export default function ReviewTab({ scholarship }: { scholarship: any }) {
  const reviews = Array.isArray(scholarship.reviews) && scholarship.reviews.length > 0
    ? scholarship.reviews
    : MOCK_REVIEWS;

  const [reactions, setReactions] = useState<Record<string, { liked: boolean; disliked: boolean }>>({});

  const toggleReaction = (idx: number, type: "like" | "dislike") => {
    const key = String(idx);
    setReactions(prev => {
      const current = prev[key] || { liked: false, disliked: false };
      if (type === "like") {
        if (current.liked) return { ...prev, [key]: { ...current, liked: false } };
        return { ...prev, [key]: { liked: true, disliked: false } };
      }
      if (current.disliked) return { ...prev, [key]: { ...current, disliked: false } };
      return { ...prev, [key]: { liked: false, disliked: true } };
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Student Reviews</h2>
        <p className="text-[14px] text-gray-500 mt-1">What our scholarship recipients have to say</p>
      </div>
      <div className="space-y-6">
        {reviews.map((review: any, idx: number) => {
          const rKey = String(idx);
          const r = reactions[rKey] || { liked: false, disliked: false };
          return (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-full relative overflow-hidden pb-8">
              <div className="absolute left-0 top-[36px] w-[4px] h-[48px] bg-blue-600 rounded-tr-[2px] rounded-br-[2px]" />
              <div className="p-6 md:p-8 pt-7">
                <div className="flex items-start gap-4">
                  <div className="w-[60px] h-[60px] rounded-full bg-blue-100 border-2 border-white overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                    {review.avatar_url ? (
                      <img src={review.avatar_url} alt={review.author_name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-blue-600 font-bold text-xl">{(review.author_name || "?")[0]}</span>
                    )}
                  </div>
                  <div className="flex flex-col mt-[-2px]">
                    <h2 className="text-blue-600 font-bold text-lg leading-tight">{review.author_name}</h2>
                    <h3 className="text-gray-600 font-medium text-[15px] mt-0.5">{review.role || review.title || ""}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-blue-600 text-white flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-xs font-bold shadow-sm">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
                        </svg>
                        {review.rating || "5.0"}
                      </div>
                      <span className="text-gray-400 text-xs font-bold">&bull;</span>
                      <span className="text-gray-400 text-[13px]">{review.date || review.updated_at || "Recently"}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 space-y-5">
                  {review.likes && (
                    <div>
                      <h4 className="text-green-600 font-bold text-[16px] mb-1.5">Likes:</h4>
                      <p className="text-gray-600 text-[15px] leading-relaxed">{review.likes}</p>
                    </div>
                  )}
                  {review.dislikes && (
                    <div>
                      <h4 className="text-red-600 font-bold text-[16px] mb-1.5">Dislikes:</h4>
                      <p className="text-gray-600 text-[15px] leading-relaxed">{review.dislikes}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 text-[13px] font-medium">Is this useful?</span>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => toggleReaction(idx, "like")}
                        className={`flex items-center gap-1.5 transition-colors focus:outline-none ${r.liked ? "text-blue-600" : "text-gray-400 hover:text-blue-600"}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={r.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                        </svg>
                        <span className="text-xs font-semibold">{review.like_count || 0}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleReaction(idx, "dislike")}
                        className={`flex items-center gap-1.5 transition-colors focus:outline-none ${r.disliked ? "text-blue-600" : "text-gray-400 hover:text-blue-600"}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={r.disliked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/>
                        </svg>
                        <span className="text-xs font-semibold">{review.dislike_count || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
