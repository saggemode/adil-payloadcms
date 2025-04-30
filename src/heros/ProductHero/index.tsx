'use client'

import { Card, CardContent } from '@/components/ui/card'
import { QRCodeSVG } from 'qrcode.react'
import { Product, Category } from '@/payload-types'
import { useSearchParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import ProductPrice from '@/components/ProductArchive/Price'
import SelectVariant from '@/components/ProductArchive/select-variant'
import BreadcrumbProduct from './components/BreadcrumbProduct'
import PhotoSection from './components/PhotoSection'
import AddToCart from '@/components/ProductArchive/add-to-cart'
import { generateId, round2 } from '@/utilities/generateId'
import RichText from '@/components/RichText'
import RatingSummary from '@/components/ProductArchive/rating-summary'
import { useAuth } from '@/providers/Auth'
import ReviewList from '@/components/ProductArchive/review-list'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useStockNotifications } from '@/hooks/useStockNotifications'
import { Share2, Clock, ShoppingCart, AlertTriangle } from 'lucide-react'


export const ProductHero: React.FC<{ product: Product }> = ({ product }) => {
  const { id, categories, images, title } = product
  const [fullUrl, setFullUrl] = useState('')
  const [stockLevel, setStockLevel] = useState(product.countInStock)
  
  useEffect(() => {
    setFullUrl(window.location.href)
  }, [])

  // Set up stock notifications for this product
  useStockNotifications();

  const { user } = useAuth()

  const searchParams = useSearchParams()
  const selectedColor =
    searchParams?.get('color') ||
    (typeof product.colors?.[0] === 'object' && 'title' in product.colors[0]
      ? product.colors[0].title
      : '')
  const selectedSize =
    searchParams?.get('size') ||
    (typeof product.sizes?.[0] === 'object' && 'title' in product.sizes[0]
      ? product.sizes[0].title
      : '')

  const getCategoryTitle = (categories: number | Category | null | undefined) => {
    if (Array.isArray(categories)) {
      return categories.length > 0 ? categories[0].title : 'Unknown Category'
    }
    if (typeof categories === 'object' && categories?.title) {
      return categories.title
    }
    return 'Unknown Category'
  }

  // Get stock level indicator
  const getStockLevelIndicator = () => {
    if (stockLevel <= 0) {
      return { color: 'bg-red-500', width: '0%', text: 'Out of Stock', status: 'destructive' }
    } else if (stockLevel <= 3) {
      return { color: 'bg-red-500', width: '15%', text: `Only ${stockLevel} left!`, status: 'destructive' }
    } else if (stockLevel <= 10) {
      return { color: 'bg-yellow-500', width: '40%', text: 'Low Stock', status: 'warning' }
    } else if (stockLevel <= 25) {
      return { color: 'bg-green-400', width: '70%', text: 'In Stock', status: 'default' }
    } else {
      return { color: 'bg-green-600', width: '100%', text: 'In Stock', status: 'default' }
    }
  }

  const stockIndicator = getStockLevelIndicator();

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={product?.title ?? 'product'} />
        <section>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8">
            <div className="col-span-2">
              <PhotoSection
                images={
                  images?.map((item) => {
                    if (!item.image) {
                      return '' // Handles null or undefined cases
                    }
                    if (typeof item.image === 'string') {
                      return item.image
                    }
                    if (typeof item.image === 'object' && 'url' in item.image && item.image.url) {
                      return item.image.url
                    }
                    return ''
                  }) || []
                }
              />
            </div>

            <div className="flex w-full flex-col gap-3 md:p-5 col-span-2">
              <div className="flex flex-col gap-3">
                {product.brands && (
                  <Badge variant="outline" className="w-fit px-3 py-1 text-sm bg-gray-50">
                    {typeof product.brands === 'object' && 'title' in product.brands ? product.brands.title : ''}
                  </Badge>
                )}
                <div className="flex items-center justify-between">
                  <h1 className="font-bold text-xl lg:text-2xl">{title}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <RatingSummary
                    avgRating={product.avgRating}
                    numReviews={product.numReviews}
                    asPopover
                    ratingDistribution={(product.ratingDistribution ?? []).map(
                      ({ rating, count }) => ({ rating, count }),
                    )}
                  />
                </div>
                <Separator />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex gap-3">
                    <ProductPrice
                      price={product.price}
                      listPrice={product.listPrice}
                      forListing={false}
                    />
                  </div>
                </div>
              </div>

              <div>
                <SelectVariant
                  product={product}
                  size={
                    typeof product.sizes?.[0] === 'object'
                      ? (product.sizes[0]?.title ?? '')
                      : String(product.sizes?.[0] ?? '')
                  }
                  color={
                    typeof product.colors?.[0] === 'object'
                      ? (product.colors[0]?.title ?? '')
                      : String(product.colors?.[0] ?? '')
                  }
                />
              </div>
              
              {/* Stock level indicator */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Stock Level</span>
                  <Badge variant={stockIndicator.status as any}>
                    {stockIndicator.text}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${stockIndicator.color} h-2 rounded-full transition-all duration-500`} style={{ width: stockIndicator.width }}></div>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex flex-col gap-2">
                <p className="p-bold-20 text-grey-600">Description:</p>

                <div className="p-medium-16 lg:p-regular-18">
                  <RichText
                    className="max-w-[48rem] mx-auto"
                    data={product.content}
                    enableGutter={false}
                  />
                </div>
              </div>
            </div>
            <div>
              <Card className="sticky top-4">
                <CardContent className="p-4 flex flex-col gap-4">
                  <ProductPrice price={product.price} />
                  
                  {/* Enhanced stock status display */}
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {stockLevel > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${stockLevel <= 3 ? 'bg-red-500' : 'bg-green-600'}`}></div>
                          <span className={`font-semibold ${stockLevel <= 3 ? 'text-red-600' : 'text-green-700'}`}>
                            {stockLevel <= 3 ? `Only ${stockLevel} left in stock` : 'In Stock'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="font-semibold text-red-600">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    {stockLevel > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4" /> 
                            <span>Order within 3 hours</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>For delivery by {new Date(Date.now() + 2*24*60*60*1000).toLocaleDateString()}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  {stockLevel > 0 && (
                    <div className="flex justify-center items-center">
                      <AddToCart
                        item={{
                          clientId: generateId(),
                          product: product.id,
                          slug: String(product.slug),
                          category: getCategoryTitle(categories),
                          image:
                            product.images?.[0]?.image &&
                            typeof product.images[0]?.image !== 'number'
                              ? product.images[0].image.url || ''
                              : '',
                          countInStock: stockLevel,
                          name: product.title,
                          price: round2(product.price),
                          quantity: 1,
                          size: selectedSize,
                          color: selectedColor,
                        }}
                      />
                    </div>
                  )}

                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Share2 className="h-5 w-5 text-gray-600" />
                      <h3 className="font-semibold">Share Product</h3>
                    </div>
                    <div className="flex justify-center mt-2">
                      <QRCodeSVG value={fullUrl} size={180} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="h2-bold mb-2" id="reviews">
            Customer Reviews
          </h2>
          <ReviewList product={product} userId={user?.id} />
        </section>
      </div>
    </main>
  )
}
