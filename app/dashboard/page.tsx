'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="text-center p-10">Loading...</div>
  }

  if (!session?.user) {
    return null
  }

  const { user } = session

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <div className="space-y-4">
            <div className="border-b pb-3">
              <p className="text-gray-500 text-sm">ID User</p>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
            
            <div className="border-b pb-3">
              <p className="text-gray-500 text-sm">Nama</p>
              <p className="font-semibold">{user.name}</p>
            </div>
            
            <div className="border-b pb-3">
              <p className="text-gray-500 text-sm">Email</p>
              <p>{user.email}</p>
            </div>
            
            <div className="border-b pb-3">
              <p className="text-gray-500 text-sm">Kuota</p>
              <p className="text-xl font-bold text-blue-600">{user.quota} / 50</p>
            </div>
            
            <div className="border-b pb-3">
              <p className="text-gray-500 text-sm">Paket</p>
              <p className="capitalize">{user.plan}</p>
            </div>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="mt-8 w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
