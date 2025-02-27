'use client'

import React, { useState } from 'react'
import { Product } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { Link } from '@payloadcms/ui'

export default function ColorSelection({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(
    typeof product.colors?.[0] === 'object' && 'title' in product.colors[0]
      ? product.colors[0].title
      : String(product.colors?.[0] ?? ''),
  )

  return (
    <>
      {product.colors?.length ? (
        <div className="flex flex-col">
          <span className="text-sm sm:text-base text-black/60 mb-4">Select Colors</span>
          <div className="flex items-center flex-wrap space-x-3 sm:space-x-4">
            {product.colors.map((colorObj, index) => (
              <Button
                key={index}
                variant="outline"
                className={cn([
                  'flex items-center justify-center px-5 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base m-1 lg:m-0 max-h-[46px]',
                  typeof colorObj === 'object' &&
                  'title' in colorObj &&
                  selectedColor === colorObj.title
                    ? 'bg-[#31344F] font-medium'
                    : '',
                ])}
                onClick={() =>
                  typeof colorObj === 'object' && 'title' in colorObj
                    ? setSelectedColor(colorObj.title)
                    : setSelectedColor(String(colorObj))
                }
              >
                <Link
                  replace
                  scroll={false}
                  href={`?${new URLSearchParams({
                    color:
                      typeof colorObj === 'object' && 'title' in colorObj
                        ? colorObj.title
                        : String(colorObj),
                  })}`}
                >
                  {typeof colorObj === 'object' && 'title' in colorObj
                    ? colorObj.title
                    : String(colorObj)}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <p>No colors available</p>
      )}
    </>
  )
}
