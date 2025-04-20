'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useUpdateOrderToPaid } from '@/hooks/useOrders'
import { toast } from '@/components/ui/use-toast'

import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { buttonVariants } from '@/components/ui/button'
import { deliverOrder, updateOrderToPaid, revalidateOrderPaths } from '@/actions/orderAction'
import ProductPrice from '@/components/ProductArchive/Price'
import ActionButton from './action-button'
import { Order } from '@/payload-types'
import { formatDateTime2 } from '@/utilities/generateId'
import { cn } from '@/utilities/ui'
import { Badge } from '@/components/ui/badge'
import { Truck, CreditCard, Calendar, CheckCircle, Clock, MapPin, Phone } from 'lucide-react'

export default function OrderDetailsForm({
  order,
  isAdmin,
}: {
  order: Order
  isAdmin: boolean
}) {
  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    expectedDeliveryDate,
  } = order

  const handleMarkAsPaid = async () => {
    try {
      const result = await updateOrderToPaid(order.id.toString())
      if (result.success) {
        // Revalidate the paths after the action is complete
        await revalidateOrderPaths(order.id.toString())
        toast({
          title: 'Success',
          description: 'Order marked as paid successfully',
        })
        return { success: true, message: 'Order marked as paid successfully' }
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to update order status',
          variant: 'destructive',
        })
        return { success: false, message: result.message || 'Failed to update order status' }
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      })
      return { success: false, message: 'Failed to update order status' }
    }
  }

  // Helper function to get order status step
  const getOrderStatusStep = () => {
    if (isDelivered) return 3;
    if (isPaid) return 2;
    return 1;
  }

  const statusStep = getOrderStatusStep();

  return (
    <div className="space-y-6">
      {/* Order Status Tracker */}
      <Card>
        <CardContent className="p-4 py-6">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-bold">Order Status</h2>
            
            <div className="relative flex items-center justify-between">
              {/* Status Line */}
              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-gray-200"></div>
              <div 
                className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-primary transition-all" 
                style={{ width: `${(statusStep / 3) * 100}%` }}
              ></div>
              
              {/* Status Steps */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-white",
                  statusStep >= 1 && "bg-primary text-white"
                )}>
                  {statusStep > 1 ? <CheckCircle className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                </div>
                <span className="mt-2 text-center text-xs font-medium">Order Placed</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-white",
                  statusStep >= 2 && "bg-primary text-white"
                )}>
                  {statusStep > 2 ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <span className="mt-2 text-center text-xs font-medium">Processing</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-white",
                  statusStep >= 3 && "bg-primary text-white"
                )}>
                  <Truck className="h-5 w-5" />
                </div>
                <span className="mt-2 text-center text-xs font-medium">Delivered</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-bold">Shipping Address</h2>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{shippingAddress.fullName}</p>
                  {shippingAddress.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-3 w-3 mr-1" />
                      {shippingAddress.phone}
                    </div>
                  )}
                </div>
                
                <p className="text-muted-foreground">
                  {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.province},{' '}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>

                <div className="pt-2">
                  {isDelivered ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" /> Delivered at {formatDateTime2(new Date(deliveredAt!)).dateTime}
                    </Badge>
                  ) : (
                    <div className="space-y-2">
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                        <Clock className="h-3 w-3 mr-1" /> Not delivered yet
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Expected: {formatDateTime2(new Date(expectedDeliveryDate!)).dateTime}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>
              
              <div className="space-y-4">
                <p className="font-medium">{paymentMethod}</p>
                
                {isPaid ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="h-3 w-3 mr-1" /> Paid at {formatDateTime2(new Date(paidAt!)).dateTime}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                    <Clock className="h-3 w-3 mr-1" /> Not paid yet
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items?.map((item) => (
                      <TableRow key={item.slug} className="hover:bg-muted/50">
                        <TableCell>
                          <Link href={`/product/${item.slug}`} className="flex items-center hover:text-primary">
                            <div className="relative w-12 h-12 rounded overflow-hidden mr-3 border">
                              <Image 
                                src={item.image} 
                                alt={item.name} 
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50px"
                              />
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{item.quantity}</span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <ProductPrice price={item.price} plain />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardContent className="p-6 space-y-5">
              <h2 className="text-xl font-bold">Order Summary</h2>
              
              <div className="space-y-3 divide-y">
                <div className="flex justify-between py-1">
                  <div className="text-muted-foreground">Items</div>
                  <div className="font-medium">
                    <ProductPrice price={itemsPrice} plain />
                  </div>
                </div>
                
                <div className="flex justify-between py-2">
                  <div className="text-muted-foreground">Tax</div>
                  <div className="font-medium">
                    <ProductPrice price={taxPrice} plain />
                  </div>
                </div>
                
                <div className="flex justify-between py-2">
                  <div className="text-muted-foreground">Shipping</div>
                  <div className="font-medium">
                    <ProductPrice price={shippingPrice} plain />
                  </div>
                </div>
                
                <div className="flex justify-between py-3">
                  <div className="font-bold">Total</div>
                  <div className="font-bold text-lg">
                    <ProductPrice price={totalPrice} plain />
                  </div>
                </div>
              </div>

              {!isPaid && ['Stripe', 'PayPal'].includes(paymentMethod) && (
                <Link 
                  className={cn(
                    buttonVariants(), 
                    'w-full mt-4'
                  )} 
                  href={`/checkout/${order.id}`}
                >
                  Pay Order
                </Link>
              )}

              {isAdmin && !isPaid && paymentMethod === 'Cash On Delivery' && (
                <ActionButton
                  caption="Mark as paid"
                  action={handleMarkAsPaid}
                />
              )}
              
              {isAdmin && isPaid && !isDelivered && (
                <ActionButton
                  caption="Mark as delivered"
                  action={async () => {
                    try {
                      const result = await deliverOrder(order.id.toString())
                      if (result.success) {
                        toast({
                          title: 'Success',
                          description: 'Order marked as delivered successfully',
                        })
                      } else {
                        toast({
                          title: 'Error',
                          description: result.message || 'Failed to update order status',
                          variant: 'destructive',
                        })
                      }
                      return result
                    } catch (error) {
                      console.error('Error updating order status:', error)
                      toast({
                        title: 'Error',
                        description: 'Failed to update order status',
                        variant: 'destructive',
                      })
                      return { success: false, message: 'Failed to update order status' }
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
