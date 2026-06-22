"use client"
import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import { api } from '../lib/api'

export default function HelpChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your CarPing Assistant. Ask me anything about our smart stickers, prices, setup steps, or security features!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const chatHistory = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
      const { data } = await api.post('/public/chatbot', { messages: chatHistory })
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an issue connecting to my backend. Please try again in a moment.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-650 text-white shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <span className="absolute -inset-1 rounded-full bg-cyan-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquare size={22} className="relative z-10" />
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex h-[480px] w-[340px] sm:w-[380px] flex-col rounded-3xl border border-slate-100 bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-200/80 animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Bot size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-bold text-slate-150">CarPing Support</h3>
                  <Sparkles size={11} className="text-cyan-400" />
                </div>
                <p className="text-[10px] text-slate-400">Powered by Groq Llama 3</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-cyan-400' 
                    : 'bg-cyan-50 text-cyan-600 border border-cyan-100'
                }`}>
                  {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                </div>

                {/* Bubble */}
                <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100">
                  <Bot size={13} />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-white border border-slate-100 px-4 py-3 text-slate-400 shadow-sm rounded-tl-none">
                  <Loader2 size={12} className="animate-spin text-cyan-600" />
                  <span className="text-[10px] font-medium tracking-wide">Thinking…</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="border-t border-slate-100 bg-white p-3 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about stickers, setup, custom styles..."
              className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500/50 focus:bg-white transition"
              maxLength={200}
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-900 text-cyan-400 hover:bg-slate-850 hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:scale-100"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
