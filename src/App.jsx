import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { 
  Building2, User, KeyRound, Phone, LogOut, 
  PiggyBank, TrendingUp, Briefcase, PlusCircle, 
  Calculator, CheckCircle, XCircle, Clock, ShieldCheck, Download, 
  Users, Trash2, Plus, Menu, X, UploadCloud, FileSpreadsheet, 
  ArrowDownRight, ArrowUpRight, HeartHandshake, Bell, Smartphone, 
  Award, ShieldAlert, FileText, Send, History, CheckSquare, Paperclip, FileCheck, HelpCircle
} from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login, register, forgot, reset
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [odpcConsent, setOdpcConsent] = useState(false);

  // Core Data State
  const [companies, setCompanies] = useState([]);
  const [profile, setProfile] = useState(null);
  const [savings, setSavings] = useState([]);
  const [loans, setLoans] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [guarantorRequests, setGuarantorRequests] = useState([]);
  const [myGuaranteesCommitted, setMyGuaranteesCommitted] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [welfareClaims, setWelfareClaims] = useState([]);
  const [allPendingLoans, setAllPendingLoans] = useState([]);
  const [allPendingClaims, setAllPendingClaims] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Loan Application State
  const [loanProduct, setLoanProduct] = useState('main_loan');
  const [loanPrincipal, setLoanPrincipal] = useState(20000);
  const [loanMonths, setLoanMonths] = useState(12);
  const [interestRate, setInterestRate] = useState(1.0);
  const [guarantorList, setGuarantorList] = useState([{ guarantorId: '', amount: '' }]);

  // Beneficiary Form State
  const [nokName, setNokName] = useState('');
  const [nokRel, setNokRel] = useState('Spouse');
  const [nokId, setNokId] = useState('');
  const [nokPhone, setNokPhone] = useState('');
  const [nokPercent, setNokPercent] = useState('');

  // Welfare Claim Form State
  const [claimType, setClaimType] = useState('hospitalization');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimDesc, setClaimDesc] = useState('');
  const [claimDocument, setClaimDocument] = useState(null);

  // M-Pesa State
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaAmount, setMpesaAmount] = useState('');
  const [mpesaType, setMpesaType] = useState('savings_deposit');
  const [mpesaCode, setMpesaCode] = useState('');

  // Dividend Simulator State
  const [dividendRate, setDividendRate] = useState(10.0);
  const [interestOnDepositsRate, setInterestOnDepositsRate] = useState(8.5);

  // Admin Hub State
  const [targetMemberId, setTargetMemberId] = useState('');
  const [entryCategory, setEntryCategory] = useState('savings');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositType, setDepositType] = useState('monthly_contribution');
  const [depositRef, setDepositRef] = useState('');
  const [batchPreview, setBatchPreview] = useState([]);
  const [batchMonth, setBatchMonth] = useState('AUG-2026');
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('general');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthMode('reset');
      }
      setSession(session);
      if (session) fetchUserData(session.user.id);
      else {
        setProfile(null);
        setSavings([]);
        setLoans([]);
        setRepayments([]);
        setBeneficiaries([]);
        setAuditLogs([]);
      }
    });

    fetchCompanies();
    fetchAnnouncements();
    return () => subscription.unsubscribe();
  }, []);

  const handleLoanProductChange = (prod) => {
    setLoanProduct(prod);
    if (prod === 'main_loan') {
      setLoanMonths(12);
      setInterestRate(1.0);
      setLoanPrincipal(30000);
    } else if (prod === 'emergency_loan') {
      setLoanMonths(6);
      setInterestRate(1.0);
      setLoanPrincipal(15000);
    } else if (prod === 'christmas_loan') {
      setLoanMonths(4);
      setInterestRate(1.0);
      setLoanPrincipal(10000);
    } else if (prod === 'monthly_shylock') {
      setLoanMonths(1);
      setInterestRate(5.0);
      setLoanPrincipal(5000);
    }
  };

  const logAuditAction = async (action, details, userId = null, userName = null) => {
    try {
      await supabase.from('audit_logs').insert([
        {
          user_id: userId || session?.user?.id || null,
          user_name: userName || profile?.full_name || 'System User',
          action,
          details,
        },
      ]);
    } catch (e) {
      console.warn('Audit log write skipped:', e);
    }
  };

  const fetchCompanies = async () => {
    const { data } = await supabase.from('companies').select('*');
    if (data && data.length > 0) {
      setCompanies(data);
      setCompanyId(data[0].id);
    }
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setAnnouncements(data);
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
      fetchGuarantorData(userId);
      fetchBeneficiaries(userId);
      fetchWelfareClaims(userId);
      if (profileData.role === 'admin' || profileData.role === 'treasurer' || profileData.role === 'chairman' || profileData.role === 'assistant_chair') {
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

  const fetchGuarantorData = async (userId) => {
    const { data: requests } = await supabase
      .from('loan_guarantors')
      .select('*, loans(*, profiles:member_id(full_name, member_number, companies(name)))')
      .eq('guarantor_id', userId)
      .order('created_at', { ascending: false });
    if (requests) setGuarantorRequests(requests);

    const { data: activeGuarantees } = await supabase
      .from('loan_guarantors')
      .select('*, loans(status, balance_remaining)')
      .eq('guarantor_id', userId)
      .eq('status', 'accepted');
    if (activeGuarantees) {
      const activeRunning = activeGuarantees.filter(
        (g) => g.loans?.status === 'approved' || g.loans?.status === 'disbursed'
      );
      setMyGuaranteesCommitted(activeRunning);
    }
  };

  const fetchBeneficiaries = async (userId) => {
    const { data } = await supabase
      .from('next_of_kin')
      .select('*')
      .eq('member_id', userId)
      .order('created_at', { ascending: false });
    if (data) setBeneficiaries(data);
  };

  const fetchWelfareClaims = async (userId) => {
    const { data } = await supabase
      .from('welfare_claims')
      .select('*')
      .eq('member_id', userId)
      .order('created_at', { ascending: false });
    if (data) setWelfareClaims(data);
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
      .in('status', ['pending', 'guaranteed']);
    if (pendingLoans) setAllPendingLoans(pendingLoans);

    const { data: claims } = await supabase
      .from('welfare_claims')
      .select('*, profiles(full_name, member_number, companies(name))')
      .eq('status', 'pending');
    if (claims) setAllPendingClaims(claims);

    const { data: logs } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (logs) setAuditLogs(logs);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage({ text: error.message, type: 'error' });
    else {
      logAuditAction('LOGIN', `Member logged in via web portal`, data?.user?.id, email);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: 'Password reset instructions sent to your email inbox.', type: 'success' });
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: 'Password updated successfully! Please sign in with your new password.', type: 'success' });
      setAuthMode('login');
      setNewPassword('');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!odpcConsent) {
      setMessage({ text: 'Please accept the Data Protection Act (ODPC) privacy terms to continue.', type: 'error' });
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
      else {
        logAuditAction('REGISTER_ACCOUNT', `New member profile created for ${fullName} (${memberNumber})`, authData.user.id, fullName);
        setMessage({ text: 'Account created successfully!', type: 'success' });
      }
    }
    setLoading(false);
  };

  // Financial Metrics
  const totalSavings = savings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const activeLoanBalance = loans
    .filter((l) => l.status === 'approved' || l.status === 'disbursed')
    .reduce((acc, curr) => acc + Number(curr.balance_remaining || 0), 0);

  const totalGuaranteesCommittedAmount = myGuaranteesCommitted.reduce(
    (acc, curr) => acc + Number(curr.amount_guaranteed || 0),
    0
  );

  const freeSharesAvailable = Math.max(0, totalSavings - activeLoanBalance - totalGuaranteesCommittedAmount);
  
  const maxLimitForSelectedProduct = loanProduct === 'monthly_shylock'
    ? 20000 
    : Math.max(totalSavings * 3, 10000);

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

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (loanPrincipal > maxLimitForSelectedProduct) {
      setMessage({ text: `Loan exceeds maximum product limit of KES ${maxLimitForSelectedProduct.toLocaleString()}.`, type: 'error' });
      setLoading(false);
      return;
    }

    const validGuarantors = guarantorList.filter((g) => g.guarantorId && Number(g.amount) > 0);
    if (loanProduct !== 'monthly_shylock' && validGuarantors.length === 0) {
      setMessage({ text: 'Please assign at least 1 guarantor for this loan product.', type: 'error' });
      setLoading(false);
      return;
    }

    const { data: loanData, error: loanError } = await supabase.from('loans').insert([
      {
        member_id: session.user.id,
        loan_product: loanProduct,
        principal_amount: loanPrincipal,
        interest_rate: interestRate,
        repayment_period_months: loanMonths,
        total_payable: calculatedTotal,
        balance_remaining: calculatedTotal,
        status: 'pending',
        chairman_approval: false,
        treasurer_approval: false,
        assistant_chair_approval: false,
      },
    ]).select().single();

    if (loanError) {
      setMessage({ text: loanError.message, type: 'error' });
      setLoading(false);
      return;
    }

    if (validGuarantors.length > 0) {
      const guarantorsToInsert = validGuarantors.map((g) => ({
        loan_id: loanData.id,
        guarantor_id: g.guarantorId,
        amount_guaranteed: Number(g.amount),
        status: 'pending',
      }));
      await supabase.from('loan_guarantors').insert(guarantorsToInsert);
    }

    logAuditAction('LOAN_APPLICATION_SUBMITTED', `${loanProduct.toUpperCase()} applied: KES ${loanPrincipal.toLocaleString()}`);

    setMessage({ text: `Loan request for ${loanProduct.replace('_', ' ').toUpperCase()} submitted for 3-Signatory sign-off!`, type: 'success' });
    setGuarantorList([{ guarantorId: '', amount: '' }]);
    fetchUserData(session.user.id);
    setLoading(false);
  };

  const handleRespondGuarantor = async (guaranteeId, status, pledgeAmount) => {
    if (status === 'accepted' && Number(pledgeAmount) > freeSharesAvailable) {
      setMessage({
        text: `Cannot accept guarantee: Pledged KES ${Number(pledgeAmount).toLocaleString()} exceeds your available Free Shares (KES ${freeSharesAvailable.toLocaleString()}).`,
        type: 'error',
      });
      return;
    }

    const { error } = await supabase
      .from('loan_guarantors')
      .update({ status })
      .eq('id', guaranteeId);

    if (!error) {
      logAuditAction('GUARANTOR_RESPONSE', `Marked pledge as ${status} (KES ${Number(pledgeAmount).toLocaleString()})`);
      fetchGuarantorData(session.user.id);
      fetchUserData(session.user.id);
      setMessage({ text: `Guarantor response recorded: ${status}.`, type: 'success' });
    }
  };

  const handleSubmitWelfareClaim = async (e) => {
    e.preventDefault();
    setLoading(true);

    let documentUrl = null;

    if (claimDocument) {
      const fileExt = claimDocument.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('welfare-documents')
        .upload(fileName, claimDocument);

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('welfare-documents')
          .getPublicUrl(fileName);
        documentUrl = publicUrl;
      }
    }

    const { error } = await supabase.from('welfare_claims').insert([
      {
        member_id: session.user.id,
        claim_type: claimType,
        amount_requested: Number(claimAmount),
        description: claimDesc,
        evidence_url: documentUrl,
        status: 'pending',
        chairman_approval: false,
        treasurer_approval: false,
        assistant_chair_approval: false,
      },
    ]);

    if (error) setMessage({ text: error.message, type: 'error' });
    else {
      logAuditAction('WELFARE_CLAIM_FILED', `Welfare claim submitted for KES ${claimAmount} (${claimType})`);
      setMessage({ text: 'Welfare claim and evidence document submitted for 3-Signatory review.', type: 'success' });
      setClaimAmount('');
      setClaimDesc('');
      setClaimDocument(null);
      fetchWelfareClaims(session.user.id);
    }
    setLoading(false);
  };

  const handleLoanSignatoryApprove = async (loanId, signatoryRole) => {
    const updatePayload = {};
    if (signatoryRole === 'chairman') updatePayload.chairman_approval = true;
    if (signatoryRole === 'treasurer') updatePayload.treasurer_approval = true;
    if (signatoryRole === 'assistant_chair') updatePayload.assistant_chair_approval = true;

    const { data: currentLoan } = await supabase.from('loans').select('*').eq('id', loanId).single();
    
    const isChair = signatoryRole === 'chairman' || currentLoan.chairman_approval;
    const isTreas = signatoryRole === 'treasurer' || currentLoan.treasurer_approval;
    const isAsst = signatoryRole === 'assistant_chair' || currentLoan.assistant_chair_approval;

    if (isChair && isTreas && isAsst) {
      updatePayload.status = 'approved';
    }

    await supabase.from('loans').update(updatePayload).eq('id', loanId);
    logAuditAction('LOAN_SIGNATORY_SIGN', `Signed by ${signatoryRole.replace('_', ' ').toUpperCase()} for Loan ID ${loanId}`);
    fetchAdminData();
    fetchUserData(session.user.id);
    setMessage({ text: `Endorsement recorded for ${signatoryRole.replace('_', ' ')}.`, type: 'success' });
  };

  const handleWelfareSignatoryApprove = async (claimId, signatoryRole) => {
    const updatePayload = {};
    if (signatoryRole === 'chairman') updatePayload.chairman_approval = true;
    if (signatoryRole === 'treasurer') updatePayload.treasurer_approval = true;
    if (signatoryRole === 'assistant_chair') updatePayload.assistant_chair_approval = true;

    const { data: currentClaim } = await supabase.from('welfare_claims').select('*').eq('id', claimId).single();
    
    const isChair = signatoryRole === 'chairman' || currentClaim.chairman_approval;
    const isTreas = signatoryRole === 'treasurer' || currentClaim.treasurer_approval;
    const isAsst = signatoryRole === 'assistant_chair' || currentClaim.assistant_chair_approval;

    if (isChair && isTreas && isAsst) {
      updatePayload.status = 'approved';
    }

    await supabase.from('welfare_claims').update(updatePayload).eq('id', claimId);
    logAuditAction('WELFARE_SIGNATORY_SIGN', `Benevolence endorsed by ${signatoryRole.replace('_', ' ').toUpperCase()} for Claim ID ${claimId}`);
    fetchAdminData();
    fetchUserData(session.user.id);
    setMessage({ text: `Benevolence endorsement recorded for ${signatoryRole.replace('_', ' ')}.`, type: 'success' });
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    setLoading(true);
    const currentTotalAlloc = beneficiaries.reduce((sum, b) => sum + Number(b.allocation_percentage || 0), 0);
    const newTotal = currentTotalAlloc + Number(nokPercent);

    if (newTotal > 100) {
      setMessage({ text: `Total allocation exceeds 100%. Currently assigned: ${currentTotalAlloc}%.`, type: 'error' });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('next_of_kin').insert([
      {
        member_id: session.user.id,
        full_name: nokName,
        relationship: nokRel,
        id_number: nokId,
        phone: nokPhone,
        allocation_percentage: Number(nokPercent),
      },
    ]);

    if (error) setMessage({ text: error.message, type: 'error' });
    else {
      logAuditAction('BENEFICIARY_ADDED', `Registered next of kin ${nokName} (${nokPercent}%)`);
      setMessage({ text: 'Beneficiary registered successfully!', type: 'success' });
      setNokName('');
      setNokId('');
      setNokPhone('');
      setNokPercent('');
      fetchBeneficiaries(session.user.id);
    }
    setLoading(false);
  };

  const handleDeleteBeneficiary = async (id) => {
    await supabase.from('next_of_kin').delete().eq('id', id);
    fetchBeneficiaries(session.user.id);
  };

  const handleMpesaTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    const receipt = mpesaCode.trim().toUpperCase() || `MP${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    await supabase.from('mpesa_transactions').insert([
      {
        member_id: session.user.id,
        phone_number: mpesaPhone || profile?.phone,
        amount: Number(mpesaAmount),
        transaction_type: mpesaType,
        mpesa_receipt_code: receipt,
        status: 'verified',
      },
    ]);

    if (mpesaType === 'savings_deposit') {
      await supabase.from('savings_ledger').insert([
        {
          member_id: session.user.id,
          amount: Number(mpesaAmount),
          transaction_type: 'monthly_contribution',
          reference_code: `MPESA-${receipt}`,
        },
      ]);
      logAuditAction('MPESA_SAVINGS_DEPOSIT', `KES ${mpesaAmount} credited via M-Pesa ${receipt}`);
      setMessage({ text: `M-Pesa payment received! KES ${Number(mpesaAmount).toLocaleString()} credited to Savings.`, type: 'success' });
    } else if (mpesaType === 'loan_repayment') {
      const { data: memberLoan } = await supabase
        .from('loans')
        .select('id, balance_remaining')
        .eq('member_id', session.user.id)
        .in('status', ['approved', 'disbursed'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (memberLoan) {
        await supabase.from('loan_repayments').insert([
          {
            loan_id: memberLoan.id,
            member_id: session.user.id,
            amount: Number(mpesaAmount),
            reference_code: `MPESA-${receipt}`,
          },
        ]);

        const newBal = Math.max(0, Number(memberLoan.balance_remaining) - Number(mpesaAmount));
        await supabase
          .from('loans')
          .update({
            balance_remaining: newBal,
            status: newBal === 0 ? 'completed' : 'approved',
          })
          .eq('id', memberLoan.id);

        logAuditAction('MPESA_LOAN_REPAYMENT', `KES ${mpesaAmount} loan repayment via M-Pesa ${receipt}`);
        setMessage({ text: `M-Pesa payment received! KES ${Number(mpesaAmount).toLocaleString()} deducted from active loan.`, type: 'success' });
      }
    }

    setMpesaAmount('');
    setMpesaCode('');
    fetchUserData(session.user.id);
    setLoading(false);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        const matchedEntries = [];

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
    if (validRows.length === 0) return;

    setLoading(true);
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

    const loanRows = validRows.filter((r) => r.loan_amount > 0 && r.active_loan_id);
    for (const r of loanRows) {
      await supabase.from('loan_repayments').insert([
        {
          loan_id: r.active_loan_id,
          member_id: r.member_id,
          amount: r.loan_amount,
          reference_code: `CHECKOFF-LOAN-${batchMonth}`,
        },
      ]);

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

    logAuditAction('PAYROLL_CHECKOFF_EXECUTED', `Batch payroll processed for ${batchMonth} (${validRows.length} members)`);
    setMessage({
      text: `Batch checkoff processed: ${savingsInserts.length} savings credits and ${loanRows.length} loan deductions applied!`,
      type: 'success',
    });
    setBatchPreview([]);
    fetchUserData(session.user.id);
    setLoading(false);
  };

  const handlePublishNotice = async (e) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;

    await supabase.from('announcements').insert([
      {
        title: newNoticeTitle,
        content: newNoticeContent,
        category: newNoticeCategory,
        posted_by: session.user.id,
      },
    ]);

    logAuditAction('ANNOUNCEMENT_POSTED', `Notice published: "${newNoticeTitle}"`);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    fetchAnnouncements();
    setMessage({ text: 'Announcement published to Member Board!', type: 'success' });
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
      doc.text(`Statement Date: ${new Date().toLocaleDateString('en-GB')}`, 145, 25);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.text('OFFICIAL MEMBER AUDIT STATEMENT', 14, 46);

      doc.setFontSize(9);
      doc.text(`Member Name: ${profile?.full_name || 'N/A'}`, 14, 54);
      doc.text(`Member No: ${profile?.member_number || 'N/A'}`, 14, 60);
      doc.text(`Branch / Company: ${profile?.companies?.name || 'KEWA'}`, 14, 66);
      doc.text(`National ID: ${profile?.id_number || 'N/A'}`, 120, 54);
      doc.text(`Total Shares/Savings: KES ${totalSavings.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 120, 60);
      doc.text(`Free Unencumbered Shares: KES ${freeSharesAvailable.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 120, 66);

      if (loan) {
        doc.setFontSize(11);
        doc.text(`Loan Product: ${(loan.loan_product || 'main_loan').replace('_', ' ').toUpperCase()}`, 14, 78);
        const loanRows = [
          ['Principal Amount', `KES ${Number(loan.principal_amount).toLocaleString()}`],
          ['Interest Rate', `${loan.interest_rate}% / month`],
          ['Repayment Duration', `${loan.repayment_period_months} Months`],
          ['Total Payable (P + I)', `KES ${Number(loan.total_payable).toLocaleString()}`],
          ['Outstanding Debt Balance', `KES ${Number(loan.balance_remaining).toLocaleString()}`],
          ['Signatory Approvals', `Chair: ${loan.chairman_approval ? 'YES' : 'NO'} | Treas: ${loan.treasurer_approval ? 'YES' : 'NO'} | Asst Chair: ${loan.assistant_chair_approval ? 'YES' : 'NO'}`],
          ['Final Status', (loan.status || 'PENDING').toUpperCase()],
        ];

        autoTable(doc, {
          startY: 83,
          head: [['Metric', 'Value']],
          body: loanRows,
          theme: 'striped',
          headStyles: { fillColor: [6, 78, 59] },
        });
      } else {
        doc.setFontSize(11);
        doc.setTextColor(6, 78, 59);
        doc.text('1. Monthly Savings & Shares Contributions', 14, 78);

        const savingsRows = savings.length > 0 ? savings.map((s) => [
          new Date(s.created_at).toLocaleDateString('en-GB'),
          (s.transaction_type || '').replace('_', ' ').toUpperCase(),
          s.reference_code || '-',
          `+KES ${Number(s.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`
        ]) : [['-', 'No contributions recorded', '-', 'KES 0.00']];

        autoTable(doc, {
          startY: 83,
          head: [['Date', 'Type', 'Batch Ref', 'Credit Amount']],
          body: savingsRows,
          theme: 'striped',
          headStyles: { fillColor: [6, 78, 59] },
        });

        const loanY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(11);
        doc.setTextColor(180, 83, 9);
        doc.text('2. Monthly Loan Repayment Deductions', 14, loanY);

        const repaymentRows = repayments.length > 0 ? repayments.map((r) => [
          new Date(r.created_at).toLocaleDateString('en-GB'),
          'LOAN REPAYMENT',
          r.reference_code || '-',
          `-KES ${Number(r.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`
        ]) : [['-', 'No repayments recorded', '-', 'KES 0.00']];

        autoTable(doc, {
          startY: loanY + 4,
          head: [['Date', 'Type', 'Batch Ref', 'Repayment Paid']],
          body: repaymentRows,
          theme: 'striped',
          headStyles: { fillColor: [180, 83, 9] },
        });
      }

      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 150;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('This is an official computer-generated statement issued by KEWA SACCO core financial system.', 14, finalY);

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
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'loans' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Loans & Products
              </button>
              <button
                onClick={() => setActiveTab('guarantors')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
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
              <button
                onClick={() => setActiveTab('beneficiaries')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'beneficiaries' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Beneficiaries & Welfare
              </button>
              <button
                onClick={() => setActiveTab('mpesa')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  activeTab === 'mpesa' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> M-Pesa Top-Up
              </button>
              {(profile?.role === 'admin' || profile?.role === 'treasurer' || profile?.role === 'chairman' || profile?.role === 'assistant_chair') && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                    activeTab === 'admin' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Leadership Hub
                </button>
              )}
            </div>

            <button
              onClick={() => supabase.auth.signOut()}
              className="hidden lg:flex items-center gap-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-700 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-emerald-400" />}
            </button>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {session && mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-2 sticky top-[57px] z-40 shadow-2xl">
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
            <Calculator className="w-4 h-4" /> Loan Products & Limits
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
          <button
            onClick={() => { setActiveTab('beneficiaries'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'beneficiaries' ? 'bg-emerald-600 text-white' : 'bg-slate-900/50 text-slate-300'
            }`}
          >
            <HeartHandshake className="w-4 h-4" /> Next of Kin & Welfare
          </button>
          <button
            onClick={() => { setActiveTab('mpesa'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'mpesa' ? 'bg-emerald-600 text-white' : 'bg-slate-900/50 text-slate-300'
            }`}
          >
            <Smartphone className="w-4 h-4" /> M-Pesa Top-Up & Repay
          </button>
          {(profile?.role === 'admin' || profile?.role === 'treasurer' || profile?.role === 'chairman' || profile?.role === 'assistant_chair') && (
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'admin' ? 'bg-amber-600 text-white' : 'bg-slate-900/50 text-amber-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> 3-Signatory Leadership Hub
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

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {message.text && (
          <div
            className={`p-4 rounded-xl text-sm font-medium border ${
              message.type === 'error'
                ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {!session ? (
          /* AUTH VIEWS (LOGIN / REGISTER / FORGOT / RESET) */
          <div className="max-w-md mx-auto mt-4 sm:mt-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {authMode === 'login' && 'Member Login'}
                {authMode === 'register' && 'Join KEWA SACCO'}
                {authMode === 'forgot' && 'Reset Password'}
                {authMode === 'reset' && 'Set New Password'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {authMode === 'login' && 'Access your cooperative portal'}
                {authMode === 'register' && 'Register your staff cooperative profile'}
                {authMode === 'forgot' && 'Receive an email link to regain access'}
                {authMode === 'reset' && 'Enter your replacement account password'}
              </p>
            </div>

            {/* FORGOT PASSWORD FORM */}
            {authMode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg text-sm transition cursor-pointer"
                >
                  {loading ? 'Sending link...' : 'Send Password Reset Link'}
                </button>
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* RECOVERY / SET NEW PASSWORD FORM */}
            {authMode === 'reset' && (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enter New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg text-sm transition cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save New Password & Sign In'}
                </button>
              </form>
            )}

            {/* LOGIN & REGISTER FORMS */}
            {(authMode === 'login' || authMode === 'register') && (
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
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>

                {authMode === 'register' && (
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="odpc"
                      required
                      checked={odpcConsent}
                      onChange={(e) => setOdpcConsent(e.target.checked)}
                      className="mt-1 accent-emerald-500 rounded"
                    />
                    <label htmlFor="odpc" className="text-[11px] text-slate-400 leading-tight">
                      I consent to KEWA SACCO collecting and processing my data in compliance with the <strong>Kenya Data Protection Act (2019)</strong>.
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg text-sm transition mt-2 cursor-pointer"
                >
                  {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Complete Registration'}
                </button>
              </form>
            )}

            <div className="text-center mt-6 text-xs text-slate-400">
              {authMode === 'login' ? (
                <>
                  New member?{' '}
                  <button onClick={() => setAuthMode('register')} className="text-emerald-400 hover:underline font-semibold cursor-pointer">
                    Register Account
                  </button>
                </>
              ) : authMode === 'register' ? (
                <>
                  Already registered?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-emerald-400 hover:underline font-semibold cursor-pointer">
                    Sign In
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ) : (
          /* AUTHENTICATED TABS */
          <>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                    {profile?.companies?.name || 'KEWA Member'}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-950 border border-amber-800 text-amber-300 uppercase">
                    Role: {profile?.role ? profile.role.replace('_', ' ') : 'Member'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">{profile?.full_name}</h2>
                <p className="text-xs text-slate-400">Member No: <span className="text-slate-200 font-medium">{profile?.member_number}</span></p>
              </div>

              <button
                onClick={() => generatePDFStatement()}
                className="flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-700/50 transition cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download PDF Statement
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-400">Total Savings & Shares</p>
                      <h3 className="text-xl font-extrabold text-white mt-1">
                        KES {totalSavings.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="bg-emerald-950/60 border border-emerald-800/40 p-3 rounded-xl text-emerald-400">
                      <PiggyBank className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-emerald-400 font-bold">Free Unencumbered Shares</p>
                      <h3 className="text-xl font-extrabold text-emerald-400 mt-1">
                        KES {freeSharesAvailable.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="bg-emerald-950/60 border border-emerald-800/40 p-3 rounded-xl text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-400">Guarantees Committed</p>
                      <h3 className="text-xl font-extrabold text-rose-400 mt-1">
                        KES {totalGuaranteesCommittedAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="bg-rose-950/60 border border-rose-800/40 p-3 rounded-xl text-rose-400">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-400">Active Loan Balance</p>
                      <h3 className="text-xl font-extrabold text-amber-400 mt-1">
                        KES {activeLoanBalance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="bg-amber-950/60 border border-amber-800/40 p-3 rounded-xl text-amber-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* NOTICE BOARD */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-base font-bold text-white">Official Notice Board & Announcements</h4>
                  </div>
                  {announcements.length === 0 ? (
                    <p className="text-xs text-slate-500">No active announcements.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {announcements.map((a) => (
                        <div key={a.id} className="bg-slate-900 border border-slate-800/80 p-3.5 rounded-xl">
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="text-sm font-bold text-emerald-300">{a.title}</h5>
                            <span className="text-[10px] text-slate-500">{new Date(a.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{a.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* DIVIDEND SIMULATOR */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h4 className="text-base font-bold text-white">Annual Dividend & Interest on Deposits Simulator</h4>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Estimate your year-end payout based on SACCO declared rates.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">
                        Interest on Savings Rate: <strong className="text-emerald-400">{interestOnDepositsRate}%</strong>
                      </label>
                      <input
                        type="range"
                        min="4"
                        max="15"
                        step="0.5"
                        value={interestOnDepositsRate}
                        onChange={(e) => setInterestOnDepositsRate(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">
                        Dividend on Share Capital: <strong className="text-emerald-400">{dividendRate}%</strong>
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="20"
                        step="0.5"
                        value={dividendRate}
                        onChange={(e) => setDividendRate(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex justify-between items-center text-xs">
                    <span className="text-slate-300">Projected Year-End Net Return:</span>
                    <span className="text-base font-bold text-emerald-300">
                      KES {((totalSavings * (interestOnDepositsRate / 100))).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* SAVINGS & REPAYMENTS DUAL LEDGERS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                      <h4 className="text-base font-bold text-white">Monthly Savings Checkoff Ledger</h4>
                    </div>

                    {savings.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-sm">No savings records found.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 uppercase">
                              <th className="pb-2">Date</th>
                              <th className="pb-2">Batch Ref</th>
                              <th className="pb-2 text-right">Credit</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                            {savings.map((s) => (
                              <tr key={s.id}>
                                <td className="py-2.5 text-slate-300">{new Date(s.created_at).toLocaleDateString()}</td>
                                <td className="py-2.5 text-slate-400 font-mono">{s.reference_code || '-'}</td>
                                <td className="py-2.5 text-right font-bold text-emerald-400">
                                  +KES {Number(s.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ArrowDownRight className="w-5 h-5 text-amber-400" />
                      <h4 className="text-base font-bold text-white">Monthly Loan Repayments Ledger</h4>
                    </div>

                    {repayments.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-sm">No loan repayments deducted yet.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 uppercase">
                              <th className="pb-2">Date</th>
                              <th className="pb-2">Batch Ref</th>
                              <th className="pb-2 text-right">Deducted</th>
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
              </div>
            )}

            {/* TAB 2: LOANS */}
            {activeTab === 'loans' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">Apply for a Loan</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => handleLoanProductChange('main_loan')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        loanProduct === 'main_loan' 
                          ? 'bg-emerald-950/70 border-emerald-500 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">1. Main Loan</span>
                      <span className="text-[10px] text-slate-400">Long-term (Up to 24 mos, 1%)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoanProductChange('emergency_loan')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        loanProduct === 'emergency_loan' 
                          ? 'bg-emerald-950/70 border-emerald-500 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">2. Emergency Loan</span>
                      <span className="text-[10px] text-slate-400">School fees & Medical (12 mos)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoanProductChange('christmas_loan')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        loanProduct === 'christmas_loan' 
                          ? 'bg-emerald-950/70 border-emerald-500 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">3. Christmas Loan</span>
                      <span className="text-[10px] text-slate-400">December festivities (Up to 6 mos)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoanProductChange('monthly_shylock')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        loanProduct === 'monthly_shylock' 
                          ? 'bg-amber-950/70 border-amber-500 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block text-amber-400">4. Monthly Shylock</span>
                      <span className="text-[10px] text-slate-400">Instant Advance (Repaid next salary)</span>
                    </button>
                  </div>

                  <form onSubmit={handleApplyLoan} className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-300">Principal Amount</label>
                        <span className="text-emerald-400 font-bold text-sm">KES {Number(loanPrincipal).toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="2000"
                        max={maxLimitForSelectedProduct}
                        step="1000"
                        value={loanPrincipal}
                        onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-300">Repayment Period</label>
                        <span className="text-emerald-400 font-bold text-sm">{loanMonths} Month(s)</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max={loanProduct === 'monthly_shylock' ? 1 : loanProduct === 'christmas_loan' ? 6 : loanProduct === 'emergency_loan' ? 12 : 24}
                        step="1"
                        value={loanMonths}
                        onChange={(e) => setLoanMonths(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                        disabled={loanProduct === 'monthly_shylock'}
                      />
                    </div>

                    {loanProduct !== 'monthly_shylock' && (
                      <div className="border-t border-slate-800 pt-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Assign Member Guarantors</h4>
                            <p className="text-[11px] text-slate-400">Pledges from Kenya Builders, Warren, or Eurocon</p>
                          </div>
                          <button
                            type="button"
                            onClick={addGuarantorRow}
                            className="flex items-center gap-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs px-2.5 py-1 rounded-lg cursor-pointer"
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
                              <label className="block text-[10px] text-slate-400 mb-1">Pledged (KES)</label>
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
                                className="self-end sm:self-center mt-1 sm:mt-5 text-rose-400 hover:text-rose-300 p-1.5 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Selected Product:</span>
                        <span className="text-white font-bold capitalize">{loanProduct.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Interest Rate:</span>
                        <span className="text-white font-medium">{interestRate}% / month</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Total Payable:</span>
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
                      Submit for 3-Signatory Authorization
                    </button>
                  </form>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-4">My Loan Applications</h3>
                  {loans.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">No active or past loans found.</div>
                  ) : (
                    <div className="space-y-4">
                      {loans.map((l) => (
                        <div key={l.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                  l.status === 'approved' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' :
                                  l.status === 'completed' ? 'bg-blue-950 border border-blue-800 text-blue-300' :
                                  l.status === 'pending' ? 'bg-amber-950 border border-amber-800 text-amber-300' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  Status: {l.status}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 capitalize border border-slate-800">
                                  {(l.loan_product || 'main_loan').replace('_', ' ')}
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-white mt-1.5">
                                KES {Number(l.principal_amount).toLocaleString()}
                              </h4>
                              <p className="text-xs text-slate-400">{l.repayment_period_months} Month(s) Term</p>
                            </div>
                            <button
                              onClick={() => generatePDFStatement(l)}
                              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" /> PDF
                            </button>
                          </div>

                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
                            <p className="text-slate-400 font-semibold mb-1">3-Signatory Approvals Status:</p>
                            <div className="grid grid-cols-3 gap-1 text-center font-mono">
                              <span className={`p-1 rounded ${l.chairman_approval ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-500'}`}>
                                Chair: {l.chairman_approval ? '✓' : 'Pending'}
                              </span>
                              <span className={`p-1 rounded ${l.treasurer_approval ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-500'}`}>
                                Treas: {l.treasurer_approval ? '✓' : 'Pending'}
                              </span>
                              <span className={`p-1 rounded ${l.assistant_chair_approval ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-500'}`}>
                                Asst: {l.assistant_chair_approval ? '✓' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: GUARANTOR DESK */}
            {activeTab === 'guarantors' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">Guarantor Requests Received</h3>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex justify-between items-center text-xs">
                    <span className="text-slate-400">Your Current Available Free Shares:</span>
                    <span className="text-emerald-400 font-bold text-sm">KES {freeSharesAvailable.toLocaleString()}</span>
                  </div>
                </div>

                {guarantorRequests.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">You have no pending guarantor requests.</div>
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
                            Pledged: KES {Number(g.amount_guaranteed).toLocaleString()} (Product: {(g.loans?.loan_product || 'main_loan').replace('_', ' ').toUpperCase()})
                          </p>
                        </div>

                        {g.status === 'pending' && (
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleRespondGuarantor(g.id, 'accepted', g.amount_guaranteed)}
                              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" /> Accept
                            </button>
                            <button
                              onClick={() => handleRespondGuarantor(g.id, 'rejected', g.amount_guaranteed)}
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

            {/* TAB 4: BENEFICIARIES & WELFARE */}
            {activeTab === 'beneficiaries' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">Nominated Beneficiaries (Next of Kin)</h3>
                  </div>

                  <form onSubmit={handleAddBeneficiary} className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={nokName}
                        onChange={(e) => setNokName(e.target.value)}
                        placeholder="e.g. Mary Atieno"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Relationship</label>
                        <select
                          value={nokRel}
                          onChange={(e) => setNokRel(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
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
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">National ID</label>
                        <input
                          type="text"
                          value={nokId}
                          onChange={(e) => setNokId(e.target.value)}
                          placeholder="ID Number"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={nokPhone}
                          onChange={(e) => setNokPhone(e.target.value)}
                          placeholder="07xxxxxxxx"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg text-xs transition cursor-pointer"
                    >
                      Save Beneficiary
                    </button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                    {beneficiaries.map((b) => (
                      <div key={b.id} className="bg-slate-900 p-3 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <h5 className="font-bold text-white">{b.full_name} ({b.relationship})</h5>
                          <p className="text-[11px] text-slate-400">Phone: {b.phone} • ID: {b.id_number || '-'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800">
                            {b.allocation_percentage}%
                          </span>
                          <button onClick={() => handleDeleteBeneficiary(b.id)} className="text-rose-400 hover:text-rose-300 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <HeartHandshake className="w-5 h-5 text-rose-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">Benevolent & Welfare Claims</h3>
                  </div>

                  <form onSubmit={handleSubmitWelfareClaim} className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Claim Category</label>
                      <select
                        value={claimType}
                        onChange={(e) => setClaimType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="hospitalization">Hospitalization / Medical Assistance</option>
                        <option value="bereavement">Bereavement Support</option>
                        <option value="disaster">Emergency Relief / Disaster</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Amount Claimed (KES)</label>
                      <input
                        type="number"
                        required
                        value={claimAmount}
                        onChange={(e) => setClaimAmount(e.target.value)}
                        placeholder="e.g. 20000"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Details & Justification</label>
                      <textarea
                        required
                        rows="2"
                        value={claimDesc}
                        onChange={(e) => setClaimDesc(e.target.value)}
                        placeholder="Provide circumstances for 3-Signatory review..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <Paperclip className="w-3.5 h-3.5 text-amber-400" /> Upload Evidence Document (PDF/Photo)
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setClaimDocument(e.target.files[0])}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:bg-rose-900/60 file:text-rose-200 cursor-pointer"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2 rounded-lg text-xs transition cursor-pointer"
                    >
                      Submit Welfare Claim for 3-Signatory Review
                    </button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                    {welfareClaims.map((c) => (
                      <div key={c.id} className="bg-slate-900 p-3 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              c.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                            }`}>
                              {c.status}
                            </span>
                            <h5 className="font-bold text-white capitalize mt-1">{c.claim_type}</h5>
                            <p className="text-[11px] text-slate-400">{c.description}</p>
                          </div>
                          <span className="font-bold text-rose-400">
                            KES {Number(c.amount_requested).toLocaleString()}
                          </span>
                        </div>

                        {c.evidence_url && (
                          <a
                            href={c.evidence_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline"
                          >
                            <FileCheck className="w-3.5 h-3.5" /> View Uploaded Evidence Document
                          </a>
                        )}

                        <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center pt-1 border-t border-slate-800/60">
                          <span className={c.chairman_approval ? 'text-emerald-400' : 'text-slate-500'}>Chair: {c.chairman_approval ? '✓' : 'Pending'}</span>
                          <span className={c.treasurer_approval ? 'text-emerald-400' : 'text-slate-500'}>Treas: {c.treasurer_approval ? '✓' : 'Pending'}</span>
                          <span className={c.assistant_chair_approval ? 'text-emerald-400' : 'text-slate-500'}>Asst: {c.assistant_chair_approval ? '✓' : 'Pending'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: M-PESA */}
            {activeTab === 'mpesa' && (
              <div className="max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 p-2.5 rounded-xl text-white">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Direct M-Pesa Payment & Top-Up</h3>
                    <p className="text-xs text-slate-400">Instant Savings Deposit or Loan Repayment via Safaricom M-Pesa</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 text-xs">
                  <p className="text-slate-300 font-semibold">Paybill Instructions:</p>
                  <p className="text-slate-400">Business No: <strong className="text-white font-mono">522522</strong> (KEWA SACCO)</p>
                  <p className="text-slate-400">Account No: <strong className="text-emerald-400 font-mono">{profile?.member_number}</strong></p>
                </div>

                <form onSubmit={handleMpesaTransaction} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Account</label>
                    <select
                      value={mpesaType}
                      onChange={(e) => setMpesaType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white"
                    >
                      <option value="savings_deposit">Voluntary Savings Top-Up</option>
                      <option value="loan_repayment">Direct Loan Repayment (Clear Balance)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">M-Pesa Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={mpesaPhone || profile?.phone || ''}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="0712345678"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (KES)</label>
                    <input
                      type="number"
                      required
                      value={mpesaAmount}
                      onChange={(e) => setMpesaAmount(e.target.value)}
                      placeholder="e.g. 3000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">M-Pesa Transaction Code (Optional for STK Push)</label>
                    <input
                      type="text"
                      value={mpesaCode}
                      onChange={(e) => setMpesaCode(e.target.value)}
                      placeholder="e.g. QGH789KL12"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white font-mono uppercase"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Confirm & Credit Account
                  </button>
                </form>
              </div>
            )}

            {/* TAB 6: 3-SIGNATORY LEADERSHIP HUB */}
            {activeTab === 'admin' && (profile?.role === 'admin' || profile?.role === 'treasurer' || profile?.role === 'chairman' || profile?.role === 'assistant_chair') && (
              <div className="space-y-6">
                <div className="bg-slate-950 border border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">Automated Dual Payroll Checkoff (Savings + Loans)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Upload monthly payroll deductions CSV (<code className="text-amber-300 font-mono">member_number, savings_amount, loan_amount</code>).
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

                {/* 3-SIGNATORY LOAN APPROVAL DESK */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">3-Signatory Loan Approvals (Chairperson, Treasurer, Assistant Chair)</h3>
                  </div>

                  {allPendingLoans.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">No loan applications awaiting signatory endorsement.</div>
                  ) : (
                    <div className="space-y-4">
                      {allPendingLoans.map((l) => (
                        <div key={l.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{l.profiles?.full_name}</h4>
                                <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800 uppercase">
                                  {(l.loan_product || 'main_loan').replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">{l.profiles?.companies?.name} • {l.profiles?.member_number}</p>
                              <p className="text-sm font-bold text-emerald-400 mt-1">
                                KES {Number(l.principal_amount).toLocaleString()} ({l.repayment_period_months} Mos Term)
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleLoanSignatoryApprove(l.id, 'chairman')}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer ${
                                  l.chairman_approval 
                                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' 
                                    : 'bg-amber-600 hover:bg-amber-500 text-white'
                                }`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> {l.chairman_approval ? '✓ Chair Signed' : 'Sign: Chairperson'}
                              </button>

                              <button
                                onClick={() => handleLoanSignatoryApprove(l.id, 'treasurer')}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer ${
                                  l.treasurer_approval 
                                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' 
                                    : 'bg-amber-600 hover:bg-amber-500 text-white'
                                }`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> {l.treasurer_approval ? '✓ Treas Signed' : 'Sign: Treasurer'}
                              </button>

                              <button
                                onClick={() => handleLoanSignatoryApprove(l.id, 'assistant_chair')}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer ${
                                  l.assistant_chair_approval 
                                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' 
                                    : 'bg-amber-600 hover:bg-amber-500 text-white'
                                }`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> {l.assistant_chair_approval ? '✓ Asst Signed' : 'Sign: Asst Chair'}
                              </button>
                            </div>
                          </div>

                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                            <p className="font-semibold text-slate-300 mb-1">Guarantor Approvals:</p>
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

                {/* 3-SIGNATORY WELFARE CLAIMS REVIEW */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <HeartHandshake className="w-5 h-5 text-rose-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">3-Signatory Welfare & Benevolent Claims</h3>
                  </div>

                  {allPendingClaims.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">No pending benevolent claims.</div>
                  ) : (
                    <div className="space-y-4">
                      {allPendingClaims.map((c) => (
                        <div key={c.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div>
                              <h5 className="font-bold text-white text-sm">{c.profiles?.full_name}</h5>
                              <p className="text-slate-400 capitalize">{c.claim_type}: {c.description}</p>
                              <p className="font-bold text-rose-400 text-sm mt-1">KES {Number(c.amount_requested).toLocaleString()}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleWelfareSignatoryApprove(c.id, 'chairman')}
                                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                                  c.chairman_approval ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' : 'bg-rose-900 hover:bg-rose-800 text-white'
                                }`}
                              >
                                {c.chairman_approval ? '✓ Chair Signed' : 'Sign: Chairperson'}
                              </button>

                              <button
                                onClick={() => handleWelfareSignatoryApprove(c.id, 'treasurer')}
                                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                                  c.treasurer_approval ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' : 'bg-rose-900 hover:bg-rose-800 text-white'
                                }`}
                              >
                                {c.treasurer_approval ? '✓ Treas Signed' : 'Sign: Treasurer'}
                              </button>

                              <button
                                onClick={() => handleWelfareSignatoryApprove(c.id, 'assistant_chair')}
                                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                                  c.assistant_chair_approval ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' : 'bg-rose-900 hover:bg-rose-800 text-white'
                                }`}
                              >
                                {c.assistant_chair_approval ? '✓ Asst Signed' : 'Sign: Asst Chair'}
                              </button>
                            </div>
                          </div>

                          {c.evidence_url && (
                            <div className="pt-2 border-t border-slate-800">
                              <a
                                href={c.evidence_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline font-semibold"
                              >
                                <Paperclip className="w-3.5 h-3.5" /> Inspect Uploaded Evidence Attachment
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* POST NOTICES & AUDIT LOGS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Bell className="w-5 h-5 text-amber-400" />
                      <h4 className="text-base font-bold text-white">Post Announcement to Member Board</h4>
                    </div>

                    <form onSubmit={handlePublishNotice} className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Announcement Title</label>
                        <input
                          type="text"
                          required
                          value={newNoticeTitle}
                          onChange={(e) => setNewNoticeTitle(e.target.value)}
                          placeholder="e.g. December Loan Applications Open"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Notice Body Content</label>
                        <textarea
                          required
                          rows="3"
                          value={newNoticeContent}
                          onChange={(e) => setNewNoticeContent(e.target.value)}
                          placeholder="Write message to all members..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 rounded-lg text-xs transition cursor-pointer"
                      >
                        Publish Notice
                      </button>
                    </form>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <History className="w-5 h-5 text-amber-400" />
                      <h4 className="text-base font-bold text-white">Immutable Audit Trail (SASRA Standard)</h4>
                    </div>

                    <div className="max-h-56 overflow-y-auto border border-slate-800 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 sticky top-0">
                          <tr>
                            <th className="p-2">Time</th>
                            <th className="p-2">Action</th>
                            <th className="p-2">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                          {auditLogs.map((log) => (
                            <tr key={log.id}>
                              <td className="p-2 text-slate-400">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                              <td className="p-2 text-emerald-400 font-bold">{log.action}</td>
                              <td className="p-2 text-slate-300">{log.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      {session && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur border-t border-slate-800 flex justify-around items-center py-2 px-1 z-50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center gap-1 text-[9px] font-semibold py-1 px-2 transition ${
              activeTab === 'overview' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <PiggyBank className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('loans')}
            className={`flex flex-col items-center gap-1 text-[9px] font-semibold py-1 px-2 transition ${
              activeTab === 'loans' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Loans</span>
          </button>

          <button
            onClick={() => setActiveTab('guarantors')}
            className={`flex flex-col items-center gap-1 text-[9px] font-semibold py-1 px-2 relative transition ${
              activeTab === 'guarantors' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Guarantors</span>
            {pendingGuaranteesCount > 0 && (
              <span className="absolute top-0 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('beneficiaries')}
            className={`flex flex-col items-center gap-1 text-[9px] font-semibold py-1 px-2 transition ${
              activeTab === 'beneficiaries' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Welfare</span>
          </button>

          <button
            onClick={() => setActiveTab('mpesa')}
            className={`flex flex-col items-center gap-1 text-[9px] font-semibold py-1 px-2 transition ${
              activeTab === 'mpesa' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>M-Pesa</span>
          </button>

          {(profile?.role === 'admin' || profile?.role === 'treasurer' || profile?.role === 'chairman' || profile?.role === 'assistant_chair') && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center gap-1 text-[9px] font-semibold py-1 px-2 transition ${
                activeTab === 'admin' ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Signatories</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}