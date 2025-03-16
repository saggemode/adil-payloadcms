'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { calculateFlashSalePrice } from '@/actions/flashSaleAction'
import { Timer } from 'lucide-react'
import { formatPrice } from '@/utilities/formatPrice'

interface FlashSaleProps {
  name: string
  endDate: string
  discountPercent: number
  originalPrice: number
}

export default function FlashSale({
  name,
  endDate,
  discountPercent,
  originalPrice,
}: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number
    minutes: number
    seconds: number
  }>({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  const salePrice = calculateFlashSalePrice(originalPrice, discountPercent)

  return (
    <Card className="bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-red-600 dark:text-red-400">{name}</CardTitle>
          <Badge variant="destructive" className="uppercase">
            Flash Sale
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium">Ends in:</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-red-600 dark:text-red-400">
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ₦{formatPrice(originalPrice)}
              </p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                ₦{formatPrice(discountPercent)}
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
            >
              {discountPercent}% OFF
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
