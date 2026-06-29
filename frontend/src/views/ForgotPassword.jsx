"use client"

import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Logo from '../components/Logo'
import { api, errorMessage } from '../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const { data } = await api.post('/auth/forgot-password', { email })
      setMessage(data.message)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,119,87,0.16),_transparent_28%),radial-gradient(circle_at_80%_18%,_rgba(13,148,136,0.1),_transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 atmospheric-grid opacity-50" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
            <ArrowLeft size={15} />
            Back to sign in
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand-deep)] shadow-sm">
              Password reset
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Recover access without exposing anything publicly.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Enter the email tied to your CarPing account. If it exists, we send a secure reset link to continue privately.
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-white/70 bg-[linear-gradient(150deg,rgba(15,23,42,0.96),rgba(29,36,48,0.94))] p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f2ba87]">
                <ShieldCheck size={22} />
              </div>
              <p className="mt-5 font-display text-2xl font-bold tracking-[-0.04em]">Reset links stay private.</p>
              <p className="mt-3 text-sm leading-7 text-white/72">
                CarPing never reveals whether a given email owns a vehicle on the public side of the product.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--panel)] text-[var(--brand-deep)]">
              <Mail size={24} />
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-[-0.04em] text-slate-950">Send reset link</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              We’ll email you the next step if the account exists.
            </p>

            <form className="mt-8 space-y-4" onSubmit={submit}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                <input
                  className="field"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {message && (
                <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </p>
              )}
              {error && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button disabled={loading} className="btn-primary w-full rounded-full py-3.5 text-sm font-semibold">
                {loading ? 'Sending link…' : 'Send reset link'}
                <ArrowRight size={16} />
              </button>
            </form>

            <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-deep)] transition hover:text-slate-900">
              <ArrowLeft size={15} />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
