
import { notFound, redirect } from 'next/navigation'
import Stripe from 'stripe'


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
  searchParams: Promise<{ payment_intent?: string, redirect_status?: string }>
}) {
  const params = await props.params
  const { id } = params
  const searchParams = await props.searchParams
  
  // Get the order first
  const order = await getOrderById(id)
  if (!order) notFound()
  
  // If the order is already paid, just show success
  if (order.isPaid) {
    return <PaymentSuccessClient orderId={id} />
  }
  
  // Check if payment_intent is present
  if (!searchParams.payment_intent) {
    console.error("No payment_intent found in URL parameters");
    
    // If we have a redirect_status of 'succeeded', we can still proceed
    if (searchParams.redirect_status === 'succeeded') {
      console.log("No payment_intent, but redirect_status is succeeded. Proceeding with payment confirmation.");
      await updateOrderToPaid(id);
      
      // Update inventory
      if (order.items && order.items.length > 0) {
        const inventoryItems = order.items.map((item) => ({
          product: String(typeof item.product === 'number' ? item.product : item.product.id),
          quantity: item.quantity,
        }))
        await updateInventoryAfterPurchase(inventoryItems)
      }
      
      return <PaymentSuccessClient orderId={id} />
    }
    
    // If no payment_intent and no success status, redirect back to checkout
    return redirect(`/checkout/${id}`)
  }

  try {
    // Verify the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent)
    
    // Validate the payment intent belongs to this order
    // Note: We relaxed this check since some implementations might not have orderId in metadata
    if (paymentIntent.metadata.orderId && paymentIntent.metadata.orderId !== order.id.toString()) {
      console.error("Payment intent orderId mismatch:", {
        paymentIntentOrderId: paymentIntent.metadata.orderId,
        currentOrderId: order.id.toString()
      });
      return notFound()
    }

    const isSuccess = paymentIntent.status === 'succeeded'
    if (!isSuccess) {
      console.log("Payment not succeeded, redirecting back to checkout");
      return redirect(`/checkout/${id}`)
    }

    // Update order to paid status to trigger loyalty points award
    console.log("Payment succeeded, updating order to paid status");
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
  } catch (error) {
    console.error("Error retrieving or processing payment intent:", error);
    
    // If there was an error, but the order is already marked as paid, show success anyway
    if (order.isPaid) {
      return <PaymentSuccessClient orderId={id} />
    }
    
    // Otherwise redirect back to checkout
    return redirect(`/checkout/${id}`);
  }
}
