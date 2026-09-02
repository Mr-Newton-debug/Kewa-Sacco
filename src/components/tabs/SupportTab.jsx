import React from 'react';
import { LifeBuoy, Send, Bot, User, Phone, Mail, Building, Plus } from 'lucide-react';

export default function SupportTab({
  profile,
  chairmanOfficial,
  treasurerOfficial,
  asstChairOfficial,
  chatMessages,
  chatInput,
  setChatInput,
  onSendChatMessage,
  chatEndRef,
  inquiryCategory,
  setInquiryCategory,
  inquirySubject,
  setInquirySubject,
  inquiryMessage,
  setInquiryMessage,
  onCreateInquiry,
  inquiries,
  loading
}) {
  return (
    <div className="space-y-6">
      {/* Official Executive Contacts Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <LifeBuoy className="w-4 h-4 text-emerald-400" /> KEWA SACCO Executive Board & Secretariat Contacts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Chairperson</span>
            <h4 className="text-xs font-bold text-white mt-1">{chairmanOfficial.full_name}</h4>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono"><Phone className="w-3 h-3" /> {chairmanOfficial.phone || '0700000001'}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Treasurer</span>
            <h4 className="text-xs font-bold text-white mt-1">{treasurerOfficial.full_name}</h4>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono"><Phone className="w-3 h-3" /> {treasurerOfficial.phone || '0700000002'}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Assistant Chairperson</span>
            <h4 className="text-xs font-bold text-white mt-1">{asstChairOfficial.full_name}</h4>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono"><Phone className="w-3 h-3" /> {asstChairOfficial.phone || '0700000003'}</p>
          </div>
        </div>
      </div>

      {/* Grid: Chat Bot & Support Ticketing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Virtual Assistant Chat */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-[500px]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Bot className="w-4 h-4 text-emerald-400" /> KEWA Virtual Assistant AI
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {chatMessages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender !== 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 flex-shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={onSendChatMessage} className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about shares, loans, or bylaws..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Formal Support Ticketing Desk */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Mail className="w-4 h-4 text-emerald-400" /> Formal Support Ticketing Desk
          </h3>

          <form onSubmit={onCreateInquiry} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Inquiry Category</label>
                <select
                  value={inquiryCategory}
                  onChange={(e) => setInquiryCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="loan_inquiry">Loan Inquiry & Status</option>
                  <option value="shares_inquiry">Shares & Savings Statement</option>
                  <option value="technical_support">Portal Technical Support</option>
                  <option value="other">General Cooperative Matter</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  placeholder="e.g. Dividend payout query"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Message Description</label>
              <textarea
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                required
                rows="2"
                placeholder="Provide detailed inquiry for the board..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Submit Support Ticket
            </button>
          </form>

          <div className="space-y-2 pt-3 border-t border-slate-800 max-h-40 overflow-y-auto">
            <h4 className="text-xs font-bold text-slate-300">My Support Tickets</h4>
            {inquiries.map((t) => (
              <div key={t.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white">{t.subject}</span>
                  <p className="text-[10px] text-slate-400">{t.message?.substring(0, 45)}...</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${t.status === 'resolved' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                  {t.status}
                </span>
              </div>
            ))}
            {inquiries.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-2">No support tickets submitted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}