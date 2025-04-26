'use client'

import React, { useState } from 'react'
import { useCompare } from '@/contexts/CompareContext'
import { Button } from '@/components/ui/button'
import { X, Scale, ArrowRight, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const CompareBar: React.FC = () => {
  const { comparedProducts, removeProductFromCompare, clearComparedProducts } = useCompare()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  if (comparedProducts.length === 0) {
    return null
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-gray-200 shadow-lg transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'
      }`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">
            Compare Products ({comparedProducts.length}/2)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {comparedProducts.length >= 2 && (
            <Button
              variant="default"
              size="sm"
              className="gap-1"
              onClick={(e) => {
                e.stopPropagation()
                router.push('/products/compare')
              }}
            >
              Compare Now <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
            aria-label={isOpen ? 'Collapse compare bar' : 'Expand compare bar'}
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <div className="w-5 h-5 flex justify-center">
                <svg
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Product cards */}
      {isOpen && (
        <div className="p-4 pt-0">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <span className="text-sm text-gray-500 mb-2 sm:mb-0">
              {comparedProducts.length < 2
                ? 'Select at least 2 products to compare'
                : 'Ready to compare!'}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto"
              onClick={() => clearComparedProducts()}
            >
              <Trash2 className="h-4 w-4" /> Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, index) => {
              const product = comparedProducts[index]
              return (
                <div
                  key={index}
                  className="relative border rounded-lg p-2 h-[120px] sm:h-[150px] bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center"
                >
                  {product ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeProductFromCompare(product.id?.toString() || '')}
                        aria-label="Remove product"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 relative mb-2">
                        {product.images && product.images[0]?.image && (
                          <Image
                            src={
                              typeof product.images[0].image === 'object' && 'url' in product.images[0].image
                                ? product.images[0].image.url || ''
                                : ''
                            }
                            alt={product.title || 'Product image'}
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                      <p className="text-xs font-medium line-clamp-2 text-center">
                        {product.title}
                      </p>
                    </>
                  ) : (
                    <div className="text-gray-400 text-xs text-center">
                      <div className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 mx-auto mb-2 flex items-center justify-center">
                        <span className="text-lg sm:text-xl">+</span>
                      </div>
                      Add product
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default CompareBar