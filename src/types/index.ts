import {
  CartSchema,
  OrderInputSchema,
  OrderItemSchema,
  ShippingAddressSchema,
  ReviewInputSchema,
} from '@/types/validator'
import { z } from 'zod'
import { LucideIcon } from 'lucide-react'
import { Category, Color, Media, Size, Brand, Tag } from '@/payload-types'

export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>
export type IOrderInput = z.infer<typeof OrderInputSchema>

export type IReviewInput = z.infer<typeof ReviewInputSchema>


export type IReviewDetails = {
  id: string
  product: string
  user: {
    name: string
  }
  isVerifiedPurchase: boolean
  rating: number
  title: string
  comment: string
  updatedAt: string
  createdAt: string
}

export type MenuItem = {
  name: string
  href: string
  icon?: LucideIcon
  description?: string
  children?: MenuItem[]
}

export type Data = {
  headerMenus: MenuItem[]
}

export type Product = {
  id: number
  name: string
  // other fields...
}

export type OrderItems = {
  product: number | Product
  clientId: string
  name: string
  slug: string
  category: string
  quantity: number
  countInStock: number
  image: string
  price: number
  size?: string
  color?: string
}

export type Order = {
  sizes: string[]
  id: string
  createdAt: Date
  updatedAt: Date
  items: OrderItems[]
  // other fields...
}

export interface CardProduct {
  id: string | number
  title: string
  slug?: string | null
  price: number
  listPrice?: number
  images?: Array<{
    image?: number | Media | null
    id?: string | null
  }> | null
  category?: {
    name: string
  }
  categories?: number | Category | null
  avgRating?: number
  numReviews?: number
  countInStock?: number
  sizes?: (number | Size)[] | null
  colors?: (number | Color)[] | null
  brands?: number | Brand | null
  isFeatured?: boolean | null
  flashSaleDiscount?: number | null
  tags?: number | Tag | null
  meta?: Record<string, unknown>
}