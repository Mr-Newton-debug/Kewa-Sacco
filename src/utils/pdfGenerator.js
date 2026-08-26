import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDFStatement = ({
  profile,
  totalSavings = 0,
  activeLoanBalance = 0,
  freeSharesAvailable = 0,
  savings = [],
  loans = [],
  repayments = []
}) => {
  try {
    const doc = new jsPDF();

    // Top Header Banner
    doc.setFillColor(6, 78, 59);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('KEWA SACCO SOCIETY LIMITED', 14, 18);
    doc.setFontSize(9);
    doc.text('Kenya Builders & Concrete • Warren Concrete • Eurocon Tiles • External', 14, 25);
    doc.text(`Statement Date: ${new Date().toLocaleDateString('en-GB')}`, 145, 25);

    // Member Demographics Section
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.text('OFFICIAL MEMBER UNIFIED AUDIT STATEMENT', 14, 46);

    const compName = Array.isArray(profile?.companies) 
      ? profile.companies[0]?.name 
      : profile?.companies?.name;

    doc.setFontSize(9);
    doc.text(`Member Name: ${profile?.full_name || 'N/A'}`, 14, 54);
    doc.text(`Member No: ${profile?.member_number || 'N/A'}`, 14, 60);
    doc.text(`Branch / Company: ${compName || 'KEWA SACCO'}`, 14, 66);
    doc.text(`National ID: ${profile?.id_number || 'N/A'}`, 120, 54);
    doc.text(`Total Shares/Savings: KES ${Number(totalSavings).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 120, 60);
    doc.text(`Active Loan Debt: KES ${Number(activeLoanBalance).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 120, 66);
    doc.text(`Free Shares Available: KES ${Number(freeSharesAvailable).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 120, 72);

    // Progressive Ledger Assembly
    doc.setFontSize(11);
    doc.setTextColor(6, 78, 59);
    doc.text('1. Progressive Member Financial Activity Ledger (Contributions (+) & Loan Movements (-))', 14, 82);

    const unifiedLedger = [
      ...savings.map((s) => ({
        dateObj: new Date(s.created_at),
        dateStr: new Date(s.created_at).toLocaleDateString('en-GB'),
        type: 'SAVINGS CONTRIBUTION',
        ref: s.reference_code || 'CHECKOFF',
        amount: Number(s.amount || 0),
        isPositive: true,
      })),
      ...loans.map((l) => ({
        dateObj: new Date(l.created_at),
        dateStr: new Date(l.created_at).toLocaleDateString('en-GB'),
        type: `LOAN DISBURSED (${(l.loan_product || 'MAIN').replace('_', ' ').toUpperCase()})`,
        ref: `LOAN-${(l.id || '').slice(0, 6)}`,
        amount: Number(l.principal_amount || 0),
        isPositive: true,
      })),
      ...repayments.map((r) => ({
        dateObj: new Date(r.created_at),
        dateStr: new Date(r.created_at).toLocaleDateString('en-GB'),
        type: `LOAN REPAYMENT (${(r.loans?.loan_product || 'LOAN').replace('_', ' ').toUpperCase()})`,
        ref: r.reference_code || 'DEDUCTION',
        amount: Number(r.amount || 0),
        isPositive: false,
      })),
    ].sort((a, b) => a.dateObj - b.dateObj);

    const ledgerRows = unifiedLedger.length > 0
      ? unifiedLedger.map((item) => [
          item.dateStr,
          item.type,
          item.ref,
          item.isPositive
            ? `+KES ${item.amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`
            : `-KES ${item.amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`,
        ])
      : [['-', 'No financial transactions recorded', '-', 'KES 0.00']];

    autoTable(doc, {
      startY: 87,
      head: [['Transaction Date', 'Activity Type', 'Reference Code', 'Amount (Plus / Minus)']],
      body: ledgerRows,
      theme: 'striped',
      headStyles: { fillColor: [6, 78, 59] },
    });

    // Summations & Balances Table
    const sumY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setTextColor(180, 83, 9);
    doc.text('2. Account Summary, Summations & Net Difference', 14, sumY);

    const totalCreditsSum = unifiedLedger.filter((i) => i.isPositive).reduce((acc, curr) => acc + curr.amount, 0);
    const totalDebitsSum = unifiedLedger.filter((i) => !i.isPositive).reduce((acc, curr) => acc + curr.amount, 0);
    const netAccountDifference = totalCreditsSum - totalDebitsSum;

    const summaryRows = [
      ['Total Credits (Savings Deposits & Loan Disbursements)', `KES ${totalCreditsSum.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`],
      ['Total Debits (Loan Repayments & Deductions)', `KES ${totalDebitsSum.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`],
      ['Net Account Difference (Credits minus Debits)', `KES ${netAccountDifference.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`],
      ['Current Outstanding Loan Balance', `KES ${Number(activeLoanBalance).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`]
    ];

    autoTable(doc, {
      startY: sumY + 4,
      head: [['Financial Metric', 'Summation Value']],
      body: summaryRows,
      theme: 'striped',
      headStyles: { fillColor: [180, 83, 9] },
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 150;
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('This is an official computer-generated progressive audit statement issued by KEWA SACCO core financial system.', 14, finalY);

    doc.save(`KEWA_Progressive_Statement_${profile?.member_number || 'Member'}.pdf`);
  } catch (err) {
    alert('Could not generate PDF: ' + err.message);
  }
};