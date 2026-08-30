import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldAlert, CheckCircle, XCircle, TrendingUp, Users } from 'lucide-react';
import { calculateNetSocietyLiquidity } from '../utils/calculations';

export default function LeadershipHubTab({ profile, session }) {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [allSavings, setAllSavings] = useState([]);
  const [allLoans, setAllLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (session?.user?.id) {
      fetchAdminData();
    }
  }, [session]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [loansRes, savingsRes, pendingRes] = await Promise.all([
        supabase.from('loans').select('*, profiles(full_name, member_number)'),
        supabase.from('savings_ledger').select('*'),
        supabase.from('loans').select('*, profiles(full_name, member_number)').eq('status', 'pending')
      ]);

      if (loansRes.data) setAllLoans(loansRes.data);
      if (savingsRes.data) setAllSavings(savingsRes.data);
      if (pendingRes.data) setPendingLoans(pendingRes.data);
    } catch (err) {
      console.error('Error loading leadership hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLoanStatus = async (loanId, newStatus) => {
    setMessage({ text: '', type: '' });
    try {
      const { error } = await supabase
        .from('loans')
        .update({ status: newStatus })
        .eq('id', loanId);

      if (error) throw error;

      setMessage({ text: `Loan status successfully updated to ${newStatus}.`, type: 'success' });
      fetchAdminData();
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  const totalSharesCapital = allSavings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalUnpaidLoans = allLoans
    .filter(l => ['approved', 'disbursed'].includes(l.status))
    .reduce((acc, curr) => acc + Number(curr.balance_remaining || curr.principal_amount || 0), 0);
  
  const netLiquidity = calculateNetSocietyLiquidity(totalSharesCapital, totalUnpaidLoans, 0);

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-xs font-mono">Loading leadership governance portal...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Liquidity Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs font-semibold text-slate-400">Total Society Shares Capital</span>
          <h4 className="text-xl font-black text-emerald-400 font-mono mt-2">KES {totalSharesCapital.toLocaleString()}</h4>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs font-semibold text-slate-400">Total Outgoing Loan Exposure</span>
          <h4 className="text-xl font-black text-amber-400 font-mono mt-2">KES {totalUnpaidLoans.toLocaleString()}</h4>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs font-semibold text-slate-400">Net Society Liquidity</span>
          <h4 className="text-xl font-black text-cyan-400 font-mono mt-2">KES {netLiquidity.toLocaleString()}</h4>
        </div>
      </div>

      {/* Pending Loan Approvals */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" /> Pending Loan Approvals & Disbursement Queue
        </h3>
        <p className="text-xs text-slate-400 mb-4">Review and authorize member loan applications for final executive disbursement.</p>

        {message.text && (
          <div className={`mb-4 px-4 py-3 rounded-2xl text-xs font-bold border ${message.type === 'error' ? 'bg-rose-950/80 border-rose-800 text-rose-300' : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-3">
          {pendingLoans.map((loan) => (
            <div key={loan.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-xs font-bold text-white">
                  Applicant: {loan.profiles?.full_name || 'Member'} ({loan.profiles?.member_number || 'N/A'})
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Product: <span className="uppercase text-emerald-400 font-semibold">{loan.loan_product?.replace('_', ' ')}</span> • Period: {loan.repayment_period_months} Months
                </p>
                <p className="text-[11px] text-cyan-400 font-mono mt-1">
                  Principal Amount: KES {Number(loan.principal_amount || 0).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleUpdateLoanStatus(loan.id, 'approved')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleUpdateLoanStatus(loan.id, 'rejected')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}

          {pendingLoans.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-6">No pending loan applications in the queue.</p>
          )}
        </div>
      </div>
    </div>
  );
}