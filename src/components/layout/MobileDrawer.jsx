import React from 'react';
import { 
  PiggyBank, Calculator, Users, FolderDown, Settings, 
  Smartphone, MessageSquare, ShieldCheck, LogOut 
} from 'lucide-react';

export default function MobileDrawer({
  isOpen,
  onClose,
  profile,
  activeTab,
  setActiveTab,
  pendingGuaranteesCount,
  userRole,
  onSignOut
}) {
  if (!isOpen) return null;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="lg:hidden fixed inset-0 top-[52px] bg-slate-950/98 backdrop-blur-2xl z-[100] px-4 py-5 space-y-2.5 overflow-y-auto border-t border-slate-800 animate-fadeIn">
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-white">{profile?.full_name || 'Member'}</p>
          <p className="text-[10px] text-emerald-400 font-mono">{profile?.member_number || ''}</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300 uppercase">
          {profile?.role ? profile.role.replace('_', ' ') : 'Member'}
        </span>
      </div>

      <button
        type="button"
        onClick={() => handleTabClick('overview')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
          activeTab === 'overview' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
        }`}
      >
        <PiggyBank className="w-4 h-4" /> Overview Dashboard
      </button>

      <button
        type="button"
        onClick={() => handleTabClick('loans')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
          activeTab === 'loans' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
        }`}
      >
        <Calculator className="w-4 h-4" /> Loan Products & Limits
      </button>

      <button
        type="button"
        onClick={() => handleTabClick('guarantors')}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
          activeTab === 'guarantors' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
        }`}
      >
        <span className="flex items-center gap-3">
          <Users className="w-4 h-4" /> Guarantor Requests
        </span>
        {pendingGuaranteesCount > 0 && (
          <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            {pendingGuaranteesCount} new
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => handleTabClick('documents')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
          activeTab === 'documents' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
        }`}
      >
        <FolderDown className="w-4 h-4 text-emerald-400" /> Reports & AGM Booklets
      </button>

      <button
        type="button"
        onClick={() => handleTabClick('beneficiaries')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
          activeTab === 'beneficiaries' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
        }`}
      >
        <Settings className="w-4 h-4" /> Profile & Welfare (KES 200)
      </button>

      <button
        type="button"
        onClick={() => handleTabClick('mpesa')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
          activeTab === 'mpesa' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
        }`}
      >
        <Smartphone className="w-4 h-4" /> M-Pesa Top-Up & Repay
      </button>

      <button
        type="button"
        onClick={() => handleTabClick('support')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
          activeTab === 'support' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-emerald-300 border border-slate-800/80'
        }`}
      >
        <MessageSquare className="w-4 h-4" /> Helpdesk, Bot & Officials Chat
      </button>

      {['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(userRole) && (
        <button
          type="button"
          onClick={() => handleTabClick('admin')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition cursor-pointer ${
            activeTab === 'admin' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg' : 'bg-slate-900/80 text-amber-300 border border-slate-800/80'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> 3-Signatory Leadership Hub
        </button>
      )}

      <div className="pt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 py-3 rounded-xl text-xs font-bold shadow cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out of Portal
        </button>
      </div>
    </div>
  );
}