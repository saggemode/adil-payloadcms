'use client'

import React from 'react'
import { useWishlist } from '@/contexts/WishlistContext'
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useAuth } from '@/providers/Auth'
import Image from 'next/image'
import ProductPrice from '@/components/ProductArchive/Price'

export default function WishlistsPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { wishlists, loading: isWishlistLoading, error, removeFromWishlist } = useWishlist()

  if (isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your wishlists</h2>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (isWishlistLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading wishlists...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
      </div>

      {!wishlists || wishlists.length === 0 ? (
        <div className="text-center py-12">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start adding products to your wishlist by clicking the heart icon on any product.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((product) => (
            <div
              key={product.id}
              className="flex items-start gap-4 p-4  border rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-medium hover:text-blue-600">{product.name}</h3>
                </Link>
                <div className="mt-1">
                  <ProductPrice price={product.price} />
                </div>
                {product.category && (
                  <p className="text-sm text-gray-500 mt-1">
                    {product.category}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="p-2 text-gray-500 hover:text-red-500"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 