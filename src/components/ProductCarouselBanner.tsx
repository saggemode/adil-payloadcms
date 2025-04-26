'use client'
import { Media } from '@/components/Media'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import { useFeaturedProductsCarousel } from '@/hooks/useProducts'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Timer } from 'lucide-react'
import type { CarouselApi } from '@/components/ui/carousel'

// Define Product interface
interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  content?: string;
  images?: Array<{
    image: any;
  }>;
}

export default function ProductCarouselBanner() {
  const { data, isLoading, error } = useFeaturedProductsCarousel()
  const [activeIndex, setActiveIndex] = useState(0)
  const autoplayPlugin = useRef(Autoplay({ delay: 6000, stopOnInteraction: false }))
  const [isMobile, setIsMobile] = useState(false)
  const [api, setApi] = useState<CarouselApi>()

  // Setup carousel API
  useEffect(() => {
    if (!api) return
    
    const handleSelect = () => {
      setActiveIndex(api.selectedScrollSnap())
    }
    
    api.on("select", handleSelect)
    
    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  // Handle responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Handle countdown timer (for demo purposes)
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 })
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 23, minutes: 59, seconds: 59 } // Reset when reaches 0
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  // Custom carousel controls
  const handleNext = useCallback(() => {
    const nextIndex = activeIndex + 1
    setActiveIndex(products?.length ? nextIndex % products.length : 0)
  }, [activeIndex])
  
  const handlePrev = useCallback(() => {
    const prevIndex = activeIndex - 1
    setActiveIndex(products?.length ? (prevIndex < 0 ? products.length - 1 : prevIndex) : 0)
  }, [activeIndex])

  if (isLoading) {
    return (
      <div className="w-full rounded-lg overflow-hidden">
        <div className="w-full h-[300px] md:h-[500px] bg-gray-200 animate-pulse rounded-lg" />
      </div>
    )
  }

  if (error) {
    console.error('Error fetching products:', error)
    return null
  }

  const products = data?.docs || [] as Product[]
  
  if (products.length === 0) return null

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">Limited Time Offers</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Exclusive deals with massive discounts - don&apos;t miss out!
        </p>
      </div>
      
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        <Carousel
          opts={{
            align: 'center',
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent className="-ml-0">
            {products.map((product: Product) => (
              <CarouselItem key={product.id} className="pl-0 basis-full">
                <div className="relative h-[300px] md:h-[500px] w-full rounded-lg overflow-hidden">
                  {product.images?.[0]?.image && (
                    <Media 
                      resource={product.images[0].image} 
                      className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
                      loading="eager"
                      priority={true}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-transparent flex flex-col items-start justify-center text-white p-6 md:p-12 lg:p-16">
                    <div className="relative z-10 max-w-xl">
                      <div className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 md:mb-4 inline-block">
                        <Timer size={14} className="animate-pulse" />
                        <span className="tracking-wide">FLASH SALE ENDS IN</span>
                      </div>
                      
                      {/* Countdown timer */}
                      <div className="flex gap-2 mb-4 md:mb-6">
                        <div className="bg-black/50 backdrop-blur-sm p-1.5 rounded flex items-center">
                          <span className="text-xl font-mono font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                          <span className="text-xs mx-1">hrs</span>
                        </div>
                        <div className="bg-black/50 backdrop-blur-sm p-1.5 rounded flex items-center">
                          <span className="text-xl font-mono font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                          <span className="text-xs mx-1">min</span>
                        </div>
                        <div className="bg-black/50 backdrop-blur-sm p-1.5 rounded flex items-center">
                          <span className="text-xl font-mono font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                          <span className="text-xs mx-1">sec</span>
                        </div>
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1.5 rounded-md font-bold text-xl md:text-2xl">
                          ${product.price?.toFixed(2)}
                        </span>
                        <span className="text-gray-300 line-through text-lg md:text-xl">
                          ${(product.price * 1.7).toFixed(2)}
                        </span>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          SAVE ${(product.price * 0.7).toFixed(2)}
                        </span>
                      </div>
                      
                      {product.content && (
                        <p className="text-sm md:text-base mb-6 max-w-md text-gray-100 hidden md:block">
                          {String(product.content).slice(0, 100)}
                          {String(product.content).length > 100 ? '...' : ''}
                        </p>
                      )}
                      
                      <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-6">
                        <Link href={`/products/${product.slug}`}>
                          <Button size={isMobile ? "default" : "lg"} className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold min-w-32">
                            Shop Now
                          </Button>
                        </Link>
                        
                        <Button size={isMobile ? "default" : "lg"} variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white min-w-32">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Badges overlay */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      Free Shipping
                    </span>
                    <span className="bg-green-600/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      Limited Time
                    </span>
                    <span className="bg-purple-600/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      Best Seller
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="absolute z-10 bottom-4 md:bottom-8 left-0 right-0 flex justify-center gap-2">
            {products.map((_: Product, index: number) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <CarouselPrevious 
            onClick={handlePrev}
            className="left-4 md:left-8 bg-black/30 backdrop-blur-sm hover:bg-black/50 border-none text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </CarouselPrevious>
          <CarouselNext 
            onClick={handleNext}
            className="right-4 md:right-8 bg-black/30 backdrop-blur-sm hover:bg-black/50 border-none text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </CarouselNext>
        </Carousel>
      </div>
      
      {/* Mini promotions section with enhanced design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { color: 'from-pink-600 to-purple-600', title: 'New Arrivals', icon: '🆕', description: 'Just landed' },
          { color: 'from-blue-600 to-teal-500', title: 'Free Shipping', icon: '🚚', description: 'Orders over $50' },
          { color: 'from-amber-500 to-orange-600', title: 'Clearance', icon: '🏷️', description: 'Up to 70% off' },
          { color: 'from-emerald-500 to-green-600', title: 'Flash Deals', icon: '⚡', description: '24hr specials' }
        ].map((promo, idx) => (
          <Link href={`/collections/${promo.title.toLowerCase().replace(' ', '-')}`} key={idx}>
            <div className={`bg-gradient-to-r ${promo.color} text-white p-4 md:p-5 rounded-xl flex flex-col md:flex-row md:items-center hover:shadow-lg transition-all duration-300 h-full transform hover:-translate-y-1`}>
              <span className="text-2xl md:text-3xl mr-0 md:mr-4 mb-2 md:mb-0">{promo.icon}</span>
              <div>
                <h3 className="font-bold text-sm md:text-base">{promo.title}</h3>
                <p className="text-xs text-white/80 mt-1 hidden md:block">{promo.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
