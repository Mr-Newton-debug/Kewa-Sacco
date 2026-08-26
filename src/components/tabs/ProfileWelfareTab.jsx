import React from 'react';
import { 
  Settings, KeyRound, Users, Plus, Trash2, 
  HeartHandshake, Paperclip, FileCheck 
} from 'lucide-react';
import { formatAccountingNumber } from '../../utils/formatters';

export default function ProfileWelfareTab({
  editFullName,
  setEditFullName,
  editPhone,
  setEditPhone,
  editIdNumber,
  setEditIdNumber,
  editCompanyId,
  setEditCompanyId,
  companies = [],
  onUpdateProfile,
  onOpenPinModal,
  beneficiaries = [],
  nokName,
  setNokName,
  nokRel,
  setNokRel,
  nokId,
  setNokId,
  nokPhone,
  setNokPhone,
  nokPercent,
  setNokPercent,
  onAddBeneficiary,
  onDeleteBeneficiary,
  claimType,
  setClaimType,
  claimAmountRaw,
  setClaimAmountRaw,
  claimDisbursementMethod,
  setClaimDisbursementMethod,
  claimDisbursementDetails,
  setClaimDisbursementDetails,
  claimDesc,
  setClaimDesc,
  setClaimDocument,
  onSubmitClaim,
  welfareClaims = [],
  loading
}) {
  const totalAllocated = beneficiaries.reduce(
    (sum, b) => sum + Number(b.allocation_percentage || 0), 
    0
  );

  return (
    <div className="space-y-6">
      {/* Profile Settings & Credentials */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Profile Settings & Credentials</h3>
          </div>
          <button
            type="button"
            onClick={onOpenPinModal}
            className="bg-amber-950/70 hover:bg-amber-900 border border-amber-800 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" /> Change Security PIN
          </button>
        </div>

        <form onSubmit={onUpdateProfile} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">National ID Number</label>
              <input
                type="text"
                required
                value={editIdNumber}
                onChange={(e) => setEditIdNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Branch / Company Affiliation</label>
              <select
                value={editCompanyId}
                onChange={(e) => setEditCompanyId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 rounded-xl text-xs transition shadow cursor-pointer"
          >
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Next of Kin / Beneficiaries Module */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm sm:text-base font-bold text-white">Nominated Beneficiaries (Next of Kin)</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
              Total: {totalAllocated}% / 100%
            </span>
          </div>

          <form onSubmit={onAddBeneficiary} className="space-y-2.5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                autoComplete="off"
                value={nokName}
                onChange={(e) => setNokName(e.target.value)}
                placeholder="e.g. Mary Atieno"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Relationship</label>
                <select
                  value={nokRel}
                  onChange={(e) => setNokRel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Share Allocation (%)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={nokPercent}
                  onChange={(e) => setNokPercent(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">National ID</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={nokId}
                  onChange={(e) => setNokId(e.target.value)}
                  placeholder="ID Number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  autoComplete="off"
                  value={nokPhone}
                  onChange={(e) => setNokPhone(e.target.value)}
                  placeholder="07xxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Beneficiary
            </button>
          </form>

          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 max-h-48 overflow-y-auto">
            {beneficiaries.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No beneficiaries registered yet.</p>
            ) : (
              beneficiaries.map((b) => (
                <div key={b.id} className="bg-slate-950 p-2.5 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <h5 className="font-bold text-white text-xs">{b.full_name} ({b.relationship})</h5>
                    <p className="text-[10px] text-slate-400">Phone: {b.phone} • ID: {b.id_number || '-'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-800">
                      {b.allocation_percentage}%
                    </span>
                    <button 
                      type="button"
                      onClick={() => onDeleteBeneficiary(b.id)} 
                      className="text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Welfare & Benevolent Claims Module */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Benevolent & Welfare Claims (KES 200 Scheme)</h3>
          </div>

          <form onSubmit={onSubmitClaim} className="space-y-2.5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Claim Category</label>
              <select
                value={claimType}
                onChange={(e) => setClaimType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="hospitalization">Hospitalization / Medical Assistance</option>
                <option value="bereavement">Bereavement Support</option>
                <option value="disaster">Emergency Relief / Disaster</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Amount Claimed (KES)</label>
              <input
                type="text"
                required
                value={claimAmountRaw}
                onChange={(e) => setClaimAmountRaw(formatAccountingNumber(e.target.value))}
                placeholder="e.g. 20,000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Payout Destination</label>
                <select
                  value={claimDisbursementMethod}
                  onChange={(e) => setClaimDisbursementMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                >
                  <option value="mpesa">M-Pesa Mobile Transfer</option>
                  <option value="bank">Bank Account Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  {claimDisbursementMethod === 'mpesa' ? 'M-Pesa Phone No.' : 'Bank Details'}
                </label>
                <input
                  type="text"
                  required
                  value={claimDisbursementDetails}
                  onChange={(e) => setClaimDisbursementDetails(e.target.value)}
                  placeholder={claimDisbursementMethod === 'mpesa' ? '0712345678' : 'Bank, Branch, Account No'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Details & Justification</label>
              <textarea
                required
                rows="2"
                value={claimDesc}
                onChange={(e) => setClaimDesc(e.target.value)}
                placeholder="Provide circumstances for 3-Signatory review..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1 font-medium">
                <Paperclip className="w-3.5 h-3.5 text-amber-400" /> Upload Evidence Document (PDF/Photo)
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setClaimDocument(e.target.files[0])}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-rose-900/60 file:text-rose-200 cursor-pointer"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded-xl text-xs transition shadow cursor-pointer"
            >
              {loading ? 'Submitting...' : 'Submit Welfare Claim for Sequential Review'}
            </button>
          </form>

          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
            {welfareClaims.map((c) => (
              <div key={c.id} className="bg-slate-950 p-3 rounded-2xl space-y-1.5 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      c.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {c.status}
                    </span>
                    <h5 className="font-bold text-white capitalize mt-1 text-xs">{c.claim_type}</h5>
                    <p className="text-[10px] text-slate-400">{c.description}</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">
                      Dest: <strong className="uppercase">{c.disbursement_method || 'mpesa'}</strong> ({c.disbursement_details || 'Profile Phone'})
                    </p>
                  </div>
                  <span className="font-bold text-rose-400 text-xs">
                    KES {Number(c.amount_requested || 0).toLocaleString()}
                  </span>
                </div>

                {c.evidence_url && (
                  <a
                    href={c.evidence_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:underline"
                  >
                    <FileCheck className="w-3.5 h-3.5" /> View Supporting Evidence Document
                  </a>
                )}

                <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-center pt-1 border-t border-slate-800/60">
                  <span className={c.assistant_chair_approval ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    1. Asst: {c.assistant_chair_approval ? '✓' : 'PENDING'}
                  </span>
                  <span className={c.chairman_approval ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    2. Chair: {c.chairman_approval ? '✓' : 'PENDING'}
                  </span>
                  <span className={c.treasurer_approval ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    3. Treas: {c.treasurer_approval ? '✓' : 'PENDING'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}