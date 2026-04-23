'use client'

import { useState } from 'react'
import {
  Search, MessageSquare, Send, Paperclip, Info,
  GraduationCap, Link2, FileText, Phone, Mail,
  Building2, MapPin, Calendar, ChevronRight, CheckCheck,
  X, Copy
} from 'lucide-react'

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderRole: 'student' | 'college'
  messageType: 'text' | 'system' | 'document'
  content: string
  timestamp: number
  readStatus: boolean
}

interface Conversation {
  id: string
  participants: { id: string; name: string; avatar: string; role: string }[]
  type: string
  status: string
  lastMessage: string
  updatedAt: number
  unreadCount: Record<string, number>
}

const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    participants: [
      { id: 'usr_student_1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=11', role: 'student' },
      { id: 'usr_college_1', name: 'Stanford University', avatar: 'https://i.pravatar.cc/150?img=20', role: 'college' }
    ],
    type: 'Admission',
    status: 'Active',
    lastMessage: 'Your application is under review.',
    updatedAt: Date.now(),
    unreadCount: { usr_student_1: 1, usr_college_1: 0 }
  },
  {
    id: 'conv_2',
    participants: [
      { id: 'usr_student_1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=11', role: 'student' },
      { id: 'usr_college_2', name: 'MIT Engineering', avatar: 'https://i.pravatar.cc/150?img=15', role: 'college' }
    ],
    type: 'Inquiry',
    status: 'Resolved',
    lastMessage: 'Thank you for the information.',
    updatedAt: Date.now() - 86400000,
    unreadCount: { usr_student_1: 0, usr_college_2: 0 }
  }
]

const mockMessages: Message[] = [
  { id: 'msg_1', conversationId: 'conv_1', senderId: 'usr_student_1', senderRole: 'student', messageType: 'text', content: 'Hi, I submitted my documents. Could you verify?', timestamp: Date.now() - 3600000, readStatus: true },
  { id: 'msg_2', conversationId: 'conv_1', senderId: 'usr_college_1', senderRole: 'college', messageType: 'system', content: 'Application #8492 submitted successfully.', timestamp: Date.now() - 3500000, readStatus: true },
  { id: 'msg_3', conversationId: 'conv_1', senderId: 'usr_college_1', senderRole: 'college', messageType: 'text', content: 'Your application is under review. We will get back to you shortly.', timestamp: Date.now() - 100000, readStatus: false }
]

const mockDetails: Record<string, { title: string; role: string; items: { icon: string; label: string; value: string; copy?: boolean }[] }> = {
  'usr_college_1': {
    title: 'About College',
    role: 'University',
    items: [
      { icon: 'building-2', label: 'Department:', value: 'Admissions Office' },
      { icon: 'link-2', label: 'Website URL:', value: 'stanford.edu', copy: true },
      { icon: 'map-pin', label: 'Location:', value: 'Stanford, CA' },
      { icon: 'phone', label: 'Phone:', value: '(650) 723-2300' },
      { icon: 'mail', label: 'Email:', value: 'admission@stanford.edu' }
    ]
  },
  'usr_college_2': {
    title: 'About College',
    role: 'University',
    items: [
      { icon: 'building-2', label: 'Department:', value: 'Engineering Dept' },
      { icon: 'link-2', label: 'Website URL:', value: 'mit.edu', copy: true },
      { icon: 'map-pin', label: 'Location:', value: 'Cambridge, MA' },
      { icon: 'phone', label: 'Phone:', value: '(617) 253-1000' },
      { icon: 'mail', label: 'Email:', value: 'admissions@mit.edu' }
    ]
  }
}

const currentUserId = 'usr_student_1'
const filters = ['All', 'Admission', 'Inquiry', 'Counseling']

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'graduation-cap': GraduationCap,
  'link-2': Link2,
  'file-text': FileText,
  'phone': Phone,
  'mail': Mail,
  'building-2': Building2,
  'map-pin': MapPin,
  'calendar': Calendar,
}

