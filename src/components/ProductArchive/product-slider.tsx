'use client'

import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import { Product } from '@/payload-types'
import { Card} from './ProductCard'

export default function ProductSlider({
  title,
  products,
  hideDetails = false,
}: {
  title?: string
  products: Product[]
  hideDetails?: boolean
}) {
  return (
    <div className="w-full bg-background">
      <h2 className="h2-bold mb-5">{title}</h2>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((result, index) => {
              if (typeof result === 'object' && result !== null) {
                return (
                  <CarouselItem
                    key={index}
                    className={
                      hideDetails
                        ? 'xs:basis-1/2 sm:basis-1/2 md:basis-1/4 lg:basis-1/4' // 2 per row on xs & sm, 4 on md & lg
                        : 'xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4' // 2 per row on xs & sm, 3 on md, 4 on lg
                    }
                  >
                    <Card
                      key={index}
                      doc={result}
                      relationTo="products"
                      hideDetails={hideDetails}
                      hideAddToCart
                      hideBorder
                      showCategories
                    />
                  </CarouselItem>
                )
              }
              return null
            })
          ) : (
            <p>No products available.</p>
          )}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  )
}
