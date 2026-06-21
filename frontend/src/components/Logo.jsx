import { Radio } from 'lucide-react'
import Link from 'next/link'

export default function Logo({ light = false }) {
  return <Link href="/" className="inline-flex items-center gap-2 font-display text-xl font-black tracking-tight text-slate-900">
    <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white shadow-md shadow-indigo-500/10"><Radio size={18} strokeWidth={2.5} className="animate-pulse" /></span>
    <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Car</span>
    <span className="text-cyan-600">Ping</span>
  </Link>
}


