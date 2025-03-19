import React, { useEffect, useState } from 'react'
import { Product } from '../../payload-types'
import { getSaleEndTime } from '../../utilities/flashSale'

type Props = {
  product: Product
  className?: string
}

export const FlashSaleTimer: React.FC<Props> = ({ product, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<string>('')
  const saleEndTime = getSaleEndTime(product)

  useEffect(() => {
    if (!saleEndTime) return

    const updateTimer = () => {
      const now = new Date()
      const difference = saleEndTime.getTime() - now.getTime()

      if (difference <= 0) {
        setTimeLeft('Sale ended')
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)

    return () => clearInterval(timer)
  }, [saleEndTime])

  if (!saleEndTime) return null

  return (
    <div className={`text-sm text-red-500 font-medium ${className}`}>Time left: {timeLeft}</div>
  )
}
