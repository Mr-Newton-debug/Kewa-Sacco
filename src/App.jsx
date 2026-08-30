import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Download } from 'lucide-react';

// Utilities & Calculations
import { formatAccountingNumber, parseAccountingNumber } from './utils/formatters';
import { calculateFreeShares, calculateNetSocietyLiquidity, calculateLoanBreakdown } from './utils/calculations';
import { generatePDFStatement } from './utils/pdfGenerator';

// Layout Components
import Header from './components/layout/Header';
import MobileDrawer from './components/layout/MobileDrawer';
import MobileBottomNav from './components/layout/MobileBottomNav';

// Modals
import ChangePinModal from './components/modals/ChangePinModal';
import LoanAuthorizationModal from './components/modals/LoanAuthorizationModal';

// Auth Component
import AuthCard from './components/auth/AuthCard';

// Tabs
import OverviewTab from './components/tabs/OverviewTab';
import LoansTab from './components/tabs/LoansTab';
import GuarantorsTab from './components/tabs/GuarantorsTab';
import DocumentsTab from './components/tabs/DocumentsTab';
import ProfileWelfareTab from './components/tabs/ProfileWelfareTab';
import MpesaTab from './components/tabs/MpesaTab';
import SupportTab from './components/tabs/SupportTab';
import LeadershipHubTab from './components/tabs/LeadershipHubTab';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Core Data State Declared FIRST (so derived properties can safely reference them)
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
  const [allPendingLoans, setAllPendingLoans] = useState([]);
  const [allLoansLeadership, setAllLoansLeadership] = useState([]);
  const [allPendingClaims, setAllPendingClaims] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  // 2. Auth States
  const [email, setEmail] = useState(() => localStorage.getItem('kewa_remembered_email') || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [registrationPin, setRegistrationPin] = useState('1234');
  const [securityQuestion, setSecurityQuestion] = useState("What is your mother's maiden name?");
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [odpcConsent, setOdpcConsent] = useState(false);

  // 3. Derived Variables & Filters (Declared AFTER core state like `profile` and `allSystemGuarantors`)
  const profilePhone = profile?.phone || '';
  const pendingGuaranteesCount = guarantorRequests.filter((g) => g.status === 'pending').length;

   // Profile Settings & PIN Modal State
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editIdNumber, setEditIdNumber] = useState('');
  const [editCompanyId, setEditCompanyId] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);

  // Directory Search State
  const [memberDirectorySearch, setMemberDirectorySearch] = useState('');
  const [memberDirectoryCompanyFilter, setMemberDirectoryCompanyFilter] = useState('all');
  const [guarantorTrackerSearch, setGuarantorTrackerSearch] = useState('');

  // Manual Adjustment State
  const [manualTargetMemberId, setManualTargetMemberId] = useState('');
  const [manualAdjustmentType, setManualAdjustmentType] = useState('loan_repayment');
  const [manualAmountRaw, setManualAmountRaw] = useState('');
  const [manualRefCode, setManualRefCode] = useState('');

  // Migration State
  const [migrationFile, setMigrationFile] = useState(null);

  // Support & Chat State
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

  // Loan Form State
  const [loanProduct, setLoanProduct] = useState('main_loan');
  const [loanPrincipalRaw, setLoanPrincipalRaw] = useState('20,000');
  const [loanMonths, setLoanMonths] = useState(12);
  const [interestRate, setInterestRate] = useState(1.0);
  const [disbursementMethod, setDisbursementMethod] = useState('mpesa');
  const [disbursementDetails, setDisbursementDetails] = useState('');
  const [guarantorList, setGuarantorList] = useState([
    { guarantorId: '', searchTerm: '', amountRaw: '', eligible: true, note: '' }
  ]);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Document Upload State
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('audit_report');
  const [docYear, setDocYear] = useState('2025/2026');
  const [docFile, setDocFile] = useState(null);

  // Next of Kin State
  const [nokName, setNokName] = useState('');
  const [nokRel, setNokRel] = useState('Spouse');
  const [nokId, setNokId] = useState('');
  const [nokPhone, setNokPhone] = useState('');
  const [nokPercent, setNokPercent] = useState('');

  // Welfare Claim State
  const [claimType, setClaimType] = useState('hospitalization');
  const [claimAmountRaw, setClaimAmountRaw] = useState('');
  const [claimDesc, setClaimDesc] = useState('');
  const [claimDisbursementMethod, setClaimDisbursementMethod] = useState('mpesa');
  const [claimDisbursementDetails, setClaimDisbursementDetails] = useState('');
  const [claimDocument, setClaimDocument] = useState(null);

  // M-Pesa State
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaAmountRaw, setMpesaAmountRaw] = useState('');
  const [mpesaType, setMpesaType] = useState('savings_deposit');
  const [mpesaCode, setMpesaCode] = useState('');

  // Admin Batch State
  const [batchPreview, setBatchPreview] = useState([]);
  const [batchMonth, setBatchMonth] = useState('AUG-2026');
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');

  // Safe filtering with fallback empty arrays
  const filteredMemberDirectory = (allMembers || []).filter((m) => {
    const term = (memberDirectorySearch || '').toLowerCase();
    const name = (m.full_name || '').toLowerCase();
    const num = (m.member_number || '').toLowerCase();
    const idNo = (m.id_number || '').toLowerCase();
    const phoneNo = (m.phone || '').toLowerCase();
    const matchesSearch = name.includes(term) || num.includes(term) || idNo.includes(term) || phoneNo.includes(term);

    const compName = m.companies?.name || '';
    const matchesCompany = memberDirectoryCompanyFilter === 'all' || compName.toLowerCase().includes(memberDirectoryCompanyFilter.toLowerCase());

    return matchesSearch && matchesCompany;
  });

  const filteredGuarantorInspectionList = (allSystemGuarantors || []).filter((g) => {
    const term = (guarantorTrackerSearch || '').toLowerCase();
    const gName = (g.profiles?.full_name || '').toLowerCase();
    const bName = (g.loans?.profiles?.full_name || '').toLowerCase();
    const mNum = (g.profiles?.member_number || '').toLowerCase();
    return gName.includes(term) || bName.includes(term) || mNum.includes(term);
  });

  const performanceRankedLoans = [...allLoansLeadership].sort((a, b) => {
    const aPaid = (a.loan_repayments || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const bPaid = (b.loan_repayments || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const aPct = Number(a.total_payable || 1) > 0 ? (aPaid / Number(a.total_payable)) * 100 : 0;
    const bPct = Number(b.total_payable || 1) > 0 ? (bPaid / Number(b.total_payable)) * 100 : 0;
    return aPct - bPct;
  }).map((l) => {
    const totalPaid = (l.loan_repayments || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const progressPercent = Number(l.total_payable || 1) > 0 ? Math.min(100, (totalPaid / Number(l.total_payable)) * 100) : 0;
    return { ...l, totalPaid, progressPercent };
  });

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

    if (email) localStorage.setItem('kewa_remembered_email', email);
    setEmail('');
    await supabase.auth.signOut();

    if (timeoutReason) {
      setMessage({
        text: 'You were signed out automatically due to 5 minutes of inactivity for your security.',
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
        logAuditAction('AUTO_TIMEOUT_LOGOUT', 'User logged out due to 5 minutes of inactivity');
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
    if (hashParams && hashParams.includes('type=recovery')) setAuthMode('reset');

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (hashParams && hashParams.includes('type=recovery')) {
        setAuthMode('reset');
      } else {
        setSession(session);
        if (session?.user?.id) fetchUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthMode('reset');
        setSession(null);
      } else if (authMode !== 'reset') {
        setSession(session);
        if (session?.user?.id) fetchUserData(session.user.id);
      }
    });

    fetchCompanies();
    fetchAnnouncements();
    fetchSaccoDocuments();
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchAnnouncements();
    if (!session?.user?.id) return;

    if (activeTab === 'overview' || activeTab === 'guarantors' || activeTab === 'loans') {
      fetchGuarantorData(session.user.id);
    } else if (activeTab === 'documents') {
      fetchSaccoDocuments();
    } else if (activeTab === 'support') {
      fetchMemberInquiries(session.user.id);
    } else if (activeTab === 'admin') {
      fetchAdminData();
    } else if (activeTab === 'beneficiaries') {
      fetchBeneficiaries(session.user.id);
      fetchWelfareClaims(session.user.id);
    }
  }, [activeTab, session]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const logAuditAction = async (action, details, userId = null, userName = null) => {
    try {
      const activeName = userName || profile?.full_name || email || 'Member';
      const activeMemberNo = profile?.member_number ? ` (No: ${profile.member_number})` : '';
      await supabase.from('audit_logs').insert([{
        user_id: userId || session?.user?.id || null,
        user_name: `${activeName}${activeMemberNo}`,
        action,
        details,
      }]);
      if (session && activeTab === 'admin') fetchAdminData();
    } catch (e) {
      console.warn('Audit write skipped:', e);
    }
  };

  const fetchCompanies = async () => {
    const { data } = await supabase.from('companies').select('id, name');
    if (data && data.length > 0) {
      setCompanies(data);
      setCompanyId(data[0].id);
    }
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (data) setAnnouncements(data);
  };

  const fetchSaccoDocuments = async () => {
    const { data } = await supabase.from('sacco_documents').select('*').order('created_at', { ascending: false });
    if (data) setSaccoDocs(data);
  };

  const fetchMemberInquiries = async (userId) => {
    try {
      const { data } = await supabase.from('member_inquiries').select('*').eq('member_id', userId).order('created_at', { ascending: false });
      if (data) setInquiries(data);
    } catch (err) {
      console.error('Inquiries fetch error:', err);
    }
  };

  const fetchUserData = async (userId) => {
    setLoading(true);
    try {
      const { data: profileData, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profErr) throw profErr;

      if (profileData) {
        let companyData = { name: 'KEWA SACCO' };
        if (profileData.company_id) {
          const { data: comp } = await supabase
            .from('companies')
            .select('name')
            .eq('id', profileData.company_id)
            .single();
          if (comp) companyData = comp;
        }

        const hydratedProfile = {
          ...profileData,
          companies: companyData
        };

        setProfile(hydratedProfile);
        setEditFullName(hydratedProfile.full_name || '');
        setEditPhone(hydratedProfile.phone || '');
        setEditIdNumber(hydratedProfile.id_number || '');
        setEditCompanyId(hydratedProfile.company_id || '');

        fetchAllMembers();
        fetchGuarantorData(userId);
        fetchBeneficiaries(userId);
        fetchWelfareClaims(userId);
        fetchMemberInquiries(userId);
        
        if (['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(hydratedProfile.role)) {
          fetchAdminData();
        }
      }

      const { data: savingsData } = await supabase.from('savings_ledger').select('*').eq('member_id', userId).order('created_at', { ascending: false });
      if (savingsData) setSavings(savingsData);

      const { data: loanData } = await supabase.from('loans').select('*').eq('member_id', userId).order('created_at', { ascending: false });
      if (loanData) setLoans(loanData);

      const { data: repaymentData } = await supabase.from('loan_repayments').select('*, loans(principal_amount, loan_product)').eq('member_id', userId).order('created_at', { ascending: false });
      if (repaymentData) setRepayments(repaymentData);

    } catch (err) {
      console.error('Error in fetchUserData:', err);
    }
    setLoading(false);
  };

  const fetchAllMembers = async () => {
    try {
      const { data: membersData, error: memErr } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (memErr) throw memErr;

      const [{ data: savingsData }, { data: loansData }, { data: guarantorsData }, { data: compsData }] = await Promise.all([
        supabase.from('savings_ledger').select('member_id, amount'),
        supabase.from('loans').select('id, member_id, balance_remaining, status'),
        supabase.from('loan_guarantors').select('id, loan_id, guarantor_id, amount_guaranteed, status'),
        supabase.from('companies').select('id, name')
      ]);

      if (membersData) {
        const formatted = membersData.map((m) => {
          const matchedCompany = (compsData || []).find((c) => c.id === m.company_id) || { name: 'External' };

          const totalMemberSavings = (savingsData || [])
            .filter((s) => s.member_id === m.id)
            .reduce((acc, s) => acc + Number(s.amount || 0), 0);

          const totalMemberLoans = (loansData || [])
            .filter((l) => l.member_id === m.id && ['approved', 'disbursed'].includes(l.status))
            .reduce((acc, l) => acc + Number(l.balance_remaining || 0), 0);

          const runningPledges = (guarantorsData || [])
            .filter((g) => {
              if (g.guarantor_id !== m.id) return false;
              if (!['accepted', 'pending'].includes(g.status)) return false;
              const matchedLoan = (loansData || []).find((l) => l.id === g.loan_id);
              return matchedLoan && !['completed', 'rejected'].includes(matchedLoan.status);
            })
            .reduce((acc, g) => acc + Number(g.amount_guaranteed || 0), 0);

          return {
            ...m,
            companies: matchedCompany,
            totalSavings: totalMemberSavings,
            totalActiveDebt: totalMemberLoans,
            runningGuaranteedPledges: runningPledges,
            unencumberedShares: Math.max(0, totalMemberSavings - totalMemberLoans - runningPledges),
          };
        });

        setAllMembers(formatted);
        if (formatted.length > 0) setManualTargetMemberId((prev) => prev || formatted[0].id);
      }
    } catch (err) {
      console.error('Failed in fetchAllMembers:', err);
    }
  };

  const fetchGuarantorData = async (userId) => {
    if (!userId) return;
    try {
      const [
        { data: requestsRaw },
        { data: allLoansRaw },
        { data: allProfilesRaw }
      ] = await Promise.all([
        supabase.from('loan_guarantors').select('*').eq('guarantor_id', userId).order('created_at', { ascending: false }),
        supabase.from('loans').select('*'),
        supabase.from('profiles').select('id, full_name, member_number, phone, company_id, companies(name)')
      ]);

      if (requestsRaw) {
        const hydratedRequests = requestsRaw.map((req) => {
          const matchedLoan = (allLoansRaw || []).find((l) => l.id === req.loan_id) || {};
          const matchedBorrower = (allProfilesRaw || []).find((p) => p.id === matchedLoan.member_id) || {};
          return { ...req, loans: { ...matchedLoan, profiles: matchedBorrower } };
        });
        setGuarantorRequests(hydratedRequests);

        const activeRunning = hydratedRequests.filter((g) => {
          const status = (g.status || '').toLowerCase().trim();
          const isPledged = ['accepted', 'pending'].includes(status);
          const loanStatus = (g.loans?.status || '').toLowerCase().trim();
          const isLoanActive = loanStatus ? !['completed', 'rejected'].includes(loanStatus) : true;
          const hasBalance = g.loans?.balance_remaining !== undefined ? Number(g.loans.balance_remaining) > 0 : true;
          return isPledged && isLoanActive && hasBalance;
        });
        setMyGuaranteesCommitted(activeRunning);
      }
    } catch (e) {
      console.error('Guarantor fetch error:', e);
    }
  };

  const fetchBeneficiaries = async (userId) => {
    const { data } = await supabase.from('next_of_kin').select('*').eq('member_id', userId).order('created_at', { ascending: false });
    if (data) setBeneficiaries(data);
  };

  const fetchWelfareClaims = async (userId) => {
    const { data } = await supabase.from('welfare_claims').select('*').eq('member_id', userId).order('created_at', { ascending: false });
    if (data) setWelfareClaims(data);
  };

  const fetchAdminData = async () => {
    await fetchAllMembers();
    try {
      const [
        { data: loansRaw },
        { data: profilesRaw },
        { data: repaymentsRaw },
        { data: guarantorsRaw },
        { data: claimsRaw },
        { data: ticketsRaw },
        { data: logsRaw }
      ] = await Promise.all([
        supabase.from('loans').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, full_name, member_number, id_number, phone, email, role, company_id, companies(name)'),
        supabase.from('loan_repayments').select('*'),
        supabase.from('loan_guarantors').select('*'),
        supabase.from('welfare_claims').select('*').order('created_at', { ascending: false }),
        supabase.from('member_inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(35)
      ]);

      if (loansRaw && profilesRaw) {
        const fullLoans = loansRaw.map((l) => {
          const mem = profilesRaw.find((p) => p.id === l.member_id) || {};
          const reps = (repaymentsRaw || []).filter((r) => r.loan_id === l.id);
          const guars = (guarantorsRaw || []).filter((g) => g.loan_id === l.id).map((g) => {
            const guarProfile = profilesRaw.find((p) => p.id === g.guarantor_id) || {};
            return { ...g, profiles: guarProfile };
          });
          return { ...l, profiles: mem, loan_repayments: reps, loan_guarantors: guars };
        });

        setAllLoansLeadership(fullLoans);
        setAllPendingLoans(fullLoans.filter((l) => ['pending', 'guaranteed'].includes(l.status)));

        if (guarantorsRaw) {
          const fullGuarantors = guarantorsRaw.map((g) => ({
            ...g,
            profiles: profilesRaw.find((p) => p.id === g.guarantor_id) || {},
            loans: fullLoans.find((l) => l.id === g.loan_id) || {}
          }));
          setAllSystemGuarantors(fullGuarantors);

          if (session?.user?.id) {
            const myGuarantorRecords = guarantorsRaw.filter((g) => g.guarantor_id === session.user.id);
            const hydratedMyRequests = myGuarantorRecords.map((req) => ({
              ...req,
              loans: { ...(fullLoans.find((l) => l.id === req.loan_id) || {}), profiles: profilesRaw.find((p) => p.id === (fullLoans.find((l) => l.id === req.loan_id) || {}).member_id) || {} }
            }));
            setGuarantorRequests(hydratedMyRequests);

            setMyGuaranteesCommitted(hydratedMyRequests.filter((g) => {
              const isPledged = ['accepted', 'pending'].includes((g.status || '').toLowerCase());
              const isLoanActive = !['completed', 'rejected'].includes((g.loans?.status || '').toLowerCase());
              const hasBal = g.loans?.balance_remaining !== undefined ? Number(g.loans.balance_remaining) > 0 : true;
              return isPledged && isLoanActive && hasBal;
            }));
          }
        }
      }

      if (claimsRaw && profilesRaw) {
        setAllPendingClaims(claimsRaw.map((c) => ({ ...c, profiles: profilesRaw.find((p) => p.id === c.member_id) || {} })).filter((c) => c.status === 'pending' || !c.treasurer_approval));
      }

      if (ticketsRaw && profilesRaw) {
        setAllAdminInquiries(ticketsRaw.map((t) => ({ ...t, profiles: profilesRaw.find((p) => p.id === t.member_id) || {} })));
      }

      if (logsRaw) setAuditLogs(logsRaw);
    } catch (e) {
      console.error('Admin fetch error:', e);
    }
  };

  // Handlers
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

  const handleRespondGuarantor = async (guaranteeId, status, pledgeAmount) => {
    if (status === 'accepted' && Number(pledgeAmount) > freeSharesAvailable) {
      setMessage({ text: 'Pledged amount exceeds your available free shares.', type: 'error' });
      return;
    }
    await supabase.from('loan_guarantors').update({ status }).eq('id', guaranteeId);
    setMessage({ text: `Guarantor response recorded: ${status}`, type: 'success' });
    fetchGuarantorData(session.user.id);
  };

  const handleDeleteSaccoDocument = async (id, title) => {
    await supabase.from('sacco_documents').delete().eq('id', id);
    logAuditAction('SACCO_DOCUMENT_DELETED', `Deleted document: ${title}`);
    fetchSaccoDocuments();
  };

  const handleDeleteBeneficiary = async (id) => {
    await supabase.from('next_of_kin').delete().eq('id', id);
    fetchBeneficiaries(session.user.id);
  };

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

  // Additional admin / leadership dummy placeholders
  const handleExecuteHistoricalMigration = (e) => { e.preventDefault(); alert('Migration feature initialized.'); };
  const handleManualMemberAdjustment = (e) => { e.preventDefault(); alert('Manual adjustment posted.'); };
  const handleUploadSaccoDocument = (e) => { e.preventDefault(); alert('Document uploaded.'); };
  const handleCSVUpload = (e) => { e.preventDefault(); };
  const handleExecuteBatchCheckoff = () => { alert('Batch checkoff processed.'); };
  const handleAdminReplyInquiry = (ticketId) => { alert(`Reply sent for ticket ${ticketId}`); };
  const handlePublishNotice = (e) => { e.preventDefault(); alert('Notice published.'); };

  const chairmanOfficial = allMembers.find((m) => m.role === 'chairman') || { full_name: 'Executive Chairperson', phone: '0700000001' };
  const treasurerOfficial = allMembers.find((m) => m.role === 'treasurer') || { full_name: 'Treasurer & Finance', phone: '0700000002' };
  const asstChairOfficial = allMembers.find((m) => m.role === 'assistant_chair') || { full_name: 'Assistant Chairperson', phone: '0700000003' };

  // Calculations
  const totalSocietySharesCapital = allMembers.reduce((acc, m) => acc + Number(m.totalSavings || 0), 0);
  const totalSocietyUnpaidLoans = allLoansLeadership.filter(l => ['approved', 'disbursed'].includes(l.status)).reduce((acc, l) => acc + Number(l.balance_remaining || 0), 0);
  const totalSocietyInterestAccrued = allLoansLeadership.filter(l => ['approved', 'disbursed', 'completed'].includes(l.status)).reduce((acc, l) => {
    return acc + (Number(l.principal_amount || 0) * (Number(l.interest_rate || 1.0) / 100) * Number(l.repayment_period_months || 12));
  }, 0);

  const netSocietyLiquidCapital = calculateNetSocietyLiquidity(totalSocietySharesCapital, totalSocietyUnpaidLoans, totalSocietyInterestAccrued);
  const totalSavings = savings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const activeLoanBalance = loans.filter((l) => (l.status === 'approved' || l.status === 'disbursed') && Number(l.balance_remaining || 0) > 0).reduce((acc, curr) => acc + Number(curr.balance_remaining || 0), 0);
  const totalRunningGuaranteesCommitted = myGuaranteesCommitted.reduce((acc, curr) => acc + Number(curr.amount_guaranteed || 0), 0);
  const freeSharesAvailable = calculateFreeShares(totalSavings, activeLoanBalance, totalRunningGuaranteesCommitted);

  const maxLimitForSelectedProduct = loanProduct === 'monthly_shylock' ? 20000 : Math.max(totalSavings * 3, 10000);
  const loanPrincipalNum = parseAccountingNumber(loanPrincipalRaw);
  const loanBreakdown = calculateLoanBreakdown(loanPrincipalNum, interestRate, loanMonths);

  // Event Handlers
  const handleUpdateProfileDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('profiles').update({ full_name: editFullName, phone: editPhone, id_number: editIdNumber, company_id: editCompanyId }).eq('id', session.user.id);
    if (error) setMessage({ text: error.message, type: 'error' });
    else {
      logAuditAction('PROFILE_UPDATED', 'Member updated contact info');
      setMessage({ text: 'Profile details updated successfully!', type: 'success' });
      fetchUserData(session.user.id);
    }
    setLoading(false);
  };

  const handleUpdatePin = async ({ currentPin, newPin, onSuccess }) => {
    setLoading(true);
    const activePin = profile?.transaction_pin || '1234';
    if (currentPin !== activePin) {
      alert('Security Verification Failed: Current PIN is incorrect.');
      setLoading(false);
      return;
    }
    const { error } = await supabase.from('profiles').update({ transaction_pin: newPin }).eq('id', session.user.id);
    if (error) {
      alert(`PIN Update Error: ${error.message}`);
    } else {
      logAuditAction('SECURITY_PIN_CHANGED', 'Member successfully changed their transaction security PIN');
      setMessage({ text: 'Transaction Security PIN updated successfully!', type: 'success' });
      if (onSuccess) onSuccess();
      fetchUserData(session.user.id);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    if (email) localStorage.setItem('kewa_remembered_email', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage({ text: error.message, type: 'error' });
    else await logAuditAction('LOGIN', 'Member logged in', data?.user?.id, data?.user?.email);
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!odpcConsent) {
      setMessage({ text: 'Please accept the Data Protection Act (ODPC) privacy terms.', type: 'error' });
      return;
    }
    setLoading(true);
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) {
      setMessage({ text: authError.message, type: 'error' });
      setLoading(false);
      return;
    }
    if (authData?.user) {
      await supabase.from('profiles').insert([{
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
      logAuditAction('REGISTER_ACCOUNT', `New member profile: ${fullName}`, authData.user.id, fullName);
      setMessage({ text: 'Account registered successfully!', type: 'success' });
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
      logAuditAction('PASSWORD_UPDATED', 'User successfully reset account password');
      setMessage({ text: 'Password updated successfully! Please sign in with your new password.', type: 'success' });
      await supabase.auth.signOut();
      setAuthMode('login');
      setNewPassword('');
    }
    setLoading(false);
  };

  const handleInitiateLoan = (e) => {
    e.preventDefault();
    if (loanPrincipalNum > maxLimitForSelectedProduct) {
      setMessage({ text: `Loan exceeds maximum product limit of KES ${maxLimitForSelectedProduct.toLocaleString()}.`, type: 'error' });
      return;
    }
    if (loanProduct !== 'monthly_shylock') {
      const validGuarantors = guarantorList.filter((g) => g.guarantorId && parseAccountingNumber(g.amountRaw) > 0);
      if (validGuarantors.length === 0) {
        setMessage({ text: 'Please assign at least 1 valid guarantor.', type: 'error' });
        return;
      }
      const totalGuaranteedSum = validGuarantors.reduce((acc, g) => acc + parseAccountingNumber(g.amountRaw), 0);
      if (totalGuaranteedSum < loanPrincipalNum) {
        setMessage({ text: 'Total pledged guarantees do not cover the requested loan principal.', type: 'error' });
        return;
      }
    }
    setShowTermsModal(true);
  };

  const handleConfirmLoanSubmission = async (enteredPin, closeModal) => {
    const memberActivePin = profile?.transaction_pin || '1234';
    if (enteredPin !== memberActivePin) {
      alert('Security Verification Failed: The 4-digit Transaction Security PIN is incorrect.');
      return;
    }
    closeModal();
    setLoading(true);

    const validGuarantors = guarantorList.filter((g) => g.guarantorId && parseAccountingNumber(g.amountRaw) > 0);
    const { data: loanData, error: loanError } = await supabase.from('loans').insert([{
      member_id: session.user.id,
      loan_product: loanProduct,
      principal_amount: loanPrincipalNum,
      interest_rate: interestRate,
      repayment_period_months: loanMonths,
      total_payable: loanBreakdown.totalPayable,
      balance_remaining: loanBreakdown.totalPayable,
      status: 'pending',
      disbursement_method: disbursementMethod,
      disbursement_details: disbursementDetails,
    }]).select().single();

    if (!loanError && validGuarantors.length > 0) {
      await supabase.from('loan_guarantors').insert(validGuarantors.map((g) => ({
        loan_id: loanData.id,
        guarantor_id: g.guarantorId,
        amount_guaranteed: parseAccountingNumber(g.amountRaw),
        status: 'pending',
      })));
    }

    logAuditAction('LOAN_APPLICATION_SUBMITTED', `${loanProduct.toUpperCase()} applied: KES ${loanPrincipalNum.toLocaleString()}`);
    setMessage({ text: 'Loan application submitted successfully!', type: 'success' });
    setGuarantorList([{ guarantorId: '', searchTerm: '', amountRaw: '', eligible: true, note: '' }]);
    fetchUserData(session.user.id);
    setLoading(false);
  };

  const handleSignatoryPipeline = async (loanId, targetRole, action = 'sign') => {
    const isSign = action === 'sign';
    const { data: currentLoan } = await supabase.from('loans').select('*').eq('id', loanId).single();
    const updatePayload = {};

    if (targetRole === 'assistant_chair') {
      updatePayload.assistant_chair_approval = isSign;
      if (!isSign) { updatePayload.chairman_approval = false; updatePayload.treasurer_approval = false; updatePayload.status = 'pending'; }
    } else if (targetRole === 'chairman') {
      if (isSign && !currentLoan.assistant_chair_approval) { alert('Assistant Chair must sign first.'); return; }
      updatePayload.chairman_approval = isSign;
      if (!isSign) { updatePayload.treasurer_approval = false; updatePayload.status = 'pending'; }
    } else if (targetRole === 'treasurer') {
      if (isSign && (!currentLoan.assistant_chair_approval || !currentLoan.chairman_approval)) { alert('Assistant Chair and Chairman must sign first.'); return; }
      updatePayload.treasurer_approval = isSign;
      updatePayload.status = isSign ? 'approved' : 'pending';
    }

    await supabase.from('loans').update(updatePayload).eq('id', loanId);
    logAuditAction('SIGNATORY_ACTION', `${targetRole} ${action} for Loan #${loanId.slice(0, 8)}`);
    fetchAdminData();
    fetchUserData(session.user.id);
  };

  const handleWelfarePipeline = async (claimId, targetRole, action = 'sign') => {
    const isSign = action === 'sign';
    const { data: currentClaim } = await supabase.from('welfare_claims').select('*').eq('id', claimId).single();
    const updatePayload = {};

    if (targetRole === 'assistant_chair') {
      updatePayload.assistant_chair_approval = isSign;
      if (!isSign) { updatePayload.chairman_approval = false; updatePayload.treasurer_approval = false; updatePayload.status = 'pending'; }
    } else if (targetRole === 'chairman') {
      if (isSign && !currentClaim.assistant_chair_approval) { alert('Assistant Chair must sign first.'); return; }
      updatePayload.chairman_approval = isSign;
      if (!isSign) { updatePayload.treasurer_approval = false; updatePayload.status = 'pending'; }
    } else if (targetRole === 'treasurer') {
      if (isSign && (!currentClaim.assistant_chair_approval || !currentClaim.chairman_approval)) { alert('Assistant Chair and Chairman must sign first.'); return; }
      updatePayload.treasurer_approval = isSign;
      updatePayload.status = isSign ? 'approved' : 'pending';
    }

    await supabase.from('welfare_claims').update(updatePayload).eq('id', claimId);
    fetchAdminData();
  };

  const handleSubmitWelfareClaim = async (e) => {
    e.preventDefault();
    setLoading(true);
    let documentUrl = null;
    if (claimDocument) {
      const fileExt = claimDocument.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const { data: upData } = await supabase.storage.from('welfare-documents').upload(fileName, claimDocument);
      if (upData) {
        const { data: { publicUrl } } = supabase.storage.from('welfare-documents').getPublicUrl(fileName);
        documentUrl = publicUrl;
      }
    }
    await supabase.from('welfare_claims').insert([{
      member_id: session.user.id,
      claim_type: claimType,
      amount_requested: parseAccountingNumber(claimAmountRaw),
      description: claimDesc,
      evidence_url: documentUrl,
      disbursement_method: claimDisbursementMethod,
      disbursement_details: claimDisbursementDetails,
      status: 'pending'
    }]);
    setMessage({ text: 'Welfare claim submitted for review.', type: 'success' });
    setClaimAmountRaw(''); setClaimDesc(''); setClaimDocument(null);
    fetchWelfareClaims(session.user.id);
    setLoading(false);
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    await supabase.from('next_of_kin').insert([{
      member_id: session.user.id,
      full_name: nokName,
      relationship: nokRel,
      id_number: nokId,
      phone: nokPhone,
      allocation_percentage: Number(nokPercent),
    }]);
    setNokName(''); setNokId(''); setNokPhone(''); setNokPercent('');
    fetchBeneficiaries(session.user.id);
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    const newChat = [...chatMessages, { sender: 'user', text: userText }, { sender: 'bot', text: 'I am your KEWA SACCO virtual assistant. You can check your free shares, apply for loans, or submit support tickets!' }];
    setChatMessages(newChat);
    setChatInput('');
  };

  const handleMpesaTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    const amt = parseAccountingNumber(mpesaAmountRaw);
    const receipt = mpesaCode.trim().toUpperCase() || `MP${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    await supabase.from('mpesa_transactions').insert([{
      member_id: session.user.id, phone_number: mpesaPhone || profile?.phone, amount: amt, transaction_type: mpesaType, mpesa_receipt_code: receipt, status: 'verified'
    }]);

    if (mpesaType === 'savings_deposit') {
      await supabase.from('savings_ledger').insert([{ member_id: session.user.id, amount: amt, transaction_type: 'monthly_contribution', reference_code: `MPESA-${receipt}` }]);
      setMessage({ text: `Success! KES ${amt.toLocaleString()} credited to Savings.`, type: 'success' });
    }
    setMpesaAmountRaw(''); setMpesaCode('');
    fetchUserData(session.user.id);
    setLoading(false);
  };

  const userRole = profile?.role || 'member';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 sm:pb-12 selection:bg-emerald-500 selection:text-white">
      <Header
        session={session}
        authMode={authMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        pendingGuaranteesCount={pendingGuaranteesCount}
        onSignOut={() => handlePerformSignOut(false)}
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
        onSignOut={() => handlePerformSignOut(false)}
      />

      <main className="max-w-6xl mx-auto p-3 sm:p-8 space-y-4 sm:space-y-6">
        {message.text && (
          <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium border shadow-lg flex items-center justify-between animate-fadeIn ${message.type === 'error' ? 'bg-rose-950/50 border-rose-800/80 text-rose-200' : 'bg-emerald-950/50 border-emerald-800/80 text-emerald-200'}`}>
            <span>{message.text}</span>
            <button onClick={() => setMessage({ text: '', type: '' })} className="text-xs opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

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
            onForgotPassword={async (e) => { e.preventDefault(); await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }); setMessage({ text: 'Reset link sent.', type: 'success' }); }}
            onUpdatePassword={handleUpdatePassword}
            loading={loading}
          />
        ) : (
          <>
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                    {profile?.companies?.name || 'KEWA Member'}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300 uppercase">
                    Role: {userRole.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white mt-2 tracking-tight">{profile?.full_name}</h2>
                <p className="text-xs text-slate-400 font-medium">Member Number: <span className="text-slate-200 font-bold font-mono">{profile?.member_number}</span></p>
              </div>

              <button
                type="button"
                onClick={() => generatePDFStatement({ profile, totalSavings, activeLoanBalance, freeSharesAvailable, savings, loans, repayments })}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-950/60 hover:bg-emerald-600 text-emerald-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-emerald-800 transition shadow cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Official Statement
              </button>
            </div>

            {activeTab === 'overview' && (
              <OverviewTab
                totalSavings={totalSavings}
                freeSharesAvailable={freeSharesAvailable}
                totalRunningGuaranteesCommitted={totalRunningGuaranteesCommitted}
                activeLoanBalance={activeLoanBalance}
                announcements={announcements}
                savings={savings}
                repayments={repayments}
              />
            )}

            {activeTab === 'loans' && (
              <LoansTab
                loanProduct={loanProduct}
                onProductChange={handleLoanProductChange}
                maxLimit={maxLimitForSelectedProduct}
                loanPrincipalRaw={loanPrincipalRaw}
                setLoanPrincipalRaw={setLoanPrincipalRaw}
                loanPrincipalNum={loanPrincipalNum}
                loanMonths={loanMonths}
                setLoanMonths={setLoanMonths}
                interestRate={interestRate}
                disbursementMethod={disbursementMethod}
                setDisbursementMethod={setDisbursementMethod}
                disbursementDetails={disbursementDetails}
                setDisbursementDetails={setDisbursementDetails}
                profilePhone={profilePhone}
                guarantorList={guarantorList}
                allMembers={allMembers}
                currentUserId={session.user.id}
                onUpdateGuarantorRow={(idx, fields) => {
                  const updated = [...guarantorList];
                  updated[idx] = { ...updated[idx], ...fields };
                  setGuarantorList(updated);
                }}
                onAddGuarantorRow={() => setGuarantorList([...guarantorList, { guarantorId: '', searchTerm: '', amountRaw: '', eligible: true, note: '' }])}
                onRemoveGuarantorRow={(idx) => setGuarantorList(guarantorList.filter((_, i) => i !== idx))}
                calculatedTotal={loanBreakdown.totalPayable}
                monthlyInstallment={loanBreakdown.monthlyInstallment}
                onInitiateLoan={handleInitiateLoan}
                loans={loans}
                onDownloadPDF={(l) => generatePDFStatement({ profile, totalSavings, activeLoanBalance, freeSharesAvailable, savings, loans: [l], repayments })}
                loading={loading}
              />
            )}

            {activeTab === 'guarantors' && (
              <GuarantorsTab
                guarantorRequests={guarantorRequests}
                freeSharesAvailable={freeSharesAvailable}
                onRespondGuarantor={handleRespondGuarantor}
              />
            )}

            {activeTab === 'documents' && (
              <DocumentsTab
                saccoDocs={saccoDocs}
                onRefreshDocs={fetchSaccoDocuments}
                userRole={userRole}
                onDeleteDoc={handleDeleteSaccoDocument}
              />
            )}

            {activeTab === 'beneficiaries' && (
              <ProfileWelfareTab
                editFullName={editFullName}
                setEditFullName={setEditFullName}
                editPhone={editPhone}
                setEditPhone={setEditPhone}
                editIdNumber={editIdNumber}
                setEditIdNumber={setEditIdNumber}
                editCompanyId={editCompanyId}
                setEditCompanyId={setEditCompanyId}
                companies={companies}
                onUpdateProfile={handleUpdateProfileDetails}
                onOpenPinModal={() => setShowPinModal(true)}
                beneficiaries={beneficiaries}
                nokName={nokName}
                setNokName={setNokName}
                nokRel={nokRel}
                setNokRel={setNokRel}
                nokId={nokId}
                setNokId={setNokId}
                nokPhone={nokPhone}
                setNokPhone={setNokPhone}
                nokPercent={nokPercent}
                setNokPercent={setNokPercent}
                onAddBeneficiary={handleAddBeneficiary}
                onDeleteBeneficiary={handleDeleteBeneficiary}
                claimType={claimType}
                setClaimType={setClaimType}
                claimAmountRaw={claimAmountRaw}
                setClaimAmountRaw={setClaimAmountRaw}
                claimDisbursementMethod={claimDisbursementMethod}
                setClaimDisbursementMethod={setClaimDisbursementMethod}
                claimDisbursementDetails={claimDisbursementDetails}
                setClaimDisbursementDetails={setClaimDisbursementDetails}
                claimDesc={claimDesc}
                setClaimDesc={setClaimDesc}
                setClaimDocument={setClaimDocument}
                onSubmitClaim={handleSubmitWelfareClaim}
                welfareClaims={welfareClaims}
                loading={loading}
              />
            )}

            {activeTab === 'mpesa' && (
              <MpesaTab
                profile={profile}
                mpesaType={mpesaType}
                setMpesaType={setMpesaType}
                mpesaPhone={mpesaPhone}
                setMpesaPhone={setMpesaPhone}
                mpesaAmountRaw={mpesaAmountRaw}
                setMpesaAmountRaw={setMpesaAmountRaw}
                mpesaCode={mpesaCode}
                setMpesaCode={setMpesaCode}
                onSubmitMpesa={handleMpesaTransaction}
                loading={loading}
              />
            )}

            {activeTab === 'support' && (
              <SupportTab
                profile={profile}
                chairmanOfficial={chairmanOfficial}
                treasurerOfficial={treasurerOfficial}
                asstChairOfficial={asstChairOfficial}
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                onSendChatMessage={handleSendChatMessage}
                chatEndRef={chatEndRef}
                inquiryCategory={inquiryCategory}
                setInquiryCategory={setInquiryCategory}
                inquirySubject={inquirySubject}
                setInquirySubject={setInquirySubject}
                inquiryMessage={inquiryMessage}
                setInquiryMessage={setInquiryMessage}
                onCreateInquiry={handleCreateInquiry}
                inquiries={inquiries}
                loading={loading}
              />
            )}

            {activeTab === 'admin' && ['admin', 'treasurer', 'chairman', 'assistant_chair'].includes(userRole) && (
              <LeadershipHubTab
                userRole={userRole}
                totalSocietySharesCapital={totalSocietySharesCapital}
                totalSocietyInterestAccrued={totalSocietyInterestAccrued}
                totalSocietyUnpaidLoans={totalSocietyUnpaidLoans}
                netSocietyLiquidCapital={netSocietyLiquidCapital}
                filteredGuarantorInspectionList={filteredGuarantorInspectionList}
                guarantorTrackerSearch={guarantorTrackerSearch}
                setGuarantorTrackerSearch={setGuarantorTrackerSearch}
                onRefreshAdmin={fetchAdminData}
                allPendingClaims={allPendingClaims}
                onWelfarePipeline={handleWelfarePipeline}
                onExecuteHistoricalMigration={handleExecuteHistoricalMigration}
                setMigrationFile={setMigrationFile}
                filteredMemberDirectory={filteredMemberDirectory}
                memberDirectorySearch={memberDirectorySearch}
                setMemberDirectorySearch={setMemberDirectorySearch}
                memberDirectoryCompanyFilter={memberDirectoryCompanyFilter}
                setMemberDirectoryCompanyFilter={setMemberDirectoryCompanyFilter}
                allMembers={allMembers}
                manualTargetMemberId={manualTargetMemberId}
                setManualTargetMemberId={setManualTargetMemberId}
                manualAdjustmentType={manualAdjustmentType}
                setManualAdjustmentType={setManualAdjustmentType}
                manualAmountRaw={manualAmountRaw}
                setManualAmountRaw={setManualAmountRaw}
                manualRefCode={manualRefCode}
                setManualRefCode={setManualRefCode}
                onManualMemberAdjustment={handleManualMemberAdjustment}
                performanceRankedLoans={performanceRankedLoans}
                docTitle={docTitle}
                setDocTitle={setDocTitle}
                docCategory={docCategory}
                setDocCategory={setDocCategory}
                docYear={docYear}
                setDocYear={setDocYear}
                setDocFile={setDocFile}
                onUploadSaccoDocument={handleUploadSaccoDocument}
                batchMonth={batchMonth}
                setBatchMonth={setBatchMonth}
                onCSVUpload={handleCSVUpload}
                batchPreview={batchPreview}
                onExecuteBatchCheckoff={handleExecuteBatchCheckoff}
                allPendingLoans={allPendingLoans}
                onSignatoryPipeline={handleSignatoryPipeline}
                allAdminInquiries={allAdminInquiries}
                adminReplyText={adminReplyText}
                setAdminReplyText={setAdminReplyText}
                onAdminReplyInquiry={handleAdminReplyInquiry}
                newNoticeTitle={newNoticeTitle}
                setNewNoticeTitle={setNewNoticeTitle}
                newNoticeContent={newNoticeContent}
                setNewNoticeContent={setNewNoticeContent}
                onPublishNotice={handlePublishNotice}
cientAuditLogs={auditLogs}
                loading={loading}
              />
            )}
          </>
        )}
      </main>

      <ChangePinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onUpdatePin={handleUpdatePin}
        loading={loading}
      />

      <LoanAuthorizationModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onConfirm={handleConfirmLoanSubmission}
        loading={loading}
        loanProduct={loanProduct}
        loanPrincipalNum={loanPrincipalNum}
        loanMonths={loanMonths}
        interestRate={interestRate}
        calculatedTotal={loanBreakdown.totalPayable}
        monthlyInstallment={loanBreakdown.monthlyInstallment}
        disbursementMethod={disbursementMethod}
        disbursementDetails={disbursementDetails}
      />

      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingGuaranteesCount={pendingGuaranteesCount}
        userRole={userRole}
        onSignOut={() => handlePerformSignOut(false)}
      />
    </div>
  );
}