
import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { Input as UIInput } from '@/components/ui/input'

type Props = {
  name: string
  label: string
  register: UseFormRegister<FieldValues & any>
  required?: boolean
  error: any
  type?: 'text' | 'number' | 'password' | 'email'
  validate?: (value: string) => boolean | string
  disabled?: boolean
}

export const Input: React.FC<Props> = ({
  name,
  label,
  required,
  register,
  error,
  type = 'text',
  validate,
  disabled,
}) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500">&nbsp;*</span>}
      </label>
      <UIInput
        id={name}
        type={type}
        className={`w-full h-12 px-4 text-base rounded-lg
          ${error ? 'border-red-500 bg-red-100' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-400' : ''}
        `}
        {...register(name, {
          required,
          validate,
          ...(type === 'email'
            ? {
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email',
                },
              }
            : {}),
        })}
        disabled={disabled}
      />
      {error && (
        <div className="mt-1 text-sm text-red-600">
          {!error?.message && error?.type === 'required'
            ? 'This field is required'
            : error?.message}
        </div>
      )}
    </div>
  )
}
