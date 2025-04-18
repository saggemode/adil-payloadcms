import type { Metadata } from 'next'
import React from 'react'
import ComparePage from './page.client'
import BreadcrumbProduct from '@/heros/ProductHero/components/BreadcrumbProduct'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Compare Products',
  description: 'Compare product features, specifications, and prices side by side.',
}

export default function Page() {
  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0 pt-8">
        <Separator />
        <BreadcrumbProduct title="Compare Products" />
        <div className="w-full">
          <h1 className="font-bold text-2xl md:text-[32px] dark:text-white mb-8">
            Compare Products
          </h1>
          <ComparePage />
        </div>
      </div>
    </main>
  )
} 