'use client'

import { cn } from '@/utilities/ui'
import { useEffect, useState } from 'react'


interface PasswordStrengthIndicatorProps {
  password: string
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const [strength, setStrength] = useState(0)

  useEffect(() => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    setStrength(score)
  }, [password])

  const getStrengthColor = (index: number) => {
    if (strength === 0) return 'bg-gray-200'
    if (index < strength) {
      switch (strength) {
        case 1:
          return 'bg-red-500'
        case 2:
          return 'bg-orange-500'
        case 3:
          return 'bg-yellow-500'
        case 4:
          return 'bg-blue-500'
        case 5:
          return 'bg-green-500'
        default:
          return 'bg-gray-200'
      }
    }
    return 'bg-gray-200'
  }

  const getStrengthText = () => {
    switch (strength) {
      case 0:
        return 'Very Weak'
      case 1:
        return 'Weak'
      case 2:
        return 'Fair'
      case 3:
        return 'Good'
      case 4:
        return 'Strong'
      case 5:
        return 'Very Strong'
      default:
        return ''
    }
  }

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 w-full rounded-full transition-colors',
              getStrengthColor(index)
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password Strength: {getStrengthText()}
      </p>
    </div>
  )
} 