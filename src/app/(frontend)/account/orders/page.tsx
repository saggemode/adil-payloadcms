import { Metadata } from 'next'
import Link from 'next/link'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import ProductPrice from '@/components/ProductArchive/Price'
import { getMyOrders } from '@/actions/orderAction'
import { formatDateTime2, formatId } from '@/utilities/generateId'
import { Order } from '@/payload-types'
import Paginations from '@/components/paginations'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'
import { Inbox, PackageCheck, Calendar, CreditCard } from 'lucide-react'
import BrowsingHistoryList from '@/heros/ProductHero/components/browsing-history-list'

const PAGE_TITLE = 'Your Orders'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

// Helper function to get badge variant based on status
const getOrderStatusBadge = (isPaid: boolean, isDelivered: boolean) => {
  if (isDelivered) {
    return { variant: 'default', label: 'Delivered', icon: <PackageCheck className="h-3 w-3 mr-1" /> }
  } else if (isPaid) {
    return { variant: 'secondary', label: 'Processing', icon: <Calendar className="h-3 w-3 mr-1" /> }
  } else {
    return { variant: 'outline', label: 'Pending Payment', icon: <CreditCard className="h-3 w-3 mr-1" /> }
  }
}

export default async function OrdersPage(props: { searchParams: Promise<{ page: string }> }) {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const orders = await getMyOrders({
    page,
  })
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/account" className="hover:underline hover:text-primary transition-colors">Your Account</Link>
          <span>›</span>
          <span className="text-foreground font-medium">{PAGE_TITLE}</span>
        </div>
        <h1 className="h1-bold">{PAGE_TITLE}</h1>
      </div>
      
      {orders.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-4">When you place orders, they will appear here</p>
          <Link 
            href="/shop" 
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.map((order: Order) => {
                  const statusBadge = getOrderStatusBadge(!!order.isPaid, !!order.isDelivered)
                  
                  return (
                    <TableRow key={`order-${order.id}-${order.expectedDeliveryDate_tz}`} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <Link href={`/account/orders/${order.id}`} className="text-primary hover:underline">
                          {formatId(order.id.toString())}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDateTime2(new Date(order.createdAt!)).dateTime}
                      </TableCell>
                      <TableCell className="font-medium">
                        <ProductPrice price={order.totalPrice} plain />
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusBadge.variant as any} 
                          className={cn(
                            "flex items-center",
                            !order.isPaid && !order.isDelivered && "bg-orange-100 text-orange-800 hover:bg-orange-100",
                            order.isPaid && !order.isDelivered && "bg-blue-100 text-blue-800 hover:bg-blue-100",
                            order.isDelivered && "bg-green-100 text-green-800 hover:bg-green-100"
                          )}
                        >
                          {statusBadge.icon} {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link 
                          href={`/account/orders/${order.id}`}
                          className="text-primary hover:underline inline-flex items-center"
                        >
                          View Details
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      
      {orders.totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Paginations page={page} totalPages={orders.totalPages} />
        </div>
      )}

<BrowsingHistoryList className='mt-16' />
    </div>
  )
}
