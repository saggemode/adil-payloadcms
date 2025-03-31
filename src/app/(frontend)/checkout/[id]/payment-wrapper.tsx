'use client'

import { useOrderById } from '@/hooks/useOrders'
import PaymentForm from './payment-form'
import { useEffect, useState } from 'react'
import Stripe from 'stripe'

interface PaymentWrapperProps {
  orderId: string
  paypalClientId: string
  isAdmin: boolean
}

export default function PaymentWrapper({ orderId, paypalClientId, isAdmin }: PaymentWrapperProps) {
  const { data: order, isLoading } = useOrderById(orderId)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    const initializePayment = async () => {
      if (order?.paymentMethod === 'Stripe' && !order.isPaid) {
        const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string)
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(order.totalPrice * 100),
          currency: 'USD',
          metadata: { orderId: order.id },
        })
        setClientSecret(paymentIntent.client_secret)
      }
    }

    if (order) {
      initializePayment()
    }
  }, [order])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <PaymentForm
      order={order}
      paypalClientId={paypalClientId}
      clientSecret={clientSecret}
      isAdmin={isAdmin}
    />
  )
}
