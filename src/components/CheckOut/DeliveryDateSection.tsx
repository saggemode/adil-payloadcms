'use client'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { AVAILABLE_DELIVERY_DATES } from '@/constants'
import { formatDateTime2, calculateFutureDate } from '@/utilities/generateId'
import ProductPrice from '@/components/ProductArchive/Price'

interface DeliveryDateFormProps {
  deliveryDateIndex: number | undefined
  onDeliveryDateChange: (value: string) => void
  itemsPrice: number
}

export const DeliveryDateForm = ({
  deliveryDateIndex,
  onDeliveryDateChange,
  itemsPrice,
}: DeliveryDateFormProps) => {
  return (
    <Card className="md:ml-8">
      <CardContent className="p-4">
        <div className="font-bold">
          <p className="mb-2">Choose a shipping speed:</p>
          <ul>
            <RadioGroup
              value={AVAILABLE_DELIVERY_DATES[deliveryDateIndex ?? 0]?.name ?? ''}
              onValueChange={onDeliveryDateChange}
            >
              {AVAILABLE_DELIVERY_DATES.map((dd) => (
                <div key={dd.name} className="flex">
                  <RadioGroupItem value={dd.name} id={`address-${dd.name}`} />
                  <Label className="pl-2 space-y-2 cursor-pointer" htmlFor={`address-${dd.name}`}>
                    <div className="text-green-700 font-semibold">
                      {formatDateTime2(calculateFutureDate(dd.daysToDeliver)).dateOnly}
                    </div>
                    <div>
                      {(dd.freeShippingMinPrice > 0 && itemsPrice >= dd.freeShippingMinPrice
                        ? 0
                        : dd.shippingPrice) === 0 ? (
                        'FREE Shipping'
                      ) : (
                        <ProductPrice price={dd.shippingPrice} plain />
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
