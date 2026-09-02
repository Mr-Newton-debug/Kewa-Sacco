import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Users, CheckCircle, XCircle } from 'lucide-react';

export default function GuarantorsTab({ profile, session }) {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (session?.user?.id) {
      fetchGuarantorData();
    }
  }, [session]);

  const fetchGuarantorData = async () => {
    try {
      setLoading(true);
      const userId = session.user.id;

      const { data: incoming } = await supabase
        .from('loan_guarantors')
        .select('*, loans(loan_product, principal_amount, member_id, profiles(full_name, member_number))')
        .eq('guarantor_id', userId);

      if (incoming) setIncomingRequests(incoming);
    } catch (err) {
      console.error('Error fetching guarantor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (guarantorRowId, responseStatus) => {
    setMessage({ text: '', type: '' });
    try {
      const { error } = await supabase
        .from('loan_guarantors')
        .update({ status: responseStatus })
        .eq('id', guarantorRowId);

      if (error) throw error;

      setMessage({ text: `Guarantee request ${responseStatus} successfully.`, type: 'success' });
      fetchGuarantorData();
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-xs font-mono">Loading guarantor portal...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> Incoming Guarantee Requests
        </h3>
        <p className="text-xs text-slate-400 mb-4">Review and endorse loan applications from fellow members requesting your shares as guarantee security.</p>

        {message.text && (
          <div className={`mb-4 px-4 py-3 rounded-2xl text-xs font-bold border ${message.type === 'error' ? 'bg-rose-950/80 border-rose-800 text-rose-300' : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-3">
          {incomingRequests.map((req) => (
            <div key={req.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-xs font-bold text-white">
                  Borrower: {req.loans?.profiles?.full_name || 'Member'} ({req.loans?.profiles?.member_number || 'N/A'})
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Product: <span className="uppercase text-emerald-400 font-semibold">{req.loans?.loan_product?.replace('_', ' ')}</span> • Principal: KES {Number(req.loans?.principal_amount || 0).toLocaleString()}
                </p>
                <p className="text-[11px] text-cyan-400 font-mono mt-1">
                  Amount Requested from You: KES {Number(req.amount_guaranteed || 0).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {req.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleRespond(req.id, 'accepted')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req.id, 'rejected')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase ${
                    req.status === 'accepted' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}

          {incomingRequests.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-6">No incoming guarantee requests found.</p>
          )}
        </div>
      </div>
    </div>
  );
}import React from 'react';
import { Users, CheckCircle, XCircle } from 'lucide-react';

export default function GuarantorsTab({
  guarantorRequests,
  freeSharesAvailable,
  onRespondGuarantor
}) {
  return (
    <div className="space-y-6">
      {/* Free Shares Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Guarantorship Eligibility</h3>
          <p className="text-xs text-slate-400 mt-0.5">Your available free shares determine your maximum guarantee power for peer loans.</p>
        </div>
        <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 font-mono text-cyan-400 font-bold text-sm">
          Free Shares: KES {Number(freeSharesAvailable || 0).toLocaleString()}
        </div>
      </div>

      {/* Incoming Requests Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> Incoming Guarantee Requests
        </h3>
        <p className="text-xs text-slate-400 mb-4">Review and endorse loan applications from fellow members requesting your shares as guarantee security.</p>

        <div className="space-y-3">
          {guarantorRequests.map((req) => (
            <div key={req.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-xs font-bold text-white">
                  Borrower: {req.loans?.profiles?.full_name || 'Member'} ({req.loans?.profiles?.member_number || 'N/A'})
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Product: <span className="uppercase text-emerald-400 font-semibold">{req.loans?.loan_product?.replace('_', ' ')}</span> • Principal: KES {Number(req.loans?.principal_amount || 0).toLocaleString()}
                </p>
                <p className="text-[11px] text-cyan-400 font-mono mt-1">
                  Amount Requested from You: KES {Number(req.amount_guaranteed || 0).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {req.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => onRespondGuarantor(req.id, 'accepted', req.amount_guaranteed)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      onClick={() => onRespondGuarantor(req.id, 'rejected', req.amount_guaranteed)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase ${
                    req.status === 'accepted' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}

          {guarantorRequests.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-6">No incoming guarantee requests found.</p>
          )}
        </div>
      </div>
    </div>
  );
}