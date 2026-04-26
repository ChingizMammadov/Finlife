'use client';
import Header from '@/components/Header';
import { dppData, invoiceData, cashFlowChartData, dppStatusChartData } from '@/lib/mockData';
import {
  FileText, CreditCard, Clock, ShieldCheck,
  TrendingUp, ArrowUpRight, AlertCircle, CheckCircle2,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const stats = [
  {
    label: 'Active DPPs',
    value: '142',
    change: '+18 this month',
    positive: true,
    icon: FileText,
    color: 'blue',
  },
  {
    label: 'Total Financed',
    value: '€2.4M',
    change: '+€340k this month',
    positive: true,
    icon: CreditCard,
    color: 'emerald',
  },
  {
    label: 'Avg. Processing',
    value: '3.2 hrs',
    change: 'vs 75 days traditional',
    positive: true,
    icon: Clock,
    color: 'violet',
  },
  {
    label: 'Compliance Score',
    value: '94%',
    change: '↑ 2% from last month',
    positive: true,
    icon: ShieldCheck,
    color: 'amber',
  },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
};

const statusColors: Record<string, string> = {
  'EU Approved': 'bg-emerald-100 text-emerald-700',
  Verified: 'bg-blue-100 text-blue-700',
  Submitted: 'bg-violet-100 text-violet-700',
  'Pending Verification': 'bg-amber-100 text-amber-700',
  Draft: 'bg-slate-100 text-slate-600',
};

const invoiceStatusColors: Record<string, string> = {
  Financed: 'bg-emerald-100 text-emerald-700',
  Approved: 'bg-blue-100 text-blue-700',
  'Awaiting Approval': 'bg-amber-100 text-amber-700',
  'Pending DPP': 'bg-slate-100 text-slate-600',
  Repaid: 'bg-teal-100 text-teal-700',
};

const formatCurrency = (v: number) =>
  v < 0 ? `-€${Math.abs(v).toLocaleString('en-US')}` : `€${v.toLocaleString('en-US')}`;

export default function Dashboard() {
  const recentDPPs = dppData.slice(0, 5);
  const recentInvoices = invoiceData.slice(0, 4);

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Welcome back, Anadolu Tekstil A.Ş."
      />
      <div className="p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5">
          {stats.map(({ label, value, change, positive, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
                  <Icon size={20} />
                </div>
                <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                  <TrendingUp size={12} />
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
              <p className="text-slate-500 text-sm mt-1">{label}</p>
              <p className={`text-xs mt-2 font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
                {change}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-5">
          {/* Cash Flow Line Chart */}
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-slate-900">Cash Flow Comparison</h2>
                <p className="text-slate-500 text-sm">FinLife vs Traditional factoring (EUR)</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block rounded" />FinLife</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-300 inline-block rounded" />Traditional</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={cashFlowChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="finlife" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="traditional" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#94a3b8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* DPP Status Donut */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-1">DPP Status</h2>
            <p className="text-slate-500 text-sm mb-4">142 total passports</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={dppStatusChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                  {dppStatusChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} DPPs`, '']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {dppStatusChartData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-slate-600">{name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-2 gap-5">
          {/* Recent DPPs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Recent DPPs</h2>
              <a href="/dpp" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="divide-y divide-slate-50">
              {recentDPPs.map(dpp => (
                <div key={dpp.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{dpp.productName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{dpp.id} · {dpp.buyer}</p>
                  </div>
                  <span className={`ml-3 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusColors[dpp.status]}`}>
                    {dpp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Financing */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Invoice Financing</h2>
              <a href="/financing" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="divide-y divide-slate-50">
              {recentInvoices.map(inv => (
                <div key={inv.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{inv.id}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{inv.buyer} · €{inv.amount.toLocaleString('en-US')}</p>
                  </div>
                  <div className="ml-3 text-right flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${invoiceStatusColors[inv.status]}`}>
                      {inv.status}
                    </span>
                    {inv.processingTime && (
                      <p className="text-xs text-slate-400 mt-1">{inv.processingTime}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
            <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">DPP Action Required</p>
              <p className="text-amber-700 text-sm mt-1">
                Batch <strong>BATCH-ATK-260421</strong> (Cotton Zip Hoodie) has a chemicals compliance issue.
                Review supplier data before submission.
              </p>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-800 text-sm">Financing Approved</p>
              <p className="text-emerald-700 text-sm mt-1">
                Invoice <strong>INV-2026-002</strong> (Zara · €189,500) has been approved by İş Faktoring.
                Advance of €155,390 will be deposited within 2 hours.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
