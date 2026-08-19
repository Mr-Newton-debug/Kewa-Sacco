import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { 
  Building2, User, KeyRound, Phone, LogOut, 
  PiggyBank, TrendingUp, Briefcase, PlusCircle, 
  Calculator, CheckCircle, XCircle, Clock, ShieldCheck, Download, Users, Trash2, Plus, Menu, X, UploadCloud, FileSpreadsheet, ArrowDownRight, ArrowUpRight
} from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('overview');
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
  const [repayments, setRepayments] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [guarantorRequests, setGuarantorRequests] = useState([]);
  const [allPendingLoans, setAllPendingLoans] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Loan Application State
  const [loanPrincipal, setLoanPrincipal] = useState(10000);
  const [loanMonths, setLoanMonths] = useState(6);
  const [interestRate] = useState(1.0);
  const [guarantorList, setGuarantorList] = useState([{ guarantorId: '', amount: '' }]);

  // Admin Batch / Checkoff State
  const [targetMemberId, setTargetMemberId] = useState('');
  const [entryCategory, setEntryCategory] = useState('savings'); // savings or loan_repayment
  const [depositAmount, setDepositAmount] = useState('');
  const [depositType, setDepositType] = useState('monthly_contribution');
  const [depositRef, setDepositRef] = useState('');
  const [batchPreview, setBatchPreview] = useState([]);
  const [batchMonth, setBatchMonth] = useState('AUG-2026');

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
        setRepayments([]);
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

    // Savings Ledger
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

    // Repayments Ledger
    const { data: repaymentData } = await supabase
      .from('loan_repayments')
      .select('*, loans(principal_amount)')
      .eq('member_id', userId)
      .order('created_at', { ascending: false });
    if (repaymentData) setRepayments(repaymentData);

    setLoading(false);
  };

  const fetchAllMembers = async (currentUserId) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, member_number, id_number, companies(name)')
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

  // Financial Balances
  const totalSavings = savings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const loanLimit = Math.max(totalSavings * 3, 10000);
  const activeLoanBalance = loans
    .filter((l) => l.status === 'approved' || l.status === 'disbursed')
    .reduce((acc, curr) => acc + Number(curr.balance_remaining || 0), 0);

  const calculatedInterest = (loanPrincipal * (interestRate / 100)) * loanMonths;
  const calculatedTotal = Number(loanPrincipal) + calculatedInterest;
  const monthlyInstallment = calculatedTotal / loanMonths;

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

  // --- AUTOMATED PAYROLL CHECKOFF INGESTION (SAVINGS + LOANS SEPARATION) ---
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        const matchedEntries = [];

        // Fetch all active loans to map loan repayments
        const { data: activeLoans } = await supabase
          .from('loans')
          .select('id, member_id, balance_remaining')
          .in('status', ['approved', 'disbursed']);

        rows.forEach((row) => {
          const memberNum = (row.member_number || row.member_no || row.MemberNo || '').toString().trim();
          const savingsAmt = parseFloat(row.savings_amount || row.savings || row.Savings || 0);
          const loanAmt = parseFloat(row.loan_amount || row.loan || row.Loan || 0);

          if (memberNum && (savingsAmt > 0 || loanAmt > 0)) {
            const memberObj = allMembers.find(
              (m) => m.member_number?.toLowerCase() === memberNum.toLowerCase()
            );

            const activeLoan = activeLoans?.find((l) => l.member_id === memberObj?.id);

            matchedEntries.push({
              member_number: memberNum,
              full_name: memberObj ? memberObj.full_name : '⚠️ Member Not Found',
              member_id: memberObj ? memberObj.id : null,
              active_loan_id: activeLoan ? activeLoan.id : null,
              savings_amount: savingsAmt,
              loan_amount: loanAmt,
              valid: !!memberObj,
            });
          }
        });

        setBatchPreview(matchedEntries);
      },
    });
  };

  const handleExecuteBatchCheckoff = async () => {
    const validRows = batchPreview.filter((r) => r.valid && r.member_id);
    if (validRows.length === 0) {
      setMessage({ text: 'No valid matching member rows found.', type: 'error' });
      return;
    }

    setLoading(true);

    // 1. Process Savings Checkoffs
    const savingsInserts = validRows
      .filter((r) => r.savings_amount > 0)
      .map((r) => ({
        member_id: r.member_id,
        amount: r.savings_amount,
        transaction_type: 'monthly_contribution',
        reference_code: `CHECKOFF-SAV-${batchMonth}`,
      }));

    if (savingsInserts.length > 0) {
      await supabase.from('savings_ledger').insert(savingsInserts);
    }

    // 2. Process Loan Repayment Checkoffs
    const loanRows = validRows.filter((r) => r.loan_amount > 0 && r.active_loan_id);
    for (const r of loanRows) {
      // Record repayment
      await supabase.from('loan_repayments').insert([
        {
          loan_id: r.active_loan_id,
          member_id: r.member_id,
          amount: r.loan_amount,
          reference_code: `CHECKOFF-LOAN-${batchMonth}`,
        },
      ]);

      // Deduct balance from loan
      const { data: currentLoan } = await supabase
        .from('loans')
        .select('balance_remaining')
        .eq('id', r.active_loan_id)
        .single();

      if (currentLoan) {
        const newBal = Math.max(0, Number(currentLoan.balance_remaining) - r.loan_amount);
        await supabase
          .from('loans')
          .update({
            balance_remaining: newBal,
            status: newBal === 0 ? 'completed' : 'approved',
          })
          .eq('id', r.active_loan_id);
      }
    }

    setMessage({
      text: `Payroll Checkoff Processed: ${savingsInserts.length} savings credits and ${loanRows.length} loan repayments applied!`,
      type: 'success',
    });
    setBatchPreview([]);
    fetchUserData(session.user.id);
    setLoading(false);
  };

  const handleRecordDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (entryCategory === 'savings') {
      const { error } = await supabase.from('savings_ledger').insert([
        {
          member_id: targetMemberId,
          amount: Number(depositAmount),
          transaction_type: depositType,
          reference_code: depositRef || 'DIRECT-SAVINGS',
        },
      ]);
      if (error) setMessage({ text: error.message, type: 'error' });
      else setMessage({ text: 'Savings contribution posted successfully!', type: 'success' });
    } else {
      // Individual Loan Repayment
      const { data: memberLoan } = await supabase
        .from('loans')
        .select('id, balance_remaining')
        .eq('member_id', targetMemberId)
        .in('status', ['approved', 'disbursed'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!memberLoan) {
        setMessage({ text: 'Selected member has no active loan to repay.', type: 'error' });
        setLoading(false);
        return;
      }

      await supabase.from('loan_repayments').insert([
        {
          loan_id: memberLoan.id,
          member_id: targetMemberId,
          amount: Number(depositAmount),
          reference_code: depositRef || 'DIRECT-LOAN-PAY',
        },
      ]);

      const newBal = Math.max(0, Number(memberLoan.balance_remaining) - Number(depositAmount));
      await supabase
        .from('loans')
        .update({
          balance_remaining: newBal,
          status: newBal === 0 ? 'completed' : 'approved',
        })
        .eq('id', memberLoan.id);

      setMessage({ text: `Loan repayment of KES ${Number(depositAmount).toLocaleString()} deducted from loan!`, type: 'success' });
    }

    setDepositAmount('');
    setDepositRef('');
    fetchUserData(session.user.id);
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

  // --- UNIFIED COMPREHENSIVE PDF STATEMENT WITH SEPARATE SECTIONS ---
  const generatePDFStatement = (loan = null) => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(6, 78, 59); // Emerald Branding
      doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('KEWA SACCO SOCIETY LIMITED', 14, 18);
      doc.setFontSize(9);
      doc.text('Kenya Builders & Concrete • Warren Concrete • Eurocon Tiles', 14, 25);
      doc.text(`Statement Date: ${new Date().toLocaleDateString('en-GB')}`, 145, 25);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.text('OFFICIAL MEMBER FINANCIAL STATEMENT', 14, 46);

      doc.setFontSize(9);
      doc.text(`Member Name: ${profile?.full_name || 'N/A'}`, 14, 54);
      doc.text(`Member No: ${profile?.member_number || 'N/A'}`, 14, 60);
      doc.text(`Branch / Company: ${profile?.companies?.name || 'KEWA'}`, 14, 66);
      doc.text(`National ID: ${profile?.id_number || 'N/A'}`, 120, 54);
      doc.text(`Total Shares/Savings: KES ${totalSavings.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 120, 60);
      doc.text(`Active Loan Debt: KES ${activeLoanBalance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 120, 66);

      if (loan) {
        // Individual Loan Amortization Schedule
        doc.setFontSize(11);
        doc.text('Specific Loan Repayment Schedule', 14, 78);

        const loanRows = [
          ['Principal Amount', `KES ${Number(loan.principal_amount).toLocaleString()}`],
          ['Interest Rate', `${loan.interest_rate}% / month`],
          ['Repayment Duration', `${loan.repayment_period_months} Months`],
          ['Total Payable (P + I)', `KES ${Number(loan.total_payable).toLocaleString()}`],
          ['Outstanding Debt Balance', `KES ${Number(loan.balance_remaining).toLocaleString()}`],
          ['Status', (loan.status || 'PENDING').toUpperCase()],
        ];

        autoTable(doc, {
          startY: 83,
          head: [['Metric', 'Value']],
          body: loanRows,
          theme: 'striped',
          headStyles: { fillColor: [6, 78, 59] },
        });
      } else {
        // 1. Savings Ledger Table
        doc.setFontSize(11);
        doc.setTextColor(6, 78, 59);
        doc.text('1. Monthly Savings & Shares Contributions Ledger', 14, 78);

        const savingsRows = savings.length > 0 ? savings.map((s) => [
          new Date(s.created_at).toLocaleDateString('en-GB'),
          (s.transaction_type || '').replace('_', ' ').toUpperCase(),
          s.reference_code || '-',
          `+KES ${Number(s.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`
        ]) : [['-', 'No savings contributions recorded', '-', 'KES 0.00']];

        autoTable(doc, {
          startY: 83,
          head: [['Date', 'Contribution Type', 'Payroll Reference', 'Credit Amount']],
          body: savingsRows,
          theme: 'striped',
          headStyles: { fillColor: [6, 78, 59] },
        });

        // 2. Loan Deductions Table
        const loanTableY = doc.lastAutoTable.finalY + 12;
        doc.setFontSize(11);
        doc.setTextColor(180, 83, 9); // Amber
        doc.text('2. Monthly Loan Repayments Deducted From Salary', 14, loanTableY);

        const repaymentRows = repayments.length > 0 ? repayments.map((r) => [
          new Date(r.created_at).toLocaleDateString('en-GB'),
          'LOAN PRINCIPAL + INTEREST REPAYMENT',
          r.reference_code || '-',
          `-KES ${Number(r.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`
        ]) : [['-', 'No loan repayments on record', '-', 'KES 0.00']];

        autoTable(doc, {
          startY: loanTableY + 4,
          head: [['Date', 'Deduction Type', 'Payroll Reference', 'Repayment Paid']],
          body: repaymentRows,
          theme: 'striped',
          headStyles: { fillColor: [180, 83, 9] },
        });
      }

      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 150;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('This is a computer-generated official statement issued by KEWA SACCO core financial system.', 14, finalY);

      doc.save(`KEWA_Statement_${profile?.member_number || 'Member'}.pdf`);
    } catch (err) {
      alert('Could not generate PDF: ' + err.message);
    }
  };

  const pendingGuaranteesCount = guarantorRequests.filter((g) => g.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20 sm:pb-12">
      {/* Header */}
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
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
                </button>
              )}
            </div>

            <button
              onClick={() => supabase.auth.signOut()}
              className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-emerald-400" />}
            </button>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {session && mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-2 sticky top-[57px] z-40 shadow-2xl">
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
            <Calculator className="w-4 h-4" /> Loans & Multi-Guarantor
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
                {pendingGuaranteesCount}
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
              <ShieldCheck className="w-4 h-4" /> Admin & Payroll Checkoff
            </button>
          )}

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center justify-center gap-2 bg-rose-950/40 border border-rose-900/50 text-rose-300 py-2.5 rounded-xl text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main App */}
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
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg text-sm transition mt-2"
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
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                  {profile?.companies?.name || 'KEWA Member'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">{profile?.full_name}</h2>
                <p className="text-xs text-slate-400">Member No: <span className="text-slate-200 font-medium">{profile?.member_number}</span></p>
              </div>

              <button
                onClick={() => generatePDFStatement()}
                className="flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-700/50 transition cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Consolidated Statement
              </button>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* SAVINGS LEDGER */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                      <h4 className="text-base font-bold text-white">Monthly Savings / Shares Contributions</h4>
                    </div>

                    {savings.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-sm">
                        No savings checkoff records found yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 uppercase">
                              <th className="pb-2">Date</th>
                              <th className="pb-2">Batch Ref</th>
                              <th className="pb-2 text-right">Credit (KES)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                            {savings.map((s) => (
                              <tr key={s.id}>
                                <td className="py-2.5 text-slate-300">{new Date(s.created_at).toLocaleDateString()}</td>
                                <td className="py-2.5 text-slate-400 font-mono">{s.reference_code || '-'}</td>
                                <td className="py-2.5 text-right font-bold text-emerald-400">
                                  +{Number(s.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* LOAN REPAYMENTS LEDGER */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ArrowDownRight className="w-5 h-5 text-amber-400" />
                      <h4 className="text-base font-bold text-white">Monthly Loan Repayments (Deductions)</h4>
                    </div>

                    {repayments.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-sm">
                        No loan repayments deducted yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 uppercase">
                              <th className="pb-2">Date</th>
                              <th className="pb-2">Batch Ref</th>
                              <th className="pb-2 text-right">Repayment (KES)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                            {repayments.map((r) => (
                              <tr key={r.id}>
                                <td className="py-2.5 text-slate-300">{new Date(r.created_at).toLocaleDateString()}</td>
                                <td className="py-2.5 text-slate-400 font-mono">{r.reference_code || '-'}</td>
                                <td className="py-2.5 text-right font-bold text-amber-400">
                                  -KES {Number(r.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: LOANS */}
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

                    <div className="border-t border-slate-800 pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Assign Guarantors</h4>
                          <p className="text-[11px] text-slate-400">Add 1 to 10+ colleagues to guarantee this loan</p>
                        </div>
                        <button
                          type="button"
                          onClick={addGuarantorRow}
                          className="flex items-center gap-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs px-2.5 py-1 rounded-lg"
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
                              className="self-end sm:self-center mt-1 sm:mt-5 text-rose-400 hover:text-rose-300 p-1.5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

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
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm transition cursor-pointer"
                    >
                      Submit for Guarantor Sign-off
                    </button>
                  </form>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-4">My Active & Past Loans</h3>
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
                                l.status === 'completed' ? 'bg-blue-950 border border-blue-800 text-blue-300' :
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
                              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" /> PDF Schedule
                            </button>
                          </div>

                          <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                            <span className="text-slate-400">Remaining Balance to Clear:</span>
                            <span className="text-amber-400 font-bold text-sm">KES {Number(l.balance_remaining).toLocaleString()}</span>
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

            {/* TAB 4: ADMIN & PAYROLL CHECKOFF WITH SAVINGS/LOAN SEPARATION */}
            {activeTab === 'admin' && (profile?.role === 'admin' || profile?.role === 'treasurer') && (
              <div className="space-y-6">
                {/* DUAL PAYROLL CHECKOFF INGESTION */}
                <div className="bg-slate-950 border border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">Automated Dual Payroll Checkoff (Savings + Loans)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Upload payroll deductions report (CSV format with columns: <code className="text-amber-300 font-mono">member_number, savings_amount, loan_amount</code>).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Payroll Month</label>
                      <input
                        type="text"
                        value={batchMonth}
                        onChange={(e) => setBatchMonth(e.target.value)}
                        placeholder="e.g. AUG-2026"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Select Payroll Deductions CSV</label>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-amber-600 file:text-white cursor-pointer"
                      />
                    </div>
                  </div>

                  {batchPreview.length > 0 && (
                    <div className="mt-4 border-t border-slate-800 pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-300">
                          Matched Rows: {batchPreview.filter((r) => r.valid).length} of {batchPreview.length}
                        </span>
                        <button
                          onClick={handleExecuteBatchCheckoff}
                          disabled={loading}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-lg cursor-pointer"
                        >
                          <UploadCloud className="w-4 h-4" /> Process & Post All Checkoffs
                        </button>
                      </div>

                      <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-xl">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900 text-slate-400 sticky top-0">
                            <tr>
                              <th className="p-2">Member No</th>
                              <th className="p-2">Matched Name</th>
                              <th className="p-2 text-right">Savings Credit</th>
                              <th className="p-2 text-right">Loan Deduct</th>
                              <th className="p-2 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {batchPreview.map((row, idx) => (
                              <tr key={idx} className={row.valid ? 'hover:bg-slate-900/40' : 'bg-rose-950/20'}>
                                <td className="p-2 font-mono">{row.member_number}</td>
                                <td className="p-2 font-medium">{row.full_name}</td>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Manual Single Entry with Category Toggle */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <PlusCircle className="w-5 h-5 text-amber-400" />
                      <h3 className="text-base sm:text-lg font-bold text-white">Manual Individual Entry</h3>
                    </div>

                    <form onSubmit={handleRecordDeposit} className="space-y-3.5">
                      <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setEntryCategory('savings')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
                            entryCategory === 'savings' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                          }`}
                        >
                          Savings Contribution
                        </button>
                        <button
                          type="button"
                          onClick={() => setEntryCategory('loan_repayment')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
                            entryCategory === 'loan_repayment' ? 'bg-amber-600 text-white' : 'text-slate-400'
                          }`}
                        >
                          Loan Repayment
                        </button>
                      </div>

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
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (KES)</label>
                        <input
                          type="number"
                          required
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="e.g. 3500"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Reference</label>
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
                        Post Single Entry
                      </button>
                    </form>
                  </div>

                  {/* Loan Approvals */}
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
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
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