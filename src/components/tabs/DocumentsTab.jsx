import React from 'react';
import { FolderDown, RotateCcw, FileArchive, Download, Trash2 } from 'lucide-react';

export default function DocumentsTab({
  saccoDocs = [],
  onRefreshDocs,
  userRole,
  onDeleteDoc
}) {
  return (
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
          type="button"
          onClick={onRefreshDocs}
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
          <p className="text-[11px] text-slate-500 mt-0.5">
            Leadership will upload the upcoming AGM and audit packages here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {saccoDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      doc.category === 'audit_report'
                        ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                        : doc.category === 'agm_booklet'
                        ? 'bg-amber-950 border border-amber-800 text-amber-300'
                        : 'bg-blue-950 border border-blue-800 text-blue-300'
                    }`}
                  >
                    {(doc.category || 'document').replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{doc.financial_year}</span>
                </div>

                <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">{doc.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <span>Size: {doc.file_size || 'PDF'}</span> •{' '}
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
                    type="button"
                    onClick={() => onDeleteDoc(doc.id, doc.title)}
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
  );
}