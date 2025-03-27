'use client'

import { useOrderById } from '@/hooks/useOrders'
import PaymentForm from './payment-form'
import { getMeUser } from '@/utilities/getMeUser'
import { useEffect, useState } from 'react'

interface PaymentWrapperProps {
  orderId: string
  paypalClientId: string
  clientSecret: string | null
}

export default function PaymentWrapper({
  orderId,
  paypalClientId,
  clientSecret,
}: PaymentWrapperProps) {
  const { data: order, isLoading, error } = useOrderById(orderId)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const { user } = await getMeUser()
      setIsAdmin(user?.roles?.includes('admin') || false)
    }
    checkAdmin()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading order</div>
  if (!order) return <div>Order not found</div>

  return (
    <PaymentForm
      order={order}
      paypalClientId={paypalClientId}
      clientSecret={clientSecret}
      isAdmin={isAdmin}
    />
  )
}
