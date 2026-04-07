import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('quota, plan')
      .eq('email', session.user.email)
      .single()

    return Response.json({ quota: user?.quota || 0, plan: user?.plan || 'free' })
  } catch (error) {
    return Response.json({ error: 'Failed to get usage' }, { status: 500 })
  }
}
