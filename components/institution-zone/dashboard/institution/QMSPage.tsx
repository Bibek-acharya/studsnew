"use client";
import React, { useMemo, useState } from "react";
import {
  Inbox,
  Search,
  Building,
  Mail,
  Phone,
  CheckCircle2,
  SendHorizonal,
  MousePointerClick,
} from "lucide-react";

type QueryStatus = "open" | "resolved";
type QueryPriority = "normal" | "urgent";
type FilterTab = "all" | "unread" | "pending" | "resolved" | "urgent";

interface Message {
  id: number;
  sender: "student" | "admin";
  text: string;
  time: string;
}

interface QueryItem {
  id: number;
  studentName: string;
  email: string;
  phone: string;
  college: string;
  status: QueryStatus;
  priority: QueryPriority;
  unreadAdmin: boolean;
  timestamp: string;
  messages: Message[];
}

const INITIAL_QUERIES: QueryItem[] = [
  {
    id: 1,
    studentName: "Jagdish Ji",
    email: "jagdish@example.com",
    phone: "+977 980-0000000",
    college: "School of Engineering",
    status: "resolved",
    priority: "normal",
    unreadAdmin: false,
    timestamp: "10:30 AM",
    messages: [
      { id: 101, sender: "student", text: "Hello, what is the deadline for the Civil Engineering internal assessment?", time: "09:00 AM" },
      { id: 102, sender: "admin", text: "Hi Jagdish. The deadline is next Friday. Please submit it via the portal.", time: "10:15 AM" },
      { id: 103, sender: "student", text: "Thank you!", time: "10:30 AM" },
    ],
  },
  {
    id: 2,
    studentName: "Jagdish Ji",
    email: "jagdish@example.com",
    phone: "+977 980-0000000",
    college: "Financial Aid",
    status: "open",
    priority: "normal",
    unreadAdmin: false,
    timestamp: "02:20 PM",
    messages: [
      { id: 201, sender: "student", text: "I have submitted my scholarship form online. When will the interview be scheduled?", time: "01:45 PM" },
      { id: 202, sender: "admin", text: "Hello Jagdish! The committee is reviewing forms now. You will get an email with the interview date by tomorrow evening.", time: "02:20 PM" },
    ],
  },
  {
    id: 3,
    studentName: "Emily Davis",
    email: "emily.d@test.com",
    phone: "+44 7700 900077",
    college: "Admissions Office",
    status: "open",
    priority: "urgent",
    unreadAdmin: true,
    timestamp: "04:18 PM",
    messages: [
      { id: 301, sender: "student", text: "URGENT: My application portal is locked and today is the last day to submit the fee! Please help me reset it.", time: "04:18 PM" },
    ],
  },
];

