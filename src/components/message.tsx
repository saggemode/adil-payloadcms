import React from 'react'

export const Message: React.FC<{
  message?: React.ReactNode
  error?: React.ReactNode
  success?: React.ReactNode
  warning?: React.ReactNode
  className?: string
}> = ({ message, error, success, warning, className }) => {
  const messageToRender = message || error || success || warning

  if (messageToRender) {
    const baseClasses = 'p-2 w-full text-sm'
    const errorClasses = 'bg-red-500 text-red-900 dark:text-red-100'
    const successClasses = 'bg-green-500 text-green-900 dark:text-green-100'
    const warningClasses = 'bg-yellow-500 text-yellow-900 dark:text-yellow-100'
    const defaultClasses = 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100'

    const conditionalClasses = error
      ? errorClasses
      : success
        ? successClasses
        : warning
          ? warningClasses
          : defaultClasses

    return (
      <div className={`${baseClasses} ${conditionalClasses} ${className || ''}`}>
        {messageToRender}
      </div>
    )
  }

  return null
}
