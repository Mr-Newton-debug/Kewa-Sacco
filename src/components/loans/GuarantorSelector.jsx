import React, { useState, useRef, useEffect } from 'react';
import { Search, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatAccountingNumber, parseAccountingNumber } from '../../utils/formatters';

export default function GuarantorSelector({
  index,
  row,
  allMembers,
  currentUserId,
  onUpdate,
  onRemove,
  canRemove
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchTermLower = (row.searchTerm || '').toLowerCase().trim();

  const eligibleColleagues = (allMembers || []).filter((m) => {
    if (m.id === currentUserId) return false;
    const name = (m.full_name || '').toLowerCase();
    const num = (m.member_number || '').toLowerCase();
    const comp = Array.isArray(m.companies) 
      ? (m.companies[0]?.name || '').toLowerCase() 
      : (m.companies?.name || '').toLowerCase();

    return name.includes(searchTermLower) || num.includes(searchTermLower) || comp.includes(searchTermLower);
  });

  const handleSelectColleague = (colleague) => {
    const compName = Array.isArray(colleague.companies) 
      ? colleague.companies[0]?.name 
      : colleague.companies?.name;

    const displayLabel = `${colleague.full_name} (${colleague.member_number}) - ${compName || 'External'}`;
    const freeShares = Number(colleague.unencumberedShares || 0);
    const pledgeAmount = parseAccountingNumber(row.amountRaw);

    let isEligible = true;
    let note = '';

    if (freeShares <= 0) {
      isEligible = false;
      note = '⚠️ Ineligible: Colleague currently has 0 unencumbered Free Shares.';
    } else if (pledgeAmount > 0 && pledgeAmount > freeShares) {
      isEligible = false;
      note = `⚠️ Insufficient Free Shares: Pledged amount exceeds colleague limit (KES ${freeShares.toLocaleString()}).`;
    } else {
      isEligible = true;
      note = `✓ Eligible: Colleague has KES ${freeShares.toLocaleString()} Free Shares available.`;
    }

    onUpdate(index, {
      guarantorId: colleague.id,
      searchTerm: displayLabel,
      eligible: isEligible,
      note
    });

    setDropdownOpen(false);
  };

  const handleAmountChange = (val) => {
    const formatted = formatAccountingNumber(val);
    const pledgeNum = parseAccountingNumber(val);

    let isEligible = row.eligible;
    let note = row.note;

    if (row.guarantorId) {
      const colleague = (allMembers || []).find((m) => m.id === row.guarantorId);
      const freeShares = Number(colleague?.unencumberedShares || 0);

      if (freeShares <= 0) {
        isEligible = false;
        note = '⚠️ Ineligible: Colleague currently has 0 unencumbered Free Shares.';
      } else if (pledgeNum > 0 && pledgeNum > freeShares) {
        isEligible = false;
        note = `⚠️ Insufficient Free Shares: Pledged amount exceeds colleague limit (KES ${freeShares.toLocaleString()}).`;
      } else {
        isEligible = true;
        note = `✓ Eligible: Colleague has KES ${freeShares.toLocaleString()} Free Shares available.`;
      }
    }

    onUpdate(index, {
      amountRaw: formatted,
      eligible: isEligible,
      note
    });
  };

  return (
    <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl space-y-2 relative" ref={dropdownRef}>
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="w-full sm:w-3/5 relative">
          <label className="block text-[10px] text-slate-400 mb-0.5 font-medium">
            Search Guarantor #{index + 1}
          </label>
          <div className="relative">
            <input
              type="text"
              required
              autoComplete="off"
              placeholder="Type colleague name or member number..."
              value={row.searchTerm}
              onChange={(e) => {
                onUpdate(index, { searchTerm: e.target.value, guarantorId: '' });
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {dropdownOpen && eligibleColleagues.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-44 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 divide-y divide-slate-800">
              {eligibleColleagues.slice(0, 8).map((colleague) => {
                const compName = Array.isArray(colleague.companies)
                  ? colleague.companies[0]?.name
                  : colleague.companies?.name;

                return (
                  <div
                    key={colleague.id}
                    onClick={() => handleSelectColleague(colleague)}
                    className="p-2.5 hover:bg-slate-800 text-xs cursor-pointer text-slate-200 transition flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold text-white block">{colleague.full_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {colleague.member_number} • {compName || 'External'}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      Free: KES {Number(colleague.unencumberedShares || 0).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="w-full sm:w-2/5">
          <label className="block text-[10px] text-slate-400 mb-0.5 font-medium">Pledged (KES)</label>
          <input
            type="text"
            required
            placeholder="e.g. 10,000"
            value={row.amountRaw}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
          />
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="self-end sm:self-center text-rose-400 hover:text-rose-300 p-1 cursor-pointer transition"
            title="Remove guarantor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {row.guarantorId && (
        <div
          className={`p-2 rounded-xl text-[10px] font-semibold flex items-center gap-1.5 ${
            row.eligible
              ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-800/60 text-rose-300'
          }`}
        >
          {row.eligible ? (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          )}
          <span>{row.note}</span>
        </div>
      )}
    </div>
  );
}