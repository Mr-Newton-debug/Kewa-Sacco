import React from 'react';
import { 
  Coins, Layers, RotateCcw, Search, CheckCircle2, 
  HeartHandshake, CheckCircle, Lock, FileCheck, Database, 
  UploadCloud, Contact2, UserCheck, PlusCircle, AlertOctagon, 
  FolderDown, FileSpreadsheet, Clock, ArrowRight, MessageSquare, 
  Send, Bell, History 
} from 'lucide-react';
import { formatAccountingNumber } from '../../utils/formatters';

export default function LeadershipHubTab({
  userRole,
  totalSocietySharesCapital = 0,
  totalSocietyInterestAccrued = 0,
  totalSocietyUnpaidLoans = 0,
  netSocietyLiquidCapital = 0,
  filteredGuarantorInspectionList = [],
  guarantorTrackerSearch,
  setGuarantorTrackerSearch,
  onRefreshAdmin,
  allPendingClaims = [],
  onWelfarePipeline,
  onExecuteHistoricalMigration,
  setMigrationFile,
  filteredMemberDirectory = [],
  memberDirectorySearch,
  setMemberDirectorySearch,
  memberDirectoryCompanyFilter,
  setMemberDirectoryCompanyFilter,
  allMembers = [],
  manualTargetMemberId,
  setManualTargetMemberId,
  manualAdjustmentType,
  setManualAdjustmentType,
  manualAmountRaw,
  setManualAmountRaw,
  manualRefCode,
  setManualRefCode,
  onManualMemberAdjustment,
  performanceRankedLoans = [],
  docTitle,
  setDocTitle,
  docCategory,
  setDocCategory,
  docYear,
  setDocYear,
  setDocFile,
  onUploadSaccoDocument,
  batchMonth,
  setBatchMonth,
  onCSVUpload,
  batchPreview = [],
  onExecuteBatchCheckoff,
  allPendingLoans = [],
  onSignatoryPipeline,
  allAdminInquiries = [],
  adminReplyText,
  setAdminReplyText,
  onAdminReplyInquiry,
  newNoticeTitle,
  setNewNoticeTitle,
  newNoticeContent,
  setNewNoticeContent,
  onPublishNotice,
  auditLogs = [],
  loading
}) {
  const isAsstChairUser = userRole === 'assistant_chair' || userRole === 'admin';
  const isChairUser = userRole === 'chairman' || userRole === 'admin';
  const isTreasurerUser = userRole === 'treasurer' || userRole === 'admin';

  return (
    <div className="space-y-4">
      {/* Portfolio Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-800/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex justify-between items-center shadow-lg">
        <div>
          <span className="text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-900 text-amber-200 uppercase tracking-wide">
            Active Portfolio View: {userRole.replace('_', ' ').toUpperCase()}
          </span>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            {userRole === 'chairman' || userRole === 'admin'
              ? 'Executive Control & Oversight Dashboard'
              : userRole === 'treasurer'
              ? 'Treasurer & Financial Operations Desk'
              : 'Assistant Chair & Guarantor Verification Desk'}
          </h3>
        </div>
        <span className="text-xs text-amber-300/80 font-mono hidden sm:inline">KEWA SACCO Governance Framework</span>
      </div>

      {/* 1. Society Financial Position & Exposure Matrix */}
      {['admin', 'chairman'].includes(userRole) && (
        <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Society Financial Position & Accrued Capital Matrix
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Member Shares</p>
              <h4 className="text-base sm:text-xl font-black text-white mt-1">
                KES {Number(totalSocietySharesCapital || 0).toLocaleString('en-KE', { minimumFractionDigits: 0 })}
              </h4>
              <span className="text-[9px] text-emerald-400 font-medium">All Branches Capital</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Accrued Interest</p>
              <h4 className="text-base sm:text-xl font-black text-emerald-400 mt-1">
                KES {Number(totalSocietyInterestAccrued || 0).toLocaleString('en-KE', { minimumFractionDigits: 0 })}
              </h4>
              <span className="text-[9px] text-emerald-400 font-medium">Earned Portfolio Returns</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Unpaid Loans</p>
              <h4 className="text-base sm:text-xl font-black text-amber-400 mt-1">
                KES {Number(totalSocietyUnpaidLoans || 0).toLocaleString('en-KE', { minimumFractionDigits: 0 })}
              </h4>
              <span className="text-[9px] text-rose-400 font-medium">Gross Active Risk Exposure</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Net Liquid Capital</p>
              <h4 className="text-base sm:text-xl font-black text-teal-300 mt-1">
                KES {Number(netSocietyLiquidCapital || 0).toLocaleString('en-KE', { minimumFractionDigits: 0 })}
              </h4>
              <span className="text-[9px] text-teal-400 font-medium">Cash Reserve Available</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Guarantor Liability Tracking Matrix */}
      {['admin', 'chairman'].includes(userRole) && (
        <div className="bg-slate-900/90 border border-purple-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2.5 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Guarantor Liability & Tracking Matrix ({filteredGuarantorInspectionList.length})
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                Track active liability vs. auto-released pledges upon borrower loan clearance.
              </p>
            </div>

            <button
              type="button"
              onClick={onRefreshAdmin}
              className="self-start sm:self-auto p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 text-xs font-semibold flex items-center gap-1 transition border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Refresh
            </button>
          </div>

          <div className="mb-3 relative">
            <input
              type="text"
              placeholder="Search by Guarantor Name, Borrower Name, or Member Number..."
              value={guarantorTrackerSearch}
              onChange={(e) => setGuarantorTrackerSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:border-purple-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {filteredGuarantorInspectionList.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
              No guarantor records matched your search.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950 max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="p-2.5">Guarantor Details</th>
                    <th className="p-2.5">Borrower Details</th>
                    <th className="p-2.5 text-right">Pledged Amount</th>
                    <th className="p-2.5 text-right">Loan Balance</th>
                    <th className="p-2.5 text-center">Liability Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredGuarantorInspectionList.map((g) => {
                    const isLoanPaid =
                      g.loans?.status === 'completed' ||
                      Number(g.loans?.balance_remaining || 0) === 0 ||
                      g.status === 'released';

                    const borrowerComp = Array.isArray(g.loans?.profiles?.companies)
                      ? g.loans?.profiles?.companies[0]?.name
                      : g.loans?.profiles?.companies?.name || 'Branch';

                    return (
                      <tr key={g.id} className="hover:bg-slate-900/50 transition">
                        <td className="p-2.5 font-sans">
                          <div className="font-bold text-white">{g.profiles?.full_name || 'Member'}</div>
                          <div className="text-[10px] text-purple-400 font-mono">
                            {g.profiles?.member_number} • {g.profiles?.phone}
                          </div>
                        </td>
                        <td className="p-2.5 font-sans">
                          <div className="font-bold text-white">{g.loans?.profiles?.full_name || 'Borrower'}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {borrowerComp} ({g.loans?.profiles?.member_number})
                          </div>
                        </td>
                        <td className="p-2.5 text-right font-bold text-emerald-400">
                          KES {Number(g.amount_guaranteed || 0).toLocaleString()}
                        </td>
                        <td className="p-2.5 text-right font-bold text-amber-400">
                          KES {Number(g.loans?.balance_remaining || 0).toLocaleString()}
                        </td>
                        <td className="p-2.5 text-center font-sans">
                          {isLoanPaid ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-950 text-blue-300 border border-blue-800 flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> RELEASED
                            </span>
                          ) : g.status === 'accepted' ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                              ACTIVE LIABILITY
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                              {g.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. Welfare Claims Approval Queue */}
      <div className="bg-slate-900/90 border border-rose-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Benevolent & Welfare Claims Approval Queue ({allPendingClaims.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onRefreshAdmin}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition border border-slate-700"
          >
            <RotateCcw className="w-3 h-3" /> Refresh
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mb-3 font-medium">
          Review and disburse member welfare claims with transparent payout account verification.
        </p>

        {allPendingClaims.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
            No welfare claims awaiting signatory review.
          </div>
        ) : (
          <div className="space-y-3">
            {allPendingClaims.map((claim) => {
              const canChairSign = claim.assistant_chair_approval;
              const canTreasurerSign = claim.assistant_chair_approval && claim.chairman_approval;
              const compName = Array.isArray(claim.profiles?.companies)
                ? claim.profiles?.companies[0]?.name
                : claim.profiles?.companies?.name || 'External';

              return (
                <div key={claim.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">{claim.profiles?.full_name}</h4>
                        <span className="bg-rose-950 text-rose-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-rose-800 uppercase">
                          {claim.claim_type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {compName} • Member {claim.profiles?.member_number}
                      </p>
                      <p className="text-xs font-black text-rose-400 mt-0.5">
                        KES {Number(claim.amount_requested || 0).toLocaleString()} • Payout via:{' '}
                        <span className="uppercase text-white font-bold">{claim.disbursement_method || 'mpesa'}</span> (
                        {claim.disbursement_details || 'Profile Phone'})
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5">{claim.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {claim.assistant_chair_approval ? (
                        <button
                          type="button"
                          onClick={() => onWelfarePipeline(claim.id, 'assistant_chair', 'unsign')}
                          disabled={!isAsstChairUser}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                            isAsstChairUser
                              ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                              : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" /> 1. Asst {isAsstChairUser && <RotateCcw className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onWelfarePipeline(claim.id, 'assistant_chair', 'sign')}
                          disabled={!isAsstChairUser}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow ${
                            isAsstChairUser
                              ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                              : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                          }`}
                        >
                          1. Sign: Asst
                        </button>
                      )}

                      {claim.chairman_approval ? (
                        <button
                          type="button"
                          onClick={() => onWelfarePipeline(claim.id, 'chairman', 'unsign')}
                          disabled={!isChairUser}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                            isChairUser
                              ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                              : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" /> 2. Chair {isChairUser && <RotateCcw className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={!canChairSign || !isChairUser}
                          onClick={() => onWelfarePipeline(claim.id, 'chairman', 'sign')}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow ${
                            canChairSign && isChairUser
                              ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                              : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                          }`}
                        >
                          {(!canChairSign || !isChairUser) && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                          2. Sign: Chair
                        </button>
                      )}

                      {claim.treasurer_approval ? (
                        <button
                          type="button"
                          onClick={() => onWelfarePipeline(claim.id, 'treasurer', 'unsign')}
                          disabled={!isTreasurerUser}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                            isTreasurerUser
                              ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                              : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" /> 3. Treas {isTreasurerUser && <RotateCcw className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={!canTreasurerSign || !isTreasurerUser}
                          onClick={() => onWelfarePipeline(claim.id, 'treasurer', 'sign')}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow ${
                            canTreasurerSign && isTreasurerUser
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer'
                              : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                          }`}
                        >
                          {(!canTreasurerSign || !isTreasurerUser) && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                          3. Disburse
                        </button>
                      )}
                    </div>
                  </div>

                  {claim.evidence_url && (
                    <div className="pt-2 border-t border-slate-800">
                      <a
                        href={claim.evidence_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline font-medium"
                      >
                        <FileCheck className="w-3.5 h-3.5" /> View Supporting Evidence Document
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Opening Balances & Historical Migration Desk */}
      {['admin', 'chairman'].includes(userRole) && (
        <div className="bg-slate-900/90 border border-cyan-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Opening Balances & Historical Migration Desk</h3>
          </div>
          <p className="text-[11px] text-slate-400 mb-3 font-medium">
            Upload legacy CSV (<code className="text-cyan-300 font-mono">member_number, total_shares, active_loan, loan_product</code>) to port balances into KEWA SACCO.
          </p>

          <form onSubmit={onExecuteHistoricalMigration} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="file"
              accept=".csv"
              required
              onChange={(e) => setMigrationFile(e.target.files[0])}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:bg-cyan-950 file:text-cyan-300 cursor-pointer"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1"
            >
              <UploadCloud className="w-3.5 h-3.5" /> Import Legacy Balances
            </button>
          </form>
        </div>
      )}

      {/* 5. Registered Member Directory */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2.5 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Contact2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm sm:text-base font-bold text-white">
                Registered Members Directory ({filteredMemberDirectory.length})
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              Complete cooperative register displaying demographics, active debt, and shares.
            </p>
          </div>

          <button
            type="button"
            onClick={onRefreshAdmin}
            className="self-start sm:self-auto p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              placeholder="Search member by Name, Member No, ID, or Phone..."
              value={memberDirectorySearch}
              onChange={(e) => setMemberDirectorySearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div>
            <select
              value={memberDirectoryCompanyFilter}
              onChange={(e) => setMemberDirectoryCompanyFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
            >
              <option value="all">All Branches / Companies</option>
              <option value="Kenya Builders">Kenya Builders & Concrete</option>
              <option value="Warren">Warren Concrete</option>
              <option value="Eurocon">Eurocon Tiles</option>
              <option value="External">External / Independent</option>
            </select>
          </div>
        </div>

        {filteredMemberDirectory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
            No members matched your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950 max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold sticky top-0 z-10">
                <tr>
                  <th className="p-2.5">Member Details</th>
                  <th className="p-2.5">Branch / Company</th>
                  <th className="p-2.5">National ID</th>
                  <th className="p-2.5">Phone Number</th>
                  <th className="p-2.5 text-right">Total Savings</th>
                  <th className="p-2.5 text-right">Active Loan</th>
                  <th className="p-2.5 text-center">System Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredMemberDirectory.map((m) => {
                  const compName = Array.isArray(m.companies)
                    ? m.companies[0]?.name
                    : m.companies?.name || 'External';

                  return (
                    <tr key={m.id} className="hover:bg-slate-900/50 transition">
                      <td className="p-2.5 font-sans">
                        <div className="font-bold text-white">{m.full_name}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">{m.member_number}</div>
                      </td>
                      <td className="p-2.5 font-sans text-slate-300">{compName}</td>
                      <td className="p-2.5 text-slate-300">{m.id_number || '-'}</td>
                      <td className="p-2.5 text-slate-300">{m.phone || '-'}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-400">
                        KES {Number(m.totalSavings || 0).toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right font-bold text-amber-400">
                        KES {Number(m.totalActiveDebt || 0).toLocaleString()}
                      </td>
                      <td className="p-2.5 text-center font-sans">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            m.role === 'admin' || m.role === 'chairman'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : m.role === 'treasurer' || m.role === 'assistant_chair'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {m.role ? m.role.replace('_', ' ') : 'Member'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Manual Member Adjustment / Repayment Desk */}
      {['admin', 'chairman', 'treasurer'].includes(userRole) && (
        <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Manual Member Contribution / Loan Repayment Desk
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mb-3 font-medium">
            Exact loan balance is amortized, and any excess is automatically routed into member Savings.
          </p>

          <form onSubmit={onManualMemberAdjustment} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Member</label>
                <select
                  value={manualTargetMemberId}
                  onChange={(e) => setManualTargetMemberId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                >
                  {allMembers.map((m) => {
                    const compName = Array.isArray(m.companies)
                      ? m.companies[0]?.name
                      : m.companies?.name || 'External';

                    return (
                      <option key={m.id} value={m.id}>
                        {m.full_name} ({m.member_number}) - {compName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Adjustment Type</label>
                <select
                  value={manualAdjustmentType}
                  onChange={(e) => setManualAdjustmentType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-medium"
                >
                  <option value="loan_repayment">1. Smart Loan Repayment (Exact Loan + Excess to Savings)</option>
                  <option value="savings_deposit">2. Direct Savings Contribution Only</option>
                  <option value="welfare_monthly_200">3. Welfare Benevolent Fund (KES 200)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (KES)</label>
                <input
                  type="text"
                  required
                  value={manualAmountRaw}
                  onChange={(e) => setManualAmountRaw(formatAccountingNumber(e.target.value))}
                  placeholder="e.g. 200 or 9,000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Audit Reference Code (Optional)</label>
                <input
                  type="text"
                  value={manualRefCode}
                  onChange={(e) => setManualRefCode(e.target.value)}
                  placeholder="e.g. BANK-SLIP-7821 or CASH-RECEIPT-09"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono uppercase"
                />
              </div>

              <div className="sm:col-span-1 flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Post Payment
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 7. Loan Recovery & Performance Matrix */}
      <div className="bg-slate-900/90 border border-rose-900/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Loan Recovery & Performance Matrix (Worst to Best)
            </h3>
          </div>
          <button
            type="button"
            onClick={onRefreshAdmin}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition border border-slate-700"
          >
            <RotateCcw className="w-3 h-3" /> Refresh
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mb-3 font-medium">
          Monitors all active borrowers ranked from lowest repayment percentage to fully compliant.
        </p>

        {performanceRankedLoans.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">No active or historical loans found in the system.</div>
        ) : (
          <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950 max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold sticky top-0 z-10">
                <tr>
                  <th className="p-2.5">Rank & Member</th>
                  <th className="p-2.5">Facility</th>
                  <th className="p-2.5 text-right">Principal</th>
                  <th className="p-2.5 text-right">Total Repaid</th>
                  <th className="p-2.5 text-right">Outstanding Debt</th>
                  <th className="p-2.5 text-center">Recovery Progress</th>
                  <th className="p-2.5 text-center">Performance Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {performanceRankedLoans.map((loan, idx) => {
                  const isZeroRepaid = loan.progressPercent === 0;
                  const isCompleted = loan.progressPercent >= 100;
                  const compName = Array.isArray(loan.profiles?.companies)
                    ? loan.profiles?.companies[0]?.name
                    : loan.profiles?.companies?.name || 'External';

                  return (
                    <tr key={loan.id} className={isZeroRepaid ? 'bg-rose-950/20 hover:bg-rose-950/30' : 'hover:bg-slate-900/40'}>
                      <td className="p-2.5">
                        <div className="font-sans font-bold text-white">#{idx + 1} {loan.profiles?.full_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {compName} ({loan.profiles?.member_number})
                        </div>
                      </td>
                      <td className="p-2.5 font-sans capitalize text-slate-300">
                        {(loan.loan_product || 'main_loan').replace('_', ' ')}
                      </td>
                      <td className="p-2.5 text-right text-slate-300">
                        KES {Number(loan.principal_amount || 0).toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right text-emerald-400 font-bold">
                        KES {Number(loan.totalPaid || 0).toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right text-amber-400 font-bold">
                        KES {Number(loan.balance_remaining || 0).toLocaleString()}
                      </td>
                      <td className="p-2.5 text-center">
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1">
                          <div 
                            className={`h-full ${isCompleted ? 'bg-blue-500' : isZeroRepaid ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${loan.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-slate-300">{Number(loan.progressPercent || 0).toFixed(1)}%</span>
                      </td>
                      <td className="p-2.5 text-center font-sans">
                        {isCompleted ? (
                          <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                            CLEARED ✓
                          </span>
                        ) : isZeroRepaid ? (
                          <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
                            DEFAULT RISK (0%)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            IN PROGRESS
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 8. Publish Official Reports / Audit Booklets */}
      {['admin', 'chairman'].includes(userRole) && (
        <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <FolderDown className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Publish Official Report / Audit Booklet</h3>
          </div>
          <p className="text-[11px] text-slate-400 mb-3 font-medium">
            Upload verified PDF documents (Audit Reports, AGM Booklets, By-laws) for members.
          </p>

          <form onSubmit={onUploadSaccoDocument} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. KEWA SACCO Audited Financials 2025"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Report Category</label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="audit_report">Audited Financial Statements</option>
                <option value="agm_booklet">Annual AGM Booklet & Minutes</option>
                <option value="bylaws_policy">SACCO By-Laws & Policies</option>
                <option value="financial_statement">Mid-Year Financial Report</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Financial Year</label>
              <input
                type="text"
                required
                value={docYear}
                onChange={(e) => setDocYear(e.target.value)}
                placeholder="e.g. 2025/2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select PDF Report File</label>
              <input
                type="file"
                accept=".pdf"
                required
                onChange={(e) => setDocFile(e.target.files[0])}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-emerald-600 file:text-white cursor-pointer"
              />
            </div>

            <div className="sm:col-span-1 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" /> Publish Report
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 9. Automated Dual Payroll Checkoff */}
      {['admin', 'chairman', 'treasurer'].includes(userRole) && (
        <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Automated Dual Payroll Checkoff (Savings + Loans)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mb-3 font-medium">
            Upload monthly payroll deductions CSV (<code className="text-amber-300 font-mono">member_number, savings_amount, loan_amount</code>).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payroll Month</label>
              <input
                type="text"
                value={batchMonth}
                onChange={(e) => setBatchMonth(e.target.value)}
                placeholder="e.g. AUG-2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Payroll Deductions CSV</label>
              <input
                type="file"
                accept=".csv"
                onChange={onCSVUpload}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-amber-600 file:text-white cursor-pointer"
              />
            </div>
          </div>

          {batchPreview.length > 0 && (
            <div className="mt-3 border-t border-slate-800 pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-300">
                  Matched Rows: {batchPreview.filter((r) => r.valid).length} of {batchPreview.length}
                </span>
                <button
                  type="button"
                  onClick={onExecuteBatchCheckoff}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-lg cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Process & Post All Checkoffs
                </button>
              </div>

              <div className="max-h-40 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 sticky top-0 font-semibold">
                    <tr>
                      <th className="p-2">Member No</th>
                      <th className="p-2">Matched Name</th>
                      <th className="p-2 text-right">Savings Credit</th>
                      <th className="p-2 text-right">Loan Deduct</th>
                      <th className="p-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {batchPreview.map((row, idx) => (
                      <tr key={idx} className={row.valid ? 'hover:bg-slate-900/40' : 'bg-rose-950/20'}>
                        <td className="p-2 font-mono">{row.member_number}</td>
                        <td className="p-2">{row.full_name}</td>
                        <td className="p-2 text-right font-bold text-emerald-400">
                          +KES {Number(row.savings_amount || 0).toLocaleString()}
                        </td>
                        <td className="p-2 text-right font-bold text-amber-400">
                          -KES {Number(row.loan_amount || 0).toLocaleString()}
                        </td>
                        <td className="p-2 text-center">
                          {row.valid ? (
                            <span className="text-emerald-400 text-[10px] font-bold">READY</span>
                          ) : (
                            <span className="text-rose-400 text-[10px] font-bold">NO MATCH</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10. Sequential 3-Signatory Loan Approval Pipeline */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">Sequential 3-Signatory Approval Pipeline</h3>
        </div>
        <p className="text-[11px] text-slate-400 mb-3 font-medium">
          Signed in as <strong className="text-amber-300 uppercase">{userRole.replace('_', ' ')}</strong>. You can only execute endorsements for your designated role.
        </p>

        {allPendingLoans.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">No loan applications awaiting signatory action.</div>
        ) : (
          <div className="space-y-3">
            {allPendingLoans.map((l) => {
              const canChairSign = l.assistant_chair_approval;
              const canTreasurerSign = l.assistant_chair_approval && l.chairman_approval;
              const compName = Array.isArray(l.profiles?.companies)
                ? l.profiles?.companies[0]?.name
                : l.profiles?.companies?.name || 'External';

              return (
                <div key={l.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">{l.profiles?.full_name}</h4>
                        <span className="bg-emerald-950 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-800 uppercase">
                          {(l.loan_product || 'main_loan').replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {compName} • Member {l.profiles?.member_number}
                      </p>
                      <p className="text-xs font-black text-emerald-400 mt-0.5">
                        KES {Number(l.principal_amount).toLocaleString()} ({l.repayment_period_months} Mos Term) • Payout:{' '}
                        <span className="uppercase text-white font-bold">{l.disbursement_method || 'mpesa'}</span> (
                        {l.disbursement_details || 'N/A'})
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {l.assistant_chair_approval ? (
                        <button
                          type="button"
                          onClick={() => onSignatoryPipeline(l.id, 'assistant_chair', 'unsign')}
                          disabled={!isAsstChairUser}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                            isAsstChairUser
                              ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                              : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" /> 1. Asst {isAsstChairUser && <RotateCcw className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSignatoryPipeline(l.id, 'assistant_chair', 'sign')}
                          disabled={!isAsstChairUser}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow ${
                            isAsstChairUser
                              ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                              : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                          }`}
                        >
                          1. Sign: Asst
                        </button>
                      )}

                      {l.chairman_approval ? (
                        <button
                          type="button"
                          onClick={() => onSignatoryPipeline(l.id, 'chairman', 'unsign')}
                          disabled={!isChairUser}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                            isChairUser
                              ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                              : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" /> 2. Chair {isChairUser && <RotateCcw className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={!canChairSign || !isChairUser}
                          onClick={() => onSignatoryPipeline(l.id, 'chairman', 'sign')}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow ${
                            canChairSign && isChairUser
                              ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                              : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                          }`}
                        >
                          {(!canChairSign || !isChairUser) && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                          2. Sign: Chair
                        </button>
                      )}

                      {l.treasurer_approval ? (
                        <button
                          type="button"
                          onClick={() => onSignatoryPipeline(l.id, 'treasurer', 'unsign')}
                          disabled={!isTreasurerUser}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                            isTreasurerUser
                              ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                              : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" /> 3. Treas {isTreasurerUser && <RotateCcw className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={!canTreasurerSign || !isTreasurerUser}
                          onClick={() => onSignatoryPipeline(l.id, 'treasurer', 'sign')}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow ${
                            canTreasurerSign && isTreasurerUser
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer'
                              : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                          }`}
                        >
                          {(!canTreasurerSign || !isTreasurerUser) && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                          3. Disburse
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400">
                    <p className="font-semibold text-slate-300 mb-0.5">Guarantor Pledges:</p>
                    <div className="space-y-0.5">
                      {l.loan_guarantors?.map((g) => (
                        <div key={g.id} className="flex justify-between font-mono text-[10px]">
                          <span>{g.profiles?.full_name}:</span>
                          <span
                            className={
                              g.status === 'accepted' ? 'text-emerald-400 font-bold' : 'text-amber-400'
                            }
                          >
                            {(g.status || 'pending').toUpperCase()} (KES {Number(g.amount_guaranteed).toLocaleString()})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 11. Member Support Tickets & Formal Inquiries */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Member Support Tickets & Formal Inquiries</h3>
          </div>
          <button
            type="button"
            onClick={onRefreshAdmin}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition border border-slate-700"
          >
            <RotateCcw className="w-3 h-3" /> Refresh
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mb-3 font-medium">
          Review and resolve messages submitted by members directly from their portal accounts.
        </p>

        {allAdminInquiries.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">No member inquiries awaiting response.</div>
        ) : (
          <div className="space-y-3">
            {allAdminInquiries.map((ticket) => {
              const compName = Array.isArray(ticket.profiles?.companies)
                ? ticket.profiles?.companies[0]?.name
                : ticket.profiles?.companies?.name || 'External';

              return (
                <div key={ticket.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2.5 text-xs shadow">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-bold text-white text-xs">{ticket.profiles?.full_name || 'Member'}</h5>
                        <span
                          className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                            ticket.status === 'resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {(ticket.status || 'pending').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {compName} • Member {ticket.profiles?.member_number} • Phone: {ticket.profiles?.phone}
                      </p>
                      <p className="text-emerald-400 font-bold mt-0.5 text-[11px]">
                        Category: {(ticket.category || 'general').replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(ticket.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900 border border-slate-800/80 rounded-xl space-y-0.5">
                    <p className="font-bold text-slate-200 text-xs">Subject: {ticket.subject}</p>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{ticket.message}</p>
                  </div>

                  {ticket.admin_response ? (
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-[11px] text-emerald-300">
                      <strong>Official Reply:</strong> {ticket.admin_response}
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-1.5 border-t border-slate-800">
                      <input
                        type="text"
                        placeholder="Type official response..."
                        value={adminReplyText[ticket.id] || ''}
                        onChange={(e) => setAdminReplyText({ ...adminReplyText, [ticket.id]: e.target.value })}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => onAdminReplyInquiry(ticket.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow cursor-pointer flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" /> Reply
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 12. Post Announcements & Immutable Audit Logs */}
      {['admin', 'chairman'].includes(userRole) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm sm:text-base font-bold text-white">Post Announcement to Member Board</h4>
            </div>

            <form onSubmit={onPublishNotice} className="space-y-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="e.g. December Loan Applications Open"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Notice Body Content</label>
                <textarea
                  required
                  rows="2"
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  placeholder="Write message to all members..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer shadow"
              >
                Publish Notice
              </button>
            </form>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-2.5">
              <History className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm sm:text-base font-bold text-white">Immutable Audit Trail (SASRA Standard)</h4>
            </div>

            <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 sticky top-0 font-semibold">
                  <tr>
                    <th className="p-2">Date & Time</th>
                    <th className="p-2">User</th>
                    <th className="p-2">Action</th>
                    <th className="p-2">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[10px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="p-2 text-slate-400">
                        {new Date(log.created_at).toLocaleString('en-GB', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </td>
                      <td className="p-2 text-slate-200 font-sans font-bold">{log.user_name || 'Member'}</td>
                      <td className="p-2 text-emerald-400 font-bold">{log.action}</td>
                      <td className="p-2 text-slate-300">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}