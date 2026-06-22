"use client"
import { useState, useEffect } from 'react'
import { ArrowRight, BellRing, Check, EyeOff, QrCode, ShieldCheck, Sparkles, Radio, Cpu, Shield, Zap, Info, Smartphone, Mail, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import Logo from '../components/Logo'
import HelpChatbot from '../components/HelpChatbot'

const steps = [
  {
    num: '01',
    title: 'Camera Scan',
    desc: 'Scanner scans the weatherproof CarPing sticker on your windscreen or bumper.',
    icon: <Smartphone className="text-cyan-600" size={24} />,
    screenTitle: 'Quick Scanner Access',
    screenSubtitle: 'Direct contact request',
    screenMock: (
      <div className="space-y-3">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scanned Node</p>
          <p className="text-sm font-black text-slate-800">Vehicle ID: CP-9831</p>
        </div>
        <div className="bg-cyan-50 text-cyan-800 text-[11px] p-2.5 rounded-lg font-medium leading-relaxed">
          🔒 Your contact details are entirely hidden from the scanner.
        </div>
      </div>
    )
  },
  {
    num: '02',
    title: 'Select Alert Type',
    desc: 'Scanner selects a preset alert template to explain the issue immediately.',
    icon: <Cpu className="text-indigo-650" size={24} />,
    screenTitle: 'Select Action',
    screenSubtitle: 'Ready template ping',
    screenMock: (
      <div className="space-y-1.5 text-left">
        <div className="bg-white border border-slate-200 p-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-between shadow-sm">
          <span>🚗 Blocking my exit</span>
          <span className="h-2 w-2 rounded-full bg-cyan-500" />
        </div>
        <div className="bg-white border border-slate-200 p-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-between shadow-sm">
          <span>💡 Headlights still ON</span>
          <span className="h-2 w-2 rounded-full bg-cyan-500" />
        </div>
        <div className="bg-white border border-slate-200 p-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-between shadow-sm">
          <span>⚠️ Flat tire detected</span>
          <span className="h-2 w-2 rounded-full bg-cyan-500" />
        </div>
      </div>
    )
  },
  {
    num: '03',
    title: 'Instant Secure Ping',
    desc: 'System sends a secure email or push notification directly to your device.',
    icon: <Radio className="text-pink-600 animate-pulse" size={24} />,
    screenTitle: 'Notification Sent',
    screenSubtitle: 'Transmission successful',
    screenMock: (
      <div className="space-y-3">
        <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto border border-green-150">
          <Check size={20} />
        </div>
        <p className="text-[11px] font-semibold text-slate-800">Owner Pinged Privately</p>
        <p className="text-[10px] text-slate-500 leading-normal">CarPing forwarded the notification to the driver securely.</p>
      </div>
    )
  }
]

const usecases = [
  {
    id: 'windscreen',
    title: 'Neat Windscreen Fit',
    desc: 'Visually clear, fits right into your dashboard glass corner.',
    badge: 'Applied on windscreen',
    image: '/usecase_windscreen.png'
  },
  {
    id: 'raining',
    title: 'IP68 Weatherproof Protection',
    desc: 'Engineered waterproof vinyl keeps scanning crystal clear even in torrential rain.',
    badge: 'Raining conditions',
    image: '/usecase_raining.png'
  },
  {
    id: 'traffic',
    title: 'Rear-Window Traffic Alert',
    desc: 'Let other drivers behind ping you during congested commuter pileups.',
    badge: 'Traffic conditions',
    image: '/usecase_traffic.png'
  },
  {
    id: 'noparking',
    title: 'Quick Tow Mitigation',
    desc: 'Gives parking marshals a secure way to alert you before writing tow tickets.',
    badge: 'No parking zones',
    image: '/usecase_noparking.png'
  }
]

export default function Home() {
  const [typedText, setTypedText] = useState('')
  const phrases = ["Blocking a Driveway?", "Left Headlights On?", "Flat Tire on Highway?", "Towed in Parking Zone?"]
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    let timer
    const currentPhrase = phrases[phraseIndex]
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(currentPhrase.substring(0, typedText.length - 1))
      }, 40)
    } else {
      timer = setTimeout(() => {
        setTypedText(currentPhrase.substring(0, typedText.length + 1))
      }, 80)
    }

    if (!isDeleting && typedText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 2500)
    } else if (isDeleting && typedText === '') {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    }

    return () => clearTimeout(timer)
  }, [typedText, isDeleting, phraseIndex])

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-800 selection:bg-cyan-500 selection:text-white relative overflow-hidden font-sans">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[700px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-100/30 via-indigo-50/20 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-cyan-100/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute inset-0 futuristic-grid opacity-25 pointer-events-none z-0" />

      {/* Navigation Header */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8 bg-white/40 backdrop-blur-md border-b border-slate-100">
        <Logo />
        <div className="flex items-center gap-3 sm:gap-6">
          <a href="#ux" className="hidden md:inline text-sm font-medium text-slate-650 hover:text-cyan-600 transition">User Experience</a>
          <a href="#usecases" className="hidden md:inline text-sm font-medium text-slate-650 hover:text-cyan-600 transition">Scenarios</a>
          <a href="#how" className="hidden md:inline text-sm font-medium text-slate-650 hover:text-cyan-600 transition">How it works</a>
          <Link href="/shop" className="hidden sm:inline text-sm font-semibold text-cyan-650 hover:text-cyan-700 transition px-2.5 py-1.5 border border-cyan-200/50 rounded-xl bg-cyan-50/30">Sticker Shop</Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 transition" href="/login">Sign in</Link>
          <Link className="btn-gold !bg-slate-900 text-white px-3.5 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-bold shadow-md shadow-slate-900/10 shrink-0" href="/register">
            Get Protected <ArrowRight size={14} className="ml-1 shrink-0" />
          </Link>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 md:px-8 lg:pt-28">
        {/* Futuristic Technical Frame */}
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 bg-white/40 p-5 sm:p-8 md:p-14 backdrop-blur-xl shadow-2xl shadow-slate-100 grid gap-10 lg:gap-14 lg:grid-cols-[1.2fr_.8fr] items-center overflow-hidden">
          {/* Decorative Blueprint Crosshairs */}
          <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-slate-300 -translate-x-1 -translate-y-1" />
          <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-slate-300 translate-x-1 -translate-y-1" />
          <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-slate-300 -translate-x-1 translate-y-1" />
          <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-slate-300 translate-x-1 translate-y-1" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] border-t border-dashed border-slate-200/50 pointer-events-none" />
          <div className="absolute top-0 left-1/3 w-[1px] h-full border-l border-dashed border-slate-200/50 pointer-events-none" />

          {/* Left Column: Tech Info & Headline */}
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/[0.04] px-4 py-1.5 text-[10px] font-extrabold tracking-widest text-cyan-600 uppercase">
              <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
              Privacy Protocol v2.4 // ONLINE
            </div>
            
            {/* Dynamic Typing Title */}
            <h1 className="font-display text-4xl font-black leading-[1.25] tracking-tight sm:text-5xl lg:text-6xl text-slate-900">
              Ping the Driver for <br />
              <span className="relative inline-flex items-center min-h-[40px] sm:min-h-[50px] lg:min-h-[60px] bg-gradient-to-r from-cyan-600 to-indigo-650 bg-clip-text text-transparent text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-1">
                {"\u200B" + typedText}
              </span>
              <span className="animate-pulse text-cyan-500 ml-1 text-3xl sm:text-4xl lg:text-5xl">|</span>
            </h1>

            <p className="max-w-xl text-base md:text-lg leading-relaxed text-slate-600">
              No phone numbers, no app installations, no registration. CarPing establishes a secure, anonymous messaging tunnel directly from your vehicle's windscreen to your device in 80ms.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row pt-2">
              <Link href="/register" className="btn-gold px-8 py-4 text-sm font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group hover:scale-[1.02] transition-transform">
                Get Your Smart Sticker <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/shop" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-8 py-4 text-sm font-semibold text-slate-700 transition shadow-sm hover:scale-[1.02]">
                Browse 10+ Custom Styles
              </Link>
            </div>

            {/* Interactive Stats Grid */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 sm:gap-6">
              <div>
                <p className="font-mono text-lg sm:text-xl md:text-2xl font-black text-slate-900">142k+</p>
                <p className="text-[8px] sm:text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1 leading-normal">Dispatched alerts</p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-xl md:text-2xl font-black text-slate-900">80ms</p>
                <p className="text-[8px] sm:text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1 leading-normal">Avg latency</p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-xl md:text-2xl font-black text-slate-900">99.98%</p>
                <p className="text-[8px] sm:text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1 leading-normal">Success rate</p>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Simulated Smart Sticker Mockup */}
          <div className="relative z-10 mx-auto w-full max-w-md lg:mr-0">
            <div className="absolute -inset-16 rounded-full bg-cyan-200/15 blur-3xl pointer-events-none" />
            <div className="glass-panel relative rotate-2 rounded-[2rem] sm:rounded-[2.2rem] p-3 sm:p-4 shadow-xl shadow-slate-200 animate-float">
              <div className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-white p-5 sm:p-8 text-slate-800 border border-slate-100 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
                
                {/* Product Header */}
                <div className="mb-4 sm:mb-6 flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="font-mono text-[8px] tracking-widest text-slate-400 uppercase">MODEL.CP-01 // PRV-SYS</span>
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                </div>

                <div className="flex items-center justify-between gap-3 sm:gap-4 flex-nowrap">
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600 truncate">Privacy Active</p>
                    <p className="mt-1 font-display text-2xl sm:text-3xl font-black text-slate-950 leading-none">CarPing</p>
                  </div>
                  <div className="p-1.5 sm:p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                    <QrCode size={48} className="text-slate-800 sm:w-[56px] sm:h-[56px]" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="my-5 sm:my-8 h-[1px] bg-slate-100" />
                <p className="font-display text-xl sm:text-2xl font-bold leading-tight text-slate-900">
                  Need to contact <br />
                  the driver?
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Scan the secure QR. Inform them of parking alerts or headlights instantly.
                </p>
                <div className="mt-6 sm:mt-8 flex items-center justify-between rounded-xl bg-slate-900 border border-slate-950 px-4 py-3 text-white">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400">SCAN • PIN • RESOLVE</span>
                  <ShieldCheck size={18} className="text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive User Experience Section */}
      <section id="ux" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-8 border-t border-slate-100">
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-600">User Experience Flow</p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl text-slate-900">
            Frictionless scan routing, <span className="bg-gradient-to-r from-cyan-600 to-indigo-650 bg-clip-text text-transparent">zero registration</span> for scanner.
          </h2>
          <p className="mt-4 text-base text-slate-650 leading-relaxed">
            Strangers do not need to register accounts, download apps, or login to reach you. They simply scan and select options instantly.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Steps List (Left) */}
          <div className="space-y-6">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx
              return (
                <div 
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 border flex items-start gap-4 ${
                    isActive 
                      ? 'bg-white border-cyan-400 shadow-md shadow-cyan-500/[0.04]' 
                      : 'bg-white/50 border-slate-100 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <span className={`grid h-10 w-10 place-items-center rounded-xl shrink-0 ${
                    isActive ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {step.icon}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{step.num}</span> {step.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Interactive Phone Mockup (Right) */}
          <div className="relative mx-auto w-full max-w-[280px]">
            <div className="absolute -inset-10 rounded-full bg-cyan-200/10 blur-2xl pointer-events-none" />
            
            {/* Phone Shell */}
            <div className="w-full aspect-[9/18.5] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800 relative">
              {/* Speaker Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-10 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Phone Content Screen */}
              <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden pt-8 px-4 flex flex-col justify-between pb-4 border border-slate-900">
                <div className="text-center pt-2">
                  <div className="h-6 w-16 bg-slate-100 rounded-md mx-auto mb-3 flex items-center justify-center">
                    <span className="text-[9px] font-black text-slate-800">CarPing</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-905">{steps[activeStep].screenTitle}</h4>
                  <p className="text-[8px] text-slate-400 mt-0.5">{steps[activeStep].screenSubtitle}</p>
                  
                  <div className="my-5">
                    {steps[activeStep].screenMock}
                  </div>
                </div>

                <div className="mt-auto space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center text-[7px] text-slate-400">
                    <span>Protocol: CarPing Secure Gate</span>
                    <span>SSL Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadside Scenarios Section */}
      <section id="usecases" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-8 border-t border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-600">Engineered for the Road</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            Made for Real-World Scenarios
          </h2>
          <p className="mt-4 text-base text-slate-650">
            Whether parked in tight city quarters, commuting, or caught in heavy rain, CarPing ensures contact.
          </p>
        </div>

        {/* Usecase Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {usecases.map((usecase) => (
            <div key={usecase.id} className="glass-panel rounded-3xl overflow-hidden border border-slate-100 flex flex-col justify-between shadow-sm group hover:border-cyan-400/40 transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900 border-b border-slate-100 flex items-center justify-center p-1">
                <img 
                  src={usecase.image} 
                  alt={usecase.title} 
                  className="w-full h-full object-cover rounded-t-2xl transition duration-500 group-hover:scale-105" 
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-cyan-600 px-2 py-0.5 rounded border border-slate-100">
                  {usecase.badge}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-slate-900 text-base group-hover:text-cyan-600 transition-colors">
                  {usecase.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {usecase.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works / System Setup */}
      <section id="how" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-8 border-t border-slate-100">
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-600">Quick Deployment</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            Frictionless Setup & Verification.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-100">
            <span className="font-mono text-xs font-black text-cyan-500">01</span>
            <h3 className="mt-6 sm:mt-10 font-display text-lg font-bold text-slate-900">Deploy Sticker</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Affix your sleek weather-sealed QR code sticker to any vehicle window or windshield.
            </p>
          </div>
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-100">
            <span className="font-mono text-xs font-black text-cyan-500">02</span>
            <h3 className="mt-6 sm:mt-10 font-display text-lg font-bold text-slate-900">Link Instantly</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Scan once to bind the sticker to your account. No complex installation required.
            </p>
          </div>
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-100">
            <span className="font-mono text-xs font-black text-cyan-500">03</span>
            <h3 className="mt-6 sm:mt-10 font-display text-lg font-bold text-slate-900">Receive Alerts</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Strangers trigger alerts instantly when scanning. Forwarded securely via email.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-100 bg-[#f9fafb] px-6 py-12 text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row px-2">
          <Logo />
          <p className="text-xs text-slate-400">
            &copy; 2026 CarPing. Secure vehicle communication framework. All rights reserved.
          </p>
        </div>
      </footer>
      <HelpChatbot />
    </div>
  )
}



