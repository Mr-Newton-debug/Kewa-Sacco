// Individual Free Shares = Max(0, Total Savings - Active Debt - Running Pledges)
export const calculateFreeShares = (savingsTotal, activeDebt, totalCommittedGuarantees) => {
    const savings = Number(savingsTotal || 0);
    const debt = Number(activeDebt || 0);
    const pledges = Number(totalCommittedGuarantees || 0);
    return Math.max(0, savings - debt - pledges);
  };
  
  // Net Liquid Capital = (Total Member Shares - Total Unpaid Loans) + Total Accrued Interest
  export const calculateNetSocietyLiquidity = (totalShares, totalUnpaidLoans, totalAccruedInterest) => {
    const shares = Number(totalShares || 0);
    const unpaid = Number(totalUnpaidLoans || 0);
    const interest = Number(totalAccruedInterest || 0);
    return (shares - unpaid) + interest;
  };
  
  // Standard flat interest rate installment calculator
  export const calculateLoanBreakdown = (principal, monthlyRatePercent, periodMonths) => {
    const p = Number(principal || 0);
    const r = Number(monthlyRatePercent || 0) / 100;
    const m = Number(periodMonths || 1);
    
    const totalInterest = p * r * m;
    const totalPayable = p + totalInterest;
    const monthlyInstallment = m > 0 ? totalPayable / m : 0;
  
    return {
      totalInterest,
      totalPayable,
      monthlyInstallment
    };
  };