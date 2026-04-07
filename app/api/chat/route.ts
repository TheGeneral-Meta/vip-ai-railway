import { generateAIResponse } from '@/lib/ai'
import { supabaseAdmin } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.quota <= 0 && user.plan === 'free') {
      return Response.json(
        { error: 'Quota habis. Upgrade ke premium untuk unlimited chat', needsUpgrade: true },
        { status: 403 }
      )
    }

    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content || 'Halo'

    const aiResponse = await generateAIResponse(lastMessage)

    if (user.plan === 'free') {
      await supabaseAdmin
        .from('users')
        .update({ quota: user.quota - 1 })
        .eq('id', user.id)
    }

    await supabaseAdmin.from('chat_history').insert({
      user_id: user.id,
      messages: [...messages, { role: 'assistant', content: aiResponse }],
    })

    return Response.json({ text: aiResponse })
  } catch (error: any) {
    console.error('CHAT API ERROR:', error)
    return Response.json({ error: error.message || 'Failed to process chat' }, { status: 500 })
  }
}
