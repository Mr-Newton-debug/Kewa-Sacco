import React, { useState, useEffect, useRef } from 'react';
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
  Award, ShieldAlert, FileText, Send, History, CheckSquare, Paperclip, FileCheck, HelpCircle,
  Eye, EyeOff, FolderDown, FileArchive, Shield, Lock, RotateCcw, AlertTriangle, Sparkles, Search,
  MessageSquare, MessageCircle, Bot, Mail, CornerDownRight, Check, UserCheck, AlertOctagon
} from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
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
  const [saccoDocs, setSaccoDocs] = useState([]);
  const [welfareClaims, setWelfareClaims] = useState([]);
  const [allPendingLoans, setAllPendingLoans] = useState([]);
  const [allLoansLeadership, setAllLoansLeadership] = useState([]);
  const [allPendingClaims, setAllPendingClaims] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Manual Member Adjustment Form State (Leadership Desk)
  const [manualTargetMemberId, setManualTargetMemberId] = useState('');
  const [manualAdjustmentType, setManualAdjustmentType] = useState('savings_deposit'); // savings_deposit or loan_repayment
  const [manualAmount, setManualAmount] = useState('');
  const [manualRefCode, setManualRefCode] = useState('');
  const [manualMemberSearch, setManualMemberSearch] = useState('');

  // Support & Chatbot State
  const [inquiries, setInquiries] = useState([]);
  const [allAdminInquiries, setAllAdminInquiries] = useState([]);
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState('loan_inquiry');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [adminReplyText, setAdminReplyText] = useState({});
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Jambo! I am the KEWA SACCO Virtual Assistant. How can I assist you with your cooperative account today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // Loan Application State
  const [loanProduct, setLoanProduct] = useState('main_loan');
  const [loanPrincipal, setLoanPrincipal] = useState(20000);
  const [loanMonths, setLoanMonths] = useState(12);
  const [interestRate, setInterestRate] = useState(1.0);
  const [guarantorList, setGuarantorList] = useState([
    { guarantorId: '', searchTerm: '', amount: '', eligible: true, note: '', dropdownOpen: false }
  ]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Document Upload Form State
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('audit_report');
  const [docYear, setDocYear] = useState('2025/2026');
  const [docFile, setDocFile] = useState(null);

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

  // Admin Hub Batch State
  const [batchPreview, setBatchPreview] = useState([]);
  const [batchMonth, setBatchMonth] = useState('AUG-2026');
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('general');

  // Explicit Secure Logout & Input Sanitizer
  const handlePerformSignOut = async (timeoutReason = false) => {
    setEmail('');
    setPassword('');
    setNewPassword('');
    setProfile(null);
    setSavings([]);
    setLoans([]);
    setRepayments([]);
    setBeneficiaries([]);
    setAuditLogs([]);
    setInquiries([]);
    setMobileMenuOpen(false);
    
    await supabase.auth.signOut();

    if (timeoutReason) {
      setMessage({
        text: 'You were signed out automatically due to 5 minutes of inactivity for your account security.',
        type: 'error'
      });
    }
  };

  // 5-Minute Inactivity Timer
  useEffect(() => {
    if (!session) return;

    let timeoutId;
    const INACTIVITY_LIMIT_MS = 5 * 60 * 1000;

    const resetInactivityTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        logAuditAction('AUTO_TIMEOUT_LOGOUT', 'User logged out automatically due to 5 minutes of inactivity');
        await handlePerformSignOut(true);
      }, INACTIVITY_LIMIT_MS);
    };

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetInactivityTimer));

    resetInactivityTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetInactivityTimer));
    };
  }, [session]);

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
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setEmail('');
        setPassword('');
        setNewPassword('');
        setProfile(null);
        setSavings([]);
        setLoans([]);
        setRepayments([]);
        setBeneficiaries([]);
        setAuditLogs([]);
        setInquiries([]);
      }
    });

    fetchCompanies();
    fetchAnnouncements();
    fetchSaccoDocuments();
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTab === 'documents') {
      fetchSaccoDocuments();
    } else if (activeTab === 'support' && session) {
      fetchMemberInquiries(session.user.id);
    } else if (activeTab === 'admin' && session) {
      fetchAdminData();
    }
  }, [activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

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
      console.warn('Audit write skipped:', e);
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

  const fetchSaccoDocuments = async () => {
    const { data } = await supabase
      .from('sacco_documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setSaccoDocs(data);
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
      fetchMemberInquiries(userId);
      if (['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(profileData.role)) {
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
      .select('*, loans(principal_amount, loan_product)')
      .eq('member_id', userId)
      .order('created_at', { ascending: false });
    if (repaymentData) setRepayments(repaymentData);

    setLoading(false);
  };

  const fetchMemberInquiries = async (userId) => {
    const { data } = await supabase
      .from('member_inquiries')
      .select('*')
      .eq('member_id', userId)
      .order('created_at', { ascending: false });
    if (data) setInquiries(data);
  };

  const fetchAllMembers = async (currentUserId) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, member_number, id_number, phone, role, created_at, companies(name)')
      .order('full_name', { ascending: true });
    if (data) {
      setAllMembers(data);
      if (!manualTargetMemberId && data.length > 0) {
        setManualTargetMemberId(data[0].id);
      }
    }
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
    const { data: members } = await supabase.from('profiles').select('*, companies(name)').order('full_name', { ascending: true });
    if (members) setAllMembers(members);

    const { data: pendingLoans } = await supabase
      .from('loans')
      .select('*, profiles(full_name, member_number, companies(name)), loan_guarantors(*, profiles:guarantor_id(full_name, member_number))')
      .in('status', ['pending', 'guaranteed']);
    if (pendingLoans) setAllPendingLoans(pendingLoans);

    // Fetch All Disbursed & Approved Loans for the Performance Matrix
    const { data: allLeadershipLoans } = await supabase
      .from('loans')
      .select('*, profiles(full_name, member_number, phone, companies(name))')
      .order('created_at', { ascending: false });
    if (allLeadershipLoans) setAllLoansLeadership(allLeadershipLoans);

    const { data: claims } = await supabase
      .from('welfare_claims')
      .select('*, profiles(full_name, member_number, companies(name))')
      .eq('status', 'pending');
    if (claims) setAllPendingClaims(claims);

    const { data: allTickets } = await supabase
      .from('member_inquiries')
      .select('*, profiles:member_id(full_name, member_number, phone, companies(name))')
      .order('created_at', { ascending: false });
    if (allTickets) setAllAdminInquiries(allTickets);

    const { data: logs } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);
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

    if (error) setMessage({ text: error.message, type: 'error' });
    else setMessage({ text: 'Password reset link sent to your inbox.', type: 'success' });
    setLoading(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage({ text: error.message, type: 'error' });
    else {
      setMessage({ text: 'Password updated! Please sign in.', type: 'success' });
      setAuthMode('login');
      setNewPassword('');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!odpcConsent) {
      setMessage({ text: 'Please accept the Data Protection Act (ODPC) privacy terms.', type: 'error' });
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
        logAuditAction('REGISTER_ACCOUNT', `New member profile: ${fullName} (${memberNumber})`, authData.user.id, fullName);
        setMessage({ text: 'Account created successfully!', type: 'success' });
      }
    }
    setLoading(false);
  };

  // --- OFFICIAL MANUAL ADJUSTMENT HANDLER ---
  const handleManualMemberAdjustment = async (e) => {
    e.preventDefault();
    if (!manualTargetMemberId || !manualAmount || Number(manualAmount) <= 0) {
      setMessage({ text: 'Please select a member and enter a valid positive amount.', type: 'error' });
      return;
    }

    setLoading(true);
    const targetMember = allMembers.find((m) => m.id === manualTargetMemberId);
    const refCode = manualRefCode.trim().toUpperCase() || `MANUAL-${Date.now().toString().slice(-6)}`;

    if (manualAdjustmentType === 'savings_deposit') {
      const { error } = await supabase.from('savings_ledger').insert([
        {
          member_id: manualTargetMemberId,
          amount: Number(manualAmount),
          transaction_type: 'monthly_contribution',
          reference_code: refCode,
        },
      ]);

      if (!error) {
        logAuditAction('MANUAL_SAVINGS_CREDIT', `Official posted KES ${Number(manualAmount).toLocaleString()} to ${targetMember?.full_name} (${refCode})`);
        setMessage({ text: `Success! KES ${Number(manualAmount).toLocaleString()} credited to ${targetMember?.full_name}'s Savings.`, type: 'success' });
        setManualAmount('');
        setManualRefCode('');
      } else {
        setMessage({ text: error.message, type: 'error' });
      }
    } else if (manualAdjustmentType === 'loan_repayment') {
      const { data: memberLoan } = await supabase
        .from('loans')
        .select('id, balance_remaining')
        .eq('member_id', manualTargetMemberId)
        .in('status', ['approved', 'disbursed'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!memberLoan) {
        setMessage({ text: `Selected member (${targetMember?.full_name}) currently has no active running loan to repay.`, type: 'error' });
        setLoading(false);
        return;
      }

      await supabase.from('loan_repayments').insert([
        {
          loan_id: memberLoan.id,
          member_id: manualTargetMemberId,
          amount: Number(manualAmount),
          reference_code: refCode,
        },
      ]);

      const newBal = Math.max(0, Number(memberLoan.balance_remaining) - Number(manualAmount));
      await supabase
        .from('loans')
        .update({
          balance_remaining: newBal,
          status: newBal === 0 ? 'completed' : 'approved',
        })
        .eq('id', memberLoan.id);

      logAuditAction('MANUAL_LOAN_REPAYMENT', `Official deducted KES ${Number(manualAmount).toLocaleString()} for ${targetMember?.full_name} (${refCode})`);
      setMessage({ text: `Success! KES ${Number(manualAmount).toLocaleString()} applied to ${targetMember?.full_name}'s active loan. New Balance: KES ${newBal.toLocaleString()}`, type: 'success' });
      setManualAmount('');
      setManualRefCode('');
    }

    fetchAdminData();
    fetchUserData(session.user.id);
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

  // Searchable Guarantor Autocomplete
  const selectGuarantorFromSearch = async (index, member) => {
    const updated = [...guarantorList];
    updated[index].guarantorId = member.id;
    updated[index].searchTerm = `${member.full_name} (${member.member_number}) - ${member.companies?.name || 'External'}`;
    updated[index].dropdownOpen = false;
    setGuarantorList(updated);

    await checkBlindGuarantorEligibility(index, member.id, updated[index].amount);
  };

  const checkBlindGuarantorEligibility = async (index, memberId, currentPledgeAmount = null) => {
    const updated = [...guarantorList];
    const pledgeToEvaluate = currentPledgeAmount !== null ? Number(currentPledgeAmount) : Number(updated[index].amount || 0);

    if (!memberId) {
      updated[index].eligible = true;
      updated[index].note = '';
      setGuarantorList(updated);
      return;
    }

    const { data: memberSavings } = await supabase.from('savings_ledger').select('amount').eq('member_id', memberId);
    const { data: memberLoans } = await supabase.from('loans').select('balance_remaining').eq('member_id', memberId).in('status', ['approved', 'disbursed']);
    const { data: memberGuarantees } = await supabase.from('loan_guarantors').select('amount_guaranteed, loans(status)').eq('guarantor_id', memberId).eq('status', 'accepted');

    const totSav = (memberSavings || []).reduce((sum, s) => sum + Number(s.amount || 0), 0);
    const totLoan = (memberLoans || []).reduce((sum, l) => sum + Number(l.balance_remaining || 0), 0);
    const totGuar = (memberGuarantees || [])
      .filter((g) => g.loans?.status === 'approved' || g.loans?.status === 'disbursed')
      .reduce((sum, g) => sum + Number(g.amount_guaranteed || 0), 0);

    const calculatedFreeShares = Math.max(0, totSav - totLoan - totGuar);

    let isEligible = true;
    let noteMsg = '';

    if (calculatedFreeShares <= 0) {
      isEligible = false;
      noteMsg = '⚠️ Ineligible: Colleague currently has no unencumbered Free Shares available.';
    } else if (pledgeToEvaluate > 0 && pledgeToEvaluate > calculatedFreeShares) {
      isEligible = false;
      noteMsg = '⚠️ Insufficient Free Shares: Colleague cannot cover this requested pledge amount.';
    } else if (pledgeToEvaluate > 0 && pledgeToEvaluate <= calculatedFreeShares) {
      isEligible = true;
      noteMsg = '✓ Eligible: Colleague has sufficient Free Shares for this pledge amount.';
    } else {
      isEligible = true;
      noteMsg = '✓ Colleague eligible to guarantee.';
    }

    updated[index].eligible = isEligible;
    updated[index].note = noteMsg;
    setGuarantorList(updated);
  };

  const addGuarantorRow = () => {
    setGuarantorList([...guarantorList, { guarantorId: '', searchTerm: '', amount: '', eligible: true, note: '', dropdownOpen: false }]);
  };

  const removeGuarantorRow = (index) => {
    const updated = guarantorList.filter((_, i) => i !== index);
    setGuarantorList(updated.length > 0 ? updated : [{ guarantorId: '', searchTerm: '', amount: '', eligible: true, note: '', dropdownOpen: false }]);
  };

  const updateGuarantorRow = (index, field, value) => {
    const updated = [...guarantorList];
    updated[index][field] = value;
    setGuarantorList(updated);

    if (field === 'amount' && updated[index].guarantorId) {
      checkBlindGuarantorEligibility(index, updated[index].guarantorId, value);
    }
  };

  const handleInitiateLoan = (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (loanPrincipal > maxLimitForSelectedProduct) {
      setMessage({ text: `Loan exceeds maximum limit of KES ${maxLimitForSelectedProduct.toLocaleString()}.`, type: 'error' });
      return;
    }

    if (loanProduct !== 'monthly_shylock') {
      const validGuarantors = guarantorList.filter((g) => g.guarantorId && Number(g.amount) > 0);
      if (validGuarantors.length === 0) {
        setMessage({ text: 'Please assign at least 1 guarantor for this loan product.', type: 'error' });
        return;
      }

      for (const g of validGuarantors) {
        if (!g.eligible) {
          setMessage({
            text: `Guarantor verification error: A selected colleague does not have sufficient unencumbered savings for this pledge.`,
            type: 'error',
          });
          return;
        }
      }
    }

    setTermsAgreed(false);
    setShowTermsModal(true);
  };

  const handleConfirmLoanSubmission = async () => {
    if (!termsAgreed) {
      alert('Please check the box agreeing to the KEWA SACCO Loan Terms & Conditions.');
      return;
    }

    setShowTermsModal(false);
    setLoading(true);

    const validGuarantors = guarantorList.filter((g) => g.guarantorId && Number(g.amount) > 0);

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
        assistant_chair_approval: false,
        chairman_approval: false,
        treasurer_approval: false,
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

    logAuditAction('LOAN_APPLICATION_SUBMITTED', `${loanProduct.toUpperCase()} applied: KES ${loanPrincipal.toLocaleString()} (Terms Accepted)`);

    setMessage({ text: `Loan submitted! Pipeline: 1. Assistant Chair -> 2. Chairman -> 3. Treasurer.`, type: 'success' });
    setGuarantorList([{ guarantorId: '', searchTerm: '', amount: '', eligible: true, note: '', dropdownOpen: false }]);
    fetchUserData(session.user.id);
    setLoading(false);
  };

  const handleSignatoryPipeline = async (loanId, targetRole, action = 'sign') => {
    const isSign = action === 'sign';

    if (profile?.role !== targetRole && profile?.role !== 'admin') {
      alert(`Access Denied: Only the verified ${targetRole.replace('_', ' ').toUpperCase()} can perform this action.`);
      return;
    }

    const { data: currentLoan } = await supabase.from('loans').select('*').eq('id', loanId).single();
    const updatePayload = {};

    if (targetRole === 'assistant_chair') {
      updatePayload.assistant_chair_approval = isSign;
      if (!isSign) {
        updatePayload.chairman_approval = false;
        updatePayload.treasurer_approval = false;
        updatePayload.status = 'pending';
      }
    } else if (targetRole === 'chairman') {
      if (isSign && !currentLoan.assistant_chair_approval) {
        alert('Sequential Gate Locked: Assistant Chair must review and sign first.');
        return;
      }
      updatePayload.chairman_approval = isSign;
      if (!isSign) {
        updatePayload.treasurer_approval = false;
        updatePayload.status = 'pending';
      }
    } else if (targetRole === 'treasurer') {
      if (isSign && (!currentLoan.assistant_chair_approval || !currentLoan.chairman_approval)) {
        alert('Sequential Gate Locked: Assistant Chair and Chairman must sign before Treasurer disbursement.');
        return;
      }
      updatePayload.treasurer_approval = isSign;
      updatePayload.status = isSign ? 'approved' : 'pending';
    }

    await supabase.from('loans').update(updatePayload).eq('id', loanId);
    logAuditAction(
      isSign ? 'SIGNATORY_SIGNED' : 'SIGNATORY_REVOKED',
      `${targetRole.replace('_', ' ').toUpperCase()} ${isSign ? 'endorsed' : 'revoked sign-off for'} Loan #${loanId.slice(0, 8)}`
    );

    fetchAdminData();
    fetchUserData(session.user.id);
    setMessage({
      text: `${targetRole.replace('_', ' ').toUpperCase()} ${isSign ? 'signed successfully.' : 'signature revoked and subsequent gates re-locked.'}`,
      type: 'success',
    });
  };

  const handleWelfarePipeline = async (claimId, targetRole, action = 'sign') => {
    const isSign = action === 'sign';

    if (profile?.role !== targetRole && profile?.role !== 'admin') {
      alert(`Access Denied: Only the verified ${targetRole.replace('_', ' ').toUpperCase()} can perform this action.`);
      return;
    }

    const { data: currentClaim } = await supabase.from('welfare_claims').select('*').eq('id', claimId).single();
    const updatePayload = {};

    if (targetRole === 'assistant_chair') {
      updatePayload.assistant_chair_approval = isSign;
      if (!isSign) {
        updatePayload.chairman_approval = false;
        updatePayload.treasurer_approval = false;
        updatePayload.status = 'pending';
      }
    } else if (targetRole === 'chairman') {
      if (isSign && !currentClaim.assistant_chair_approval) {
        alert('Sequential Gate Locked: Assistant Chair must inspect claim evidence first.');
        return;
      }
      updatePayload.chairman_approval = isSign;
      if (!isSign) {
        updatePayload.treasurer_approval = false;
        updatePayload.status = 'pending';
      }
    } else if (targetRole === 'treasurer') {
      if (isSign && (!currentClaim.assistant_chair_approval || !currentClaim.chairman_approval)) {
        alert('Sequential Gate Locked: Assistant Chair and Chairman must sign before final welfare disbursement.');
        return;
      }
      updatePayload.treasurer_approval = isSign;
      updatePayload.status = isSign ? 'approved' : 'pending';
    }

    await supabase.from('welfare_claims').update(updatePayload).eq('id', claimId);
    logAuditAction(
      isSign ? 'WELFARE_SIGNED' : 'WELFARE_REVOKED',
      `Benevolence ${isSign ? 'endorsed' : 'revoked'} by ${targetRole.replace('_', ' ').toUpperCase()} for Claim #${claimId.slice(0, 8)}`
    );

    fetchAdminData();
    fetchUserData(session.user.id);
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
        assistant_chair_approval: false,
        chairman_approval: false,
        treasurer_approval: false,
      },
    ]);

    if (error) setMessage({ text: error.message, type: 'error' });
    else {
      logAuditAction('WELFARE_CLAIM_FILED', `Welfare claim for KES ${claimAmount} (${claimType})`);
      setMessage({ text: 'Welfare claim submitted for Sequential 3-Signatory review.', type: 'success' });
      setClaimAmount('');
      setClaimDesc('');
      setClaimDocument(null);
      fetchWelfareClaims(session.user.id);
    }
    setLoading(false);
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

  // Support Tickets Handler
  const handleCreateInquiry = async (e) => {
    e.preventDefault();
    if (!inquirySubject || !inquiryMessage) return;

    setLoading(true);
    const { error } = await supabase.from('member_inquiries').insert([
      {
        member_id: session.user.id,
        subject: inquirySubject,
        category: inquiryCategory,
        message: inquiryMessage,
        status: 'pending',
      },
    ]);

    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      logAuditAction('SUPPORT_INQUIRY_CREATED', `Ticket submitted: "${inquirySubject}"`);
      setMessage({ text: 'Inquiry submitted! SACCO Leadership has been notified.', type: 'success' });
      setInquirySubject('');
      setInquiryMessage('');
      fetchMemberInquiries(session.user.id);
    }
    setLoading(false);
  };

  const handleAdminReplyInquiry = async (inquiryId) => {
    const reply = adminReplyText[inquiryId];
    if (!reply) return;

    await supabase.from('member_inquiries').update({
      admin_response: reply,
      status: 'resolved',
      responded_by: session.user.id,
      updated_at: new Date().toISOString(),
    }).eq('id', inquiryId);

    logAuditAction('SUPPORT_INQUIRY_RESOLVED', `Replied to Ticket #${inquiryId.slice(0, 8)}`);
    fetchAdminData();
    setMessage({ text: 'Response published to member ticket!', type: 'success' });
  };

  // Bot Engine
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const lower = userText.toLowerCase();
    const newChat = [...chatMessages, { sender: 'user', text: userText }];

    let botReply = "I am trained on KEWA SACCO By-Laws & Credit Policies. You can ask about 'loans', 'free shares', 'guarantors', 'interest rates', 'dividends', or submit a ticket to the committee below!";

    if (lower.includes('loan') || lower.includes('apply') || lower.includes('borrow')) {
      botReply = `You can apply for 4 tailored products: 1. Main Loan (Up to 24 mos, 1% rate, 3X savings), 2. Emergency Loan (12 mos, 1%), 3. Christmas Loan (6 mos, 1%), and 4. Monthly Shylock (1 mo, 5% fee). Your maximum limit right now is KES ${maxLimitForSelectedProduct.toLocaleString()}.`;
    } else if (lower.includes('free share') || lower.includes('shares') || lower.includes('pledge') || lower.includes('guarant')) {
      botReply = `Your available Free Shares are currently KES ${freeSharesAvailable.toLocaleString()}. This represents your Total Savings (KES ${totalSavings.toLocaleString()}) minus Active Debt (KES ${activeLoanBalance.toLocaleString()}) and running guarantee pledges (KES ${totalGuaranteesCommittedAmount.toLocaleString()}).`;
    } else if (lower.includes('sign') || lower.includes('approval') || lower.includes('signator')) {
      botReply = "All loans and welfare claims follow a strict 3-Signatory sequential pipeline: 1. Assistant Chair -> 2. Chairman -> 3. Treasurer. Funds disburse only after all 3 approve!";
    } else if (lower.includes('welfare') || lower.includes('death') || lower.includes('medical') || lower.includes('bereave')) {
      botReply = "KEWA Benevolent Fund covers: Member Bereavement (KES 50,000), Spouse/Child (KES 30,000), Parent (KES 20,000), and Inpatient Hospitalization >3 days (Up to KES 25,000). Upload burial permits or discharge summaries in the Welfare tab!";
    } else if (lower.includes('mpesa') || lower.includes('paybill') || lower.includes('deposit')) {
      botReply = `Use Paybill Business No: 522522, Account No: ${profile?.member_number || 'Your Member No'}. You can top-up voluntary savings or make direct loan amortizations instantly in the M-Pesa tab!`;
    } else if (lower.includes('dividend') || lower.includes('rate') || lower.includes('interest')) {
      botReply = "Dividends on share capital and interest on savings deposits are declared annually by the Board at the AGM. You can use our live Dividend Simulator on the Overview tab to project your year-end payout!";
    } else if (lower.includes('contact') || lower.includes('official') || lower.includes('chairman') || lower.includes('treasurer')) {
      botReply = "You can chat directly with the Chairperson, Treasurer, or Assistant Chair via the WhatsApp buttons in the 'Help & Inquiries' tab, or submit an internal support ticket!";
    }

    newChat.push({ sender: 'bot', text: botReply });
    setChatMessages(newChat);
    setChatInput('');
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
      setMessage({ text: `Payment verified! KES ${Number(mpesaAmount).toLocaleString()} credited to Savings.`, type: 'success' });
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
        setMessage({ text: `Payment verified! KES ${Number(mpesaAmount).toLocaleString()} deducted from active loan.`, type: 'success' });
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

  const handleUploadSaccoDocument = async (e) => {
    e.preventDefault();
    if (!docFile) {
      setMessage({ text: 'Please select a PDF document to upload.', type: 'error' });
      return;
    }

    setLoading(true);
    const fileExt = docFile.name.split('.').pop();
    const fileName = `doc-${Date.now()}.${fileExt}`;
    const fileSizeMB = (docFile.size / (1024 * 1024)).toFixed(2) + ' MB';

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('sacco-documents')
      .upload(fileName, docFile);

    if (uploadError) {
      setMessage({ text: uploadError.message, type: 'error' });
      setLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('sacco-documents')
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase.from('sacco_documents').insert([
      {
        title: docTitle,
        category: docCategory,
        financial_year: docYear,
        file_url: publicUrl,
        file_size: fileSizeMB,
        uploaded_by: session.user.id,
      },
    ]);

    if (dbError) {
      setMessage({ text: dbError.message, type: 'error' });
    } else {
      logAuditAction('SACCO_DOCUMENT_UPLOADED', `Uploaded report: ${docTitle} (${docYear})`);
      setMessage({ text: 'Official report published to Member Library!', type: 'success' });
      setDocTitle('');
      setDocFile(null);
      fetchSaccoDocuments();
    }
    setLoading(false);
  };

  const handleDeleteSaccoDocument = async (id, title) => {
    await supabase.from('sacco_documents').delete().eq('id', id);
    logAuditAction('SACCO_DOCUMENT_DELETED', `Deleted document: ${title}`);
    fetchSaccoDocuments();
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

  // PDF Generator
  const generatePDFStatement = (loan = null) => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(6, 78, 59);
      doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('KEWA SACCO SOCIETY LIMITED', 14, 18);
      doc.setFontSize(9);
      doc.text('Kenya Builders & Concrete • Warren Concrete • Eurocon Tiles • External', 14, 25);
      doc.text(`Statement Date: ${new Date().toLocaleDateString('en-GB')}`, 145, 25);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.text('OFFICIAL MEMBER AUDIT STATEMENT', 14, 46);

      doc.setFontSize(9);
      doc.text(`Member Name: ${profile?.full_name || 'N/A'}`, 14, 54);
      doc.text(`Member No: ${profile?.member_number || 'N/A'}`, 14, 60);
      doc.text(`Branch / Company: ${profile?.companies?.name || 'KEWA Sacco'}`, 14, 66);
      doc.text(`National ID: ${profile?.id_number || 'N/A'}`, 120, 54);
      doc.text(`Total Shares/Savings: KES ${totalSavings.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 120, 60);
      doc.text(`Guarantees Committed: KES ${totalGuaranteesCommittedAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 120, 66);
      doc.text(`Free Unencumbered Shares: KES ${freeSharesAvailable.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 120, 72);

      if (loan) {
        doc.setFontSize(11);
        doc.text(`LOAN PROGRESS: ${(loan.loan_product || 'main_loan').replace('_', ' ').toUpperCase()}`, 14, 82);
        
        const totalPaidToDate = Math.max(0, Number(loan.total_payable || 0) - Number(loan.balance_remaining || 0));
        const progressPercentage = loan.total_payable > 0 ? ((totalPaidToDate / loan.total_payable) * 100).toFixed(1) : '0';

        const loanSummaryRows = [
          ['Principal Borrowed', `KES ${Number(loan.principal_amount).toLocaleString()}`],
          ['Interest Rate & Term', `${loan.interest_rate}% / mo (${loan.repayment_period_months} Mos)`],
          ['Total Payable (P + I)', `KES ${Number(loan.total_payable).toLocaleString()}`],
          ['Total Amount Paid to Date', `KES ${totalPaidToDate.toLocaleString()} (${progressPercentage}% Repaid)`],
          ['Outstanding Debt Balance', `KES ${Number(loan.balance_remaining).toLocaleString()}`],
          ['Sequential Signatories', `1. Asst Chair: ${loan.assistant_chair_approval ? 'SIGNED' : 'PENDING'} | 2. Chair: ${loan.chairman_approval ? 'SIGNED' : 'PENDING'} | 3. Treasurer: ${loan.treasurer_approval ? 'SIGNED' : 'PENDING'}`],
          ['Current Status', (loan.status || 'PENDING').toUpperCase()],
        ];

        autoTable(doc, {
          startY: 87,
          head: [['Metric', 'Financial Details']],
          body: loanSummaryRows,
          theme: 'striped',
          headStyles: { fillColor: [6, 78, 59] },
        });

        const loanRepaymentsForThis = repayments.filter((r) => r.loan_id === loan.id);
        const repY = doc.lastAutoTable.finalY + 8;
        doc.setFontSize(11);
        doc.setTextColor(180, 83, 9);
        doc.text('Specific Amortization History for this Facility', 14, repY);

        const repRows = loanRepaymentsForThis.length > 0 ? loanRepaymentsForThis.map((r) => [
          new Date(r.created_at).toLocaleDateString('en-GB'),
          'MONTHLY LOAN CHECKOFF',
          r.reference_code || '-',
          `-KES ${Number(r.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`
        ]) : [['-', 'No deductions applied yet', '-', 'KES 0.00']];

        autoTable(doc, {
          startY: repY + 4,
          head: [['Payment Date', 'Deduction Type', 'Batch Reference', 'Amount Paid']],
          body: repRows,
          theme: 'striped',
          headStyles: { fillColor: [180, 83, 9] },
        });

      } else {
        doc.setFontSize(11);
        doc.setTextColor(6, 78, 59);
        doc.text('1. Monthly Savings & Shares Contributions Ledger', 14, 82);

        const savingsRows = savings.length > 0 ? savings.map((s) => [
          new Date(s.created_at).toLocaleDateString('en-GB'),
          (s.transaction_type || '').replace('_', ' ').toUpperCase(),
          s.reference_code || '-',
          `+KES ${Number(s.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`
        ]) : [['-', 'No contributions recorded', '-', 'KES 0.00']];

        autoTable(doc, {
          startY: 87,
          head: [['Credit Date', 'Transaction Type', 'Batch Ref', 'Credit Amount']],
          body: savingsRows,
          theme: 'striped',
          headStyles: { fillColor: [6, 78, 59] },
        });

        const loanY = doc.lastAutoTable.finalY + 8;
        doc.setFontSize(11);
        doc.setTextColor(180, 83, 9);
        doc.text('2. Monthly Loan Repayments & Deductions Ledger', 14, loanY);

        const repaymentRows = repayments.length > 0 ? repayments.map((r) => [
          new Date(r.created_at).toLocaleDateString('en-GB'),
          (r.loans?.loan_product || 'LOAN').replace('_', ' ').toUpperCase(),
          r.reference_code || '-',
          `-KES ${Number(r.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`
        ]) : [['-', 'No repayments recorded', '-', 'KES 0.00']];

        autoTable(doc, {
          startY: loanY + 4,
          head: [['Deduction Date', 'Loan Facility', 'Batch Ref', 'Amount Deducted']],
          body: repaymentRows,
          theme: 'striped',
          headStyles: { fillColor: [180, 83, 9] },
        });
      }

      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 150;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('This is an official computer-generated statement issued by KEWA SACCO core financial system.', 14, finalY);

      doc.save(`KEWA_Statement_${profile?.member_number || 'Member'}.pdf`);
    } catch (err) {
      alert('Could not generate PDF: ' + err.message);
    }
  };

  const pendingGuaranteesCount = guarantorRequests.filter((g) => g.status === 'pending').length;

  const chairmanOfficial = allMembers.find((m) => m.role === 'chairman') || { full_name: 'Chairman', phone: '0712345678' };
  const treasurerOfficial = allMembers.find((m) => m.role === 'treasurer') || { full_name: 'Treasurer', phone: '0712345679' };
  const asstChairOfficial = allMembers.find((m) => m.role === 'assistant_chair') || { full_name: 'Assistant Chair', phone: '0712345670' };

  const formatKenyanWhatsAppNumber = (rawPhone) => {
    if (!rawPhone) return '254700000000';
    let clean = rawPhone.toString().replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '254' + clean.substring(1);
    } else if (clean.startsWith('7') || clean.startsWith('1')) {
      clean = '254' + clean;
    }
    return clean;
  };

  const getWhatsAppLink = (phoneNum, roleName) => {
    const formattedPhone = formatKenyanWhatsAppNumber(phoneNum);
    const textMsg = encodeURIComponent(
      `Hello ${roleName}, I am ${profile?.full_name || 'a member'} (Member No: ${profile?.member_number || 'N/A'}). I have an inquiry regarding my KEWA SACCO account.`
    );
    return `https://wa.me/${formattedPhone}?text=${textMsg}`;
  };

  // --- LOAN REPAYMENT PERFORMANCE RANKING CALCULATIONS (WORST TO BEST) ---
  const performanceRankedLoans = [...allLoansLeadership]
    .filter((l) => ['approved', 'disbursed', 'completed'].includes(l.status))
    .map((l) => {
      const totalPayable = Number(l.total_payable || 1);
      const balanceRemaining = Number(l.balance_remaining || 0);
      const totalPaid = Math.max(0, totalPayable - balanceRemaining);
      const progressPercent = Math.min(100, Math.max(0, (totalPaid / totalPayable) * 100));

      return {
        ...l,
        totalPaid,
        progressPercent,
      };
    })
    .sort((a, b) => a.progressPercent - b.progressPercent); // Ascending: Worst (0%) to Best (100%)

  const filteredMembersForManual = allMembers.filter((m) =>
    (m.full_name?.toLowerCase() || '').includes(manualMemberSearch.toLowerCase()) ||
    (m.member_number?.toLowerCase() || '').includes(manualMemberSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 sm:pb-12 selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex justify-between items-center sticky top-0 z-50 shadow-lg shadow-black/40">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-400 p-2.5 rounded-2xl shadow-lg shadow-emerald-900/40">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight">KEWA SACCO</h1>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Core
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Kenya Builders • Warren • Eurocon • External</p>
          </div>
        </div>

        {session && (
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-semibold shadow-inner">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeTab === 'overview' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeTab === 'loans' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Loans & Limits
              </button>
              <button
                onClick={() => setActiveTab('guarantors')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'guarantors' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Guarantors
                {pendingGuaranteesCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded-full font-bold animate-pulse">
                    {pendingGuaranteesCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                  activeTab === 'documents' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FolderDown className="w-3.5 h-3.5" /> Reports & AGM
              </button>
              <button
                onClick={() => setActiveTab('beneficiaries')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeTab === 'beneficiaries' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Welfare & NOK
              </button>
              <button
                onClick={() => setActiveTab('mpesa')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                  activeTab === 'mpesa' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> M-Pesa
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                  activeTab === 'support' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Help & Chat
              </button>
              {['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(profile?.role) && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                    activeTab === 'admin' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' : 'text-amber-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Leadership Hub
                </button>
              )}
            </div>

            <button
              onClick={() => handlePerformSignOut(false)}
              className="hidden lg:flex items-center gap-1.5 bg-slate-900 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition border border-slate-800 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-emerald-400" />}
            </button>
          </div>
        )}
      </header>

      {/* Fixed Full-Screen Mobile Drawer */}
      {session && mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] bg-slate-950/98 backdrop-blur-2xl z-[100] px-5 py-6 space-y-3 overflow-y-auto border-t border-slate-800 animate-fadeIn">
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">{profile?.full_name || 'Member'}</p>
              <p className="text-[10px] text-emerald-400 font-mono">{profile?.member_number || ''}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300 uppercase">
              {profile?.role ? profile.role.replace('_', ' ') : 'Member'}
            </span>
          </div>

          <button
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
              activeTab === 'overview' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
            }`}
          >
            <PiggyBank className="w-4 h-4" /> Overview Dashboard
          </button>
          
          <button
            onClick={() => { setActiveTab('loans'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
              activeTab === 'loans' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
            }`}
          >
            <Calculator className="w-4 h-4" /> Loan Products & Limits
          </button>

          <button
            onClick={() => { setActiveTab('guarantors'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition ${
              activeTab === 'guarantors' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
            }`}
          >
            <span className="flex items-center gap-3">
              <Users className="w-4 h-4" /> Guarantor Requests
            </span>
            {pendingGuaranteesCount > 0 && (
              <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingGuaranteesCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('documents'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
              activeTab === 'documents' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
            }`}
          >
            <FolderDown className="w-4 h-4 text-emerald-400" /> Reports & AGM Booklets
          </button>

          <button
            onClick={() => { setActiveTab('beneficiaries'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
              activeTab === 'beneficiaries' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
            }`}
          >
            <HeartHandshake className="w-4 h-4" /> Next of Kin & Welfare
          </button>

          <button
            onClick={() => { setActiveTab('mpesa'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
              activeTab === 'mpesa' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
            }`}
          >
            <Smartphone className="w-4 h-4" /> M-Pesa Top-Up & Repay
          </button>

          <button
            onClick={() => { setActiveTab('support'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
              activeTab === 'support' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-emerald-300 border border-slate-800/80'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Helpdesk, Bot & Officials Chat
          </button>

          {['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(profile?.role) && (
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                activeTab === 'admin' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg' : 'bg-slate-900/80 text-amber-300 border border-slate-800/80'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> 3-Signatory Leadership Hub
            </button>
          )}

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => handlePerformSignOut(false)}
              className="w-full flex items-center justify-center gap-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 py-3.5 rounded-2xl text-sm font-bold shadow-lg cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out of Portal
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
        {message.text && (
          <div
            className={`p-4 rounded-2xl text-sm font-medium border shadow-lg flex items-center justify-between animate-fadeIn ${
              message.type === 'error'
                ? 'bg-rose-950/50 border-rose-800/80 text-rose-200'
                : 'bg-emerald-950/50 border-emerald-800/80 text-emerald-200'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage({ text: '', type: '' })} className="text-xs opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {!session ? (
          /* AUTH VIEWS */
          <div className="max-w-md mx-auto mt-6 sm:mt-12 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-6">
              <div className="inline-flex bg-gradient-to-tr from-emerald-600 to-teal-400 p-3 rounded-2xl shadow-xl shadow-emerald-900/30 mb-3">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {authMode === 'login' && 'Member Sign In'}
                {authMode === 'register' && 'Join KEWA SACCO'}
                {authMode === 'forgot' && 'Reset Password'}
                {authMode === 'reset' && 'Set New Password'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {authMode === 'login' && 'Access your digital cooperative portal'}
                {authMode === 'register' && 'Register as internal staff or external member'}
                {authMode === 'forgot' && 'Receive an email link to regain access'}
                {authMode === 'reset' && 'Enter your replacement account password'}
              </p>
            </div>

            {authMode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4" autoComplete="off">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg cursor-pointer"
                >
                  {loading ? 'Sending link...' : 'Send Password Reset Link'}
                </button>
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-xs text-slate-400 hover:text-white font-medium"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {authMode === 'reset' && (
              <form onSubmit={handleUpdatePassword} className="space-y-4" autoComplete="off">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Enter New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white focus:border-emerald-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save New Password & Sign In'}
                </button>
              </form>
            )}

            {(authMode === 'login' || authMode === 'register') && (
              <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4" autoComplete="off">
                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Affiliation / Branch</label>
                      <select
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
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
                          autoComplete="off"
                          value={memberNumber}
                          onChange={(e) => setMemberNumber(e.target.value)}
                          placeholder="KW-001"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">National ID</label>
                        <input
                          type="text"
                          required
                          autoComplete="off"
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                          placeholder="12345678"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        autoComplete="off"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0712345678"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[11px] text-emerald-400 hover:underline cursor-pointer font-medium"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                      I consent to KEWA SACCO processing my data under the <strong>Kenya Data Protection Act (2019)</strong>.
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-sm transition mt-2 shadow-lg cursor-pointer"
                >
                  {loading ? 'Processing...' : authMode === 'login' ? 'Sign In to Portal' : 'Complete Registration'}
                </button>
              </form>
            )}

            <div className="text-center mt-6 text-xs text-slate-400 font-medium">
              {authMode === 'login' ? (
                <>
                  New member?{' '}
                  <button onClick={() => setAuthMode('register')} className="text-emerald-400 hover:underline font-bold cursor-pointer">
                    Register Account
                  </button>
                </>
              ) : authMode === 'register' ? (
                <>
                  Already registered?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-emerald-400 hover:underline font-bold cursor-pointer">
                    Sign In
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ) : (
          /* AUTHENTICATED VIEWS */
          <>
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                    {profile?.companies?.name || 'KEWA Member'}
                  </span>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-950 border border-amber-800 text-amber-300 uppercase">
                    Role: {profile?.role ? profile.role.replace('_', ' ') : 'Member'}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-2.5 tracking-tight">{profile?.full_name}</h2>
                <p className="text-xs text-slate-400 font-medium">Member Number: <span className="text-slate-200 font-bold font-mono">{profile?.member_number}</span></p>
              </div>

              <button
                onClick={() => generatePDFStatement()}
                className="flex items-center justify-center gap-2 bg-emerald-950/60 hover:bg-emerald-600 text-emerald-300 hover:text-white px-4 py-2.5 rounded-2xl text-xs font-bold border border-emerald-800 transition shadow cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Official Statement
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 flex items-center justify-between shadow-lg">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Total Savings & Shares</p>
                      <h3 className="text-2xl font-black text-white mt-1">
                        KES {totalSavings.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="bg-emerald-950/80 border border-emerald-800/50 p-3.5 rounded-2xl text-emerald-400 shadow">
                      <PiggyBank className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 flex items-center justify-between shadow-lg">
                    <div>
                      <p className="text-xs font-bold text-emerald-400">Free Unencumbered Shares</p>
                      <h3 className="text-2xl font-black text-emerald-400 mt-1">
                        KES {freeSharesAvailable.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="bg-emerald-950/80 border border-emerald-800/50 p-3.5 rounded-2xl text-emerald-400 shadow">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 flex items-center justify-between shadow-lg">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Guarantees Committed</p>
                      <h3 className="text-2xl font-black text-rose-400 mt-1">
                        KES {totalGuaranteesCommittedAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="bg-rose-950/80 border border-rose-800/50 p-3.5 rounded-2xl text-rose-400 shadow">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 flex items-center justify-between shadow-lg">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Active Loan Balance</p>
                      <h3 className="text-2xl font-black text-amber-400 mt-1">
                        KES {activeLoanBalance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="bg-amber-950/80 border border-amber-800/50 p-3.5 rounded-2xl text-amber-400 shadow">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* DUAL CHECKOFF LEDGERS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                      <h4 className="text-base font-bold text-white">Monthly Savings Checkoff Ledger</h4>
                    </div>

                    {savings.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-sm">No contributions found.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
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

                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 shadow-lg">
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
                            <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
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
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Apply for a Loan</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => handleLoanProductChange('main_loan')}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        loanProduct === 'main_loan' 
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">1. Main Loan</span>
                      <span className="text-[10px] text-slate-400">Long-term (Up to 24 mos, 1%)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoanProductChange('emergency_loan')}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        loanProduct === 'emergency_loan' 
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">2. Emergency Loan</span>
                      <span className="text-[10px] text-slate-400">School fees & Medical (12 mos)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoanProductChange('christmas_loan')}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        loanProduct === 'christmas_loan' 
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">3. Christmas Loan</span>
                      <span className="text-[10px] text-slate-400">December festivities (Up to 6 mos)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoanProductChange('monthly_shylock')}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        loanProduct === 'monthly_shylock' 
                          ? 'bg-amber-950/80 border-amber-500 text-white shadow' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block text-amber-400">4. Monthly Shylock</span>
                      <span className="text-[10px] text-slate-400">Instant Advance (Repaid next salary)</span>
                    </button>
                  </div>

                  <form onSubmit={handleInitiateLoan} className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
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
                      <div className="flex justify-between items-center mb-1.5">
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

                    {/* Searchable Guarantors */}
                    {loanProduct !== 'monthly_shylock' && (
                      <div className="border-t border-slate-800 pt-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Assign Member Guarantors</h4>
                            <p className="text-[11px] text-slate-400">Type colleague's name or member number to search</p>
                          </div>
                          <button
                            type="button"
                            onClick={addGuarantorRow}
                            className="flex items-center gap-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs px-2.5 py-1 rounded-xl cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Guarantor
                          </button>
                        </div>

                        {guarantorList.map((g, index) => {
                          const filteredColleagues = allMembers.filter((m) =>
                            (m.full_name?.toLowerCase() || '').includes((g.searchTerm || '').toLowerCase()) ||
                            (m.member_number?.toLowerCase() || '').includes((g.searchTerm || '').toLowerCase()) ||
                            (m.companies?.name?.toLowerCase() || '').includes((g.searchTerm || '').toLowerCase())
                          );

                          return (
                            <div key={index} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-2 relative">
                              <div className="flex flex-col sm:flex-row gap-2 items-center">
                                <div className="w-full sm:w-3/5 relative">
                                  <label className="block text-[10px] text-slate-400 mb-1 font-medium">Search Guarantor #{index + 1}</label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      required
                                      autoComplete="off"
                                      placeholder="Type name (e.g. Newton, KW-001)..."
                                      value={g.searchTerm}
                                      onChange={(e) => {
                                        updateGuarantorRow(index, 'searchTerm', e.target.value);
                                        updateGuarantorRow(index, 'dropdownOpen', true);
                                      }}
                                      onFocus={() => updateGuarantorRow(index, 'dropdownOpen', true)}
                                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white"
                                    />
                                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                  </div>

                                  {g.dropdownOpen && filteredColleagues.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 divide-y divide-slate-800">
                                      {filteredColleagues.slice(0, 8).map((colleague) => (
                                        <div
                                          key={colleague.id}
                                          onClick={() => selectGuarantorFromSearch(index, colleague)}
                                          className="p-2.5 hover:bg-slate-800 text-xs cursor-pointer text-slate-200 transition flex justify-between"
                                        >
                                          <span><strong>{colleague.full_name}</strong> ({colleague.member_number})</span>
                                          <span className="text-[10px] text-slate-400">{colleague.companies?.name || 'External'}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="w-full sm:w-2/5">
                                  <label className="block text-[10px] text-slate-400 mb-1 font-medium">Pledged (KES)</label>
                                  <input
                                    type="number"
                                    required
                                    placeholder="e.g. 5000"
                                    value={g.amount}
                                    onChange={(e) => updateGuarantorRow(index, 'amount', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
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

                              {g.guarantorId && (
                                <div className={`p-2.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 ${
                                  g.eligible
                                    ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'
                                    : 'bg-rose-950/60 border border-rose-800/60 text-rose-300'
                                }`}>
                                  {g.eligible ? (
                                    <>
                                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                      <span>{g.note}</span>
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                      <span>{g.note}</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1.5 text-xs">
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
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-2xl text-sm transition shadow-lg cursor-pointer"
                    >
                      Review Terms & Continue Application
                    </button>
                  </form>
                </div>

                {/* Member Applications List */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-lg">
                  <h3 className="text-lg font-bold text-white mb-4">My Loan Applications & Approval Tracker</h3>
                  {loans.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">No active or past loans found.</div>
                  ) : (
                    <div className="space-y-4">
                      {loans.map((l) => (
                        <div key={l.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                                  l.status === 'approved' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' :
                                  l.status === 'completed' ? 'bg-blue-950 border border-blue-800 text-blue-300' :
                                  l.status === 'pending' ? 'bg-amber-950 border border-amber-800 text-amber-300' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  Status: {l.status}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 capitalize border border-slate-800">
                                  {(l.loan_product || 'main_loan').replace('_', ' ')}
                                </span>
                              </div>
                              <h4 className="text-lg font-black text-white mt-1.5">
                                KES {Number(l.principal_amount).toLocaleString()}
                              </h4>
                              <p className="text-xs text-slate-400 font-medium">{l.repayment_period_months} Month(s) Term</p>
                            </div>
                            <button
                              onClick={() => generatePDFStatement(l)}
                              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-800 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" /> PDF
                            </button>
                          </div>

                          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 text-[11px] space-y-1.5">
                            <p className="text-slate-400 font-semibold mb-1">Signatory Pipeline Progress:</p>
                            <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                              <span className={`p-1.5 rounded-lg text-[10px] font-bold ${l.assistant_chair_approval ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-950 text-slate-500'}`}>
                                1. Asst: {l.assistant_chair_approval ? '✓ SIGNED' : 'PENDING'}
                              </span>
                              <span className={`p-1.5 rounded-lg text-[10px] font-bold ${l.chairman_approval ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-950 text-slate-500'}`}>
                                2. Chair: {l.chairman_approval ? '✓ SIGNED' : 'PENDING'}
                              </span>
                              <span className={`p-1.5 rounded-lg text-[10px] font-bold ${l.treasurer_approval ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-950 text-slate-500'}`}>
                                3. Treas: {l.treasurer_approval ? '✓ DISBURSED' : 'PENDING'}
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
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-7 space-y-6 shadow-lg">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Guarantor Requests Received</h3>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Your Current Available Free Shares:</span>
                    <span className="text-emerald-400 font-black text-sm">KES {freeSharesAvailable.toLocaleString()}</span>
                  </div>
                </div>

                {guarantorRequests.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">You have no pending guarantor requests.</div>
                ) : (
                  <div className="space-y-3">
                    {guarantorRequests.map((g) => (
                      <div key={g.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            g.status === 'accepted' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' :
                            g.status === 'pending' ? 'bg-amber-950 border border-amber-800 text-amber-300' : 'bg-rose-950 border border-rose-800 text-rose-300'
                          }`}>
                            Guarantee: {g.status}
                          </span>
                          <h4 className="text-base font-bold text-white mt-1">{g.loans?.profiles?.full_name}</h4>
                          <p className="text-xs text-slate-400">{g.loans?.profiles?.companies?.name || 'External'} • Member {g.loans?.profiles?.member_number}</p>
                          <p className="text-xs text-emerald-400 mt-1 font-medium">
                            Pledged: KES {Number(g.amount_guaranteed).toLocaleString()} (Product: {(g.loans?.loan_product || 'main_loan').replace('_', ' ').toUpperCase()})
                          </p>
                        </div>

                        {g.status === 'pending' && (
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleRespondGuarantor(g.id, 'accepted', g.amount_guaranteed)}
                              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" /> Accept
                            </button>
                            <button
                              onClick={() => handleRespondGuarantor(g.id, 'rejected', g.amount_guaranteed)}
                              className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
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

            {/* TAB 4: OFFICIAL REPORTS & AGM DOCUMENTS LIBRARY */}
            {activeTab === 'documents' && (
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <FolderDown className="w-6 h-6 text-emerald-400" /> Official Reports & AGM Booklets
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      Access certified annual audit reports, AGM booklets, and society policies digitally.
                    </p>
                  </div>
                  <button
                    onClick={fetchSaccoDocuments}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition border border-slate-700"
                    title="Refresh Library"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Refresh
                  </button>
                </div>

                {saccoDocs.length === 0 ? (
                  <div className="text-center py-16 border border-slate-800 rounded-3xl bg-slate-950">
                    <FileArchive className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-300">No official documents published yet.</p>
                    <p className="text-xs text-slate-500 mt-1">Leadership will upload the upcoming AGM and audit packages here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {saccoDocs.map((doc) => (
                      <div key={doc.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                              doc.category === 'audit_report' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' :
                              doc.category === 'agm_booklet' ? 'bg-amber-950 border border-amber-800 text-amber-300' :
                              'bg-blue-950 border border-blue-800 text-blue-300'
                            }`}>
                              {doc.category.replace('_', ' ')}
                            </span>
                            <span className="text-xs font-mono text-slate-400">{doc.financial_year}</span>
                          </div>

                          <h4 className="text-base font-bold text-white mt-2 leading-snug">{doc.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                            <span>File Size: {doc.file_size || 'PDF'}</span> • 
                            <span>Published: {new Date(doc.created_at).toLocaleDateString()}</span>
                          </p>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                          >
                            <Download className="w-3.5 h-3.5" /> Read / Download PDF
                          </a>
                          {['admin', 'chairman', 'treasurer', 'assistant_chair'].includes(profile?.role) && (
                            <button
                              onClick={() => handleDeleteSaccoDocument(doc.id, doc.title)}
                              className="bg-rose-950/60 hover:bg-rose-900 border border-rose-900/60 text-rose-300 p-2.5 rounded-xl text-xs transition cursor-pointer"
                              title="Delete Report"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: BENEFICIARIES & WELFARE */}
            {activeTab === 'beneficiaries' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Nominated Beneficiaries (Next of Kin)</h3>
                  </div>

                  <form onSubmit={handleAddBeneficiary} className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        value={nokName}
                        onChange={(e) => setNokName(e.target.value)}
                        placeholder="e.g. Mary Atieno"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Relationship</label>
                        <select
                          value={nokRel}
                          onChange={(e) => setNokRel(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
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
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">National ID</label>
                        <input
                          type="text"
                          autoComplete="off"
                          value={nokId}
                          onChange={(e) => setNokId(e.target.value)}
                          placeholder="ID Number"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          autoComplete="off"
                          value={nokPhone}
                          onChange={(e) => setNokPhone(e.target.value)}
                          placeholder="07xxxxxxxx"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow cursor-pointer"
                    >
                      Save Beneficiary
                    </button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                    {beneficiaries.map((b) => (
                      <div key={b.id} className="bg-slate-950 p-3 rounded-2xl flex justify-between items-center text-xs">
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

                <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <HeartHandshake className="w-5 h-5 text-rose-400" />
                    <h3 className="text-lg font-bold text-white">Benevolent & Welfare Claims</h3>
                  </div>

                  <form onSubmit={handleSubmitWelfareClaim} className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Claim Category</label>
                      <select
                        value={claimType}
                        onChange={(e) => setClaimType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1 font-medium">
                        <Paperclip className="w-3.5 h-3.5 text-amber-400" /> Upload Evidence Document (PDF/Photo)
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setClaimDocument(e.target.files[0])}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:bg-rose-900/60 file:text-rose-200 cursor-pointer"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow cursor-pointer"
                    >
                      Submit Welfare Claim for Sequential Review
                    </button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                    {welfareClaims.map((c) => (
                      <div key={c.id} className="bg-slate-950 p-3 rounded-2xl space-y-2 text-xs">
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
                          <span className={c.assistant_chair_approval ? 'text-emerald-400 font-bold' : 'text-slate-500'}>1. Asst: {c.assistant_chair_approval ? '✓ SIGNED' : 'PENDING'}</span>
                          <span className={c.chairman_approval ? 'text-emerald-400 font-bold' : 'text-slate-500'}>2. Chair: {c.chairman_approval ? '✓ SIGNED' : 'PENDING'}</span>
                          <span className={c.treasurer_approval ? 'text-emerald-400 font-bold' : 'text-slate-500'}>3. Treas: {c.treasurer_approval ? '✓ SIGNED' : 'PENDING'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: M-PESA */}
            {activeTab === 'mpesa' && (
              <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Direct M-Pesa Payment & Top-Up</h3>
                    <p className="text-xs text-slate-400">Instant Savings Deposit or Loan Repayment via Safaricom M-Pesa</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1 text-xs font-medium">
                  <p className="text-slate-300 font-bold">Paybill Instructions:</p>
                  <p className="text-slate-400">Business No: <strong className="text-white font-mono">522522</strong> (KEWA SACCO)</p>
                  <p className="text-slate-400">Account No: <strong className="text-emerald-400 font-mono">{profile?.member_number}</strong></p>
                </div>

                <form onSubmit={handleMpesaTransaction} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Account</label>
                    <select
                      value={mpesaType}
                      onChange={(e) => setMpesaType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
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
                      autoComplete="off"
                      value={mpesaPhone || profile?.phone || ''}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="0712345678"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">M-Pesa Transaction Code (Optional for STK Push)</label>
                    <input
                      type="text"
                      autoComplete="off"
                      value={mpesaCode}
                      onChange={(e) => setMpesaCode(e.target.value)}
                      placeholder="e.g. QGH789KL12"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Confirm & Credit Account
                  </button>
                </form>
              </div>
            )}

            {/* TAB 7: MEMBER HELPDESK & BOT */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-bold text-white">Direct Communication with SACCO Officials</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-5 font-medium">
                    Tap to open a pre-filled direct WhatsApp message or phone call with your elected executive committee.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Chairperson */}
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                          Executive Chairperson
                        </span>
                        <h4 className="text-base font-bold text-white mt-1.5">{chairmanOfficial.full_name}</h4>
                        <p className="text-xs text-slate-400">Governance & General Appeals</p>
                      </div>
                      <a
                        href={getWhatsAppLink(chairmanOfficial.phone, 'Chairman')}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                      </a>
                    </div>

                    {/* Treasurer */}
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                          Treasurer & Finance
                        </span>
                        <h4 className="text-base font-bold text-white mt-1.5">{treasurerOfficial.full_name}</h4>
                        <p className="text-xs text-slate-400">Disbursements & Checkoff Inquiries</p>
                      </div>
                      <a
                        href={getWhatsAppLink(treasurerOfficial.phone, 'Treasurer')}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                      </a>
                    </div>

                    {/* Assistant Chair */}
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                          Assistant Chairperson
                        </span>
                        <h4 className="text-base font-bold text-white mt-1.5">{asstChairOfficial.full_name}</h4>
                        <p className="text-xs text-slate-400">Guarantor Verification & Welfare</p>
                      </div>
                      <a
                        href={getWhatsAppLink(asstChairOfficial.phone, 'Assistant Chair')}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* AI Bot */}
                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 flex flex-col h-[480px] shadow-xl">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                      <Bot className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h4 className="text-sm font-bold text-white">KEWA SACCO AI Assistant</h4>
                        <p className="text-[10px] text-slate-400">Instant Automated Policy & Ledger Support</p>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-emerald-600 text-white rounded-tr-none'
                              : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSendChatMessage} className="pt-2 border-t border-slate-800 flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about loans, free shares, M-Pesa..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                  {/* Submit Tracked Ticket */}
                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-amber-400" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Submit Internal Message / Ticket</h4>
                        <p className="text-[10px] text-slate-400">Formally logged in the system for committee action</p>
                      </div>
                    </div>

                    <form onSubmit={handleCreateInquiry} className="space-y-3" autoComplete="off">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Category</label>
                        <select
                          value={inquiryCategory}
                          onChange={(e) => setInquiryCategory(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="loan_inquiry">Loan Application / Guarantor Inquiry</option>
                          <option value="savings_dispute">Payroll Checkoff / Savings Ledger Clarification</option>
                          <option value="welfare_support">Welfare / Benevolent Claim Follow-up</option>
                          <option value="general">General Society Inquiry / Feedback</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                        <input
                          type="text"
                          required
                          autoComplete="off"
                          value={inquirySubject}
                          onChange={(e) => setInquirySubject(e.target.value)}
                          placeholder="Brief summary of your message..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Message</label>
                        <textarea
                          required
                          rows="3"
                          value={inquiryMessage}
                          onChange={(e) => setInquiryMessage(e.target.value)}
                          placeholder="Provide details for leadership review..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit Message to Committee
                      </button>
                    </form>

                    <div className="pt-3 border-t border-slate-800 space-y-2 max-h-44 overflow-y-auto">
                      <p className="text-[11px] font-bold text-slate-300">My Past Submitted Inquiries:</p>
                      {inquiries.length === 0 ? (
                        <p className="text-[11px] text-slate-500">No tickets submitted yet.</p>
                      ) : (
                        inquiries.map((inq) => (
                          <div key={inq.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white">{inq.subject}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                inq.status === 'resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                              }`}>
                                {inq.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">{inq.message}</p>
                            {inq.admin_response && (
                              <div className="mt-1 p-2 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-[11px] text-emerald-300">
                                <strong>Committee Reply:</strong> {inq.admin_response}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: LEADERSHIP HUB WITH MANUAL MEMBER ADJUSTMENT & LOAN RECOVERY MATRIX */}
            {activeTab === 'admin' && ['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(profile?.role) && (
              <div className="space-y-6">
                {/* 1. MANUAL SINGLE-MEMBER ADJUSTMENT DESK */}
                <div className="bg-slate-900/90 border border-emerald-900/50 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Manual Member Contribution / Loan Repayment Desk</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 font-medium">
                    Post manual individual deposits for members paying via cash, direct bank deposit, or non-checkoff streams.
                  </p>

                  <form onSubmit={handleManualMemberAdjustment} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Select Beneficiary Member</label>
                        <select
                          value={manualTargetMemberId}
                          onChange={(e) => setManualTargetMemberId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          {allMembers.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.full_name} ({m.member_number}) - {m.companies?.name || 'External'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Adjustment Type</label>
                        <select
                          value={manualAdjustmentType}
                          onChange={(e) => setManualAdjustmentType(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium"
                        >
                          <option value="savings_deposit">1. Credit Member Monthly Savings</option>
                          <option value="loan_repayment">2. Apply Active Loan Repayment (Debt Reduction)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (KES)</label>
                        <input
                          type="number"
                          required
                          value={manualAmount}
                          onChange={(e) => setManualAmount(e.target.value)}
                          placeholder="e.g. 5000"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Audit Reference Code (Optional)</label>
                        <input
                          type="text"
                          value={manualRefCode}
                          onChange={(e) => setManualRefCode(e.target.value)}
                          placeholder="e.g. BANK-SLIP-7821 or CASH-RECEIPT-09"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                        />
                      </div>

                      <div className="sm:col-span-1 flex items-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <PlusCircle className="w-4 h-4" /> Post Member Credit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* 2. LOAN RECOVERY & PERFORMANCE MATRIX (WORST TO BEST PROGRESS RANKING) */}
                <div className="bg-slate-900/90 border border-rose-900/40 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <AlertOctagon className="w-5 h-5 text-rose-400" />
                      <h3 className="text-lg font-bold text-white">Loan Recovery & Performance Matrix (Worst to Best Progress)</h3>
                    </div>
                    <button
                      onClick={fetchAdminData}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition border border-slate-700"
                      title="Refresh Matrix"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Refresh
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 font-medium">
                    Monitors all active borrowers ranked automatically from the lowest repayment percentage to the most compliant.
                  </p>

                  {performanceRankedLoans.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">No active or historical loans found in the system.</div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 font-semibold sticky top-0">
                          <tr>
                            <th className="p-3">Rank & Member</th>
                            <th className="p-3">Facility</th>
                            <th className="p-3 text-right">Principal</th>
                            <th className="p-3 text-right">Total Repaid</th>
                            <th className="p-3 text-right">Outstanding Debt</th>
                            <th className="p-3 text-center">Recovery Progress</th>
                            <th className="p-3 text-center">Performance Risk</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {performanceRankedLoans.map((loan, idx) => {
                            const isZeroRepaid = loan.progressPercent === 0;
                            const isCompleted = loan.progressPercent >= 100;

                            return (
                              <tr key={loan.id} className={isZeroRepaid ? 'bg-rose-950/20 hover:bg-rose-950/30' : 'hover:bg-slate-900/40'}>
                                <td className="p-3">
                                  <div className="font-sans font-bold text-white">#{idx + 1} {loan.profiles?.full_name}</div>
                                  <div className="text-[10px] text-slate-400">{loan.profiles?.companies?.name || 'External'} ({loan.profiles?.member_number})</div>
                                </td>
                                <td className="p-3 font-sans capitalize text-slate-300">
                                  {(loan.loan_product || 'main_loan').replace('_', ' ')}
                                </td>
                                <td className="p-3 text-right text-slate-300">
                                  KES {Number(loan.principal_amount).toLocaleString()}
                                </td>
                                <td className="p-3 text-right text-emerald-400 font-bold">
                                  KES {loan.totalPaid.toLocaleString()}
                                </td>
                                <td className="p-3 text-right text-amber-400 font-bold">
                                  KES {Number(loan.balance_remaining).toLocaleString()}
                                </td>
                                <td className="p-3 text-center">
                                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-1">
                                    <div 
                                      className={`h-full ${isCompleted ? 'bg-blue-500' : isZeroRepaid ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                      style={{ width: `${loan.progressPercent}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] text-slate-300">{loan.progressPercent.toFixed(1)}%</span>
                                </td>
                                <td className="p-3 text-center font-sans">
                                  {isCompleted ? (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                                      CLEARED ✓
                                    </span>
                                  ) : isZeroRepaid ? (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
                                      DEFAULT RISK (0%)
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                                      IN PROGRESS
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 3. UPLOAD SACCO AUDIT & AGM REPORTS */}
                <div className="bg-slate-900/90 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FolderDown className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Publish Official Report / Audit Booklet</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 font-medium">
                    Upload verified PDF documents (Audit Reports, AGM Booklets, By-laws). Members can read and download them instantly.
                  </p>

                  <form onSubmit={handleUploadSaccoDocument} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
                      <input
                        type="text"
                        required
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        placeholder="e.g. KEWA SACCO Audited Financials 2025"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Report Category</label>
                      <select
                        value={docCategory}
                        onChange={(e) => setDocCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="audit_report">Audited Financial Statements</option>
                        <option value="agm_booklet">Annual AGM Booklet & Minutes</option>
                        <option value="bylaws_policy">SACCO By-Laws & Policies</option>
                        <option value="financial_statement">Mid-Year Financial Report</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Financial Year</label>
                      <input
                        type="text"
                        required
                        value={docYear}
                        onChange={(e) => setDocYear(e.target.value)}
                        placeholder="e.g. 2025/2026"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Select PDF Report File</label>
                      <input
                        type="file"
                        accept=".pdf"
                        required
                        onChange={(e) => setDocFile(e.target.files[0])}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:bg-emerald-600 file:text-white cursor-pointer"
                      />
                    </div>

                    <div className="sm:col-span-1 flex items-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <UploadCloud className="w-4 h-4" /> Publish Report
                      </button>
                    </div>
                  </form>
                </div>

                {/* 4. DUAL PAYROLL CHECKOFF */}
                <div className="bg-slate-900/90 border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">Automated Dual Payroll Checkoff (Savings + Loans)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 font-medium">
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Select Payroll Deductions CSV</label>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:bg-amber-600 file:text-white cursor-pointer"
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
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
                        >
                          <UploadCloud className="w-4 h-4" /> Process & Post All Checkoffs
                        </button>
                      </div>

                      <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900 text-slate-400 sticky top-0 font-semibold">
                            <tr>
                              <th className="p-2.5">Member No</th>
                              <th className="p-2.5">Matched Name</th>
                              <th className="p-2.5 text-right">Savings Credit</th>
                              <th className="p-2.5 text-right">Loan Deduct</th>
                              <th className="p-2.5 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-medium">
                            {batchPreview.map((row, idx) => (
                              <tr key={idx} className={row.valid ? 'hover:bg-slate-900/40' : 'bg-rose-950/20'}>
                                <td className="p-2.5 font-mono">{row.member_number}</td>
                                <td className="p-2.5">{row.full_name}</td>
                                <td className="p-2.5 text-right font-bold text-emerald-400">
                                  +KES {Number(row.savings_amount || 0).toLocaleString()}
                                </td>
                                <td className="p-2.5 text-right font-bold text-amber-400">
                                  -KES {Number(row.loan_amount || 0).toLocaleString()}
                                </td>
                                <td className="p-2.5 text-center">
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

                {/* 5. SEQUENTIAL 3-SIGNATORY DESK */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">Sequential 3-Signatory Approval Pipeline (Role-Restricted)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 font-medium">
                    Strict Role Verification: You are currently signed in as <strong className="text-amber-300 uppercase">{profile?.role?.replace('_', ' ')}</strong>. You can only execute endorsements assigned to your specific portfolio.
                  </p>

                  {allPendingLoans.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">No loan applications awaiting signatory action.</div>
                  ) : (
                    <div className="space-y-4">
                      {allPendingLoans.map((l) => {
                        const canChairSign = l.assistant_chair_approval;
                        const canTreasurerSign = l.assistant_chair_approval && l.chairman_approval;

                        const isAsstChairUser = profile?.role === 'assistant_chair' || profile?.role === 'admin';
                        const isChairUser = profile?.role === 'chairman' || profile?.role === 'admin';
                        const isTreasurerUser = profile?.role === 'treasurer' || profile?.role === 'admin';

                        return (
                          <div key={l.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4 shadow">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-bold text-white">{l.profiles?.full_name}</h4>
                                  <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-800 uppercase">
                                    {(l.loan_product || 'main_loan').replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">{l.profiles?.companies?.name || 'External'} • Member {l.profiles?.member_number}</p>
                                <p className="text-sm font-black text-emerald-400 mt-1">
                                  KES {Number(l.principal_amount).toLocaleString()} ({l.repayment_period_months} Mos Term)
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {/* Stage 1 */}
                                {l.assistant_chair_approval ? (
                                  <button
                                    onClick={() => handleSignatoryPipeline(l.id, 'assistant_chair', 'unsign')}
                                    disabled={!isAsstChairUser}
                                    className={`text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
                                      isAsstChairUser
                                        ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                                        : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                                    }`}
                                    title={isAsstChairUser ? "Click to Unsign" : "Only Assistant Chair can modify"}
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" /> 1. Asst Chair (Signed) {isAsstChairUser && <RotateCcw className="w-3 h-3 ml-1 opacity-60" />}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleSignatoryPipeline(l.id, 'assistant_chair', 'sign')}
                                    disabled={!isAsstChairUser}
                                    className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow ${
                                      isAsstChairUser
                                        ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                                        : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    1. Sign: Asst Chair
                                  </button>
                                )}

                                {/* Stage 2 */}
                                {l.chairman_approval ? (
                                  <button
                                    onClick={() => handleSignatoryPipeline(l.id, 'chairman', 'unsign')}
                                    disabled={!isChairUser}
                                    className={`text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
                                      isChairUser
                                        ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                                        : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                                    }`}
                                    title={isChairUser ? "Click to Unsign" : "Only Chairman can modify"}
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" /> 2. Chair (Signed) {isChairUser && <RotateCcw className="w-3 h-3 ml-1 opacity-60" />}
                                  </button>
                                ) : (
                                  <button
                                    disabled={!canChairSign || !isChairUser}
                                    onClick={() => handleSignatoryPipeline(l.id, 'chairman', 'sign')}
                                    className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow ${
                                      canChairSign && isChairUser
                                        ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                                        : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    {(!canChairSign || !isChairUser) && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                                    2. Sign: Chairman
                                  </button>
                                )}

                                {/* Stage 3 */}
                                {l.treasurer_approval ? (
                                  <button
                                    onClick={() => handleSignatoryPipeline(l.id, 'treasurer', 'unsign')}
                                    disabled={!isTreasurerUser}
                                    className={`text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
                                      isTreasurerUser
                                        ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                                        : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                                    }`}
                                    title={isTreasurerUser ? "Click to Unsign" : "Only Treasurer can modify"}
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" /> 3. Treas (Disbursed) {isTreasurerUser && <RotateCcw className="w-3 h-3 ml-1 opacity-60" />}
                                  </button>
                                ) : (
                                  <button
                                    disabled={!canTreasurerSign || !isTreasurerUser}
                                    onClick={() => handleSignatoryPipeline(l.id, 'treasurer', 'sign')}
                                    className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow ${
                                      canTreasurerSign && isTreasurerUser
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer'
                                        : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    {(!canTreasurerSign || !isTreasurerUser) && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                                    3. Disburse: Treasurer
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-400">
                              <p className="font-semibold text-slate-300 mb-1">Guarantor Approvals & Pledges:</p>
                              <div className="space-y-1">
                                {l.loan_guarantors?.map((g) => (
                                  <div key={g.id} className="flex justify-between font-mono text-[11px]">
                                    <span>{g.profiles?.full_name}:</span>
                                    <span className={g.status === 'accepted' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                                      {g.status.toUpperCase()} (KES {Number(g.amount_guaranteed).toLocaleString()})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 6. COMMITTEE SUPPORT TICKETS DESK */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-lg font-bold text-white">Member Support Tickets & Formal Inquiries</h3>
                    </div>
                    <button
                      onClick={fetchAdminData}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition border border-slate-700"
                      title="Refresh Tickets"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Refresh Tickets
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 font-medium">
                    Review and resolve messages submitted by members directly from their portal accounts.
                  </p>

                  {allAdminInquiries.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">No member inquiries awaiting response.</div>
                  ) : (
                    <div className="space-y-4">
                      {allAdminInquiries.map((ticket) => (
                        <div key={ticket.id} className="bg-slate-950 border border-slate-800 p-5 rounded-3xl space-y-3 text-xs shadow">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-white text-sm">{ticket.profiles?.full_name || 'Member'}</h5>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  ticket.status === 'resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                                }`}>
                                  {ticket.status.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-slate-400">{ticket.profiles?.companies?.name || 'External'} • Member {ticket.profiles?.member_number} • Phone: {ticket.profiles?.phone}</p>
                              <p className="text-emerald-400 font-bold mt-1">Category: {ticket.category.replace('_', ' ').toUpperCase()}</p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{new Date(ticket.created_at).toLocaleString()}</span>
                          </div>

                          <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-2xl space-y-1">
                            <p className="font-bold text-slate-200">Subject: {ticket.subject}</p>
                            <p className="text-slate-300 leading-relaxed">{ticket.message}</p>
                          </div>

                          {ticket.admin_response ? (
                            <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-2xl text-[11px] text-emerald-300">
                              <strong>Official Reply:</strong> {ticket.admin_response}
                            </div>
                          ) : (
                            <div className="flex gap-2 pt-2 border-t border-slate-800">
                              <input
                                type="text"
                                placeholder="Type official response to member..."
                                value={adminReplyText[ticket.id] || ''}
                                onChange={(e) => setAdminReplyText({ ...adminReplyText, [ticket.id]: e.target.value })}
                                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                              />
                              <button
                                onClick={() => handleAdminReplyInquiry(ticket.id)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer flex items-center gap-1"
                              >
                                <Send className="w-3.5 h-3.5" /> Reply & Resolve
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 7. POST NOTICES & AUDIT LOGS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 shadow-xl">
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
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
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
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow"
                      >
                        Publish Notice
                      </button>
                    </form>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <History className="w-5 h-5 text-amber-400" />
                      <h4 className="text-base font-bold text-white">Immutable Audit Trail (SASRA Standard)</h4>
                    </div>

                    <div className="max-h-56 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 sticky top-0 font-semibold">
                          <tr>
                            <th className="p-2.5">Time</th>
                            <th className="p-2.5">Action</th>
                            <th className="p-2.5">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                          {auditLogs.map((log) => (
                            <tr key={log.id}>
                              <td className="p-2.5 text-slate-400">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                              <td className="p-2.5 text-emerald-400 font-bold">{log.action}</td>
                              <td className="p-2.5 text-slate-300">{log.details}</td>
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

      {/* LOAN TERMS & CONDITIONS MODAL */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-950 border border-emerald-900/60 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">KEWA SACCO Loan Terms & Conditions</h3>
              </div>
              <button 
                onClick={() => setShowTermsModal(false)} 
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-2xl space-y-1">
                <p className="font-bold text-emerald-300 text-sm capitalize">
                  Application Summary: {loanProduct.replace('_', ' ').toUpperCase()}
                </p>
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Principal: <strong>KES {Number(loanPrincipal).toLocaleString()}</strong></span>
                  <span>Duration: <strong>{loanMonths} Month(s)</strong></span>
                  <span>Payable: <strong>KES {calculatedTotal.toLocaleString()}</strong></span>
                </div>
              </div>

              <h4 className="font-bold text-white text-xs uppercase tracking-wide">1. Payroll Deduction Authorization</h4>
              <p>
                By submitting this loan request, I authorize my employer or company checkoff unit to deduct <strong>KES {monthlyInstallment.toFixed(2)}</strong> monthly until settled in full.
              </p>

              <h4 className="font-bold text-white text-xs uppercase tracking-wide">2. Interest Rate & Repayment Schedules</h4>
              <p>
                Interest on the loan facility is charged at <strong>{interestRate}% per month</strong>. Default attracts recovery action under the Co-operative Societies Act.
              </p>

              <h4 className="font-bold text-white text-xs uppercase tracking-wide">3. Guarantor Liability & Recovery</h4>
              <p>
                Default or employment cessation triggers liquidation of personal deposits first, followed by proportional recovery from verified guarantors’ savings.
              </p>

              <h4 className="font-bold text-white text-xs uppercase tracking-wide">4. Sequential 3-Signatory Approval Quorum</h4>
              <p>
                Disbursement proceeds strictly in sequence: <strong>1. Assistant Chair</strong> $\rightarrow$ <strong>2. Chairman</strong> $\rightarrow$ <strong>3. Treasurer</strong>.
              </p>
            </div>

            <div className="p-5 border-t border-slate-800 bg-slate-900/80 space-y-3">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-300 font-medium cursor-pointer">
                  I have read, understood, and accept all loan terms and recovery policies.
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!termsAgreed || loading}
                  onClick={handleConfirmLoanSubmission}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Confirm & Submit Loan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      {session && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/98 backdrop-blur-xl border-t border-slate-800/90 flex justify-around items-center py-2.5 px-1 z-50 shadow-2xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 transition ${
              activeTab === 'overview' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <PiggyBank className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('loans')}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 transition ${
              activeTab === 'loans' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Loans</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 transition ${
              activeTab === 'documents' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <FolderDown className="w-4 h-4" />
            <span>Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('guarantors')}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 relative transition ${
              activeTab === 'guarantors' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Guarantors</span>
            {pendingGuaranteesCount > 0 && (
              <span className="absolute top-0 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 transition ${
              activeTab === 'support' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Help</span>
          </button>

          {['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(profile?.role) && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 transition ${
                activeTab === 'admin' ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Leadership</span>
            </button>
          )}

          <button
            onClick={() => handlePerformSignOut(false)}
            className="flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 text-rose-400 hover:text-rose-300 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit</span>
          </button>
        </div>
      )}
    </div>
  );
}