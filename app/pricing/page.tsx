'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: string, price: number) => {
    if (!session) {
      router.push('/login')
      return
    }

    setLoading(plan)
    try {
      const res = await fetch('/api/webhook/midtrans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, price })
      })
      
      const data = await res.json()
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        alert('Gagal membuat pembayaran')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    }
    setLoading(null)
  }

  const plans = [
    {
      name: 'Free',
      price: 0,
      quota: '50 chat/hari',
      features: ['Akses DeepSeek AI', '50 chat per hari', 'Support basic']
    },
    {
      name: 'Premium',
      price: 50000,
      quota: 'Unlimited',
      features: ['Akses DeepSeek AI', 'Unlimited chat', 'Response prioritas', 'Support 24/7'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 200000,
      quota: 'Unlimited',
      features: ['Semua fitur Premium', 'API Access', 'Dedicated support', 'Custom model']
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Pilih Paket Terbaik</h1>
      <p className="text-center text-gray-600 mb-12">Mulai dari Rp 50.000/bulan • Cancel anytime</p>
      
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-2xl shadow-xl p-6 relative ${
              plan.popular ? 'border-2 border-blue-500' : ''
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                Populer
              </span>
            )}
            
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-4xl font-bold mb-4">
              {plan.price === 0 ? 'GRATIS' : `Rp ${plan.price.toLocaleString()}`}
              {plan.price > 0 && <span className="text-sm font-normal">/bulan</span>}
            </p>
            <p className="text-gray-500 mb-4">{plan.quota}</p>
            
            <ul className="mb-6 space-y-2">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleSubscribe(plan.name.toLowerCase(), plan.price)}
              disabled={loading === plan.name.toLowerCase() || plan.price === 0}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                plan.price === 0
                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading === plan.name.toLowerCase() ? 'Memproses...' : plan.price === 0 ? 'Aktif' : 'Langganan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
