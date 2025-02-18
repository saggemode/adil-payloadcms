'use client'

import React from 'react'
import { cn } from '@/utilities/ui'

interface RadioButtonProps {
  label: string
  value: string
  isSelected: boolean
  onRadioChange: (value: string) => void
  groupName: string
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  value,
  isSelected,
  onRadioChange,
  groupName,
}) => {
  const handleRadioChange = () => {
    onRadioChange(value)
  }

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        checked={isSelected}
        onChange={handleRadioChange}
        name={groupName}
        className={cn(
          'h-6 w-6 rounded-full border-2 border-gray-500 bg-white appearance-none cursor-pointer outline-none',
          isSelected && 'relative bg-white',
        )}
      />
      {isSelected && (
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{ width: '12px', height: '12px' }}
        >
          <span className="block w-3 h-3 bg-gray-500 rounded-full" />
        </span>
      )}
      <span className="text-sm">{label}</span>
    </label>
  )
}
