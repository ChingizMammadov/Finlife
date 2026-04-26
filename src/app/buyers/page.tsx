'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { buyerData } from '@/lib/mockData';
import { CheckCircle2, XCircle, TrendingUp, ShoppingBag, Clock } from 'lucide-react';

export default function BuyersPage() {
  const [selected, setSelected] = useState(buyerData[0].id);
  const buyer = buyerData.find(b => b.id === selected)!;

  const mockOrders = [
    { id: 'ORD-2026-018', product: "Men's Organic T-Shirt", qty: 5000, value: 245000, date: '2026-04-10', status: 'Shipped' },
    { id: 'ORD-2026-014', product: 'Performance Sports Tee', qty: 6000, value: 198000, date: '2026-03-28', status: 'In Production' },
    { id: 'ORD-2026-011', product: 'Cotton Polo Shirt', qty: 4000, value: 178000, date: '2026-03-10', status: 'Delivered' },
    { id: 'ORD-2026-007', product: 'Linen Blend Shirt', qty: 3200, value: 144000, date: '2026-02-20', status: 'Delivered' },
    { id: 'ORD-2026-004', product: 'Cotton Casual T-Shirt', qty: 7000, value: 189000, date: '2026-01-15', status: 'Delivered' },
  ];

  const orderStatusColors: Record<string, string> = {
    Shipped: 'bg-blue-100 text-blue-700',
    'In Production': 'bg-amber-100 text-amber-700',
    Delivered: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <Header title="EU Buyers" subtitle="Manage your European buyer relationships and order history" />
      <div className="p-8 space-y-6">

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <p className="text-3xl font-bold text-slate-900">{buyerData.length}</p>
            <p className="text-slate-500 text-sm mt-1">Total Buyers</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <p className="text-3xl font-bold text-blue-600">{buyerData.reduce((s, b) => s + b.activeOrders, 0)}</p>
            <p className="text-slate-500 text-sm mt-1">Active Orders</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <p className="text-3xl font-bold text-emerald-600">€{(buyerData.reduce((s, b) => s + b.totalValue, 0) / 1000000).toFixed(1)}M</p>
            <p className="text-slate-500 text-sm mt-1">Total Revenue</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
            <p className="text-3xl font-bold text-violet-600">{buyerData.filter(b => b.esrpCompliant).length}/{buyerData.length}</p>
            <p className="text-slate-500 text-sm mt-1">ESPR Compliant</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Buyer List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Buyers</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {buyerData.map(b => (
                <button key={b.id} onClick={() => setSelected(b.id)}
                  className={`w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors ${selected === b.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                        <span className="text-lg">{b.flag}</span>
                        {b.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{b.country} · {b.totalOrders} orders</p>
                    </div>
                    <p className="text-sm font-bold text-slate-700">€{(b.totalValue / 1000000).toFixed(1)}M</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Buyer Detail */}
          <div className="col-span-2 space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-4xl">{buyer.flag}</p>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{buyer.name}</h2>
                  <p className="text-slate-500 text-sm">{buyer.country}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${buyer.esrpCompliant ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {buyer.esrpCompliant ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    ESPR {buyer.esrpCompliant ? 'Compliant' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <ShoppingBag size={18} className="text-slate-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-slate-900">{buyer.totalOrders}</p>
                  <p className="text-xs text-slate-500">Total Orders</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <TrendingUp size={18} className="text-emerald-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-emerald-700">€{(buyer.totalValue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-slate-500">Total Value</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <ShoppingBag size={18} className="text-blue-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-blue-700">{buyer.activeOrders}</p>
                  <p className="text-xs text-slate-500">Active Orders</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <Clock size={18} className="text-amber-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-amber-700">{buyer.paymentTerms}d</p>
                  <p className="text-xs text-slate-500">Payment Terms</p>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Order History</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    {['Order ID', 'Product', 'Qty', 'Value', 'Date', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 text-sm font-mono text-slate-700">{o.id}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-800">{o.product}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{o.qty.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">€{o.value.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{o.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${orderStatusColors[o.status]}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
