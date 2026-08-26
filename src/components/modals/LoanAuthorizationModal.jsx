import React, { useState } from 'react';
import { Shield, Key, ArrowRight, CheckCircle, X } from 'lucide-react';

export default function LoanAuthorizationModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  loanProduct,
  loanPrincipalNum,
  loanMonths,
  interestRate,
  calculatedTotal,
  monthlyInstallment,
  disbursementMethod,
  disbursementDetails
}) {
  const [enteredPin, setEnteredPin] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  if (!isOpen) return null;

  const handleAuthorize = (e) => {
    e.preventDefault();
    if (!termsAgreed) {
      alert('Please check the box agreeing to the KEWA SACCO Loan Terms & Conditions.');
      return;
    }
    if (enteredPin.length !== 4) {
      alert('Please enter your 4-digit Transaction Security PIN.');
      return;
    }
    onConfirm(enteredPin, () => {
      setEnteredPin('');
      setTermsAgreed(false);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950 border border-emerald-900/60 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Authorize Loan Facility</h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAuthorize} className="flex flex-col overflow-hidden flex-1">
          <div className="p-6 overflow-y-auto space-y-3.5 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-2xl space-y-1">
              <p className="font-bold text-emerald-300 text-sm capitalize">
                Facility: {(loanProduct || 'main_loan').replace('_', ' ').toUpperCase()}
              </p>
              <div className="flex justify-between text-slate-300 font-medium">
                <span>Principal: <strong>KES {Number(loanPrincipalNum || 0).toLocaleString()}</strong></span>
                <span>Duration: <strong>{loanMonths} Month(s)</strong></span>
                <span>Payable: <strong>KES {Number(calculatedTotal || 0).toLocaleString()}</strong></span>
              </div>
              <p className="text-[11px] text-emerald-400 pt-1">
                Disbursement Destination: <strong className="uppercase">{disbursementMethod}</strong> ({disbursementDetails || 'Not specified'})
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">Enter 4-Digit Transaction Security PIN</label>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  data-lpignore="true"
                  autoComplete="new-password"
                  required
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  className="w-full bg-slate-900 border border-amber-500/60 rounded-xl py-2 px-3 text-center text-base tracking-widest text-white font-mono"
                />
                <Key className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Default PIN is <code className="text-emerald-400 font-mono">1234</code>.</p>
            </div>

            <h4 className="font-bold text-white text-xs uppercase tracking-wide">1. Payroll Deduction Authorization</h4>
            <p>
              By submitting this loan request, I authorize my employer or checkoff unit to deduct <strong>KES {Number(monthlyInstallment || 0).toFixed(2)}</strong> monthly until settled in full.
            </p>

            <h4 className="font-bold text-white text-xs uppercase tracking-wide">2. Interest Rate & Repayment</h4>
            <p>
              Interest is charged at <strong>{interestRate}% per month</strong>. Default attracts recovery under the Co-operative Societies Act.
            </p>

            <h4 className="font-bold text-white text-xs uppercase tracking-wide">3. Sequential 3-Signatory Quorum</h4>
            <p className="flex items-center gap-1.5 flex-wrap">
              Disbursement proceeds strictly in sequence: 
              <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-300 font-bold border border-slate-800">1. Assistant Chair</span> 
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-300 font-bold border border-slate-800">2. Chairman</span> 
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-300 font-bold border border-slate-800">3. Treasurer</span>.
            </p>

            <div className="flex items-start gap-2 pt-2 border-t border-slate-800">
              <input
                type="checkbox"
                id="agreeTermsModal"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 accent-emerald-500 w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="agreeTermsModal" className="text-xs text-slate-300 font-medium cursor-pointer">
                I have read, understood, and accept all loan terms and recovery policies.
              </label>
            </div>
          </div>

          <div className="p-5 border-t border-slate-800 bg-slate-900/80 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!termsAgreed || enteredPin.length !== 4 || loading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> {loading ? 'Submitting...' : 'Verify PIN & Submit Loan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}