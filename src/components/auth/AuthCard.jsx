import React from 'react';
import { Building2 } from 'lucide-react';

export default function AuthCard({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  newPassword,
  setNewPassword,
  fullName,
  setFullName,
  memberNumber,
  setMemberNumber,
  idNumber,
  setIdNumber,
  phone,
  setPhone,
  registrationPin,
  setRegistrationPin,
  odpcConsent,
  setOdpcConsent,
  onLogin,
  onRegister,
  onForgotPassword,
  onUpdatePassword,
  loading
}) {
  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-12 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 sm:p-10 shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-5">
        <div className="inline-flex bg-gradient-to-tr from-emerald-600 to-teal-400 p-3 rounded-2xl shadow-xl shadow-emerald-900/30 mb-2">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {authMode === 'login' && 'Member Sign In'}
          {authMode === 'register' && 'Join KEWA SACCO'}
          {authMode === 'forgot' && 'Reset Password'}
          {authMode === 'reset' && 'Set New Password'}
        </h2>
      </div>

      {authMode === 'login' && (
        <form onSubmit={onLogin} className="space-y-3.5" autoComplete="off">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-emerald-500 transition"
            />
            <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Branch / Company</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => setAuthMode('forgot')}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition shadow-lg cursor-pointer"
          >
            {loading ? 'Processing...' : 'Sign In to Portal'}
          </button>
        </form>
      )}

      {authMode === 'register' && (
        <form onSubmit={onRegister} className="space-y-3" autoComplete="off">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Member No.</label>
              <input
                type="text"
                required
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                placeholder="KW-001"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">National ID</label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="12345678"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-1">4-Digit Security PIN</label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              data-lpignore="true"
              autoComplete="new-password"
              required
              value={registrationPin}
              onChange={(e) => setRegistrationPin(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="••••"
              className="w-full bg-slate-950 border border-amber-500/60 rounded-xl px-3.5 py-2 text-xs text-white font-mono text-center tracking-widest"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0712345678"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="odpcConsentBox"
              required
              checked={odpcConsent}
              onChange={(e) => setOdpcConsent(e.target.checked)}
              className="mt-0.5 accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="odpcConsentBox" className="text-[11px] text-slate-400 leading-tight cursor-pointer">
              I consent to KEWA SACCO processing my data under the <strong>Kenya Data Protection Act (2019)</strong>.
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition mt-1 shadow-lg cursor-pointer"
          >
            {loading ? 'Processing...' : 'Complete Registration'}
          </button>
        </form>
      )}

      {authMode === 'forgot' && (
        <form onSubmit={onForgotPassword} className="space-y-3.5">
          <p className="text-xs text-slate-400">
            Enter your registered email address to receive password reset instructions.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      {authMode === 'reset' && (
        <form onSubmit={onUpdatePassword} className="space-y-3.5">
          <p className="text-xs text-slate-400">
            Create a secure new password for your cooperative account.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow"
          >
            {loading ? 'Updating...' : 'Set New Password & Sign In'}
          </button>
        </form>
      )}

      <div className="text-center mt-5 text-xs text-slate-400 font-medium">
        {authMode === 'login' ? (
          <>
            New member?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className="text-emerald-400 hover:underline font-bold cursor-pointer"
            >
              Register Account
            </button>
          </>
        ) : (
          <>
            Already registered?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="text-emerald-400 hover:underline font-bold cursor-pointer"
            >
              Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}