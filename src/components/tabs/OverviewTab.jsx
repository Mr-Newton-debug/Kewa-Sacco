import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Wallet, ShieldCheck, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { generatePDFStatement } from '../utils/pdfGenerator';

export default function OverviewTab({ profile, session }) {
  const [savings, setSavings] = useState([]);
  const [loans, setLoans] = useState([]);
  const [guarantors, setGuarantors] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchAllData();
    }
  }, [session]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const userId = session.user.id;

      const [savingsRes, loansRes, guarantorsRes, announcementsRes] = await Promise.all([
        supabase.from('savings_ledger').select('*').eq('member_id', userId),
        supabase.from('loans').select('*').eq('member_id', userId),
        supabase.from('loan_guarantors').select('*').eq('guarantor_id', userId),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(3)
      ]);

      if (savingsRes.data) setSavings(savingsRes.data);
      if (loansRes.data) setLoans(loansRes.data);
      if (guarantorsRes.data) setGuarantors(guarantorsRes.data);
      if (announcementsRes.data) setAnnouncements(announcementsRes.data);
    } catch (err) {
      console.error('Error loading overview metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalSavings = savings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const activeLoan = loans.find(l => ['pending', 'approved', 'disbursed'].includes((l.status || '').toLowerCase()));
  const activeLoanBalance = activeLoan ? Number(activeLoan.balance_remaining || activeLoan.principal_amount || 0) : 0;
  
  const committedGuarantees = guarantors
    .filter(g => ['accepted', 'pending'].includes((g.status || '').toLowerCase()))
    .reduce((acc, curr) => acc + Number(curr.amount_guaranteed || 0), 0);

  const freeShares = Math.max(0, totalSavings - activeLoanBalance - committedGuarantees);

  const handleDownloadStatement = () => {
    generatePDFStatement({
      profile,
      totalSavings,
      activeLoanBalance,
      freeSharesAvailable: freeShares,
      savings,
      loans,
      repayments: []
    });
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-xs font-mono">Loading financial overview...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-white">Financial Standing</h3>
          <p className="text-[11px] text-slate-400">Real-time balances across your cooperative accounts</p>
        </div>
        <button
          onClick={handleDownloadStatement}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition shadow-lg cursor-pointer"
        >
          <Download className="w-4 h-4" /> Download Official Statement
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Savings</span>
            <div className="p-2 rounded-2xl bg-emerald-950/60 text-emerald-400 border border-emerald-800"><Wallet className="w-4 h-4" /></div>
          </div>
          <h4 className="text-xl font-black text-white">KES {totalSavings.toLocaleString()}</h4>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">Accumulated shares capital</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Free Shares Available</span>
            <div className="p-2 rounded-2xl bg-cyan-950/60 text-cyan-400 border border-cyan-800"><ShieldCheck className="w-4 h-4" /></div>
          </div>
          <h4 className="text-xl font-black text-cyan-400">KES {freeShares.toLocaleString()}</h4>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">Unencumbered guarantee power</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Active Debt Balance</span>
            <div className="p-2 rounded-2xl bg-amber-950/60 text-amber-400 border border-amber-800"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <h4 className="text-xl font-black text-white">KES {activeLoanBalance.toLocaleString()}</h4>
          <p className="text-[10px] text-amber-400 mt-1 font-medium">{activeLoan ? activeLoan.loan_product.replace('_', ' ').toUpperCase() : 'No Active Loan'}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Running Guarantees</span>
            <div className="p-2 rounded-2xl bg-rose-950/60 text-rose-400 border border-rose-800"><AlertCircle className="w-4 h-4" /></div>
          </div>
          <h4 className="text-xl font-black text-white">KES {committedGuarantees.toLocaleString()}</h4>
          <p className="text-[10px] text-rose-400 mt-1 font-medium">Pledged to peer loans</p>
        </div>
      </div>

      {/* Official Society Notices */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Official Society Notices & Announcements</h3>
        <div className="space-y-3">
          {announcements.map((item) => (
            <div key={item.id} className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold uppercase">{item.category || 'General'}</span>
                <span className="text-[10px] text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>
            </div>
          ))}
          {announcements.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-4">No active society announcements.</p>
          )}
        </div>
      </div>
    </div>
  );
}