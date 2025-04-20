import { notFound } from 'next/navigation'
import React from 'react'
import Stripe from 'stripe'
import { getMeUser } from '@/utilities/getMeUser'
import PaymentForm from './payment-form'
import { getOrderById } from '@/actions/orderAction'

export const metadata = {
  title: 'Payment',
}

const CheckoutPaymentPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const { user } = await getMeUser()

  let client_secret: string | null = null
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100),
        currency: 'USD',
        payment_method_types: ['card'],
        metadata: { 
          orderId: order.id,
          customerEmail: user?.email || 'guest@example.com'
        },
      });
      
      client_secret = paymentIntent.client_secret;
      console.log("Created payment intent with ID:", paymentIntent.id);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      // Continue without setting client_secret
    }
  }

  // Check if the user has the 'admin' role
  const isAdmin = user?.roles?.includes('admin') || false

  return (
    <PaymentForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      clientSecret={client_secret}
      isAdmin={isAdmin}
    />
  )
}

export default CheckoutPaymentPage







// import { notFound } from 'next/navigation'
// import React from 'react'
// import PaymentWrapper from './payment-wrapper'
// import { getMeUser } from '@/utilities/getMeUser'

// export const metadata = {
//   title: 'Payment',
// }

// const CheckoutPaymentPage = async (props: {
//   params: Promise<{
//     id: string
//   }>
// }) => {
//   const params = await props.params
//   const { id } = params
//   const { user } = await getMeUser()
//   const isAdmin = user?.roles?.includes('admin') || false

//   return (
//     <PaymentWrapper
//       orderId={id}
//       paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
//       isAdmin={isAdmin}
//     />
//   )
// }

// export default CheckoutPaymentPage
