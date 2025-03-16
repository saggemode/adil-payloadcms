'use client'

import { Card, CardContent } from '@/components/ui/card'

import { Product,  Category } from '@/payload-types'
import { useSearchParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import ProductPrice from '@/components/ProductArchive/Price'
import SelectVariant from '@/components/ProductArchive/select-variant'
import BreadcrumbProduct from './components/BreadcrumbProduct'
import PhotoSection from './components/PhotoSection'
import AddToCart from '@/components/ProductArchive/add-to-cart'
import AddToBrowsingHistory from './components/add-to-browsing-history'
import BrowsingHistoryList from './components/browsing-history-list'
import { generateId, round2 } from '@/utilities/generateId'
import RichText from '@/components/RichText'
import RatingSummary from '@/components/ProductArchive/rating-summary'
import { useAuth } from '@/providers/Auth'
import ReviewList from '@/components/ProductArchive/review-list'


export const ProductHero: React.FC<{ product: Product }> = ({ product }) => {
  const { id, categories, images, title } = product
 
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

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <AddToBrowsingHistory id={String(id)} category={getCategoryTitle(categories)} />
        <BreadcrumbProduct title={product?.title ?? 'product'} />
        <section>
          <div className="grid grid-cols-1 md:grid-cols-5  ">
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

            <div className="flex w-full flex-col gap-2 md:p-5 col-span-2">
              <div className="flex flex-col gap-3">
                <p className="p-medium-16 rounded-full bg-grey-500/10   text-grey-500">
                  <span>brand</span>
                </p>
                <h1 className="font-bold text-lg lg:text-xl">
                  <span>{getCategoryTitle(categories)}</span>
                </h1>

                <h1 className="font-bold text-lg lg:text-xl">{title}</h1>
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
                      isDeal={
                        (Array.isArray(product.tags) && product.tags.includes('todays-deal')) ||
                        (typeof product.tags === 'string' && product.tags === 'todays-deal')
                      }
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
              <Card>
                <CardContent className="p-4 flex flex-col  gap-4">
                  <ProductPrice price={product.price} />
                  {product.countInStock > 0 && product.countInStock <= 3 && (
                    <div className="text-destructive font-bold">
                      {`Only ${product.countInStock} left in stock - order soon`}
                    </div>
                  )}
                  {product.countInStock !== 0 ? (
                    <div className="text-green-700 text-xl">In Stock</div>
                  ) : (
                    <div className="text-destructive text-xl">Out of Stock</div>
                  )}
                  {product.countInStock !== 0 && (
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

                          countInStock: product.countInStock,
                          name: product.title,
                          price: round2(product.price),
                          quantity: 1,

                          size: selectedSize,
                          color: selectedColor,
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="h2-bold mb-2" id="reviews">
            Customer Reviews
          </h2>
          <ReviewList product={product} userId={user?.id } />
        </section>

        <section className="mt-10">
          {/* <ProductSlider
            products={relatedProducts}
            title={`Best Sellers in ${getCategoryTitle(categories)}`}
          /> */}
        </section>
        <section>
          <BrowsingHistoryList className="mt-10" />
        </section>
      </div>
    </main>
  )
}
