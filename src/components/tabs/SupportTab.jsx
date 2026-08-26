import React from 'react';
import { MessageCircle, Bot, Mail, Send } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/formatters';

export default function SupportTab({
  profile,
  chairmanOfficial,
  treasurerOfficial,
  asstChairOfficial,
  chatMessages = [],
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
  inquiries = [],
  loading
}) {
  const memberName = profile?.full_name || 'Member';
  const memberNo = profile?.member_number || 'N/A';

  return (
    <div className="space-y-4">
      {/* Official Executive Committee Contacts */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">Direct Communication with SACCO Officials</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4 font-medium">
          Tap to open a pre-filled direct WhatsApp message with your elected executive committee.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between space-y-2.5">
            <div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                Executive Chairperson
              </span>
              <h4 className="text-sm font-bold text-white mt-1">{chairmanOfficial?.full_name || 'Chairman'}</h4>
              <p className="text-[11px] text-slate-400">Governance & General Appeals</p>
            </div>
            <a
              href={getWhatsAppLink(chairmanOfficial?.phone, 'Chairman', memberName, memberNo)}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
            </a>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between space-y-2.5">
            <div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                Treasurer & Finance
              </span>
              <h4 className="text-sm font-bold text-white mt-1">{treasurerOfficial?.full_name || 'Treasurer'}</h4>
              <p className="text-[11px] text-slate-400">Disbursements & Checkoffs</p>
            </div>
            <a
              href={getWhatsAppLink(treasurerOfficial?.phone, 'Treasurer', memberName, memberNo)}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
            </a>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between space-y-2.5">
            <div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                Assistant Chairperson
              </span>
              <h4 className="text-sm font-bold text-white mt-1">{asstChairOfficial?.full_name || 'Assistant Chair'}</h4>
              <p className="text-[11px] text-slate-400">Guarantors & Welfare</p>
            </div>
            <a
              href={getWhatsAppLink(asstChairOfficial?.phone, 'Assistant Chair', memberName, memberNo)}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* KEWA Virtual Assistant */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col h-[440px] shadow-xl">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
            <Bot className="w-4 h-4 text-emerald-400" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">KEWA SACCO AI Assistant</h4>
              <p className="text-[10px] text-slate-400">Instant Automated Policy & Ledger Support</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2.5 space-y-2.5 pr-1">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={onSendChatMessage} className="pt-2 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about loans, free shares, M-Pesa..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* Member Support Ticket Submission */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Submit Internal Message / Ticket</h4>
              <p className="text-[10px] text-slate-400">Formally logged in the system for committee action</p>
            </div>
          </div>

          <form onSubmit={onCreateInquiry} className="space-y-2.5" autoComplete="off">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-0.5">Inquiry Category</label>
              <select
                value={inquiryCategory}
                onChange={(e) => setInquiryCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="loan_inquiry">Loan Application / Guarantor Inquiry</option>
                <option value="savings_dispute">Payroll Checkoff / Savings Ledger Clarification</option>
                <option value="welfare_support">Welfare / Benevolent Claim Follow-up</option>
                <option value="general">General Society Inquiry / Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-0.5">Subject</label>
              <input
                type="text"
                required
                autoComplete="off"
                value={inquirySubject}
                onChange={(e) => setInquirySubject(e.target.value)}
                placeholder="Brief summary..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-0.5">Detailed Message</label>
              <textarea
                required
                rows="2"
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Provide details for leadership review..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1"
            >
              <Send className="w-3.5 h-3.5" /> {loading ? 'Submitting...' : 'Submit Message to Committee'}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 space-y-1.5 max-h-36 overflow-y-auto">
            <p className="text-[10px] font-bold text-slate-300">My Past Submitted Inquiries:</p>
            {inquiries.length === 0 ? (
              <p className="text-[10px] text-slate-500">No tickets submitted yet.</p>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-[11px]">{inq.subject}</span>
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                        inq.status === 'resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                      }`}
                    >
                      {(inq.status || 'pending').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">{inq.message}</p>
                  {inq.admin_response && (
                    <div className="mt-1 p-1.5 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-[10px] text-emerald-300">
                      <strong>Committee Reply:</strong> {inq.admin_response}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}