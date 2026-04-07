'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ totalUsers: 0, premiumUsers: 0, totalRevenue: 0 })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.email === 'admin@example.com') {
      loadData()
    }
  }, [session])

  async function loadData() {
    const { data: usersData } = await supabase.from('users').select('*')
    setUsers(usersData || [])

    const { data: paymentsData } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'success')

    const totalRevenue = paymentsData?.reduce((sum, p) => sum + p.amount, 0) || 0
    const premiumUsers = usersData?.filter(u => u.plan !== 'free').length || 0

    setStats({
      totalUsers: usersData?.length || 0,
      premiumUsers,
      totalRevenue
    })
  }

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>
  }

  if (session?.user?.email !== 'admin@example.com') {
    return <div className="p-8 text-center">Access Denied</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-gray-500">Total Users</h3>
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-gray-500">Premium Users</h3>
          <p className="text-4xl font-bold">{stats.premiumUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-gray-500">Total Revenue</h3>
          <p className="text-4xl font-bold">Rp {stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Quota</th>
              <th className="p-3 text-left">Registered</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.name || '-'}</td>
                <td className="p-3 capitalize">{user.plan}</td>
                <td className="p-3">{user.quota}</td>
                <td className="p-3">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
