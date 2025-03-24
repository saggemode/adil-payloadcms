'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/payload-types'
import { getAllProducts } from '@/actions/productAction'
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

export default function ProductCarouselBanner() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { docs } = await getAllProducts({ limit: 5, featured: true })
        setProducts(docs)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <Carousel
      opts={{
        align: 'center',
        loop: true,
      }}
      plugins={[Autoplay({ delay: 4000 })]}
      className="w-full"
    >
      <CarouselContent className="-ml-0">
        {products.map((product) => (
          <CarouselItem key={product.id} className="pl-0 basis-full">
            <div className="relative h-[300px] w-full">
              {product.images?.[0]?.image && (
                <Media resource={product.images[0].image} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
                <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
                <p className="text-lg mb-4">${product.price}</p>
                <Link href={`/products/${product.slug}`}>
                  <Button variant="secondary">Shop Now</Button>
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  )
}
