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

  return (
    <div className="grid md:grid-cols-3 md:gap-5">
      <div className="overflow-x-auto md:col-span-2 space-y-4">
        <Card>
          <CardContent className="p-4 gap-4">
            <h2 className="text-xl pb-4">Shipping Address</h2>
            <p>
              {shippingAddress.fullName} {shippingAddress.phone}
            </p>
            <p>
              {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.province},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}{' '}
            </p>

            {isDelivered ? (
              <Badge>Delivered at {formatDateTime2(new Date(deliveredAt!)).dateTime}</Badge>
            ) : (
              <div>
                <Badge variant="destructive">Not delivered</Badge>
                <div>
                  Expected delivery at {formatDateTime2(new Date(expectedDeliveryDate!)).dateTime}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 gap-4">
            <h2 className="text-xl pb-4">Payment Method</h2>
            <p>{paymentMethod}</p>
            {isPaid ? (
              <Badge>Paid at {formatDateTime2(new Date(paidAt!)).dateTime}</Badge>
            ) : (
              <Badge variant="destructive">Not paid</Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4   gap-4">
            <h2 className="text-xl pb-4">Order Items</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link href={`/product/${item.slug}`} className="flex items-center">
                        <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="px-2">{item.quantity}</span>
                    </TableCell>
                    <TableCell className="text-right">
                       <ProductPrice price={item.price} plain />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardContent className="p-4  space-y-4 gap-4">
            <h2 className="text-xl pb-4">Order Summary</h2>
            <div className="flex justify-between">
              <div>Items</div>
              <div>
                {' '}
                <ProductPrice price={itemsPrice} plain />
              </div>
            </div>
            <div className="flex justify-between">
              <div>Tax</div>
              <div>
                {' '}
                <ProductPrice price={taxPrice} plain />
              </div>
            </div>
            <div className="flex justify-between">
              <div>Shipping</div>
              <div>
                {' '}
                <ProductPrice price={shippingPrice} plain />
              </div>
            </div>
            <div className="flex justify-between">
              <div>Total</div>
              <div>
                {' '}
                <ProductPrice price={totalPrice} plain />
              </div>
            </div>

            {!isPaid && ['Stripe', 'PayPal'].includes(paymentMethod) && (
              <Link className={cn(buttonVariants(), 'w-full')} href={`/checkout/${order.id}`}>
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
  )
}
