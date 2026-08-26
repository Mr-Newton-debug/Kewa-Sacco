import React from 'react';
import { 
  PiggyBank, Calculator, FolderDown, Users, 
  MessageSquare, ShieldCheck, LogOut 
} from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  pendingGuaranteesCount,
  userRole,
  onSignOut
}) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/98 backdrop-blur-xl border-t border-slate-800/90 flex justify-around items-center py-2.5 px-1 z-50 shadow-2xl">
      <button
        type="button"
        onClick={() => setActiveTab('overview')}
        className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 transition cursor-pointer ${
          activeTab === 'overview' ? 'text-emerald-400' : 'text-slate-400'
        }`}
      >
        <PiggyBank className="w-4 h-4" />
        <span>Overview</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('loans')}
        className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 transition cursor-pointer ${
          activeTab === 'loans' ? 'text-emerald-400' : 'text-slate-400'
        }`}
      >
        <Calculator className="w-4 h-4" />
        <span>Loans</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('documents')}
        className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 transition cursor-pointer ${
          activeTab === 'documents' ? 'text-emerald-400' : 'text-slate-400'
        }`}
      >
        <FolderDown className="w-4 h-4" />
        <span>Reports</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('guarantors')}
        className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 relative transition cursor-pointer ${
          activeTab === 'guarantors' ? 'text-emerald-400' : 'text-slate-400'
        }`}
      >
        <Users className="w-4 h-4" />
        <span>Guarantors</span>
        {pendingGuaranteesCount > 0 && (
          <span className="absolute top-0 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('support')}
        className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 transition cursor-pointer ${
          activeTab === 'support' ? 'text-emerald-400' : 'text-slate-400'
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        <span>Help</span>
      </button>

      {['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(userRole) && (
        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 transition cursor-pointer ${
            activeTab === 'admin' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Leadership Hub</span>
        </button>
      )}

      <button
        type="button"
        onClick={onSignOut}
        className="flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 text-rose-400 hover:text-rose-300 transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Exit</span>
      </button>
    </nav>
  );
}