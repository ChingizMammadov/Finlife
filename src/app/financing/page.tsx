'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { invoiceData, Invoice } from '@/lib/mockData';
import { Plus, X, CreditCard, Clock, CheckCircle2, AlertCircle, TrendingUp, Calculator, Zap, DollarSign } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

// ── Static chart data ────────────────────────────────────────────────────────
const monthlyFinancing = [
  { month: 'Nov', financed: 380, traditional: 0 },
  { month: 'Dec', financed: 510, traditional: 0 },
  { month: 'Jan', financed: 290, traditional: 0 },
  { month: 'Feb', financed: 640, traditional: 120 },
  { month: 'Mar', financed: 820, traditional: 200 },
  { month: 'Apr', financed: 1040, traditional: 320 },
];

const factoringShare = [
  { name: 'Garanti Faktoring', value: 48, fill: '#3b82f6' },
  { name: 'İş Faktoring',      value: 31, fill: '#10b981' },
  { name: 'YKB Faktoring',     value: 21, fill: '#8b5cf6' },
];

const processingTime = [
  { month: 'Nov', hrs: 5.8 },
  { month: 'Dec', hrs: 4.9 },
  { month: 'Jan', hrs: 4.2 },
  { month: 'Feb', hrs: 3.8 },
  { month: 'Mar', hrs: 3.4 },
  { month: 'Apr', hrs: 3.2 },
];

const statusColors: Record<string,string> = {
  Financed:            'bg-emerald-100 text-emerald-700 border-emerald-200',
  Approved:            'bg-blue-100 text-blue-700 border-blue-200',
  'Awaiting Approval': 'bg-amber-100 text-amber-700 border-amber-200',
  'Pending DPP':       'bg-slate-100 text-slate-600 border-slate-200',
  Repaid:              'bg-teal-100 text-teal-700 border-teal-200',
};

