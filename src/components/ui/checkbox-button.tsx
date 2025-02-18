import React, { ChangeEvent, useState } from 'react'

interface CheckboxProps {
  label: string
  value: string
  isSelected: boolean
  onClickHandler: (value: string) => void
}

export const CheckboxButton: React.FC<CheckboxProps> = ({ label, value, isSelected, onClickHandler }) => {
  const [isChecked, setIsChecked] = useState(isSelected)

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
    onClickHandler(value)
  }

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="w-5 h-5 rounded-md border-2 border-gray-600 bg-white appearance-none checked:bg-gray-600 checked:text-white checked:relative checked:flex checked:items-center checked:justify-center focus:outline-none"
      />
      <span className="text-gray-800">{label}</span>
    </label>
  )
}
