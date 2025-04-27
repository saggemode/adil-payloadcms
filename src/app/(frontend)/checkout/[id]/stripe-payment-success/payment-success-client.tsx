'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ReferralCompletionHandler from '@/components/referral/ReferralCompletionHandler'
import dynamic from 'next/dynamic'
import useCartStore from '@/hooks/use-cart-store'

// Dynamically import Confetti with no SSR to avoid hydration issues
const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false })

export default function PaymentSuccessClient({ orderId }: { orderId: string }) {
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })
  const { clearCart } = useCartStore()

  // Initialize window size only once when component mounts
  useEffect(() => {
    // Set initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    // Handle window resize for confetti
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add resize listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup resize listener
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []) // Empty dependency array ensures this only runs once on mount

  // Separate useEffect for notification and confetti timer
  useEffect(() => {
    // Show success notification when component mounts
    console.log(`Payment successful! Your order #${orderId} has been confirmed.`)
    
    // We're no longer hiding confetti after a timeout - it will stay visible

    // Clear the cart after successful payment
    clearCart()
  }, [orderId, clearCart])

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8 relative">
      {showConfetti && windowSize.width > 0 && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={true}
            numberOfPieces={200}
            gravity={0.05}
            initialVelocityY={20}
            colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']}
          />
        </div>
      )}
      <div className="flex flex-col gap-6 items-center">
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