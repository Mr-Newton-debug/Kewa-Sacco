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
  MessageSquare, MessageCircle, Bot, Mail, CornerDownRight, Check, UserCheck, AlertOctagon,
  Contact2, Filter, AtSign, Megaphone, Settings, ArrowRight, Database, Coins, Layers, CheckCircle2
} from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth State
  const [email, setEmail] = useState(() => localStorage.getItem('kewa_remembered_email') || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [odpcConsent, setOdpcConsent] = useState(false);
  const [savedEmailChip, setSavedEmailChip] = useState(() => localStorage.getItem('kewa_remembered_email') || '');

  // Core Data State
  const [companies, setCompanies] = useState([]);
  const [profile, setProfile] = useState(null);
  const [savings, setSavings] = useState([]);
  const [loans, setLoans] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [guarantorRequests, setGuarantorRequests] = useState([]);
  const [myGuaranteesCommitted, setMyGuaranteesCommitted] = useState([]);
  const [allSystemGuarantors, setAllSystemGuarantors] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [saccoDocs, setSaccoDocs] = useState([]);
  const [welfareClaims, setWelfareClaims] = useState([]);
  const [welfareContributions, setWelfareContributions] = useState([]);
  const [allPendingLoans, setAllPendingLoans] = useState([]);
  const [allLoansLeadership, setAllLoansLeadership] = useState([]);
  const [allPendingClaims, setAllPendingClaims] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Profile Settings Form State
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editIdNumber, setEditIdNumber] = useState('');
  const [editCompanyId, setEditCompanyId] = useState('');

  // Directory Search State
  const [memberDirectorySearch, setMemberDirectorySearch] = useState('');
  const [memberDirectoryCompanyFilter, setMemberDirectoryCompanyFilter] = useState('all');
  const [guarantorTrackerSearch, setGuarantorTrackerSearch] = useState('');

  // Manual Member Adjustment Form State
  const [manualTargetMemberId, setManualTargetMemberId] = useState('');
  const [manualAdjustmentType, setManualAdjustmentType] = useState('loan_repayment');
  const [manualAmountRaw, setManualAmountRaw] = useState('');
  const [manualRefCode, setManualRefCode] = useState('');

  // Historical Migration Engine State
  const [migrationFile, setMigrationFile] = useState(null);

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
  const [loanPrincipalRaw, setLoanPrincipalRaw] = useState('20,000');
  const [loanMonths, setLoanMonths] = useState(12);
  const [interestRate, setInterestRate] = useState(1.0);
  const [guarantorList, setGuarantorList] = useState([
    { guarantorId: '', searchTerm: '', amountRaw: '', eligible: true, note: '', dropdownOpen: false }
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
  const [claimAmountRaw, setClaimAmountRaw] = useState('');
  const [claimDesc, setClaimDesc] = useState('');
  const [claimDocument, setClaimDocument] = useState(null);

  // M-Pesa State
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaAmountRaw, setMpesaAmountRaw] = useState('');
  const [mpesaType, setMpesaType] = useState('savings_deposit');
  const [mpesaCode, setMpesaCode] = useState('');

  // Admin Hub Batch State
  const [batchPreview, setBatchPreview] = useState([]);
  const [batchMonth, setBatchMonth] = useState('AUG-2026');
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('general');

  // Accounting Formatter Helper
  const formatAccountingNumber = (val) => {
    if (!val) return '';
    const cleanNum = val.toString().replace(/[^0-9]/g, '');
    if (!cleanNum) return '';
    return Number(cleanNum).toLocaleString('en-KE');
  };

  const parseAccountingNumber = (val) => {
    if (!val) return 0;
    const clean = val.toString().replace(/[^0-9]/g, '');
    return clean ? Number(clean) : 0;
  };

  const handlePerformSignOut = async (timeoutReason = false) => {
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
    
    if (email) {
      localStorage.setItem('kewa_remembered_email', email);
      setSavedEmailChip(email);
    }
    setEmail(''); 

    await supabase.auth.signOut();

    if (timeoutReason) {
      setMessage({
        text: 'You were signed out automatically due to 5 minutes of inactivity for your account security.',
        type: 'error'
      });
    }
  };

  useEffect(() => {
    if (!session || authMode === 'reset') return;

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
  }, [session, authMode]);

  useEffect(() => {
    const hashParams = window.location.hash;
    if (hashParams && hashParams.includes('type=recovery')) {
      setAuthMode('reset');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (hashParams && hashParams.includes('type=recovery')) {
        setAuthMode('reset');
      } else {
        setSession(session);
        if (session) fetchUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthMode('reset');
        setSession(null);
      } else {
        if (authMode !== 'reset') {
          setSession(session);
          if (session) {
            fetchUserData(session.user.id);
          }
        }
      }

      if (!session && event !== 'PASSWORD_RECOVERY') {
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
    fetchAnnouncements();
    if (activeTab === 'documents') {
      fetchSaccoDocuments();
    } else if (activeTab === 'support' && session) {
      fetchMemberInquiries(session.user.id);
    } else if (activeTab === 'admin' && session) {
      fetchAdminData();
    } else if (activeTab === 'guarantors' && session) {
      fetchGuarantorData(session.user.id);
    } else if (activeTab === 'beneficiaries' && session) {
      fetchBeneficiaries(session.user.id);
      fetchWelfareClaims(session.user.id);
    }
  }, [activeTab, session]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleLoanProductChange = (prod) => {
    setLoanProduct(prod);
    if (prod === 'main_loan') {
      setLoanMonths(12);
      setInterestRate(1.0);
      setLoanPrincipalRaw('30,000');
    } else if (prod === 'emergency_loan') {
      setLoanMonths(6);
      setInterestRate(1.0);
      setLoanPrincipalRaw('15,000');
    } else if (prod === 'christmas_loan') {
      setLoanMonths(4);
      setInterestRate(1.0);
      setLoanPrincipalRaw('10,000');
    } else if (prod === 'monthly_shylock') {
      setLoanMonths(1);
      setInterestRate(5.0);
      setLoanPrincipalRaw('5,000');
    }
  };

  const logAuditAction = async (action, details, userId = null, userName = null) => {
    try {
      const activeName = userName || profile?.full_name || email || 'Member';
      const activeMemberNo = profile?.member_number ? ` (No: ${profile.member_number})` : '';
      const formattedName = `${activeName}${activeMemberNo}`;

      await supabase.from('audit_logs').insert([
        {
          user_id: userId || session?.user?.id || null,
          user_name: formattedName,
          action,
          details,
        },
      ]);
      if (session && activeTab === 'admin') fetchAdminData();
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
      setEditFullName(profileData.full_name || '');
      setEditPhone(profileData.phone || '');
      setEditIdNumber(profileData.id_number || '');
      setEditCompanyId(profileData.company_id || '');

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

  const handleUpdateProfileDetails = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editFullName,
        phone: editPhone,
        id_number: editIdNumber,
        company_id: editCompanyId,
      })
      .eq('id', session.user.id);

    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      logAuditAction('PROFILE_UPDATED', `Member updated personal details and contact info`);
      setMessage({ text: 'Profile details updated successfully!', type: 'success' });
      fetchUserData(session.user.id);
    }
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
      .select('id, full_name, member_number, id_number, phone, email, role, created_at, companies(id, name), savings_ledger(amount), loans(balance_remaining, status)')
      .order('full_name', { ascending: true });
    
    if (data) {
      const formatted = data.map((m) => {
        const totalMemberSavings = (m.savings_ledger || []).reduce((acc, s) => acc + Number(s.amount || 0), 0);
        const totalMemberLoans = (m.loans || [])
          .filter((l) => ['approved', 'disbursed'].includes(l.status))
          .reduce((acc, l) => acc + Number(l.balance_remaining || 0), 0);
        
        const unencumbered = Math.max(0, totalMemberSavings - totalMemberLoans);

        return {
          ...m,
          totalSavings: totalMemberSavings,
          totalActiveDebt: totalMemberLoans,
          unencumberedShares: unencumbered,
        };
      });

      setAllMembers(formatted);
      if (!manualTargetMemberId && formatted.length > 0) {
        setManualTargetMemberId(formatted[0].id);
      }
    }
  };

  const fetchGuarantorData = async (userId) => {
    const { data: requests } = await supabase
      .from('loan_guarantors')
      .select('*, loans(*)')
      .eq('guarantor_id', userId)
      .order('created_at', { ascending: false });

    if (requests) {
      setGuarantorRequests(requests);
    }

    const { data: activeGuarantees } = await supabase
      .from('loan_guarantors')
      .select('*, loans(status, balance_remaining)')
      .eq('guarantor_id', userId)
      .eq('status', 'accepted');
    
    if (activeGuarantees) {
      const activeRunning = activeGuarantees.filter(
        (g) => (g.loans?.status === 'approved' || g.loans?.status === 'disbursed') && Number(g.loans?.balance_remaining || 0) > 0
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
    fetchAllMembers(session?.user?.id);

    const { data: pendingLoans } = await supabase
      .from('loans')
      .select('*, profiles(full_name, member_number, companies(name)), loan_guarantors(*, profiles:guarantor_id(full_name, member_number))')
      .in('status', ['pending', 'guaranteed']);
    if (pendingLoans) setAllPendingLoans(pendingLoans);

    const { data: allLeadershipLoans } = await supabase
      .from('loans')
      .select('*, profiles(full_name, member_number, phone, companies(name)), loan_repayments(amount)')
      .order('created_at', { ascending: false });
    if (allLeadershipLoans) setAllLoansLeadership(allLeadershipLoans);

    const { data: allGuarantors } = await supabase
      .from('loan_guarantors')
      .select('*, profiles:guarantor_id(full_name, member_number, phone), loans(*, profiles:member_id(full_name, member_number, companies(name)))')
      .order('created_at', { ascending: false });
    if (allGuarantors) setAllSystemGuarantors(allGuarantors);

    const { data: claims } = await supabase
      .from('welfare_claims')
      .select('*, profiles(full_name, member_number, companies(name))');
    if (claims) {
      const activePendingClaims = claims.filter(c => c.status === 'pending' || !c.treasurer_approval);
      setAllPendingClaims(activePendingClaims);
    }

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

    if (email) {
      localStorage.setItem('kewa_remembered_email', email);
      setSavedEmailChip(email);
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      await logAuditAction('LOGIN', `Member logged in successfully`, data?.user?.id, data?.user?.email);
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
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      logAuditAction('PASSWORD_UPDATED', `User successfully reset account password`);
      setMessage({ text: 'Password updated successfully! Please sign in with your new password.', type: 'success' });
      await supabase.auth.signOut();
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
      if (email) {
        localStorage.setItem('kewa_remembered_email', email);
        setSavedEmailChip(email);
      }

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

  const handleManualMemberAdjustment = async (e) => {
    e.preventDefault();
    const parsedAmount = parseAccountingNumber(manualAmountRaw);
    if (!manualTargetMemberId || parsedAmount <= 0) {
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
          amount: parsedAmount,
          transaction_type: 'monthly_contribution',
          reference_code: refCode,
        },
      ]);

      if (!error) {
        logAuditAction('MANUAL_SAVINGS_CREDIT', `Official posted KES ${parsedAmount.toLocaleString()} to ${targetMember?.full_name} (${refCode})`);
        setMessage({ text: `Success! KES ${parsedAmount.toLocaleString()} credited to ${targetMember?.full_name}'s Savings.`, type: 'success' });
        setManualAmountRaw('');
        setManualRefCode('');
      } else {
        setMessage({ text: error.message, type: 'error' });
      }
    } else if (manualAdjustmentType === 'welfare_monthly_200') {
      await supabase.from('welfare_contributions').insert([
        {
          member_id: manualTargetMemberId,
          amount: parsedAmount,
          period_month: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase(),
          payment_method: 'direct_cash',
          reference_code: refCode,
        },
      ]);

      logAuditAction('WELFARE_BENEVOLENT_CREDIT', `Posted KES ${parsedAmount.toLocaleString()} Welfare Fund to ${targetMember?.full_name}`);
      setMessage({ text: `Success! KES ${parsedAmount.toLocaleString()} credited to ${targetMember?.full_name}'s Welfare Benevolent Account.`, type: 'success' });
      setManualAmountRaw('');
      setManualRefCode('');
    } else if (manualAdjustmentType === 'loan_repayment') {
      const { data: memberActiveLoans } = await supabase
        .from('loans')
        .select('id, balance_remaining, loan_product')
        .eq('member_id', manualTargetMemberId)
        .in('status', ['approved', 'disbursed'])
        .order('created_at', { ascending: true });

      if (!memberActiveLoans || memberActiveLoans.length === 0) {
        await supabase.from('savings_ledger').insert([
          {
            member_id: manualTargetMemberId,
            amount: parsedAmount,
            transaction_type: 'excess_allocation',
            reference_code: `${refCode}-SAVINGS`,
          },
        ]);
        logAuditAction('AUTO_ROUTED_SAVINGS', `No active loans found. KES ${parsedAmount.toLocaleString()} credited to ${targetMember?.full_name}'s Savings.`);
        setMessage({ text: `Notice: Member has no active loans. KES ${parsedAmount.toLocaleString()} was automatically credited to their Savings ledger.`, type: 'success' });
        setManualAmountRaw('');
        setManualRefCode('');
        setLoading(false);
        fetchAdminData();
        fetchUserData(session.user.id);
        return;
      }

      let remainingCash = parsedAmount;
      let distributionLog = [];

      for (const loan of memberActiveLoans) {
        if (remainingCash <= 0) break;
        const currentBal = Number(loan.balance_remaining || 0);
        if (currentBal <= 0) continue;

        const amountToDeduct = Math.min(remainingCash, currentBal);
        remainingCash -= amountToDeduct;
        const newLoanBal = currentBal - amountToDeduct;

        await supabase.from('loan_repayments').insert([
          {
            loan_id: loan.id,
            member_id: manualTargetMemberId,
            amount: amountToDeduct,
            reference_code: refCode,
          },
        ]);

        const isCleared = newLoanBal === 0;
        await supabase
          .from('loans')
          .update({
            balance_remaining: newLoanBal,
            status: isCleared ? 'completed' : 'approved',
          })
          .eq('id', loan.id);

        if (isCleared) {
          await supabase
            .from('loan_guarantors')
            .update({ status: 'released' })
            .eq('loan_id', loan.id);
        }

        distributionLog.push(`KES ${amountToDeduct.toLocaleString()} applied to ${(loan.loan_product || 'loan').toUpperCase()}${isCleared ? ' (CLEARED & GUARANTORS RELEASED ✓)' : ''}`);
      }

      if (remainingCash > 0) {
        await supabase.from('savings_ledger').insert([
          {
            member_id: manualTargetMemberId,
            amount: remainingCash,
            transaction_type: 'excess_allocation',
            reference_code: `${refCode}-EXCESS-SAVINGS`,
          },
        ]);
        distributionLog.push(`KES ${remainingCash.toLocaleString()} posted to Savings`);
      }

      logAuditAction('EXACT_STANDARD_REPAYMENT', `Processed KES ${parsedAmount.toLocaleString()} for ${targetMember?.full_name}: ${distributionLog.join(' | ')}`);
      setMessage({ 
        text: `Success! KES ${parsedAmount.toLocaleString()} posted: ${distributionLog.join(' | ')}.`, 
        type: 'success' 
      });
      setManualAmountRaw('');
      setManualRefCode('');
    }

    fetchAdminData();
    fetchUserData(session.user.id);
    setLoading(false);
  };

  const handleExecuteHistoricalMigration = (e) => {
    e.preventDefault();
    if (!migrationFile) {
      alert('Please select an Excel/CSV migration file containing existing SACCO balances.');
      return;
    }

    setLoading(true);
    Papa.parse(migrationFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        let successCount = 0;
        let errorCount = 0;

        for (const row of rows) {
          const memberNo = (row.member_number || row.MemberNo || '').toString().trim();
          const existingSavings = parseFloat(row.total_shares || row.savings || 0);
          
          const loan1Bal = parseFloat(row.main_loan_balance || row.loan_balance_1 || 0);
          const loan1Original = parseFloat(row.main_loan_original || row.loan_original_1 || loan1Bal);

          const loan2Bal = parseFloat(row.emergency_loan_balance || row.loan_balance_2 || 0);
          const loan2Original = parseFloat(row.emergency_loan_original || row.loan_original_2 || loan2Bal);

          const loan3Bal = parseFloat(row.christmas_loan_balance || row.loan_balance_3 || 0);
          const loan3Original = parseFloat(row.christmas_loan_original || row.loan_original_3 || loan3Bal);

          const target = allMembers.find(m => m.member_number?.toLowerCase() === memberNo.toLowerCase());

          if (target) {
            if (existingSavings > 0) {
              await supabase.from('savings_ledger').insert([
                {
                  member_id: target.id,
                  amount: existingSavings,
                  transaction_type: 'opening_balance',
                  reference_code: 'HISTORICAL-MIGRATION-SAVINGS',
                }
              ]);
            }

            const insertLegacyLoan = async (prodType, originalAmt, currentBal) => {
              if (currentBal > 0) {
                await supabase.from('loans').insert([
                  {
                    member_id: target.id,
                    loan_product: prodType,
                    principal_amount: originalAmt,
                    interest_rate: 1.0,
                    repayment_period_months: 12,
                    total_payable: originalAmt * 1.12,
                    balance_remaining: currentBal,
                    status: 'approved',
                    assistant_chair_approval: true,
                    chairman_approval: true,
                    treasurer_approval: true,
                  }
                ]);
              }
            };

            await insertLegacyLoan('main_loan', loan1Original, loan1Bal);
            await insertLegacyLoan('emergency_loan', loan2Original, loan2Bal);
            await insertLegacyLoan('christmas_loan', loan3Original, loan3Bal);

            successCount++;
          } else {
            errorCount++;
          }
        }

        logAuditAction('HISTORICAL_DATA_MIGRATED', `Imported multi-product ledgers for ${successCount} members (${errorCount} unmatched)`);
        setMessage({ 
          text: `Migration Complete! Successfully loaded multi-loan records for ${successCount} members.`, 
          type: 'success' 
        });
        fetchAdminData();
        fetchUserData(session.user.id);
        setLoading(false);
        setMigrationFile(null);
      }
    });
  };

  // Executive financial totals calculation
  const totalSocietySharesCapital = allMembers.reduce((acc, m) => acc + Number(m.totalSavings || 0), 0);
  const totalSocietyUnpaidLoans = allLoansLeadership
    .filter(l => ['approved', 'disbursed'].includes(l.status))
    .reduce((acc, l) => acc + Number(l.balance_remaining || 0), 0);
  
  const totalSocietyInterestAccrued = allLoansLeadership
    .filter(l => ['approved', 'disbursed', 'completed'].includes(l.status))
    .reduce((acc, l) => {
      const remainingBalance = Number(l.balance_remaining || 0);
      const rate = Number(l.interest_rate || 1.0) / 100;
      return acc + (remainingBalance * rate);
    }, 0);

  const totalSocietyDisbursedPrincipal = allLoansLeadership
    .filter(l => ['approved', 'disbursed', 'completed'].includes(l.status))
    .reduce((acc, l) => acc + Number(l.principal_amount || 0), 0);

  const totalSocietyRepaymentsCollected = allLoansLeadership.reduce((acc, l) => {
    const loanReps = (l.loan_repayments || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
    return acc + loanReps;
  }, 0);

  const netSocietyLiquidity = (totalSocietySharesCapital + totalSocietyRepaymentsCollected) - totalSocietyDisbursedPrincipal;

  const totalSavings = savings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const activeLoanBalance = loans
    .filter((l) => (l.status === 'approved' || l.status === 'disbursed') && Number(l.balance_remaining || 0) > 0)
    .reduce((acc, curr) => acc + Number(curr.balance_remaining || 0), 0);

  const totalGuaranteesCommittedAmount = myGuaranteesCommitted.reduce(
    (acc, curr) => acc + Number(curr.amount_guaranteed || 0),
    0
  );

  const freeSharesAvailable = Math.max(0, totalSavings - activeLoanBalance - totalGuaranteesCommittedAmount);
  
  const maxLimitForSelectedProduct = loanProduct === 'monthly_shylock'
    ? 20000 
    : Math.max(totalSavings * 3, 10000);

  const loanPrincipalNum = parseAccountingNumber(loanPrincipalRaw);
  const monthlyRate = interestRate / 100;
  const calculatedTotal = loanPrincipalNum * (1 + (monthlyRate * (loanMonths + 1) / 2));
  const monthlyInstallment = calculatedTotal / loanMonths;

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

  const selectGuarantorFromSearch = (index, member) => {
    const updated = [...guarantorList];
    updated[index].guarantorId = member.id;
    updated[index].searchTerm = `${member.full_name} (${member.member_number}) - ${member.companies?.name || 'External'}`;
    updated[index].dropdownOpen = false;
    setGuarantorList(updated);

    checkBlindGuarantorEligibility(index, member.id, parseAccountingNumber(updated[index].amountRaw));
  };

  const checkBlindGuarantorEligibility = (index, memberId, currentPledgeAmount = 0) => {
    const updated = [...guarantorList];

    if (!memberId) {
      updated[index].eligible = true;
      updated[index].note = '';
      setGuarantorList(updated);
      return;
    }

    const matchedColleague = allMembers.find(m => m.id === memberId);
    const calculatedFreeShares = matchedColleague ? Number(matchedColleague.unencumberedShares || 0) : 0;

    let isEligible = true;
    let noteMsg = '';

    if (calculatedFreeShares <= 0) {
      isEligible = false;
      noteMsg = '⚠️ Ineligible: Colleague currently has no unencumbered Free Shares available.';
    } else if (currentPledgeAmount > 0 && currentPledgeAmount > calculatedFreeShares) {
      isEligible = false;
      noteMsg = '⚠️ Insufficient Free Shares: Colleague cannot cover this requested pledge amount.';
    } else {
      isEligible = true;
      noteMsg = '✓ Eligible: Colleague has sufficient Free Shares for this pledge amount.';
    }

    updated[index].eligible = isEligible;
    updated[index].note = noteMsg;
    setGuarantorList(updated);
  };

  const addGuarantorRow = () => {
    setGuarantorList([...guarantorList, { guarantorId: '', searchTerm: '', amountRaw: '', eligible: true, note: '', dropdownOpen: false }]);
  };

  const removeGuarantorRow = (index) => {
    const updated = guarantorList.filter((_, i) => i !== index);
    setGuarantorList(updated.length > 0 ? updated : [{ guarantorId: '', searchTerm: '', amountRaw: '', eligible: true, note: '', dropdownOpen: false }]);
  };

  const updateGuarantorRow = (index, field, value) => {
    const updated = [...guarantorList];
    if (field === 'amountRaw') {
      updated[index][field] = formatAccountingNumber(value);
      if (updated[index].guarantorId) {
        checkBlindGuarantorEligibility(index, updated[index].guarantorId, parseAccountingNumber(value));
      }
    } else {
      updated[index][field] = value;
    }
    setGuarantorList(updated);
  };

  const handleInitiateLoan = (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (loanPrincipalNum > maxLimitForSelectedProduct) {
      setMessage({ text: `Loan exceeds maximum limit of KES ${maxLimitForSelectedProduct.toLocaleString()}.`, type: 'error' });
      return;
    }

    if (loanProduct !== 'monthly_shylock') {
      const validGuarantors = guarantorList.filter((g) => g.guarantorId && parseAccountingNumber(g.amountRaw) > 0);
      if (validGuarantors.length === 0) {
        setMessage({ text: 'Please assign at least 1 guarantor for this loan product.', type: 'error' });
        return;
      }

      const totalGuaranteedSum = validGuarantors.reduce((acc, g) => acc + parseAccountingNumber(g.amountRaw), 0);
      if (totalGuaranteedSum < loanPrincipalNum) {
        setMessage({ 
          text: `Guarantor Validation Error: Total pledged guarantees (KES ${totalGuaranteedSum.toLocaleString()}) do not match or cover the requested loan principal (KES ${loanPrincipalNum.toLocaleString()}).`, 
          type: 'error' 
        });
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

    const validGuarantors = guarantorList.filter((g) => g.guarantorId && parseAccountingNumber(g.amountRaw) > 0);

    const { data: loanData, error: loanError } = await supabase.from('loans').insert([
      {
        member_id: session.user.id,
        loan_product: loanProduct,
        principal_amount: loanPrincipalNum,
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
        amount_guaranteed: parseAccountingNumber(g.amountRaw),
        status: 'pending',
      }));
      await supabase.from('loan_guarantors').insert(guarantorsToInsert);
    }

    logAuditAction('LOAN_APPLICATION_SUBMITTED', `${loanProduct.toUpperCase()} applied: KES ${loanPrincipalNum.toLocaleString()} (Terms Accepted)`);

    setMessage({ text: `Loan submitted! Pipeline: Assistant Chair -> Chairman -> Treasurer.`, type: 'success' });
    setGuarantorList([{ guarantorId: '', searchTerm: '', amountRaw: '', eligible: true, note: '', dropdownOpen: false }]);
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
    .sort((a, b) => a.progressPercent - b.progressPercent);

  const filteredMemberDirectory = allMembers.filter((m) => {
    const matchesSearch =
      (m.full_name?.toLowerCase() || '').includes(memberDirectorySearch.toLowerCase()) ||
      (m.member_number?.toLowerCase() || '').includes(memberDirectorySearch.toLowerCase()) ||
      (m.id_number?.toLowerCase() || '').includes(memberDirectorySearch.toLowerCase()) ||
      (m.phone?.toLowerCase() || '').includes(memberDirectorySearch.toLowerCase());

    const matchesCompany =
      memberDirectoryCompanyFilter === 'all' ||
      (m.companies?.name?.toLowerCase() || '').includes(memberDirectoryCompanyFilter.toLowerCase());

    return matchesSearch && matchesCompany;
  });

  const filteredGuarantorInspectionList = allSystemGuarantors.filter((g) => {
    const guarantorName = g.profiles?.full_name?.toLowerCase() || '';
    const guarantorNo = g.profiles?.member_number?.toLowerCase() || '';
    const borrowerName = g.loans?.profiles?.full_name?.toLowerCase() || '';
    const borrowerNo = g.loans?.profiles?.member_number?.toLowerCase() || '';
    const search = guarantorTrackerSearch.toLowerCase();

    return guarantorName.includes(search) || guarantorNo.includes(search) || borrowerName.includes(search) || borrowerNo.includes(search);
  });

  const userRole = profile?.role || 'member';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 sm:pb-12 selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-3 sm:px-8 py-2.5 sm:py-3.5 flex justify-between items-center sticky top-0 z-50 shadow-lg shadow-black/40">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-400 p-2 rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-900/40">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-white leading-tight">KEWA SACCO</h1>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full border border-emerald-800 flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> Core
              </span>
            </div>
            <p className="text-[9px] sm:text-xs text-slate-400 font-medium">Kenya Builders • Warren • Eurocon • External</p>
          </div>
        </div>

        {session && authMode !== 'reset' && (
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
                Profile & Welfare
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
              {['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(userRole) && (
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
              className="lg:hidden flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 text-white shadow"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-rose-400" /> : <Menu className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        )}
      </header>

      {/* Fixed Full-Screen Mobile Drawer */}
      {session && authMode !== 'reset' && mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[52px] bg-slate-950/98 backdrop-blur-2xl z-[100] px-4 py-5 space-y-2.5 overflow-y-auto border-t border-slate-800 animate-fadeIn">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl mb-3 flex items-center justify-between">
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
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'overview' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
            }`}
          >
            <PiggyBank className="w-4 h-4" /> Overview Dashboard
          </button>
          
          <button
            onClick={() => { setActiveTab('loans'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'loans' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
            }`}
          >
            <Calculator className="w-4 h-4" /> Loan Products & Limits
          </button>

          <button
            onClick={() => { setActiveTab('guarantors'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'guarantors' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
            }`}
          >
            <span className="flex items-center gap-3">
              <Users className="w-4 h-4" /> Guarantor Requests
            </span>
            {pendingGuaranteesCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {pendingGuaranteesCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('documents'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'documents' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
            }`}
          >
            <FolderDown className="w-4 h-4 text-emerald-400" /> Reports & AGM Booklets
          </button>

          <button
            onClick={() => { setActiveTab('beneficiaries'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'beneficiaries' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
            }`}
          >
            <Settings className="w-4 h-4" /> Profile Settings & Welfare
          </button>

          <button
            onClick={() => { setActiveTab('mpesa'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'mpesa' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-300 border border-slate-800/80'
            }`}
          >
            <Smartphone className="w-4 h-4" /> M-Pesa Top-Up & Repay
          </button>

          <button
            onClick={() => { setActiveTab('support'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'support' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'bg-slate-900/80 text-emerald-300 border border-slate-800/80'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Helpdesk, Bot & Officials Chat
          </button>

          {['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(userRole) && (
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                activeTab === 'admin' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg' : 'bg-slate-900/80 text-amber-300 border border-slate-800/80'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> 3-Signatory Leadership Hub
            </button>
          )}

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => handlePerformSignOut(false)}
              className="w-full flex items-center justify-center gap-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 py-3 rounded-xl text-xs font-bold shadow cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out of Portal
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-3 sm:p-8 space-y-4 sm:space-y-6">
        {message.text && (
          <div
            className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium border shadow-lg flex items-center justify-between animate-fadeIn ${
              message.type === 'error'
                ? 'bg-rose-950/50 border-rose-800/80 text-rose-200'
                : 'bg-emerald-950/50 border-emerald-800/80 text-emerald-200'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage({ text: '', type: '' })} className="text-xs opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {!session || authMode === 'reset' ? (
          /* AUTH VIEWS */
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
              <p className="text-xs text-slate-400 mt-1 font-medium">
                {authMode === 'login' && 'Access your digital cooperative portal'}
                {authMode === 'register' && 'Register as internal staff or external member'}
                {authMode === 'forgot' && 'Receive an email link to regain access'}
                {authMode === 'reset' && 'Enter your replacement account password'}
              </p>
            </div>

            {authMode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-3.5" autoComplete="off">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-emerald-500 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition shadow-lg cursor-pointer"
                >
                  {loading ? 'Sending link...' : 'Send Password Reset Link'}
                </button>
                <div className="text-center mt-3">
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
              <form onSubmit={handleUpdatePassword} className="space-y-3.5" autoComplete="off">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enter New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white focus:border-emerald-500 transition"
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
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition shadow-lg cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save New Password & Sign In'}
                </button>
              </form>
            )}

            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-3.5" autoComplete="off">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-300">Email Address</label>
                    {savedEmailChip && !email && (
                      <button
                        type="button"
                        onClick={() => setEmail(savedEmailChip)}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full transition cursor-pointer"
                        title="Click to auto-fill your last used email"
                      >
                        <AtSign className="w-3 h-3" /> Use: {savedEmailChip}
                      </button>
                    )}
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[11px] text-emerald-400 hover:underline cursor-pointer font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white"
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
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition mt-1 shadow-lg cursor-pointer"
                >
                  {loading ? 'Processing...' : 'Sign In to Portal'}
                </button>
              </form>
            )}

            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5" autoComplete="off">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Affiliation / Branch</label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Member No.</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={memberNumber}
                      onChange={(e) => setMemberNumber(e.target.value)}
                      placeholder="KW-001"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white"
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

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="odpc"
                    required
                    checked={odpcConsent}
                    onChange={(e) => setOdpcConsent(e.target.checked)}
                    className="mt-0.5 accent-emerald-500 rounded"
                  />
                  <label htmlFor="odpc" className="text-[11px] text-slate-400 leading-tight">
                    I consent to KEWA SACCO processing my data under the <strong>Kenya Data Protection Act (2019)</strong>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition mt-1 shadow-lg cursor-pointer"
                >
                  {loading ? 'Processing...' : 'Complete Registration'}
                </button>
              </form>
            )}

            <div className="text-center mt-5 text-xs text-slate-400 font-medium">
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
              ) : authMode === 'forgot' ? (
                <button onClick={() => setAuthMode('login')} className="text-emerald-400 hover:underline font-bold cursor-pointer">
                  Back to Sign In
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          /* AUTHENTICATED VIEWS */
          <>
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                    {profile?.companies?.name || 'KEWA Member'}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300 uppercase">
                    Role: {profile?.role ? profile.role.replace('_', ' ') : 'Member'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white mt-2 tracking-tight">{profile?.full_name}</h2>
                <p className="text-xs text-slate-400 font-medium">Member Number: <span className="text-slate-200 font-bold font-mono">{profile?.member_number}</span></p>
              </div>

              <button
                onClick={() => generatePDFStatement()}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-950/60 hover:bg-emerald-600 text-emerald-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-emerald-800 transition shadow cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Official Statement
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between shadow">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">Total Savings</p>
                      <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                        KES {totalSavings.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
                      </h3>
                    </div>
                    <div className="bg-emerald-950/80 border border-emerald-800/50 p-2.5 rounded-xl text-emerald-400 hidden sm:block">
                      <PiggyBank className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between shadow">
                    <div>
                      <p className="text-[11px] font-bold text-emerald-400">Free Shares</p>
                      <h3 className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">
                        KES {freeSharesAvailable.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
                      </h3>
                    </div>
                    <div className="bg-emerald-950/80 border border-emerald-800/50 p-2.5 rounded-xl text-emerald-400 hidden sm:block">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between shadow">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">Guarantees</p>
                      <h3 className="text-lg sm:text-xl font-black text-rose-400 mt-0.5">
                        KES {totalGuaranteesCommittedAmount.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
                      </h3>
                    </div>
                    <div className="bg-rose-950/80 border border-rose-800/50 p-2.5 rounded-xl text-rose-400 hidden sm:block">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between shadow">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">Active Debt</p>
                      <h3 className="text-lg sm:text-xl font-black text-amber-400 mt-0.5">
                        KES {activeLoanBalance.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
                      </h3>
                    </div>
                    <div className="bg-amber-950/80 border border-amber-800/50 p-2.5 rounded-xl text-amber-400 hidden sm:block">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {announcements.length > 0 && (
                  <div className="bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-bounce" />
                      <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Official Society Notices & Announcements</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {announcements.slice(0, 2).map((notice) => (
                        <div key={notice.id} className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1 shadow">
                          <div className="flex justify-between items-center text-[10px] text-slate-400">
                            <span className="text-emerald-400 font-bold uppercase">{notice.category || 'General'}</span>
                            <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-bold text-white text-xs sm:text-sm">{notice.title}</h4>
                          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">{notice.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm sm:text-base font-bold text-white">Monthly Savings Checkoff Ledger</h4>
                    </div>

                    {savings.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs">No contributions found.</div>
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
                                <td className="py-2 text-slate-300">{new Date(s.created_at).toLocaleDateString()}</td>
                                <td className="py-2 text-slate-400 font-mono">{s.reference_code || '-'}</td>
                                <td className="py-2 text-right font-bold text-emerald-400">
                                  +KES {Number(s.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowDownRight className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm sm:text-base font-bold text-white">Monthly Loan Repayments Ledger</h4>
                    </div>

                    {repayments.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs">No loan repayments deducted yet.</div>
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
                                <td className="py-2 text-slate-300">{new Date(r.created_at).toLocaleDateString()}</td>
                                <td className="py-2 text-slate-400 font-mono">{r.reference_code || '-'}</td>
                                <td className="py-2 text-right font-bold text-amber-400">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm sm:text-base font-bold text-white">Apply for a Loan</h3>
                    </div>
                    <div className="bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-xl text-[11px] font-bold text-emerald-300">
                      Max Limit: KES {maxLimitForSelectedProduct.toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => handleLoanProductChange('main_loan')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        loanProduct === 'main_loan' 
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">1. Main Loan</span>
                      <span className="text-[10px] text-slate-400">Reducing Balance (24 mos, 1%)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoanProductChange('emergency_loan')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        loanProduct === 'emergency_loan' 
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">2. Emergency Loan</span>
                      <span className="text-[10px] text-slate-400">School & Medical (12 mos)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoanProductChange('christmas_loan')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        loanProduct === 'christmas_loan' 
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">3. Christmas Loan</span>
                      <span className="text-[10px] text-slate-400">Festivities (6 mos)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoanProductChange('monthly_shylock')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        loanProduct === 'monthly_shylock' 
                          ? 'bg-amber-950/80 border-amber-500 text-white shadow' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block text-amber-400">4. Monthly Shylock</span>
                      <span className="text-[10px] text-slate-400">Instant Advance (1 mo)</span>
                    </button>
                  </div>

                  <form onSubmit={handleInitiateLoan} className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-300">Principal Amount (KES)</label>
                        <span className="text-emerald-400 font-bold text-xs">KES {loanPrincipalNum.toLocaleString()}</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={loanPrincipalRaw}
                        onChange={(e) => setLoanPrincipalRaw(formatAccountingNumber(e.target.value))}
                        placeholder="e.g. 20,000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-300">Repayment Period</label>
                        <span className="text-emerald-400 font-bold text-xs">{loanMonths} Month(s)</span>
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
                      <div className="border-t border-slate-800 pt-3 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Assign Member Guarantors</h4>
                            <p className="text-[10px] text-slate-400">Total pledges must cover loan principal (KES {loanPrincipalNum.toLocaleString()})</p>
                          </div>
                          <button
                            type="button"
                            onClick={addGuarantorRow}
                            className="flex items-center gap-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-[11px] px-2 py-1 rounded-lg cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>

                        {guarantorList.map((g, index) => {
                          const filteredColleagues = allMembers.filter((m) =>
                            m.id !== session.user.id && (
                              (m.full_name?.toLowerCase() || '').includes((g.searchTerm || '').toLowerCase()) ||
                              (m.member_number?.toLowerCase() || '').includes((g.searchTerm || '').toLowerCase()) ||
                              (m.companies?.name?.toLowerCase() || '').includes((g.searchTerm || '').toLowerCase())
                            )
                          );

                          return (
                            <div key={index} className="bg-slate-950 border border-slate-800 p-3 rounded-2xl space-y-2 relative">
                              <div className="flex flex-col sm:flex-row gap-2 items-center">
                                <div className="w-full sm:w-3/5 relative">
                                  <label className="block text-[10px] text-slate-400 mb-0.5 font-medium">Search Guarantor #{index + 1}</label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      required
                                      autoComplete="off"
                                      placeholder="Type name or number..."
                                      value={g.searchTerm}
                                      onChange={(e) => {
                                        updateGuarantorRow(index, 'searchTerm', e.target.value);
                                        updateGuarantorRow(index, 'dropdownOpen', true);
                                      }}
                                      onFocus={() => updateGuarantorRow(index, 'dropdownOpen', true)}
                                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white"
                                    />
                                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                  </div>

                                  {g.dropdownOpen && filteredColleagues.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-36 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 divide-y divide-slate-800">
                                      {filteredColleagues.slice(0, 8).map((colleague) => (
                                        <div
                                          key={colleague.id}
                                          onClick={() => selectGuarantorFromSearch(index, colleague)}
                                          className="p-2 hover:bg-slate-800 text-xs cursor-pointer text-slate-200 transition flex justify-between"
                                        >
                                          <span><strong>{colleague.full_name}</strong> ({colleague.member_number})</span>
                                          <span className="text-[10px] text-slate-400">{colleague.companies?.name || 'External'}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="w-full sm:w-2/5">
                                  <label className="block text-[10px] text-slate-400 mb-0.5 font-medium">Pledged (KES)</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. 5,000"
                                    value={g.amountRaw}
                                    onChange={(e) => updateGuarantorRow(index, 'amountRaw', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                                  />
                                </div>

                                {guarantorList.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeGuarantorRow(index)}
                                    className="self-end sm:self-center text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              {g.guarantorId && (
                                <div className={`p-2 rounded-xl text-[10px] font-semibold flex items-center gap-1.5 ${
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

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Selected Product:</span>
                        <span className="text-white font-bold capitalize">{loanProduct.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Interest Method:</span>
                        <span className="text-emerald-400 font-medium">Reducing Balance ({interestRate}% / mo)</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Approx. Total Payable:</span>
                        <span className="text-white font-medium">KES {calculatedTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="border-t border-slate-800 pt-1.5 flex justify-between text-xs font-bold text-emerald-400">
                        <span>Approx. Monthly Installment:</span>
                        <span>KES {monthlyInstallment.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg cursor-pointer"
                    >
                      Review Terms & Continue Application
                    </button>
                  </form>
                </div>

                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
                  <h3 className="text-sm sm:text-base font-bold text-white mb-3">My Loan Applications & Approval Tracker</h3>
                  {loans.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">No active or past loans found.</div>
                  ) : (
                    <div className="space-y-3">
                      {loans.map((l) => (
                        <div key={l.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                  l.status === 'approved' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' :
                                  l.status === 'completed' ? 'bg-blue-950 border border-blue-800 text-blue-300' :
                                  l.status === 'pending' ? 'bg-amber-950 border border-amber-800 text-amber-300' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  Status: {l.status}
                                </span>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 capitalize border border-slate-800">
                                  {(l.loan_product || 'main_loan').replace('_', ' ')}
                                </span>
                              </div>
                              <h4 className="text-base font-black text-white mt-1">
                                KES {Number(l.principal_amount).toLocaleString()}
                              </h4>
                              <p className="text-[11px] text-slate-400 font-medium">{l.repayment_period_months} Month(s) Term</p>
                            </div>
                            <button
                              onClick={() => generatePDFStatement(l)}
                              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-xl text-[11px] font-semibold border border-slate-800 cursor-pointer"
                            >
                              <Download className="w-3 h-3" /> PDF
                            </button>
                          </div>

                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 text-[10px] space-y-1">
                            <p className="text-slate-400 font-semibold mb-0.5">Signatory Pipeline Progress:</p>
                            <div className="grid grid-cols-3 gap-1 text-center font-mono">
                              <span className={`p-1 rounded-lg font-bold ${l.assistant_chair_approval ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-950 text-slate-500'}`}>
                                1. Asst: {l.assistant_chair_approval ? '✓' : 'PENDING'}
                              </span>
                              <span className={`p-1 rounded-lg font-bold ${l.chairman_approval ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-950 text-slate-500'}`}>
                                2. Chair: {l.chairman_approval ? '✓' : 'PENDING'}
                              </span>
                              <span className={`p-1 rounded-lg font-bold ${l.treasurer_approval ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-950 text-slate-500'}`}>
                                3. Treas: {l.treasurer_approval ? '✓' : 'PENDING'}
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

            {/* TAB 3: GUARANTORS */}
            {activeTab === 'guarantors' && (
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 shadow-lg">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm sm:text-base font-bold text-white">Guarantor Requests Received</h3>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Your Current Available Free Shares:</span>
                    <span className="text-emerald-400 font-black text-xs sm:text-sm">KES {freeSharesAvailable.toLocaleString()}</span>
                  </div>
                </div>

                {guarantorRequests.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">You have no pending guarantor requests.</div>
                ) : (
                  <div className="space-y-2.5">
                    {guarantorRequests.map((g) => {
                      const borrowerId = g.loans?.member_id;
                      const borrower = allMembers.find(m => m.id === borrowerId) || {};
                      const borrowerName = borrower.full_name || 'Cooperative Member';
                      const borrowerMemberNo = borrower.member_number || 'N/A';
                      const borrowerCompany = borrower.companies?.name || 'KEWA Sacco';

                      return (
                        <div key={g.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              g.status === 'accepted' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' :
                              g.status === 'pending' ? 'bg-amber-950 border border-amber-800 text-amber-300' : 'bg-rose-950 border border-rose-800 text-rose-300'
                            }`}>
                              Guarantee: {g.status}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-1">{borrowerName}</h4>
                            <p className="text-[11px] text-slate-400">{borrowerCompany} • Member {borrowerMemberNo}</p>
                            <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">
                              Pledged: KES {Number(g.amount_guaranteed).toLocaleString()} (Product: {(g.loans?.loan_product || 'main_loan').replace('_', ' ').toUpperCase()})
                            </p>
                          </div>

                          {g.status === 'pending' && (
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button
                                onClick={() => handleRespondGuarantor(g.id, 'accepted', g.amount_guaranteed)}
                                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Accept
                              </button>
                              <button
                                onClick={() => handleRespondGuarantor(g.id, 'rejected', g.amount_guaranteed)}
                                className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Decline
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: REPORTS & AGM */}
            {activeTab === 'documents' && (
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                      <FolderDown className="w-4 h-4 text-emerald-400" /> Official Reports & AGM Booklets
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      Access certified annual audit reports, AGM booklets, and society policies digitally.
                    </p>
                  </div>
                  <button
                    onClick={fetchSaccoDocuments}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition border border-slate-700"
                    title="Refresh Library"
                  >
                    <RotateCcw className="w-3 h-3" /> Refresh
                  </button>
                </div>

                {saccoDocs.length === 0 ? (
                  <div className="text-center py-12 border border-slate-800 rounded-2xl bg-slate-950">
                    <FileArchive className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-300">No official documents published yet.</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Leadership will upload the upcoming AGM and audit packages here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {saccoDocs.map((doc) => (
                      <div key={doc.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              doc.category === 'audit_report' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' :
                              doc.category === 'agm_booklet' ? 'bg-amber-950 border border-amber-800 text-amber-300' :
                              'bg-blue-950 border border-blue-800 text-blue-300'
                            }`}>
                              {doc.category.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">{doc.financial_year}</span>
                          </div>

                          <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">{doc.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <span>Size: {doc.file_size || 'PDF'}</span> • 
                            <span>Published: {new Date(doc.created_at).toLocaleDateString()}</span>
                          </p>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition shadow"
                          >
                            <Download className="w-3.5 h-3.5" /> Read / Download PDF
                          </a>
                          {['admin', 'chairman', 'treasurer', 'assistant_chair'].includes(userRole) && (
                            <button
                              onClick={() => handleDeleteSaccoDocument(doc.id, doc.title)}
                              className="bg-rose-950/60 hover:bg-rose-900 border border-rose-900/60 text-rose-300 p-2 rounded-xl text-xs transition cursor-pointer"
                              title="Delete Report"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: PROFILE SETTINGS & WELFARE */}
            {activeTab === 'beneficiaries' && (
              <div className="space-y-6">
                {/* Profile Settings Card */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm sm:text-base font-bold text-white">Profile Settings & Contact Information</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 font-medium">
                    Update your registered personal details, phone number, and branch affiliation.
                  </p>

                  <form onSubmit={handleUpdateProfileDetails} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={editFullName}
                          onChange={(e) => setEditFullName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">National ID Number</label>
                        <input
                          type="text"
                          required
                          value={editIdNumber}
                          onChange={(e) => setEditIdNumber(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Branch / Company Affiliation</label>
                        <select
                          value={editCompanyId}
                          onChange={(e) => setEditCompanyId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          {companies.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 rounded-xl text-xs transition shadow cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm sm:text-base font-bold text-white">Nominated Beneficiaries (Next of Kin)</h3>
                    </div>

                    <form onSubmit={handleAddBeneficiary} className="space-y-2.5">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          autoComplete="off"
                          value={nokName}
                          onChange={(e) => setNokName(e.target.value)}
                          placeholder="e.g. Mary Atieno"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Relationship</label>
                          <select
                            value={nokRel}
                            onChange={(e) => setNokRel(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
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
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
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
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
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
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition shadow cursor-pointer"
                      >
                        Save Beneficiary
                      </button>
                    </form>

                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                      {beneficiaries.map((b) => (
                        <div key={b.id} className="bg-slate-950 p-2.5 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <h5 className="font-bold text-white text-xs">{b.full_name} ({b.relationship})</h5>
                            <p className="text-[10px] text-slate-400">Phone: {b.phone} • ID: {b.id_number || '-'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-800">
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

                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <HeartHandshake className="w-4 h-4 text-rose-400" />
                      <h3 className="text-sm sm:text-base font-bold text-white">Benevolent & Welfare Claims</h3>
                    </div>

                    <form onSubmit={handleSubmitWelfareClaim} className="space-y-2.5">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Claim Category</label>
                        <select
                          value={claimType}
                          onChange={(e) => setClaimType(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                        >
                          <option value="hospitalization">Hospitalization / Medical Assistance</option>
                          <option value="bereavement">Bereavement Support</option>
                          <option value="disaster">Emergency Relief / Disaster</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Amount Claimed (KES)</label>
                        <input
                          type="text"
                          required
                          value={claimAmountRaw}
                          onChange={(e) => setClaimAmountRaw(formatAccountingNumber(e.target.value))}
                          placeholder="e.g. 20,000"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
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
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
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
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-rose-900/60 file:text-rose-200 cursor-pointer"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded-xl text-xs transition shadow cursor-pointer"
                      >
                        Submit Welfare Claim for Sequential Review
                      </button>
                    </form>

                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                      {welfareClaims.map((c) => (
                        <div key={c.id} className="bg-slate-950 p-3 rounded-2xl space-y-1.5 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                c.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                              }`}>
                                {c.status}
                              </span>
                              <h5 className="font-bold text-white capitalize mt-1 text-xs">{c.claim_type}</h5>
                              <p className="text-[10px] text-slate-400">{c.description}</p>
                            </div>
                            <span className="font-bold text-rose-400 text-xs">
                              KES {Number(c.amount_requested).toLocaleString()}
                            </span>
                          </div>

                          {c.evidence_url && (
                            <a
                              href={c.evidence_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:underline"
                            >
                              <FileCheck className="w-3.5 h-3.5" /> View Uploaded Evidence Document
                            </a>
                          )}

                          <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-center pt-1 border-t border-slate-800/60">
                            <span className={c.assistant_chair_approval ? 'text-emerald-400 font-bold' : 'text-slate-500'}>1. Asst: {c.assistant_chair_approval ? '✓' : 'PENDING'}</span>
                            <span className={c.chairman_approval ? 'text-emerald-400 font-bold' : 'text-slate-500'}>2. Chair: {c.chairman_approval ? '✓' : 'PENDING'}</span>
                            <span className={c.treasurer_approval ? 'text-emerald-400 font-bold' : 'text-slate-500'}>3. Treas: {c.treasurer_approval ? '✓' : 'PENDING'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: M-PESA */}
            {activeTab === 'mpesa' && (
              <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Direct M-Pesa Payment & Top-Up</h3>
                    <p className="text-[11px] text-slate-400">Instant Savings Deposit or Loan Repayment via M-Pesa</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-0.5 text-xs font-medium">
                  <p className="text-slate-300 font-bold">Paybill Instructions:</p>
                  <p className="text-slate-400">Business No: <strong className="text-white font-mono">522522</strong> (KEWA SACCO)</p>
                  <p className="text-slate-400">Account No: <strong className="text-emerald-400 font-mono">{profile?.member_number}</strong></p>
                </div>

                <form onSubmit={handleMpesaTransaction} className="space-y-3">
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
                      type="text"
                      required
                      value={mpesaAmountRaw}
                      onChange={(e) => setMpesaAmountRaw(formatAccountingNumber(e.target.value))}
                      placeholder="e.g. 3,000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">M-Pesa Transaction Code (Optional)</label>
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
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Confirm & Credit Account
                  </button>
                </form>
              </div>
            )}

            {/* TAB 7: HELP & CHAT */}
            {activeTab === 'support' && (
              <div className="space-y-4">
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">Direct Communication with SACCO Officials</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 font-medium">
                    Tap to open a pre-filled direct WhatsApp message or phone call with your elected executive committee.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between space-y-2.5">
                      <div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                          Executive Chairperson
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{chairmanOfficial.full_name}</h4>
                        <p className="text-[11px] text-slate-400">Governance & General Appeals</p>
                      </div>
                      <a
                        href={getWhatsAppLink(chairmanOfficial.phone, 'Chairman')}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
                      </a>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between space-y-2.5">
                      <div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                          Treasurer & Finance
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{treasurerOfficial.full_name}</h4>
                        <p className="text-[11px] text-slate-400">Disbursements & Checkoffs</p>
                      </div>
                      <a
                        href={getWhatsAppLink(treasurerOfficial.phone, 'Treasurer')}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
                      </a>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between space-y-2.5">
                      <div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                          Assistant Chairperson
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{asstChairOfficial.full_name}</h4>
                        <p className="text-[11px] text-slate-400">Guarantors & Welfare</p>
                      </div>
                      <a
                        href={getWhatsAppLink(asstChairOfficial.phone, 'Assistant Chair')}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col h-[440px] shadow-xl">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
                      <Bot className="w-4 h-4 text-emerald-400" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">KEWA SACCO AI Assistant</h4>
                        <p className="text-[10px] text-slate-400">Instant Automated Policy & Ledger Support</p>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto py-2.5 space-y-2.5 pr-1">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-2.5 rounded-2xl text-xs leading-relaxed ${
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
                        placeholder="Ask about loans, free shares..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </form>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-amber-400" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">Submit Internal Message / Ticket</h4>
                        <p className="text-[10px] text-slate-400">Formally logged in the system for committee action</p>
                      </div>
                    </div>

                    <form onSubmit={handleCreateInquiry} className="space-y-2.5" autoComplete="off">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-0.5">Inquiry Category</label>
                        <select
                          value={inquiryCategory}
                          onChange={(e) => setInquiryCategory(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                        >
                          <option value="loan_inquiry">Loan Application / Guarantor Inquiry</option>
                          <option value="savings_dispute">Payroll Checkoff / Savings Ledger Clarification</option>
                          <option value="welfare_support">Welfare / Benevolent Claim Follow-up</option>
                          <option value="general">General Society Inquiry / Feedback</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-0.5">Subject</label>
                        <input
                          type="text"
                          required
                          autoComplete="off"
                          value={inquirySubject}
                          onChange={(e) => setInquirySubject(e.target.value)}
                          placeholder="Brief summary..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-0.5">Detailed Message</label>
                        <textarea
                          required
                          rows="2"
                          value={inquiryMessage}
                          onChange={(e) => setInquiryMessage(e.target.value)}
                          placeholder="Provide details for leadership review..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit Message to Committee
                      </button>
                    </form>

                    <div className="pt-2 border-t border-slate-800 space-y-1.5 max-h-36 overflow-y-auto">
                      <p className="text-[10px] font-bold text-slate-300">My Past Submitted Inquiries:</p>
                      {inquiries.length === 0 ? (
                        <p className="text-[10px] text-slate-500">No tickets submitted yet.</p>
                      ) : (
                        inquiries.map((inq) => (
                          <div key={inq.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white text-[11px]">{inq.subject}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                                inq.status === 'resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                              }`}>
                                {inq.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400">{inq.message}</p>
                            {inq.admin_response && (
                              <div className="mt-1 p-1.5 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-[10px] text-emerald-300">
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

            {/* TAB 8: LEADERSHIP HUB */}
            {activeTab === 'admin' && ['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(userRole) && (
              <div className="space-y-4">
                
                <div className="bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-800/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex justify-between items-center shadow-lg">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-900 text-amber-200 uppercase tracking-wide">
                      Active Portfolio View: {userRole.replace('_', ' ').toUpperCase()}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      {userRole === 'chairman' || userRole === 'admin' ? 'Executive Control & Oversight Dashboard' :
                       userRole === 'treasurer' ? 'Treasurer & Financial Operations Desk' :
                       'Assistant Chair & Guarantor Verification Desk'}
                    </h3>
                  </div>
                  <span className="text-xs text-amber-300/80 font-mono hidden sm:inline">KEWA SACCO Governance Framework</span>
                </div>

                {/* 1. EXECUTIVE FINANCIAL OVERSIGHT METRICS */}
                {['admin', 'chairman'].includes(userRole) && (
                  <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Coins className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm sm:text-base font-bold text-white">Society-Wide Financial Position & Exposure Matrix</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Member Shares</p>
                        <h4 className="text-base sm:text-xl font-black text-white mt-1">
                          KES {totalSocietySharesCapital.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
                        </h4>
                        <span className="text-[9px] text-emerald-400 font-medium">All Branches Capital</span>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Accrued Interest</p>
                        <h4 className="text-base sm:text-xl font-black text-emerald-400 mt-1">
                          KES {totalSocietyInterestAccrued.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
                        </h4>
                        <span className="text-[9px] text-emerald-400 font-medium">Reducing Balance Returns</span>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Unpaid Loans</p>
                        <h4 className="text-base sm:text-xl font-black text-amber-400 mt-1">
                          KES {totalSocietyUnpaidLoans.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
                        </h4>
                        <span className="text-[9px] text-rose-400 font-medium">Gross Active Risk Exposure</span>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Net Liquid Capital</p>
                        <h4 className="text-base sm:text-xl font-black text-teal-300 mt-1">
                          KES {netSocietyLiquidity.toLocaleString('en-KE', { minimumFractionDigits: 0 })}
                        </h4>
                        <span className="text-[9px] text-teal-400 font-medium">Cash Reserve Available</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. GUARANTOR LIABILITY TRACKER MATRIX */}
                {['admin', 'chairman'].includes(userRole) && (
                  <div className="bg-slate-900/90 border border-purple-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2.5 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-purple-400" />
                          <h3 className="text-sm sm:text-base font-bold text-white">Guarantor Liability & Individual Tracking Matrix ({filteredGuarantorInspectionList.length})</h3>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                          Track individual guarantor liability. When a borrower fully repays a loan, guarantor liability is automatically released.
                        </p>
                      </div>

                      <button
                        onClick={fetchAdminData}
                        className="self-start sm:self-auto p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 text-xs font-semibold flex items-center gap-1 transition border border-slate-700"
                      >
                        <RotateCcw className="w-3 h-3" /> Refresh
                      </button>
                    </div>

                    <div className="mb-3 relative">
                      <input
                        type="text"
                        placeholder="Search by Guarantor Name, Borrower Name, or Member Number..."
                        value={guarantorTrackerSearch}
                        onChange={(e) => setGuarantorTrackerSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:border-purple-500"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>

                    {filteredGuarantorInspectionList.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
                        No guarantor records matched your search.
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950 max-h-72 overflow-y-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900 text-slate-400 font-semibold sticky top-0 z-10">
                            <tr>
                              <th className="p-2.5">Guarantor Details</th>
                              <th className="p-2.5">Borrower Details</th>
                              <th className="p-2.5 text-right">Pledged Amount</th>
                              <th className="p-2.5 text-right">Loan Balance</th>
                              <th className="p-2.5 text-center">Liability Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-mono">
                            {filteredGuarantorInspectionList.map((g) => {
                              const isLoanPaid = g.loans?.status === 'completed' || Number(g.loans?.balance_remaining || 0) === 0 || g.status === 'released';

                              return (
                                <tr key={g.id} className="hover:bg-slate-900/50 transition">
                                  <td className="p-2.5 font-sans">
                                    <div className="font-bold text-white">{g.profiles?.full_name || 'Member'}</div>
                                    <div className="text-[10px] text-purple-400 font-mono">{g.profiles?.member_number} • {g.profiles?.phone}</div>
                                  </td>
                                  <td className="p-2.5 font-sans">
                                    <div className="font-bold text-white">{g.loans?.profiles?.full_name || 'Borrower'}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">{g.loans?.profiles?.companies?.name || 'Branch'} ({g.loans?.profiles?.member_number})</div>
                                  </td>
                                  <td className="p-2.5 text-right font-bold text-emerald-400">
                                    KES {Number(g.amount_guaranteed || 0).toLocaleString()}
                                  </td>
                                  <td className="p-2.5 text-right font-bold text-amber-400">
                                    KES {Number(g.loans?.balance_remaining || 0).toLocaleString()}
                                  </td>
                                  <td className="p-2.5 text-center font-sans">
                                    {isLoanPaid ? (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-950 text-blue-300 border border-blue-800 flex items-center justify-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> RELEASED
                                      </span>
                                    ) : g.status === 'accepted' ? (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                                        ACTIVE LIABILITY
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                                        {g.status}
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
                )}

                {/* 3. WELFARE CLAIMS APPROVAL QUEUE */}
                <div className="bg-slate-900/90 border border-rose-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-rose-400" />
                      <h3 className="text-sm sm:text-base font-bold text-white">Benevolent & Welfare Claims Approval Queue ({allPendingClaims.length})</h3>
                    </div>
                    <button
                      onClick={fetchAdminData}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition border border-slate-700"
                    >
                      <RotateCcw className="w-3 h-3" /> Refresh
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 font-medium">
                    Review and endorse member benevolent fund claims through the 3-signatory workflow.
                  </p>

                  {allPendingClaims.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
                      No welfare claims awaiting signatory review.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allPendingClaims.map((claim) => {
                        const canChairSign = claim.assistant_chair_approval;
                        const canTreasurerSign = claim.assistant_chair_approval && claim.chairman_approval;

                        const isAsstChairUser = userRole === 'assistant_chair' || userRole === 'admin';
                        const isChairUser = userRole === 'chairman' || userRole === 'admin';
                        const isTreasurerUser = userRole === 'treasurer' || userRole === 'admin';

                        return (
                          <div key={claim.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-sm font-bold text-white">{claim.profiles?.full_name}</h4>
                                  <span className="bg-rose-950 text-rose-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-rose-800 uppercase">
                                    {claim.claim_type}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium">{claim.profiles?.companies?.name || 'External'} • Member {claim.profiles?.member_number}</p>
                                <p className="text-xs font-black text-rose-400 mt-0.5">
                                  KES {Number(claim.amount_requested).toLocaleString()}
                                </p>
                                <p className="text-[11px] text-slate-300 mt-0.5">{claim.description}</p>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5">
                                {claim.assistant_chair_approval ? (
                                  <button
                                    onClick={() => handleWelfarePipeline(claim.id, 'assistant_chair', 'unsign')}
                                    disabled={!isAsstChairUser}
                                    className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                                      isAsstChairUser
                                        ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                                        : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                                    }`}
                                  >
                                    <CheckCircle className="w-3 h-3" /> 1. Asst {isAsstChairUser && <RotateCcw className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleWelfarePipeline(claim.id, 'assistant_chair', 'sign')}
                                    disabled={!isAsstChairUser}
                                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow ${
                                      isAsstChairUser
                                        ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                                        : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    1. Sign: Asst
                                  </button>
                                )}

                                {claim.chairman_approval ? (
                                  <button
                                    onClick={() => handleWelfarePipeline(claim.id, 'chairman', 'unsign')}
                                    disabled={!isChairUser}
                                    className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                                      isChairUser
                                        ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                                        : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                                    }`}
                                  >
                                    <CheckCircle className="w-3 h-3" /> 2. Chair {isChairUser && <RotateCcw className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
                                  </button>
                                ) : (
                                  <button
                                    disabled={!canChairSign || !isChairUser}
                                    onClick={() => handleWelfarePipeline(claim.id, 'chairman', 'sign')}
                                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow ${
                                      canChairSign && isChairUser
                                        ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                                        : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    {(!canChairSign || !isChairUser) && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                                    2. Sign: Chair
                                  </button>
                                )}

                                {claim.treasurer_approval ? (
                                  <button
                                    onClick={() => handleWelfarePipeline(claim.id, 'treasurer', 'unsign')}
                                    disabled={!isTreasurerUser}
                                    className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                                      isTreasurerUser
                                        ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                                        : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                                    }`}
                                  >
                                    <CheckCircle className="w-3 h-3" /> 3. Treas {isTreasurerUser && <RotateCcw className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
                                  </button>
                                ) : (
                                  <button
                                    disabled={!canTreasurerSign || !isTreasurerUser}
                                    onClick={() => handleWelfarePipeline(claim.id, 'treasurer', 'sign')}
                                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow ${
                                      canTreasurerSign && isTreasurerUser
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer'
                                        : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    {(!canTreasurerSign || !isTreasurerUser) && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                                    3. Disburse
                                  </button>
                                )}
                              </div>
                            </div>

                            {claim.evidence_url && (
                              <div className="pt-2 border-t border-slate-800">
                                <a
                                  href={claim.evidence_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline font-medium"
                                >
                                  <FileCheck className="w-3.5 h-3.5" /> View Supporting Evidence Document
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. HISTORICAL DATA IMPORT ENGINE */}
                {['admin', 'chairman'].includes(userRole) && (
                  <div className="bg-slate-900/90 border border-cyan-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm sm:text-base font-bold text-white">Opening Balances & Historical Data Migration Desk</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 font-medium">
                      Upload your legacy Excel/CSV file (<code className="text-cyan-300 font-mono">member_number, total_shares, active_loan, loan_product</code>) to safely port all existing balances into KEWA SACCO.
                    </p>

                    <form onSubmit={handleExecuteHistoricalMigration} className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="file"
                        accept=".csv"
                        required
                        onChange={(e) => setMigrationFile(e.target.files[0])}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:bg-cyan-950 file:text-cyan-300 cursor-pointer"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1"
                      >
                        <UploadCloud className="w-3.5 h-3.5" /> Import Legacy Balances
                      </button>
                    </form>
                  </div>
                )}

                {/* 5. MEMBER DIRECTORY */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2.5 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Contact2 className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-sm sm:text-base font-bold text-white">Registered Members Directory ({filteredMemberDirectory.length})</h3>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        Complete cooperative register displaying demographics, active debt, and shares.
                      </p>
                    </div>

                    <button
                      onClick={fetchAdminData}
                      className="self-start sm:self-auto p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition border border-slate-700"
                    >
                      <RotateCcw className="w-3 h-3" /> Refresh
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
                    <div className="sm:col-span-2 relative">
                      <input
                        type="text"
                        placeholder="Search member by Name, Member No, ID, or Phone..."
                        value={memberDirectorySearch}
                        onChange={(e) => setMemberDirectorySearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:border-emerald-500"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>

                    <div>
                      <select
                        value={memberDirectoryCompanyFilter}
                        onChange={(e) => setMemberDirectoryCompanyFilter(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      >
                        <option value="all">All Branches / Companies</option>
                        <option value="Kenya Builders">Kenya Builders & Concrete</option>
                        <option value="Warren">Warren Concrete</option>
                        <option value="Eurocon">Eurocon Tiles</option>
                        <option value="External">External / Independent</option>
                      </select>
                    </div>
                  </div>

                  {filteredMemberDirectory.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
                      No members matched your search criteria.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950 max-h-80 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 font-semibold sticky top-0 z-10">
                          <tr>
                            <th className="p-2.5">Member Details</th>
                            <th className="p-2.5">Branch / Company</th>
                            <th className="p-2.5">National ID</th>
                            <th className="p-2.5">Phone Number</th>
                            <th className="p-2.5 text-right">Total Savings</th>
                            <th className="p-2.5 text-right">Active Loan</th>
                            <th className="p-2.5 text-center">System Role</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {filteredMemberDirectory.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-900/50 transition">
                              <td className="p-2.5 font-sans">
                                <div className="font-bold text-white">{m.full_name}</div>
                                <div className="text-[10px] text-emerald-400 font-mono">{m.member_number}</div>
                              </td>
                              <td className="p-2.5 font-sans text-slate-300">
                                {m.companies?.name || 'External'}
                              </td>
                              <td className="p-2.5 text-slate-300">
                                {m.id_number || '-'}
                              </td>
                              <td className="p-2.5 text-slate-300">
                                {m.phone || '-'}
                              </td>
                              <td className="p-2.5 text-right font-bold text-emerald-400">
                                KES {Number(m.totalSavings || 0).toLocaleString()}
                              </td>
                              <td className="p-2.5 text-right font-bold text-amber-400">
                                KES {Number(m.totalActiveDebt || 0).toLocaleString()}
                              </td>
                              <td className="p-2.5 text-center font-sans">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                  m.role === 'admin' || m.role === 'chairman' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                                  m.role === 'treasurer' || m.role === 'assistant_chair' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                                  'bg-slate-900 text-slate-400 border border-slate-800'
                                }`}>
                                  {m.role ? m.role.replace('_', ' ') : 'Member'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 6. MANUAL ADJUSTMENT */}
                {['admin', 'chairman', 'treasurer'].includes(userRole) && (
                  <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm sm:text-base font-bold text-white">Manual Member Contribution / Loan Repayment Desk</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 font-medium">
                      Post payments. Exact loan balance is posted to loans, and the rest goes to savings.
                    </p>

                    <form onSubmit={handleManualMemberAdjustment} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Select Beneficiary Member</label>
                          <select
                            value={manualTargetMemberId}
                            onChange={(e) => setManualTargetMemberId(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
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
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-medium"
                          >
                            <option value="loan_repayment">1. Smart Loan Repayment (Exact Loan + Excess to Savings)</option>
                            <option value="savings_deposit">2. Direct Savings Contribution Only</option>
                            <option value="welfare_monthly_200">3. Welfare Benevolent Fund (KES 200)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (KES)</label>
                          <input
                            type="text"
                            required
                            value={manualAmountRaw}
                            onChange={(e) => setManualAmountRaw(formatAccountingNumber(e.target.value))}
                            placeholder="e.g. 200 or 9,000"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Audit Reference Code (Optional)</label>
                          <input
                            type="text"
                            value={manualRefCode}
                            onChange={(e) => setManualRefCode(e.target.value)}
                            placeholder="e.g. BANK-SLIP-7821 or CASH-RECEIPT-09"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono uppercase"
                          />
                        </div>

                        <div className="sm:col-span-1 flex items-end">
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <PlusCircle className="w-4 h-4" /> Post Payment
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* 7. LOAN RECOVERY MATRIX */}
                <div className="bg-slate-900/90 border border-rose-900/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-rose-400" />
                      <h3 className="text-sm sm:text-base font-bold text-white">Loan Recovery & Performance Matrix (Worst to Best)</h3>
                    </div>
                    <button
                      onClick={fetchAdminData}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition border border-slate-700"
                      title="Refresh Matrix"
                    >
                      <RotateCcw className="w-3 h-3" /> Refresh
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 font-medium">
                    Monitors all active borrowers ranked automatically from the lowest repayment percentage to the most compliant.
                  </p>

                  {performanceRankedLoans.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">No active or historical loans found in the system.</div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950 max-h-80 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 font-semibold sticky top-0 z-10">
                          <tr>
                            <th className="p-2.5">Rank & Member</th>
                            <th className="p-2.5">Facility</th>
                            <th className="p-2.5 text-right">Principal</th>
                            <th className="p-2.5 text-right">Total Repaid</th>
                            <th className="p-2.5 text-right">Outstanding Debt</th>
                            <th className="p-2.5 text-center">Recovery Progress</th>
                            <th className="p-2.5 text-center">Performance Risk</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {performanceRankedLoans.map((loan, idx) => {
                            const isZeroRepaid = loan.progressPercent === 0;
                            const isCompleted = loan.progressPercent >= 100;

                            return (
                              <tr key={loan.id} className={isZeroRepaid ? 'bg-rose-950/20 hover:bg-rose-950/30' : 'hover:bg-slate-900/40'}>
                                <td className="p-2.5">
                                  <div className="font-sans font-bold text-white">#{idx + 1} {loan.profiles?.full_name}</div>
                                  <div className="text-[10px] text-slate-400">{loan.profiles?.companies?.name || 'External'} ({loan.profiles?.member_number})</div>
                                </td>
                                <td className="p-2.5 font-sans capitalize text-slate-300">
                                  {(loan.loan_product || 'main_loan').replace('_', ' ')}
                                </td>
                                <td className="p-2.5 text-right text-slate-300">
                                  KES {Number(loan.principal_amount).toLocaleString()}
                                </td>
                                <td className="p-2.5 text-right text-emerald-400 font-bold">
                                  KES {loan.totalPaid.toLocaleString()}
                                </td>
                                <td className="p-2.5 text-right text-amber-400 font-bold">
                                  KES {Number(loan.balance_remaining).toLocaleString()}
                                </td>
                                <td className="p-2.5 text-center">
                                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1">
                                    <div 
                                      className={`h-full ${isCompleted ? 'bg-blue-500' : isZeroRepaid ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                      style={{ width: `${loan.progressPercent}%` }}
                                    />
                                  </div>
                                  <span className="text-[9px] text-slate-300">{loan.progressPercent.toFixed(1)}%</span>
                                </td>
                                <td className="p-2.5 text-center font-sans">
                                  {isCompleted ? (
                                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                                      CLEARED ✓
                                    </span>
                                  ) : isZeroRepaid ? (
                                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
                                      DEFAULT RISK (0%)
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
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

                {/* 8. PUBLISH REPORTS */}
                {['admin', 'chairman'].includes(userRole) && (
                  <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderDown className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm sm:text-base font-bold text-white">Publish Official Report / Audit Booklet</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 font-medium">
                      Upload verified PDF documents (Audit Reports, AGM Booklets, By-laws) for members.
                    </p>

                    <form onSubmit={handleUploadSaccoDocument} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
                        <input
                          type="text"
                          required
                          value={docTitle}
                          onChange={(e) => setDocTitle(e.target.value)}
                          placeholder="e.g. KEWA SACCO Audited Financials 2025"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Report Category</label>
                        <select
                          value={docCategory}
                          onChange={(e) => setDocCategory(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
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
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Select PDF Report File</label>
                        <input
                          type="file"
                          accept=".pdf"
                          required
                          onChange={(e) => setDocFile(e.target.files[0])}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-emerald-600 file:text-white cursor-pointer"
                        />
                      </div>

                      <div className="sm:col-span-1 flex items-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <UploadCloud className="w-3.5 h-3.5" /> Publish Report
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 9. DUAL PAYROLL CHECKOFF */}
                {['admin', 'chairman', 'treasurer'].includes(userRole) && (
                  <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm sm:text-base font-bold text-white">Automated Dual Payroll Checkoff (Savings + Loans)</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 font-medium">
                      Upload monthly payroll deductions CSV (<code className="text-amber-300 font-mono">member_number, savings_amount, loan_amount</code>).
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Payroll Month</label>
                        <input
                          type="text"
                          value={batchMonth}
                          onChange={(e) => setBatchMonth(e.target.value)}
                          placeholder="e.g. AUG-2026"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Select Payroll Deductions CSV</label>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleCSVUpload}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-amber-600 file:text-white cursor-pointer"
                        />
                      </div>
                    </div>

                    {batchPreview.length > 0 && (
                      <div className="mt-3 border-t border-slate-800 pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-300">
                            Matched Rows: {batchPreview.filter((r) => r.valid).length} of {batchPreview.length}
                          </span>
                          <button
                            onClick={handleExecuteBatchCheckoff}
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-lg cursor-pointer"
                          >
                            <UploadCloud className="w-3.5 h-3.5" /> Process & Post All Checkoffs
                          </button>
                        </div>

                        <div className="max-h-40 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-900 text-slate-400 sticky top-0 font-semibold">
                              <tr>
                                <th className="p-2">Member No</th>
                                <th className="p-2">Matched Name</th>
                                <th className="p-2 text-right">Savings Credit</th>
                                <th className="p-2 text-right">Loan Deduct</th>
                                <th className="p-2 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-medium">
                              {batchPreview.map((row, idx) => (
                                <tr key={idx} className={row.valid ? 'hover:bg-slate-900/40' : 'bg-rose-950/20'}>
                                  <td className="p-2 font-mono">{row.member_number}</td>
                                  <td className="p-2">{row.full_name}</td>
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
                )}

                {/* 10. SEQUENTIAL 3-SIGNATORY DESK */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm sm:text-base font-bold text-white">Sequential 3-Signatory Approval Pipeline (Role-Restricted)</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 font-medium">
                    Strict Role Verification: Signed in as <strong className="text-amber-300 uppercase">{userRole.replace('_', ' ')}</strong>. You can only execute endorsements for your portfolio.
                  </p>

                  {allPendingLoans.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">No loan applications awaiting signatory action.</div>
                  ) : (
                    <div className="space-y-3">
                      {allPendingLoans.map((l) => {
                        const canChairSign = l.assistant_chair_approval;
                        const canTreasurerSign = l.assistant_chair_approval && l.chairman_approval;

                        const isAsstChairUser = userRole === 'assistant_chair' || userRole === 'admin';
                        const isChairUser = userRole === 'chairman' || userRole === 'admin';
                        const isTreasurerUser = userRole === 'treasurer' || userRole === 'admin';

                        return (
                          <div key={l.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-sm font-bold text-white">{l.profiles?.full_name}</h4>
                                  <span className="bg-emerald-950 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-800 uppercase">
                                    {(l.loan_product || 'main_loan').replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium">{l.profiles?.companies?.name || 'External'} • Member {l.profiles?.member_number}</p>
                                <p className="text-xs font-black text-emerald-400 mt-0.5">
                                  KES {Number(l.principal_amount).toLocaleString()} ({l.repayment_period_months} Mos Term)
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5">
                                {l.assistant_chair_approval ? (
                                  <button
                                    onClick={() => handleSignatoryPipeline(l.id, 'assistant_chair', 'unsign')}
                                    disabled={!isAsstChairUser}
                                    className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                                      isAsstChairUser
                                        ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                                        : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                                    }`}
                                    title={isAsstChairUser ? "Click to Unsign" : "Only Assistant Chair can modify"}
                                  >
                                    <CheckCircle className="w-3 h-3" /> 1. Asst {isAsstChairUser && <RotateCcw className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleSignatoryPipeline(l.id, 'assistant_chair', 'sign')}
                                    disabled={!isAsstChairUser}
                                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow ${
                                      isAsstChairUser
                                        ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                                        : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    1. Sign: Asst
                                  </button>
                                )}

                                {l.chairman_approval ? (
                                  <button
                                    onClick={() => handleSignatoryPipeline(l.id, 'chairman', 'unsign')}
                                    disabled={!isChairUser}
                                    className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                                      isChairUser
                                        ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                                        : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                                    }`}
                                    title={isChairUser ? "Click to Unsign" : "Only Chairman can modify"}
                                  >
                                    <CheckCircle className="w-3 h-3" /> 2. Chair {isChairUser && <RotateCcw className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
                                  </button>
                                ) : (
                                  <button
                                    disabled={!canChairSign || !isChairUser}
                                    onClick={() => handleSignatoryPipeline(l.id, 'chairman', 'sign')}
                                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow ${
                                      canChairSign && isChairUser
                                        ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                                        : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    {(!canChairSign || !isChairUser) && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                                    2. Sign: Chair
                                  </button>
                                )}

                                {l.treasurer_approval ? (
                                  <button
                                    onClick={() => handleSignatoryPipeline(l.id, 'treasurer', 'unsign')}
                                    disabled={!isTreasurerUser}
                                    className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                                      isTreasurerUser
                                        ? 'bg-emerald-950 hover:bg-rose-950/80 border border-emerald-800 hover:border-rose-700 text-emerald-300 hover:text-rose-200 cursor-pointer'
                                        : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300/60 cursor-not-allowed'
                                    }`}
                                    title={isTreasurerUser ? "Click to Unsign" : "Only Treasurer can modify"}
                                  >
                                    <CheckCircle className="w-3 h-3" /> 3. Treas {isTreasurerUser && <RotateCcw className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
                                  </button>
                                ) : (
                                  <button
                                    disabled={!canTreasurerSign || !isTreasurerUser}
                                    onClick={() => handleSignatoryPipeline(l.id, 'treasurer', 'sign')}
                                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow ${
                                      canTreasurerSign && isTreasurerUser
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer'
                                        : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    {(!canTreasurerSign || !isTreasurerUser) && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                                    3. Disburse
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400">
                              <p className="font-semibold text-slate-300 mb-0.5">Guarantor Pledges:</p>
                              <div className="space-y-0.5">
                                {l.loan_guarantors?.map((g) => (
                                  <div key={g.id} className="flex justify-between font-mono text-[10px]">
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

                {/* 11. SUPPORT TICKETS */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm sm:text-base font-bold text-white">Member Support Tickets & Formal Inquiries</h3>
                    </div>
                    <button
                      onClick={fetchAdminData}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition border border-slate-700"
                      title="Refresh Tickets"
                    >
                      <RotateCcw className="w-3 h-3" /> Refresh
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 font-medium">
                    Review and resolve messages submitted by members directly from their portal accounts.
                  </p>

                  {allAdminInquiries.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">No member inquiries awaiting response.</div>
                  ) : (
                    <div className="space-y-3">
                      {allAdminInquiries.map((ticket) => (
                        <div key={ticket.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2.5 text-xs shadow">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h5 className="font-bold text-white text-xs">{ticket.profiles?.full_name || 'Member'}</h5>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                                  ticket.status === 'resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                                }`}>
                                  {ticket.status.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400">{ticket.profiles?.companies?.name || 'External'} • Member {ticket.profiles?.member_number} • Phone: {ticket.profiles?.phone}</p>
                              <p className="text-emerald-400 font-bold mt-0.5 text-[11px]">Category: {ticket.category.replace('_', ' ').toUpperCase()}</p>
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono">{new Date(ticket.created_at).toLocaleString()}</span>
                          </div>

                          <div className="p-2.5 bg-slate-900 border border-slate-800/80 rounded-xl space-y-0.5">
                            <p className="font-bold text-slate-200 text-xs">Subject: {ticket.subject}</p>
                            <p className="text-slate-300 leading-relaxed text-[11px]">{ticket.message}</p>
                          </div>

                          {ticket.admin_response ? (
                            <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-[11px] text-emerald-300">
                              <strong>Official Reply:</strong> {ticket.admin_response}
                            </div>
                          ) : (
                            <div className="flex gap-2 pt-1.5 border-t border-slate-800">
                              <input
                                type="text"
                                placeholder="Type official response..."
                                value={adminReplyText[ticket.id] || ''}
                                onChange={(e) => setAdminReplyText({ ...adminReplyText, [ticket.id]: e.target.value })}
                                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                              />
                              <button
                                onClick={() => handleAdminReplyInquiry(ticket.id)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow cursor-pointer flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" /> Reply
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 12. POST NOTICES & AUDIT LOGS */}
                {['admin', 'chairman'].includes(userRole) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Bell className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm sm:text-base font-bold text-white">Post Announcement to Member Board</h4>
                      </div>

                      <form onSubmit={handlePublishNotice} className="space-y-2.5">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Announcement Title</label>
                          <input
                            type="text"
                            required
                            value={newNoticeTitle}
                            onChange={(e) => setNewNoticeTitle(e.target.value)}
                            placeholder="e.g. December Loan Applications Open"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Notice Body Content</label>
                          <textarea
                            required
                            rows="2"
                            value={newNoticeContent}
                            onChange={(e) => setNewNoticeContent(e.target.value)}
                            placeholder="Write message to all members..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer shadow"
                        >
                          Publish Notice
                        </button>
                      </form>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                      <div className="flex items-center gap-2 mb-2.5">
                        <History className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm sm:text-base font-bold text-white">Immutable Audit Trail (SASRA Standard)</h4>
                      </div>

                      <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900 text-slate-400 sticky top-0 font-semibold">
                            <tr>
                              <th className="p-2">Date & Time</th>
                              <th className="p-2">User</th>
                              <th className="p-2">Action</th>
                              <th className="p-2">Details</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-mono text-[10px]">
                            {auditLogs.map((log) => (
                              <tr key={log.id}>
                                <td className="p-2 text-slate-400">
                                  {new Date(log.created_at).toLocaleString('en-GB', { 
                                    day: '2-digit', 
                                    month: 'short', 
                                    year: 'numeric', 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </td>
                                <td className="p-2 text-slate-200 font-sans font-bold">{log.user_name || 'Member'}</td>
                                <td className="p-2 text-emerald-400 font-bold">{log.action}</td>
                                <td className="p-2 text-slate-300">{log.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* LOAN TERMS MODAL */}
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
                  <span>Principal: <strong>KES {loanPrincipalNum.toLocaleString()}</strong></span>
                  <span>Duration: <strong>{loanMonths} Month(s)</strong></span>
                  <span>Payable: <strong>KES {calculatedTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></span>
                </div>
              </div>

              <h4 className="font-bold text-white text-xs uppercase tracking-wide">1. Payroll Deduction Authorization</h4>
              <p>
                By submitting this loan request, I authorize my employer or company checkoff unit to deduct <strong>KES {monthlyInstallment.toFixed(2)}</strong> monthly until settled in full.
              </p>

              <h4 className="font-bold text-white text-xs uppercase tracking-wide">2. Interest Rate & Repayment Schedules</h4>
              <p>
                Interest on the loan facility is charged at <strong>{interestRate}% per month on reducing balance</strong>. Default attracts recovery action under the Co-operative Societies Act.
              </p>

              <h4 className="font-bold text-white text-xs uppercase tracking-wide">3. Guarantor Liability & Recovery</h4>
              <p>
                Default or employment cessation triggers liquidation of personal deposits first, followed by proportional recovery from verified guarantors’ savings.
              </p>

              <h4 className="font-bold text-white text-xs uppercase tracking-wide">4. Sequential 3-Signatory Approval Quorum</h4>
              <p className="flex items-center gap-1.5 flex-wrap">
                Disbursement proceeds strictly in sequence: 
                <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-300 font-bold border border-slate-800">1. Assistant Chair</span> 
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-300 font-bold border border-slate-800">2. Chairman</span> 
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-300 font-bold border border-slate-800">3. Treasurer</span>.
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
      {session && authMode !== 'reset' && (
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

          {['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(userRole) && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center gap-1 text-[9px] font-bold py-1 px-1 transition ${
                activeTab === 'admin' ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Leadership Hub</span>
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