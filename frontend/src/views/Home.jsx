"use client"

import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Cpu,
  Mail,
  QrCode,
  Radio,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import Logo from '../components/Logo'
import HelpChatbot from '../components/HelpChatbot'

const phrases = [
  'Blocking a driveway?',
  'Headlights still on?',
  'Flat tire spotted?',
  'Parked in a tow zone?',
]

const widestPhrase = phrases.reduce((longest, phrase) => (
  phrase.length > longest.length ? phrase : longest
), phrases[0])

const steps = [
  {
    num: '01',
    title: 'Scan the sticker',
    desc: 'Anyone nearby opens the secure contact page by scanning your CarPing QR sticker.',
    icon: <Smartphone size={22} />,
    screenTitle: 'Sticker detected',
    screenSubtitle: 'Secure page loaded',
    screenMock: (
      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Vehicle tag</p>
          <p className="mt-1 text-sm font-bold text-slate-900">CP-9831 verified</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 text-[11px] font-medium text-emerald-700">
          Your phone number stays private.
        </div>
      </div>
    ),
  },
  {
    num: '02',
    title: 'Choose the alert',
    desc: 'The scanner picks a clear reason like blocked exit, headlights on, or parking issue.',
    icon: <Cpu size={22} />,
    screenTitle: 'Choose a reason',
    screenSubtitle: 'Fast preset actions',
    screenMock: (
      <div className="space-y-2 text-left">
        {['Blocking my exit', 'Headlights are on', 'Your tire looks flat'].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-[11px] font-semibold text-slate-700 shadow-sm"
          >
            <span>{item}</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#d97757]" />
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '03',
    title: 'Owner gets pinged',
    desc: 'CarPing forwards the notification instantly by email or configured delivery channel.',
    icon: <Radio size={22} />,
    screenTitle: 'Alert delivered',
    screenSubtitle: 'Private route complete',
    screenMock: (
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check size={20} />
        </div>
        <p className="text-[11px] font-semibold text-slate-900">Owner notified successfully</p>
        <p className="text-[10px] leading-relaxed text-slate-500">
          Message forwarded without exposing personal details.
        </p>
      </div>
    ),
  },
]

const usecases = [
  {
    id: 'windscreen',
    title: 'Clean on the windscreen',
    desc: 'Minimal placement that stays readable without looking like a loud parking pass.',
    badge: 'Windscreen',
    image: '/usecase_windscreen.png',
  },
  {
    id: 'raining',
    title: 'Readable in the rain',
    desc: 'Weatherproof print keeps the QR sharp when conditions get rough.',
    badge: 'Rain-ready',
    image: '/usecase_raining.png',
  },
  {
    id: 'traffic',
    title: 'Useful in traffic',
    desc: 'Gives nearby drivers a low-friction way to reach you during jams or hazards.',
    badge: 'Roadside',
    image: '/usecase_traffic.png',
  },
  {
    id: 'noparking',
    title: 'Helpful before towing',
    desc: 'Parking staff or neighbors can warn you before things escalate.',
    badge: 'Urgent alert',
    image: '/usecase_noparking.png',
  },
]

const features = [
  { label: 'No phone number printed', icon: <Shield size={16} /> },
  { label: 'Works with any camera app', icon: <QrCode size={16} /> },
  { label: 'Delivered in seconds', icon: <Zap size={16} /> },
]

const metrics = [
  { value: '142k+', label: 'alerts sent' },
  { value: '80ms', label: 'average routing latency' },
  { value: '99.98%', label: 'delivery success' },
]

export default function Home() {
  const [typedText, setTypedText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]
    let timeout

    if (!isDeleting && typedText === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 1600)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && typedText === '') {
      setIsDeleting(false)
      setPhraseIndex((current) => (current + 1) % phrases.length)
      return undefined
    }

    const nextText = isDeleting
      ? currentPhrase.slice(0, typedText.length - 1)
      : currentPhrase.slice(0, typedText.length + 1)

    timeout = setTimeout(() => {
      setTypedText(nextText)
    }, isDeleting ? 35 : 75)

    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, phraseIndex])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-slate-900 selection:bg-[var(--brand)] selection:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,119,87,0.18),_transparent_28%),radial-gradient(circle_at_80%_10%,_rgba(15,118,110,0.14),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.08),_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 atmospheric-grid opacity-60" />

      <nav className="relative z-10 border-b border-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
          <Logo />
          <div className="flex items-center gap-3 sm:gap-5">
            <a href="#how" className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 md:inline">
              How it works
            </a>
            <a href="#usecases" className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 md:inline">
              Use cases
            </a>
            <Link href="/shop" className="hidden rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white sm:inline-flex">
              Shop stickers
            </Link>
            <Link href="/login" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Sign in
            </Link>
            <Link href="/register" className="btn-primary rounded-full px-4 py-2.5 text-sm">
              Get started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-12 md:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand-deep)] shadow-sm">
              <Sparkles size={14} />
              Private driver contact for real roadside moments
            </div>

            <div className="space-y-5">
              <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
                Reach the driver without exposing their number.
              </h1>
              <div className="hero-typing-wrap">
                <span className="hero-typing-measure">{widestPhrase}</span>
                <span className="hero-typing-text">{typedText}</span>
                <span className="hero-caret" aria-hidden="true" />
              </div>
              <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                CarPing turns a sticker into a secure contact route. Nearby people can warn you about blocked exits,
                headlights, towing risks, or damage in a few taps.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="btn-primary px-7 py-4 text-sm font-semibold">
                Create your sticker <ArrowRight size={16} />
              </Link>
              <Link href="/shop" className="rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
                Explore designs
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
                >
                  <span className="text-[var(--brand-deep)]">{feature.icon}</span>
                  {feature.label}
                </div>
              ))}
            </div>

            <div className="grid gap-4 border-t border-slate-200/80 pt-6 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
                  <p className="font-display text-3xl font-bold tracking-[-0.04em] text-slate-950">{metric.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-x-10 top-10 h-40 rounded-full bg-[var(--brand-soft)] blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.88),rgba(255,248,244,0.94))] p-5 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
              <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-deep)]">CarPing route</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Anonymous owner alert</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <QrCode size={22} />
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Driver card</p>
                  <div className="mt-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-3xl font-bold tracking-[-0.04em]">Need to reach me?</p>
                      <p className="mt-3 max-w-[14rem] text-sm leading-6 text-white/70">
                        Scan the sticker and choose a reason. CarPing handles the private delivery.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-3 text-slate-900 shadow-xl">
                      <QrCode size={78} strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Status</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-300" />
                        ready to scan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Live alert preview</p>
                    <div className="mt-4 rounded-2xl bg-[var(--panel)] p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand-deep)]">
                          <AlertTriangle size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Blocked driveway</p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">A nearby driver is trying to leave. Tap to review and respond.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Why owners choose it</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        <Mail size={16} className="text-[var(--brand-deep)]" />
                        Email-based delivery by default
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        <ShieldCheck size={16} className="text-[var(--brand-deep)]" />
                        Personal contact details stay hidden
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-deep)]">How it works</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Three quick steps from scan to solved.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            The scanner gets a simple flow, and you stay protected behind a secure delivery layer.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isActive = activeStep === index

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`w-full rounded-[1.75rem] border p-6 text-left transition ${
                    isActive
                      ? 'border-[var(--brand)] bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)]'
                      : 'border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      isActive ? 'bg-[var(--brand)] text-white' : 'bg-[var(--panel)] text-[var(--brand-deep)]'
                    }`}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold tracking-[0.18em] text-slate-400">{step.num}</span>
                        <h3 className="font-display text-xl font-bold text-slate-950">{step.title}</h3>
                      </div>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="relative mx-auto w-full max-w-[320px]">
            <div className="absolute -inset-8 rounded-full bg-[var(--brand-soft)] blur-3xl" />
            <div className="relative rounded-[3rem] border-[10px] border-slate-950 bg-slate-950 p-3 shadow-[0_35px_70px_rgba(15,23,42,0.24)]">
              <div className="absolute left-1/2 top-3 z-10 h-5 w-28 -translate-x-1/2 rounded-full bg-slate-900" />
              <div className="min-h-[620px] rounded-[2.3rem] bg-[linear-gradient(180deg,#fffdf9,#f7f4ef)] px-5 pb-5 pt-10">
                <div className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mx-auto flex h-8 w-20 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-800">
                    CarPing
                  </div>
                  <h4 className="mt-4 text-center text-sm font-bold text-slate-900">{steps[activeStep].screenTitle}</h4>
                  <p className="mt-1 text-center text-[11px] text-slate-500">{steps[activeStep].screenSubtitle}</p>
                  <div className="mt-5">{steps[activeStep].screenMock}</div>
                </div>

                <div className="mt-4 rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Secure route</p>
                  <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-white">
                    <span className="text-xs font-medium text-white/70">Encrypted delivery active</span>
                    <ShieldCheck size={16} className="text-[#f59e0b]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="usecases" className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-deep)]">Use cases</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Built for everyday parking and roadside friction.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            The sticker needs to feel clean on the car and practical when something urgent happens.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {usecases.map((usecase) => (
            <article
              key={usecase.id}
              className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={usecase.image}
                  alt={usecase.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand-deep)] shadow-sm">
                  {usecase.badge}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-bold text-slate-950">{usecase.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{usecase.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-4 md:px-8">
        <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(28,37,54,0.94))] px-6 py-10 text-white shadow-[0_30px_70px_rgba(15,23,42,0.2)] sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f8b47a]">Ready to deploy</p>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
                Put a better contact layer on your vehicle.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/72">
                Set up a secure sticker, link it once, and let CarPing handle the awkward roadside moments for you.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d97757] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c96b4b]">
                Start now <ArrowRight size={16} />
              </Link>
              <Link href="/shop" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5">
                See sticker styles
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/70 px-6 py-10 text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row md:px-2">
          <Logo />
          <p className="text-sm text-slate-500">© 2026 CarPing. Private vehicle contact, designed for real-world urgency.</p>
        </div>
      </footer>

      <HelpChatbot />
    </div>
  )
}
