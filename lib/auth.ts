import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from '@supabase/supabase-js'

// ✅ WAJIB: Gunakan SERVICE_ROLE_KEY, BUKAN anon key!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // <-- INI YANG BENAR!
)

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi")
        }

        // Login ke Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (authError || !authData.user) {
          console.error("Auth error:", authError)
          throw new Error("Email atau password salah")
        }

        // Ambil data user dari tabel 'users'
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, name, quota, plan')
          .eq('id', authData.user.id)
          .single()

        if (userError) {
          console.error("User data error:", userError)
          throw new Error("Gagal mengambil data user")
        }

        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          quota: userData.quota,
          plan: userData.plan,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.quota = user.quota
        token.plan = user.plan
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.quota = token.quota as number
        session.user.plan = token.plan as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
