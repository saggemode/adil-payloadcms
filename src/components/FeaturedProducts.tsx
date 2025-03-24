import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/payload-types'

interface FeaturedProductsProps {
  products: Product[]
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.slug}`} className="group">
          <div className="relative overflow-hidden bg-white">
            <div className="aspect-square relative">
              {product.images?.[0]?.image && (
                <Image
                  src={
                    typeof product.images[0].image === 'string'
                      ? product.images[0].image
                      : typeof product.images[0].image === 'object' &&
                          'url' in product.images[0].image
                        ? product.images[0].image.url || ''
                        : ''
                  }
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              {product.countInStock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="p-4">
              {/* <p className="text-sm text-gray-500 mb-1">
                {Array.isArray(product.brands) ? product.brands[0]?.title : 'Brand'}
              </p> */}
              <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                {product.listPrice && product.listPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">${product.listPrice}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default FeaturedProducts
