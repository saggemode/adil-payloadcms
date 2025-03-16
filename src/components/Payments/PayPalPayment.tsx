'use client'

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import { useToast } from '@/hooks/use-toast'
import { approvePayPalOrder, createPayPalOrder } from '@/actions/orderAction'
import { formatError } from '@/utilities/generateId'
import { Order } from '@/payload-types'
import { useState } from 'react'

interface PayPalPaymentProps {
  order: Order
  paypalClientId: string
}

export default function PayPalPayment({ order, paypalClientId }: PayPalPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
    let status = ''
    if (isPending) {
      status = 'Loading PayPal...'
    } else if (isRejected) {
      status = 'Error in loading PayPal.'
    }
    return <div className="text-sm text-gray-500">{status}</div>
  }

  const handleCreateOrder = async () => {
    setIsLoading(true)
    try {
      const res = await createPayPalOrder(order.id.toString())
      if (!res.success) {
        toast({
          description: res.message,
          variant: 'destructive',
        })
        return null
      }
      return res.data
    } catch (error) {
      toast({
        description: formatError(error),
        variant: 'destructive',
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveOrder = async (data: { orderID: string }) => {
    setIsLoading(true)
    try {
      const res = await approvePayPalOrder(order.id.toString(), data)
      toast({
        description: res.message,
        variant: res.success ? 'default' : 'destructive',
      })
    } catch (error) {
      toast({
        description: formatError(error),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <span className="animate-spin border-2 border-primary border-t-transparent rounded-full w-6 h-6 mr-2"></span>
          Processing payment...
        </div>
      ) : (
        <PayPalScriptProvider options={{ clientId: paypalClientId }}>
          <PrintLoadingState />
          <PayPalButtons
            createOrder={handleCreateOrder}
            onApprove={handleApproveOrder}
            disabled={isLoading}
          />
        </PayPalScriptProvider>
      )}
    </div>
  )
}
