"use client"

import { ArrowLeft, ArrowRight, CheckCircle2, QrCode, ShieldCheck, Zap } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '../components/Logo'
import { api, errorMessage, setSession } from '../lib/api'

const authBenefits = [
  { icon: <ShieldCheck size={16} />, label: 'Private owner contact layer' },
  { icon: <QrCode size={16} />, label: 'One sticker for every vehicle flow' },
  { icon: <Zap size={16} />, label: 'Fast alerts when something is urgent' },
]

export default function Auth({ mode = 'login' }) {
  const router = useRouter()
  const register = mode === 'register'
  const [form, setForm] = useState({ name: '', email: '', mobile: '', whatsapp: '', password: '' })
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  const submit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    try {
      if (register) {
        const { data } = await api.post('/auth/register', form)
        setStatus({ loading: false, success: data.message, error: '' })
        return
      }

      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      })
      setSession(data)
      router.push(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error) {
      setStatus({ loading: false, success: '', error: errorMessage(error) })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,119,87,0.16),_transparent_28%),radial-gradient(circle_at_85%_15%,_rgba(13,148,136,0.12),_transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 atmospheric-grid opacity-50" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[0.98fr_1.02fr]">
        <div className="flex flex-col px-6 py-6 sm:px-10 lg:px-14 lg:py-8">
          <div className="flex items-center justify-between">
            <Logo />
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
              <ArrowLeft size={15} />
              Back home
            </Link>
          </div>

          <div className="mx-auto flex w-full max-w-xl flex-1 items-center py-10 lg:py-16">
            <div className="w-full">
              <div className="inline-flex items-center rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand-deep)] shadow-sm">
                {register ? 'Create your CarPing account' : 'Secure owner sign in'}
              </div>

              <h1 className="mt-5 font-display text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                {register ? 'Protect the vehicle before problems escalate.' : 'Access your alerts, vehicles, and sticker setup.'}
              </h1>
              <p className="mt-4 max-w-lg text-base leading-8 text-slate-600">
                {register
                  ? 'Create an owner account, connect your sticker, and keep your contact details off the vehicle.'
                  : 'Sign in to manage vehicle stickers, review notifications, and keep the public contact flow under control.'}
              </p>

              {status.success ? (
                <div className="mt-10 rounded-[1.75rem] border border-emerald-200 bg-emerald-50/90 p-6 text-emerald-900 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                    <CheckCircle2 size={22} />
                  </div>
                  <p className="mt-4 text-base font-semibold">{status.success}</p>
                  <p className="mt-2 text-sm leading-7 text-emerald-800/80">
                    Continue to sign in once your account is verified and ready.
                  </p>
                  <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900">
                    Continue to sign in <ArrowRight size={15} />
                  </Link>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-10 space-y-4 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
                  {register && (
                    <>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                        <input
                          className="field"
                          placeholder="Shivam Pandey"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">Mobile number</label>
                          <input
                            className="field"
                            placeholder="+91 98765 43210"
                            value={form.mobile}
                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">WhatsApp number</label>
                          <input
                            className="field"
                            placeholder="+91 98765 43210"
                            value={form.whatsapp}
                            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                    <input
                      className="field"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <label className="block text-sm font-semibold text-slate-700">Password</label>
                      {!register && (
                        <Link href="/forgot-password" className="text-sm font-semibold text-[var(--brand-deep)] transition hover:text-slate-900">
                          Forgot password?
                        </Link>
                      )}
                    </div>
                    <input
                      className="field"
                      type="password"
                      placeholder={register ? 'Create a strong password' : 'Enter your password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      minLength={8}
                    />
                  </div>

                  {status.error && (
                    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {status.error}
                    </p>
                  )}

                  <button disabled={status.loading} className="btn-primary w-full rounded-full py-3.5 text-sm font-semibold">
                    {status.loading ? 'Please wait…' : register ? 'Create account' : 'Sign in'}
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

              <p className="mt-6 text-center text-sm text-slate-500">
                {register ? 'Already have an account?' : 'New to CarPing?'}{' '}
                <Link className="font-semibold text-slate-900" href={register ? '/login' : '/register'}>
                  {register ? 'Sign in' : 'Create account'}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden border-l border-white/60 lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-12">
          <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(150deg,rgba(15,23,42,0.96),rgba(29,36,48,0.94))] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f2ba87]">Owner console</p>
            <h2 className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-[-0.05em]">
              Privacy is the product, not an afterthought.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/72">
              CarPing lets someone nearby reach you in a useful moment without printing your personal number on the car.
            </p>

            <div className="mt-8 space-y-3">
              {authBenefits.map((benefit) => (
                <div key={benefit.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/84">
                  <span className="text-[#f2ba87]">{benefit.icon}</span>
                  {benefit.label}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/78 p-6 shadow-sm backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-deep)]">What you manage</p>
              <p className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-slate-950">Vehicles, alerts, and sticker links</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The dashboard keeps contact routes clear, while the public QR page stays simple for scanners.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/78 p-6 shadow-sm backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-deep)]">Typical moment</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                “Someone warned me that my headlights were still on in the parking lot, and they never needed my number.”
              </p>
              <p className="mt-5 text-sm font-semibold text-slate-900">Early CarPing user</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
