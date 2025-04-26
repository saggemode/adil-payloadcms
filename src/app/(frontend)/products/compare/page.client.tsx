'use client'

import React, { useEffect, useState } from 'react'
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
const comparisonCategories: Array<{
  title: string;
  attributes: ProductAttribute[];
}> = [
  {
    title: 'Basic Info',
    attributes: [
      { key: 'price', label: 'Price', formatter: (val: unknown) => typeof val === 'number' ? `$${val.toFixed(2)}` : 'N/A' },
      { key: 'avgRating', label: 'Rating', formatter: (val: unknown) => typeof val === 'number' ? val.toFixed(1) : 'N/A' },
      { key: 'numReviews', label: 'Review Count', formatter: (val: unknown) => typeof val === 'number' ? val.toString() : '0' },
      { key: 'countInStock', label: 'Availability', formatter: (val: unknown) => typeof val === 'number' ? (val > 0 ? `In Stock (${val})` : 'Out of Stock') : 'N/A' },
    ],
  },
  {
    title: 'Product Details',
    attributes: [
      { 
        key: 'brands', 
        label: 'Brand', 
        formatter: (val: unknown) => {
          if (!Array.isArray(val)) return 'N/A'
          return val
            .filter(b => b !== null)
            .map(b => typeof b === 'object' && b && 'title' in b ? b.title : b)
            .join(', ') || 'N/A'
        }
      },
      { 
        key: 'colors', 
        label: 'Available Colors', 
        formatter: (val: unknown) => {
          if (!Array.isArray(val)) return 'N/A'
          return val
            .filter(c => c !== null)
            .map(c => typeof c === 'object' && c ? (c as ColorOrSizeObject).title : c)
            .join(', ') || 'N/A'
        }
      },
      { 
        key: 'sizes', 
        label: 'Available Sizes', 
        formatter: (val: unknown) => {
          if (!Array.isArray(val)) return 'N/A'
          return val
            .filter(s => s !== null)
            .map(s => typeof s === 'object' && s ? (s as ColorOrSizeObject).title : s)
            .join(', ') || 'N/A'
        }
      },
      { 
        key: 'categories', 
        label: 'Category', 
        formatter: (val: unknown) => {
          if (!Array.isArray(val)) return 'N/A'
          return val
            .filter(c => c !== null)
            .map(c => typeof c === 'object' && c && 'title' in c ? c.title : c)
            .join(', ') || 'N/A'
        }
      },
    ],
  },
  {
    title: 'Sales & Promotions',
    attributes: [
      { 
        key: 'listPrice', 
        label: 'Original Price', 
        formatter: (val: unknown) => typeof val === 'number' ? `$${val.toFixed(2)}` : 'N/A'
      },
      { 
        key: 'isFeatured', 
        label: 'Featured Product', 
        formatter: (val: unknown) => val === true ? 'Yes' : 'No'
      },
      {
        key: 'flashSaleDiscount',
        label: 'Flash Sale Discount',
        formatter: (val: unknown) => typeof val === 'number' ? `${val}% Off` : 'No active sale'
      }
    ]
  }
]

const getProductAttribute = (product: CardProduct, key: string) => {
  if (!product) return 'N/A'
  
  const value = product[key as keyof CardProduct]
  if (value === undefined || value === null) return 'N/A'
  
  // Find the formatter for this attribute
  const attribute = comparisonCategories
    .flatMap(category => category.attributes)
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

const getCategoryTitle = (categories: unknown) => {
  if (categories && Array.isArray(categories) && categories.length > 0) {
    return typeof categories[0] === 'object' && 'title' in categories[0]
      ? categories[0].title
      : 'Unknown'
  }
  return 'Unknown'
}

const ComparePage: React.FC = () => {
  const { comparedProducts, removeProductFromCompare, clearComparedProducts } = useCompare()
  const router = useRouter()
  const [highlightDifferences, setHighlightDifferences] = useState(false)

  useEffect(() => {
    if (comparedProducts.length === 0) {
      router.push('/products')
    }
  }, [comparedProducts, router])

  const getDifferenceHighlight = (attribute: ProductAttribute, products: CardProduct[]) => {
    if (!highlightDifferences) return ''
    
    const values = products.map(p => getProductAttribute(p, attribute.key))
    const allSame = values.every(v => v === values[0])
    
    return allSame ? '' : 'bg-yellow-50 dark:bg-yellow-900/20'
  }

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
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
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
            />
            Highlight Differences
          </label>
        </div>
      </div>
      
      <div className="w-full overflow-x-auto">
        <div className="min-w-[280px]">
          {/* Product Headers */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {comparedProducts.map((product, index) => (
              <div key={index} className="p-4 relative border rounded-lg bg-background hover:shadow-md transition-shadow duration-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeProductFromCompare(product.id?.toString() || '')}
                  aria-label="Remove product"
                >
                  <X className="h-3 w-3" />
                </Button>
                
                <div className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 relative mb-4">
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
                  
                  <div className="font-semibold text-base sm:text-lg mb-4">
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
                      category: getCategoryTitle(product.categories),
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
              <h2 className="font-semibold text-lg mb-4 text-primary">{category.title}</h2>
              
              {category.attributes.map((attribute, attrIndex) => (
                <div 
                  key={attrIndex} 
                  className={`grid grid-cols-[1fr_1fr] sm:grid-cols-[120px_1fr_1fr] gap-2 sm:gap-4 ${
                    attrIndex % 2 === 0 ? 'bg-muted/50' : ''
                  } p-2 sm:p-4`}
                >
                  <div className="hidden sm:block font-medium text-muted-foreground">
                    {attribute.label}
                  </div>
                  
                  {comparedProducts.map((product, productIndex) => (
                    <div 
                      key={productIndex} 
                      className={`p-2 sm:p-4 transition-colors duration-200 ${
                        getDifferenceHighlight(attribute, comparedProducts)
                      }`}
                    >
                      <div className="sm:hidden text-sm text-muted-foreground mb-1">
                        {attribute.label}
                      </div>
                      <div className="text-sm sm:text-base">
                        {getProductAttribute(product, attribute.key)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ComparePage