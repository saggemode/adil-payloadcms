'use client'

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { approvePayPalOrder, createPayPalOrder } from '@/actions/orderAction'
import { formatError } from '@/utilities/generateId'

import CheckoutFooter from '../checkout-footer'
import { redirect, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripeForm from './stripe-form'
import ProductPrice from '@/components/ProductArchive/Price'
import { formatDateTime2 } from '@/utilities/generateId'

import { Order } from '@/payload-types'
import { useState } from 'react'

export default function OrderPaymentForm({
  order,
  paypalClientId,
  clientSecret,
}: {
  order: Order
  paypalClientId: string
  isAdmin: boolean
  clientSecret: string | null
}) {
  const router = useRouter()
  const [isPaypalLoading, setIsPaypalLoading] = useState(false)
  const [isCodLoading, setIsCodLoading] = useState(false)
  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    expectedDeliveryDate,
    isPaid,
  } = order
  const { toast } = useToast()

  if (isPaid) {
    redirect(`/account/orders/${order.id}`)
  }
  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
    let status = ''
    if (isPending) {
      status = 'Loading PayPal...'
    } else if (isRejected) {
      status = 'Error in loading PayPal.'
    }
    return status
  }
  const handleCreatePayPalOrder = async () => {
    setIsPaypalLoading(true)
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
      setIsPaypalLoading(false)
    }
  }
  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    setIsPaypalLoading(true)
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
      setIsPaypalLoading(false)
    }
  }

  const handleCodRedirect = () => {
    setIsCodLoading(true)
    try {
      router.push(`/account/orders/${order.id.toString()}`)
    } catch (error) {
      toast({
        description: formatError(error),
        variant: 'destructive',
      })
      setIsCodLoading(false)
    }
  }

  const CheckoutSummary = () => (
    <Card>
      <CardContent className="p-4">
        <div>
          <div className="text-lg font-bold">Order Summary</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items:</span>
              <span>
                {' '}
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping & Handling:</span>
              <span>
                {shippingPrice === undefined ? (
                  '--'
                ) : shippingPrice === 0 ? (
                  'FREE'
                ) : (
                  <ProductPrice price={shippingPrice} plain />
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span> Tax:</span>
              <span>{taxPrice === undefined ? '--' : <ProductPrice price={taxPrice} plain />}</span>
            </div>
            <div className="flex justify-between  pt-1 font-bold text-lg">
              <span> Order Total:</span>
              <span>
                {' '}
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>

            {!isPaid && paymentMethod === 'PayPal' && (
              <div>
                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                  {isPaypalLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <span className="animate-spin border-2 border-primary border-t-transparent rounded-full w-6 h-6 mr-2"></span>
                      Processing payment...
                    </div>
                  ) : (
                    <>
                      <PrintLoadingState />
                      <PayPalButtons
                        createOrder={handleCreatePayPalOrder}
                        onApprove={handleApprovePayPalOrder}
                        disabled={isPaypalLoading}
                      />
                    </>
                  )}
                </PayPalScriptProvider>
              </div>
            )}
            {!isPaid && paymentMethod === 'Stripe' && clientSecret && (
              <Elements
                options={{
                  clientSecret,
                }}
                stripe={stripePromise}
              >
                <StripeForm
                  priceInCents={Math.round(order.totalPrice * 100)}
                  orderId={order.id.toString()}
                />
              </Elements>
            )}

            {!isPaid && paymentMethod === 'Cash On Delivery' && (
              <Button
                className="w-full rounded-full flex items-center justify-center gap-2"
                onClick={handleCodRedirect}
                disabled={isCodLoading}
              >
                {isCodLoading ? (
                  <>
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                    Processing...
                  </>
                ) : (
                  'View Order'
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

  return (
    <main className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          {/* Shipping Address */}
          <div>
            <div className="grid md:grid-cols-3 my-3 pb-3">
              <div className="text-lg font-bold">
                <span>Shipping Address</span>
              </div>
              <div className="col-span-2">
                <p>
                  {shippingAddress.fullName} <br />
                  {shippingAddress.street} <br />
                  {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                </p>
              </div>
            </div>
          </div>

          {/* payment method */}
          <div className="border-y">
            <div className="grid md:grid-cols-3 my-3 pb-3">
              <div className="text-lg font-bold">
                <span>Payment Method</span>
              </div>
              <div className="col-span-2">
                <p>{paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 my-3 pb-3">
            <div className="flex text-lg font-bold">
              <span>Items and shipping</span>
            </div>
            <div className="col-span-2">
              <p>
                Delivery date:
                {formatDateTime2(new Date(expectedDeliveryDate)).dateOnly}
              </p>
              <ul>
                {items?.map((item) => (
                  <li key={item.slug}>
                    {item.name} x {item.quantity} = {item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="block md:hidden">
            <CheckoutSummary />
          </div>

          <CheckoutFooter />
        </div>
        <div className="hidden md:block">
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}
