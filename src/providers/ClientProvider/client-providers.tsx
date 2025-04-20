'use client'
import React, { useEffect } from 'react'
import useCartSidebar from '@/hooks/use-cart-sidebar'
import useCartStore from '@/hooks/use-cart-store'

import { Toaster } from '@/components/ui/toaster'
import CartSidebar from '@/components/cart-sidebar'

// Cart store hydration component
const CartStoreInitializer: React.FC = () => {
  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])
  
  return null
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const isCartSidebarOpen = useCartSidebar()

  return (
    <>
      <CartStoreInitializer />
      {isCartSidebarOpen ? (
        <div className="flex min-h-screen">
          <div className="flex-1 overflow-hidden">{children}</div>
          <CartSidebar />
        </div>
      ) : (
        <div>{children}</div>
      )}
      <Toaster />
    </>
  )
}
