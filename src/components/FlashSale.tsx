'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useFlashSaleProducts } from '@/hooks/useProducts';
import Rating from '@/components/ProductArchive/rating';
import { ChevronRight, Zap } from 'lucide-react';

// Use a more flexible Product type to accommodate both the original
// Payload type and our enriched version
type Product = any;

export const FlashSaleSection = () => {
  const { data, isLoading } = useFlashSaleProducts();
  const products = data?.docs || [] as Product[];
  
  console.log('FlashSaleSection rendered, products:', products.length, products);
  
  // Group products by flash sale name
  const flashSalesMap = React.useMemo(() => {
    const map = new Map<string, {
      name: string,
      endDate: string,
      products: Product[]
    }>();
    
    products.forEach(product => {
      console.log('Processing product for grouping:', product.id, product.title, 'flashSale:', product.flashSale);
      if (!product.flashSale) return;
      
      const saleName = product.flashSale.flashSaleName || 'Flash Sale';
      
      if (!map.has(saleName)) {
        map.set(saleName, {
          name: saleName,
          endDate: product.flashSale.endDate,
          products: [product]
        });
      } else {
        map.get(saleName)?.products.push(product);
      }
    });
    
    console.log('Flash sales map created:', map.size, 'sales');
    return map;
  }, [products]);
  
  // Extract all products from all flash sales
  const allFlashSaleProducts = React.useMemo(() => {
    let allProducts: Product[] = [];
    flashSalesMap.forEach(sale => {
      allProducts = [...allProducts, ...sale.products];
    });
    return allProducts;
  }, [flashSalesMap]);
  
  // Get the first flash sale for the banner (if any exist)
  const firstFlashSale = React.useMemo(() => {
    const salesArray = Array.from(flashSalesMap.values());
    return salesArray.length > 0 ? salesArray[0] : null;
  }, [flashSalesMap]);

  // Format time digits with leading zero
  const formatTime = (time: number) => time.toString().padStart(2, '0');

  // State for timer animation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });
  
  // Update timer every second
  useEffect(() => {
    if (!firstFlashSale) return;
    
    const updateTimer = () => {
      if (firstFlashSale?.endDate) {
        const newTimeLeft = calculateTimeLeft(firstFlashSale.endDate);
        setTimeLeft(newTimeLeft);
      }
    };
    
    // Initial update
    updateTimer();
    
    // Set interval for updates
    const timerInterval = setInterval(updateTimer, 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(timerInterval);
  }, [firstFlashSale]);

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

  // If there are no flash sale products, don't render anything
  if (products.length === 0) {
    return null;
  }

  // Calculate original price and discount percentage for display
  const calculateOriginalPrice = (product: Product): string => {
    if (!product.flashSale) return product.price.toFixed(2);
    
    if (product.flashSale.discountType === 'percentage') {
      return (product.price / (1 - product.flashSale.discountAmount / 100)).toFixed(2);
    } else {
      return (product.price + product.flashSale.discountAmount).toFixed(2);
    }
  };
  
  const getDiscountPercentage = (product: Product) => {
    if (!product.flashSale) return 0;
    
    if (product.flashSale.discountType === 'percentage') {
      return Math.round(product.flashSale.discountAmount);
    } else {
      const originalPrice = parseFloat(calculateOriginalPrice(product));
      return Math.round((product.flashSale.discountAmount / originalPrice) * 100);
    }
  };

  // Use a ref to store the end date to prevent rerendering
  const calculateTimeLeft = (endDateStr: string) => {
    const endDate = new Date(endDateStr);
    const difference = endDate.getTime() - Date.now();
    
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  // Timer component with animation
  const AnimatedTimer = ({ endDate }: { endDate?: string }) => {
    const [timerValue, setTimerValue] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [timerKey, setTimerKey] = useState(0); // For animation reset
    
    useEffect(() => {
      if (!endDate) return;
      
      const updateTimer = () => {
        const newTime = calculateTimeLeft(endDate);
        setTimerValue(newTime);
        setTimerKey(prev => prev + 1); // Change key to trigger animation
      };
      
      // Initial call
      updateTimer();
      
      // Update every second
      const interval = setInterval(updateTimer, 1000);
      
      return () => clearInterval(interval);
    }, [endDate]);
    
    return (
      <div className="bg-gray-100 p-1 rounded text-xs">
        <div className="flex items-center">
          <span className="text-gray-500 mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span className="font-mono text-gray-700">
            <span key={`h-${timerKey}`} className="inline-block transition-all duration-500 ease-in-out">{formatTime(timerValue.hours)}</span>:
            <span key={`m-${timerKey}`} className="inline-block transition-all duration-500 ease-in-out">{formatTime(timerValue.minutes)}</span>:
            <span key={`s-${timerKey}`} className="inline-block transition-all duration-500 ease-in-out animate-pulse">{formatTime(timerValue.seconds)}</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {firstFlashSale && (
        <div className="mb-6">
          {/* Flash Sale Header - With Animated Timer */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg p-4 text-white">
            <div className="flex flex-col md:flex-row md:items-center mb-3 md:mb-0">
              <div className="flex items-center">
                <Zap className="h-6 w-6 mr-2" />
                <h2 className="text-xl sm:text-2xl font-bold">{firstFlashSale.name.toUpperCase()}</h2>
              </div>
              <div className="mt-2 md:mt-0 md:ml-4 bg-white/20 rounded-lg px-3 py-1 text-sm">
                Ends in: {formatTime(timeLeft.hours)}h {formatTime(timeLeft.minutes)}m {formatTime(timeLeft.seconds)}s
              </div>
            </div>
            <Link href="/flash-sale" className="inline-flex items-center">
              <Button variant="secondary" size="sm" className="group">
                View All Flash Sales
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* All Flash Sale Products in a grid - Show max 10 products on homepage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {allFlashSaleProducts.slice(0, 10).map((product: Product) => {
              const originalPrice = calculateOriginalPrice(product);
              const discount = getDiscountPercentage(product);
              const soldCount = product.flashSale?.soldQuantity || 
                (product.id 
                  ? (parseInt(String(product.id)) % 8000) + 1000 // Generate a deterministic number based on product ID
                  : 5000);
              const totalQuantity = product.flashSale?.totalQuantity || 10000;
              const soldPercentage = Math.min(100, Math.round((soldCount / totalQuantity) * 100));
              
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
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Title (truncated) */}
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">
                        {product.title || 'Flash Sale Product'}
                      </h3>
                      
                      {/* Star Rating */}
                      <div className="flex items-center">
                        <Rating rating={product.avgRating || 0} size={4} />
                        <span className="ml-1 text-xs text-gray-500">({product.numReviews || 0})</span>
                      </div>
                      
                      {/* Price and Discount */}
                      <div className="flex items-start justify-between mt-1">
                        <div className="flex flex-col">
                          <div className="flex items-center flex-wrap">
                            <span className="text-lg text-red-600 font-bold">₦{product.price?.toFixed(2)}</span>
                            <span className="ml-1 text-xs text-gray-400 line-through">₦{String(originalPrice)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Sold count and progress bar */}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{soldCount} sold</span>
                          <span>{totalQuantity - soldCount} left</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{ width: `${soldPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Animated Countdown timer */}
                      <div className="mt-2 flex items-center justify-between">
                        <AnimatedTimer endDate={product.flashSale?.endDate} />
                        <span className="text-xs text-white bg-orange-500 px-1.5 py-0.5 rounded">Hot</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          
          {/* "View All" Button for Mobile - Only shown if there are more than 10 products */}
          {allFlashSaleProducts.length > 10 && (
            <div className="mt-6 text-center md:hidden">
              <Link href="/flash-sale">
                <Button variant="outline" className="w-full">
                  View All {allFlashSaleProducts.length} Flash Sale Products
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 