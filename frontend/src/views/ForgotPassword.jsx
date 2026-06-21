"use client"
import { useState } from 'react'
import Link from 'next/link'
import Logo from '../components/Logo'
import { api, errorMessage } from '../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState('')
  const submit = async (event) => { event.preventDefault(); try { const { data } = await api.post('/auth/forgot-password', { email }); setMessage(data.message) } catch (err) { setError(errorMessage(err)) } }
  return <div className="grid min-h-screen place-items-center bg-slate-50/50 p-5"><div className="card w-full max-w-md p-8"><Logo /><h1 className="mt-10 font-display text-3xl font-extrabold">Reset password</h1><p className="mt-2 text-sm text-black/50">We’ll send a secure reset link if the account exists.</p><form className="mt-7 space-y-4" onSubmit={submit}><input className="field" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />{message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}{error && <p className="text-sm text-red-650">{error}</p>}<button className="btn-primary w-full">Send reset link</button></form><Link href="/login" className="mt-6 block text-center text-sm font-semibold hover:text-cyan-600 transition">Back to sign in</Link></div></div>
}

