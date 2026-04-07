'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function PaymentContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h1>
          <p className="text-gray-600 mb-6">Paket premium Anda sudah aktif. Selamat menikmati layanan unlimited!</p>
          <Link href="/chat" className="bg-blue-600 text-white px-6 py-3 rounded-xl inline-block">
            Mulai Chat
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-2">Pembayaran Gagal</h1>
          <p className="text-gray-600 mb-6">Silakan coba lagi atau hubungi support.</p>
          <Link href="/pricing" className="bg-blue-600 text-white px-6 py-3 rounded-xl inline-block">
            Coba Lagi
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        <div className="text-6xl mb-4">💳</div>
        <h1 className="text-2xl font-bold mb-2">Memproses Pembayaran...</h1>
        <p className="text-gray-600">Harap tunggu, Anda akan diarahkan ke halaman pembayaran.</p>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  )
}
