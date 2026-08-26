import React from 'react';
import { 
  PiggyBank, ShieldCheck, ShieldAlert, TrendingUp, 
  Megaphone, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

export default function OverviewTab({
  totalSavings,
  freeSharesAvailable,
  totalRunningGuaranteesCommitted,
  activeLoanBalance,
  announcements = [],
  savings = [],
  repayments = []
}) {
  return (
    <div className="space-y-4">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between shadow">
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Total Savings</p>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
              KES {Number(totalSavings || 0).toLocaleString('en-KE', { minimumFractionDigits: 0 })}
            </h3>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-800/50 p-2.5 rounded-xl text-emerald-400 hidden sm:block">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between shadow">
          <div>
            <p className="text-[11px] font-bold text-emerald-400">Free Shares</p>
            <h3 className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">
              KES {Number(freeSharesAvailable || 0).toLocaleString('en-KE', { minimumFractionDigits: 0 })}
            </h3>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-800/50 p-2.5 rounded-xl text-emerald-400 hidden sm:block">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between shadow">
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Running Guarantees</p>
            <h3 className="text-lg sm:text-xl font-black text-rose-400 mt-0.5">
              KES {Number(totalRunningGuaranteesCommitted || 0).toLocaleString('en-KE', { minimumFractionDigits: 0 })}
            </h3>
          </div>
          <div className="bg-rose-950/80 border border-rose-800/50 p-2.5 rounded-xl text-rose-400 hidden sm:block">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between shadow">
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Active Debt</p>
            <h3 className="text-lg sm:text-xl font-black text-amber-400 mt-0.5">
              KES {Number(activeLoanBalance || 0).toLocaleString('en-KE', { minimumFractionDigits: 0 })}
            </h3>
          </div>
          <div className="bg-amber-950/80 border border-amber-800/50 p-2.5 rounded-xl text-amber-400 hidden sm:block">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Society Announcements */}
      {announcements.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-2.5">
            <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-bounce" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Official Society Notices & Announcements
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {announcements.slice(0, 2).map((notice) => (
              <div key={notice.id} className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1 shadow">
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-bold uppercase">{notice.category || 'General'}</span>
                  <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-white text-xs sm:text-sm">{notice.title}</h4>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">{notice.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dual Activity Ledgers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Savings Ledger */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm sm:text-base font-bold text-white">Monthly Savings Checkoff Ledger</h4>
          </div>

          {savings.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">No contributions recorded.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Batch Ref</th>
                    <th className="pb-2 text-right">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {savings.map((s) => (
                    <tr key={s.id}>
                      <td className="py-2 text-slate-300">{new Date(s.created_at).toLocaleDateString()}</td>
                      <td className="py-2 text-slate-400 font-mono">{s.reference_code || '-'}</td>
                      <td className="py-2 text-right font-bold text-emerald-400">
                        +KES {Number(s.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Repayments Ledger */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <ArrowDownRight className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm sm:text-base font-bold text-white">Monthly Loan Repayments Ledger</h4>
          </div>

          {repayments.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">No loan deductions recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Batch Ref</th>
                    <th className="pb-2 text-right">Deducted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {repayments.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 text-slate-300">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="py-2 text-slate-400 font-mono">{r.reference_code || '-'}</td>
                      <td className="py-2 text-right font-bold text-amber-400">
                        -KES {Number(r.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}