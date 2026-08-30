import React from 'react';
import { LogOut, X } from 'lucide-react';

export default function MobileDrawer({ isOpen, onClose, profile, activeTab, setActiveTab, pendingGuaranteesCount, userRole, onSignOut }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end md:hidden">
      <div className="w-72 bg-slate-900 h-full p-5 border-l border-slate-800 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white">{profile?.full_name || 'Member Portal'}</h2>
              <p className="text-[10px] text-slate-400 font-mono">No: {profile?.member_number || 'N/A'}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {['overview', 'loans', 'guarantors', 'documents', 'beneficiaries', 'mpesa', 'support'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); onClose(); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold capitalize transition ${activeTab === tab ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                {tab === 'beneficiaries' ? 'Profile & Welfare' : tab === 'documents' ? 'Reports & Bylaws' : tab}
                {tab === 'guarantors' && pendingGuaranteesCount > 0 && (
                  <span className="float-right bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {pendingGuaranteesCount}
                  </span>
                )}
              </button>
            ))}

            {['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(userRole) && (
              <button
                onClick={() => { setActiveTab('admin'); onClose(); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'admin' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:bg-slate-800'}`}
              >
                Leadership Hub
              </button>
            )}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4">
          <button
            onClick={() => { onSignOut(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 py-2.5 rounded-xl text-xs font-bold border border-rose-800"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}