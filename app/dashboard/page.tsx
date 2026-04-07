'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [chatHistory, setChatHistory] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.email) {
      loadUserData()
      loadChatHistory()
    }
  }, [session])

  async function loadUserData() {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', session?.user?.email)
      .single()
    setUserData(data)
  }

  async function loadChatHistory() {
    const { data } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', session?.user?.id)
      .order('created_at', { ascending: false })
      .limit(10)
    setChatHistory(data || [])
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!userData) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-gray-500 text-sm">Sisa Quota Hari Ini</h3>
          <p className="text-4xl font-bold">{userData.quota}</p>
          <p className="text-xs text-gray-400 mt-2">Reset setiap jam 00:00</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-gray-500 text-sm">Paket Aktif</h3>
          <p className="text-2xl font-bold capitalize">{userData.plan}</p>
          {userData.plan === 'free' && (
            <Link href="/pricing" className="text-blue-600 text-sm hover:underline">
              Upgrade Sekarang →
            </Link>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-gray-500 text-sm">Total Chat</h3>
          <p className="text-4xl font-bold">{chatHistory.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Riwayat Chat</h2>
        {chatHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada chat. Mulai chat sekarang!</p>
        ) : (
          chatHistory.map((chat) => (
            <div key={chat.id} className="border-b py-3 last:border-0">
              <p className="text-sm text-gray-500">
                {new Date(chat.created_at).toLocaleString('id-ID')}
              </p>
              <p className="text-gray-700 truncate">
                {chat.messages?.[0]?.content?.substring(0, 100) || 'Chat baru'}
              </p>
            </div>
          ))
        )}
        <Link href="/chat" className="block text-center mt-4 text-blue-600 hover:underline">
          + Chat Baru
        </Link>
      </div>
    </div>
  )
}
