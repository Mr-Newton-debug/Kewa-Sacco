import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import MobileDrawer from './components/layout/MobileDrawer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import AuthCard from './components/auth/AuthCard';

function MainPortal() {
  const { session, profile, loading: authLoading, signOut } = useAuth();
  
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Authentication Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationPin, setRegistrationPin] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState("What is your mother's maiden name?");
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [odpcConsent, setOdpcConsent] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState([]);

  // SACCO Data States
  const [pendingGuaranteesCount, setPendingGuaranteesCount] = useState(0);

  // Fetch companies for registration dropdown on mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const { data } = await supabase.from('companies').select('*').order('name');
    if (data) setCompanies(data);
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    }
    setLoading(false);
  };

  // Register Handler with robust RLS profile creation
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!odpcConsent) {
      setMessage({ text: 'Please accept the Kenya Data Protection Act (ODPC) privacy terms.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      setMessage({ text: authError.message, type: 'error' });
      setLoading(false);
      return;
    }

    if (authData?.user) {
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: authData.user.id,
        full_name: fullName,
        member_number: memberNumber,
        company_id: companyId,
        id_number: idNumber,
        phone: phone,
        email: email,
        role: 'member',
        transaction_pin: registrationPin,
        security_question: securityQuestion,
        security_answer_hash: securityAnswer.trim().toLowerCase()
      }]);

      if (profileError) {
        console.error('Profile table insert error:', profileError);
        setMessage({ text: `Account created, but profile failed: ${profileError.message}`, type: 'error' });
        setLoading(false);
        return;
      }

      setMessage({ text: 'Account registered successfully! You can now sign in.', type: 'success' });
      setAuthMode('login');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: 'Password reset instructions sent to your email.', type: 'success' });
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setAuthMode('login');
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400 font-mono text-xs">
        Loading KEWA SACCO Portal...
      </div>
    );
  }

  const userRole = profile?.role || 'member';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 md:pb-0">
      <Header
        session={session}
        authMode={authMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        pendingGuaranteesCount={pendingGuaranteesCount}
        onSignOut={signOut}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingGuaranteesCount={pendingGuaranteesCount}
        userRole={userRole}
        onSignOut={signOut}
      />

      {message.text && (
        <div className={`max-w-md mx-auto mt-4 px-4 py-3 rounded-2xl text-xs font-bold text-center border ${message.type === 'error' ? 'bg-rose-950/80 border-rose-800 text-rose-300' : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'}`}>
          {message.text}
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {!session || authMode === 'reset' ? (
          <AuthCard
            authMode={authMode}
            setAuthMode={setAuthMode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            fullName={fullName}
            setFullName={setFullName}
            memberNumber={memberNumber}
            setMemberNumber={setMemberNumber}
            idNumber={idNumber}
            setIdNumber={setIdNumber}
            phone={phone}
            setPhone={setPhone}
            registrationPin={registrationPin}
            setRegistrationPin={setRegistrationPin}
            securityQuestion={securityQuestion}
            setSecurityQuestion={setSecurityQuestion}
            securityAnswer={securityAnswer}
            setSecurityAnswer={setSecurityAnswer}
            odpcConsent={odpcConsent}
            setOdpcConsent={setOdpcConsent}
            companies={companies}
            companyId={companyId}
            setCompanyId={setCompanyId}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onForgotPassword={handleForgotPassword}
            onUpdatePassword={handleUpdatePassword}
            loading={loading}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-black text-white">Welcome, {profile?.full_name || 'Member'}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Member No: <span className="text-emerald-400 font-mono font-bold">{profile?.member_number || 'N/A'}</span> • Branch: {profile?.companies?.name || 'KEWA SACCO'}
              </p>
            </div>
            {/* Active tab content view renderers go here */}
          </div>
        )}
      </main>

      {session && authMode !== 'reset' && (
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingGuaranteesCount={pendingGuaranteesCount}
          userRole={userRole}
          onSignOut={signOut}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainPortal />
    </AuthProvider>
  );
}