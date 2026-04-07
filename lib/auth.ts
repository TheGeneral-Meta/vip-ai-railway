import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from '@supabase/supabase-js'

// Inisialisasi Supabase client untuk backend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // WAJIB pakai service_role key!
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
        let { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, name, quota, plan')
          .eq('id', authData.user.id)
          .single()

        // Jika user belum ada di tabel users, buat baru
        if (userError && userError.code === 'PGRST116') {
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: authData.user.email!,
              name: authData.user.user_metadata?.name || '',
              quota: 50,
              plan: 'free'
            })
            .select()
            .single()

          if (insertError) {
            console.error("Insert error:", insertError)
            throw new Error("Gagal menyimpan data user")
          }
          userData = newUser
        } else if (userError) {
          console.error("Select error:", userError)
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
