'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { dppData, DPP } from '@/lib/mockData';
import {
  Plus, Search, Filter, X, QrCode, Download,
  CheckCircle2, Clock, FileText, Leaf, Droplets, Zap,
  ChevronDown,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const statusColors: Record<string, string> = {
  'EU Approved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Verified: 'bg-blue-100 text-blue-700 border-blue-200',
  Submitted: 'bg-violet-100 text-violet-700 border-violet-200',
  'Pending Verification': 'bg-amber-100 text-amber-700 border-amber-200',
  Draft: 'bg-slate-100 text-slate-600 border-slate-200',
};

const statusIcons: Record<string, React.ReactNode> = {
  'EU Approved': <CheckCircle2 size={12} />,
  Verified: <CheckCircle2 size={12} />,
  Submitted: <Clock size={12} />,
  'Pending Verification': <Clock size={12} />,
  Draft: <FileText size={12} />,
};

const categories = ['All', 'T-Shirt', 'Dress', 'Jeans', 'Hoodie', 'Blouse', 'Sweater', 'Sportswear'];
const statuses = ['All', 'EU Approved', 'Verified', 'Submitted', 'Pending Verification', 'Draft'];

const emptyForm = {
  productName: '',
  category: 'T-Shirt',
  buyer: '',
  quantity: '',
  material1Name: 'Organic Cotton',
  material1Pct: '100',
  material1Origin: 'Turkey',
  material1Supplier: '',
  waterUsage: '',
  carbonFootprint: '',
  energyUsage: '',
};

export default function DPPPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selected, setSelected] = useState<DPP | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [localDPPs, setLocalDPPs] = useState<DPP[]>(dppData);

  const filtered = localDPPs.filter(d => {
    const matchSearch = d.productName.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.buyer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || d.status === filterStatus;
    const matchCat = filterCategory === 'All' || d.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newDPP: DPP = {
      id: `DPP-2026-${String(localDPPs.length + 1).padStart(3, '0')}`,
      batchId: `BATCH-ATK-${Date.now()}`,
      productName: form.productName,
      category: form.category,
      factory: 'Anadolu Tekstil A.Ş.',
      buyer: form.buyer,
      buyerCountry: 'EU',
      quantity: parseInt(form.quantity) || 0,
      materials: [{
        name: form.material1Name,
        percentage: parseInt(form.material1Pct) || 100,
        origin: form.material1Origin,
        supplier: form.material1Supplier,
      }],
      productionDate: new Date().toISOString().split('T')[0],
      waterUsage: parseFloat(form.waterUsage) || 0,
      carbonFootprint: parseFloat(form.carbonFootprint) || 0,
      energyUsage: parseFloat(form.energyUsage) || 0,
      chemicalsCompliant: true,
      status: 'Draft',
      qrData: `https://finlife.io/dpp/DPP-2026-${String(localDPPs.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    setLocalDPPs(prev => [newDPP, ...prev]);
    setShowCreate(false);
    setForm(emptyForm);
  }

  return (
    <div>
      <Header title="Digital Product Passports" subtitle="Create and manage EU-compliant DPPs for every textile batch" />
      <div className="p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Total DPPs', value: localDPPs.length, color: 'text-slate-900' },
            { label: 'EU Approved', value: localDPPs.filter(d => d.status === 'EU Approved').length, color: 'text-emerald-600' },
            { label: 'Verified', value: localDPPs.filter(d => d.status === 'Verified').length, color: 'text-blue-600' },
            { label: 'Submitted', value: localDPPs.filter(d => d.status === 'Submitted').length, color: 'text-violet-600' },
            { label: 'Pending / Draft', value: localDPPs.filter(d => ['Pending Verification', 'Draft'].includes(d.status)).length, color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID or buyer..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Plus size={16} />
            Create DPP
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {['DPP ID', 'Product', 'Category', 'Buyer', 'Qty', 'CO₂/item', 'Water/item', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-slate-400">No DPPs found</td></tr>
              ) : filtered.map(dpp => (
                <tr key={dpp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-mono font-semibold text-slate-700">{dpp.id}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{dpp.productionDate}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-800">{dpp.productName}</p>
                    <p className="text-xs text-slate-400">{dpp.factory}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{dpp.category}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-700">{dpp.buyer}</p>
                    <p className="text-xs text-slate-400">{dpp.buyerCountry}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{dpp.quantity.toLocaleString('en-US')}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Leaf size={12} className="text-emerald-500" />
                      <span className="text-sm text-slate-600">{dpp.carbonFootprint} kg</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Droplets size={12} className="text-blue-500" />
                      <span className="text-sm text-slate-600">{dpp.waterUsage} L</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[dpp.status]}`}>
                      {statusIcons[dpp.status]}
                      {dpp.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelected(dpp)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <QrCode size={12} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* DPP Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900">{selected.id}</h2>
                <p className="text-slate-500 text-sm">{selected.productName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusColors[selected.status]}`}>
                  {selected.status}
                </span>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X size={18} className="text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              {/* QR Code */}
              <div className="col-span-2 flex justify-center">
                <div className="bg-slate-50 rounded-2xl p-6 inline-flex flex-col items-center gap-3 border border-slate-200">
                  <QRCodeSVG value={selected.qrData} size={160} level="H" includeMargin />
                  <p className="text-xs text-slate-500 font-mono">{selected.qrData}</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    <Download size={13} />
                    Download QR
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 text-sm">Product Details</h3>
                {[
                  ['Batch ID', selected.batchId],
                  ['Category', selected.category],
                  ['Factory', selected.factory],
                  ['Production Date', selected.productionDate],
                  ['Quantity', `${selected.quantity.toLocaleString('en-US')} pcs`],
                  ['Buyer', `${selected.buyer} (${selected.buyerCountry})`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-medium text-slate-800">{v}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 text-sm">Sustainability Metrics</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                    <Leaf size={16} className="text-emerald-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-emerald-800">{selected.carbonFootprint}</p>
                    <p className="text-xs text-emerald-600">kg CO₂/item</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                    <Droplets size={16} className="text-blue-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-blue-800">{selected.waterUsage}</p>
                    <p className="text-xs text-blue-600">L/item</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                    <Zap size={16} className="text-amber-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-amber-800">{selected.energyUsage}</p>
                    <p className="text-xs text-amber-600">kWh/item</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-slate-500 text-sm">Chemicals compliant:</span>
                  <span className={`text-sm font-semibold ${selected.chemicalsCompliant ? 'text-emerald-600' : 'text-red-500'}`}>
                    {selected.chemicalsCompliant ? 'Yes ✓' : 'No ✗'}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-700 text-sm pt-2">Material Composition</h3>
                {selected.materials.map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${m.percentage}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 w-10 text-right">{m.percentage}%</span>
                    <span className="text-sm text-slate-600">{m.name}</span>
                  </div>
                ))}
                {selected.materials.map((m, i) => (
                  <div key={i} className="text-xs text-slate-500">
                    {m.name}: {m.supplier} ({m.origin})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create DPP Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Create New DPP</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Product Name *</label>
                  <input required value={form.productName} onChange={e => setForm(f => ({ ...f, productName: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Men's Cotton T-Shirt" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['T-Shirt', 'Dress', 'Jeans', 'Jacket', 'Hoodie', 'Blouse', 'Sweater', 'Sportswear'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">EU Buyer *</label>
                  <input required value={form.buyer} onChange={e => setForm(f => ({ ...f, buyer: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. H&M" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Quantity (pcs) *</label>
                  <input required type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 5000" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-600 mb-3">Material Composition</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Material Name</label>
                    <input value={form.material1Name} onChange={e => setForm(f => ({ ...f, material1Name: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Percentage %</label>
                    <input type="number" min="1" max="100" value={form.material1Pct} onChange={e => setForm(f => ({ ...f, material1Pct: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Country of Origin</label>
                    <input value={form.material1Origin} onChange={e => setForm(f => ({ ...f, material1Origin: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Supplier</label>
                    <input value={form.material1Supplier} onChange={e => setForm(f => ({ ...f, material1Supplier: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-600 mb-3">IoT / Sustainability Data</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Water (L/item)</label>
                    <input type="number" step="0.1" value={form.waterUsage} onChange={e => setForm(f => ({ ...f, waterUsage: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 45.2" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">CO₂ (kg/item)</label>
                    <input type="number" step="0.1" value={form.carbonFootprint} onChange={e => setForm(f => ({ ...f, carbonFootprint: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 2.8" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Energy (kWh/item)</label>
                    <input type="number" step="0.1" value={form.energyUsage} onChange={e => setForm(f => ({ ...f, energyUsage: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 3.1" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                  Create Draft DPP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
