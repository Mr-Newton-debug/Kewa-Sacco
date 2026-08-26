import React from 'react';
import { Smartphone, Send } from 'lucide-react';
import { formatAccountingNumber } from '../../utils/formatters';

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
    <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">Direct M-Pesa Payment & Top-Up</h3>
          <p className="text-[11px] text-slate-400">Instant Savings Deposit or Loan Repayment via M-Pesa</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-0.5 text-xs font-medium">
        <p className="text-slate-300 font-bold">Paybill Instructions:</p>
        <p className="text-slate-400">
          Business No: <strong className="text-white font-mono">522522</strong> (KEWA SACCO)
        </p>
        <p className="text-slate-400">
          Account No: <strong className="text-emerald-400 font-mono">{profile?.member_number || 'Your Member No'}</strong>
        </p>
      </div>

      <form onSubmit={onSubmitMpesa} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Account</label>
          <select
            value={mpesaType}
            onChange={(e) => setMpesaType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
          >
            <option value="savings_deposit">Voluntary Savings Top-Up</option>
            <option value="loan_repayment">Direct Loan Repayment (Clear Balance)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">M-Pesa Phone Number</label>
          <input
            type="tel"
            required
            autoComplete="off"
            value={mpesaPhone || profile?.phone || ''}
            onChange={(e) => setMpesaPhone(e.target.value)}
            placeholder="0712345678"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (KES)</label>
          <input
            type="text"
            required
            value={mpesaAmountRaw}
            onChange={(e) => setMpesaAmountRaw(formatAccountingNumber(e.target.value))}
            placeholder="e.g. 3,000"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            M-Pesa Transaction Code (Optional)
          </label>
          <input
            type="text"
            autoComplete="off"
            value={mpesaCode}
            onChange={(e) => setMpesaCode(e.target.value)}
            placeholder="e.g. QGH789KL12"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" /> {loading ? 'Processing...' : 'Confirm & Credit Account'}
        </button>
      </form>
    </div>
  );
}