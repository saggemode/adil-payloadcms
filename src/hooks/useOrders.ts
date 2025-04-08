'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  deliverOrder,
  deleteOrder,
  createPayPalOrder,
  approvePayPalOrder,
  revalidateOrderPaths,
} from '@/actions/orderAction'
import { Cart } from '@/types'
import { useState } from 'react'

export function useOrderById(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  })
}

export function useMyOrders({ limit, page }: { limit?: number; page: number }) {
  return useQuery({
    queryKey: ['myOrders', page],
    queryFn: () => getMyOrders({ limit, page }),
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (cart: Cart) => createOrder(cart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] })
    },
  })
}

export function useUpdateOrderToPaid() {
  const [isPending, setIsPending] = useState(false)

  const mutate = async (orderId: string) => {
    try {
      setIsPending(true)
      const result = await updateOrderToPaid(orderId)
      if (result.success) {
        await revalidateOrderPaths(orderId)
      }
      return result
    } catch (error) {
      console.error('Error updating order to paid:', error)
      return { success: false, message: 'Failed to update order' }
    } finally {
      setIsPending(false)
    }
  }

  return {
    mutate,
    isPending
  }
}

export function useDeliverOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => deliverOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['myOrders'] })
    },
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => deleteOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['myOrders'] })
    },
  })
}

export function useCreatePayPalOrder() {
  return useMutation({
    mutationFn: (orderId: string) => createPayPalOrder(orderId),
  })
}

export function useApprovePayPalOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: { orderID: string } }) =>
      approvePayPalOrder(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['myOrders'] })
    },
  })
}
