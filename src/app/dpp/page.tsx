'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { dppData, DPP } from '@/lib/mockData';
import {
  Plus, Search, X, QrCode, Download, CheckCircle2,
  Clock, FileText, Leaf, Droplets, Zap, ChevronDown, TrendingDown,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar,
} from 'recharts';

// ── Static chart data ────────────────────────────────────────────────────────
const categoryData = [
  { name: 'T-Shirt',    value: 42, fill: '#3b82f6' },
  { name: 'Jeans',      value: 28, fill: '#8b5cf6' },
  { name: 'Dress',      value: 24, fill: '#10b981' },
  { name: 'Hoodie',     value: 18, fill: '#f59e0b' },
  { name: 'Sportswear', value: 16, fill: '#ec4899' },
  { name: 'Other',      value: 14, fill: '#94a3b8' },
];

const sustainabilityTrend = [
  { month: 'Nov', co2: 4.8, water: 68, energy: 5.9 },
  { month: 'Dec', co2: 4.2, water: 61, energy: 5.2 },
  { month: 'Jan', co2: 3.9, water: 55, energy: 4.8 },
  { month: 'Feb', co2: 3.4, water: 50, energy: 4.1 },
  { month: 'Mar', co2: 2.9, water: 44, energy: 3.6 },
  { month: 'Apr', co2: 2.6, water: 39, energy: 3.1 },
];

const batchVolume = [
  { month: 'Nov', batches: 14 },
  { month: 'Dec', batches: 19 },
  { month: 'Jan', batches: 11 },
  { month: 'Feb', batches: 24 },
  { month: 'Mar', batches: 29 },
  { month: 'Apr', batches: 38 },
];

// ── Config ───────────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  'EU Approved':         'bg-emerald-100 text-emerald-700 border-emerald-200',
  Verified:              'bg-blue-100 text-blue-700 border-blue-200',
  Submitted:             'bg-violet-100 text-violet-700 border-violet-200',
  'Pending Verification':'bg-amber-100 text-amber-700 border-amber-200',
  Draft:                 'bg-slate-100 text-slate-600 border-slate-200',
};

const statusIcons: Record<string, React.ReactNode> = {
  'EU Approved':         <CheckCircle2 size={11} />,
  Verified:              <CheckCircle2 size={11} />,
  Submitted:             <Clock size={11} />,
  'Pending Verification':<Clock size={11} />,
  Draft:                 <FileText size={11} />,
};

const categories = ['All','T-Shirt','Dress','Jeans','Hoodie','Blouse','Sweater','Sportswear'];
const statuses   = ['All','EU Approved','Verified','Submitted','Pending Verification','Draft'];

const emptyForm = {
  productName:'', category:'T-Shirt', buyer:'', quantity:'',
  material1Name:'Organic Cotton', material1Pct:'100', material1Origin:'Turkey',
  material1Supplier:'', waterUsage:'', carbonFootprint:'', energyUsage:'',
};

