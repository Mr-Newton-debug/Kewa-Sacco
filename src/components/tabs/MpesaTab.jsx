import React from 'react';
import { Smartphone, Send, ShieldCheck } from 'lucide-react';

export default function MpesaTab({
  profile,
  mpesaType,
  setMpesaType,
  mpesaPhone,
  setMpesaPhone,
  mpesaAmountRaw,
  setMpesaAmountRaw,
  mpesaCode,
  setMpesaCode,
  onSubmitMpesa,
  loading
}) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-inner">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white">M-Pesa Express (STK Push)</h3>
          <p className="text-xs text-slate-400 mt-1">Make instant deposits to your savings or clear loan installments directly via mobile money.</p>
        </div>

        <form onSubmit={onSubmitMpesa} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Transaction Category</label>
            <select
              value={mpesaType}
              onChange={(e) => setMpesaType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="savings_deposit">Monthly Savings Contribution</option>
              <option value="loan_repayment">Loan Repayment Installment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">M-Pesa Phone Number</label>
            <input
              type="text"
              required
              defaultValue={profile?.phone || ''}
              onChange={(e) => setMpesaPhone(e.target.value)}
              placeholder="0712345678"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (KES)</label>
              <input
                type="text"
                required
                value={mpesaAmountRaw}
                onChange={(e) => setMpesaAmountRaw(e.target.value)}
                placeholder="e.g. 5,000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">M-Pesa Receipt Code (Optional)</label>
              <input
                type="text"
                value={mpesaCode}
                onChange={(e) => setMpesaCode(e.target.value)}
                placeholder="e.g. QHX892K1"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono uppercase"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Send className="w-4 h-4" /> {loading ? 'Processing STK Prompt...' : 'Initiate M-Pesa Payment'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secured via Safaricom Daraja API Gateway
        </div>
      </div>
    </div>
  );
}