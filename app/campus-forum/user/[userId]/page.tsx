"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { MessageSquare, Users, ArrowLeft, User, Image, BarChart2, Video, ArrowUp, ArrowDown, MessageCircle, Share2 } from "lucide-react"

const mockUserPosts = [
  {
    id: 1,
    title: "Private college vs Drop Year for Computer Engineering?",
    content: "I scored decent in my +2 but my IOE entrance rank is around 3200. I really want to study at Pulchowk or Thapathali...",
    community: { name: "Engineering & IOE", emoji: "📐" },
    upvotes: 214,
    comments: 89,
    time: "1d"
  },
  {
    id: 2,
    title: "Best resources for BCT first semester?",
    content: "Just started my BCT journey. Can anyone suggest good books and YouTube channels?",
    community: { name: "Engineering & IOE", emoji: "📐" },
    upvotes: 45,
    comments: 23,
    time: "3d"
  }
]

const mockFollowing = [
  { id: 1, emoji: "📐", name: "IOE Engineering Prep", members: 12500 },
  { id: 2, emoji: "💻", name: "IT (CSIT/BCA/BIT)", members: 8200 },
  { id: 3, emoji: "🩺", name: "CEE Medical Prep", members: 5600 },
  { id: 4, emoji: "🏛️", name: "Kathmandu University", members: 4100 }
]

const mockUserData: Record<string, { name: string; type: string; avatar?: string }> = {
  '1': { name: 'Alex Johnson', type: 'Student' },
  '2': { name: 'Jagdish Dhami', type: 'Student' },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.userId as string
  const [activeTab, setActiveTab] = useState<"posts" | "following">("posts")

  const userData = mockUserData[userId] || { name: userId, type: 'Student' }
  const initials = getInitials(userData.name)
  const hasAvatar = !!userData.avatar

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-4">
                {hasAvatar ? (
                  <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-3xl font-bold text-blue-600">{initials}</span>
                )}
              </div>
              <div className="text-white text-center">
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-blue-100">{userData.type}</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold text-sm transition ${
                  activeTab === "posts"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <MessageSquare className="w-4 h-4" /> My Posts
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold text-sm transition ${
                  activeTab === "following"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Users className="w-4 h-4" /> Following
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "posts" && (
              <div className="space-y-4">
                {mockUserPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No posts yet</p>
                  </div>
                ) : (
                  mockUserPosts.map(post => (
                    <div key={post.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{post.community.emoji}</span>
                        <span className="text-xs font-bold text-gray-500">{post.community.name}</span>
                        <span className="text-xs text-gray-400">• {post.time}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ArrowUp className="w-4 h-4" /> {post.upvotes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" /> {post.comments}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "following" && (
              <div className="space-y-3">
                {mockFollowing.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">When you join communities, you'll see them here</p>
                  </div>
                ) : (
                  mockFollowing.map(community => (
                    <div key={community.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">
                          {community.emoji}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{community.name}</h4>
                          <p className="text-xs text-gray-500">{community.members.toLocaleString()} members</p>
                        </div>
                      </div>
                      <button className="text-sm font-bold text-blue-600 hover:underline">
                        View
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
