'use client'

import React, { useState } from 'react'
import { Product } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { Link } from '@payloadcms/ui'


export default function SizeSelection({ product }: { product: Product }) {
   // const selectedSize = size || String(product.sizes?.[0] ?? '') 
  
  const [selectedSize, setSelectedSize] = useState(
      typeof product.sizes?.[0] === 'object'
        ? (product.sizes[0]?.title ?? '')
        : String(product.sizes?.[0] ?? ''),
    )

  return (
    <>
      {product.sizes?.length ? (
        <div className="flex flex-col">
          <span className="text-sm sm:text-base ">Select Size</span>
          <div className="flex items-center flex-wrap space-x-3 sm:space-x-4">
            {product.sizes.map((sizeObj, index) => (
              <Button
                key={index}
                variant="outline"
                className={cn([
                  'flex items-center justify-center px-5 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base m-1 lg:m-0 max-h-[46px]',
                  selectedSize === String((sizeObj as any)?.title) &&
                    'bg-[#31344F] font-medium ',
                ])}
                onClick={() =>setSelectedSize  (String((sizeObj as any)?.title))}
             
              >
                <Link
                  replace
                  scroll={false}
                  href={`?${new URLSearchParams({
                    color: selectedSize,
                    size: String((sizeObj as any)?.title),
                  })}`}
                >
                  {String((sizeObj as any)?.title)}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <p>No sizes available</p>
      )}
    </>
  )
}
