import React from 'react';
import { Calculator, Download, Plus } from 'lucide-react';
import GuarantorSelector from '../loans/GuarantorSelector';
import { formatAccountingNumber } from '../../utils/formatters';

export default function LoansTab({
  loanProduct,
  onProductChange,
  maxLimit,
  loanPrincipalRaw,
  setLoanPrincipalRaw,
  loanPrincipalNum,
  loanMonths,
  setLoanMonths,
  interestRate,
  disbursementMethod,
  setDisbursementMethod,
  disbursementDetails,
  setDisbursementDetails,
  profilePhone,       // <-- Must be listed here in props!
  guarantorList,
  allMembers,
  currentUserId,
  onUpdateGuarantorRow,
  onAddGuarantorRow,
  onRemoveGuarantorRow,
  calculatedTotal,
  monthlyInstallment,
  onInitiateLoan,
  loans,
  onDownloadPDF,
  loading
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Loan Application Form */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Apply for a Loan</h3>
          </div>
          <div className="bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-xl text-[11px] font-bold text-emerald-300">
            Max Limit: KES {Number(maxLimit || 0).toLocaleString()}
          </div>
        </div>

        {/* Product Selector Cards */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            type="button"
            onClick={() => onProductChange('main_loan')}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              loanProduct === 'main_loan'
                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-xs font-bold block">1. Main Loan</span>
            <span className="text-[10px] text-slate-400">Long-term (24 mos, 1%)</span>
          </button>

          <button
            type="button"
            onClick={() => onProductChange('emergency_loan')}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              loanProduct === 'emergency_loan'
                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-xs font-bold block">2. Emergency Loan</span>
            <span className="text-[10px] text-slate-400">School & Medical (12 mos)</span>
          </button>

          <button
            type="button"
            onClick={() => onProductChange('christmas_loan')}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              loanProduct === 'christmas_loan'
                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-xs font-bold block">3. Christmas Loan</span>
            <span className="text-[10px] text-slate-400">Festivities (6 mos)</span>
          </button>

          <button
            type="button"
            onClick={() => onProductChange('monthly_shylock')}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              loanProduct === 'monthly_shylock'
                ? 'bg-amber-950/80 border-amber-500 text-white shadow'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-xs font-bold block text-amber-400">4. Monthly Shylock</span>
            <span className="text-[10px] text-slate-400">Instant Advance (1 mo)</span>
          </button>
        </div>

        <form onSubmit={onInitiateLoan} className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">Principal Amount (KES)</label>
              <span className="text-emerald-400 font-bold text-xs">KES {loanPrincipalNum.toLocaleString()}</span>
            </div>
            <input
              type="text"
              required
              value={loanPrincipalRaw}
              onChange={(e) => setLoanPrincipalRaw(formatAccountingNumber(e.target.value))}
              placeholder="e.g. 20,000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">Repayment Period</label>
              <span className="text-emerald-400 font-bold text-xs">{loanMonths} Month(s)</span>
            </div>
            <input
              type="range"
              min="1"
              max={
                loanProduct === 'monthly_shylock'
                  ? 1
                  : loanProduct === 'christmas_loan'
                  ? 6
                  : loanProduct === 'emergency_loan'
                  ? 12
                  : 24
              }
              step="1"
              value={loanMonths}
              onChange={(e) => setLoanMonths(Number(e.target.value))}
              className="w-full accent-emerald-500"
              disabled={loanProduct === 'monthly_shylock'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Disbursement Channel</label>
              <select
                value={disbursementMethod}
                onChange={(e) => {
                  setDisbursementMethod(e.target.value);
                  if (e.target.value === 'mpesa') {
                    setDisbursementDetails(profilePhone || '');
                  } else {
                    setDisbursementDetails('');
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="mpesa">M-Pesa Mobile Money</option>
                <option value="bank">Direct Bank Account Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {disbursementMethod === 'mpesa' ? 'M-Pesa Payout Destination' : 'Bank Account Details'}
              </label>

              {disbursementMethod === 'mpesa' ? (
                <div className="space-y-1.5">
                  <select
                    onChange={(e) => {
                      if (e.target.value === 'my_number') {
                        setDisbursementDetails(profilePhone || '');
                      } else {
                        setDisbursementDetails('');
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white mb-1"
                  >
                    <option value="my_number">Use My Registered Number ({profilePhone || 'N/A'})</option>
                    <option value="other_number">Use Another Phone Number</option>
                  </select>

                  <input
                    type="text"
                    required
                    value={disbursementDetails}
                    onChange={(e) => setDisbursementDetails(e.target.value)}
                    placeholder="0712345678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  required
                  value={disbursementDetails}
                  onChange={(e) => setDisbursementDetails(e.target.value)}
                  placeholder="Bank Name, Acc No, Branch"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              )}
            </div>
          </div>

          {loanProduct !== 'monthly_shylock' && (
            <div className="border-t border-slate-800 pt-3 space-y-2.5">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Assign Member Guarantors</h4>
                  <p className="text-[10px] text-slate-400">
                    Total pledges must cover loan principal (KES {loanPrincipalNum.toLocaleString()})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onAddGuarantorRow}
                  className="flex items-center gap-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-[11px] px-2 py-1 rounded-lg cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>

              {guarantorList.map((g, idx) => (
                <GuarantorSelector
                  key={idx}
                  index={idx}
                  row={g}
                  allMembers={allMembers}
                  currentUserId={currentUserId}
                  onUpdate={onUpdateGuarantorRow}
                  onRemove={onRemoveGuarantorRow}
                  canRemove={guarantorList.length > 1}
                />
              ))}
            </div>
          )}

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Selected Product:</span>
              <span className="text-white font-bold capitalize">{loanProduct.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Interest Rate:</span>
              <span className="text-white font-medium">{interestRate}% / month</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Payable:</span>
              <span className="text-white font-medium">KES {Number(calculatedTotal || 0).toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-800 pt-1.5 flex justify-between text-xs font-bold text-emerald-400">
              <span>Monthly Installment:</span>
              <span>KES {Number(monthlyInstallment || 0).toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg cursor-pointer"
          >
            Review Terms & Authorize with PIN
          </button>
        </form>
      </div>

      {/* Loan Application Status & Signatory Progress Tracker */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-sm sm:text-base font-bold text-white mb-3">My Loan Applications & Approval Tracker</h3>
        {loans.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">No active or past loans found.</div>
        ) : (
          <div className="space-y-3">
            {loans.map((l) => (
              <div key={l.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          l.status === 'approved'
                            ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                            : l.status === 'completed'
                            ? 'bg-blue-950 border border-blue-800 text-blue-300'
                            : l.status === 'pending'
                            ? 'bg-amber-950 border border-amber-800 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Status: {l.status}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 capitalize border border-slate-800">
                        {(l.loan_product || 'main_loan').replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white mt-1">
                      KES {Number(l.principal_amount).toLocaleString()}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {l.repayment_period_months} Month(s) Term • Via{' '}
                      <span className="uppercase text-emerald-400 font-bold">{l.disbursement_method || 'mpesa'}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDownloadPDF(l)}
                    className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-xl text-[11px] font-semibold border border-slate-800 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> PDF
                  </button>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 text-[10px] space-y-1">
                  <p className="text-slate-400 font-semibold mb-0.5">Sequential 3-Signatory Pipeline:</p>
                  <div className="grid grid-cols-3 gap-1 text-center font-mono">
                    <span
                      className={`p-1 rounded-lg font-bold ${
                        l.assistant_chair_approval
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-950 text-slate-500'
                      }`}
                    >
                      1. Asst: {l.assistant_chair_approval ? '✓' : 'PENDING'}
                    </span>
                    <span
                      className={`p-1 rounded-lg font-bold ${
                        l.chairman_approval
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-950 text-slate-500'
                      }`}
                    >
                      2. Chair: {l.chairman_approval ? '✓' : 'PENDING'}
                    </span>
                    <span
                      className={`p-1 rounded-lg font-bold ${
                        l.treasurer_approval
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-950 text-slate-500'
                      }`}
                    >
                      3. Treas: {l.treasurer_approval ? '✓' : 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}