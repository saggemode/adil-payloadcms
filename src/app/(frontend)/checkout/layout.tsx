import { Logo } from '@/components/Logo/Logo'
import { HelpCircle } from 'lucide-react'

import Link from 'next/link'
import React from 'react'

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      <header className="bg-card mb-4 border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
        
          <Link href="/" className="flex items-center header-button font-extrabold text-2xl m-1 ">
            <Logo loading="eager" priority="high" className="invert dark:invert-0" />
          </Link>
          <div>
            <h1 className="text-3xl">Checkout</h1>
          </div>
          <div>
            <Link href="/page/help">
              <HelpCircle className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
