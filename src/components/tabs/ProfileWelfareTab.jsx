import React from 'react';
import { User, Shield, HeartHandshake, Phone, Mail, Building, Key, Plus, Trash2 } from 'lucide-react';

export default function ProfileWelfareTab({
  editFullName,
  setEditFullName,
  editPhone,
  setEditPhone,
  editIdNumber,
  setEditIdNumber,
  editCompanyId,
  setEditCompanyId,
  companies,
  onUpdateProfile,
  onOpenPinModal,
  beneficiaries,
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
  welfareClaims,
  loading
}) {
  return (
    <div className="space-y-6">
      {/* Profile Edit Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" /> Member Profile & Account Settings
          </h3>
          <button
            type="button"
            onClick={onOpenPinModal}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" /> Change Security PIN
          </button>
        </div>

        <form onSubmit={onUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">National ID Number</label>
              <input
                type="text"
                value={editIdNumber}
                onChange={(e) => setEditIdNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Employer / Branch</label>
              <select
                value={editCompanyId}
                onChange={(e) => setEditCompanyId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
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
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer"
          >
            {loading ? 'Saving Changes...' : 'Update Profile Details'}
          </button>
        </form>
      </div>

      {/* Beneficiaries & Next of Kin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <HeartHandshake className="w-4 h-4 text-emerald-400" /> Registered Beneficiaries (Next of Kin)
          </h3>

          <div className="space-y-3">
            {beneficiaries.map((b) => (
              <div key={b.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">{b.full_name}</h4>
                  <p className="text-[11px] text-slate-400">Relationship: {b.relationship} • Phone: {b.phone || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-800">
                    {b.allocation_percentage}%
                  </span>
                  <button
                    onClick={() => onDeleteBeneficiary(b.id)}
                    className="text-rose-400 hover:text-rose-300 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={onAddBeneficiary} className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300">Add New Beneficiary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Full Name"
                value={nokName}
                onChange={(e) => setNokName(e.target.value)}
                required
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <select
                value={nokRel}
                onChange={(e) => setNokRel(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="ID Number"
                value={nokId}
                onChange={(e) => setNokId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={nokPhone}
                onChange={(e) => setNokPhone(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <input
                type="number"
                placeholder="Allocation % (e.g. 100)"
                value={nokPercent}
                onChange={(e) => setNokPercent(e.target.value)}
                required
                min="1"
                max="100"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono sm:col-span-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Save Beneficiary Allocation
            </button>
          </form>
        </div>

        {/* Welfare Claims Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Benevolent & Welfare Claims
          </h3>

          <form onSubmit={onSubmitClaim} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Claim Type</label>
                <select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="hospitalization">Hospitalization Support</option>
                  <option value="bereavement">Bereavement / Funeral</option>
                  <option value="disability">Disability Assistance</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Amount Requested (KES)</label>
                <input
                  type="text"
                  required
                  value={claimAmountRaw}
                  onChange={(e) => setClaimAmountRaw(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Description / Reason</label>
              <textarea
                value={claimDesc}
                onChange={(e) => setClaimDesc(e.target.value)}
                rows="2"
                placeholder="Provide details supporting your welfare claim..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Submit Welfare Claim
            </button>
          </form>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300">My Claim History</h4>
            {welfareClaims.map((c) => (
              <div key={c.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white uppercase">{c.claim_type}</span>
                  <p className="text-[10px] text-slate-400 font-mono">KES {Number(c.amount_requested).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.status === 'approved' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                  {c.status}
                </span>
              </div>
            ))}
            {welfareClaims.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-2">No welfare claims submitted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}