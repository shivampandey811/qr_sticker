"use client"
import { AlertTriangle, Car, CheckCircle2, ChevronRight, CircleAlert, Lightbulb, MessageCircle, ShieldCheck, Wrench, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Logo from '../components/Logo'
import { api, errorMessage } from '../lib/api'

const actions = [
  { type: 'blocking', label: 'Vehicle blocking access', icon: Car },
  { type: 'headlights', label: 'Headlights left on', icon: Lightbulb },
  { type: 'emergency', label: 'Emergency', icon: CircleAlert, urgent: true },
  { type: 'flat_tyre', label: 'Flat tyre', icon: Wrench },
  { type: 'accident', label: 'Accident damage', icon: AlertTriangle },
  { type: 'custom', label: 'Custom message', icon: MessageCircle },
]

export default function PublicSticker() {
  const { qrId } = useParams(); const [sticker, setSticker] = useState(null); const [selected, setSelected] = useState(null); const [custom, setCustom] = useState(''); const [state, setState] = useState({ loading: true, error: '', sent: false })
  useEffect(() => { api.get(`/public/stickers/${qrId}`).then(({ data }) => { setSticker(data); setState({ loading: false, error: '', sent: false }) }).catch((error) => setState({ loading: false, error: errorMessage(error), sent: false })) }, [qrId])
  const send = async () => { setState({ ...state, loading: true }); try { await api.post(`/public/stickers/${qrId}/contact`, { message_type: selected, custom_message: selected === 'custom' ? custom : null, captcha_token: window.turnstileToken || null }); setState({ loading: false, error: '', sent: true }); setSelected(null) } catch (error) { setState({ loading: false, error: errorMessage(error), sent: false }) } }
  
  if (state.loading && !sticker) return <div className="grid min-h-screen place-items-center bg-slate-50 text-cyan-600 font-mono text-sm tracking-widest uppercase animate-pulse">Loading secure sticker…</div>
  if (state.error && !sticker) return <div className="grid min-h-screen place-items-center bg-slate-50 p-5 text-center text-slate-800"><div><AlertTriangle className="mx-auto text-red-500 mb-4" size={32} /><h1 className="font-display text-2xl font-bold">Sticker unavailable</h1><p className="mt-2 text-slate-500 max-w-sm">{state.error}</p></div></div>
  
  return <div className="min-h-screen bg-slate-50/50 px-4 py-8 text-slate-900 relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-[400px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-100/30 via-indigo-50/20 to-transparent pointer-events-none z-0" />
    <div className="absolute inset-0 futuristic-grid opacity-25 pointer-events-none z-0" />
    
    <div className="mx-auto max-w-md relative z-10">
      <div className="flex items-center justify-between">
        <Logo />
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-100"><ShieldCheck size={13} /> Verified sticker</span>
      </div>
      
      <div className="mt-8 rounded-[1.75rem] bg-white p-5 text-slate-900 border border-slate-100 shadow-xl sm:p-7">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">Vehicle assistance</p>
          <h1 className="mt-3 font-display text-2xl font-black leading-tight text-slate-900">Need to contact<br />the vehicle owner?</h1>
          <p className="mx-auto mt-3 max-w-xs text-xs leading-5 text-slate-500">Choose a reason. The owner’s personal details will always remain private.</p>
          {sticker?.vehicle?.nickname && <span className="mt-4 inline-block rounded-full bg-slate-100 border border-slate-200/50 px-3 py-1 text-xs font-semibold text-slate-700">{sticker.vehicle.nickname}</span>}
        </div>
        
        {state.sent && <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800 border border-emerald-100"><CheckCircle2 className="shrink-0 text-emerald-600" /><div><p className="text-sm font-bold">Owner notified</p><p className="text-xs opacity-75">Your identity and details were not shared.</p></div></div>}
        
        <div className="mt-7 space-y-2.5">
          {actions.map(({ type, label, icon: Icon, urgent }) => (
            <button 
              key={type} 
              onClick={() => setSelected(type)} 
              className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                urgent 
                  ? 'border-red-100 bg-red-50/50 text-red-900 hover:border-red-300' 
                  : 'border-slate-100 bg-slate-50/30 text-slate-800 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                urgent ? 'bg-red-100 text-red-700' : 'bg-cyan-50 text-cyan-650'
              }`}><Icon size={19} /></span>
              <span className="flex-1 text-sm font-semibold">{label}</span>
              <ChevronRight size={17} className="opacity-30" />
            </button>
          ))}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-slate-400"><ShieldCheck size={13} className="text-cyan-500" /> Anonymous & rate-limit protected</p>
      </div>
    </div>
    
    {selected && (
      <div className="fixed inset-0 z-50 grid place-items-end bg-slate-900/40 backdrop-blur-sm p-3 sm:place-items-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-slate-100 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900">Send this alert?</h2>
            <button onClick={() => setSelected(null)} className="p-1 text-slate-400 hover:text-slate-900 rounded"><X /></button>
          </div>
          <p className="mt-2 text-xs text-slate-500">The owner will receive an instant private notification.</p>
          {selected === 'custom' && <textarea className="field mt-5 min-h-28 resize-none" maxLength={300} placeholder="Briefly explain the issue…" value={custom} onChange={(e) => setCustom(e.target.value)} />}
          {state.error && <p className="mt-3 text-xs text-red-650">{state.error}</p>}
          <button disabled={state.loading || (selected === 'custom' && !custom.trim())} onClick={send} className="btn-primary mt-5 w-full">{state.loading ? 'Notifying…' : 'Notify owner privately'}</button>
        </div>
      </div>
    )}
  </div>
}

