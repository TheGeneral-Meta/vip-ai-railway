'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          VIP AI
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/pricing" className="hover:text-blue-600 transition">Harga</Link>
          
          {session ? (
            <>
              <Link href="/chat" className="hover:text-blue-600 transition">Chat</Link>
              <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
              {session.user?.email === 'admin@example.com' && (
                <Link href="/admin" className="hover:text-blue-600 transition">Admin</Link>
              )}
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600 transition">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
