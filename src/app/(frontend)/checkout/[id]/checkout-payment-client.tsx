'use client'

import React from 'react'
import { useOrderById } from '@/hooks/useOrders'
import PaymentForm from './payment-form'

interface CheckoutPaymentClientProps {
  orderId: string
  paypalClientId: string
  clientSecret: string | null
  isAdmin: boolean
}

const CheckoutPaymentClient: React.FC<CheckoutPaymentClientProps> = ({
  orderId,
  paypalClientId,
  clientSecret,
  isAdmin,
}) => {
  const { data: order, isLoading, error } = useOrderById(orderId)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error || !order) {
    return <div>Error loading order</div>
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

export default CheckoutPaymentClient
