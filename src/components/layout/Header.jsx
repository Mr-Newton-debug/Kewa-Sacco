import React from 'react';
import { Building2, LogOut, ShieldAlert, Users, FileText, Home, CreditCard, LifeBuoy } from 'lucide-react';

export default function Header({
  session,
  authMode,
  activeTab,
  setActiveTab,
  userRole,
  pendingGuaranteesCount,
  onSignOut,
  mobileMenuOpen,
  setMobileMenuOpen
}) {
  return (
    <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
              KEWA SACCO <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800">Core</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Kenya Builders • Warren • Eurocon • External</p>
          </div>
        </div>

        {session && authMode !== 'reset' && (
          <div className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'loans' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Loans
            </button>
            <button
              onClick={() => setActiveTab('guarantors')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold relative transition ${activeTab === 'guarantors' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Guarantors
              {pendingGuaranteesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {pendingGuaranteesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'documents' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Reports & Bylaws
            </button>
            <button
              onClick={() => setActiveTab('beneficiaries')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'beneficiaries' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Profile & Welfare
            </button>
            <button
              onClick={() => setActiveTab('mpesa')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'mpesa' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              M-Pesa
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'support' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Support & AI
            </button>
            {['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(userRole) && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'admin' ? 'bg-amber-600 text-white shadow' : 'text-amber-400 hover:text-white'}`}
              >
                Leadership Hub
              </button>
            )}
          </div>
        )}

        {session && (
          <div className="flex items-center gap-2">
            <button
              onClick={onSignOut}
              className="hidden sm:flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-rose-800/80 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-200"
            >
              ☰
            </button>
          </div>
        )}
      </div>
    </header>
  );
}