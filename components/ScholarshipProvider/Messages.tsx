import React, { useEffect, useState } from 'react';
import { scholarshipProviderApi, ProviderMessage } from '@/services/scholarshipProviderApi';

export default function Messages() {
  const [messages, setMessages] = useState<ProviderMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeChat, setActiveChat] = useState<ProviderMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadMessages();
  }, [page]);

  async function loadMessages() {
    setLoading(true);
    setError('');
    try {
      const res = await scholarshipProviderApi.getMessages(page, limit);
      setMessages(res.messages);
      setTotal(res.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!newMessage.trim() || !activeChat) return;
    setSending(true);
    try {
      await scholarshipProviderApi.createMessage({
        user_id: activeChat.user_id,
        subject: activeChat.subject || 'Re: Message',
        content: newMessage.trim(),
      });
      setNewMessage('');
      loadMessages();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  function formatTime(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  const uniqueChats = messages.reduce((acc, msg) => {
    if (!acc.find(m => m.user_id === msg.user_id)) {
      acc.push(msg);
    }
    return acc;
  }, [] as ProviderMessage[]);

  const filteredChats = uniqueChats.filter(c =>
    c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `USER-${c.user_id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="fade-in h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-black text-slate-800">Communications Hub</h2>
        <p className="text-sm text-slate-500 font-medium">Directly message applicants, request missing docs, and answer queries.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm font-bold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-md  border border-slate-200 flex flex-1 overflow-hidden min-h-[600px]">
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50 shrink-0">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-md text-sm outline-none focus:ring-2 focus:ring-primary-500 transition font-medium shadow-inner"
              />
            </div>
          </div>
          <div className="flex border-b border-slate-200 bg-white px-2">
            <button className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-primary-600 border-b-2 border-primary-600">All Messages</button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 no-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <i className="fa-solid fa-spinner fa-spin text-primary-600"></i>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <i className="fa-solid fa-inbox text-2xl mb-2"></i>
                <p className="text-xs font-bold">No messages yet</p>
              </div>
            ) : (
              filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-white ${
                    activeChat?.id === chat.id ? 'bg-white  border-l-4 border-primary-600' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-black text-sm  border border-slate-100">
                      U{chat.user_id}
                    </div>
                    {!chat.read && <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-danger border-2 border-white rounded-full"></div>}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-bold text-slate-800 text-sm truncate">User {chat.user_id}</h4>
                      <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{formatDate(chat.created_at)}</span>
                    </div>
                    <p className={`text-xs truncate ${!chat.read ? 'font-black text-slate-900' : 'text-slate-500 font-medium'}`}>
                      {chat.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-slate-50 items-center justify-center relative">
          {activeChat ? (
            <>
              <div className="absolute top-0 left-0 right-0 p-4 border-b border-slate-200 bg-white/95 backdrop-blur flex justify-between items-center  z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-black text-sm  border-2 border-slate-100">
                    U{activeChat.user_id}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg leading-tight uppercase tracking-tighter">User {activeChat.user_id}</h4>
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{activeChat.subject || 'Message thread'}</p>
                  </div>
                </div>
              </div>

              <div className="w-full flex-1 p-6 space-y-6 pt-24 overflow-y-auto no-scrollbar">
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-md rounded-tl-none  border border-slate-200 max-w-[70%]">
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{activeChat.content}</p>
                    <span className="text-[10px] text-slate-400 font-bold mt-2 block">{formatTime(activeChat.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="w-full p-4 border-t border-slate-200 bg-white/95 backdrop-blur z-10">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                  <div className="flex-1 relative">
                    <textarea
                      rows={1}
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      className="w-full bg-slate-100 border-2 border-slate-100 rounded-md pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-0 focus:border-primary-500 focus:bg-white transition resize-none max-h-32 font-medium"
                      placeholder="Type a message..."
                    ></textarea>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={sending || !newMessage.trim()}
                    className="bg-primary-600 text-white w-12 h-12 rounded-md flex items-center justify-center hover:bg-primary-700 transition shadow-lg shadow-primary-500/30 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane text-lg"></i>}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 fade-in">
              <div className="w-24 h-24 bg-white rounded-md flex items-center justify-center  mb-4 text-4xl transform rotate-3"><i className="fa-regular fa-comments"></i></div>
              <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Select a student to message</p>
              <p className="text-xs font-medium text-slate-300 mt-1 italic">Click on the left sidebar to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
