import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import Stripe from 'stripe'

import { Button } from '@/components/ui/button'
import { getOrderById } from '@/actions/orderAction'
import { updateInventoryAfterPurchase } from '@/actions/updateInventory'
import ReferralCompletionHandler from '@/components/referral/ReferralCompletionHandler'
import { updateOrderToPaid } from '@/actions/orderAction'
import PaymentSuccessClient from './payment-success-client'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function SuccessPage(props: {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ payment_intent: string }>
}) {
  const params = await props.params

  const { id } = params

  const searchParams = await props.searchParams
  const order = await getOrderById(id)
  if (!order) notFound()

  const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent)
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  )
    return notFound()

  const isSuccess = paymentIntent.status === 'succeeded'
  if (!isSuccess) return redirect(`/checkout/${id}`)

  // Update order to paid status to trigger loyalty points award
  await updateOrderToPaid(id)

  // Update inventory after successful payment
  if (order.items && order.items.length > 0) {
    const inventoryItems = order.items.map((item) => ({
      product: String(typeof item.product === 'number' ? item.product : item.product.id),
      quantity: item.quantity,
    }))
    await updateInventoryAfterPurchase(inventoryItems)
  }

  return <PaymentSuccessClient orderId={id} />
}
