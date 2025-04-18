'use client'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import React, { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utilities/ui'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/payload-types'
import WishlistButton from '@/components/ProductArchive/wishlist-button'
import ProductPrice from '@/components/ProductArchive/Price'
import CompareButton from '@/components/ProductArchive/compare-button'
import AddToCart from '@/components/ProductArchive/add-to-cart'
import { generateId, round2 } from '@/utilities/generateId'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { QrCode } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export default function BrowsingHistoryList({ className }: { className?: string }) {
  const { products } = useBrowsingHistory()
  return (
    products.length !== 0 && (
      <div className="bg-background">
        <Separator className={cn('mb-4', className)} />
        <BrowsingHistoryCarousel title={"Related to items that you've viewed"} type="related" />
        <Separator className="mb-4" />
        <BrowsingHistoryCarousel title={'Your browsing history'} type="history" />
      </div>
    )
  )
}

function BrowsingHistoryCarousel({
  title,
  type = 'history',
}: {
  title: string
  type: 'history' | 'related'
}) {
  const { products: browsingProducts } = useBrowsingHistory()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `/api/products/browsing-history?type=${type}&categories=${browsingProducts
            .map((product) => product.category)
            .join(',')}&ids=${browsingProducts.map((product) => product.id).join(',')}`,
        )

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }

        const text = await res.text() // Read response as text first
        if (!text) {
          console.warn('Empty response received from API')
          setProducts([]) // Set empty data to avoid undefined errors
          return
        }

        const data = JSON.parse(text) // Parse the text as JSON
        setProducts(data)
      } catch (error) {
        console.error('Error fetching browsing history:', error)
      }
    }

    fetchProducts()
  }, [browsingProducts, type])

  const WishlistButtonWrapper = ({ productId }: { productId: string }) => (
    <div className="absolute top-3 right-3 z-10" onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}>
      <WishlistButton productId={productId} />
    </div>
  )
  
  // Helper function to get category title
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
  const getFirstColor = (product: Product) => {
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
  const getFirstSize = (product: Product) => {
    if (!product.sizes || !Array.isArray(product.sizes) || product.sizes.length === 0) {
      return '';
    }
    
    const firstSize = product.sizes[0];
    if (typeof firstSize === 'object' && 'title' in firstSize) {
      return firstSize.title;
    }
    return '';
  }

  return (
    products.length > 0 && (
      <div className="w-full mb-8">
        <h2 className="text-2xl font-bold mb-5">{title}</h2>
        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full"
        >
          <CarouselContent>
            {products.map((product) => {
              const selectedColor = getFirstColor(product);
              const selectedSize = getFirstSize(product);
              
              return (
              <CarouselItem
                key={product.id}
                className="xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div className="relative group h-full">
                  <div className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full border border-gray-100">
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="aspect-square relative overflow-hidden rounded-t-2xl">
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
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        )}
                        <WishlistButtonWrapper productId={product.id?.toString() || ''} />
                        
                        {product.countInStock === 0 && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-t-2xl">
                            <span className="font-semibold px-3 py-1 bg-red-600/80 rounded-full ">Out of Stock</span>
                          </div>
                        )}
                        
                        {product.listPrice && product.price < product.listPrice && (
                          <div className="absolute top-3 left-3 bg-red-600 text-xs font-bold px-3 py-1 rounded-full ">
                            {Math.round(((product.listPrice - product.price) / product.listPrice) * 100)}% OFF
                          </div>
                        )}
                        
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="font-medium px-4 py-2 rounded-full text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            Quick View
                          </span>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-5 rounded-b-2xl">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-base font-medium mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <div className="rounded-xl overflow-hidden mb-3">
                        <ProductPrice 
                          price={product.price} 
                          listPrice={product.listPrice} 
                          forListing={true}
                          className="text-lg font-bold"
                          isDeal={product.listPrice ? product.price < product.listPrice : false}
                        />
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <AddToCart
                          minimal
                          item={{
                            clientId: generateId(),
                            product: product.id ?? 0,
                            slug: String(product.slug),
                            category: getCategoryTitle(product.categories),
                            image:
                              product.images?.[0]?.image && typeof product.images[0]?.image !== 'number'
                                ? typeof product.images[0].image === 'string'
                                  ? product.images[0].image
                                  : product.images[0].image.url || ''
                                : '',
                            countInStock: product.countInStock ?? 0,
                            name: product.title ?? '',
                            price: round2(product.price ?? 0),
                            quantity: 1,
                            size: selectedSize,
                            color: selectedColor,
                          }}
                        />
                        <CompareButton product={product as any} />
                        
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
                              <QRCodeSVG 
                                value={typeof window !== 'undefined' ? 
                                  `${window.location.origin}/products/${product.slug}` : 
                                  `/products/${product.slug}`} 
                                size={200} 
                              />
                              <p className="text-sm text-gray-500 text-center">
                                Scan this QR code to view {product.title} on your mobile device
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            )})}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    )
  )
}