export function generatePDFStatement({ profile, totalSavings, activeLoanBalance, freeSharesAvailable, savings, loans, repayments }) {
  const windowContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>KEWA SACCO - Official Financial Statement</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; padding: 30px; }
          .header { border-bottom: 3px solid #065f46; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
          h1 { color: #065f46; font-size: 24px; margin: 0; }
          p { margin: 4px 0; font-size: 13px; color: #4b5563; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e5e7eb; }
          .summary-box { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 8px; margin-bottom: 25px; }
          .summary-box h3 { color: #065f46; margin-top: 0; font-size: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th, td { border: 1px solid #d1d5db; padding: 8px 10px; text-align: left; }
          th { background: #065f46; color: white; font-weight: 600; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .footer { margin-top: 40px; font-size: 11px; text-align: center; color: #9ca3af; border-top: 1px solid #e5e7eb; pt-10; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>KEWA BUILDERS & CONCRETE CO. LTD SACCO</h1>
            <p>Multi-Branch Financial Cooperative Portal</p>
          </div>
          <div style="text-align: right;">
            <p><strong>Official Statement</strong></p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <p><strong>Member Name:</strong> ${profile?.full_name || 'N/A'}</p>
            <p><strong>Member Number:</strong> ${profile?.member_number || 'N/A'}</p>
          </div>
          <div>
            <p><strong>Branch / Company:</strong> ${profile?.companies?.name || 'KEWA SACCO'}</p>
            <p><strong>National ID:</strong> ${profile?.id_number || 'N/A'}</p>
          </div>
        </div>

        <div class="summary-box">
          <h3>Account Financial Summary</h3>
          <p><strong>Total Accumulated Savings:</strong> KES ${Number(totalSavings || 0).toLocaleString()}</p>
          <p><strong>Active Loan Debt Balance:</strong> KES ${Number(activeLoanBalance || 0).toLocaleString()}</p>
          <p><strong>Unencumbered Free Shares:</strong> KES ${Number(freeSharesAvailable || 0).toLocaleString()}</p>
        </div>

        <div>
          <h3 style="color: #1f2937; font-size: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Recent Savings Contributions</h3>
          <table>
            <thead>
              <tr><th>Date</th><th>Transaction Type</th><th>Reference Code</th><th>Amount (KES)</th></tr>
            </thead>
            <tbody>
              ${(savings || []).map(s => `
                <tr>
                  <td>${new Date(s.created_at).toLocaleDateString()}</td>
                  <td>${s.transaction_type.replace('_', ' ').toUpperCase()}</td>
                  <td>${s.reference_code || 'N/A'}</td>
                  <td><b>KES ${Number(s.amount).toLocaleString()}</b></td>
                </tr>
              `).join('')}
              ${(!savings || savings.length === 0) ? '<tr><td colspan="4" style="text-align:center;">No savings records found.</td></tr>' : ''}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 30px;">
          <h3 style="color: #1f2937; font-size: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Active & Historical Loans</h3>
          <table>
            <thead>
              <tr><th>Product</th><th>Principal (KES)</th><th>Period</th><th>Balance Remaining (KES)</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${(loans || []).map(l => `
                <tr>
                  <td>${l.loan_product.replace('_', ' ').toUpperCase()}</td>
                  <td>KES ${Number(l.principal_amount).toLocaleString()}</td>
                  <td>${l.repayment_period_months} Months</td>
                  <td><b>KES ${Number(l.balance_remaining).toLocaleString()}</b></td>
                  <td><span style="text-transform: uppercase;">${l.status}</span></td>
                </tr>
              `).join('')}
              ${(!loans || loans.length === 0) ? '<tr><td colspan="5" style="text-align:center;">No loan records found.</td></tr>' : ''}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>This is a system-generated official report for KEWA SACCO Portal. Valid without physical signature unless stamped by executive auditors.</p>
        </div>
      </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(windowContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 600);
  }
}