import { notFound } from 'next/navigation'
import React from 'react'

import { getMeUser } from '@/utilities/getMeUser'
import { getOrderById } from '@/actions/orderAction'
import Link from 'next/link'
import { formatId } from '@/utilities/generateId'
import OrderDetailsForm from '../_components/order-details-form'


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
    <>
      <div className="flex gap-2">
        <Link href="/account">Your Account</Link>
        <span>›</span>
        <Link href="/account/orders">Your Orders</Link>
        <span>›</span>
        <span>Order {formatId(order.id.toString())}</span>
      </div>
      <h1 className="h1-bold py-4">Order {formatId(order.id.toString())}</h1>
      <OrderDetailsForm
        order={order}
        isAdmin={isAdmin} // Pass the correct isAdmin value
      />
    </>
  )
}
