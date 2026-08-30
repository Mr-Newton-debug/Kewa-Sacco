import React, { useState } from 'react';
import { LifeBuoy, Send, Bot, User } from 'lucide-react';

export default function SupportTab({ profile, session }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: `Hello ${profile?.full_name || 'Member'}, welcome to KEWA SACCO Support AI. How can I assist you with your shares, loans, or society policies today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = "I can help you with questions regarding savings, loan applications, guarantorship, and society bylaws. For specific ledger adjustments, please contact the SACCO treasurer directly.";
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('loan') || lower.includes('borrow')) {
        reply = "To qualify for a loan, you need accumulated savings and unencumbered free shares. You can apply via the Loans tab by selecting your preferred product (Main Loan, Emergency, Christmas, or Monthly Shylock).";
      } else if (lower.includes('share') || lower.includes('savings')) {
        reply = "Your total shares represent your accumulated savings. Free shares are calculated as Total Savings minus Active Loans and committed Guarantees.";
      } else if (lower.includes('guarantor')) {
        reply = "You can view and respond to incoming guarantee requests under the Guarantors tab. Ensure you have sufficient free shares before accepting.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-[550px]">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">KEWA SACCO AI Assistant</h3>
            <p className="text-[11px] text-slate-400">Instant answers regarding cooperative bylaws and procedures</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-sm'
              }`}>
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs font-mono">
              <Bot className="w-4 h-4 animate-bounce text-emerald-400" /> AI is typing...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about loans, savings, or bylaws..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}