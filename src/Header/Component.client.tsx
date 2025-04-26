'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import { cn } from '@/utilities/ui'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import Menu from './menu'
import Hdata from './data'
import Search from './search'
import Sidebar from './sidebar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'

interface HeaderClientProps {
  data: Header
  categories: { id: string; title: string }[]
  className?: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, categories, className }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const { notifications } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className={cn("relative z-20", className)} {...(theme ? { 'data-theme': theme } : {})}>
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center header-button font-extrabold text-2xl m-1 ">
              <Logo loading="eager" priority="high" />
            </Link>
          </div>
          <div className="hidden md:block flex-1 max-w-xl">
            <Search categories={categories} />
          </div>
          <div className="flex items-center gap-2">
         
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
            <Menu />
          </div>
        </div>
        <div className="md:hidden block py-2">
          <Search categories={categories} />
        </div>
      </div>

      <div className="flex items-center px-3 mb-[1px] bg-gray-800 text-white">
        <Sidebar categories={categories} />
        <div className="flex items-center flex-wrap gap-3 overflow-hidden max-h-[42px]">
          {Hdata.headerMenus.map((menu) => (
            <Link href={menu.href} key={menu.href} className="header-button !p-2 hover:text-primary">
              <span>{menu.name}</span>
            </Link>
          ))}
        </div>
        <HeaderNav data={data} />
      </div>

      {showNotifications && <NotificationCenter />}
    </header>
  )
}