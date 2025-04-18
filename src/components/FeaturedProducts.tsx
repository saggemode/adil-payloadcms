'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/payload-types'
import WishlistButton from '@/components/ProductArchive/wishlist-button'
import ProductPrice from '@/components/ProductArchive/Price'
import CompareButton from '@/components/ProductArchive/compare-button'
import AddToCart from '@/components/ProductArchive/add-to-cart'
import { generateId, round2 } from '@/utilities/generateId'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { QrCode } from 'lucide-react'

interface FeaturedProductsProps {
  products: Product[]
}

const WishlistButtonWrapper = ({ productId }: { productId: string }) => (
  <div className="absolute top-3 right-3 z-10" onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}>
    <WishlistButton productId={productId} />
  </div>
)

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {products.map((product) => {
        const productUrl = `/products/${product.slug}`;
        const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${productUrl}` : productUrl;
        
        const getCategoryTitle = (categories: any) => {
          if (Array.isArray(categories)) {
            return categories.length > 0 && categories[0].title ? categories[0].title : 'Unknown Category'
          }
          if (typeof categories === 'object' && categories?.title) {
            return categories.title
          }
          return 'Unknown Category'
        }
        
        // Get first color if available
        const getFirstColor = () => {
          if (!product.colors || !Array.isArray(product.colors) || product.colors.length === 0) {
            return '';
          }
          
          const firstColor = product.colors[0];
          if (typeof firstColor === 'object' && 'title' in firstColor) {
            return firstColor.title;
          }
          return '';
        }
        
        // Get first size if available
        const getFirstSize = () => {
          if (!product.sizes || !Array.isArray(product.sizes) || product.sizes.length === 0) {
            return '';
          }
          
          const firstSize = product.sizes[0];
          if (typeof firstSize === 'object' && 'title' in firstSize) {
            return firstSize.title;
          }
          return '';
        }
        
        const selectedColor = getFirstColor();
        const selectedSize = getFirstSize();
        
        return (
        <div key={product.id} className="relative group">
          <div className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full border border-gray-100">
            <Link href={productUrl} className="block">
              <div className="aspect-square relative overflow-hidden rounded-t-2xl">
                {product.images?.[0]?.image && (
                  <Image
                    src={
                      typeof product.images[0].image === 'string'
                        ? product.images[0].image
                        : typeof product.images[0].image === 'object' &&
                            'url' in product.images[0].image
                          ? product.images[0].image.url || ''
                          : ''
                    }
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}
                <WishlistButtonWrapper productId={product.id?.toString() || ''} />
                
                {product.countInStock === 0 && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-t-2xl">
                    <span className="font-semibold px-3 py-1 bg-red-600/80 rounded-full ">Out of Stock</span>
                  </div>
                )}
                
                {product.listPrice && product.price < product.listPrice && (
                  <div className="absolute top-3 left-3 bg-red-600 text-xs font-bold px-3 py-1 rounded-full ">
                    {Math.round(((product.listPrice - product.price) / product.listPrice) * 100)}% OFF
                  </div>
                )}
                
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="font-medium px-4 py-2 rounded-full text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Quick View
                  </span>
                </div>
              </div>
            </Link>
            
            <div className="p-5 rounded-b-2xl">
              <Link href={productUrl}>
                <h3 className="text-base font-medium mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>
              </Link>
              <div className="rounded-xl overflow-hidden mb-4">
                <ProductPrice 
                  price={product.price} 
                  listPrice={product.listPrice} 
                  forListing={true}
                  className="text-lg font-bold"
                  isDeal={product.listPrice ? product.price < product.listPrice : false}
                />
              </div>
              
              <div className="flex items-center gap-2 w-full mt-4">
                <AddToCart
                  minimal
                  item={{
                    clientId: generateId(),
                    product: product.id ?? 0,
                    slug: String(product.slug),
                    category: getCategoryTitle(product.categories),
                    image:
                      product.images?.[0]?.image && typeof product.images[0]?.image !== 'number'
                        ? typeof product.images[0].image === 'string'
                          ? product.images[0].image
                          : product.images[0].image.url || ''
                        : '',
                    countInStock: product.countInStock ?? 0,
                    name: product.title ?? '',
                    price: round2(product.price ?? 0),
                    quantity: 1,
                    size: selectedSize,
                    color: selectedColor,
                  }}
                />
                <CompareButton product={product} />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Scan to view product</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 p-4">
                      <QRCodeSVG value={fullUrl} size={200} />
                      <p className="text-sm text-gray-500 text-center">
                        Scan this QR code to view {product.title} on your mobile device
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      )})}
    </div>
  )
}

export default FeaturedProducts
