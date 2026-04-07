'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Check Supabase availability
    if (!isSupabaseAvailable()) {
      setError('Database tidak tersedia. Silakan coba lagi nanti.')
      setLoading(false)
      return
    }

    try {
      // Cek email sudah terdaftar
      const { data: existing, error: checkError } = await supabase!
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existing) {
        setError('Email sudah terdaftar')
        setLoading(false)
        return
      }

      // Register user
      const { error: insertError } = await supabase!
        .from('users')
        .insert({
          email,
          name,
          quota: 50,
          plan: 'free',
        })

      if (insertError) {
        setError('Gagal mendaftar: ' + insertError.message)
      } else {
        router.push('/login?registered=true')
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      setError('Gagal mendaftar: ' + (err.message || 'Unknown error'))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Daftar Akun</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
