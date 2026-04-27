'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { supplierData, Supplier } from '@/lib/mockData';
import { Plus, Search, X, MapPin, CheckCircle2, Clock, XCircle, Award, AlertTriangle } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const verifyColors: Record<string,string> = {
  Verified:'bg-emerald-100 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Failed:  'bg-red-100 text-red-700 border-red-200',
};
const verifyIcons: Record<string,React.ReactNode> = {
  Verified:<CheckCircle2 size={12}/>, Pending:<Clock size={12}/>, Failed:<XCircle size={12}/>,
};

const complianceDistribution = [
  { range:'90–100', count:2, fill:'#10b981' },
  { range:'80–89',  count:2, fill:'#3b82f6' },
  { range:'70–79',  count:1, fill:'#f59e0b' },
  { range:'<70',    count:1, fill:'#ef4444' },
];

const radarData = [
  { metric:'Documentation', score:88 },
  { metric:'On-Time Delivery', score:92 },
  { metric:'Quality Control', score:85 },
  { metric:'Certifications', score:76 },
  { metric:'Traceability', score:80 },
  { metric:'REACH Compliance', score:70 },
];

function ScoreBar({ score }: { score:number }) {
  const color = score>=90?'bg-emerald-500':score>=75?'bg-blue-500':score>=60?'bg-amber-500':'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width:`${score}%` }} />
      </div>
      <span className={`text-xs font-extrabold w-8 text-right ${score>=90?'text-emerald-600':score>=75?'text-blue-600':score>=60?'text-amber-600':'text-red-600'}`}>{score}</span>
    </div>
  );
}

