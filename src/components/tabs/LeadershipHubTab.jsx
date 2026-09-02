import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { ShieldAlert, CheckCircle, XCircle, Users, FileText, Activity, Database, DollarSign } from 'lucide-react';

export default function LeadershipHubTab({
  userRole,
  totalSocietySharesCapital,
  totalSocietyInterestAccrued,
  totalSocietyUnpaidLoans,
  netSocietyLiquidCapital,
  filteredGuarantorInspectionList,
  guarantorTrackerSearch,
  setGuarantorTrackerSearch,
  onRefreshAdmin,
  allPendingClaims,
  onWelfarePipeline,
  filteredMemberDirectory,
  memberDirectorySearch,
  setMemberDirectorySearch,
  memberDirectoryCompanyFilter,
  setMemberDirectoryCompanyFilter,
  allMembers,
  manualTargetMemberId,
  setManualTargetMemberId,
  manualAdjustmentType,
  setManualAdjustmentType,
  manualAmountRaw,
  setManualAmountRaw,
  manualRefCode,
  setManualRefCode,
  onManualMemberAdjustment,
  performanceRankedLoans,
  allPendingLoans,
  onSignatoryPipeline,
  allAdminInquiries,
  auditLogs,
  loading
}) {
  const [activeSubTab, setActiveSubTab] = useState('signatories');

  return (
    <div className="space-y-6">
      {/* Executive Liquidity KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs font-semibold text-slate-400">Total Shares Capital</span>
          <h4 className="text-xl font-black text-emerald-400 font-mono mt-2">KES {totalSocietySharesCapital.toLocaleString()}</h4>
          <p className="text-[10px] text-slate-400 mt-1">Accumulated member savings</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs font-semibold text-slate-400">Total Outgoing Loans</span>
          <h4 className="text-xl font-black text-amber-400 font-mono mt-2">KES {totalSocietyUnpaidLoans.toLocaleString()}</h4>
          <p className="text-[10px] text-slate-400 mt-1">Active loan portfolio balance</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs font-semibold text-slate-400">Interest Projected</span>
          <h4 className="text-xl font-black text-cyan-400 font-mono mt-2">KES {totalSocietyInterestAccrued.toLocaleString()}</h4>
          <p className="text-[10px] text-slate-400 mt-1">Expected portfolio returns</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs font-semibold text-slate-400">Net Society Liquidity</span>
          <h4 className="text-xl font-black text-white font-mono mt-2">KES {netSocietyLiquidCapital.toLocaleString()}</h4>
          <p className="text-[10px] text-emerald-400 mt-1">Available operational reserves</p>
        </div>
      </div>

      {/* Leadership Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('signatories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeSubTab === 'signatories' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Signatory Approvals ({allPendingLoans.length})
        </button>
        <button
          onClick={() => setActiveSubTab('guarantors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeSubTab === 'guarantors' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Guarantor Exposure Tracker
        </button>
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeSubTab === 'directory' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Member Directory & Balances
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeSubTab === 'audit' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Audit Logs & Security
        </button>
      </div>

      {/* Sub-Tab 1: Signatory Approvals */}
      {activeSubTab === 'signatories' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Multi-Tier Executive Loan Signatory Pipeline
          </h3>
          <div className="space-y-4">
            {allPendingLoans.map((loan) => {
              const isAsstChair = userRole === 'assistant_chair' || userRole === 'admin';
              const isChairman = userRole === 'chairman' || userRole === 'admin';
              const isTreasurer = userRole === 'treasurer' || userRole === 'admin';

              return (
                <div key={loan.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">
                        {loan.profiles?.full_name} ({loan.profiles?.member_number})
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Product: <span className="text-emerald-400 uppercase font-semibold">{loan.loan_product?.replace('_', ' ')}</span> • Principal: KES {Number(loan.principal_amount).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-950 text-amber-400 border border-amber-800">
                      {loan.status}
                    </span>
                  </div>

                  {/* Signatory Checkboxes / Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-300">Asst Chair:</span>
                      {isAsstChair ? (
                        <button
                          onClick={() => onSignatoryPipeline(loan.id, 'assistant_chair', loan.assistant_chair_approval ? 'unsign' : 'sign')}
                          className={`px-3 py-1 rounded-lg font-bold text-[10px] ${loan.assistant_chair_approval ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                          {loan.assistant_chair_approval ? 'Signed ✓' : 'Sign'}
                        </button>
                      ) : (
                        <span className={loan.assistant_chair_approval ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{loan.assistant_chair_approval ? 'Signed' : 'Pending'}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-300">Chairman:</span>
                      {isChairman ? (
                        <button
                          onClick={() => onSignatoryPipeline(loan.id, 'chairman', loan.chairman_approval ? 'unsign' : 'sign')}
                          className={`px-3 py-1 rounded-lg font-bold text-[10px] ${loan.chairman_approval ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                          {loan.chairman_approval ? 'Signed ✓' : 'Sign'}
                        </button>
                      ) : (
                        <span className={loan.chairman_approval ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{loan.chairman_approval ? 'Signed' : 'Pending'}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-300">Treasurer (Disburse):</span>
                      {isTreasurer ? (
                        <button
                          onClick={() => onSignatoryPipeline(loan.id, 'treasurer', loan.treasurer_approval ? 'unsign' : 'sign')}
                          className={`px-3 py-1 rounded-lg font-bold text-[10px] ${loan.treasurer_approval ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                          {loan.treasurer_approval ? 'Approved ✓' : 'Authorize'}
                        </button>
                      ) : (
                        <span className={loan.treasurer_approval ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{loan.treasurer_approval ? 'Approved' : 'Pending'}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {allPendingLoans.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No pending loan applications requiring signatures.</p>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Guarantor Tracker */}
      {activeSubTab === 'guarantors' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> System-Wide Guarantor Exposure Monitor
            </h3>
            <input
              type="text"
              value={guarantorTrackerSearch}
              onChange={(e) => setGuarantorTrackerSearch(e.target.value)}
              placeholder="Search guarantor or borrower..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-3 font-semibold">Guarantor Member</th>
                  <th className="pb-3 font-semibold">Borrower Pledged To</th>
                  <th className="pb-3 font-semibold">Amount Guaranteed</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredGuarantorInspectionList.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-950/40">
                    <td className="py-3 font-bold text-white">{g.profiles?.full_name || 'N/A'}</td>
                    <td className="py-3">{g.loans?.profiles?.full_name || 'N/A'}</td>
                    <td className="py-3 font-mono text-cyan-400">KES {Number(g.amount_guaranteed || 0).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${g.status === 'accepted' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400'}`}>
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredGuarantorInspectionList.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-500">No guarantor commitments match search criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Member Directory */}
      {activeSubTab === 'directory' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Complete Member Directory & Financial Balances
            </h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={memberDirectorySearch}
                onChange={(e) => setMemberDirectorySearch(e.target.value)}
                placeholder="Search name, phone, ID..."
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 flex-1 sm:w-48"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-3 font-semibold">Member No & Name</th>
                  <th className="pb-3 font-semibold">Phone / ID</th>
                  <th className="pb-3 font-semibold">Total Savings</th>
                  <th className="pb-3 font-semibold">Active Debt</th>
                  <th className="pb-3 font-semibold">Free Shares</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMemberDirectory.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-950/40">
                    <td className="py-3">
                      <p className="font-bold text-white">{m.full_name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{m.member_number}</p>
                    </td>
                    <td className="py-3 font-mono text-slate-300">
                      <p>{m.phone || 'N/A'}</p>
                      <p className="text-[10px] text-slate-500">{m.id_number}</p>
                    </td>
                    <td className="py-3 font-mono font-bold text-emerald-400">KES {Number(m.totalSavings || 0).toLocaleString()}</td>
                    <td className="py-3 font-mono text-amber-400">KES {Number(m.totalActiveDebt || 0).toLocaleString()}</td>
                    <td className="py-3 font-mono text-cyan-400">KES {Number(m.unencumberedShares || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Audit Logs */}
      {activeSubTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Security & System Audit Trail
          </h3>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-emerald-400 uppercase text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 mr-2">{log.action}</span>
                  <span className="text-slate-200">{log.details}</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">By: {log.user_name || 'System'} • {new Date(log.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No audit log entries recorded yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}