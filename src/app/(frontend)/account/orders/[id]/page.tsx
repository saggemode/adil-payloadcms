import { notFound } from 'next/navigation'
import React from 'react'

import { getMeUser } from '@/utilities/getMeUser'
import { getOrderById } from '@/actions/orderAction'
import Link from 'next/link'
import { formatId } from '@/utilities/generateId'
import OrderDetailsForm from '../_components/order-details-form'
import { ArrowLeft } from 'lucide-react'

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params

  return {
    title: `Order ${formatId(params.id)}`,
  }
}

export default async function OrderDetailsPage(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const { user } = await getMeUser()

  // Check if the user has the 'admin' role
  const isAdmin = user?.roles?.includes('admin') || false

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/account" className="hover:underline hover:text-primary transition-colors">Your Account</Link>
          <span>›</span>
          <Link href="/account/orders" className="hover:underline hover:text-primary transition-colors">Your Orders</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Order {formatId(order.id.toString())}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="h1-bold">Order {formatId(order.id.toString())}</h1>
          <Link 
            href="/account/orders" 
            className="flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to orders
          </Link>
        </div>
      </div>
      
      <OrderDetailsForm
        order={order}
        isAdmin={isAdmin}
      />
    </div>
  )
}
