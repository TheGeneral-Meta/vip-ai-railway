import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from '@supabase/supabase-js'

// Inisialisasi Supabase client untuk backend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // WAJIB service_role key!
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

        // STEP 1: Login ke Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (authError || !authData.user) {
          console.error("Auth error:", authError)
          throw new Error("Email atau password salah")
        }

        // STEP 2: Ambil data user dari tabel 'users' berdasarkan ID dari Auth
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, name, quota, plan, created_at')
          .eq('id', authData.user.id)
          .single()

        if (userError) {
          console.error("Error mengambil data user:", userError)
          
          // Jika user belum ada di tabel users (fallback)
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: authData.user.email!,
              name: authData.user.user_metadata?.name || authData.user.email,
              quota: 50,
              plan: 'free'
            })
            .select('id, email, name, quota, plan, created_at')
            .single()

          if (insertError) {
            console.error("Error membuat user:", insertError)
            throw new Error("Gagal mengambil data user")
          }

          // Return data user yang baru dibuat
          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            quota: newUser.quota,
            plan: newUser.plan,
            created_at: newUser.created_at,
          }
        }

        // STEP 3: Return data user lengkap untuk session
        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          quota: userData.quota,
          plan: userData.plan,
          created_at: userData.created_at,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Saat pertama kali login, simpan data user ke token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.quota = user.quota
        token.plan = user.plan
        token.created_at = user.created_at
      }
      return token
    },
    async session({ session, token }) {
      // Kirim data user dari token ke session
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.quota = token.quota as number
        session.user.plan = token.plan as string
        session.user.created_at = token.created_at as string
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
