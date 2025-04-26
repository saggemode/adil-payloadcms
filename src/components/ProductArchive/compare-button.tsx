'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useCompare } from '@/contexts/CompareContext'
import { CardProduct } from './ProductCard'
import { CheckSquare, PlusSquare } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CompareButtonProps {
  product: CardProduct
}

const CompareButton: React.FC<CompareButtonProps> = ({ product }) => {
  const { addProductToCompare, isInCompare, comparedProducts } = useCompare()
  const isInCompareList = product.id ? isInCompare(product.id.toString()) : false
  const isCompareListFull = comparedProducts.length >= 2

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!isInCompareList && !isCompareListFull) {
                addProductToCompare(product)
              }
            }}
            disabled={isCompareListFull && !isInCompareList}
            aria-label={isInCompareList ? 'Product added to compare' : 'Add product to compare'}
            className={isInCompareList ? 'border-primary text-primary' : ''}
          >
            {isInCompareList ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <PlusSquare className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isInCompareList 
            ? 'Added to compare' 
            : isCompareListFull 
              ? 'Compare list is full (max 2 products)' 
              : 'Add to compare'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CompareButton