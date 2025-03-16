'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Order } from '@/payload-types'
import { formatDateTime2 } from '@/utilities/generateId'

interface OrderAddressDisplayProps {
  order: Order
  showExpectedDelivery?: boolean
}

export default function OrderAddressDisplay({
  order,
  showExpectedDelivery = true,
}: OrderAddressDisplayProps) {
  const { shippingAddress, expectedDeliveryDate } = order

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <div className="text-lg font-bold mb-2">Shipping Address</div>
            <div className="space-y-1 text-gray-600">
              <p className="font-semibold">{shippingAddress.fullName}</p>
              <p>{shippingAddress.street}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.province}, {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country}</p>
              {shippingAddress.phone && <p>Phone: {shippingAddress.phone}</p>}
            </div>
          </div>

          {showExpectedDelivery && expectedDeliveryDate && (
            <div>
              <div className="text-lg font-bold mb-2">Expected Delivery</div>
              <p className="text-gray-600">
                {formatDateTime2(new Date(expectedDeliveryDate)).dateTime}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
