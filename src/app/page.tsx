'use client';
import Header from '@/components/Header';
import { dppData, invoiceData, dppStatusChartData } from '@/lib/mockData';
import {
  FileText, CreditCard, Clock, ShieldCheck, TrendingUp,
  ArrowUpRight, AlertCircle, CheckCircle2, Activity,
  Globe, Package, Zap,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, Legend,
} from 'recharts';

// ── Data ──────────────────────────────────────────────────────────────────────

const cashFlowData = [
  { month: 'Oct', traditional: -42000, finlife: 168000 },
  { month: 'Nov', traditional: 18000,  finlife: 195000 },
  { month: 'Dec', traditional: 55000,  finlife: 228000 },
  { month: 'Jan', traditional: -28000, finlife: 241000 },
  { month: 'Feb', traditional: 34000,  finlife: 268000 },
  { month: 'Mar', traditional: 72000,  finlife: 305000 },
  { month: 'Apr', traditional: 88000,  finlife: 342000 },
];

const monthlyVolume = [
  { month: 'Nov', batches: 18, value: 3.2 },
  { month: 'Dec', batches: 22, value: 4.1 },
  { month: 'Jan', batches: 15, value: 2.8 },
  { month: 'Feb', batches: 26, value: 5.4 },
  { month: 'Mar', batches: 31, value: 6.9 },
  { month: 'Apr', batches: 38, value: 8.1 },
];

const buyerRevenue = [
  { name: 'H&M',      value: 2.34, fill: '#3b82f6' },
  { name: 'Zara',     value: 1.89, fill: '#8b5cf6' },
  { name: 'C&A',      value: 1.12, fill: '#10b981' },
  { name: 'Mango',    value: 0.98, fill: '#f59e0b' },
  { name: 'Next Plc', value: 0.65, fill: '#ec4899' },
  { name: 'Reserved', value: 0.42, fill: '#14b8a6' },
];

const complianceRadial = [
  { name: 'ESPR Readiness', value: 60,  fill: '#3b82f6' },
  { name: 'KYC / BDDK',     value: 86,  fill: '#10b981' },
  { name: 'Supplier Score', value: 83,  fill: '#f59e0b' },
  { name: 'Overall',        value: 94,  fill: '#8b5cf6' },
];

const activity = [
  { id: 1, type: 'financed',  text: 'INV-2026-005 financed by İş Faktoring',         time: '2 min ago',  color: 'bg-emerald-500' },
  { id: 2, type: 'dpp',       text: 'DPP-2026-007 created — Sports T-Shirt batch',   time: '18 min ago', color: 'bg-blue-500'    },
  { id: 3, type: 'approved',  text: 'INV-2026-002 approved — €189,500 advance ready', time: '1 hr ago',   color: 'bg-violet-500'  },
  { id: 4, type: 'alert',     text: 'Chemicals flag on BATCH-ATK-260421 — review',   time: '3 hr ago',   color: 'bg-amber-500'   },
  { id: 5, type: 'dpp',       text: 'DPP-2026-006 verified — Merino Wool Sweater',   time: '5 hr ago',   color: 'bg-blue-500'    },
  { id: 6, type: 'buyer',     text: 'H&M confirmed order ORD-2026-018 on-chain',     time: '8 hr ago',   color: 'bg-pink-500'    },
];

const statusColors: Record<string, string> = {
  'EU Approved':        'bg-emerald-100 text-emerald-700',
  Verified:             'bg-blue-100 text-blue-700',
  Submitted:            'bg-violet-100 text-violet-700',
  'Pending Verification':'bg-amber-100 text-amber-700',
  Draft:                'bg-slate-100 text-slate-600',
};

const invoiceStatusColors: Record<string, string> = {
  Financed:           'bg-emerald-100 text-emerald-700',
  Approved:           'bg-blue-100 text-blue-700',
  'Awaiting Approval':'bg-amber-100 text-amber-700',
  'Pending DPP':      'bg-slate-100 text-slate-600',
  Repaid:             'bg-teal-100 text-teal-700',
};

const fmt = (v: number) =>
  v < 0 ? `-€${Math.abs(v).toLocaleString('en-US')}` : `€${v.toLocaleString('en-US')}`;

