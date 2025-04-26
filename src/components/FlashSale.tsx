'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useFlashSaleProducts } from '@/hooks/useProducts';

// Define Product interface
interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  images?: Array<{
    image: any;
  }>;
}

export const FlashSaleSection = () => {
  const { data, isLoading } = useFlashSaleProducts();
  const products = data?.docs || [] as Product[];
  
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer when it hits zero
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time digits with leading zero
  const formatTime = (time: number) => time.toString().padStart(2, '0');

  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Generate random discount percentages
  const discounts = [47, 32, 60, 71, 52];
  const ratings = [941, 102, 1126, 224, 29];

  return (
    <div className="w-full">
      {/* Flash Sale Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg p-4 text-white">
        <div className="flex flex-col sm:flex-row items-center mb-4 md:mb-0">
          <div className="flex items-center mb-2 sm:mb-0">
            <span className="text-2xl mr-2">⚡</span>
            <h2 className="text-xl sm:text-2xl font-bold">FLASH SALE</h2>
          </div>
          <div className="ml-0 sm:ml-4 flex items-center">
            <span className="text-sm mr-2">Ends in:</span>
            <div className="flex space-x-1">
              <div className="bg-white text-red-600 rounded px-2 py-1 font-mono font-bold">
                {formatTime(timeLeft.hours)}
              </div>
              <span className="text-white">:</span>
              <div className="bg-white text-red-600 rounded px-2 py-1 font-mono font-bold">
                {formatTime(timeLeft.minutes)}
              </div>
              <span className="text-white">:</span>
              <div className="bg-white text-red-600 rounded px-2 py-1 font-mono font-bold">
                {formatTime(timeLeft.seconds)}
              </div>
            </div>
          </div>
        </div>
        <Link href="/flash-sale">
          <Button variant="secondary" size="sm" className="mt-2 md:mt-0">
            View All
          </Button>
        </Link>
      </div>

      {/* Flash Sale Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.length > 0 ? (
          products.slice(0, 5).map((product: Product, index: number) => {
            const originalPrice = (product.price * 1.5).toFixed(2);
            const discount = discounts[index % discounts.length];
            const soldCount = Math.floor(Math.random() * 8000) + 1000;
            
            return (
              <Link
                href={`/products/${product.slug}`}
                key={product.id}
                className="group"
              >
                <Card className="border border-gray-200 overflow-hidden h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-3 relative">
                    {/* Discount Badge */}
                    <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{discount}%
                    </div>
                    
                    {/* Product Image */}
                    <div className="relative w-full aspect-square overflow-hidden rounded-md mb-2">
                      {product.images?.[0]?.image ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={typeof product.images[0].image === 'object' && product.images[0].image?.url ? product.images[0].image.url : ''}
                            alt={product.title || 'Product image'}
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
                    
                    {/* Price and Discount */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center flex-wrap">
                          <span className="text-lg text-orange-500 font-bold">₦{product.price?.toFixed(2)}</span>
                          <span className="ml-1 text-xs text-gray-400 line-through">₦{originalPrice}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sold count and rating */}
                    <div className="flex items-center mt-1 space-x-1 flex-wrap">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">{soldCount}+ sold</span>
                      </div>
                      <div className="flex items-center">
                        {Array(5).fill(0).map((_, i) => (
                          <svg key={i} className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-xs text-gray-500">{ratings[index % ratings.length]}</span>
                      </div>
                    </div>
                    
                    {/* Countdown timer */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="bg-gray-100 p-1 rounded text-xs">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                          <span className="font-mono text-gray-700">{String(index).padStart(2, '0')}:{String((index * 5) % 60).padStart(2, '0')}:{String((index * 10) % 60).padStart(2, '0')}</span>
                        </div>
                      </div>
                      <span className="text-xs text-white bg-orange-500 px-1.5 py-0.5 rounded">Hot</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No flash sale products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}; 