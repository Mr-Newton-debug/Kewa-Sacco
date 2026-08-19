import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Building2, User, KeyRound, Phone, LogOut, 
  PiggyBank, TrendingUp, Briefcase, PlusCircle, 
  Calculator, CheckCircle, XCircle, Clock, ShieldCheck, Download, Users, Trash2, Plus, Menu, X
} from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('overview'); // overview, loans, guarantors, admin
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [companyId, setCompanyId] = useState('');

  // Data State
  const [companies, setCompanies] = useState([]);
  const [profile, setProfile] = useState(null);
  const [savings, setSavings] = useState([]);
  const [loans, setLoans] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [guarantorRequests, setGuarantorRequests] = useState([]);
  const [allPendingLoans, setAllPendingLoans] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Dynamic Multi-Guarantor Loan Application State
  const [loanPrincipal, setLoanPrincipal] = useState(10000);
  const [loanMonths, setLoanMonths] = useState(6);
  const [interestRate] = useState(1.0); // 1% per month
  const [guarantorList, setGuarantorList] = useState([{ guarantorId: '', amount: '' }]);

  // Admin Batch / Quick Deposit State
  const [targetMemberId, setTargetMemberId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositType, setDepositType] = useState('monthly_contribution');
  const [depositRef, setDepositRef] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      else {
        setProfile(null);
        setSavings([]);
        setLoans([]);
      }
    });

    fetchCompanies();
    return () => subscription.unsubscribe();
  }, []);

  const fetchCompanies = async () => {
    const { data } = await supabase.from('companies').select('*');
    if (data && data.length > 0) {
      setCompanies(data);
      setCompanyId(data[0].id);
    }
  };

  const fetchUserData = async (userId) => {
    setLoading(true);
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*, companies(name)')
      .eq('id', userId)
      .single();

    if (profileData) {
      setProfile(profileData);
      fetchAllMembers(userId);
      fetchGuarantorRequests(userId);
      if (profileData.role === 'admin' || profileData.role === 'treasurer') {
        fetchAdminData();
      }
    }

    const { data: savingsData } = await supabase
      .from('savings_ledger')
      .select('*')
      .eq('member_id', userId)
      .order('created_at', { ascending: false });
    if (savingsData) setSavings(savingsData);

    const { data: loanData } = await supabase
      .from('loans')
      .select('*, loan_guarantors(*, profiles:guarantor_id(full_name, member_number))')
      .eq('member_id', userId)
      .order('created_at', { ascending: false });
    if (loanData) setLoans(loanData);

    setLoading(false);
  };

  const fetchAllMembers = async (currentUserId) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, member_number, companies(name)')
      .neq('id', currentUserId);
    if (data) setAllMembers(data);
  };

  const fetchGuarantorRequests = async (userId) => {
    const { data } = await supabase
      .from('loan_guarantors')
      .select('*, loans(*, profiles:member_id(full_name, member_number, companies(name)))')
      .eq('guarantor_id', userId)
      .order('created_at', { ascending: false });
    if (data) setGuarantorRequests(data);
  };

  const fetchAdminData = async () => {
    const { data: members } = await supabase.from('profiles').select('*, companies(name)');
    if (members) {
      setAllMembers(members);
      if (members.length > 0) setTargetMemberId(members[0].id);
    }

    const { data: pendingLoans } = await supabase
      .from('loans')
      .select('*, profiles(full_name, member_number, companies(name)), loan_guarantors(*, profiles:guarantor_id(full_name, member_number))')
      .eq('status', 'pending');
    if (pendingLoans) setAllPendingLoans(pendingLoans);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage({ text: error.message, type: 'error' });
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) {
      setMessage({ text: authError.message, type: 'error' });
      setLoading(false);
      return;
    }

    if (authData?.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          full_name: fullName,
          member_number: memberNumber,
          company_id: companyId,
          id_number: idNumber,
          phone: phone,
          email: email,
          role: 'member',
        },
      ]);

      if (profileError) setMessage({ text: profileError.message, type: 'error' });
      else setMessage({ text: 'Account created successfully!', type: 'success' });
    }
    setLoading(false);
  };

  // Calculations
  const totalSavings = savings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const loanLimit = Math.max(totalSavings * 3, 10000);
  const activeLoanBalance = loans
    .filter((l) => l.status === 'approved' || l.status === 'disbursed')
    .reduce((acc, curr) => acc + Number(curr.balance_remaining || 0), 0);

  const calculatedInterest = (loanPrincipal * (interestRate / 100)) * loanMonths;
  const calculatedTotal = Number(loanPrincipal) + calculatedInterest;
  const monthlyInstallment = calculatedTotal / loanMonths;

  // Dynamic Guarantor Row Management
  const addGuarantorRow = () => {
    setGuarantorList([...guarantorList, { guarantorId: '', amount: '' }]);
  };

  const removeGuarantorRow = (index) => {
    const updated = guarantorList.filter((_, i) => i !== index);
    setGuarantorList(updated.length > 0 ? updated : [{ guarantorId: '', amount: '' }]);
  };

  const updateGuarantorRow = (index, field, value) => {
    const updated = [...guarantorList];
    updated[index][field] = value;
    setGuarantorList(updated);
  };

  const totalGuaranteedEntered = guarantorList.reduce((sum, g) => sum + Number(g.amount || 0), 0);

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (loanPrincipal > loanLimit) {
      setMessage({ text: `Loan exceeds limit of KES ${loanLimit.toLocaleString()} (3x Savings).`, type: 'error' });
      setLoading(false);
      return;
    }

    const validGuarantors = guarantorList.filter((g) => g.guarantorId && Number(g.amount) > 0);
    if (validGuarantors.length === 0) {
      setMessage({ text: 'Please add at least 1 guarantor with an assigned amount.', type: 'error' });
      setLoading(false);
      return;
    }

    const selectedIds = validGuarantors.map((g) => g.guarantorId);
    if (new Set(selectedIds).size !== selectedIds.length) {
      setMessage({ text: 'You cannot select the same guarantor multiple times.', type: 'error' });
      setLoading(false);
      return;
    }

    const { data: loanData, error: loanError } = await supabase.from('loans').insert([
      {
        member_id: session.user.id,
        principal_amount: loanPrincipal,
        interest_rate: interestRate,
        repayment_period_months: loanMonths,
        total_payable: calculatedTotal,
        balance_remaining: calculatedTotal,
        status: 'pending',
      },
    ]).select().single();

    if (loanError) {
      setMessage({ text: loanError.message, type: 'error' });
      setLoading(false);
      return;
    }

    const guarantorsToInsert = validGuarantors.map((g) => ({
      loan_id: loanData.id,
      guarantor_id: g.guarantorId,
      amount_guaranteed: Number(g.amount),
      status: 'pending',
    }));

    await supabase.from('loan_guarantors').insert(guarantorsToInsert);

    setMessage({ text: `Loan submitted successfully with ${validGuarantors.length} guarantors!`, type: 'success' });
    setGuarantorList([{ guarantorId: '', amount: '' }]);
    fetchUserData(session.user.id);
    setLoading(false);
  };

  const handleRespondGuarantor = async (guaranteeId, status) => {
    const { error } = await supabase
      .from('loan_guarantors')
      .update({ status })
      .eq('id', guaranteeId);

    if (!error) {
      fetchGuarantorRequests(session.user.id);
      setMessage({ text: `Guarantor request marked as ${status}.`, type: 'success' });
    }
  };

  const handleRecordDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const { error } = await supabase.from('savings_ledger').insert([
      {
        member_id: targetMemberId,
        amount: Number(depositAmount),
        transaction_type: depositType,
        reference_code: depositRef || 'PAYROLL-BATCH',
      },
    ]);

    if (error) setMessage({ text: error.message, type: 'error' });
    else {
      setMessage({ text: 'Contribution posted successfully!', type: 'success' });
      setDepositAmount('');
      setDepositRef('');
      fetchUserData(session.user.id);
    }
    setLoading(false);
  };

  const handleApproveLoan = async (loanId) => {
    const { error } = await supabase
      .from('loans')
      .update({ status: 'approved' })
      .eq('id', loanId);

    if (!error) {
      fetchAdminData();
      fetchUserData(session.user.id);
      setMessage({ text: 'Loan approved & disbursed.', type: 'success' });
    }
  };

  const generatePDFStatement = (loan = null) => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(6, 78, 59);
      doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('KEWA SACCO SOCIETY LIMITED', 14, 18);
      doc.setFontSize(9);
      doc.text('Kenya Builders & Concrete • Warren Concrete • Eurocon Tiles', 14, 25);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 155, 25);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.text('OFFICIAL MEMBER STATEMENT', 14, 46);

      doc.setFontSize(9);
      doc.text(`Member Name: ${profile?.full_name || 'N/A'}`, 14, 54);
      doc.text(`Member No: ${profile?.member_number || 'N/A'}`, 14, 60);
      doc.text(`Branch / Company: ${profile?.companies?.name || 'KEWA'}`, 14, 66);
      doc.text(`National ID: ${profile?.id_number || 'N/A'}`, 120, 54);
      doc.text(`Phone: ${profile?.phone || 'N/A'}`, 120, 60);
      doc.text(`Total Shares/Savings: KES ${totalSavings.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 120, 66);

      if (loan) {
        doc.setFontSize(11);
        doc.text('Loan Schedule & Repayment Details', 14, 78);

        const loanRows = [
          ['Principal Amount', `KES ${Number(loan.principal_amount).toLocaleString()}`],
          ['Interest Rate', `${loan.interest_rate}% / month`],
          ['Repayment Term', `${loan.repayment_period_months} Months`],
          ['Total Repayable', `KES ${Number(loan.total_payable).toLocaleString()}`],
          ['Current Outstanding Balance', `KES ${Number(loan.balance_remaining).toLocaleString()}`],
          ['Loan Status', (loan.status || 'PENDING').toUpperCase()],
        ];

        autoTable(doc, {
          startY: 83,
          head: [['Loan Metric', 'Value']],
          body: loanRows,
          theme: 'striped',
          headStyles: { fillColor: [6, 78, 59] },
        });
      } else {
        doc.setFontSize(11);
        doc.text('Recent Contribution Ledger', 14, 78);

        const tableRows = savings.length > 0 ? savings.map((s) => [
          new Date(s.created_at).toLocaleDateString('en-GB'),
          (s.transaction_type || '').replace('_', ' ').toUpperCase(),
          s.reference_code || '-',
          `KES ${Number(s.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`
        ]) : [['-', 'No contributions recorded', '-', 'KES 0.00']];

        autoTable(doc, {
          startY: 83,
          head: [['Date', 'Transaction Type', 'Reference', 'Amount']],
          body: tableRows,
          theme: 'striped',
          headStyles: { fillColor: [6, 78, 59] },
        });
      }

      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 150;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('This is a computer-generated statement issued by KEWA SACCO core financial system.', 14, finalY);

      doc.save(`KEWA_Statement_${profile?.member_number || 'Member'}.pdf`);
    } catch (err) {
      alert('Could not generate PDF: ' + err.message);
    }
  };

  const pendingGuaranteesCount = guarantorRequests.filter((g) => g.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20 sm:pb-12">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur px-4 sm:px-6 py-3.5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-900/30">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">KEWA SACCO</h1>
            <p className="text-[10px] sm:text-xs text-slate-400">Kenya Builders • Warren • Eurocon</p>
          </div>
        </div>

        {session && (
          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'loans' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Loans & Limits
              </button>
              <button
                onClick={() => setActiveTab('guarantors')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'guarantors' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Guarantor Desk
                {pendingGuaranteesCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded-full font-bold">
                    {pendingGuaranteesCount}
                  </span>
                )}
              </button>
              {(profile?.role === 'admin' || profile?.role === 'treasurer') && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                    activeTab === 'admin' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin
                </button>
              )}
            </div>

            <button
              onClick={() => supabase.auth.signOut()}
              className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit
            </button>

            {/* Mobile Extended Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-emerald-400" />}
            </button>
          </div>
        )}
      </header>

      {/* Mobile Extended Dropdown Drawer */}
      {session && mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-2 sticky top-[57px] z-40 shadow-2xl animate-in slide-in-from-top-2">
          <div className="pb-2 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Signed in as: <strong className="text-slate-200">{profile?.full_name}</strong></span>
            <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 text-[10px] uppercase font-bold">
              {profile?.role || 'Member'}
            </span>
          </div>

          <button
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'bg-slate-900/50 text-slate-300'
            }`}
          >
            <PiggyBank className="w-4 h-4" /> Overview Dashboard
          </button>

          <button
            onClick={() => { setActiveTab('loans'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'loans' ? 'bg-emerald-600 text-white' : 'bg-slate-900/50 text-slate-300'
            }`}
          >
            <Calculator className="w-4 h-4" /> Loans, Limits & Multi-Guarantor
          </button>

          <button
            onClick={() => { setActiveTab('guarantors'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'guarantors' ? 'bg-emerald-600 text-white' : 'bg-slate-900/50 text-slate-300'
            }`}
          >
            <span className="flex items-center gap-3">
              <Users className="w-4 h-4" /> Guarantor Requests Desk
            </span>
            {pendingGuaranteesCount > 0 && (
              <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingGuaranteesCount} new
              </span>
            )}
          </button>

          {(profile?.role === 'admin' || profile?.role === 'treasurer') && (
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'admin' ? 'bg-amber-600 text-white' : 'bg-slate-900/50 text-amber-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin Management Panel
            </button>
          )}

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center justify-center gap-2 bg-rose-950/40 border border-rose-900/50 text-rose-300 hover:bg-rose-900/60 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              <LogOut className="w-4 h-4" /> Sign Out of Account
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
              message.type === 'error'
                ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {!session ? (
          /* AUTHENTICATION VIEW */
          <div className="max-w-md mx-auto mt-4 sm:mt-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {authMode === 'login' ? 'Member Login' : 'Join KEWA SACCO'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {authMode === 'login' ? 'Access your cooperative portal' : 'Register your staff cooperative profile'}
              </p>
            </div>

            <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Employer / Branch</label>
                    <select
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Member No.</label>
                      <input
                        type="text"
                        required
                        value={memberNumber}
                        onChange={(e) => setMemberNumber(e.target.value)}
                        placeholder="KW-001"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
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
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0712345678"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg text-sm transition mt-2 shadow-lg shadow-emerald-950/50 disabled:opacity-50"
              >
                {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Complete Registration'}
              </button>
            </form>

            <div className="text-center mt-6 text-xs text-slate-400">
              {authMode === 'login' ? (
                <>
                  New member?{' '}
                  <button onClick={() => setAuthMode('register')} className="text-emerald-400 hover:underline font-semibold">
                    Register Account
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-emerald-400 hover:underline font-semibold">
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* AUTHENTICATED TABS */
          <div className="space-y-6">
            {/* Header Member Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                  {profile?.companies?.name || 'KEWA Member'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">{profile?.full_name}</h2>
                <p className="text-xs text-slate-400">Member No: <span className="text-slate-200 font-medium">{profile?.member_number}</span></p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => generatePDFStatement()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-700/50 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download PDF Statement
                </button>
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-400">Total Savings & Shares</p>
                      <h3 className="text-2xl font-extrabold text-white mt-1">
                        KES {totalSavings.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="bg-emerald-950/60 border border-emerald-800/40 p-3 rounded-xl text-emerald-400">
                      <PiggyBank className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-400">Max Loan Limit (3X)</p>
                      <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">
                        KES {loanLimit.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="bg-emerald-950/60 border border-emerald-800/40 p-3 rounded-xl text-emerald-400">
                      <Calculator className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between sm:col-span-2 md:col-span-1">
                    <div>
                      <p className="text-xs font-medium text-slate-400">Active Loan Balance</p>
                      <h3 className="text-2xl font-extrabold text-white mt-1">
                        KES {activeLoanBalance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="bg-amber-950/60 border border-amber-800/40 p-3 rounded-xl text-amber-400">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <h4 className="text-base font-bold text-white mb-4">Contribution History</h4>
                  {savings.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      No contribution records found yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Type</th>
                            <th className="pb-3">Reference</th>
                            <th className="pb-3 text-right">Amount (KES)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {savings.map((s) => (
                            <tr key={s.id}>
                              <td className="py-3 text-slate-300">{new Date(s.created_at).toLocaleDateString()}</td>
                              <td className="py-3 capitalize text-slate-300">{s.transaction_type.replace('_', ' ')}</td>
                              <td className="py-3 text-slate-400 font-mono text-xs">{s.reference_code || '-'}</td>
                              <td className="py-3 text-right font-medium text-emerald-400">
                                +{Number(s.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB 2: LOANS & MULTI-GUARANTOR APPLICATION */}
            {activeTab === 'loans' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">Apply for a Loan</h3>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Borrowing Limit (3X):</span>
                    <span className="text-emerald-400 font-bold text-sm">KES {loanLimit.toLocaleString()}</span>
                  </div>

                  <form onSubmit={handleApplyLoan} className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-300">Loan Principal</label>
                        <span className="text-emerald-400 font-bold text-sm">KES {Number(loanPrincipal).toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max={loanLimit}
                        step="5000"
                        value={loanPrincipal}
                        onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-300">Repayment Period</label>
                        <span className="text-emerald-400 font-bold text-sm">{loanMonths} Months</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="24"
                        step="1"
                        value={loanMonths}
                        onChange={(e) => setLoanMonths(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    {/* DYNAMIC MULTI-GUARANTOR SYSTEM (UP TO 10+) */}
                    <div className="border-t border-slate-800 pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Assign Guarantors</h4>
                          <p className="text-[11px] text-slate-400">Add 1, 2, or up to 10+ colleagues to guarantee this loan</p>
                        </div>
                        <button
                          type="button"
                          onClick={addGuarantorRow}
                          className="flex items-center gap-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs px-2.5 py-1 rounded-lg hover:bg-emerald-900 transition"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Guarantor
                        </button>
                      </div>

                      {guarantorList.map((g, index) => (
                        <div key={index} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row gap-2 items-center">
                          <div className="w-full sm:w-3/5">
                            <label className="block text-[10px] text-slate-400 mb-1">Guarantor #{index + 1}</label>
                            <select
                              required
                              value={g.guarantorId}
                              onChange={(e) => updateGuarantorRow(index, 'guarantorId', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white"
                            >
                              <option value="">Select colleague...</option>
                              {allMembers.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.full_name} ({m.member_number}) - {m.companies?.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="w-full sm:w-2/5">
                            <label className="block text-[10px] text-slate-400 mb-1">Pledged Amount (KES)</label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 5000"
                              value={g.amount}
                              onChange={(e) => updateGuarantorRow(index, 'amount', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white"
                            />
                          </div>

                          {guarantorList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeGuarantorRow(index)}
                              className="self-end sm:self-center mt-1 sm:mt-5 text-rose-400 hover:text-rose-300 p-1.5 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}

                      <div className="flex justify-between text-xs px-1 text-slate-400">
                        <span>Total Pledged by Guarantors:</span>
                        <span className={`font-bold ${totalGuaranteedEntered >= loanPrincipal ? 'text-emerald-400' : 'text-amber-400'}`}>
                          KES {totalGuaranteedEntered.toLocaleString()} / KES {loanPrincipal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown Summary */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Interest Rate:</span>
                        <span className="text-white font-medium">{interestRate}% / month</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Total Repayment:</span>
                        <span className="text-white font-medium">KES {calculatedTotal.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold text-emerald-400">
                        <span>Monthly Installment:</span>
                        <span>KES {monthlyInstallment.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm transition"
                    >
                      Submit for Guarantor Sign-off
                    </button>
                  </form>
                </div>

                {/* Member's Existing Loans */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-4">My Loan Applications</h3>
                  {loans.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      No active or past loans found.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {loans.map((l) => (
                        <div key={l.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                l.status === 'approved' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' :
                                l.status === 'pending' ? 'bg-amber-950 border border-amber-800 text-amber-300' : 'bg-slate-800 text-slate-400'
                              }`}>
                                Status: {l.status}
                              </span>
                              <h4 className="text-base font-bold text-white mt-1.5">
                                KES {Number(l.principal_amount).toLocaleString()}
                              </h4>
                              <p className="text-xs text-slate-400">{l.repayment_period_months} Months Term</p>
                            </div>
                            <button
                              onClick={() => generatePDFStatement(l)}
                              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition"
                            >
                              <Download className="w-3.5 h-3.5" /> PDF Schedule
                            </button>
                          </div>

                          {l.loan_guarantors && l.loan_guarantors.length > 0 && (
                            <div className="border-t border-slate-800 pt-2 text-xs">
                              <p className="text-[11px] font-semibold text-slate-400 mb-1">Guarantor Approvals ({l.loan_guarantors.length}):</p>
                              <div className="flex flex-wrap gap-1.5">
                                {l.loan_guarantors.map((g) => (
                                  <span key={g.id} className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300 text-[11px] flex items-center gap-1">
                                    {g.profiles?.full_name}: 
                                    <strong className={g.status === 'accepted' ? 'text-emerald-400' : 'text-amber-400'}>
                                      {g.status} (KES {Number(g.amount_guaranteed).toLocaleString()})
                                    </strong>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: GUARANTOR DESK */}
            {activeTab === 'guarantors' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base sm:text-lg font-bold text-white">Guarantor Requests Received</h3>
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  Review loan requests from colleagues requesting your guarantee across Kenya Builders, Warren, and Eurocon.
                </p>

                {guarantorRequests.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    You have no pending guarantor requests.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {guarantorRequests.map((g) => (
                      <div key={g.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            g.status === 'accepted' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' :
                            g.status === 'pending' ? 'bg-amber-950 border border-amber-800 text-amber-300' : 'bg-rose-950 border border-rose-800 text-rose-300'
                          }`}>
                            Guarantee: {g.status}
                          </span>
                          <h4 className="text-base font-bold text-white mt-1">{g.loans?.profiles?.full_name}</h4>
                          <p className="text-xs text-slate-400">{g.loans?.profiles?.companies?.name} • Member {g.loans?.profiles?.member_number}</p>
                          <p className="text-xs text-emerald-400 mt-1 font-medium">
                            Pledged Amount: KES {Number(g.amount_guaranteed).toLocaleString()} (Total Loan: KES {Number(g.loans?.principal_amount).toLocaleString()})
                          </p>
                        </div>

                        {g.status === 'pending' && (
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleRespondGuarantor(g.id, 'accepted')}
                              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" /> Accept
                            </button>
                            <button
                              onClick={() => handleRespondGuarantor(g.id, 'rejected')}
                              className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" /> Decline
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ADMIN PANEL */}
            {activeTab === 'admin' && (profile?.role === 'admin' || profile?.role === 'treasurer') && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PlusCircle className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">Record Member Contribution</h3>
                  </div>

                  <form onSubmit={handleRecordDeposit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Select Member</label>
                      <select
                        value={targetMemberId}
                        onChange={(e) => setTargetMemberId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      >
                        {allMembers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.full_name} ({m.member_number}) - {m.companies?.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Contribution Type</label>
                      <select
                        value={depositType}
                        onChange={(e) => setDepositType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      >
                        <option value="monthly_contribution">Monthly Savings Contribution</option>
                        <option value="share_capital">Share Capital</option>
                        <option value="dividend">Dividend Deposit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (KES)</label>
                      <input
                        type="number"
                        required
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Payroll / Reference</label>
                      <input
                        type="text"
                        value={depositRef}
                        onChange={(e) => setDepositRef(e.target.value)}
                        placeholder="e.g. PAY-AUG-2026"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2.5 rounded-lg text-sm transition mt-2 cursor-pointer"
                    >
                      Post Deposit Entry
                    </button>
                  </form>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">Pending Loan Approvals</h3>
                  </div>

                  {allPendingLoans.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      No loan applications awaiting approval.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allPendingLoans.map((l) => (
                        <div key={l.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-bold text-white">{l.profiles?.full_name}</h4>
                              <p className="text-xs text-slate-400">{l.profiles?.companies?.name} • {l.profiles?.member_number}</p>
                              <p className="text-sm font-bold text-emerald-400 mt-1">
                                KES {Number(l.principal_amount).toLocaleString()} ({l.repayment_period_months} Mos)
                              </p>
                            </div>
                            <button
                              onClick={() => handleApproveLoan(l.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" /> Approve
                            </button>
                          </div>

                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                            <p className="font-semibold text-slate-300 mb-1">Guarantor Verification:</p>
                            <div className="space-y-1">
                              {l.loan_guarantors?.map((g) => (
                                <div key={g.id} className="flex justify-between">
                                  <span>{g.profiles?.full_name}:</span>
                                  <span className={g.status === 'accepted' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                                    {g.status.toUpperCase()} (KES {Number(g.amount_guaranteed).toLocaleString()})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistent Mobile Bottom Navigation Bar */}
      {session && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur border-t border-slate-800 flex justify-around items-center py-2 px-2 z-50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-3 rounded-lg transition ${
              activeTab === 'overview' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <PiggyBank className="w-5 h-5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('loans')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-3 rounded-lg transition ${
              activeTab === 'loans' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>Loans</span>
          </button>

          <button
            onClick={() => setActiveTab('guarantors')}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-3 rounded-lg relative transition ${
              activeTab === 'guarantors' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Guarantors</span>
            {pendingGuaranteesCount > 0 && (
              <span className="absolute top-0 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>

          {(profile?.role === 'admin' || profile?.role === 'treasurer') && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-3 rounded-lg transition ${
                activeTab === 'admin' ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Admin</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}