export default function SuppliersPage() {
  const [suppliers,  setSuppliers]  = useState<Supplier[]>(supplierData);
  const [search,     setSearch]     = useState('');
  const [filterStatus,setFilterStatus] = useState('All');
  const [showCreate, setShowCreate] = useState(false);
  const [selected,   setSelected]   = useState<Supplier | null>(null);
  const [form,       setForm]       = useState({ name:'', city:'', country:'Turkey', materials:'', certs:'' });

  const filtered = suppliers.filter(s => {
    const q = search.toLowerCase();
    return (s.name.toLowerCase().includes(q)||s.city.toLowerCase().includes(q)||s.materials.some(m=>m.toLowerCase().includes(q))) &&
      (filterStatus==='All'||s.verificationStatus===filterStatus);
  });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSuppliers(p => [...p, {
      id:`SUP-${String(p.length+1).padStart(3,'0')}`, name:form.name, city:form.city, country:form.country,
      materials:form.materials.split(',').map(m=>m.trim()), complianceScore:65, verificationStatus:'Pending',
      certifications:form.certs.split(',').map(c=>c.trim()).filter(Boolean),
      lastAudit:new Date().toISOString().split('T')[0], activeContracts:0,
    }]);
    setShowCreate(false); setForm({ name:'',city:'',country:'Turkey',materials:'',certs:'' });
  }

  const avgScore  = Math.round(suppliers.reduce((s,sup)=>s+sup.complianceScore,0)/suppliers.length);
  const totalCerts = [...new Set(suppliers.flatMap(s=>s.certifications))].length;

  return (
    <div>
      <Header title="Supplier Management" subtitle="Track material traceability, compliance scores and certifications across your supply chain" />
      <div className="p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5">
          {[
            { label:'Total Suppliers',  value:suppliers.length,                                        color:'text-slate-900',   bg:'bg-slate-50'   },
            { label:'Verified',         value:suppliers.filter(s=>s.verificationStatus==='Verified').length, color:'text-emerald-600', bg:'bg-emerald-50' },
            { label:'Avg. Compliance',  value:`${avgScore}/100`,                                       color:'text-blue-600',    bg:'bg-blue-50'    },
            { label:'Unique Certs',     value:totalCerts,                                              color:'text-violet-600',  bg:'bg-violet-50'  },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-5 border border-white shadow-sm`}>
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-5">

          {/* Compliance Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-1">Compliance Score Distribution</h2>
            <p className="text-slate-400 text-sm mb-4">Number of suppliers per score range</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={complianceDistribution} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip formatter={(v:any)=>[`${v} supplier${v!==1?'s':''}`,'']} contentStyle={{ borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:11 }} />
                {complianceDistribution.map((e,i)=><Cell key={i} fill={e.fill}/>)}
                <Bar dataKey="count" name="Suppliers" radius={[6,6,0,0]}>
                  {complianceDistribution.map((e,i)=><Cell key={i} fill={e.fill}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-1">Supply Chain Quality Radar</h2>
            <p className="text-slate-400 text-sm mb-2">Avg. score across all Tier-1 suppliers</p>
            <ResponsiveContainer width="100%" height={190}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize:10, fill:'#64748b' }} />
                <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip formatter={(v:any)=>[`${v}/100`,'']} contentStyle={{ borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search suppliers or materials..."
              className="w-full pl-8 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-2">
            {['All','Verified','Pending','Failed'].map(s=>(
              <button key={s} onClick={()=>setFilterStatus(s)}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors ${filterStatus===s?'bg-blue-600 text-white border-blue-600':'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{s}</button>
            ))}
          </div>
          <button onClick={()=>setShowCreate(true)} className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">
            <Plus size={14}/> Add Supplier
          </button>
        </div>

        {/* Supplier Cards */}
        <div className="grid grid-cols-2 gap-5">
          {filtered.map(sup => (
            <div key={sup.id} onClick={()=>setSelected(sup)}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-slate-900">{sup.name}</p>
                  <div className="flex items-center gap-1 mt-0.5"><MapPin size={11} className="text-slate-400"/><p className="text-slate-400 text-xs">{sup.city}, {sup.country}</p></div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${verifyColors[sup.verificationStatus]}`}>
                  {verifyIcons[sup.verificationStatus]}{sup.verificationStatus}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1"><span>Compliance Score</span><span className="font-semibold text-slate-600">{sup.complianceScore}/100</span></div>
                <ScoreBar score={sup.complianceScore} />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {sup.materials.map(m=><span key={m} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-lg">{m}</span>)}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-50">
                <div className="flex gap-1.5 flex-wrap">
                  {sup.certifications.length>0
                    ? sup.certifications.map(c=><span key={c} className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded"><Award size={9}/>{c}</span>)
                    : <span className="flex items-center gap-1 text-red-400"><AlertTriangle size={11}/>No certifications</span>}
                </div>
                <span>{sup.activeContracts} contract{sup.activeContracts!==1?'s':''}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{selected.name}</h2>
              <button onClick={()=>setSelected(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border ${verifyColors[selected.verificationStatus]}`}>
                  {verifyIcons[selected.verificationStatus]}{selected.verificationStatus}
                </span>
                <span className="text-slate-400 text-xs">Last audit: {selected.lastAudit}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[['Location',`${selected.city}, ${selected.country}`],['ID',selected.id],['Contracts',selected.activeContracts],['Score',`${selected.complianceScore}/100`]].map(([k,v])=>(
                  <div key={String(k)}><p className="text-slate-400 text-xs">{k}</p><p className="font-bold text-slate-800">{v}</p></div>
                ))}
              </div>
              <div><p className="text-xs text-slate-400 mb-1.5">Compliance Score</p><ScoreBar score={selected.complianceScore} /></div>
              <div>
                <p className="text-xs text-slate-400 mb-2">Materials Supplied</p>
                <div className="flex flex-wrap gap-2">{selected.materials.map(m=><span key={m} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">{m}</span>)}</div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-2">Certifications</p>
                {selected.certifications.length>0
                  ? <div className="flex flex-wrap gap-2">{selected.certifications.map(c=><span key={c} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-100 flex items-center gap-1"><Award size={10}/>{c}</span>)}</div>
                  : <p className="text-slate-400 text-sm flex items-center gap-1"><AlertTriangle size={14} className="text-red-400"/>No certifications on file</p>}
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
              <button onClick={()=>setShowCreate(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-500"/></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              {[['Company Name *','name','text',''],['City *','city','text',''],['Country','country','text','Turkey'],['Materials (comma-separated) *','materials','text','e.g. Cotton, Polyester'],['Certifications (comma-separated)','certs','text','e.g. GOTS, OEKO-TEX 100']].map(([label,key,type,ph])=>(
                <div key={key as string}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <input required={String(label).includes('*')} type={String(type)} value={(form as any)[key as string]} onChange={e=>setForm(f=>({...f,[key as string]:e.target.value}))} placeholder={String(ph)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setShowCreate(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">Add Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
