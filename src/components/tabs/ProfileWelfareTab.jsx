import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User, Shield, HeartHandshake, Phone, Mail, Building } from 'lucide-react';

export default function ProfileWelfareTab({ profile, session }) {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [welfareContributions, setWelfareContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchWelfareData();
    }
  }, [session]);

  const fetchWelfareData = async () => {
    try {
      setLoading(true);
      const userId = session.user.id;

      const [benRes, welRes] = await Promise.all([
        supabase.from('beneficiaries').select('*').eq('member_id', userId),
        supabase.from('welfare_ledger').select('*').eq('member_id', userId)
      ]);

      if (benRes.data) setBeneficiaries(benRes.data);
      if (welRes.data) setWelfareContributions(welRes.data);
    } catch (err) {
      console.error('Error loading profile welfare data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalWelfare = welfareContributions.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-xs font-mono">Loading profile & welfare records...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
          <User className="w-4 h-4 text-emerald-400" /> Member Profile & Account Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Full Name</span>
            <p className="text-xs font-bold text-white mt-1">{profile?.full_name || 'N/A'}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Member Number</span>
            <p className="text-xs font-bold text-emerald-400 font-mono mt-1">{profile?.member_number || 'N/A'}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">National ID</span>
            <p className="text-xs font-bold text-white font-mono mt-1">{profile?.id_number || 'N/A'}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Email Address</span>
            <p className="text-xs font-bold text-white mt-1 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {profile?.email || session?.user?.email}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Phone Number</span>
            <p className="text-xs font-bold text-white mt-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {profile?.phone || 'N/A'}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Branch / Company</span>
            <p className="text-xs font-bold text-white mt-1 flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-slate-400" /> {profile?.companies?.name || 'KEWA SACCO'}</p>
          </div>
        </div>
      </div>

      {/* Beneficiaries & Welfare Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
            <HeartHandshake className="w-4 h-4 text-emerald-400" /> Registered Beneficiaries
          </h3>
          <div className="space-y-3">
            {beneficiaries.map((b) => (
              <div key={b.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">{b.full_name}</h4>
                  <p className="text-[11px] text-slate-400">Relationship: {b.relationship} • Phone: {b.phone || 'N/A'}</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-800">
                  {b.allocation_percentage}%
                </span>
              </div>
            ))}
            {beneficiaries.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">No beneficiaries registered on this account.</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Benevolent & Welfare Ledger
          </h3>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4">
            <p className="text-[11px] text-slate-400">Total Welfare Contributions</p>
            <h4 className="text-xl font-black text-emerald-400 font-mono mt-1">KES {totalWelfare.toLocaleString()}</h4>
          </div>
          <div className="space-y-2">
            {welfareContributions.map((w) => (
              <div key={w.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-300">{w.description || 'Welfare Contribution'}</span>
                <span className="font-mono font-bold text-white">KES {Number(w.amount).toLocaleString()}</span>
              </div>
            ))}
            {welfareContributions.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-2">No welfare logs recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}