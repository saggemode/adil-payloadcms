import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

//import CheckoutForm from './checkout-form'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getMeUser } from '@/utilities/getMeUser'
import CheckoutForm from '@/components/CheckOut'

// Force dynamic rendering because this page uses cookies
export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  try {
    // Verify user is logged in and redirect if not
    await getMeUser({
      nullUserRedirect: `/auth/login?error=${encodeURIComponent(
        'You must be logged in to checkout.',
      )}&redirect=${encodeURIComponent('/checkout')}`,
    })

    return (
      <ErrorBoundary fallback={<CheckoutErrorFallback />}>
        <Suspense fallback={<CheckoutLoading />}>
          <CheckoutForm />
        </Suspense>
      </ErrorBoundary>
    )
  } catch (error) {
    console.error('Checkout page error:', error)
    return notFound()
  }
}

function CheckoutLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="animate-spin">
        <Loader2 className="h-10 w-10 text-primary" />
      </div>
      <p className="mt-4 text-muted-foreground">Loading checkout information...</p>
    </div>
  )
}

function CheckoutErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
      <h2 className="text-xl font-bold mb-2">Unable to load checkout</h2>
      <p className="text-muted-foreground mb-4">
        There was a problem loading the checkout page. Please try again later.
      </p>
      <Link href="/" className="text-primary hover:underline">
        Return to home page
      </Link>
    </div>
  )
}

// Simple error boundary component
function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  return <>{children}</>
}

export const metadata: Metadata = {
  title: 'Secure Checkout',
  description: 'Complete your purchase securely with our streamlined checkout process',
  openGraph: mergeOpenGraph({
    title: 'Secure Checkout',
    url: '/checkout',
    description: 'Complete your purchase with fast, secure payment processing',
  }),
}
