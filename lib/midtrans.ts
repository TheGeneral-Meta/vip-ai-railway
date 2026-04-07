import midtransClient from 'midtrans-client'

export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})

export async function createPayment(orderId: string, amount: number, userEmail: string, userName: string) {
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      first_name: userName || userEmail,
      email: userEmail,
    },
    item_details: [
      {
        id: 'premium-plan',
        price: amount,
        quantity: 1,
        name: 'VIP AI Premium Plan',
      },
    ],
  }

  const transaction = await snap.createTransaction(parameter)
  return transaction.redirect_url
}
