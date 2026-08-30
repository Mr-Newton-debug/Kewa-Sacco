import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CreditCard, Calculator, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { calculateLoanBreakdown } from '../utils/calculations';

export default function LoansTab({ profile, session }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Loan application form states
  const [loanProduct, setLoanProduct] = useState('main_loan');
  const [principal, setPrincipal] = useState('');
  const [periodMonths, setPeriodMonths] = useState('12');
  const [guarantor1, setGuarantor1] = useState('');
  const [guarantor2, setGuarantor2] = useState('');
  const [membersList, setMembersList] = useState([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchLoans();
      fetchEligibleGuarantors();
    }
  }, [session]);

  const fetchLoans = async () => {
    try {
      const { data } = await supabase
        .from('loans')
        .select('*')
        .eq('member_id', session.user.id)
        .order('created_at', { ascending: false });
      if (data) setLoans(data);
    } catch (err) {
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleGuarantors = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, member_number')
      .neq('id', session.user.id);
    if (data) setMembersList(data);
  };

  // Live calculation preview
  const interestRate = loanProduct === 'monthly_shylock' ? 5.0 : 1.0;
  const breakdown = calculateLoanBreakdown(principal, interestRate, Number(periodMonths), loanProduct);

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase.from('loans').insert([{
        member_id: session.user.id,
        loan_product: loanProduct,
        principal_amount: Number(principal),
        repayment_period_months: Number(periodMonths),
        interest_rate_percent: interestRate,
        balance_remaining: breakdown.totalPayable,
        status: 'pending'
      }]);

      if (error) throw error;

      setMessage({ text: 'Loan application submitted successfully! Pending guarantor endorsements and committee review.', type: 'success' });
      setPrincipal('');
      fetchLoans();
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-xs font-mono">Loading loan accounts...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Loan Application & Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" /> Apply for SACCO Loan Product
          </h3>

          {message.text && (
            <div className={`mb-4 px-4 py-3 rounded-2xl text-xs font-bold border ${message.type === 'error' ? 'bg-rose-950/80 border-rose-800 text-rose-300' : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleApplyLoan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Loan Product Type</label>
                <select
                  value={loanProduct}
                  onChange={(e) => setLoanProduct(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="main_loan">Main Loan (1% p.m. Reducing)</option>
                  <option value="emergency">Emergency Loan</option>
                  <option value="christmas">Christmas Advance</option>
                  <option value="monthly_shylock">Monthly Shylock (Short Term)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Principal Amount (KES)</label>
                <input
                  type="number"
                  required
                  min="1000"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Repayment Period (Months)</label>
                <select
                  value={periodMonths}
                  onChange={(e) => setPeriodMonths(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="24">24 Months</option>
                  <option value="36">36 Months</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Interest Rate Model</label>
                <input
                  type="text"
                  disabled
                  value={`${interestRate}% ${loanProduct === 'monthly_shylock' ? 'Flat' : 'Per Month'}`}
                  className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg cursor-pointer mt-2"
            >
              {submitting ? 'Submitting Application...' : 'Submit Loan Application'}
            </button>
          </form>
        </div>

        {/* Live Amortization Calculator Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Calculator className="w-4 h-4 text-emerald-400" /> Repayment Preview
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] text-slate-400">Estimated Monthly Installment</p>
                <h4 className="text-xl font-black text-emerald-400 font-mono mt-1">
                  KES {Number(breakdown.monthlyInstallment).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </h4>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Total Interest Payable</p>
                <h4 className="text-sm font-bold text-white font-mono mt-0.5">
                  KES {Number(breakdown.totalInterest).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </h4>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Total Repayment Amount</p>
                <h4 className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                  KES {Number(breakdown.totalPayable).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </h4>
              </div>
            </div>
          </div>
          <div className="mt-6 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
            * Calculations reflect approved SACCO bylaws for interest tiering and reducing balance amortization.
          </div>
        </div>
      </div>

      {/* Active and Past Loans Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">My Loan Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Principal (KES)</th>
                <th className="pb-3 font-semibold">Period</th>
                <th className="pb-3 font-semibold">Balance Remaining (KES)</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-950/40">
                  <td className="py-3 font-bold uppercase text-white">{loan.loan_product.replace('_', ' ')}</td>
                  <td className="py-3 font-mono">KES {Number(loan.principal_amount).toLocaleString()}</td>
                  <td className="py-3">{loan.repayment_period_months} Months</td>
                  <td className="py-3 font-mono font-bold text-emerald-400">KES {Number(loan.balance_remaining || loan.principal_amount).toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      loan.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      loan.status === 'pending' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
              {loans.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-500">No loan records found on your account.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}