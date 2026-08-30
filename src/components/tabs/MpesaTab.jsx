import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Smartphone, Send, CheckCircle, ShieldCheck } from 'lucide-react';

export default function MpesaTab({ profile, session }) {
  const [phone, setPhone] = useState(profile?.phone || '');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('savings');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleStkPush = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Simulate M-Pesa STK push and record transaction ledger
      const refCode = `KEWA${Math.floor(100000 + Math.random() * 900000)}`;

      if (transactionType === 'savings') {
        const { error } = await supabase.from('savings_ledger').insert([{
          member_id: session.user.id,
          amount: Number(amount),
          transaction_type: 'mpesa_deposit',
          reference_code: refCode
        }]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('repayments').insert([{
          member_id: session.user.id,
          amount_paid: Number(amount),
          reference_code: refCode
        }]);
        if (error) throw error;
      }

      setMessage({ text: `M-Pesa payment simulation successful! Ref: ${refCode}. Your account has been credited.`, type: 'success' });
      setAmount('');
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-inner">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white">M-Pesa Express (STK Push)</h3>
          <p className="text-xs text-slate-400 mt-1">Make instant deposits to your savings or clear loan installments directly from your phone.</p>
        </div>

        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-2xl text-xs font-bold text-center border ${message.type === 'error' ? 'bg-rose-950/80 border-rose-800 text-rose-300' : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleStkPush} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Transaction Category</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="savings">Monthly Savings Contribution</option>
              <option value="repayment">Loan Repayment Installment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">M-Pesa Phone Number</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0712345678"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (KES)</label>
            <input
              type="number"
              required
              min="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Send className="w-4 h-4" /> {loading ? 'Sending STK Prompt to Phone...' : 'Initiate M-Pesa Payment'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secured via Safaricom Daraja API Gateway
        </div>
      </div>
    </div>
  );
}