const pipeline = [
  { key:'Pending DPP',       label:'DPP Required',      icon:AlertCircle,   color:'text-slate-500  bg-slate-50  border-slate-200'  },
  { key:'Awaiting Approval', label:'Awaiting Approval', icon:Clock,         color:'text-amber-600  bg-amber-50  border-amber-200'  },
  { key:'Approved',          label:'Approved',           icon:CheckCircle2,  color:'text-blue-600   bg-blue-50   border-blue-200'   },
  { key:'Financed',          label:'Financed',           icon:CreditCard,    color:'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { key:'Repaid',            label:'Repaid',             icon:TrendingUp,    color:'text-teal-600   bg-teal-50   border-teal-200'   },
];

const emptyForm = { buyer:'', dppId:'', amount:'', factoringCompany:'Garanti Faktoring', invoiceDate:'', dueDate:'' };

export default function FinancingPage() {
  const [invoices,   setInvoices]   = useState<Invoice[]>(invoiceData);
  const [showCreate, setShowCreate] = useState(false);
  const [form,       setForm]       = useState(emptyForm);
  const [calcAmount, setCalcAmount] = useState('');

  const advanceRate  = 0.82;
  const calcAdvance  = calcAmount ? (parseFloat(calcAmount) * advanceRate).toFixed(0)  : null;
  const calcFee      = calcAmount ? (parseFloat(calcAmount) * 0.004).toFixed(0)         : null;
  const totalFinanced = invoices.filter(i => i.status === 'Financed').reduce((s,i) => s + i.amount * i.advanceRate, 0);
  const totalPending  = invoices.filter(i => ['Awaiting Approval','Approved'].includes(i.status)).reduce((s,i) => s + i.amount, 0);
  const totalSaved    = invoices.filter(i => i.status === 'Financed').length * 72 * 24; // avg days saved in hours

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newInv: Invoice = {
      id: `INV-2026-${String(invoices.length+1).padStart(3,'0')}`,
      dppId: form.dppId || 'DPP-2026-001', productName:'New Invoice',
      buyer: form.buyer, buyerCountry:'EU', amount: parseFloat(form.amount)||0,
      advanceRate, issueDate:form.invoiceDate, dueDate:form.dueDate,
      factoringCompany:form.factoringCompany, status:'Awaiting Approval',
    };
    setInvoices(p => [newInv,...p]);
    setShowCreate(false); setForm(emptyForm);
  }

  return (
    <div>
      <Header title="Invoice Financing" subtitle="Submit verified invoices and receive up to 82% advance within hours, not months" />
      <div className="p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5">
          {[
            { label:'Total Financed', value:`€${(totalFinanced/1000).toFixed(0)}k`, sub:'All-time advance', icon:CreditCard, color:'text-emerald-600', bg:'bg-emerald-50' },
            { label:'Pending Pipeline', value:`€${(totalPending/1000).toFixed(0)}k`, sub:'Awaiting disbursement', icon:Clock, color:'text-amber-600', bg:'bg-amber-50' },
            { label:'Avg. Processing', value:'3.2 hrs', sub:'↓ from 5.8 hrs in Nov', icon:Zap, color:'text-blue-600', bg:'bg-blue-50' },
            { label:'Days Saved', value:`${totalSaved.toLocaleString('en-US')} hrs`, sub:'vs 60–90 day wait', icon:TrendingUp, color:'text-violet-600', bg:'bg-violet-50' },
          ].map(({ label,value,sub,icon:Icon,color,bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className={`inline-flex p-2.5 rounded-xl ${bg} ${color} mb-3`}><Icon size={18} /></div>
              <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
              <p className="text-slate-500 text-sm mt-0.5">{label}</p>
              <p className="text-xs text-slate-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-5">

          {/* Monthly volume bar */}
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-slate-900">Monthly Financing Volume</h2>
                <p className="text-slate-400 text-sm">Financed vs traditional repayments received (€k)</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">+173% vs Nov</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyFinancing} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v=>`€${v}k`} />
                <Tooltip formatter={(v:any) => [`€${v}k`,'']} contentStyle={{ borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:11 }} />
                <Bar dataKey="financed"    name="FinLife Advance" fill="#10b981" radius={[5,5,0,0]} />
                <Bar dataKey="traditional" name="Traditional Recv." fill="#e2e8f0" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Factoring company donut */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-1">Factoring Partners</h2>
            <p className="text-slate-400 text-xs mb-3">Volume share by company</p>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={factoringShare} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="value">
                  {factoringShare.map((e,i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip formatter={v=>[`${v}%`,'']} contentStyle={{ borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {factoringShare.map(({ name,value,fill }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor:fill }} /><span className="text-slate-500">{name}</span></div>
                  <span className="font-bold text-slate-700">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Processing time trend + Calculator + Pipeline */}
        <div className="grid grid-cols-3 gap-5">

          {/* Processing Time trend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 text-sm mb-1">Processing Time</h2>
            <p className="text-slate-400 text-xs mb-3">Avg hours to disburse (improving)</p>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={processingTime}>
                <defs>
                  <linearGradient id="gTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v:any)=>[`${v} hrs`,'']} contentStyle={{ borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:11 }} />
                <Area type="monotone" dataKey="hrs" stroke="#3b82f6" strokeWidth={2} fill="url(#gTime)" dot={{ r:3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Calculator */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4"><Calculator size={16} className="text-blue-600" /><h2 className="font-bold text-slate-900">Advance Calculator</h2></div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Invoice Amount (€)</label>
            <input type="number" value={calcAmount} onChange={e => setCalcAmount(e.target.value)} placeholder="e.g. 200000"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />
            {calcAdvance ? (
              <div className="space-y-2">
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex justify-between items-center">
                  <div><p className="text-xs text-emerald-600 font-medium">Advance (82%)</p><p className="text-lg font-extrabold text-emerald-700">€{parseInt(calcAdvance).toLocaleString('en-US')}</p></div>
                  <Zap size={20} className="text-emerald-400" />
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex justify-between items-center">
                  <div><p className="text-xs text-slate-500">Fee (~0.4%)</p><p className="text-base font-bold text-slate-700">€{parseInt(calcFee!).toLocaleString('en-US')}</p></div>
                  <DollarSign size={16} className="text-slate-300" />
                </div>
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <p className="text-xs text-blue-600">Remaining at maturity</p>
                  <p className="text-base font-bold text-blue-700">€{(parseInt(calcAmount)-parseInt(calcAdvance)-parseInt(calcFee!)).toLocaleString('en-US')}</p>
                </div>
              </div>
            ) : <p className="text-center text-slate-300 text-sm py-4">Enter invoice amount above</p>}
          </div>

          {/* Pipeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 text-sm mb-4">Financing Pipeline</h2>
            <div className="space-y-2">
              {pipeline.map(({ key,label,icon:Icon,color }) => {
                const count = invoices.filter(i => i.status === key).length;
                const val   = invoices.filter(i => i.status === key).reduce((s,i) => s+i.amount,0);
                return (
                  <div key={key} className={`flex items-center gap-3 p-3 rounded-xl border ${color}`}>
                    <Icon size={16} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold">{label}</p>
                      {val>0 && <p className="text-xs opacity-60">€{(val/1000).toFixed(0)}k</p>}
                    </div>
                    <span className="text-xl font-extrabold">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">All Invoices</h2>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">
              <Plus size={14} /> Submit Invoice
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  {['Invoice ID','Buyer','Amount','Advance (82%)','Due Date','Factoring Co.','Status','Time'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">{inv.id}</td>
                    <td className="px-5 py-3.5"><p className="font-medium text-slate-800">{inv.buyer}</p><p className="text-xs text-slate-400">{inv.buyerCountry}</p></td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">€{inv.amount.toLocaleString('en-US')}</td>
                    <td className="px-5 py-3.5 font-semibold text-emerald-600">€{(inv.amount*inv.advanceRate).toLocaleString('en-US')}</td>
                    <td className="px-5 py-3.5 text-slate-500">{inv.dueDate}</td>
                    <td className="px-5 py-3.5 text-slate-500">{inv.factoringCompany}</td>
                    <td className="px-5 py-3.5"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[inv.status]}`}>{inv.status}</span></td>
                    <td className="px-5 py-3.5">
                      {inv.processingTime
                        ? <div className="flex items-center gap-1"><Zap size={11} className="text-emerald-500" /><span className="text-xs text-emerald-600 font-medium">{inv.processingTime}</span></div>
                        : <span className="text-slate-300 text-xs">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Submit Invoice Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Submit Invoice for Financing</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Linked DPP ID *</label>
                <input required value={form.dppId} onChange={e => setForm(f=>({...f,dppId:e.target.value}))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. DPP-2026-003" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">EU Buyer *</label>
                  <input required value={form.buyer} onChange={e => setForm(f=>({...f,buyer:e.target.value}))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. H&M" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Amount (€) *</label>
                  <input required type="number" value={form.amount} onChange={e => setForm(f=>({...f,amount:e.target.value}))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 150000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Invoice Date *</label>
                  <input required type="date" value={form.invoiceDate} onChange={e => setForm(f=>({...f,invoiceDate:e.target.value}))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Due Date *</label>
                  <input required type="date" value={form.dueDate} onChange={e => setForm(f=>({...f,dueDate:e.target.value}))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Factoring Company</label>
                <select value={form.factoringCompany} onChange={e => setForm(f=>({...f,factoringCompany:e.target.value}))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {['Garanti Faktoring','İş Faktoring','YKB Faktoring'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              {form.amount && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <p className="text-sm font-semibold text-emerald-800">Advance: <span className="text-emerald-700 font-extrabold">€{(parseFloat(form.amount)*0.82).toLocaleString('en-US')}</span></p>
                  <p className="text-xs text-emerald-600 mt-0.5">82% of €{parseFloat(form.amount).toLocaleString('en-US')} · Fee ≈ €{(parseFloat(form.amount)*0.004).toFixed(0)} · Disbursed within hours</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">Submit for Financing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
