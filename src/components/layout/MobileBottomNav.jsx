import React from 'react';
import { Home, CreditCard, Users, FileText, LifeBuoy, ShieldAlert, LogOut } from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab, pendingGuaranteesCount, userRole, onSignOut }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 px-2 py-2 flex justify-around items-center z-40 md:hidden backdrop-blur-md">
      <button
        onClick={() => setActiveTab('overview')}
        className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'}`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Overview</span>
      </button>

      <button
        onClick={() => setActiveTab('loans')}
        className={`flex flex-col items-center gap-1 ${activeTab === 'loans' ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'}`}
      >
        <CreditCard className="w-5 h-5" />
        <span className="text-[10px]">Loans</span>
      </button>

      <button
        onClick={() => setActiveTab('guarantors')}
        className={`flex flex-col items-center gap-1 relative ${activeTab === 'guarantors' ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'}`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px]">Guarantors</span>
        {pendingGuaranteesCount > 0 && (
          <span className="absolute -top-1 right-2 bg-rose-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {pendingGuaranteesCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('support')}
        className={`flex flex-col items-center gap-1 ${activeTab === 'support' ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'}`}
      >
        <LifeBuoy className="w-5 h-5" />
        <span className="text-[10px]">Support</span>
      </button>

      {['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(userRole) && (
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'text-amber-400 font-bold' : 'text-amber-600/80 font-medium'}`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-[10px]">Admin</span>
        </button>
      )}

      <button
        onClick={onSignOut}
        className="flex flex-col items-center gap-1 text-rose-400 font-medium"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-[10px]">Exit</span>
      </button>
    </div>
  );
}