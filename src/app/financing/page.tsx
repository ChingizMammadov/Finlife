'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { invoiceData, Invoice } from '@/lib/mockData';
import { Plus, X, ChevronDown, CreditCard, Clock, CheckCircle2, AlertCircle, TrendingUp, Calculator } from 'lucide-react';

const statusColors: Record<string, string> = {
  Financed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Approved: 'bg-blue-100 text-blue-700 border-blue-200',
  'Awaiting Approval': 'bg-amber-100 text-amber-700 border-amber-200',
  'Pending DPP': 'bg-slate-100 text-slate-600 border-slate-200',
  Repaid: 'bg-teal-100 text-teal-700 border-teal-200',
};

const pipeline = [
  { key: 'Pending DPP', label: 'DPP Required', icon: AlertCircle, color: 'text-slate-500 bg-slate-50 border-slate-200' },
  { key: 'Awaiting Approval', label: 'Awaiting Approval', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { key: 'Approved', label: 'Approved', icon: CheckCircle2, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { key: 'Financed', label: 'Financed', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { key: 'Repaid', label: 'Repaid', icon: TrendingUp, color: 'text-teal-600 bg-teal-50 border-teal-200' },
];

const emptyForm = {
  buyer: '',
  dppId: '',
  amount: '',
  factoringCompany: 'Garanti Faktoring',
  invoiceDate: '',
  dueDate: '',
};

export default function FinancingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(invoiceData);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [calcAmount, setCalcAmount] = useState('');

  const advanceRate = 0.82;
  const calcAdvance = calcAmount ? (parseFloat(calcAmount) * advanceRate).toFixed(0) : null;
  const calcFee = calcAmount ? (parseFloat(calcAmount) * 0.004).toFixed(0) : null;

  const totalFinanced = invoices.filter(i => i.status === 'Financed').reduce((s, i) => s + i.amount * i.advanceRate, 0);
  const totalPending = invoices.filter(i => ['Awaiting Approval', 'Approved'].includes(i.status)).reduce((s, i) => s + i.amount, 0);
  const avgTime = '3.2 hrs';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newInv: Invoice = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      dppId: form.dppId || 'DPP-2026-001',
      productName: 'New Invoice',
      buyer: form.buyer,
      buyerCountry: 'EU',
      amount: parseFloat(form.amount) || 0,
      advanceRate,
      issueDate: form.invoiceDate,
      dueDate: form.dueDate,
      factoringCompany: form.factoringCompany,
      status: 'Awaiting Approval',
    };
    setInvoices(prev => [newInv, ...prev]);
    setShowCreate(false);
    setForm(emptyForm);
  }

  return (
    <div>
      <Header title="Invoice Financing" subtitle="Submit verified invoices for instant advance payment up to 82%" />
      <div className="p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Financed</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">€{(totalFinanced / 1000).toFixed(0)}k</p>
            <p className="text-xs text-slate-400 mt-1">All-time advance disbursed</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Pending Pipeline</p>
            <p className="text-3xl font-bold text-amber-600 mt-2">€{(totalPending / 1000).toFixed(0)}k</p>
            <p className="text-xs text-slate-400 mt-1">Awaiting approval or disbursement</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Avg. Processing</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{avgTime}</p>
            <p className="text-xs text-slate-400 mt-1">vs 60–90 days traditional</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Advance Rate</p>
            <p className="text-3xl font-bold text-violet-600 mt-2">82%</p>
            <p className="text-xs text-slate-400 mt-1">Of verified invoice value</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Pipeline */}
          <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-5">Financing Pipeline</h2>
            <div className="flex items-stretch gap-2">
              {pipeline.map(({ key, label, icon: Icon, color }, i) => {
                const count = invoices.filter(inv => inv.status === key).length;
                const value = invoices.filter(inv => inv.status === key).reduce((s, inv) => s + inv.amount, 0);
                return (
                  <div key={key} className="flex-1 relative">
                    <div className={`rounded-xl p-4 border ${color} h-full`}>
                      <Icon size={18} className="mb-2" />
                      <p className="text-xs font-semibold leading-tight">{label}</p>
                      <p className="text-2xl font-bold mt-3">{count}</p>
                      {value > 0 && <p className="text-xs opacity-70 mt-0.5">€{(value / 1000).toFixed(0)}k</p>}
                    </div>
                    {i < pipeline.length - 1 && (
                      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-t border-r border-slate-200 bg-white z-10" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calculator */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={16} className="text-blue-600" />
              <h2 className="font-bold text-slate-900">Advance Calculator</h2>
            </div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Invoice Amount (€)</label>
            <input
              type="number"
              value={calcAmount}
              onChange={e => setCalcAmount(e.target.value)}
              placeholder="Enter invoice value..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            {calcAdvance ? (
              <div className="space-y-3">
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium">Advance Payment (82%)</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">€{parseInt(calcAdvance).toLocaleString('en-US')}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Deposited within hours</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">Platform Fee (~0.4%)</p>
                  <p className="text-lg font-bold text-slate-700 mt-0.5">€{parseInt(calcFee!).toLocaleString('en-US')}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium">Remaining at maturity</p>
                  <p className="text-lg font-bold text-blue-700 mt-0.5">
                    €{(parseInt(calcAmount) - parseInt(calcAdvance) - parseInt(calcFee!)).toLocaleString('en-US')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-slate-400 text-sm">Enter an invoice amount above</div>
            )}
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">All Invoices</h2>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus size={15} />
              Submit Invoice
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {['Invoice ID', 'DPP', 'Buyer', 'Invoice Amt', 'Advance (82%)', 'Due Date', 'Factoring Co.', 'Status', 'Time'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-mono font-semibold text-slate-700">{inv.id}</td>
                  <td className="px-5 py-4 text-sm text-blue-600 font-medium">{inv.dppId}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-800">{inv.buyer}</p>
                    <p className="text-xs text-slate-400">{inv.buyerCountry}</p>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-800">€{inv.amount.toLocaleString('en-US')}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-emerald-600">
                    €{(inv.amount * inv.advanceRate).toLocaleString('en-US')}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{inv.dueDate}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{inv.factoringCompany}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{inv.processingTime ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Invoice Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Submit Invoice for Financing</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Linked DPP ID *</label>
                <input required value={form.dppId} onChange={e => setForm(f => ({ ...f, dppId: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. DPP-2026-003" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">EU Buyer *</label>
                  <input required value={form.buyer} onChange={e => setForm(f => ({ ...f, buyer: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. H&M" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Invoice Amount (€) *</label>
                  <input required type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 150000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Invoice Date *</label>
                  <input required type="date" value={form.invoiceDate} onChange={e => setForm(f => ({ ...f, invoiceDate: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Due Date *</label>
                  <input required type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Factoring Company *</label>
                <select value={form.factoringCompany} onChange={e => setForm(f => ({ ...f, factoringCompany: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {['Garanti Faktoring', 'İş Faktoring', 'YKB Faktoring'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {form.amount && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-800 font-semibold">Estimated Advance: <span className="text-emerald-700">€{(parseFloat(form.amount) * 0.82).toLocaleString('en-US')}</span></p>
                  <p className="text-xs text-blue-600 mt-0.5">82% of €{parseFloat(form.amount).toLocaleString('en-US')} · Fee ≈ €{(parseFloat(form.amount) * 0.004).toFixed(0)}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                  Submit for Financing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
