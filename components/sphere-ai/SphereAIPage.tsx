"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { streamSphereAIChat, type SphereAIMessage } from "@/services/api";

interface Message {
  role: "user" | "ai";
  text: string;
  streaming?: boolean;
}

const quickCards = [
  { icon: "fa-graduation-cap", color: "text-green-500", label: "Find Colleges", desc: "Get personalised college recommendations.", prompt: "Help me find the best colleges in Nepal for my studies. Ask me about my level and course interest." },
  { icon: "fa-code", color: "text-[#0000ff]", label: "Explore Courses", desc: "Compare courses and career scope.", prompt: "I want to explore courses available in Nepal. What are the most in-demand fields and which programs should I consider?" },
  { icon: "fa-award", color: "text-purple-500", label: "Scholarships", desc: "Discover scholarships you qualify for.", prompt: "What scholarships are currently available on StudSphere? Help me find ones I might qualify for based on my profile." },
  { icon: "fa-scale-balanced", color: "text-orange-500", label: "Compare", desc: "Side-by-side comparison of options.", prompt: "I want to compare colleges or courses. Walk me through what to consider and how StudSphere can help." },
  { icon: "fa-headset", color: "text-cyan-500", label: "Counselling", desc: "Talk to a counsellor for guidance.", prompt: "I'd like to talk to a counsellor. What does StudSphere's counselling service offer and how do I book a session?" },
];

const SphereAIPage: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<(() => void) | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 30);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isStreaming, scrollToBottom]);

  useEffect(() => () => { abortRef.current?.(); }, []);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setErrorMsg(null);
    setChatStarted(true);

    const userMsg: Message = { role: "user", text: trimmed };
    const aiMsg: Message = { role: "ai", text: "", streaming: true };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setIsStreaming(true);

    const history: SphereAIMessage[] = messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const stop = streamSphereAIChat(trimmed, history, {
      onToken: (token) => {
        setMessages((prev) => {
          const next = [...prev];
          for (let i = next.length - 1; i >= 0; i--) {
            if (next[i].role === "ai" && next[i].streaming) {
              next[i] = { ...next[i], text: next[i].text + token };
              break;
            }
          }
          return next;
        });
      },
      onDone: () => {
        setMessages((prev) => {
          const next = [...prev];
          for (let i = next.length - 1; i >= 0; i--) {
            if (next[i].role === "ai" && next[i].streaming) {
              next[i] = { ...next[i], streaming: false };
              break;
            }
          }
          return next;
        });
        setIsStreaming(false);
        abortRef.current = null;
      },
      onError: (error) => {
        setErrorMsg(error);
        setMessages((prev) => {
          const next = [...prev];
          for (let i = next.length - 1; i >= 0; i--) {
            if (next[i].role === "ai" && next[i].streaming) {
              if (next[i].text.length === 0) {
                next.splice(i, 1);
              } else {
                next[i] = { ...next[i], streaming: false };
              }
              break;
            }
          }
          return next;
        });
        setIsStreaming(false);
        abortRef.current = null;
      },
    });
    abortRef.current = stop;
  }, [messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = input;
    setInput("");
    sendMessage(value);
  };

  const handleStop = () => {
    abortRef.current?.();
    abortRef.current = null;
    setIsStreaming(false);
    setMessages((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].role === "ai" && next[i].streaming) {
          next[i] = { ...next[i], streaming: false };
          break;
        }
      }
      return next;
    });
  };

  const handleQuickCard = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleClose = () => router.back();

  return (
    <>
    <div className="flex h-screen w-full flex-col bg-slate-50">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-3 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
              <img src="/icon.png" alt="StudSphere" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <p className="font-semibold leading-tight text-slate-900">Sphere AI</p>
              <div className="flex items-center gap-2">
                <span className={`block h-1.5 w-1.5 rounded-full ${isStreaming ? "bg-amber-500 animate-pulse" : "bg-green-500"}`}></span>
                <span className="text-[11px] text-slate-500">
                  {isStreaming ? "Thinking…" : "StudSphere AI · Online"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleClose}
              type="button"
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scroll bg-slate-50/50">
          {!chatStarted ? (
            <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center px-4 pt-[8vh] pb-8">
              <div className="mb-10 flex flex-col items-center">
                <div className="mb-2 flex items-center">
                  <h2 className="text-[22px] font-medium text-slate-700 md:text-[26px]">Hi there 👋</h2>
                </div>
                <h1 className="text-center text-[36px] font-medium tracking-tight text-slate-900 md:text-[44px]">Where should we start?</h1>
                <p className="mt-3 text-center text-[14px] text-slate-500 max-w-md">
                  Ask anything about colleges, courses, exams, or scholarships in Nepal. Powered by Sphere AI.
                </p>
              </div>
              <div className="flex w-full flex-wrap justify-center gap-4">
                {quickCards.map((card) => (
                  <div
                    key={card.label}
                    onClick={() => handleQuickCard(card.prompt)}
                    className="flex h-[120px] w-[160px] cursor-pointer flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 group md:h-[130px] md:w-[170px]"
                  >
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
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pt-6 pb-8">
              {messages.map((msg, i) => (
                msg.role === "user" ? (
                  <div key={i} className="flex w-full justify-end fade-in-up">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-blue px-5 py-3.5 text-[15px] leading-relaxed text-white shadow-sm sm:max-w-[75%] whitespace-pre-wrap">{msg.text}</div>
                  </div>
                ) : (
                  <div key={i} className="flex w-full items-start gap-4 fade-in-up">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                      <img src="/icon.png" alt="StudSphere" className="h-6 w-6 object-contain" />
                    </div>
                    <div className="max-w-[90%] sm:max-w-[80%]">
                      <div className="prose prose-sm prose-slate max-w-none rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-5 py-3.5 text-[15px] leading-relaxed text-slate-800 shadow-sm">
                        {msg.text ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                          </ReactMarkdown>
                        ) : (msg.streaming ? "" : " ")}
                        {msg.streaming && (
                          <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-slate-400 align-middle"></span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ))}
              {errorMsg && (
                <div className="mx-auto w-full max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                  <div className="font-semibold">Sphere AI is unavailable</div>
                  <div className="mt-0.5">{errorMsg}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-slate-200 bg-white p-3">
          <div className="mx-auto flex w-full max-w-[700px] flex-col gap-3">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isStreaming}
                className="w-full rounded-xl border border-transparent bg-slate-100 px-5 py-3.5 pr-14 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-500 focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 disabled:opacity-60"
                placeholder="Ask about colleges, courses, or scholarships..."
                autoComplete="off"
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStop}
                  aria-label="Stop"
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-slate-700 text-white shadow-lg transition-colors hover:bg-slate-800"
                >
                  <i className="fa-solid fa-stop text-sm"></i>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send"
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-brand-blue text-white shadow-lg transition-colors hover:bg-brand-hover disabled:opacity-40 disabled:hover:bg-brand-blue"
                >
                  <i className="fa-solid fa-arrow-up text-sm"></i>
                </button>
              )}
            </form>
            <div className="text-center text-[11px] text-slate-400">Sphere AI can make mistakes. Verify important details.</div>
          </div>
        </div>
      </div>

      <style>{`
        .fade-in-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; transform: translateY(10px); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 10px; }
      `}</style>
    </>
  );
};

export default SphereAIPage;
