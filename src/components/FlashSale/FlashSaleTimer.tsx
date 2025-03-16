'use client'

import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'

interface FlashSaleTimerProps {
  startDate: string
  endDate: string
  onStatusChange?: (status: 'upcoming' | 'active' | 'ended') => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function FlashSaleTimer({ startDate, endDate, onStatusChange }: FlashSaleTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [status, setStatus] = useState<'upcoming' | 'active' | 'ended'>('upcoming')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const start = new Date(startDate).getTime()
      const end = new Date(endDate).getTime()

      let difference: number
      let newStatus: 'upcoming' | 'active' | 'ended'

      if (now < start) {
        difference = start - now
        newStatus = 'upcoming'
      } else if (now > end) {
        difference = 0
        newStatus = 'ended'
      } else {
        difference = end - now
        newStatus = 'active'
      }

      if (newStatus !== status) {
        setStatus(newStatus)
        onStatusChange?.(newStatus)
      }

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [startDate, endDate, status, onStatusChange])

  if (status === 'ended') {
    return <div className="text-gray-500">Sale Ended</div>
  }

  return (
    <div className="flex items-center gap-2">
      <Timer className="h-4 w-4" />
      <div className="flex items-center gap-1 text-sm font-medium">
        {status === 'upcoming' ? (
          <>
            <span>Starts in: </span>
            {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
          </>
        ) : (
          <span>Ends in: </span>
        )}
        <span className="font-mono">
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
