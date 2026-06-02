"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { BotMessageSquare, X } from "lucide-react";

const flowStateInit = { active: null as string | null, expected: null as string | null, data: {} as Record<string, string> };

const standardEndingChips = ["Compare Colleges", "Find Scholarships", "Show Map", "Talk to Counselor"];

interface Message { role: "user" | "ai"; text: string; chips?: string[]; }

function parseInput(text: string) {
  const t = text.toLowerCase();
  let intent: string | null = null;
  const data: Record<string, string> = {};

  if (/^(hi|hello|hey|namaste|greetings)/.test(t)) intent = "greeting";
  else if (/(thank you|thanks|thx|ok|okay|awesome)/.test(t)) intent = "gratitude";
  else if (/(start over|clear|reset|go back)/.test(t)) intent = "reset";

  const courseMatch = t.match(/\b(bit|bca|csit|bim|bba|bbs|bbm|bhm|engineering|b\.e\.|btech|mbbs|nursing|science|management|humanities|arts|law)\b/);
  if (courseMatch) {
    const c = courseMatch[1];
    if (["science","management","humanities","arts","law"].includes(c)) data.course = c.charAt(0).toUpperCase() + c.slice(1);
    else if (c === "csit") data.course = "BSc CSIT";
    else data.course = c.toUpperCase();
    if (["bit","bca","csit","bim","bba","bbs","bbm","bhm","engineering","b.e.","btech","mbbs","nursing"].includes(c)) data.level = "Bachelor";
  } else if (/\b(mba|mca|msc|mbs|master|masters)\b/.test(t)) {
    data.level = "Master";
    if (/mba/.test(t)) data.course = "MBA";
  }
  if (!data.level) {
    if (/\+2|11|12|plus two|high school/.test(t)) data.level = "+2";
    else if (/\bbachelor|ug|undergrad|degree\b/.test(t)) data.level = "Bachelor";
    else if (/\bmaster|pg|postgrad\b/.test(t)) data.level = "Master";
    else if (/\ba level|a-level\b/.test(t)) data.level = "A Level";
    else if (/\bctevt|diploma\b/.test(t)) data.level = "CTEVT";
  }
  const locMatch = t.match(/\b(kathmandu|ktm|valley|pokhara|chitwan|lalitpur|bhaktapur|butwal|biratnagar|dharan)\b/);
  if (locMatch) {
    const l = locMatch[1];
    data.location = l === "ktm" || l === "valley" ? "Kathmandu" : l.charAt(0).toUpperCase() + l.slice(1);
  }
  if (/\b(cheap|budget|affordable|low|under|government|public)\b/.test(t)) data.budget = "Affordable";
  if (!intent && /(map|maps|location|navigate|directions)/.test(t)) intent = "map";
  if (!intent) {
    if (/compare|vs|difference/.test(t)) intent = "compare";
    else if (/scholarship|aid|free|grant/.test(t)) intent = "scholarships";
    else if (/course|scope|eligibility|what is|syllabus/.test(t)) intent = "find_courses";
    else if (/counsel|guide|help|talk|consult/.test(t)) intent = "counselling";
    else if (/college|recommend|best|top|admission|enroll/.test(t) || Object.keys(data).length > 0) intent = "find_colleges";
  }
  return { intent, data };
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const flowState = useRef({ ...flowStateInit });
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, 50);
  }, []);

  useEffect(() => { if (isOpen) scrollToBottom(); }, [messages, isTyping, isOpen, scrollToBottom]);
  useEffect(() => { const t = setTimeout(() => setShowBubble(false), 10000); return () => clearTimeout(t); }, []);

  const simulateAI = useCallback(async (cb: () => void) => {
    setIsTyping(true); scrollToBottom();
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
    cb(); setIsTyping(false);
  }, [scrollToBottom]);

  const addAIMessage = useCallback((text: string, chips: string[] = []) => {
    setMessages((p) => [...p, { role: "ai", text, chips }]);
  }, []);
  const addUserMessage = useCallback((text: string) => {
    setMessages((p) => [...p, { role: "user", text }]); setChatStarted(true);
  }, []);


  const handleFlow = useCallback(() => {
    const fs = flowState.current;
    if (fs.active === "find_colleges" || fs.active === "recommend") {
      const d = fs.data;
      if (!d.level && !d.course) { fs.expected = "level"; addAIMessage("What level of study are you looking for?", ["+2", "Bachelor", "Master", "A Level", "CTEVT"]); }
      else if (!d.course) { fs.expected = "course"; addAIMessage(`Great, looking for ${d.level} programs. Which specific course are you interested in?`, ["Science", "Management", "BIT", "BBA", "Engineering"]); }
      else if (!d.location) { fs.expected = "location"; addAIMessage(`${d.course} is an excellent choice${d.level ? ` for your ${d.level}` : ""}! Which city or location do you prefer?`, ["Kathmandu", "Pokhara", "Chitwan", "Anywhere"]); }
      else if (!d.budget) { fs.expected = "budget"; addAIMessage(`Got it, ${d.location}. Do you have a specific budget in mind?`, ["Under 5 Lakhs", "5 - 10 Lakhs", "Above 10 Lakhs", "No specific budget"]); }
      else { addAIMessage(`Based on your preferences, here are top colleges for ${d.course} in ${d.location}:\n\nDeerwalk Institute of Technology\nThames International College\nKATHFORD International College\n\nAdmissions are currently open!`, standardEndingChips); flowState.current = { ...flowStateInit }; }
    } else if (fs.active === "find_courses") {
      const d = fs.data;
      if (!d.level && !d.course) { fs.expected = "level"; addAIMessage("To suggest the best courses, what is your current study level?", ["+2", "Bachelor", "Master", "A Level"]); }
      else if (!d.course) { fs.expected = "course"; addAIMessage(`For ${d.level}, which field interests you?`, ["IT & Computing", "Business & Management", "Healthcare", "Engineering"]); }
      else { addAIMessage(`${d.course} is highly in demand!\n\nTop Programs: BCA, BIT, CSIT, BBA\nEligibility: Minimum 'C' grade in +2\nCareer Scope: Excellent opportunities\n\nWould you like to see top colleges?`, standardEndingChips); flowState.current = { ...flowStateInit }; }
    } else if (fs.active === "scholarships") { addAIMessage("We have various scholarship options. Which level are you applying for?", ["+2", "Bachelor", "Master"]); flowState.current = { ...flowStateInit }; }
    else if (fs.active === "compare") { addAIMessage("Which colleges would you like to compare?", standardEndingChips); flowState.current = { ...flowStateInit }; }
    else if (fs.active === "map") { addAIMessage("Sure! Use Google Maps to explore colleges. Which area?", ["Kathmandu", "Pokhara", "Chitwan"]); flowState.current = { ...flowStateInit }; }
    else if (fs.active === "counselling") { addAIMessage("Our expert counselors can guide you. Would you like to schedule a free call?", ["Schedule Call", "Not right now"]); flowState.current = { ...flowStateInit }; }
    else { addAIMessage("How can I help you today?", ["Find Colleges", "Explore Courses", "Scholarships"]); flowState.current.active = "find_colleges"; fs.expected = "level"; }
  }, [addAIMessage]);

  const handleUserMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    addUserMessage(text);
    const parsed = parseInput(text);
    const fs = flowState.current;
    if (parsed.intent === "greeting") { simulateAI(() => addAIMessage("Hi there! I'm StudSphere AI. I can help you find colleges, courses, or scholarships. What are you looking to study?", ["Find Colleges", "Explore Courses", "Scholarships"])); return; }
    if (parsed.intent === "gratitude") { simulateAI(() => addAIMessage("You're welcome! Let me know if you need anything else.", standardEndingChips)); return; }
    if (parsed.intent === "reset") { flowState.current = { ...flowStateInit }; simulateAI(() => addAIMessage("Let's start fresh. What would you like to do?", ["Find Colleges", "Explore Courses", "Scholarships"])); return; }
    if (fs.active && fs.expected) {
      if (Object.keys(parsed.data).length > 0 && parsed.data[fs.expected]) fs.data[fs.expected] = parsed.data[fs.expected];
      else if (Object.keys(parsed.data).length === 0) fs.data[fs.expected] = text;
      Object.assign(fs.data, parsed.data); fs.expected = null;
    } else {
      if (parsed.intent) fs.active = parsed.intent;
      else if (!fs.active) fs.active = "find_colleges";
      Object.assign(fs.data, parsed.data);
    }
    simulateAI(() => handleFlow());
  }, [addUserMessage, simulateAI, handleFlow]);

  const startFlow = useCallback((flowType: string, triggerText: string) => {
    addUserMessage(triggerText);
    flowState.current = { active: flowType, expected: null, data: {} };
    simulateAI(() => handleFlow());
  }, [addUserMessage, simulateAI, handleFlow]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!input.trim()) return; handleUserMessage(input); setInput(""); };

  const quickCards = [
    { icon: "fa-graduation-cap", color: "text-green-500", label: "Find Colleges", desc: "Your expert AI assistant for finding colleges.", flow: "find_colleges" },
    { icon: "fa-code", color: "text-[#0000ff]", label: "Find Courses", desc: "Your expert AI assistant for comparing courses.", flow: "find_courses" },
    { icon: "fa-award", color: "text-purple-500", label: "Scholarships", desc: "Your expert AI assistant for discovering aid.", flow: "scholarships" },
    { icon: "fa-scale-balanced", color: "text-orange-500", label: "Compare", desc: "Your expert AI assistant for comparison.", flow: "compare" },
    { icon: "fa-headset", color: "text-cyan-500", label: "Counselling", desc: "Your expert AI assistant for guidance.", flow: "counselling" },
  ];

  return (
    <>
      {/* Backdrop for expanded mode */}
      {/* Backdrop for expanded mode */}
      {isOpen && isFullscreen && <div className="fixed inset-0 z-[209] bg-black/50" onClick={() => { setIsFullscreen(false); }} />}

      {/* Panel */}
      <div
        className={`fixed z-[210] flex flex-col bg-white transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        } ${
          isFullscreen
            ? "inset-0 m-auto w-full max-w-[900px] h-[85vh] rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-md:!inset-0 max-md:!m-0 max-md:!w-full max-md:!h-full max-md:!rounded-none max-md:!border-0"
            : "bottom-5 right-5 w-full sm:w-[400px] h-[600px] max-h-[90vh] rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-3 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"><img src="/icon.png" alt="StudSphere" className="h-8 w-8 object-contain" /></div>
            <div>
              <p className="font-semibold leading-tight text-slate-900">StudSphere</p>
              <div className="flex items-center gap-2">
                <span className="block h-1.5 w-1.5 rounded-full bg-green-500"></span>
                <div className="h-4 overflow-hidden"><div className="animate-rotate-tagline text-[11px] leading-4 text-slate-500" style={{ animation: "rotateTagline 9s ease-in-out infinite" }}><span className="block">Admissions Expert</span><span className="block">Find college & course</span><span className="block">Compare college</span></div></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!isFullscreen && <button onClick={() => setIsFullscreen(true)} type="button" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"><i className="fa-solid fa-expand"></i></button>}
            <button onClick={() => { isFullscreen ? setIsFullscreen(false) : setIsOpen(false); }} type="button" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"><i className="fa-solid fa-xmark text-lg"></i></button>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className={`flex-1 overflow-y-auto custom-scroll ${isFullscreen ? "" : "bg-slate-50/50"}`}
        >
          {!chatStarted ? (
            isFullscreen ? (
              /* Expanded welcome screen */
              <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center px-4 pt-[8vh] pb-8">
                <div className="mb-10 flex flex-col items-center">
                  <div className="mb-2 flex items-center"><h2 className="text-[22px] font-medium text-slate-700 md:text-[26px]">Hi Jagdish 👋</h2></div>
                  <h1 className="text-center text-[36px] font-medium tracking-tight text-slate-900 md:text-[44px]">Where should we start?</h1>
                </div>
                <div className="flex w-full flex-wrap justify-center gap-4">
                  {quickCards.map((card) => (
                    <div key={card.flow} onClick={() => startFlow(card.flow, `I want to ${card.label.toLowerCase()}`)} className="flex h-[120px] w-[160px] cursor-pointer flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 group md:h-[130px] md:w-[170px]">
                      <i className={`fa-solid ${card.icon} ${card.color} text-[22px] transition-transform group-hover:scale-110 origin-left`}></i>
                      <div>
                        <div className="mb-1 text-[13px] font-semibold text-slate-800">{card.label}</div>
                        <div className="text-[11px] leading-[1.4] text-slate-400">{card.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Minimized welcome screen */
              <div className="flex min-h-full w-full flex-col items-center justify-center px-4 py-8">
                <div className="mb-8 flex flex-col items-center">
                  <h2 className="mb-1 text-xl font-medium text-slate-600">Hi there 👋</h2>
                  <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-900">How can I help you today?</h1>
                </div>
                <div className="grid w-full max-w-[340px] grid-cols-2 gap-2">
                  {[
                    { icon: "fa-building-columns", color: "text-brand-blue", label: "Find Colleges", desc: "Discover top institutions.", flow: "find_colleges" },
                    { icon: "fa-book-open", color: "text-emerald-500", label: "Explore Courses", desc: "Find your perfect major.", flow: "find_courses" },
                    { icon: "fa-award", color: "text-amber-500", label: "Scholarships", desc: "Get financial aid details.", flow: "scholarships" },
                    { icon: "fa-headset", color: "text-rose-500", label: "Counselling", desc: "Speak to an expert.", flow: "counselling" },
                  ].map((card) => (
                    <div key={card.flow} onClick={() => startFlow(card.flow, `I want to ${card.label.toLowerCase()}`)} className="group flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-brand-blue/50 hover:shadow-md">
                      <i className={`fa-solid ${card.icon} ${card.color} mb-2 text-lg transition-transform group-hover:scale-110 origin-left`}></i>
                      <div>
                        <div className="mb-0.5 text-[13px] font-semibold text-slate-800">{card.label}</div>
                        <div className="text-[11px] leading-snug text-slate-500">{card.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className={`mx-auto flex w-full flex-col gap-6 ${isFullscreen ? "max-w-4xl px-4 pt-6 pb-8" : "px-4 pt-6 pb-24"}`}>
              {messages.map((msg, i) => (
                msg.role === "user" ? (
                  <div key={i} className="flex w-full justify-end fade-in-up">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-blue px-5 py-3.5 text-[15px] leading-relaxed text-white shadow-sm sm:max-w-[75%]">{msg.text}</div>
                  </div>
                ) : (
                  <div key={i} className="flex w-full items-start gap-4 fade-in-up">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                      <img src="/icon.png" alt="StudSphere" className="h-6 w-6 object-contain" />
                    </div>
                    <div className="max-w-[90%] sm:max-w-[80%]">
                      <div className="whitespace-pre-wrap rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-5 py-3.5 text-[15px] leading-relaxed text-slate-800 shadow-sm">{msg.text}</div>
                      {msg.chips && msg.chips.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {msg.chips.map((chip) => (
                            <button key={chip} onClick={() => handleUserMessage(chip)} className="rounded-full border border-brand-blue/20 bg-white px-4 py-1.5 text-[13px] font-medium text-brand-blue shadow-sm transition-colors hover:bg-brand-blue/10 focus:outline-none focus:ring-2 focus:ring-brand-blue/30">{chip}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              ))}
              {isTyping && (
                <div className="flex w-full items-start gap-4 fade-in-up">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                    <img src="/icon.png" alt="StudSphere" className="h-6 w-6 object-contain" />
                  </div>
                  <div className="flex h-[42px] items-center gap-1 rounded-2xl rounded-tl-none border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400"></div>
                    <div className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400"></div>
                    <div className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        {isFullscreen ? (
          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mx-auto flex w-full max-w-[700px] flex-col gap-3">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="w-full rounded-full border border-transparent bg-slate-100 px-5 py-3.5 pr-14 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-500 focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20" placeholder="Ask about colleges, courses, or scholarships..." autoComplete="off" />
                <button type="submit" className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-blue text-white shadow-lg transition-colors hover:bg-brand-hover"><i className="fa-solid fa-paper-plane text-sm"></i></button>
              </form>
              <div className="text-center text-[11px] text-slate-400">StudSphere AI can make mistakes. Verify important details.</div>
            </div>
          </div>
        ) : (
          <div className="shrink-0 border-t border-slate-200 bg-white p-3 z-10">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="w-full rounded-full border border-transparent bg-slate-100 px-5 py-3.5 pr-14 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-500 focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20" placeholder="Ask about colleges or courses..." autoComplete="off" />
              <button type="submit" className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-blue text-white shadow-lg transition-colors hover:bg-brand-hover"><i className="fa-solid fa-paper-plane text-sm"></i></button>
            </form>
            <div className="mt-2 text-center text-[11px] text-slate-400">StudSphere AI can make mistakes. Verify important details.</div>
          </div>
        )}
      </div>

      {/* Bubble */}
      {showBubble && !isOpen && (
        <div onClick={() => { setIsOpen(true); setShowBubble(false); }} className="fixed bottom-6 right-[92px] z-[210] w-[260px] cursor-pointer rounded-[16px] bg-white p-5 shadow-[0_4px_25px_rgba(0,0,0,0.15)] fade-in-up">
          <button onClick={(e) => { e.stopPropagation(); setShowBubble(false); }} type="button" className="absolute -left-[14px] -top-[14px] flex h-7 w-7 items-center justify-center rounded-full bg-[#cbd5e1] text-white shadow-sm transition hover:bg-[#94a3b8]">
            <svg className="h-[14px] w-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <p className="text-[17px] leading-[1.4] text-[#374151]">Hi there 👋 What brings you to StudSphere today?</p>
        </div>
      )}

      {/* Launcher */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-[210] flex h-[60px] w-[60px] items-center justify-center rounded-full bg-brand-blue text-white shadow-lg shadow-brand-blue/40 transition-all duration-300 hover:scale-105 hover:bg-brand-hover">
          <BotMessageSquare className="h-7 w-7" />
        </button>
      )}

      <style>{`
        .fade-in-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; transform: translateY(10px); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
        .typing-dot { animation: typing 1.4s infinite ease-in-out both; }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 10px; }
        @keyframes rotateTagline { 0%, 30% { transform: translateY(0); } 33%, 63% { transform: translateY(-100%); } 66%, 96% { transform: translateY(-200%); } 100% { transform: translateY(0); } }
        @media (max-width: 640px) {
          .fixed.inset-0.z-\[210\] { left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100% !important; height: 100% !important; max-width: 100% !important; max-height: 100dvh !important; border-radius: 0 !important; border: none !important; }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
