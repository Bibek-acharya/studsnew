"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/AuthContext";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  return (
    <div className="flex items-center gap-1 text-2xl cursor-pointer">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`transition-colors ${star <= value ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`}
          onClick={() => onChange(star)}
        >
          <i className="fa-solid fa-star"></i>
        </span>
      ))}
      <span className="text-[14px] text-gray-500 ml-2">{labels[value]}</span>
    </div>
  );
}

function ReviewModal({ scholarshipId, onClose }: { scholarshipId: string | number; onClose: () => void }) {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [rating, setRating] = useState(0);
  const [likes, setLikes] = useState("");
  const [dislikes, setDislikes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" style={{ background: "rgba(0,0,255,0.95)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[550px] max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#f0fdf4] border-b border-[#bbf7d0] py-3 px-6 flex justify-center items-center gap-3 text-[14px] text-[#166534]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd"/></svg>
          <span className="font-medium">Your review helps others make informed decisions.</span>
        </div>
        <div className="px-6 sm:px-10 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[22px] font-bold text-[#1e293b]">Write a Review</h2>
            <button type="button" onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
              <i className="fa-solid fa-xmark text-gray-500 text-lg"></i>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Name <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white"
                placeholder="Enter your full name" />
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Designation <span className="text-red-500">*</span></label>
              <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} required
                className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white"
                placeholder="Enter your designation" />
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">Rate Us <span className="text-red-500">*</span></label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">What did you like? <span className="text-red-500">*</span></label>
              <textarea value={likes} onChange={(e) => setLikes(e.target.value)} required rows={3}
                className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white resize-none"
                placeholder="Share what you liked about this scholarship..." />
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">What could be improved?</label>
              <textarea value={dislikes} onChange={(e) => setDislikes(e.target.value)} rows={3}
                className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white resize-none"
                placeholder="Share any suggestions or concerns..." />
            </div>
            <div className="pt-4">
              <button type="submit" className="w-full bg-[#0000ff] hover:bg-[#0000cc] text-white font-bold text-[16px] py-3.5 rounded-lg transition-all">
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ReviewTab({ scholarship }: { scholarship: any }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setShowModal(true);
  };
  const reviews = Array.isArray(scholarship.reviews) && scholarship.reviews.length > 0
    ? scholarship.reviews
    : null;

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

  if (!reviews) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <i className="fa-solid fa-pen-to-square text-2xl"></i>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Be the First to Review</h3>
          <p className="mb-6 max-w-md text-[14px] text-gray-500">No reviews yet. Share your experience and help others make informed decisions about this scholarship.</p>
          <button
            type="button"
            onClick={handleWriteReview}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-[14px] font-bold text-white transition hover:bg-blue-700 shadow-sm"
          >
            <i className="fa-solid fa-pen-to-square text-sm"></i>
            Write a Review
          </button>
        </div>
        {showModal && <ReviewModal scholarshipId={scholarship.id} onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return (
    <>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900">Student Reviews</h2>
            <p className="text-[14px] text-gray-500 mt-1">What our scholarship recipients have to say</p>
          </div>
          <button type="button" onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-blue-700 shadow-sm">
            <i className="fa-solid fa-pen-to-square text-xs"></i>
            Write a Review
          </button>
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
      {showModal && <ReviewModal scholarshipId={scholarship.id} onClose={() => setShowModal(false)} />}
    </>
  );
}
