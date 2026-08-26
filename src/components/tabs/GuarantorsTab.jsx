import React from 'react';
import { Users, CheckCircle, XCircle } from 'lucide-react';

export default function GuarantorsTab({
  guarantorRequests = [],
  freeSharesAvailable = 0,
  onRespondGuarantor
}) {
  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 shadow-lg">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">Guarantor Requests Received</h3>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">Your Current Available Free Shares:</span>
          <span className="text-emerald-400 font-black text-xs sm:text-sm">
            KES {Number(freeSharesAvailable || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {guarantorRequests.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-xs">You have no pending guarantor requests.</div>
      ) : (
        <div className="space-y-2.5">
          {guarantorRequests.map((g) => {
            const borrowerName = g.loans?.profiles?.full_name || 'Cooperative Member';
            const borrowerMemberNo = g.loans?.profiles?.member_number || 'N/A';
            const borrowerCompany = Array.isArray(g.loans?.profiles?.companies)
              ? g.loans?.profiles?.companies[0]?.name
              : g.loans?.profiles?.companies?.name || 'KEWA SACCO';

            return (
              <div
                key={g.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      g.status === 'accepted'
                        ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                        : g.status === 'pending'
                        ? 'bg-amber-950 border border-amber-800 text-amber-300'
                        : 'bg-rose-950 border border-rose-800 text-rose-300'
                    }`}
                  >
                    Guarantee: {g.status}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{borrowerName}</h4>
                  <p className="text-[11px] text-slate-400">
                    {borrowerCompany} • Member {borrowerMemberNo}
                  </p>
                  <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">
                    Pledged: KES {Number(g.amount_guaranteed || 0).toLocaleString()} (Product:{' '}
                    {(g.loans?.loan_product || 'main_loan').replace('_', ' ').toUpperCase()})
                  </p>
                </div>

                {g.status === 'pending' && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => onRespondGuarantor(g.id, 'accepted', g.amount_guaranteed)}
                      className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => onRespondGuarantor(g.id, 'rejected', g.amount_guaranteed)}
                      className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}