// ── Custom tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const recentDPPs    = dppData.slice(0, 5);
  const recentInvoices = invoiceData.slice(0, 4);

  return (
    <div>
      <Header title="Dashboard" subtitle="Welcome back, Anadolu Tekstil A.Ş. — April 27, 2026" />

      <div className="p-8 space-y-6">

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-4 gap-5">
          {[
            {
              label: 'Active DPPs', value: '142', sub: '+18 this month',
              icon: FileText, from: 'from-blue-500', to: 'to-blue-700', light: 'bg-blue-50 text-blue-600',
            },
            {
              label: 'Total Financed', value: '€2.4M', sub: '+€340k this month',
              icon: CreditCard, from: 'from-emerald-500', to: 'to-emerald-700', light: 'bg-emerald-50 text-emerald-600',
            },
            {
              label: 'Avg. Processing', value: '3.2 hrs', sub: 'vs 75 days traditional',
              icon: Zap, from: 'from-violet-500', to: 'to-violet-700', light: 'bg-violet-50 text-violet-600',
            },
            {
              label: 'Compliance Score', value: '94%', sub: '↑ 2% from last month',
              icon: ShieldCheck, from: 'from-amber-500', to: 'to-amber-600', light: 'bg-amber-50 text-amber-600',
            },
          ].map(({ label, value, sub, icon: Icon, from, to, light }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${from} ${to} opacity-5 -mr-8 -mt-8`} />
              <div className={`inline-flex p-2.5 rounded-xl ${light} mb-4`}>
                <Icon size={20} />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
              <p className="text-slate-500 text-sm mt-1 font-medium">{label}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={12} className="text-emerald-500" />
                <p className="text-xs font-semibold text-emerald-600">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Row 2: Area Chart + Donut ── */}
        <div className="grid grid-cols-3 gap-5">

          {/* Cash Flow Area Chart */}
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Cash Flow Comparison</h2>
                <p className="text-slate-400 text-sm">FinLife advance vs traditional 60–90d wait (EUR)</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-3 h-1 bg-blue-500 rounded-full inline-block" />FinLife
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-3 h-1 bg-slate-300 rounded-full inline-block" />Traditional
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="gFinlife" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gTrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="finlife" name="FinLife" stroke="#3b82f6" strokeWidth={2.5}
                  fill="url(#gFinlife)" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} />
                <Area type="monotone" dataKey="traditional" name="Traditional" stroke="#cbd5e1" strokeWidth={2}
                  strokeDasharray="5 4" fill="url(#gTrad)" dot={{ r: 3, fill: '#94a3b8', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* DPP Status Donut */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <h2 className="font-bold text-slate-900 text-base">DPP Status</h2>
            <p className="text-slate-400 text-sm mb-2">142 total passports</p>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={dppStatusChartData} cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                    paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                    {dppStatusChartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} DPPs`, '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {dppStatusChartData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-slate-500">{name}</span>
                  </div>
                  <span className="font-bold text-slate-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 3: Monthly Volume + Buyer Revenue ── */}
        <div className="grid grid-cols-2 gap-5">

          {/* Monthly Batch Volume Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Monthly Export Volume</h2>
                <p className="text-slate-400 text-sm">Batches shipped & value (€M)</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyVolume} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="batches" name="Batches" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="value" name="Value (€M)" fill="#bfdbfe" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Buyers Horizontal Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Top EU Buyers</h2>
                <p className="text-slate-400 text-sm">Revenue by buyer (€M)</p>
              </div>
              <Globe size={16} className="text-slate-400" />
            </div>
            <div className="space-y-3.5">
              {buyerRevenue.map(({ name, value, fill }) => (
                <div key={name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{name}</span>
                    <span className="font-bold text-slate-900">€{value}M</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(value / 2.34) * 100}%`, backgroundColor: fill }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 4: Compliance Radial + Activity + Recent Tables ── */}
        <div className="grid grid-cols-3 gap-5">

          {/* Compliance Radial */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 text-base mb-1">Compliance Health</h2>
            <p className="text-slate-400 text-sm mb-3">Live compliance indicators</p>
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={80}
                data={complianceRadial} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={6} />
                <Tooltip formatter={(v) => [`${v}%`, '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {complianceRadial.map(({ name, value, fill }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fill }} />
                    <span className="text-slate-500">{name}</span>
                  </div>
                  <span className="font-bold text-slate-700">{value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-slate-500" />
              <h2 className="font-bold text-slate-900 text-base">Live Activity</h2>
            </div>
            <div className="space-y-4">
              {activity.map(({ id, text, time, color }) => (
                <div key={id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base">Recent Invoices</h2>
              <a href="/financing" className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
                All <ArrowUpRight size={12} />
              </a>
            </div>
            <div className="divide-y divide-slate-50">
              {recentInvoices.map(inv => (
                <div key={inv.id} className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">{inv.buyer}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${invoiceStatusColors[inv.status]}`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-400">{inv.id}</p>
                    <p className="text-sm font-bold text-slate-700">€{inv.amount.toLocaleString('en-US')}</p>
                  </div>
                  {inv.processingTime && (
                    <div className="flex items-center gap-1 mt-1">
                      <Zap size={10} className="text-emerald-500" />
                      <p className="text-xs text-emerald-600 font-medium">{inv.processingTime}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 5: Recent DPPs + Alerts ── */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base">Recent DPPs</h2>
              <a href="/dpp" className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
                View all <ArrowUpRight size={12} />
              </a>
            </div>
            <div className="divide-y divide-slate-50">
              {recentDPPs.map(dpp => (
                <div key={dpp.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{dpp.productName}</p>
                      <p className="text-xs text-slate-400">{dpp.id} · {dpp.buyer} · {dpp.quantity.toLocaleString('en-US')} pcs</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[dpp.status]}`}>
                    {dpp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-800 text-sm">Action Required</p>
                  <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                    Batch <strong>ATK-260421</strong> (Cotton Hoodie) has a chemicals compliance issue. Review before DPP submission.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-800 text-sm">Financing Approved</p>
                  <p className="text-emerald-700 text-xs mt-1 leading-relaxed">
                    <strong>INV-2026-002</strong> (Zara · €189,500) approved. Advance of <strong>€155,390</strong> deposits within 2 hrs.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-800 text-sm">ESPR Deadline Tracker</p>
                  <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                    EU delegated act expected <strong>Q2 2026</strong>. 4 checklist items still pending — visit Compliance tab.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
