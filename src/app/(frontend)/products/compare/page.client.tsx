'use client'

import React, { useEffect } from 'react'
import { useCompare } from '@/contexts/CompareContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Rating from '@/components/ProductArchive/rating'
import AddToCart from '@/components/ProductArchive/add-to-cart'
import { generateId, round2 } from '@/utilities/generateId'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CardProduct } from '@/components/ProductArchive/ProductCard'

// Define an interface for the attribute formatter functions
interface ProductAttribute {
  key: string
  label: string
  formatter: (val: unknown) => string
}

// Define type for color and size objects
interface ColorOrSizeObject {
  title: string
  [key: string]: unknown
}

// Define spec categories and their attributes for comparison
const comparisonCategories = [
  {
    title: 'Basic Info',
    attributes: [
      { key: 'price', label: 'Price', formatter: (val: number) => `$${val.toFixed(2)}` },
      { key: 'avgRating', label: 'Rating', formatter: (val: number) => val.toFixed(1) },
      { key: 'countInStock', label: 'In Stock', formatter: (val: number) => (val > 0 ? 'Yes' : 'No') },
    ],
  },
  {
    title: 'Specifications',
    attributes: [
      { key: 'colors', label: 'Colors', formatter: (val: unknown[]) => Array.isArray(val) ? val.map((c) => typeof c === 'object' ? (c as ColorOrSizeObject).title : c).join(', ') : '' },
      { key: 'sizes', label: 'Sizes', formatter: (val: unknown[]) => Array.isArray(val) ? val.map((s) => typeof s === 'object' ? (s as ColorOrSizeObject).title : s).join(', ') : '' },
    ],
  },
]

const getProductAttribute = (product: CardProduct, key: string) => {
  if (!product) return 'N/A'
  
  const value = product[key as keyof CardProduct]
  if (value === undefined || value === null) return 'N/A'
  
  // Find the formatter for this attribute
  const attribute = comparisonCategories
    .flatMap(category => category.attributes as ProductAttribute[])
    .find(attr => attr.key === key)
  
  if (attribute?.formatter && typeof attribute.formatter === 'function') {
    try {
      return attribute.formatter(value)
    } catch (_error) {
      return String(value)
    }
  }
  
  if (Array.isArray(value)) {
    return value.length > 0 ? 'Yes' : 'No'
  }
  
  return String(value)
}

const ComparePage: React.FC = () => {
  const { comparedProducts, removeProductFromCompare, clearComparedProducts } = useCompare()
  const router = useRouter()
  
  // Redirect to products page if there are no compared products
  useEffect(() => {
    if (comparedProducts.length === 0) {
      router.push('/products')
    }
  }, [comparedProducts, router])
  
  if (comparedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 mb-6">No products selected for comparison.</p>
        <Button variant="default" onClick={() => router.push('/products')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Browse Products
        </Button>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push('/products')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
        <Button 
          variant="outline" 
          className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => clearComparedProducts()}
        >
          <Trash2 className="h-4 w-4" /> Clear All
        </Button>
      </div>
      
      <ScrollArea className="w-full">
        <div className="min-w-[800px]">
          {/* Product Headers */}
          <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))] gap-4">
            <div className="p-4"></div>
            {comparedProducts.map((product, index) => (
              <div key={index} className="p-4 relative border rounded-lg bg-background">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => removeProductFromCompare(product.id?.toString() || '')}
                  aria-label="Remove product"
                >
                  <X className="h-3 w-3" />
                </Button>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 relative mb-4">
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
                  
                  <Link 
                    href={`/products/${product.slug}`}
                    className="font-medium hover:underline text-sm mb-2 line-clamp-2 h-10"
                  >
                    {product.title}
                  </Link>
                  
                  <div className="flex items-center justify-center mb-2">
                    <Rating rating={product.avgRating || 0} />
                    <span className="text-xs ml-2">
                      ({product.numReviews || 0})
                    </span>
                  </div>
                  
                  <div className="font-semibold text-lg mb-4">
                    ${(product.price || 0).toFixed(2)}
                    {product.listPrice && product.listPrice > (product.price || 0) && (
                      <span className="line-through text-gray-400 text-sm ml-2">
                        ${product.listPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <AddToCart
                    minimal
                    item={{
                      clientId: generateId(),
                      product: product.id || 0,
                      slug: String(product.slug),
                      category: product.categories && Array.isArray(product.categories) && product.categories.length > 0
                        ? (typeof product.categories[0] === 'object' && 'title' in product.categories[0]
                          ? product.categories[0].title
                          : 'Unknown')
                        : 'Unknown',
                      image:
                        product.images?.[0]?.image && typeof product.images[0]?.image !== 'number'
                          ? product.images[0].image.url || ''
                          : '',
                      countInStock: product.countInStock || 0,
                      name: product.title || '',
                      price: round2(product.price || 0),
                      quantity: 1,
                      size: product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0
                        ? (typeof product.sizes[0] === 'object' && 'title' in product.sizes[0]
                          ? product.sizes[0].title
                          : String(product.sizes[0]))
                        : '',
                      color: product.colors && Array.isArray(product.colors) && product.colors.length > 0
                        ? (typeof product.colors[0] === 'object' && 'title' in product.colors[0]
                          ? product.colors[0].title
                          : String(product.colors[0]))
                        : '',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="my-8" />
          
          {/* Comparison Categories */}
          {comparisonCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h2 className="font-semibold text-lg mb-4">{category.title}</h2>
              
              {category.attributes.map((attribute, attrIndex) => (
                <div 
                  key={attrIndex} 
                  className={`grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))] gap-4 ${
                    attrIndex % 2 === 0 ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="p-4 font-medium">{attribute.label}</div>
                  
                  {comparedProducts.map((product, productIndex) => (
                    <div key={productIndex} className="p-4">
                      {getProductAttribute(product, attribute.key)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default ComparePage 