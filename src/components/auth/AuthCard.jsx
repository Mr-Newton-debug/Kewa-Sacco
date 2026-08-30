import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

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
  securityQuestion,
  setSecurityQuestion,
  securityAnswer,
  setSecurityAnswer,
  odpcConsent,
  setOdpcConsent,
  companies,
  companyId,
  setCompanyId,
  onLogin,
  onRegister,
  onForgotPassword,
  onUpdatePassword,
  loading
}) {
  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">KEWA SACCO PORTAL</h1>
        <p className="text-xs text-slate-400 mt-1">
          {authMode === 'login' && 'Sign in to access your financial cooperative account'}
          {authMode === 'register' && 'Register a new membership account'}
          {authMode === 'forgot' && 'Reset your account password'}
          {authMode === 'reset' && 'Set your new secure password'}
        </p>
      </div>

      {authMode === 'login' && (
        <form onSubmit={onLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <button type="button" onClick={() => setAuthMode('forgot')} className="text-emerald-400 hover:underline">
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg cursor-pointer"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <button type="button" onClick={() => setAuthMode('register')} className="text-emerald-400 font-bold hover:underline">
                Register Now
              </button>
            </p>
          </div>
        </form>
      )}

      {authMode === 'register' && (
        <form onSubmit={onRegister} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">4-Digit Security PIN</label>
            <input
              type="password"
              maxLength={4}
              required
              value={registrationPin}
              onChange={(e) => setRegistrationPin(e.target.value)}
              placeholder="1234"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono tracking-widest text-center"
            />
          </div>
          
          {/* Clean Company Branch Dropdown */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Branch</label>
            <select
              value={companyId || ''}
              onChange={(e) => setCompanyId(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="" disabled>Select your company / branch</option>
              {(companies || []).map((comp) => (
                <option key={comp.id} value={comp.id} className="bg-slate-900 text-white py-1">
                  {comp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0712345678"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Security Question */}
          <div className="grid grid-cols-1 gap-2 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Security Question</label>
              <select
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                <option value="What was your first pet's name?">What was your first pet's name?</option>
                <option value="What city were you born in?">What city were you born in?</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Secret Answer</label>
              <input
                type="text"
                required
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Case-insensitive answer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* ODPC Compliance Checkbox */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="odpc"
              checked={odpcConsent}
              onChange={(e) => setOdpcConsent(e.target.checked)}
              className="mt-0.5 rounded bg-slate-950 border-slate-800 text-emerald-600 focus:ring-0"
            />
            <label htmlFor="odpc" className="text-[11px] text-slate-400 leading-tight">
              I consent to the processing of my personal data in compliance with the <span className="text-emerald-400 font-semibold">Kenya Data Protection Act (2019)</span>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg cursor-pointer mt-2"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
          
          <div className="text-center pt-1">
            <button type="button" onClick={() => setAuthMode('login')} className="text-xs text-slate-400 hover:text-white">
              Already have an account? <span className="text-emerald-400 font-bold">Sign In</span>
            </button>
          </div>
        </form>
      )}

      {authMode === 'forgot' && (
        <form onSubmit={onForgotPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Enter your account email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg cursor-pointer"
          >
            {loading ? 'Sending Link...' : 'Send Password Reset Link'}
          </button>
          <div className="text-center pt-2">
            <button type="button" onClick={() => setAuthMode('login')} className="text-xs text-emerald-400 hover:underline">
              Back to Sign In
            </button>
          </div>
        </form>
      )}

      {authMode === 'reset' && (
        <form onSubmit={onUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new secure password"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg cursor-pointer"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}