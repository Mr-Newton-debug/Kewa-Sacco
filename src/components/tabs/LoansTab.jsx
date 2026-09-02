import React from 'react';
import { CreditCard, Calculator, FileText, CheckCircle2, Trash2, Plus } from 'lucide-react';

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
  profilePhone,
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
    <div className="space-y-6">
      {/* Loan Application Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={onInitiateLoan} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" /> Apply for SACCO Loan Product
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Loan Product Type</label>
              <select
                value={loanProduct}
                onChange={(e) => onProductChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="main_loan">Main Loan (1% p.m. Reducing)</option>
                <option value="emergency_loan">Emergency Loan (1% p.m.)</option>
                <option value="christmas_loan">Christmas Advance (1% p.m.)</option>
                <option value="monthly_shylock">Monthly Shylock (5% flat)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Principal Amount (Max: KES {maxLimit.toLocaleString()})
              </label>
              <input
                type="text"
                required
                value={loanPrincipalRaw}
                onChange={(e) => setLoanPrincipalRaw(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Repayment Period (Months)</label>
              <select
                value={loanMonths}
                onChange={(e) => setLoanMonths(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {loanProduct === 'monthly_shylock' ? (
                  <option value={1}>1 Month (Short Term)</option>
                ) : (
                  <>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                    <option value={24}>24 Months</option>
                    <option value={36}>36 Months</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Interest Rate Model</label>
              <input
                type="text"
                disabled
                value={`${interestRate}% ${loanProduct === 'monthly_shylock' ? 'Flat' : 'Per Month Reducing'}`}
                className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 font-mono"
              />
            </div>
          </div>

          {/* Disbursement Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Disbursement Channel</label>
              <select
                value={disbursementMethod}
                onChange={(e) => setDisbursementMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="mpesa">M-Pesa Mobile Money</option>
                <option value="bank">Bank Transfer (Co-op / KCB)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account / Phone Details</label>
              <input
                type="text"
                required
                placeholder={disbursementMethod === 'mpesa' ? 'e.g. 0712345678' : 'Bank Account Number'}
                defaultValue={disbursementMethod === 'mpesa' ? profilePhone : ''}
                onChange={(e) => disbursementDetails = e.target.value}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Guarantor Assignment Section (For Non-Shylock Loans) */}
          {loanProduct !== 'monthly_shylock' && (
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Assign Loan Guarantors</span>
                <button
                  type="button"
                  onClick={onAddGuarantorRow}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Guarantor
                </button>
              </div>

              {guarantorList.map((row, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <select
                    value={row.guarantorId}
                    onChange={(e) => onUpdateGuarantorRow(idx, { guarantorId: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select Member Guarantor</option>
                    {allMembers.filter(m => m.id !== currentUserId).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.full_name} ({m.member_number}) - Free Shares: KES {(m.unencumberedShares || 0).toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Amount (KES)"
                    value={row.amountRaw}
                    onChange={(e) => onUpdateGuarantorRow(idx, { amountRaw: e.target.value })}
                    className="w-32 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  {guarantorList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveGuarantorRow(idx)}
                      className="p-2 text-rose-400 hover:text-rose-300 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-lg cursor-pointer mt-2"
          >
            {loading ? 'Processing Application...' : 'Proceed to Loan Agreement & PIN Authorization'}
          </button>
        </form>

        {/* Live Repayment Amortization Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Calculator className="w-4 h-4 text-emerald-400" /> Repayment Preview
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] text-slate-400">Estimated Monthly Installment</p>
                <h4 className="text-xl font-black text-emerald-400 font-mono mt-1">
                  KES {Number(monthlyInstallment).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </h4>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Total Repayment Amount</p>
                <h4 className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                  KES {Number(calculatedTotal).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </h4>
              </div>
            </div>
          </div>
          <div className="mt-6 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
            * Calculations reflect approved SACCO bylaws for interest tiering and reducing balance amortization.
          </div>
        </div>
      </div>

      {/* Loan Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">My Loan Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Principal (KES)</th>
                <th className="pb-3 font-semibold">Period</th>
                <th className="pb-3 font-semibold">Balance Remaining</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-950/40">
                  <td className="py-3 font-bold uppercase text-white">{loan.loan_product?.replace('_', ' ')}</td>
                  <td className="py-3 font-mono">KES {Number(loan.principal_amount).toLocaleString()}</td>
                  <td className="py-3">{loan.repayment_period_months} Months</td>
                  <td className="py-3 font-mono font-bold text-emerald-400">KES {Number(loan.balance_remaining || loan.principal_amount).toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      loan.status === 'approved' || loan.status === 'disbursed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      loan.status === 'pending' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onDownloadPDF(loan)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-xl text-[10px] font-bold transition cursor-pointer"
                    >
                      Download Schedule
                    </button>
                  </td>
                </tr>
              ))}
              {loans.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-500">No loan records found on your account.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}