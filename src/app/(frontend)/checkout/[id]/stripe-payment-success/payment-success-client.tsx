'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ReferralCompletionHandler from '@/components/referral/ReferralCompletionHandler'
import { useNotifications } from '@/contexts/NotificationContext'

export default function PaymentSuccessClient({ orderId }: { orderId: string }) {
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Show success notification when component mounts
    addNotification({
      type: 'success',
      message: `Payment successful! Your order #${orderId} has been confirmed.`
    })
  }, [orderId, addNotification])

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center ">
        <h1 className="font-bold text-2xl lg:text-3xl">Thanks for your purchase</h1>
        <div>We are now processing your order.</div>
        <Button asChild>
          <Link href={`/account/orders/${orderId}`}>View order</Link>
        </Button>
      </div>
      
      <ReferralCompletionHandler orderId={orderId} />
    </div>
  )
} 