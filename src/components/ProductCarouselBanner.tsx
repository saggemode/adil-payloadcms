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

export default function ProductCarouselBanner() {
  const { data, isLoading, error } = useFeaturedProductsCarousel()

  if (isLoading) {
    return <div className="w-full h-[300px] bg-gray-200 animate-pulse" />
  }

  if (error) {
    console.error('Error fetching products:', error)
    return null
  }

  const products = data?.docs || []

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
