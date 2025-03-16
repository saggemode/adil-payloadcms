'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/payload-types'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface FlashSaleProductsProps {
  sale: {
    id: number
    name: string
    startDate: string
    endDate: string
    discountPercentage: number
    products: Product[]
    totalQuantity: number
    soldQuantity: number
  }
}

export default function FlashSaleProducts({ sale }: FlashSaleProductsProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const [progress, setProgress] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const start = new Date(sale.startDate).getTime()
      const end = new Date(sale.endDate).getTime()

      if (now < start) {
        const distance = start - now
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`Starts in ${days}d ${hours}h ${minutes}m`)
        setIsActive(false)
      } else if (now > end) {
        setTimeLeft('Sale Ended')
        setIsActive(false)
      } else {
        const distance = end - now
        const hours = Math.floor(distance / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        setTimeLeft(`Ends in ${hours}h ${minutes}m ${seconds}s`)
        setIsActive(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [sale.startDate, sale.endDate])

  useEffect(() => {
    setProgress((sale.soldQuantity / sale.totalQuantity) * 100)
  }, [sale.soldQuantity, sale.totalQuantity])

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{sale.name}</h2>
            <div className="text-lg font-semibold text-red-500">{sale.discountPercentage}% OFF</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{timeLeft}</div>
            <div className="text-sm text-muted-foreground">
              {isActive ? 'Hurry up!' : 'Stay tuned!'}
            </div>
          </div>
          <div className="w-full md:w-64 space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="text-sm text-center">
              {sale.soldQuantity} / {sale.totalQuantity} sold
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sale.products.slice(0, 4).map((product) => (
          <div key={product.id} className="space-y-2">
            {/* <img
              src={product.images?.[0]?.url}
              alt={product.name}
              className="w-full h-32 object-cover rounded"
            /> */}
            <div className="text-sm font-medium">{product.title}</div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold">
                ₦{product.price * (1 - sale.discountPercentage / 100)}
              </span>
              <span className="text-sm line-through text-muted-foreground">₦{product.price}</span>
            </div>
          </div>
        ))}
      </div>

      {!isActive && (
        <div className="text-center p-8">
          <div className="text-xl font-semibold text-muted-foreground">
            {new Date(sale.startDate) > new Date()
              ? 'This sale has not started yet'
              : 'This sale has ended'}
          </div>
        </div>
      )}
    </div>
  )
}