export default function DPPPage() {
  const [search,         setSearch]         = useState('');
  const [filterStatus,   setFilterStatus]   = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selected,       setSelected]       = useState<DPP | null>(null);
  const [showCreate,     setShowCreate]     = useState(false);
  const [form,           setForm]           = useState(emptyForm);
  const [localDPPs,      setLocalDPPs]      = useState<DPP[]>(dppData);

  const filtered = localDPPs.filter(d => {
    const q = search.toLowerCase();
    return (
      (d.productName.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.buyer.toLowerCase().includes(q)) &&
      (filterStatus   === 'All' || d.status   === filterStatus) &&
      (filterCategory === 'All' || d.category === filterCategory)
    );
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newDPP: DPP = {
      id: `DPP-2026-${String(localDPPs.length + 1).padStart(3,'0')}`,
      batchId: `BATCH-ATK-${Date.now()}`,
      productName: form.productName, category: form.category,
      factory: 'Anadolu Tekstil A.Ş.', buyer: form.buyer, buyerCountry: 'EU',
      quantity: parseInt(form.quantity) || 0,
      materials: [{ name: form.material1Name, percentage: parseInt(form.material1Pct) || 100,
        origin: form.material1Origin, supplier: form.material1Supplier }],
      productionDate: new Date().toISOString().split('T')[0],
      waterUsage: parseFloat(form.waterUsage) || 0,
      carbonFootprint: parseFloat(form.carbonFootprint) || 0,
      energyUsage: parseFloat(form.energyUsage) || 0,
      chemicalsCompliant: true, status: 'Draft',
      qrData: `https://finlife.io/dpp/DPP-2026-${String(localDPPs.length + 1).padStart(3,'0')}`,
      createdAt: new Date().toISOString(),
    };
    setLocalDPPs(p => [newDPP, ...p]);
    setShowCreate(false); setForm(emptyForm);
  }

  const avgCO2   = (localDPPs.reduce((s,d) => s + d.carbonFootprint, 0) / localDPPs.length).toFixed(1);
  const avgWater = (localDPPs.reduce((s,d) => s + d.waterUsage, 0)      / localDPPs.length).toFixed(1);

  return (
    <div>
      <Header title="Digital Product Passports" subtitle="EU ESPR-compliant DPPs for every textile batch — automated from source data" />
      <div className="p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Total DPPs',       value: localDPPs.length,                                                          color: 'text-slate-900',   bg: 'bg-slate-50'   },
            { label: 'EU Approved',      value: localDPPs.filter(d => d.status === 'EU Approved').length,                  color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Verified',         value: localDPPs.filter(d => d.status === 'Verified').length,                     color: 'text-blue-600',    bg: 'bg-blue-50'    },
            { label: 'Pending / Draft',  value: localDPPs.filter(d => ['Pending Verification','Draft'].includes(d.status)).length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Avg CO₂/item',     value: `${avgCO2} kg`,                                                            color: 'text-violet-600',  bg: 'bg-violet-50'  },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-white shadow-sm text-center`}>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-5">

          {/* Category Donut */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-1">By Category</h2>
            <p className="text-slate-400 text-xs mb-3">DPPs per product type</p>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                  {categoryData.map((e,i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip formatter={v => [`${v} DPPs`,'']} contentStyle={{ borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {categoryData.map(({ name, value, fill }) => (
                <div key={name} className="flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: fill }} />
                  <span className="text-slate-500 truncate">{name}</span>
                  <span className="font-bold text-slate-700 ml-auto">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainability Trend */}
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-slate-900">Sustainability Trend</h2>
                <p className="text-slate-400 text-xs">Avg CO₂ (kg) & Water (L) per item — improving monthly</p>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <TrendingDown size={12} />
                CO₂ –46% vs Nov
              </div>
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <LineChart data={sustainabilityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:11 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11 }} />
                <Line type="monotone" dataKey="co2"    name="CO₂ kg/item"    stroke="#10b981" strokeWidth={2} dot={{ r:3 }} />
                <Line type="monotone" dataKey="water"  name="Water L/item"   stroke="#3b82f6" strokeWidth={2} dot={{ r:3 }} />
                <Line type="monotone" dataKey="energy" name="Energy kWh/item" stroke="#f59e0b" strokeWidth={2} dot={{ r:3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Batch volume + Table */}
        <div className="grid grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 text-sm mb-1">Monthly Batches</h2>
            <p className="text-slate-400 text-xs mb-3">DPPs created per month</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={batchVolume} barSize={18}>
                <XAxis dataKey="month" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:11 }} />
                <Bar dataKey="batches" name="Batches" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Toolbar + Table */}
          <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search DPPs..."
                  className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="relative">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none">
                  {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
                <Plus size={14} /> Create DPP
              </button>
            </div>
            <div className="overflow-auto max-h-72">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    {['DPP ID','Product','Buyer','Qty','CO₂','Water','Status',''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(dpp => (
                    <tr key={dpp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-600">{dpp.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 whitespace-nowrap">{dpp.productName}</p>
                        <p className="text-xs text-slate-400">{dpp.category}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{dpp.buyer}</td>
                      <td className="px-4 py-3 text-slate-600">{dpp.quantity.toLocaleString('en-US')}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1"><Leaf size={11} className="text-emerald-500" /><span>{dpp.carbonFootprint}kg</span></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1"><Droplets size={11} className="text-blue-500" /><span>{dpp.waterUsage}L</span></div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[dpp.status]}`}>
                          {statusIcons[dpp.status]}{dpp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(dpp)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                          <QrCode size={11} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[selected.status]}`}>{selected.status}</span>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div className="col-span-2 flex justify-center">
                <div className="bg-slate-50 rounded-2xl p-5 inline-flex flex-col items-center gap-3 border border-slate-200">
                  <QRCodeSVG value={selected.qrData} size={150} level="H" includeMargin />
                  <p className="text-xs text-slate-400 font-mono">{selected.qrData}</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
                    <Download size={12} /> Download QR
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-700 text-sm border-b border-slate-100 pb-2">Product Details</h3>
                {[['Batch ID',selected.batchId],['Category',selected.category],['Factory',selected.factory],['Production Date',selected.productionDate],['Quantity',`${selected.quantity.toLocaleString('en-US')} pcs`],['Buyer',`${selected.buyer} (${selected.buyerCountry})`]].map(([k,v]) => (
                  <div key={String(k)} className="flex justify-between text-sm">
                    <span className="text-slate-400">{k}</span><span className="font-medium text-slate-800">{v}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-700 text-sm border-b border-slate-100 pb-2">Sustainability</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[{ icon: Leaf, label:'CO₂/item', val:`${selected.carbonFootprint}kg`, bg:'bg-emerald-50', text:'text-emerald-700' },
                    { icon: Droplets, label:'Water/item', val:`${selected.waterUsage}L`, bg:'bg-blue-50', text:'text-blue-700' },
                    { icon: Zap, label:'Energy/item', val:`${selected.energyUsage}kWh`, bg:'bg-amber-50', text:'text-amber-700' }].map(({ icon: Icon, label, val, bg, text }) => (
                    <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                      <Icon size={14} className={`${text} mx-auto mb-1`} />
                      <p className={`text-sm font-bold ${text}`}>{val}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm pt-1">
                  <span className="text-slate-400">Chemicals (REACH)</span>
                  <span className={`font-semibold ${selected.chemicalsCompliant ? 'text-emerald-600':'text-red-500'}`}>
                    {selected.chemicalsCompliant ? 'Compliant ✓':'Non-compliant ✗'}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-700 text-sm border-b border-slate-100 pb-2 pt-2">Materials</h3>
                {selected.materials.map((m,i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{m.name}</span>
                      <span className="text-slate-500">{m.percentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full"><div className="bg-blue-500 h-2 rounded-full" style={{ width:`${m.percentage}%` }} /></div>
                    <p className="text-xs text-slate-400 mt-0.5">{m.supplier} · {m.origin}</p>
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
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Product Name *</label>
                  <input required value={form.productName} onChange={e => setForm(f => ({...f,productName:e.target.value}))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Men's Cotton T-Shirt" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({...f,category:e.target.value}))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['T-Shirt','Dress','Jeans','Jacket','Hoodie','Blouse','Sweater','Sportswear'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">EU Buyer *</label>
                  <input required value={form.buyer} onChange={e => setForm(f => ({...f,buyer:e.target.value}))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. H&M" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Quantity (pcs) *</label>
                  <input required type="number" value={form.quantity} onChange={e => setForm(f => ({...f,quantity:e.target.value}))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 5000" />
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-600 mb-3">Primary Material</p>
                <div className="grid grid-cols-2 gap-3">
                  {[['Material','material1Name','Organic Cotton'],['%','material1Pct','100'],['Origin','material1Origin','Turkey'],['Supplier','material1Supplier','']].map(([label,key,placeholder]) => (
                    <div key={key}>
                      <label className="block text-xs text-slate-400 mb-1">{label}</label>
                      <input value={(form as any)[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={placeholder} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-600 mb-3">IoT / Sustainability Data</p>
                <div className="grid grid-cols-3 gap-3">
                  {[['Water (L/item)','waterUsage','45.2'],['CO₂ (kg/item)','carbonFootprint','2.8'],['Energy (kWh/item)','energyUsage','3.1']].map(([label,key,ph]) => (
                    <div key={key}>
                      <label className="block text-xs text-slate-400 mb-1">{label}</label>
                      <input type="number" step="0.1" value={(form as any)[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={ph} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">Create Draft DPP</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
