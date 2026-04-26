'use client';
import Header from '@/components/Header';
import {
  CheckCircle2, Clock, AlertCircle, FileText, Building2,
  User, Shield, Landmark, Globe, TrendingUp,
} from 'lucide-react';

const kycDocs = [
  { label: 'Tax Certificate (Vergi Levhası)', status: 'approved', icon: FileText },
  { label: 'Company Registration (Ticaret Sicil)', status: 'approved', icon: Building2 },
  { label: 'CEO Identity Verification', status: 'approved', icon: User },
  { label: 'Bank Account Verification', status: 'approved', icon: Landmark },
  { label: 'BDDK KYC Compliance', status: 'approved', icon: Shield },
  { label: 'Central Bank Risk DB Check', status: 'pending', icon: Globe },
  { label: 'AML Screening', status: 'approved', icon: Shield },
];

const esprChecklist = [
  { label: 'DPP generation system active', done: true },
  { label: 'Supplier material traceability (Tier 1)', done: true },
  { label: 'IoT sensor data integration', done: true },
  { label: 'Customs API connection (TÜBİTAK/BTGM)', done: false },
  { label: 'GS1 QR code standard compliant', done: true },
  { label: 'Carbon footprint reporting per batch', done: true },
  { label: 'Water usage reporting per batch', done: true },
  { label: 'Chemical compliance (REACH)', done: false },
  { label: 'Tier 2 supplier traceability', done: false },
  { label: 'Circular economy data fields', done: false },
];

const timeline = [
  { date: 'Jul 2024', label: 'ESPR Regulation (2024/1781) entered into force', done: true },
  { date: 'Q2 2026', label: 'Delegated act (binding DPP spec) expected', done: false, active: true },
  { date: 'Q4 2027', label: 'DPP mandatory for textiles sold in EU (18-month window starts)', done: false },
  { date: 'Mid 2028', label: 'Full DPP compliance deadline for all EU textile products', done: false },
  { date: '2030', label: 'ESPR extended to additional product categories', done: false },
];

const docStatusStyle: Record<string, string> = {
  approved: 'text-emerald-600 bg-emerald-50',
  pending: 'text-amber-600 bg-amber-50',
  missing: 'text-red-600 bg-red-50',
};

const docStatusIcon: Record<string, React.ReactNode> = {
  approved: <CheckCircle2 size={16} />,
  pending: <Clock size={16} />,
  missing: <AlertCircle size={16} />,
};

export default function CompliancePage() {
  const kycScore = Math.round((kycDocs.filter(d => d.status === 'approved').length / kycDocs.length) * 100);
  const esprScore = Math.round((esprChecklist.filter(c => c.done).length / esprChecklist.length) * 100);
  const overallScore = Math.round((kycScore + esprScore) / 2);

  return (
    <div>
      <Header title="Compliance & KYC" subtitle="BDDK KYC status, ESPR readiness and regulatory timeline" />
      <div className="p-8 space-y-6">

        {/* Score Cards */}
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
            <div className="relative w-28 h-28 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none"
                  stroke={overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="10"
                  strokeDasharray={`${(overallScore / 100) * 251} 251`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{overallScore}%</span>
              </div>
            </div>
            <p className="font-bold text-slate-900 mt-3">Overall Score</p>
            <p className="text-slate-500 text-sm">Combined compliance rating</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
            <div className="relative w-28 h-28 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="10"
                  strokeDasharray={`${(kycScore / 100) * 251} 251`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{kycScore}%</span>
              </div>
            </div>
            <p className="font-bold text-slate-900 mt-3">KYC / BDDK</p>
            <p className="text-slate-500 text-sm">{kycDocs.filter(d => d.status === 'approved').length}/{kycDocs.length} documents verified</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
            <div className="relative w-28 h-28 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="10"
                  strokeDasharray={`${(esprScore / 100) * 251} 251`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{esprScore}%</span>
              </div>
            </div>
            <p className="font-bold text-slate-900 mt-3">ESPR Readiness</p>
            <p className="text-slate-500 text-sm">{esprChecklist.filter(c => c.done).length}/{esprChecklist.length} criteria met</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* KYC Documents */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4">KYC Documents</h2>
            <div className="space-y-3">
              {kycDocs.map(({ label, status, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className={`p-1.5 rounded-lg ${docStatusStyle[status]}`}>
                    <Icon size={14} />
                  </div>
                  <span className="flex-1 text-sm text-slate-700">{label}</span>
                  <div className={`${docStatusStyle[status]} p-1 rounded-full`}>
                    {docStatusIcon[status]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ESPR Checklist */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4">ESPR DPP Readiness Checklist</h2>
            <div className="space-y-2.5">
              {esprChecklist.map(({ label, done }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    {done
                      ? <CheckCircle2 size={14} className="text-emerald-600" />
                      : <div className="w-2 h-2 rounded-full bg-slate-300" />
                    }
                  </div>
                  <span className={`text-sm ${done ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
                  {!done && <span className="ml-auto text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-lg">Required</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regulatory Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-6">EU ESPR Regulatory Timeline</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
            <div className="space-y-6">
              {timeline.map(({ date, label, done, active }) => (
                <div key={date} className="flex items-start gap-6 pl-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${
                    done ? 'bg-emerald-500 border-emerald-500' : active ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'
                  }`}>
                    {done ? <CheckCircle2 size={16} className="text-white" /> :
                     active ? <Clock size={14} className="text-white" /> :
                     <div className="w-2 h-2 rounded-full bg-slate-300" />}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-sm ${done ? 'text-emerald-600' : active ? 'text-blue-600' : 'text-slate-400'}`}>{date}</span>
                      {active && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">Upcoming</span>}
                    </div>
                    <p className={`text-sm mt-0.5 ${done ? 'text-slate-700' : active ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
          <TrendingUp size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 text-sm">Action Recommended</p>
            <p className="text-blue-700 text-sm mt-1">
              The EU delegated act is expected in Q2 2026. Once published, factories have an 18-month window to reach full ESPR compliance.
              Complete your Tier 2 supplier traceability and REACH chemical compliance now to stay ahead of the deadline.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
