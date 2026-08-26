import React from 'react';
import { 
  Building2, Sparkles, FolderDown, Smartphone, 
  MessageSquare, ShieldCheck, LogOut, Menu, X 
} from 'lucide-react';

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
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-3 sm:px-8 py-2.5 sm:py-3.5 flex justify-between items-center sticky top-0 z-50 shadow-lg shadow-black/40">
      <div className="flex items-center gap-2.5">
        <div className="bg-gradient-to-tr from-emerald-600 to-teal-400 p-2 rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-900/40">
          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-white leading-tight">KEWA SACCO</h1>
            <span className="text-[9px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full border border-emerald-800 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Core
            </span>
          </div>
          <p className="text-[9px] sm:text-xs text-slate-400 font-medium">Kenya Builders • Warren • Eurocon • External</p>
        </div>
      </div>

      {session && authMode !== 'reset' && (
        <div className="flex items-center gap-2">
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-semibold shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'overview' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('loans')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'loans' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Loans & Limits
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guarantors')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'guarantors' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Guarantors
              {pendingGuaranteesCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded-full font-bold animate-pulse">
                  {pendingGuaranteesCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'documents' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderDown className="w-3.5 h-3.5" /> Reports & AGM
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('beneficiaries')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'beneficiaries' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Profile & Welfare
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mpesa')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'mpesa' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> M-Pesa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('support')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'support' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Help & Chat
            </button>
            {['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(userRole) && (
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'admin' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' : 'text-amber-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Leadership Hub
              </button>
            )}
          </nav>

          <button
            type="button"
            onClick={onSignOut}
            className="hidden lg:flex items-center gap-1.5 bg-slate-900 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition border border-slate-800 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Exit
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 text-white shadow cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-rose-400" /> : <Menu className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      )}
    </header>
  );
}