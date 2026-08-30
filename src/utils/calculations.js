export function calculateFreeShares(totalSavings, activeLoanBalance, totalRunningGuarantees) {
  const savings = Number(totalSavings) || 0;
  const loanDebt = Number(activeLoanBalance) || 0;
  const guarantees = Number(totalRunningGuarantees) || 0;
  
  const free = savings - loanDebt - guarantees;
  return Math.max(0, free);
}

export function calculateLoanBreakdown(principal, monthlyInterestRatePercent, months, productType = 'main_loan') {
  const p = Number(principal) || 0;
  const r = (Number(monthlyInterestRatePercent) || 1.0) / 100;
  const n = Number(months) || 1;

  let totalInterest = 0;

  if (productType === 'monthly_shylock') {
    // Shylock flat high-interest short-term model (e.g. 5% flat per month)
    totalInterest = p * (r * 5); 
  } else {
    // Standard reducing balance or structured multiplier model used across SACCO branches
    totalInterest = p * r * n;
  }

  const totalPayable = p + totalInterest;
  const monthlyInstallment = totalPayable / n;

  return {
    totalInterest,
    totalPayable,
    monthlyInstallment
  };
}

export function calculateNetSocietyLiquidity(totalSharesCapital, totalUnpaidLoans, totalInterestAccrued) {
  return Number(totalSharesCapital) + Number(totalInterestAccrued) - Number(totalUnpaidLoans);
}