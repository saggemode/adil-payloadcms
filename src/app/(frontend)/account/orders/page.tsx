// 'use client'

// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation'

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'

// import ProductPrice from '@/components/ProductArchive/Price'
// import { useMyOrders } from '@/hooks/useOrders'
// import { formatDateTime2, formatId } from '@/utilities/generateId'
// import { Order } from '@/payload-types'
// import Paginations from '@/components/paginations'

// const PAGE_TITLE = 'Your Orders'

// export default function OrdersPage() {
//   const searchParams = useSearchParams()
//   const page = Number(searchParams?.get('page')) || 1

//   const { data: orders, isLoading } = useMyOrders({ page })

//   if (isLoading) {
//     return <div>Loading...</div>
//   }

//   return (
//     <div>
//       <div className="flex gap-2">
//         <Link href="/account">Your Account</Link>
//         <span>›</span>
//         <span>{PAGE_TITLE}</span>
//       </div>
//       <h1 className="h1-bold pt-4">{PAGE_TITLE}</h1>
//       <div className="overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Id</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Total</TableHead>
//               <TableHead>Paid</TableHead>
//               <TableHead>Delivered</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {orders?.data.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={6} className="">
//                   You have no orders.
//                 </TableCell>
//               </TableRow>
//             )}
//             {orders?.data.map((order: Order) => (
//               <TableRow key={`order-${order.id}-${order.expectedDeliveryDate_tz}`}>
//                 <TableCell>
//                   <Link href={`/account/orders/${order.id}`}>{formatId(order.id.toString())}</Link>
//                 </TableCell>
//                 <TableCell>{formatDateTime2(new Date(order.createdAt!)).dateTime}</TableCell>
//                 <TableCell>
//                   <ProductPrice price={order.totalPrice} plain />
//                 </TableCell>
//                 <TableCell>
//                   {order.isPaid && order.paidAt
//                     ? formatDateTime2(new Date(order.paidAt)).dateTime
//                     : 'No'}
//                 </TableCell>
//                 <TableCell>
//                   {order.isDelivered && order.deliveredAt
//                     ? formatDateTime2(new Date(order.deliveredAt)).dateTime
//                     : 'No'}
//                 </TableCell>
//                 <TableCell>
//                   <Link href={`/account/orders/${order.id}`}>
//                     <span className="px-2">Details</span>
//                   </Link>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         {orders?.totalPages && orders.totalPages > 1 && (
//           <Paginations page={page} totalPages={orders.totalPages} />
//         )}
//       </div>
//       {/* <BrowsingHistoryList className="mt-16" /> */}
//     </div>
//   )
// }

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

const PAGE_TITLE = 'Your Orders'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}
export default async function OrdersPage(props: { searchParams: Promise<{ page: string }> }) {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const orders = await getMyOrders({
    page,
  })
  return (
    <div>
      <div className="flex gap-2">
        <Link href="/account">Your Account</Link>
        <span>›</span>
        <span>{PAGE_TITLE}</span>
      </div>
      <h1 className="h1-bold pt-4">{PAGE_TITLE}</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="">
                  You have no orders.
                </TableCell>
              </TableRow>
            )}
            {orders.data.map((order: Order) => (
              <TableRow key={`order-${order.id}-${order.expectedDeliveryDate_tz}`}>
                <TableCell>
                  <Link href={`/account/orders/${order.id}`}>{formatId(order.id.toString())}</Link>
                </TableCell>
                <TableCell>{formatDateTime2(new Date(order.createdAt!)).dateTime}</TableCell>
                <TableCell>
                  <ProductPrice price={order.totalPrice} plain />
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime2(new Date(order.paidAt)).dateTime
                    : 'No'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime2(new Date(order.deliveredAt)).dateTime
                    : 'No'}
                </TableCell>
                <TableCell>
                  <Link href={`/account/orders/${order.id}`}>
                    <span className="px-2">Details</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && <Paginations page={page} totalPages={orders.totalPages} />}
      </div>
      {/* <BrowsingHistoryList className="mt-16" /> */}
    </div>
  )
}