const QMSPage: React.FC = () => {
  const [queries, setQueries] = useState<QueryItem[]>(INITIAL_QUERIES);
  const [activeQueryId, setActiveQueryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [replyText, setReplyText] = useState("");

  const baseQueries = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return queries;
    return queries.filter((query) =>
      query.studentName.toLowerCase().includes(term) ||
      query.college.toLowerCase().includes(term) ||
      query.messages.some((message) => message.text.toLowerCase().includes(term)),
    );
  }, [queries, searchQuery]);

  const visibleQueries = useMemo(() => {
    let filtered = baseQueries;
    if (activeFilter === "unread") filtered = filtered.filter((query) => query.unreadAdmin);
    if (activeFilter === "pending") filtered = filtered.filter((query) => query.status === "open");
    if (activeFilter === "resolved") filtered = filtered.filter((query) => query.status === "resolved");
    if (activeFilter === "urgent") filtered = filtered.filter((query) => query.priority === "urgent");
    return [...filtered].sort((a, b) => b.id - a.id);
  }, [activeFilter, baseQueries]);

  const activeQuery = queries.find((query) => query.id === activeQueryId) || null;

  const tabCounts = useMemo(() => {
    return {
      all: baseQueries.length,
      unread: baseQueries.filter((query) => query.unreadAdmin).length,
      pending: baseQueries.filter((query) => query.status === "open").length,
      resolved: baseQueries.filter((query) => query.status === "resolved").length,
      urgent: baseQueries.filter((query) => query.priority === "urgent").length,
    };
  }, [baseQueries]);

  const filters: Array<{ id: FilterTab; label: string }> = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "pending", label: "Pending" },
    { id: "resolved", label: "Resolved" },
    { id: "urgent", label: "Urgent" },
  ];

  const selectQuery = (id: number) => {
    setActiveQueryId(id);
    setQueries((prev) => prev.map((query) => (query.id === id ? { ...query, unreadAdmin: false } : query)));
  };

  const markAsResolved = () => {
    if (!activeQuery) return;
    setQueries((prev) => prev.map((query) => (query.id === activeQuery.id ? { ...query, status: "resolved" } : query)));
  };

  const sendReply = (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeQuery || !replyText.trim()) return;

    const nextMessage: Message = {
      id: Date.now(),
      sender: "admin",
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setQueries((prev) =>
      prev.map((query) => {
        if (query.id !== activeQuery.id) return query;
        return {
          ...query,
          status: "open",
          messages: [...query.messages, nextMessage],
          timestamp: nextMessage.time,
        };
      }),
    );
    setReplyText("");
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-4 md:p-6 bg-slate-50">
      <div className="w-full lg:w-1/3 xl:w-1/4 bg-white rounded-md  border border-slate-200 flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-100 bg-white shrink-0">
          <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
            <Inbox className="w-5 h-5 mr-2 text-indigo-500" /> Admin Inbox
          </h2>

          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search students or messages..."
              className="w-full text-sm border border-slate-200 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 transition-shadow"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isActive ? "bg-indigo-600 text-white  border-indigo-600" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] min-w-[20px] text-center ${
                      isActive ? "bg-white/20 text-white" : tabCounts[filter.id] > 0 && filter.id === "unread" ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {tabCounts[filter.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {visibleQueries.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400 h-full">
              <Inbox className="w-8 h-8 mb-3 opacity-50" />
              <p className="text-sm font-medium">No conversations match your filter.</p>
            </div>
          ) : (
            visibleQueries.map((query) => {
              const isActive = query.id === activeQueryId;
              return (
                <button
                  key={query.id}
                  onClick={() => selectQuery(query.id)}
                  className={`w-full text-left p-4 cursor-pointer transition-all ${
                    isActive
                      ? "bg-slate-100 border-l-4 border-slate-400"
                      : query.unreadAdmin
                        ? "bg-indigo-50 border-l-4 border-indigo-500 hover:bg-indigo-100/50"
                        : "bg-white border-l-4 border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 truncate">
                      {query.studentName}
                      {query.unreadAdmin && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap bg-white px-1.5 rounded">{query.timestamp}</span>
                  </div>
                  <div className="text-[11px] font-bold text-indigo-600 mb-1.5 flex items-center truncate">
                    <Building className="w-3 h-3 mr-1 shrink-0" /> {query.college}
                  </div>
                  <p className={`text-xs line-clamp-2 mb-2.5 leading-relaxed ${query.unreadAdmin ? "text-slate-800 font-semibold" : "text-slate-500"}`}>
                    {query.messages[query.messages.length - 1]?.text || "Submitted..."}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${query.status === "resolved" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                      {query.status}
                    </span>
                    {query.priority === "urgent" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-red-100 text-red-700">
                        Urgent
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-4 overflow-hidden relative">
        {!activeQuery && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 rounded-md border border-slate-200 z-10 text-slate-400">
            <div className="w-20 h-20 bg-white  border border-slate-100 rounded-full flex items-center justify-center mb-5">
              <MousePointerClick className="w-8 h-8 text-indigo-300" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Select a Conversation</h2>
            <p className="font-medium text-center text-slate-500">Student details and conversation history will appear here.</p>
          </div>
        )}

        <div className="bg-white rounded-md  border border-slate-200 p-5 flex flex-wrap gap-6 items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-xl border border-indigo-200  shrink-0">
              {activeQuery ? initials(activeQuery.studentName) : "--"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-lg">{activeQuery?.studentName || "Student Name"}</h3>
                {activeQuery?.priority === "urgent" && (
                  <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-red-200">Urgent</span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium flex-wrap">
                <span className="flex items-center bg-slate-100 px-2 py-1 rounded-md"><Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {activeQuery?.email || "email@domain.com"}</span>
                <span className="flex items-center bg-slate-100 px-2 py-1 rounded-md"><Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {activeQuery?.phone || "+123456789"}</span>
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-md font-bold border border-indigo-100 flex items-center mb-2 ">
              <Building className="w-3.5 h-3.5 mr-1.5" /> {activeQuery?.college || "Department"}
            </span>
            <button
              onClick={markAsResolved}
              disabled={!activeQuery || activeQuery.status === "resolved"}
              className={`text-sm px-4 py-2 rounded-md border  flex items-center transition-colors ${
                !activeQuery
                  ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                  : activeQuery.status === "resolved"
                    ? "bg-green-50 text-green-700 border-green-200 font-bold"
                    : "bg-white hover:bg-green-50 text-slate-600 hover:text-green-700 border-slate-200 font-semibold"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> {activeQuery?.status === "resolved" ? "Resolved" : "Mark Resolved"}
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-md  border border-slate-200 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5 bg-[#f8fafc]">
            {!activeQuery ? null : activeQuery.messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium">Awaiting first message...</div>
            ) : (
              activeQuery.messages.map((message) => {
                const mine = message.sender === "admin";
                return (
                  <div key={message.id} className={`flex flex-col max-w-[85%] lg:max-w-[75%] ${mine ? "self-end items-end" : "self-start items-start"}`}>
                    <span className="text-[11px] text-slate-400 mb-1.5 px-1 font-semibold tracking-wide">
                      {message.sender === "student" ? activeQuery.studentName : `${activeQuery.college} Support`} • {message.time}
                    </span>
                    <div className={`px-5 py-3 text-sm leading-relaxed break-words rounded-md ${mine ? "bg-indigo-600 text-white rounded-tr-sm " : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm "}`}>
                      {message.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <form onSubmit={sendReply} className="flex items-end gap-3">
              <textarea
                rows={2}
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                placeholder="Type your response to the student..."
                className="flex-1 text-sm border border-slate-200 rounded-md pl-5 pr-5 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-slate-50 hover:bg-white transition-colors"
                disabled={!activeQuery}
              />
              <button
                type="submit"
                disabled={!activeQuery || !replyText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-md transition-all  flex items-center font-bold h-full"
              >
                <span>Reply</span>
                <SendHorizonal className="w-4 h-4 ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QMSPage;
