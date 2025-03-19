'use client'

import React from 'react'

export function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = React.useState('')

  React.useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const end = new Date(endDate)
      const distance = end.getTime() - now.getTime()

      if (distance < 0) {
        setTimeLeft('Ended')
        return
      }

      const hours = Math.floor(distance / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [endDate])

  return <span className="font-mono">{timeLeft}</span>
}
