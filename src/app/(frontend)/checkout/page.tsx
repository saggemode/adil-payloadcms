import { Metadata } from 'next'

//import CheckoutForm from './checkout-form'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getMeUser } from '@/utilities/getMeUser'
import CheckoutForm from '@/components/CheckOut'

export default async function CheckoutPage() {
  await getMeUser({
    nullUserRedirect: `/auth/login?error=${encodeURIComponent(
      'You must be logged in to checkout.',
    )}&redirect=${encodeURIComponent('/auth/login?callbackUrl=/checkout')}`,
  })

  // const { user } = useAuth()
  // if (!user) {
  //   redirect('/auth/login?callbackUrl=/checkout')
  // }
  return <CheckoutForm />
}

export const metadata: Metadata = {
  title: 'CheckOut',
  description: 'Checkout of your basket',
  openGraph: mergeOpenGraph({
    title: 'CheckOut',
    url: '/checkout',
  }),
}
