import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Building2, User, KeyRound, Phone, LogOut, 
  PiggyBank, TrendingUp, Briefcase, PlusCircle, 
  Calculator, CheckCircle, XCircle, Clock, ShieldCheck, Download, AlertTriangle, Users
} from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('overview'); // overview, loans, guarantors, admin

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

  // Loan Application State
  const [loanPrincipal, setLoanPrincipal] = useState(5000);
  const [loanMonths, setLoanMonths] = useState(6);
  const [interestRate] = useState(1.0); // 1% per month
  const [selectedGuarantor1, setSelectedGuarantor1] = useState('');
  const [selectedGuarantor2, setSelectedGuarantor2] = useState('');

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
    // Profile
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

    // Savings
    const { data: savingsData } = await supabase
      .from('savings_ledger')
      .select('*')
      .eq('member_id', userId)
      .order('created_at', { ascending: false });
    if (savingsData) setSavings(savingsData);

    // Loans
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
    if (data) {
      setAllMembers(data);
      if (data.length > 0) {
        setSelectedGuarantor1(data[0].id);
        if (data.length > 1) setSelectedGuarantor2(data[1].id);
      }
    }
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
      .select('*, profiles(full_name, member_number, companies(name)), loan_guarantors(*, profiles:guarantor_id(full_name, status))')
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

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (loanPrincipal > loanLimit) {
      setMessage({ text: `Loan exceeds your maximum borrowing limit of KES ${loanLimit.toLocaleString()} (3x Savings).`, type: 'error' });
      setLoading(false);
      return;
    }

    if (!selectedGuarantor1) {
      setMessage({ text: 'You must select at least one guarantor from your fellow members.', type: 'error' });
      setLoading(false);
      return;
    }

    // Step 1: Create Loan
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

    // Step 2: Create Guarantor Requests
    const guarantorsToInsert = [
      {
        loan_id: loanData.id,
        guarantor_id: selectedGuarantor1,
        amount_guaranteed: loanPrincipal / (selectedGuarantor2 ? 2 : 1),
        status: 'pending'
      }
    ];

    if (selectedGuarantor2 && selectedGuarantor2 !== selectedGuarantor1) {
      guarantorsToInsert.push({
        loan_id: loanData.id,
        guarantor_id: selectedGuarantor2,
        amount_guaranteed: loanPrincipal / 2,
        status: 'pending'
      });
    }

    await supabase.from('loan_guarantors').insert(guarantorsToInsert);

    setMessage({ text: 'Loan requested successfully! Guarantors must accept before admin approval.', type: 'success' });
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
      setMessage({ text: 'Loan approved & marked ready for disbursement.', type: 'success' });
    }
  };

  // PDF Generator Function
  const generatePDFStatement = (loan = null) => {
    try {
      const doc = new jsPDF();
      
      // Header Branding
      doc.setFillColor(6, 78, 59); // Emerald 900
      doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('KEWA SACCO SOCIETY LIMITED', 14, 18);
      doc.setFontSize(9);
      doc.text('Kenya Builders & Concrete • Warren Concrete • Eurocon Tiles', 14, 25);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 155, 25);

      // Member Information
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
        // Loan Specific Statement
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
        // General Savings Statement
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

      // Footer Note
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 150;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('This is a computer-generated statement issued by KEWA SACCO core financial system.', 14, finalY);

      const fileName = `KEWA_Statement_${profile?.member_number || 'Member'}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Could not generate PDF: ' + err.message);
    }
  };

  const pendingGuaranteesCount = guarantorRequests.filter((g) => g.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-900/30">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">KEWA SACCO</h1>
            <p className="text-xs text-slate-400">Kenya Builders • Warren • Eurocon</p>
          </div>
        </div>

        {session && (
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
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
                <Users className="w-3.5 h-3.5" /> Guarantor Desk
                {pendingGuaranteesCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {pendingGuaranteesCount}
                  </span>
                )}
              </button>
              {(profile?.role === 'admin' || profile?.role === 'treasurer') && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeTab === 'admin' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
                </button>
              )}
            </nav>

            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-2 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-700"
            >
              <LogOut className="w-4 h-4" /> Exit
            </button>
          </div>
        )}
      </header>

      {/* Main App Container */}
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
          <div className="max-w-md mx-auto mt-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {authMode === 'login' ? 'Member Login' : 'Join KEWA SACCO'}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {authMode === 'login' ? 'Access your cooperative account' : 'Register your staff cooperative profile'}
              </p>
            </div>

            <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Employer / Branch</label>
                    <select
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white"
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
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Member No.</label>
                      <input
                        type="text"
                        required
                        value={memberNumber}
                        onChange={(e) => setMemberNumber(e.target.value)}
                        placeholder="KW-001"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">National ID</label>
                      <input
                        type="text"
                        required
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="12345678"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0712345678"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@company.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white"
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
            {/* Header / Member Summary */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                  {profile?.companies?.name || 'KEWA Member'}
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">{profile?.full_name}</h2>
                <p className="text-xs text-slate-400">Member No: <span className="text-slate-200 font-medium">{profile?.member_number}</span></p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => generatePDFStatement()}
                  className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-700/50 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download PDF Statement
                </button>
                <span className="text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">
                  Role: <strong className="text-emerald-400 uppercase">{profile?.role || 'Member'}</strong>
                </span>
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
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

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
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

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
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

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-white">Contribution History</h4>
                    <button
                      onClick={() => generatePDFStatement()}
                      className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF Statement
                    </button>
                  </div>

                  {savings.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      No contribution records found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
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

            {/* TAB 2: LOANS & GUARANTOR ATTACHMENT */}
            {activeTab === 'loans' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calculator & Form */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Apply for a Loan</h3>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Your Maximum Eligible Limit (3X):</span>
                    <span className="text-emerald-400 font-bold text-sm">KES {loanLimit.toLocaleString()}</span>
                  </div>

                  <form onSubmit={handleApplyLoan} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Loan Principal: <span className="text-emerald-400 font-bold">KES {Number(loanPrincipal).toLocaleString()}</span>
                      </label>
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
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Repayment Duration: <span className="text-emerald-400 font-bold">{loanMonths} Months</span>
                      </label>
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

                    {/* Guarantor Selectors */}
                    <div className="border-t border-slate-800 pt-3 space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Assign Member Guarantors</h4>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Primary Guarantor (Required)</label>
                        <select
                          required
                          value={selectedGuarantor1}
                          onChange={(e) => setSelectedGuarantor1(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        >
                          <option value="">Select a fellow member</option>
                          {allMembers.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.full_name} ({m.member_number}) - {m.companies?.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Secondary Guarantor (Optional)</label>
                        <select
                          value={selectedGuarantor2}
                          onChange={(e) => setSelectedGuarantor2(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        >
                          <option value="">None (Single guarantor takes full amount)</option>
                          {allMembers
                            .filter((m) => m.id !== selectedGuarantor1)
                            .map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.full_name} ({m.member_number}) - {m.companies?.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Breakdown Summary */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
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

                {/* Member's Existing Loans & PDF Actions */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">My Loan Applications</h3>
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
                              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" /> PDF Schedule
                            </button>
                          </div>

                          {/* Guarantor list for this loan */}
                          {l.loan_guarantors && l.loan_guarantors.length > 0 && (
                            <div className="border-t border-slate-800 pt-2 text-xs">
                              <p className="text-[11px] font-semibold text-slate-400 mb-1">Guarantor Approvals:</p>
                              <div className="flex flex-wrap gap-2">
                                {l.loan_guarantors.map((g) => (
                                  <span key={g.id} className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300 text-[11px] flex items-center gap-1">
                                    {g.profiles?.full_name}: 
                                    <strong className={g.status === 'accepted' ? 'text-emerald-400' : 'text-amber-400'}>
                                      {g.status}
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
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Guarantor Requests Received</h3>
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  Review loan requests from fellow members requesting your guarantee. By accepting, you pledge your savings to secure their borrowing.
                </p>

                {guarantorRequests.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    You have no pending guarantor requests.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {guarantorRequests.map((g) => (
                      <div key={g.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                            Guarantee Amount: KES {Number(g.amount_guaranteed).toLocaleString()} (Total Loan: KES {Number(g.loans?.principal_amount).toLocaleString()})
                          </p>
                        </div>

                        {g.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRespondGuarantor(g.id, 'accepted')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" /> Accept Guarantee
                            </button>
                            <button
                              onClick={() => handleRespondGuarantor(g.id, 'rejected')}
                              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
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
                {/* Deposit Tool */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PlusCircle className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">Record Member Contribution</h3>
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
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Payroll / M-Pesa Reference</label>
                      <input
                        type="text"
                        value={depositRef}
                        onChange={(e) => setDepositRef(e.target.value)}
                        placeholder="e.g. PAY-AUG-2026 / QGH67199"
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

                {/* Loan Approvals */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">Pending Loan Approvals</h3>
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

                          {/* Guarantor Status for Admin Verification */}
                          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300">Guarantor Check: </span>
                            {l.loan_guarantors?.map((g) => (
                              <span key={g.id} className="mr-2">
                                {g.profiles?.full_name} ({g.status})
                              </span>
                            ))}
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
    </div>
  );
}