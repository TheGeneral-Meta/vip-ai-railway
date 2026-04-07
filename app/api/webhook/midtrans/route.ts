import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { snap } from '@/lib/midtrans'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan, price } = await req.json()

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const orderId = `ORDER-${user.id}-${Date.now()}`

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price,
      },
      customer_details: {
        first_name: user.name || user.email,
        email: user.email,
      },
      item_details: [
        {
          id: plan,
          price: price,
          quantity: 1,
          name: `Paket ${plan.toUpperCase()} VIP AI`,
        },
      ],
    }

    const transaction = await snap.createTransaction(parameter)

    await supabaseAdmin.from('payments').insert({
      user_id: user.id,
      amount: price,
      plan: plan,
      status: 'pending',
      transaction_id: orderId,
    })

    return Response.json({ paymentUrl: transaction.redirect_url })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Payment failed' }, { status: 500 })
  }
}
