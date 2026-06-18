'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/lancamentos', label: 'Lançamentos', icon: '➕' },
  { href: '/categorias', label: 'Categorias', icon: '🏷️' },
  { href: '/prolabore', label: 'Pro-labore', icon: '💰' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-10">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">FinanceiroKai</h1>
        <div className="flex gap-2 mt-3">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-medium">
            Kaique PF
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
            Luvisi&apos;s PJ
          </span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 mb-1">WhatsApp Bot</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs text-gray-400">Evolution API</span>
        </div>
      </div>
    </aside>
  )
}
