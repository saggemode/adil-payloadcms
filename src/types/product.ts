import { Product } from '@/payload-types'

export type CardProduct = Pick<
  Product,
  | 'slug'
  | 'categories'
  | 'meta'
  | 'title'
  | 'images'
  | 'listPrice'
  | 'price'
  | 'countInStock'
  | 'id'
  | 'sizes'
  | 'colors'
  | 'tags'
  | 'avgRating'
  | 'numReviews'
  | 'flashSaleDiscount'
  | 'brands'
  | 'isFeatured'
> & {
  images: Array<{ url: string }>
} 