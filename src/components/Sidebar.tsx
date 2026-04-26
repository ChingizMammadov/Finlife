'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, CreditCard, Users,
  Building2, ShieldCheck, BarChart3, Settings,
  Layers,
} from 'lucide-react';
import clsx from 'clsx';

const nav = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Digital Passports', href: '/dpp', icon: FileText },
  { label: 'Invoice Financing', href: '/financing', icon: CreditCard },
  { label: 'Suppliers', href: '/suppliers', icon: Users },
  { label: 'EU Buyers', href: '/buyers', icon: Building2 },
  { label: 'Compliance & KYC', href: '/compliance', icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 flex flex-col z-20 border-r border-slate-700/50">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <Layers size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">FinLife</p>
            <p className="text-blue-400 text-xs mt-0.5 font-medium">Textile Platform</p>
          </div>
        </div>
      </div>

      {/* Factory badge */}
      <div className="mx-4 mt-4 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700">
        <p className="text-slate-400 text-xs">Active Factory</p>
        <p className="text-white text-sm font-semibold mt-0.5">Anadolu Tekstil A.Ş.</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">Operational</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-0.5">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mb-2">Main Menu</p>
        {nav.map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <Icon size={17} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-300" />}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="px-4 pb-4 border-t border-slate-700/60 pt-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Settings size={17} className="text-slate-400" />
          <span className="text-slate-400 text-sm font-medium hover:text-white transition-colors">Settings</span>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">AT</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-semibold truncate">Anadolu Tekstil</p>
            <p className="text-slate-500 text-xs truncate">anadolu@finlife.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
