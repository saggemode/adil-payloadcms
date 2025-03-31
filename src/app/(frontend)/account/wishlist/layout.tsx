import { Metadata } from 'next'
import WishlistPage from './page'

export const metadata: Metadata = {
  title: 'Your Wishlist',
}

export default function WishlistLayout() {
  return <WishlistPage />
} 