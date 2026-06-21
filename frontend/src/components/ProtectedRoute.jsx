"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children, admin = false }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')

    if (!token) {
      router.replace('/login')
    } else if (admin && user?.role !== 'admin') {
      router.replace('/dashboard')
    } else {
      setAuthorized(true)
    }
  }, [router, admin])

  if (!authorized) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-cyan-600 font-mono text-sm tracking-widest uppercase animate-pulse">Authorizing…</div>
  }

  return children
}
