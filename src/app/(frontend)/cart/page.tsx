'use client'
import ProductPrice from '@/components/ProductArchive/Price'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useCartStore from '@/hooks/use-cart-store'
import { APP_NAME, FREE_SHIPPING_MIN_PRICE } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  BookmarkPlus, 
  Truck, 
  PackageCheck, 
  ShoppingBag 
} from 'lucide-react'

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [saveForLaterItems, setSaveForLaterItems] = useState<any[]>([])
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore()
  const router = useRouter()

  const handleProceedToCheckout = () => {
    setIsLoading(true)
    router.push('/checkout')
  }

  const handleSaveForLater = (item: any) => {
    setSaveForLaterItems(prev => [...prev, item])
    removeItem(item)
  }

  const handleMoveToCart = (item: any, index: number) => {
    updateItem(item, 1)
    setSaveForLaterItems(prev => prev.filter((_, i) => i !== index))
  }

  // Estimated delivery date (3-5 business days from now)
  const getEstimatedDeliveryDate = () => {
    const now = new Date()
    const deliveryDate = new Date(now)
    deliveryDate.setDate(now.getDate() + 3) // Minimum 3 days
    const maxDeliveryDate = new Date(now)
    maxDeliveryDate.setDate(now.getDate() + 5) // Maximum 5 days
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    
    return `${formatDate(deliveryDate)} - ${formatDate(maxDeliveryDate)}`
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {items.length === 0 ? (
          <div className="col-span-full">
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50 border-b pb-8">
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="bg-primary/10 p-6 rounded-full">
                    <ShoppingCart size={64} className="text-primary/70" />
                  </div>
                  <h2 className="text-2xl font-semibold text-center">Your cart is empty</h2>
                  <p className="text-muted-foreground text-center max-w-md">
                    Looks like you haven&apos;t added anything to your cart yet. Browse our collection and discover amazing products!
                  </p>
                  <Button className="mt-4" size="lg" onClick={() => router.push('/')}>
                    Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              {saveForLaterItems.length > 0 && (
                <CardContent className="pt-6">
                  <h3 className="text-xl font-medium mb-4">Saved for later ({saveForLaterItems.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {saveForLaterItems.map((item, index) => (
                      <Card key={`saved-${index}`} className="overflow-hidden">
                        <CardContent className="p-3 space-y-3">
                          <div className="flex gap-3">
                            <div className="relative w-20 h-20 bg-muted/30 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="80px"
                                style={{ objectFit: 'contain' }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium truncate">{item.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                <ProductPrice price={item.price} plain />
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleMoveToCart(item, index)}
                          >
                            Move to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        ) : (
          <>
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="border-b pb-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                    </h2>
                    <p className="text-sm text-muted-foreground hidden md:block">Price</p>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {items.map((item) => (
                    <div
                      key={item.clientId}
                      className="border-b last:border-0"
                    >
                      <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4">
                        <Link href={`/products/${item.slug}`} prefetch={true} className="relative w-full md:w-24 h-24 md:h-24 flex-shrink-0 mx-auto md:mx-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 96px"
                            className="object-contain"
                          />
                        </Link>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col md:flex-row md:justify-between gap-2">
                            <Link
                              prefetch={true}
                              href={`/products/${item.slug}`}
                              className="text-lg font-medium hover:underline"
                            >
                              {item.name}
                            </Link>
                            <div className="md:text-right">
                              <p className="font-medium text-base md:text-lg">
                                <ProductPrice price={item.price * item.quantity} plain />
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-muted-foreground">
                                  {item.quantity} × <ProductPrice price={item.price} plain />
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {(item.color || item.size) && (
                            <div className="flex flex-wrap gap-2">
                              {item.color && (
                                <Badge variant="outline" className="text-xs">
                                  Color: {item.color}
                                </Badge>
                              )}
                              {item.size && (
                                <Badge variant="outline" className="text-xs">
                                  Size: {item.size}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center flex-wrap gap-2 mt-2">
                            <Select
                              value={item.quantity.toString()}
                              onValueChange={(value: any) => updateItem(item, Number(value))}
                            >
                              <SelectTrigger className="w-[110px] h-9">
                                <SelectValue>Qty: {item.quantity}</SelectValue>
                              </SelectTrigger>
                              <SelectContent position="popper">
                                {Array.from({
                                  length: Math.min(item.countInStock, 10),
                                }).map((_, i) => (
                                  <SelectItem key={i + 1} value={`${i + 1}`}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <div className="flex gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleSaveForLater(item)}
                                      className="h-9 w-9"
                                    >
                                      <BookmarkPlus size={18} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Save for later</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => removeItem(item)}
                                      className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 size={18} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Remove from cart</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          
                          {item.countInStock <= 5 && (
                            <p className="text-xs text-amber-600 mt-1">
                              Only {item.countInStock} left in stock - order soon
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between py-4">
                  <Button variant="outline" onClick={() => router.push('/')}>
                    Continue Shopping
                  </Button>
                  <div className="text-right">
                    <p className="text-lg">
                      Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'}):{' '}
                      <span className="font-bold">
                        <ProductPrice price={itemsPrice} plain />
                      </span>
                    </p>
                  </div>
                </CardFooter>
              </Card>
              
              {saveForLaterItems.length > 0 && (
                <Card>
                  <CardHeader className="border-b pb-3">
                    <h2 className="text-lg font-semibold">
                      Saved for later ({saveForLaterItems.length})
                    </h2>
                  </CardHeader>
                  <CardContent className="p-0 divide-y">
                    {saveForLaterItems.map((item, index) => (
                      <div key={`saved-${index}`} className="p-4 md:p-6 flex gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <h3 className="text-base font-medium">{item.name}</h3>
                            <p className="text-base font-medium">
                              <ProductPrice price={item.price} plain />
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMoveToCart(item, index)}
                            >
                              Move to Cart
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setSaveForLaterItems(prev => prev.filter((_, i) => i !== index))}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="col-span-1 space-y-6">
              <Card>
                <CardHeader className="pb-3 border-b">
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span><ProductPrice price={itemsPrice} plain /></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">
                      {itemsPrice >= FREE_SHIPPING_MIN_PRICE ? 'FREE' : 'Calculated at checkout'}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Estimated Total</span>
                    <span><ProductPrice price={itemsPrice} plain /></span>
                  </div>
                  
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full mt-4"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Skeleton className="h-4 w-4 rounded-full mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
                <CardFooter className="flex-col gap-3 border-t pt-4 pb-6">
                  {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                    <Alert variant="default" className="bg-muted/40 border">
                      <div className="flex gap-2 items-center">
                        <Truck className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-sm">
                          Add{' '}
                          <span className="font-semibold text-primary">
                            <ProductPrice price={FREE_SHIPPING_MIN_PRICE - itemsPrice} plain />
                          </span>{' '}
                          more to qualify for FREE shipping
                        </AlertDescription>
                      </div>
                    </Alert>
                  ) : (
                    <Alert variant="default" className="bg-green-50 border-green-200">
                      <div className="flex gap-2 items-center">
                        <PackageCheck className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-sm text-green-700">
                          Your order qualifies for FREE shipping!
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Truck size={16} />
                    <span>Estimated delivery: {getEstimatedDeliveryDate()}</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
