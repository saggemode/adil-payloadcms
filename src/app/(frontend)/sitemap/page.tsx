import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Complete list of all pages on our website',
}

export default function SitemapPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Main Pages</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-blue-600 hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Shop</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/shop" className="text-blue-600 hover:underline">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/shop/new-arrivals" className="text-blue-600 hover:underline">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link href="/shop/best-sellers" className="text-blue-600 hover:underline">
                Best Sellers
              </Link>
            </li>
            <li>
              <Link href="/shop/sale" className="text-blue-600 hover:underline">
                Sale Items
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/shop/category/men" className="text-blue-600 hover:underline">
                Men's Collection
              </Link>
            </li>
            <li>
              <Link href="/shop/category/women" className="text-blue-600 hover:underline">
                Women's Collection
              </Link>
            </li>
            <li>
              <Link href="/shop/category/kids" className="text-blue-600 hover:underline">
                Kids' Collection
              </Link>
            </li>
            <li>
              <Link href="/shop/category/accessories" className="text-blue-600 hover:underline">
                Accessories
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Account</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/account/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link href="/account/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </li>
            <li>
              <Link href="/account/profile" className="text-blue-600 hover:underline">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="text-blue-600 hover:underline">
                My Orders
              </Link>
            </li>
            <li>
              <Link href="/account/wishlist" className="text-blue-600 hover:underline">
                Wishlist
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Support</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/support/faq" className="text-blue-600 hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/support/shipping" className="text-blue-600 hover:underline">
                Shipping Information
              </Link>
            </li>
            <li>
              <Link href="/support/returns" className="text-blue-600 hover:underline">
                Returns & Exchanges
              </Link>
            </li>
            <li>
              <Link href="/support/size-guide" className="text-blue-600 hover:underline">
                Size Guide
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 