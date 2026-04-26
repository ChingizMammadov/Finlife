'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { supplierData, Supplier } from '@/lib/mockData';
import { Plus, Search, X, MapPin, CheckCircle2, Clock, XCircle, Award } from 'lucide-react';

const verifyColors: Record<string, string> = {
  Verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Failed: 'bg-red-100 text-red-700 border-red-200',
};

const verifyIcons: Record<string, React.ReactNode> = {
  Verified: <CheckCircle2 size={12} />,
  Pending: <Clock size={12} />,
  Failed: <XCircle size={12} />,
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? 'bg-emerald-500' : score >= 75 ? 'bg-blue-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-bold text-slate-700 w-8">{score}</span>
    </div>
  );
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(supplierData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [form, setForm] = useState({ name: '', city: '', country: 'Turkey', materials: '', certs: '' });

  const filtered = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.materials.some(m => m.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'All' || s.verificationStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const newSup: Supplier = {
      id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      name: form.name,
      city: form.city,
      country: form.country,
      materials: form.materials.split(',').map(m => m.trim()),
      complianceScore: 65,
      verificationStatus: 'Pending',
      certifications: form.certs.split(',').map(c => c.trim()).filter(Boolean),
      lastAudit: new Date().toISOString().split('T')[0],
      activeContracts: 0,
    };
    setSuppliers(prev => [...prev, newSup]);
    setShowCreate(false);
    setForm({ name: '', city: '', country: 'Turkey', materials: '', certs: '' });
  }

  const avgScore = Math.round(suppliers.reduce((s, sup) => s + sup.complianceScore, 0) / suppliers.length);

  return (
    <div>
      <Header title="Supplier Management" subtitle="Manage your supply chain and track material compliance" />
      <div className="p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <p className="text-3xl font-bold text-slate-900">{suppliers.length}</p>
            <p className="text-slate-500 text-sm mt-1">Total Suppliers</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <p className="text-3xl font-bold text-emerald-600">{suppliers.filter(s => s.verificationStatus === 'Verified').length}</p>
            <p className="text-slate-500 text-sm mt-1">Verified</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <p className="text-3xl font-bold text-amber-600">{suppliers.filter(s => s.verificationStatus === 'Pending').length}</p>
            <p className="text-slate-500 text-sm mt-1">Pending Review</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <p className="text-3xl font-bold text-blue-600">{avgScore}</p>
            <p className="text-slate-500 text-sm mt-1">Avg. Compliance Score</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search suppliers or materials..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-2">
            {['All', 'Verified', 'Pending', 'Failed'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors ${filterStatus === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={() => setShowCreate(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            <Plus size={15} />
            Add Supplier
          </button>
        </div>

        {/* Supplier Cards */}
        <div className="grid grid-cols-2 gap-5">
          {filtered.map(sup => (
            <div key={sup.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelected(sup)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">{sup.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-slate-400" />
                    <p className="text-slate-500 text-sm">{sup.city}, {sup.country}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${verifyColors[sup.verificationStatus]}`}>
                  {verifyIcons[sup.verificationStatus]}
                  {sup.verificationStatus}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 font-medium">Compliance Score</span>
                </div>
                <ScoreBar score={sup.complianceScore} />
              </div>

              <div className="mt-4 flex items-center gap-2 flex-wrap">
                {sup.materials.map(m => (
                  <span key={m} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-lg">{m}</span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Award size={12} />
                  <span>{sup.certifications.length > 0 ? sup.certifications.join(', ') : 'No certs'}</span>
                </div>
                <span>{sup.activeContracts} active contract{sup.activeContracts !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supplier Detail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${verifyColors[selected.verificationStatus]}`}>
                  {verifyIcons[selected.verificationStatus]}
                  {selected.verificationStatus}
                </span>
                <span className="text-slate-500 text-sm">Last audit: {selected.lastAudit}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Location', `${selected.city}, ${selected.country}`],
                  ['ID', selected.id],
                  ['Active Contracts', selected.activeContracts],
                  ['Compliance Score', `${selected.complianceScore}/100`],
                ].map(([k, v]) => (
                  <div key={String(k)}>
                    <p className="text-slate-400 text-xs">{k}</p>
                    <p className="font-semibold text-slate-800">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Compliance Score</p>
                <ScoreBar score={selected.complianceScore} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Materials Supplied</p>
                <div className="flex flex-wrap gap-2">
                  {selected.materials.map(m => <span key={m} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">{m}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Certifications</p>
                {selected.certifications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selected.certifications.map(c => <span key={c} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-100 flex items-center gap-1"><Award size={11} />{c}</span>)}
                  </div>
                ) : <p className="text-slate-400 text-sm">No certifications on file</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Add New Supplier</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">City *</label>
                  <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Country</label>
                  <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Materials (comma-separated) *</label>
                <input required value={form.materials} onChange={e => setForm(f => ({ ...f, materials: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Cotton, Polyester" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Certifications (comma-separated)</label>
                <input value={form.certs} onChange={e => setForm(f => ({ ...f, certs: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. GOTS, OEKO-TEX 100" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">
                  Add Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