export default function ChatSection() {
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [messageInput, setMessageInput] = useState('')
  const [showContactInfo, setShowContactInfo] = useState(false)

  const filteredConversations = conversations
    .filter(c => c.participants.some(p => p.id === currentUserId))
    .filter(c => {
      if (searchQuery) {
        const other = c.participants.find(p => p.id !== currentUserId)
        return other?.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return true
    })
    .filter(c => activeFilter === 'All' || c.type === activeFilter)
    .sort((a, b) => b.updatedAt - a.updatedAt)

  const activeConversation = conversations.find(c => c.id === activeConvId)
  const otherParticipant = activeConversation?.participants.find(p => p.id !== currentUserId)
  const conversationMessages = activeConvId
    ? messages.filter(m => m.conversationId === activeConvId).sort((a, b) => a.timestamp - b.timestamp)
    : []

  const handleSend = () => {
    if (!messageInput.trim() || !activeConvId) return

    const newMessage: Message = {
      id: 'msg_' + Date.now(),
      conversationId: activeConvId,
      senderId: currentUserId,
      senderRole: 'student',
      messageType: 'text',
      content: messageInput,
      timestamp: Date.now(),
      readStatus: false
    }

    setMessages(prev => [...prev, newMessage])
    setMessageInput('')

    const conv = conversations.find(c => c.id === activeConvId)
    if (conv) {
      const otherUserId = conv.participants.find(p => p.id !== currentUserId)?.id || ''
      setConversations(prev => prev.map(c =>
        c.id === activeConvId
          ? { ...c, lastMessage: messageInput, updatedAt: Date.now(), unreadCount: { ...c.unreadCount, [otherUserId]: (c.unreadCount[otherUserId] || 0) + 1 } }
          : c
      ))
    }
  }

  const selectConversation = (id: string) => {
    setActiveConvId(id)
    setConversations(prev => prev.map(c =>
      c.id === id ? { ...c, unreadCount: { ...c.unreadCount, [currentUserId]: 0 } } : c
    ))
    setShowContactInfo(false)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status: string) => {
    if (status === 'Active') return 'bg-green-100 text-green-700'
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="h-[calc(100vh-140px)] mt-6">
      <div className="flex h-full bg-white rounded-md  border border-slate-200 overflow-hidden">
        {/* LEFT PANEL: Conversation List */}
        <aside className="w-full md:w-[380px] bg-white border-r border-slate-100 flex flex-col h-full shrink-0 hidden md:flex">
          {/* Header */}
          {/* <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center font-bold text-white">
                S
              </div>
              <h1 className="text-lg font-bold tracking-tight">StudSphere</h1>
            </div>
          </div> */}

          {/* Search */}
          <div className="p-4 border-b border-slate-100 bg-white">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${activeFilter === f
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">No conversations found.</div>
            ) : (
              filteredConversations.map(conv => {
                const other = conv.participants.find(p => p.id !== currentUserId)
                const unread = conv.unreadCount?.[currentUserId] || 0
                const isActive = activeConvId === conv.id

                return (
                  <div
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-colors mx-2 ${isActive
                      ? 'bg-blue-100 border rounded-md'
                      : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                      }`}
                  >
                    <div className="flex gap-3">
                      <img src={other?.avatar} className="w-10 h-10 rounded-full object-cover  bg-white" alt="Avatar" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className={`text-sm font-bold text-slate-900 truncate ${unread > 0 ? 'text-black' : ''}`}>
                            {other?.name}
                          </h4>
                          <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                            {formatTime(conv.updatedAt)}
                          </span>
                        </div>
                        <p className={`text-sm text-slate-500 truncate ${unread > 0 ? 'font-semibold text-slate-800' : ''}`}>
                          {conv.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-1.5">
                            <span className="text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold bg-blue-50 text-primary border border-blue-100">
                              {conv.type}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold ${getStatusColor(conv.status)}`}>
                              {conv.status}
                            </span>
                          </div>
                          {unread > 0 && (
                            <div className="w-5 h-5 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                              {unread}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </aside>

        {/* MIDDLE PANEL: Chat Window */}
        <main className="flex-1 flex flex-col h-full bg-[#FAFAFA] relative">
          {/* Empty State */}
          {!activeConvId && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
              <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Your Messages</h2>
              <p className="text-slate-500 text-sm max-w-sm text-center">Select a conversation from the left panel to start messaging, or start a new inquiry.</p>
            </div>
          )}

          {/* Chat Header */}
          {activeConvId && otherParticipant && (
            <header className="h-[76px] px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img src={otherParticipant.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-100" alt="Avatar" />
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">{otherParticipant.name}</h2>
                  <span className="text-xs text-slate-500 capitalize">{otherParticipant.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowContactInfo(!showContactInfo)}
                  className={`p-2 rounded-md transition-colors ${showContactInfo ? 'bg-primary text-white' : 'text-slate-400 hover:text-primary hover:bg-blue-50'}`}
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </header>
          )}

          {/* Messages Area */}
          {activeConvId && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {conversationMessages.length === 0 ? (
                <div className="text-center text-slate-400 text-sm mt-10">Start the conversation...</div>
              ) : (
                conversationMessages.map(msg => {
                  const isMine = msg.senderId === currentUserId

                  if (msg.messageType === 'system') {
                    return (
                      <div key={msg.id} className="flex justify-center my-4">
                        <div className="bg-slate-100 border border-slate-200 text-slate-600 text-xs px-4 py-1.5 rounded-full font-medium flex items-center gap-2">
                          <Info className="w-3.5 h-3.5" />
                          {msg.content}
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4`}>
                      <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3.5 rounded-md  ${isMine ? 'bg-primary text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'}`}>
                          {msg.messageType === 'document' && (
                            <div className="flex items-center gap-2 mb-2 p-2 bg-slate-200 rounded-md">
                              <FileText className="w-5 h-5" />
                              <span className="text-sm font-medium underline cursor-pointer">Attachment.pdf</span>
                            </div>
                          )}
                          <p className="text-[14px] leading-relaxed break-words whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <div className="text-[10px] font-medium text-slate-400 mt-1 flex items-center gap-1 px-1">
                          {formatTime(msg.timestamp)}
                          {isMine && (
                            <CheckCheck className={`w-3.5 h-3.5 ${msg.readStatus ? 'text-primary' : 'text-slate-300'}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Input Area */}
          {activeConvId && (
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="max-w-4xl mx-auto relative flex items-end gap-2">
                <button className="p-3 text-slate-400 hover:text-primary transition-colors rounded-full hover:bg-blue-50 shrink-0">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-md focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-blue-100 transition-all p-1">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    rows={1}
                    placeholder="Type your message here..."
                    className="w-full max-h-32 bg-transparent resize-none text-sm text-slate-800 focus:outline-none p-3 block"
                    style={{ height: 'auto' }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!messageInput.trim()}
                  className="p-3 bg-primary text-white hover:bg-primary-hover transition-colors rounded-full  shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT PANEL: Contact Info */}
        {showContactInfo && activeConversation && otherParticipant && (
          <aside className="hidden xl:flex w-[320px] bg-white border-l border-slate-200 flex-col h-full shrink-0 overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2 sticky top-0 bg-white z-10">
              <h2 className="text-base font-semibold text-slate-900">Contact Info</h2>
              <button onClick={() => setShowContactInfo(false)} className="ml-auto">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-5">
                {mockDetails[otherParticipant.id]?.title || 'About College'}
              </h3>

              <div className="flex items-center gap-4 mb-8">
                <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-slate-50" />
                <div>
                  <h4 className="text-base font-bold text-slate-900 leading-tight">{otherParticipant.name}</h4>
                  <p className="text-sm text-slate-500">{mockDetails[otherParticipant.id]?.role || 'University'}</p>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                {mockDetails[otherParticipant.id]?.items.map((item, idx) => {
                  const IconComponent = iconMap[item.icon] || Info
                  return (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 border border-slate-100">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div
                        className={`min-w-0 flex items-center justify-between w-full group ${item.copy ? 'cursor-pointer' : ''}`}
                        onClick={() => item.copy && copyToClipboard(item.value)}
                      >
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">{item.value}</p>
                        </div>
                        {item.copy && (
                          <Copy className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>


            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
