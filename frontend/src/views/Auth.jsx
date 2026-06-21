"use client"
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '../components/Logo'
import { api, errorMessage, setSession } from '../lib/api'

export default function Auth({ mode = 'login' }) {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', mobile: '', whatsapp: '', password: '' })
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const register = mode === 'register'
  const submit = async (event) => {
    event.preventDefault(); setStatus({ loading: true, error: '', success: '' })
    try {
      if (register) { const { data } = await api.post('/auth/register', form); setStatus({ loading: false, success: data.message, error: '' }) }
      else { const { data } = await api.post('/auth/login', { email: form.email, password: form.password }); setSession(data); router.push(data.user.role === 'admin' ? '/admin' : '/dashboard') }
    } catch (error) { setStatus({ loading: false, success: '', error: errorMessage(error) }) }
  }
  return <div className="grid min-h-screen bg-white lg:grid-cols-[.85fr_1.15fr]">
    <div className="flex flex-col px-6 py-7 sm:px-12 lg:px-16"><div className="flex items-center justify-between"><Logo /><Link href="/" className="flex items-center gap-2 text-sm text-black/50 hover:text-black"><ArrowLeft size={15} /> Home</Link></div><div className="mx-auto my-auto w-full max-w-md py-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-700">{register ? 'Create your account' : 'Welcome back'}</p><h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">{register ? 'Protect your vehicle.' : 'Good to see you.'}</h1><p className="mt-3 text-sm text-black/50">{register ? 'Join in under two minutes. Your data stays private.' : 'Sign in to manage vehicles and view alerts.'}</p>
      {status.success ? <div className="mt-10 rounded-2xl bg-emerald-50 p-6 text-emerald-800"><CheckCircle2 /><p className="mt-3 font-semibold">{status.success}</p><Link href="/login" className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Continue to sign in <ArrowRight size={15} /></Link></div> : <form onSubmit={submit} className="mt-9 space-y-4">{register && <><input className="field" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><div className="grid gap-4 sm:grid-cols-2"><input className="field" placeholder="Mobile number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required /><input className="field" placeholder="WhatsApp number" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} required /></div></>}<input className="field" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /><input className="field" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />{!register && <div className="text-right"><Link href="/forgot-password" className="text-xs font-semibold text-gold-700">Forgot password?</Link></div>}{status.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{status.error}</p>}<button disabled={status.loading} className="btn-primary w-full py-3.5">{status.loading ? 'Please wait…' : register ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></button></form>}
      <p className="mt-7 text-center text-sm text-black/50">{register ? 'Already protected?' : 'New to CarPing?'} <Link className="font-bold text-black" href={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create account'}</Link></p></div></div>
    <div className="noise hidden overflow-hidden bg-slate-50 p-16 text-slate-805 lg:flex lg:flex-col lg:justify-between border-l border-slate-100"><p className="max-w-lg font-display text-5xl font-extrabold leading-[1.06] tracking-tight text-slate-900">Privacy isn’t a feature.<br /><span className="bg-gradient-to-r from-cyan-600 to-indigo-650 bg-clip-text text-transparent">It’s the foundation.</span></p><div className="border border-slate-200 max-w-lg rounded-2xl p-8 bg-white"><p className="text-lg leading-8 text-slate-600">“Someone alerted me about my headlights at the airport. One scan probably saved my battery—and they never needed my number.”</p><p className="mt-6 text-sm font-bold text-cyan-600">— CarPing early member</p></div></div>
  </div>
}

