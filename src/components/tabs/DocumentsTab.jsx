import React from 'react';
import { Download, ShieldCheck, BookOpen, Trash2 } from 'lucide-react';

export default function DocumentsTab({
  saccoDocs,
  userRole,
  onDeleteDoc
}) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" /> Society Bylaws & Official Documents
        </h3>
        <p className="text-xs text-slate-400 mb-6">Access and review official cooperative policies, loan guidelines, and statutory compliance documents.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {saccoDocs.map((doc) => (
            <div key={doc.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 uppercase">
                    {doc.category || 'Governance'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{doc.year || '2025/2026'}</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{doc.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{doc.description || 'Official KEWA SACCO cooperative record.'}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Record
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={doc.file_url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-[11px] font-bold transition"
                  >
                    <Download className="w-3.5 h-3.5" /> View
                  </a>
                  {['admin', 'treasurer', 'chairman'].includes(userRole) && (
                    <button
                      onClick={() => onDeleteDoc(doc.id, doc.title)}
                      className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {saccoDocs.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-8 col-span-2">No official documents published yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}