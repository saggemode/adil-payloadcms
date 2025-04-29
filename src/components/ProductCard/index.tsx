'use client'
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import Rating from '@/components/ProductArchive/rating';
import { Product } from '@/payload-types';

import { formatPrice } from '@/utilities/formatPrice';
//import { calculateDiscountedPrice } from '@/utilities/calculateDiscountedPrice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
//import { AddToCartButton } from '@/components/AddToCartButton';
import { generateId, round2 } from '@/utilities/generateId';
import CompareButton from '@/components/ProductArchive/compare-button';
import AddToCart from '../ProductArchive/add-to-cart';

type ProductCardProps = {
  product: Product;
  showCategories?: boolean;
  hideAddToCart?: boolean;
  className?: string;
};

export const ProductCard = ({ 
  product, 
  showCategories = false, 
  hideAddToCart = false,
  className = '' 
}: ProductCardProps) => {
  // Extract necessary product data
  const {
    id,
    slug,
    categories,
    title,
    images,
    listPrice,
    price,
    countInStock,
    avgRating = 0,
    numReviews = 0,
    flashSaleDiscount = 0
  } = product || {};
  
  // Calculate original and discounted prices
  const hasDiscount = !!flashSaleDiscount || (listPrice && price && price < listPrice);
  const discountAmount = flashSaleDiscount ? flashSaleDiscount : listPrice && price ? Math.round(((listPrice - price) / listPrice) * 100) : 0;
  const originalPrice = flashSaleDiscount ? (price / (1 - flashSaleDiscount / 100)).toFixed(2) : listPrice ? listPrice.toFixed(2) : price?.toFixed(2);
  
  // Get category information
  const getCategoryTitle = (categories: any) => {
    if (Array.isArray(categories)) {
      return categories.length > 0 && typeof categories[0] === 'object' ? categories[0].title : 'Uncategorized';
    }
    if (typeof categories === 'object' && categories?.title) {
      return categories.title;
    }
    return 'Uncategorized';
  };
  
  // Generate href
  const href = `/products/${slug}`;
  
  return (
    <Link
      href={href}
      key={id}
      className={`group ${className}`}
    >
      <Card className="border border-gray-200 overflow-hidden h-full hover:shadow-md transition-shadow">
        <CardContent className="p-3 relative">
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountAmount}%
            </div>
          )}
          
          {/* Stock Status */}
          {countInStock === 0 && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="font-semibold px-3 py-1 bg-red-600/80 rounded-full text-white">Out of Stock</span>
            </div>
          )}
          
          {/* Product Image */}
          <div className="relative w-full aspect-square overflow-hidden rounded-md mb-2">
            {images?.[0]?.image ? (
              <div className="relative w-full h-full">
                <Image
                  src={typeof images[0].image === 'object' && images[0].image?.url ? images[0].image.url : ''}
                  alt={title || 'Product image'}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          
          {/* Product Title (truncated) */}
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 min-h-[40px]">
            {title || 'Product'}
          </h3>
          
          {/* Category (if showCategories is true) */}
          {showCategories && categories && (
            <div className="text-xs text-gray-500 mb-1">
              {getCategoryTitle(categories)}
            </div>
          )}
          
          {/* Star Rating */}
          <div className="flex items-center mb-2">
            <Rating rating={avgRating} size={4} />
            <span className="ml-1 text-xs text-gray-500">({numReviews})</span>
          </div>
          
          {/* Price and Discount */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center flex-wrap">
                <span className="text-lg text-orange-500 font-bold">₦{price?.toFixed(2)}</span>
                {hasDiscount && (
                  <span className="ml-1 text-xs text-gray-400 line-through">₦{originalPrice}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          {!hideAddToCart && countInStock > 0 && (
            <div className="mt-3">
              <div 
                onClick={(e) => e.preventDefault()}
                className="z-20 relative"
              >
                <AddToCart
                  item={{
                    clientId: generateId(),
                    product: Number(id) || 0,
                    slug: String(slug),
                    category: getCategoryTitle(categories),
                    image: typeof images?.[0]?.image === 'object' && images[0]?.image !== null ? images[0].image.url || '' : '',
                    countInStock: countInStock || 0,
                    name: title || '',
                    price: round2(price || 0),
                    quantity: 1,
                    size: '',
                    color: ''
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 flex items-center justify-center">
            <div className="bg-white px-3 py-1.5 rounded-full text-sm font-medium text-gray-800 shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Quick View
            </div>
          </div>
          
          {/* Wishlist & Compare Buttons */}
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
            <CompareButton product={{
              id,
              slug,
              title,
              price,
              listPrice,
              images,
              countInStock,
              categories,
              avgRating: avgRating || 0,
              numReviews: numReviews || 0,
              flashSaleDiscount: flashSaleDiscount || 0
            }} />
          </div>
          
          {/* Add to Cart Button */}
          <div className="absolute inset-0 z-10">
            <div className="absolute top-0 right-0 p-3 flex flex-col gap-2">
              <AddToCart
                item={{
                  clientId: generateId(),
                  product: Number(id) || 0,
                  slug: String(slug),
                  category: getCategoryTitle(categories),
                  image: typeof images?.[0]?.image === 'object' && images[0]?.image !== null ? images[0].image.url || '' : '',
                  countInStock: countInStock || 0,
                  name: title || '',
                  price: round2(price || 0),
                  quantity: 1,
                  size: '',
                  color: ''
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}; 