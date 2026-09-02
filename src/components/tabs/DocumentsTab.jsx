import React from 'react';
import { Download, ShieldCheck, BookOpen } from 'lucide-react';

export default function DocumentsTab() {
  const documentsList = [
    {
      id: 1,
      title: 'KEWA SACCO Official Bylaws & Constitution',
      category: 'Governance',
      description: 'Comprehensive guidelines governing membership rights, shares accumulation, dividend payouts, and committee structures.',
      size: '1.2 MB'
    },
    {
      id: 2,
      title: 'Loan Policy & Interest Rate Guidelines',
      category: 'Loans',
      description: 'Details on Main Loans, Emergency Loans, Christmas Advances, and Monthly Shylock products with respective tiering rules.',
      size: '850 KB'
    },
    {
      id: 3,
      title: 'Guarantorship & Default Recovery Procedures',
      category: 'Risk Management',
      description: 'Framework outlining guarantor liability, attachment of shares, and recovery protocols in case of loan default.',
      size: '620 KB'
    },
    {
      id: 4,
      title: 'Data Protection & Privacy Policy (ODPC Compliant)',
      category: 'Compliance',
      description: 'Member data handling practices, security measures, and compliance guidelines under the Kenya Data Protection Act (2019).',
      size: '410 KB'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" /> Society Bylaws & Official Documents
        </h3>
        <p className="text-xs text-slate-400 mb-6">Access and review official cooperative policies, loan guidelines, and statutory compliance documents.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentsList.map((doc) => (
            <div key={doc.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 uppercase">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{doc.size}</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{doc.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{doc.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Official Record
                </span>
                <button
                  onClick={() => alert(`Downloading ${doc.title}...`)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> View / Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}