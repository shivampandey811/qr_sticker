"use client"
import { Bell, Car, LayoutDashboard, LogOut, Menu, ShieldCheck, Tag, X } from 'lucide-react'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Logo from './Logo'
import { clearSession } from '../lib/api'

const links = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/vehicles', label: 'My vehicles', icon: Car },
  { to: '/activate', label: 'Activate sticker', icon: Tag },
]

export default function DashboardLayout({ children, title, eyebrow }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {}

  const nav = <>
    <div className="px-2 pb-8 flex items-center justify-between">
      <Logo light />
    </div>
    <nav className="space-y-1 flex-1">
      {links.map(({ to, label, icon: Icon }) => {
        const isActive = pathname === to || (to !== '/dashboard' && pathname?.startsWith(to))
        return (
          <Link 
            key={to} 
            href={to} 
            onClick={() => setOpen(false)} 
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
              isActive 
                ? 'bg-slate-800 text-cyan-400' 
                : 'text-slate-400 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        )
      })}
      {user.role === 'admin' && (
        <Link 
          href="/admin" 
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
            pathname === '/admin' 
              ? 'bg-slate-800 text-cyan-400' 
              : 'text-slate-400 hover:bg-slate-850 hover:text-white'
          }`}
        >
          <ShieldCheck size={18} />
          Admin panel
        </Link>
      )}
    </nav>
    <button 
      onClick={() => { clearSession(); router.push('/login') }} 
      className="mt-auto flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 hover:text-white transition"
    >
      <LogOut size={18} />
      Sign out
    </button>
  </>

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-slate-900 p-5 lg:flex text-white border-r border-slate-800">
        {nav}
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
          <aside 
            className="flex h-full w-72 flex-col bg-slate-900 p-5 text-white" 
            onClick={(event) => event.stopPropagation()}
          >
            <button className="mb-4 ml-auto text-slate-400 hover:text-white" onClick={() => setOpen(false)}>
              <X />
            </button>
            {nav}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="lg:ml-64">
        <header className="flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-600" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-600">{eyebrow}</p>
              <h1 className="font-display text-lg font-bold text-slate-900">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition">
              <Bell size={17} className="text-slate-600" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-bold text-cyan-400">
              {user.name?.[0] || 'U'}
            </span>
          </div>
        </header>
        
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
