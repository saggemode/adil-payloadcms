'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Order } from '@/payload-types'
import ProductPrice from '@/components/ProductArchive/Price'

interface OrderSummaryProps {
  order: Order
  children?: React.ReactNode
}

export default function OrderSummary({ order, children }: OrderSummaryProps) {
  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = order

  return (
    <Card>
      <CardContent className="p-4">
        <div>
          <div className="text-lg font-bold mb-4">Order Summary</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items:</span>
              <span>
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping & Handling:</span>
              <span>
                {shippingPrice === undefined ? (
                  '--'
                ) : shippingPrice === 0 ? (
                  'FREE'
                ) : (
                  <ProductPrice price={shippingPrice} plain />
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{taxPrice === undefined ? '--' : <ProductPrice price={taxPrice} plain />}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold text-lg">
              <span>Order Total:</span>
              <span>
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>
          </div>

          {children && <div className="mt-4">{children}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
