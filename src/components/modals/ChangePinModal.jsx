import React, { useState } from 'react';
import { KeyRound, X } from 'lucide-react';

export default function ChangePinModal({ isOpen, onClose, onUpdatePin, loading }) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      alert('Security Error: New PIN must be exactly 4 numeric digits.');
      return;
    }
    if (newPin !== confirmNewPin) {
      alert('Mismatch: New PIN and Confirmation PIN do not match.');
      return;
    }
    onUpdatePin({
      currentPin,
      newPin,
      onSuccess: () => {
        setCurrentPin('');
        setNewPin('');
        setConfirmNewPin('');
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950 border border-amber-800/80 rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">Change Transaction PIN</h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current 4-Digit PIN</label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              data-lpignore="true"
              autoComplete="new-password"
              required
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono text-center tracking-widest focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New 4-Digit PIN</label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              data-lpignore="true"
              autoComplete="new-password"
              required
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono text-center tracking-widest focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New 4-Digit PIN</label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              data-lpignore="true"
              autoComplete="new-password"
              required
              value={confirmNewPin}
              onChange={(e) => setConfirmNewPin(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono text-center tracking-widest focus:border-amber-500"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || currentPin.length !== 4 || newPin.length !== 4 || confirmNewPin.length !== 4}
              className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer shadow"
            >
              {loading ? 'Updating...' : 'Update PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}