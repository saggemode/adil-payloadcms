'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { formatError } from '@/utilities/generateId'
import { Order } from '@/payload-types'

interface CashOnDeliveryPaymentProps {
  order: Order
}

export default function CashOnDeliveryPayment({ order }: CashOnDeliveryPaymentProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCodRedirect = () => {
    setIsLoading(true)
    try {
      router.push(`/account/orders/${order.id.toString()}`)
    } catch (error) {
      toast({
        description: formatError(error),
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="text-lg font-semibold">Cash on Delivery</div>
          <p className="text-gray-600">
            Pay with cash when your order is delivered to your doorstep.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
            <li>No advance payment required</li>
            <li>Pay in cash at the time of delivery</li>
            <li>Please ensure you have the exact amount ready</li>
          </ul>
          <Button
            className="w-full rounded-full flex items-center justify-center gap-2"
            onClick={handleCodRedirect}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                Processing...
              </>
            ) : (
              'Confirm Order'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
