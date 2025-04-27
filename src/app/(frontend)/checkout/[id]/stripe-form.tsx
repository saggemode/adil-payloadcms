'use client'

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { FormEvent, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/ProductArchive/Price'
import { SERVER_URL } from '@/constants'

export default function StripeForm({
  priceInCents,
  orderId,
}: {
  priceInCents: number
  orderId: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Log when component mounts
    console.log("StripeForm mounted");
    
    // Check if stripe and elements are available
    if (stripe && elements) {
      console.log("Stripe and Elements are available on mount");
      setReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log("Form submitted, stripe:", !!stripe, "elements:", !!elements);

    if (!stripe || !elements) {
      console.error("Stripe or Elements is not initialized");
      console.log('Payment system is not fully loaded. Please try again in a moment.');
      return;
    }

    setIsLoading(true)
    setErrorMessage(null)
    
    try {
      // Construct the return URL
      const returnUrl = `${SERVER_URL}/checkout/${orderId}/stripe-payment-success`;
      console.log("Return URL:", returnUrl);
      
      // Simple direct approach
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
      });
      
      // Handle errors
      if (result.error) {
        console.error("Payment error:", result.error);
        setErrorMessage(result.error.message || "Payment failed");
        console.log('Payment error:', result.error.message || "Payment failed");
      }
    } catch (err) {
      console.error("Exception during payment:", err);
      setErrorMessage("An unexpected error occurred");
      console.log('An unexpected error occurred during payment');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show loading state
  if (!stripe || !elements || !ready) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin border-2 border-primary border-t-transparent rounded-full w-6 h-6 mx-auto mb-2"></div>
        <div>Loading payment system...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} id="payment-form" className="space-y-4">
      <div className="text-xl font-medium">Card Payment</div>
      
      {/* Show any error messages */}
      {errorMessage && (
        <div className="text-red-500 border border-red-300 bg-red-50 p-3 rounded-md">
          {errorMessage}
        </div>
      )}
      
      {/* The Payment Element */}
      <div id="payment-element-container">
        <PaymentElement id="payment-element" />
      </div>
      
      {/* Submit button */}
      <Button 
        type="submit"
        className="w-full"
        size="lg"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
            Processing...
          </span>
        ) : (
          <span>Pay <ProductPrice price={priceInCents / 100} plain /></span>
        )}
      </Button>
    </form>
  );
}
