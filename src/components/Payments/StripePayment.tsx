'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Order } from '@/payload-types'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'

interface StripePaymentFormProps {
  priceInCents: number
  orderId: string
}

const StripePaymentForm = ({ priceInCents, orderId }: StripePaymentFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/${orderId}/stripe-payment-success`,
        },
      })

      if (error) {
        toast({
          description: error.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        description: 'An error occurred while processing your payment.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isLoading} className="w-full mt-4 rounded-full">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
            Processing...
          </div>
        ) : (
          `Pay ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(priceInCents / 100)}`
        )}
      </Button>
    </form>
  )
}

interface StripePaymentProps {
  order: Order
  clientSecret: string
}

export default function StripePayment({ order, clientSecret }: StripePaymentProps) {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

  return (
    <Card className="p-4">
      <Elements
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
          },
        }}
        stripe={stripePromise}
      >
        <StripePaymentForm
          priceInCents={Math.round(order.totalPrice * 100)}
          orderId={order.id.toString()}
        />
      </Elements>
    </Card>
  )
}
