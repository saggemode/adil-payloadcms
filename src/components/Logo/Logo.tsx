'use client'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/providers/Theme'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props
  const { theme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<string>('dark')

  useEffect(() => {
    // Set initial theme from data-theme attribute
    const dataTheme = document.documentElement.getAttribute('data-theme')
    if (dataTheme) {
      setCurrentTheme(dataTheme)
    }

    // Update theme when it changes
    if (theme) {
      setCurrentTheme(theme)
    }
  }, [theme])

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'
  
  const logoUrl = currentTheme === 'dark' 
    ? "https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg"
    : "https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-dark.svg"

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Payload Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src={logoUrl}
    />
  )
}
