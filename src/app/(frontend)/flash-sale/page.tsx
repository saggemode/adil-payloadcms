'use client'

import React, { useState, useEffect } from 'react'
import { useFlashSaleProducts } from '@/hooks/useProducts'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Clock, ShoppingCart, Tag, Zap } from 'lucide-react'
import Rating from '@/components/ProductArchive/rating'
import { formatDistanceToNow } from 'date-fns'

// Animated countdown timer component
const AnimatedTimer = ({ endDate }: { endDate?: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  
  useEffect(() => {
    if (!endDate) return
    
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - Date.now()
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft())
    
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [endDate])
  
  // Format time digits with leading zero
  const formatTime = (time: number) => time.toString().padStart(2, '0')
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex flex-col items-center">
        <div className="bg-red-600 text-white font-bold rounded px-2 py-1 text-sm md:text-lg">
          {timeLeft.days}
        </div>
        <span className="text-xs text-gray-500">Days</span>
      </div>
      <div className="text-red-600 font-bold">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-red-600 text-white font-bold rounded px-2 py-1 text-sm md:text-lg">
          {formatTime(timeLeft.hours)}
        </div>
        <span className="text-xs text-gray-500">Hours</span>
      </div>
      <div className="text-red-600 font-bold">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-red-600 text-white font-bold rounded px-2 py-1 text-sm md:text-lg">
          {formatTime(timeLeft.minutes)}
        </div>
        <span className="text-xs text-gray-500">Mins</span>
      </div>
      <div className="text-red-600 font-bold">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-red-600 text-white font-bold rounded px-2 py-1 text-sm md:text-lg animate-pulse">
          {formatTime(timeLeft.seconds)}
        </div>
        <span className="text-xs text-gray-500">Secs</span>
      </div>
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product }: { product: any }) => {
  // Calculate original price
  const calculateOriginalPrice = (): string => {
    if (!product.flashSale) return product.price.toFixed(2)
    
    if (product.flashSale.discountType === 'percentage') {
      return (product.price / (1 - product.flashSale.discountAmount / 100)).toFixed(2)
    } else {
      return (product.price + product.flashSale.discountAmount).toFixed(2)
    }
  }
  
  // Get discount percentage
  const getDiscountPercentage = (): number => {
    if (!product.flashSale) return 0
    
    if (product.flashSale.discountType === 'percentage') {
      return Math.round(product.flashSale.discountAmount)
    } else {
      const originalPrice = parseFloat(calculateOriginalPrice())
      return Math.round((product.flashSale.discountAmount / originalPrice) * 100)
    }
  }
  
  const originalPrice = calculateOriginalPrice()
  const discount = getDiscountPercentage()
  const soldCount = product.flashSale?.soldQuantity || 
    (product.id ? (parseInt(String(product.id)) % 8000) + 1000 : 5000)
  const totalQuantity = product.flashSale?.totalQuantity || 10000
  const soldPercentage = Math.min(100, Math.round((soldCount / totalQuantity) * 100))
  
  return (
    <div className="transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="group block">
        <Card className="border border-gray-200 overflow-hidden h-full hover:shadow-lg transition-all">
          <CardContent className="p-3 relative">
            {/* Discount Badge */}
            <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </div>
            
            {/* Hot Badge */}
            {discount > 40 && (
              <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <Zap size={12} className="mr-1" /> Hot
              </div>
            )}
            
            {/* Flash Sale Name Badge if applicable */}
            {product.flashSale?.flashSaleName && (
              <div className="absolute top-10 left-2 z-10 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                {product.flashSale.flashSaleName}
              </div>
            )}
            
            {/* Product Image */}
            <div className="relative w-full aspect-square overflow-hidden rounded-md mb-2 bg-gray-100">
              {product.images?.[0]?.image ? (
                <div className="relative w-full h-full">
                  <Image
                    src={typeof product.images[0].image === 'object' && product.images[0].image?.url 
                      ? product.images[0].image.url 
                      : ''}
                    alt={product.title || 'Product image'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            
            {/* Product Title */}
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 h-10">
              {product.title || 'Flash Sale Product'}
            </h3>
            
            {/* Star Rating */}
            <div className="flex items-center">
              <Rating rating={product.avgRating || 0} size={4} />
              <span className="ml-1 text-xs text-gray-500">({product.numReviews || 0})</span>
            </div>
            
            {/* Price and Discount */}
            <div className="flex items-start justify-between mt-1">
              <div className="flex flex-col">
                <div className="flex items-center flex-wrap">
                  <span className="text-lg text-red-600 font-bold">₦{product.price?.toFixed(2)}</span>
                  <span className="ml-1 text-xs text-gray-400 line-through">₦{String(originalPrice)}</span>
                </div>
              </div>
            </div>
            
            {/* Sold count and progress bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{soldCount} sold</span>
                <span>{totalQuantity - soldCount} left</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${soldPercentage}%` }}
                />
              </div>
            </div>
            
            {/* Quick Add to Cart Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3  hover:bg-red-50 border-red-500 text-red-600 hover:text-red-700"
            >
              <ShoppingCart size={14} className="mr-1" /> Quick Add
            </Button>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

export default function FlashSalePage() {
  const { data, isLoading } = useFlashSaleProducts()
  const products = data?.docs || []
  
  // Get all flash sale products in a single array
  const allFlashSaleProducts = products.filter(product => product.flashSale)
  
  // Find earliest end date for timer
  const earliestEndDate = React.useMemo(() => {
    if (allFlashSaleProducts.length === 0) return null
    
    return allFlashSaleProducts.reduce((earliest, product) => {
      if (!product.flashSale?.endDate) return earliest
      const endDate = new Date(product.flashSale.endDate).getTime()
      return earliest ? Math.min(earliest, endDate) : endDate
    }, null)
  }, [allFlashSaleProducts])
  
  const formattedEndDate = earliestEndDate ? new Date(earliestEndDate).toISOString() : undefined
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="w-full animate-pulse">
          <div className="h-16 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (allFlashSaleProducts.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">No active flash sales</h2>
          <p className="text-gray-600 mb-6">Stay tuned for upcoming flash sales with amazing discounts!</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-2 pt-0 md:py-8 px-2 md:px-4">
      {/* Hero Section */}
      <div className="mt-0 mb-6 md:mb-8 bg-gradient-to-r from-red-600 via-orange-500 to-pink-500 rounded-xl overflow-hidden shadow-xl">
        <div className="p-3 md:p-10 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-6 md:mb-0 text-center md:text-left w-full md:w-auto">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">Flash Sale Extravaganza!</h1>
            <p className="text-white/80 text-base md:text-lg mb-4 md:mb-6 max-w-xl">Grab incredible deals before they're gone. Limited time offers with massive discounts!</p>
            <div className=" p-3 md:p-4 rounded-lg inline-block">
              <p className="uppercase tracking-wide text-xs md:text-sm mb-2">Next flash sale ends in:</p>
              <AnimatedTimer endDate={formattedEndDate} />
            </div>
          </div>
          
          <div className="relative mt-2 md:mt-0">
            <div className="transform transition-transform duration-500 rotate-0 scale-100">
              <div className=" p-2 md:p-3 rounded-xl shadow-lg transform rotate-3">
                <div className="bg-red-100 p-1 rounded-lg">
                  <div className=" p-1 rounded">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56">
                      {/* Pure CSS fallback solution instead of problematic image loading */}
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-300 via-orange-200 to-red-400 rounded-lg">
                        <div className="text-center p-2 md:p-4">
                          <div className="mx-auto mb-1 md:mb-2 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-12 md:h-12">
                              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                          </div>
                          <div className="font-bold text-red-700 text-base md:text-xl">FLASH SALE</div>
                          <div className="text-red-600 font-bold text-sm md:text-base mt-1">Up to 70% OFF!</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-red-600 text-white text-xs md:text-sm font-bold px-2 py-1 rounded-full transform rotate-12">
                  Up to 70% OFF!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Stats */}
      <div className="mb-6 flex flex-wrap items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Zap size={20} className="text-red-500" />
          <span className="text-lg font-semibold">{allFlashSaleProducts.length} Flash Sale Products</span>
        </div>
        
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <div className="flex items-center">
            <Clock size={16} className="text-gray-500 mr-1" />
            <span className="text-sm">Ending soon first</span>
          </div>
        </div>
      </div>
      
      {/* Category/Filter Tabs */}
      <div className="mb-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 w-full max-w-md mx-auto grid grid-cols-3 h-auto">
            <TabsTrigger value="all" className="py-2">All Products</TabsTrigger>
            <TabsTrigger value="ending-soon" className="py-2">Ending Soon</TabsTrigger>
            <TabsTrigger value="biggest-discounts" className="py-2">Biggest Discounts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {allFlashSaleProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ending-soon">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Clock size={24} className="text-red-500 mr-2" />
                Ending Soon
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {allFlashSaleProducts
                  .sort((a, b) => {
                    const aEndDate = new Date(a.flashSale?.endDate).getTime()
                    const bEndDate = new Date(b.flashSale?.endDate).getTime()
                    return aEndDate - bEndDate
                  })
                  .slice(0, 10)
                  .map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="biggest-discounts">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Tag size={24} className="text-red-500 mr-2" />
                Biggest Discounts
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {allFlashSaleProducts
                  .sort((a, b) => {
                    const getDiscount = (product: any) => {
                      if (!product.flashSale) return 0
                      if (product.flashSale.discountType === 'percentage') {
                        return product.flashSale.discountAmount
                      } else {
                        const originalPrice = product.price + product.flashSale.discountAmount
                        return (product.flashSale.discountAmount / originalPrice) * 100
                      }
                    }
                    return getDiscount(b) - getDiscount(a)
                  })
                  .slice(0, 10)
                  .map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-16 bg-gray-50 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          <div className=" p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg flex items-center justify-between">
              How do flash sales work?
              <ChevronDown size={20} className="text-gray-400" />
            </h3>
            <p className="text-gray-600 mt-2">
              Flash sales are limited-time promotions offering significant discounts on select products.
              They typically last 24-72 hours and once the time expires or products sell out, the deal ends.
            </p>
          </div>
          
          <div className=" p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg flex items-center justify-between">
              Can I return flash sale items?
              <ChevronDown size={20} className="text-gray-400" />
            </h3>
            <p className="text-gray-600 mt-2">
              Yes, our standard return policy applies to flash sale purchases. Please refer to our 
              return policy page for detailed information.
            </p>
          </div>
          
          <div className=" p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg flex items-center justify-between">
              Why can't I add a flash sale item to my cart?
              <ChevronDown size={20} className="text-gray-400" />
            </h3>
            <p className="text-gray-600 mt-2">
              Flash sale items may sell out quickly. If you cannot add an item to your cart,
              it might be sold out or the flash sale may have ended.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 