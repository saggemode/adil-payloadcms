'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/payload-types'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { QrCode } from 'lucide-react'
import Rating from '@/components/ProductArchive/rating'
import AddToCart from '@/components/ProductArchive/add-to-cart'
import { generateId, round2 } from '@/utilities/generateId'
import CompareButton from '@/components/ProductArchive/compare-button'
import { WishlistButton } from '@/components/Wishlist/WishlistButton'

interface FeaturedProductsProps {
  products: Product[]
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Featured Products Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-lg p-4 text-white">
        <div className="flex items-center">
          <span className="text-2xl mr-2">🔥</span>
          <h2 className="text-xl sm:text-2xl font-bold">FEATURED PRODUCTS</h2>
        </div>
        <Link href="/products">
          <Button variant="secondary" size="sm" className="mt-2 md:mt-0">
            View All
          </Button>
        </Link>
      </div>

      {/* Featured Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => {
          const productUrl = `/products/${product.slug}`;
          const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${productUrl}` : productUrl;
          
          const getCategoryTitle = (categories: any) => {
            if (Array.isArray(categories)) {
              return categories.length > 0 && categories[0].title ? categories[0].title : 'Unknown Category'
            }
            if (typeof categories === 'object' && categories?.title) {
              return categories.title
            }
            return 'Unknown Category'
          }
          
          // Get first color if available
          const getFirstColor = () => {
            if (!product.colors || !Array.isArray(product.colors) || product.colors.length === 0) {
              return '';
            }
            
            const firstColor = product.colors[0];
            if (typeof firstColor === 'object' && 'title' in firstColor) {
              return firstColor.title;
            }
            return '';
          }
          
          // Get first size if available
          const getFirstSize = () => {
            if (!product.sizes || !Array.isArray(product.sizes) || product.sizes.length === 0) {
              return '';
            }
            
            const firstSize = product.sizes[0];
            if (typeof firstSize === 'object' && 'title' in firstSize) {
              return firstSize.title;
            }
            return '';
          }
          
          const selectedColor = getFirstColor();
          const selectedSize = getFirstSize();
          
          // Calculate discount percentage for display
          let discountPercentage = 0;
          if (product.listPrice && product.price < product.listPrice) {
            discountPercentage = Math.max(0, Math.round(((product.listPrice - product.price) / product.listPrice) * 100));
          }
          
          // Use actual sales data if available, otherwise generate a virtual sold count
          const actualSoldCount = product.numSales ?? 0;
          const displaySoldCount = product.numSales !== undefined ? actualSoldCount : (product.id 
            ? (parseInt(String(product.id)) % 80) + 20 // Generate a "random-like" but consistent number based on product ID
            : 50);
          
          // Calculate total quantity (items sold + items in stock)
          const totalQuantity = product.countInStock !== undefined 
            ? displaySoldCount + product.countInStock 
            : 100;
          
          // Calculate percentage for progress bar
          const soldPercentage = totalQuantity > 0 
            ? Math.min(100, (displaySoldCount / totalQuantity) * 100) 
            : 50;
          
          return (
            <Link
              href={productUrl}
              key={product.id}
              className="group"
            >
              <Card className="border border-gray-200 overflow-hidden h-full hover:shadow-md transition-shadow">
                <CardContent className="p-3 relative">
                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{discountPercentage}%
                    </div>
                  )}
                  
                  {/* Product Image */}
                  <div className="relative w-full aspect-square overflow-hidden rounded-md mb-2">
                    {product.images?.[0]?.image && (
                      <div className="relative w-full h-full">
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
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                    )}
                    
                    {product.countInStock === 0 && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-md">
                        <span className="font-semibold px-3 py-1 bg-red-600/80 rounded-full">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Title */}
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">
                    {product.title}
                  </h3>
                  
                  {/* Star Rating */}
                  <div className="flex items-center">
                    <Rating rating={product.avgRating || 4.5} size={4} />
                    <span className="ml-1 text-xs text-gray-500">({product.numReviews || 12})</span>
                  </div>
                  
                  {/* Price Display */}
                  <div className="flex items-start justify-between mt-1">
                    <div className="flex flex-col">
                      <div className="flex items-center flex-wrap">
                        <span className="text-lg text-blue-600 font-bold">${product.price?.toFixed(2)}</span>
                        {product.listPrice && (
                          <span className="ml-1 text-xs text-gray-400 line-through">${product.listPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Sold count and progress bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{displaySoldCount} sold</span>
                      <span>{product.countInStock !== undefined ? `${product.countInStock} in stock` : 'Limited stock'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${soldPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-end">
                    <span className="text-xs text-white bg-blue-500 px-1.5 py-0.5 rounded">Featured</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 w-full mt-4">
                   
                    <CompareButton product={product} />
                    <WishlistButton 
                      product={{
                        id: product.id,
                        title: product.title,
                        slug: product.slug || '',
                        price: product.price,
                        images: product.images?.map(img => ({ 
                          image: img.image,
                          id: img.id 
                        })) || [],
                        category: typeof product.categories === 'object' && product.categories !== null ? { name: product.categories.title } : undefined
                      }}
                    />
                    <div onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Scan to view product</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col items-center gap-4 p-4">
                            <QRCodeSVG value={fullUrl} size={200} />
                            <p className="text-sm text-gray-500 text-center">
                              Scan this QR code to view {product.title} on your mobile device
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default FeaturedProducts
